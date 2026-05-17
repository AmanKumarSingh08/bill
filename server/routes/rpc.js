import { Router } from 'express';
import { getDb, ObjectId } from '../mongo.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

// Re-implements the single RPC the app uses: decrement_stock(p_id, qty)
r.post('/:name', requireAuth, async (req, res) => {
  const { name } = req.params;
  const { args } = req.body || {};
  try {
    const db = await getDb();
    if (name === 'decrement_stock') {
      const pid = args && args.p_id;
      const qty = Number((args && args.qty) || 0);
      if (!pid || !/^[a-f0-9]{24}$/i.test(pid)) {
        return res.status(400).json({ error: 'invalid p_id' });
      }
      const result = await db.collection('products').findOneAndUpdate(
        { _id: new ObjectId(pid), user_id: new ObjectId(req.user.id) },
        { $inc: { stock_quantity: -qty }, $set: { updated_at: new Date() } },
        { returnDocument: 'after' },
      );
      await db.collection('stock_history').insertOne({
        user_id: new ObjectId(req.user.id),
        product_id: new ObjectId(pid),
        change_quantity: -qty,
        reason: 'invoice',
        created_at: new Date(),
      });
      return res.json({ data: result ? { stock_quantity: result.stock_quantity } : null });
    }
    return res.status(404).json({ error: `Unknown rpc: ${name}` });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default r;
