import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import dbRoutes from './routes/db.js';
import rpcRoutes from './routes/rpc.js';
import storageRoutes from './routes/storage.js';
import whatsappRoutes from './routes/whatsapp.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));

app.get('/', (_req, res) => res.json({ ok: true, service: 'shakti-bill-server' }));
app.get('/health', (_req, res) => res.json({ ok: true }));

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

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API on ${PORT}`));
}

export default app;
