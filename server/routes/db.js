import { Router } from 'express';
import { getDb, ObjectId } from '../mongo.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

const TENANT_TABLES = new Set([
  'customers', 'products', 'invoices', 'invoice_items',
  'settings', 'stock_history', 'payments',
]);

const ID_FIELDS = new Set([
  'id', 'user_id', 'customer_id', 'product_id', 'invoice_id',
]);

function isHexId(v) {
  return typeof v === 'string' && /^[a-f0-9]{24}$/i.test(v);
}

function toOid(v) {
  if (v instanceof ObjectId) return v;
  if (isHexId(v)) return new ObjectId(v);
  return v;
}

/** Convert a field name used by the client to the Mongo field name. */
function mongoField(col) {
  return col === 'id' ? '_id' : col;
}

/** Coerce a value for a given field if it represents an ObjectId. */
function coerceValue(col, val) {
  if (!ID_FIELDS.has(col)) return val;
  if (Array.isArray(val)) return val.map((v) => (isHexId(v) ? toOid(v) : v));
  return isHexId(val) ? toOid(val) : val;
}

/** Coerce all id-like fields in a payload to ObjectId. */
function coercePayload(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'id') continue; // never write id; Mongo manages _id
    if (ID_FIELDS.has(k) && isHexId(v)) out[k] = toOid(v);
    else out[k] = v;
  }
  return out;
}

/** Translate the client-side filter list into a Mongo filter document. */
function buildFilter(filters) {
  const q = {};
  for (const f of filters) {
    const [op, col, val] = f;
    const field = mongoField(col);
    const v = coerceValue(col, val);
    switch (op) {
      case 'eq':  q[field] = v; break;
      case 'neq': q[field] = { $ne: v }; break;
      case 'gt':  q[field] = { ...(q[field] || {}), $gt: v }; break;
      case 'gte': q[field] = { ...(q[field] || {}), $gte: v }; break;
      case 'lt':  q[field] = { ...(q[field] || {}), $lt: v }; break;
      case 'lte': q[field] = { ...(q[field] || {}), $lte: v }; break;
      case 'like': {
        const re = String(v).replace(/%/g, '.*').replace(/_/g, '.');
        q[field] = { $regex: `^${re}$` }; break;
      }
      case 'ilike': {
        const re = String(v).replace(/%/g, '.*').replace(/_/g, '.');
        q[field] = { $regex: `^${re}$`, $options: 'i' }; break;
      }
      case 'in': q[field] = { $in: Array.isArray(v) ? v : [v] }; break;
      default: throw new Error(`Unsupported filter: ${op}`);
    }
  }
  return q;
}

/** Convert a Mongo doc to the client shape: _id -> id (string), ObjectIds -> strings. */
function out(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  if (Array.isArray(doc)) return doc.map(out);
  const o = {};
  for (const [k, v] of Object.entries(doc)) {
    if (k === '_id') {
      o.id = v instanceof ObjectId ? v.toHexString() : String(v);
    } else if (v instanceof ObjectId) {
      o[k] = v.toHexString();
    } else if (Array.isArray(v)) {
      o[k] = v.map(out);
    } else {
      o[k] = v;
    }
  }
  return o;
}

/** Parse a select string like "*, invoice_items(*)" -> { fields:['*'], joins:[{table:'invoice_items',cols:'*'}] } */
function parseSelect(select) {
  if (!select) return { fields: ['*'], joins: [] };
  const joins = [];
  // Strip nested "table(cols)" entries first
  let rest = select.replace(/(\w+)\(([^)]*)\)/g, (_m, table, cols) => {
    joins.push({ table, cols });
    return '';
  });
  const fields = rest.split(',').map((s) => s.trim()).filter(Boolean);
  return { fields: fields.length ? fields : ['*'], joins };
}

/** Project only the requested fields. '*' = all. id is always kept. */
function projectFields(doc, fields) {
  if (!doc || fields.includes('*')) return doc;
  const o = { id: doc.id };
  for (const f of fields) o[f] = doc[f];
  return o;
}

/** For a parent table name, guess the FK column used by a child table. */
function fkFor(parentTable) {
  // invoices -> invoice_id
  const singular = parentTable.endsWith('s') ? parentTable.slice(0, -1) : parentTable;
  return `${singular}_id`;
}

