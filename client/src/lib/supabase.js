 function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * Drop-in client that mimics the small subset of @supabase/supabase-js used by
 * this app, but routes every call through our Express API. The browser never
 * sees the service-role key — Express verifies the user's access token and runs
 * the query on the server.
 */

const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');

// ---------- token storage ----------
const TOKEN_KEY = 'sb-access-token';
const REFRESH_KEY = 'sb-refresh-token';
const USER_KEY = 'sb-user';








function readSession() {
  const t = localStorage.getItem(TOKEN_KEY);
  const r = localStorage.getItem(REFRESH_KEY);
  const u = localStorage.getItem(USER_KEY);
  if (!t || !u) return null;
  return { access_token: t, refresh_token: r || '', user: JSON.parse(u) };
}

function writeSession(session) {
  if (!session) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  } else {
    localStorage.setItem(TOKEN_KEY, session.access_token);
    localStorage.setItem(REFRESH_KEY, session.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }
  listeners.forEach((cb) => cb(session ? 'SIGNED_IN' : 'SIGNED_OUT', session));
}

const listeners = new Set();

// ---------- low-level fetch ----------
async function apiFetch(path, init = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API}${path}`, { ...init, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Stale/foreign token — wipe session and bounce to login
    const msg = (json && json.error) || '';
    if (res.status === 401 && (json.code === 'BAD_TOKEN' || /algorithm|jwt|token|expired|malformed/i.test(msg))) {
      try { writeSession(null); } catch {}
      if (typeof window !== 'undefined' && !/\/login/i.test(window.location.pathname)) {
        window.location.href = '/login';
      }
      throw new Error('Session expired, please log in again');
    }
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return json;
}

// ---------- query builder ----------



class QueryBuilder {
  
   __init() {this.action = 'select'}
  
  
   __init2() {this._filters = []}
   __init3() {this._modifiers = {}}
   __init4() {this._single = false}
   __init5() {this._maybeSingle = false}
  
   __init6() {this._head = false}

  constructor(table) {;QueryBuilder.prototype.__init.call(this);QueryBuilder.prototype.__init2.call(this);QueryBuilder.prototype.__init3.call(this);QueryBuilder.prototype.__init4.call(this);QueryBuilder.prototype.__init5.call(this);QueryBuilder.prototype.__init6.call(this);
    this.table = table;
  }

  select(cols = '*', opts) {
    if (this.action === 'select') {
      this._select = cols;
      if (_optionalChain([opts, 'optionalAccess', _ => _.count])) this._count = opts.count;
      if (_optionalChain([opts, 'optionalAccess', _2 => _2.head])) this._head = true;
    } else {
      // .insert(...).select() / .update(...).select() — request returning
      this._select = cols;
    }
    return this;
  }
  insert(payload) { this.action = 'insert'; this._payload = payload; return this; }
  update(payload) { this.action = 'update'; this._payload = payload; return this; }
  delete() { this.action = 'delete'; return this; }
  upsert(payload) { this.action = 'upsert'; this._payload = payload; return this; }

  eq(col, val) { this._filters.push(['eq', col, val]); return this; }
  neq(col, val) { this._filters.push(['neq', col, val]); return this; }
  gt(col, val) { this._filters.push(['gt', col, val]); return this; }
  gte(col, val) { this._filters.push(['gte', col, val]); return this; }
  lt(col, val) { this._filters.push(['lt', col, val]); return this; }
  lte(col, val) { this._filters.push(['lte', col, val]); return this; }
  like(col, val) { this._filters.push(['like', col, val]); return this; }
  ilike(col, val) { this._filters.push(['ilike', col, val]); return this; }
  in(col, vals) { this._filters.push(['in', col, vals]); return this; }

  order(col, opts) { this._modifiers.order = [col, opts]; return this; }
  limit(n) { this._modifiers.limit = n; return this; }
  range(from, to) { this._modifiers.range = { from, to }; return this; }

  single() { this._single = true; return this.run(); }
  maybeSingle() { this._maybeSingle = true; return this.run(); }

  // Thenable: lets `await supabase.from(..).select()` work
  then(
    onFulfilled,
    onRejected,
  ) {
    return this.run().then(onFulfilled , onRejected );
  }

   async run() {
    try {
      const body = {
        table: this.table,
        action: this.action,
        select: this._select,
        payload: this._payload,
        filters: this._filters,
        modifiers: this._modifiers,
        single: this._single,
        maybeSingle: this._maybeSingle,
        count: this._count,
        head: this._head,
      };
      const json = await apiFetch('/api/db', { method: 'POST', body: JSON.stringify(body) });
      return { data: json.data , error: null, count: _nullishCoalesce(json.count, () => ( null)) };
    } catch (e) {
      return { data: null, error: e , count: null };
    }
  }
}

// ---------- auth ----------
const auth = {
  async getSession() {
    return { data: { session: readSession() }, error: null  };
  },
  async getUser() {
    const s = readSession();
    return { data: { user: _nullishCoalesce(_optionalChain([s, 'optionalAccess', _3 => _3.user]), () => ( null)) }, error: null  };
  },
  onAuthStateChange(cb) {
    listeners.add(cb);
    // emit initial state shortly after subscribe (mirrors supabase behaviour)
    queueMicrotask(() => cb(readSession() ? 'INITIAL_SESSION' : 'SIGNED_OUT', readSession()));
    return {
      data: {
        subscription: {
          unsubscribe: () => listeners.delete(cb),
        },
      },
    };
  },
  async signInWithPassword({ email, password }) {
    try {
      const json = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      writeSession(json.session);
      return { data: json, error: null  };
    } catch (e) {
      return { data: null, error: e  };
    }
  },
  async signUp({ email, password }) {
    try {
      const json = await apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
      if (json.session) writeSession(json.session);
      return { data: json, error: null  };
    } catch (e) {
      return { data: null, error: e  };
    }
  },
  async signOut() {
    writeSession(null);
    return { error: null  };
  },
};

// ---------- storage ----------
const storage = {
  from(bucket) {
    return {
      async upload(path, file, _opts) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('path', path);
        fd.append('bucket', bucket);

        try {
          const json = await apiFetch('/api/storage/upload', {
            method: 'POST',
            body: fd,
          });

          return {
            data: {
              path: json.path,
              publicUrl: json.publicUrl,
            },
            error: null,
          };
        } catch (e) {
          return { data: null, error: e };
        }
      },

      getPublicUrl(path) {
        const cleanPath = String(path).replace(/^\/+/, '');

        return {
          data: {
            publicUrl: `${API}/uploads/${encodeURIComponent(bucket)}/${cleanPath
              .split('/')
              .map(encodeURIComponent)
              .join('/')}`,
          },
        };
      },
    };
  },
};

// ---------- rpc ----------
async function rpc(name, args) {
  try {
    const json = await apiFetch(`/api/rpc/${encodeURIComponent(name)}`, {
      method: 'POST',
      body: JSON.stringify({ args }),
    });
    return { data: json.data, error: null , maybeSingle: () => ({ data: json.data, error: null }) };
  } catch (e) {
    const err = e ;
    return { data: null, error: err, maybeSingle: () => ({ data: null, error: err }) };
  }
}

// ---------- exported client ----------
export const supabase = {
  from(table) {
    return new QueryBuilder(table);
  },
  auth,
  storage,
  rpc,
};

// Minimal type shims to replace @supabase/supabase-js imports
 

