import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import authRoutes from './routes/auth.js';
import dbRoutes from './routes/db.js';
import rpcRoutes from './routes/rpc.js';
import storageRoutes from './routes/storage.js';
import whatsappRoutes from './routes/whatsapp.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*', credentials: true }));
app.use(express.json({ limit: '20mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

// Serve uploaded files publicly (logo, signature, etc.)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/db', dbRoutes);
app.use('/api/rpc', rpcRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
