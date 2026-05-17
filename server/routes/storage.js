import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function publicUrlFor(req, bucket, safePath) {
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${bucket}/${safePath}`;
}

r.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { bucket = 'business-assets', path: relPath } = req.body || {};
    if (!req.file) return res.status(400).json({ error: 'file required' });
    if (!relPath) return res.status(400).json({ error: 'path required' });
    const safePath = relPath.startsWith(`${req.user.id}/`) ? relPath : `${req.user.id}/${relPath}`;
    const target = path.join(UPLOAD_DIR, bucket, safePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, req.file.buffer);
    res.json({ path: safePath, publicUrl: publicUrlFor(req, bucket, safePath) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

r.get('/public-url', (req, res) => {
  const { bucket = 'business-assets', path: relPath } = req.query;
  if (!relPath) return res.status(400).json({ error: 'path required' });
  res.json({ publicUrl: publicUrlFor(req, String(bucket), String(relPath)) });
});

export default r;
