import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getDb, ObjectId } from '../mongo.js';
import { signToken, signRefresh, verifyToken } from '../middleware/auth.js';

const r = Router();

function toUser(u) {
  return { id: String(u._id), email: u.email, created_at: u.created_at };
}

function sessionFor(user) {
  return {
    access_token: signToken(user),
    refresh_token: signRefresh(user),
    user: toUser(user),
  };
}

r.post('/signup', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const db = await getDb();
  const existing = await db.collection('users').findOne({ email });
  if (existing) return res.status(400).json({ error: 'User already exists' });
  const password_hash = await bcrypt.hash(password, 10);
  const doc = { email, password_hash, created_at: new Date() };
  const ins = await db.collection('users').insertOne(doc);
  const user = { ...doc, _id: ins.insertedId };
  res.json({ session: sessionFor(user), user: toUser(user) });
});

r.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const db = await getDb();
  const user = await db.collection('users').findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash || '');
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  res.json({ session: sessionFor(user), user: toUser(user) });
});

r.post('/logout', (_req, res) => res.json({ ok: true }));

r.get('/user', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.json({ user: null });
    const claims = verifyToken(token);
    const db = await getDb();
    const u = await db.collection('users').findOne({ _id: new ObjectId(claims.sub) });
    res.json({ user: u ? toUser(u) : null });
  } catch {
    res.json({ user: null });
  }
});

r.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body || {};
    if (!refresh_token) return res.status(400).json({ error: 'refresh_token required' });
    const claims = verifyToken(refresh_token);
    const db = await getDb();
    const u = await db.collection('users').findOne({ _id: new ObjectId(claims.sub) });
    if (!u) return res.status(400).json({ error: 'invalid refresh' });
    res.json({ session: sessionFor(u), user: toUser(u) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default r;