async function hydrateJoins(db, parentTable, rows, joins) {
  if (!joins.length || !rows.length) return rows;
  const ids = rows.map((r) => r.id ? new ObjectId(r.id) : null).filter(Boolean);
  for (const j of joins) {
    const fk = fkFor(parentTable);
    const children = await db.collection(j.table).find({ [fk]: { $in: ids } }).toArray();
    const grouped = new Map();
    for (const c of children) {
      const key = c[fk] instanceof ObjectId ? c[fk].toHexString() : String(c[fk]);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(out(c));
    }
    for (const row of rows) {
      row[j.table] = grouped.get(row.id) || [];
    }
  }
  return rows;
}

r.post('/', requireAuth, async (req, res) => {
  try {
    const {
      table,
      action = 'select',
      select,
      payload,
      filters = [],
      modifiers = {},
      single = false,
      maybeSingle = false,
      count,
      head = false,
    } = req.body || {};

    if (!table) return res.status(400).json({ error: 'table required' });

    const db = await getDb();
    const col = db.collection(table);
    const userId = req.user.id;

    // Stamp user_id on writes for tenant tables (skip invoice_items - scoped via parent)
    const stamp = (row) => {
      const c = coercePayload(row || {});
      if (TENANT_TABLES.has(table) && table !== 'invoice_items') {
        c.user_id = new ObjectId(userId);
      }
      return c;
    };

    if (action === 'select') {
      // Tenant scoping (same logic as the original)
      const hasUserIdFilter = filters.some((f) => f[0] === 'eq' && f[1] === 'user_id');
      const effFilters = [...filters];
      if (TENANT_TABLES.has(table) && !hasUserIdFilter && table !== 'invoice_items') {
        effFilters.push(['eq', 'user_id', userId]);
      }
      const q = buildFilter(effFilters);

      if (head && count) {
        const cnt = await col.countDocuments(q);
        return res.json({ data: null, count: cnt });
      }

      let cursor = col.find(q);
      if (modifiers.order) {
        const [c, opts] = modifiers.order;
        const dir = (opts && opts.ascending === false) ? -1 : 1;
        cursor = cursor.sort({ [mongoField(c)]: dir });
      }
      if (typeof modifiers.limit === 'number') cursor = cursor.limit(modifiers.limit);
      if (modifiers.range) cursor = cursor.skip(modifiers.range.from).limit(modifiers.range.to - modifiers.range.from + 1);

      let docs = (await cursor.toArray()).map(out);
      const { fields, joins } = parseSelect(select);
      if (joins.length) docs = await hydrateJoins(db, table, docs, joins);
      if (!fields.includes('*')) docs = docs.map((d) => projectFields(d, fields));

      const cnt = count ? await col.countDocuments(q) : null;

      if (single) {
        if (docs.length !== 1) return res.status(400).json({ error: 'No rows / multiple rows' });
        return res.json({ data: docs[0], count: cnt });
      }
      if (maybeSingle) return res.json({ data: docs[0] || null, count: cnt });
      return res.json({ data: docs, count: cnt });
    }

    if (action === 'insert' || action === 'upsert') {
      const arr = Array.isArray(payload) ? payload.map(stamp) : [stamp(payload)];
      const now = new Date();
      for (const d of arr) {
        if (!d.created_at) d.created_at = now;
        if (!d.updated_at) d.updated_at = now;
      }
      if (action === 'upsert') {
        for (const d of arr) {
          const _id = d.id ? toOid(d.id) : new ObjectId();
          delete d.id;
          await col.updateOne({ _id }, { $set: d }, { upsert: true });
        }
      } else {
        const ins = await col.insertMany(arr);
        // attach _id back for returning
        Object.values(ins.insertedIds).forEach((id, i) => { arr[i]._id = id; });
      }
      if (select) {
        return res.json({ data: arr.map((d) => out(d)), count: null });
      }
      return res.json({ data: null, count: null });
    }

    if (action === 'update') {
      const q = buildFilter(filters);
      const patch = coercePayload(payload || {});
      patch.updated_at = new Date();
      await col.updateMany(q, { $set: patch });
      if (select) {
        const docs = (await col.find(q).toArray()).map(out);
        return res.json({ data: docs, count: null });
      }
      return res.json({ data: null, count: null });
    }

    if (action === 'delete') {
      const q = buildFilter(filters);
      if (!Object.keys(q).length) return res.status(400).json({ error: 'delete requires filter' });
      await col.deleteMany(q);
      return res.json({ data: null, count: null });
    }

    return res.status(400).json({ error: `Unsupported action: ${action}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default r;
