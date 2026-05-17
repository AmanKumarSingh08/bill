import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'shakti_bill';

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
let _db = null;
let _connectPromise = null;

async function _connect() {
  try {
    await client.connect();
    const db = client.db(dbName);
    await Promise.all([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('customers').createIndex({ user_id: 1, name: 1 }),
      db.collection('products').createIndex({ user_id: 1, name: 1 }),
      db.collection('invoices').createIndex({ user_id: 1, created_at: -1 }),
      db.collection('invoice_items').createIndex({ invoice_id: 1 }),
      db.collection('payments').createIndex({ user_id: 1, invoice_id: 1 }),
      db.collection('stock_history').createIndex({ user_id: 1, product_id: 1 }),
      db.collection('settings').createIndex({ user_id: 1 }, { unique: true }),
      db.collection('files').createIndex({ path: 1 }, { unique: true }),
    ]);
    _db = db;
    console.log(`MongoDB connected: ${uri} / db=${dbName}`);
    return db;
  } catch (e) {
    _connectPromise = null;
    console.error(`MongoDB connection FAILED to ${uri}: ${e.message}`);
    throw new Error(`MongoDB unreachable at ${uri}. Start mongod or set MONGODB_URI in server/.env. (${e.message})`);
  }
}

export async function getDb() {
  if (_db) return _db;
  if (!_connectPromise) _connectPromise = _connect();
  return _connectPromise;
}

// Eagerly connect on boot so failures show up in the server log immediately
getDb().catch(() => { /* already logged */ });

export { ObjectId };
