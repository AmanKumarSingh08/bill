import { Router } from 'express';
import { getDb, ObjectId } from '../mongo.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

/**
 * Send an invoice PDF to the customer via WhatsApp Cloud API.
 *
 * Body: { invoice_id, pdf_base64, filename, message? }
 *
 * Token / phone_id come from the user's settings document; if missing, we
 * fall back to env (WHATSAPP_API_TOKEN / WHATSAPP_PHONE_ID).
 */
r.post('/send', requireAuth, async (req, res) => {
  try {
    const { invoice_id, pdf_base64, filename, message } = req.body || {};
    if (!invoice_id || !pdf_base64) {
      return res.status(400).json({ error: 'invoice_id and pdf_base64 required' });
    }

    const db = await getDb();
    const invoice = await db.collection('invoices').findOne({
      _id: new ObjectId(invoice_id),
      user_id: new ObjectId(req.user.id),
    });
    if (!invoice) return res.status(404).json({ error: 'invoice not found' });
    if (!invoice.customer_mobile) return res.status(400).json({ error: 'customer has no mobile number' });

    const settings = await db.collection('settings').findOne({ user_id: new ObjectId(req.user.id) }) || {};
    const token = settings.whatsapp_api_token || process.env.WHATSAPP_API_TOKEN;
    const phoneId = settings.whatsapp_phone_id || process.env.WHATSAPP_PHONE_ID;
    if (!token || !phoneId) {
      return res.status(400).json({ error: 'WhatsApp not configured: set whatsapp_api_token and whatsapp_phone_id in Settings' });
    }

    // Format recipient: digits only, prefix country code (defaults to 91 / India if 10 digits)
    let to = String(invoice.customer_mobile).replace(/\D/g, '');
    if (to.length === 10) to = `91${to}`;

    // 1) Upload the PDF as media
    const pdfBuffer = Buffer.from(pdf_base64, 'base64');
    const safeName = (filename || `Invoice_${invoice.invoice_no || invoice_id}.pdf`).replace(/[^\w.\-]/g, '_');

    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    form.append('type', 'application/pdf');
    form.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), safeName);

    const upRes = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/media`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const upJson = await upRes.json();
    if (!upRes.ok || !upJson.id) {
      return res.status(400).json({ error: 'WhatsApp media upload failed', details: upJson });
    }

    // 2) Send the document message
    const caption = message || `Invoice ${invoice.invoice_no} - Total ₹${Number(invoice.grand_total || 0).toFixed(2)}`;
    const msgRes = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'document',
        document: { id: upJson.id, filename: safeName, caption },
      }),
    });
    const msgJson = await msgRes.json();
    if (!msgRes.ok) {
      return res.status(400).json({ error: 'WhatsApp send failed', details: msgJson });
    }

    await db.collection('invoices').updateOne(
      { _id: new ObjectId(invoice_id) },
      { $set: { whatsapp_sent: true, whatsapp_sent_at: new Date() } },
    );

    res.json({ ok: true, message_id: msgJson.messages?.[0]?.id || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default r;
