import jwt from 'jsonwebtoken';
import { getDb, ObjectId } from '../mongo.js';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function signToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email },
    SECRET,
    { expiresIn: '7d' },
  );
}

export function signRefresh(user) {
  return jwt.sign({ sub: String(user._id), type: 'refresh' }, SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing bearer token', code: 'NO_TOKEN' });
    let claims;
    try {
      claims = verifyToken(token);
    } catch (err) {
      // Stale / foreign token (e.g. old Supabase RS256 token in localStorage).
      return res.status(401).json({ error: 'Session expired, please log in again', code: 'BAD_TOKEN' });
    }
    let userId;
    try { userId = new ObjectId(claims.sub); } catch { return res.status(401).json({ error: 'Session expired, please log in again', code: 'BAD_TOKEN' }); }
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: userId });
    if (!user) return res.status(401).json({ error: 'Session expired, please log in again', code: 'BAD_TOKEN' });
    req.user = { id: String(user._id), email: user.email };
    req.accessToken = token;
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
