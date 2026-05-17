const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

import { todayISO, addDays, formatCurrency, numberToWords, formatDate } from '../lib/utils';
import InvoicePrint from '../components/InvoicePrint';
import CustomerSearch from '../components/CustomerSearch';
import ProductSearch from '../components/ProductSearch';
import { Trash2, Plus, Printer, Save, Download, MessageCircle, Eye, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const emptyItem = () => ({
  item_name: '', hsn_code: '', quantity: 1, unit: 'Pcs',
  price_per_unit: 0, taxable_amount: 0,
  cgst_rate: 0, cgst_amount: 0,
  sgst_rate: 0, sgst_amount: 0,
  igst_rate: 0, igst_amount: 0,
  amount: 0, sort_order: 0,
});

function calcItem(item) {
  const taxable = item.quantity * item.price_per_unit;
  const cgst = (taxable * item.cgst_rate) / 100;
  const sgst = (taxable * item.sgst_rate) / 100;
  const igst = (taxable * item.igst_rate) / 100;
  return { ...item, taxable_amount: taxable, cgst_amount: cgst, sgst_amount: sgst, igst_amount: igst, amount: taxable + cgst + sgst + igst };
}

export default function InvoiceForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const isEdit = Boolean(id && id !== 'new');

  const [saving, setSaving] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(addDays(todayISO(), 7));
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [customerId, setCustomerId] = useState();
  const [shipTo, setShipTo] = useState('');
  const [transportName, setTransportName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [paymentMode, setPaymentMode] = useState('Credit');
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [items, setItems] = useState([emptyItem()]);

  const [subTotal, setSubTotal] = useState(0);
  const [taxableTotal, setTaxableTotal] = useState(0);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // Auto-generate invoice number
  useEffect(() => {
    if (isEdit || !user) return;
    const genNo = async () => {
      const year = new Date().getFullYear();
      const y2 = String(year).slice(2);
      const y2n = String(year + 1).slice(2);
      const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      const num = String((_nullishCoalesce(count, () => ( 0))) + 1).padStart(3, '0');
      setInvoiceNo(`${settings.invoice_prefix}/${y2}/${y2n}/${num}`);
    };
    genNo();
  }, [user, isEdit, settings.invoice_prefix]);

  // Load existing invoice
  useEffect(() => {
    if (!isEdit || !id) return;
    const load = async () => {
      const { data } = await supabase.from('invoices').select('*, invoice_items(*)').eq('id', id).maybeSingle();
      if (!data) return;
      setInvoiceNo(data.invoice_no);
      setInvoiceDate(data.invoice_date);
      setDueDate(_nullishCoalesce(data.due_date, () => ( '')));
      setCustomerName(data.customer_name);
      setCustomerAddress(data.customer_address);
      setCustomerMobile(data.customer_mobile);
      setCustomerGstin(data.customer_gstin);
      setCustomerId(data.customer_id);
      setShipTo(data.ship_to);
      setTransportName(data.transport_name);
      setVehicleNumber(data.vehicle_number);
      setPaymentMode(data.payment_mode);
      setReceivedAmount(data.received_amount);
      const loadedItems = (_nullishCoalesce(data.invoice_items, () => ( []))).sort((a, b) => a.sort_order - b.sort_order);
      setItems(loadedItems.length > 0 ? loadedItems : [emptyItem()]);
    };
    load();
  }, [isEdit, id]);

  // Recalculate totals
  useEffect(() => {
    const recalc = items.map(calcItem);
    const taxable = recalc.reduce((s, i) => s + i.taxable_amount, 0);
    const cgst = recalc.reduce((s, i) => s + i.cgst_amount, 0);
    const sgst = recalc.reduce((s, i) => s + i.sgst_amount, 0);
    const sub = recalc.reduce((s, i) => s + i.amount, 0);
    const rounded = Math.round(sub);
    setItems(recalc);
    setTaxableTotal(taxable);
    setCgstTotal(cgst);
    setSgstTotal(sgst);
    setSubTotal(sub);
    setRoundOff(parseFloat((rounded - sub).toFixed(2)));
    setGrandTotal(rounded);
  }, [JSON.stringify(items.map(i => ({ q: i.quantity, p: i.price_per_unit, c: i.cgst_rate, s: i.sgst_rate })))]);

  const updateItem = (idx, field, val) => {
    setItems(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const addRow = () => setItems(prev => [...prev, { ...emptyItem(), sort_order: prev.length }]);
  const removeRow = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const handleCustomerSelect = (c) => {
    setCustomerName(c.name);
    setCustomerAddress(c.address);
    setCustomerMobile(c.mobile);
    setCustomerGstin(c.gstin);
    setCustomerId(c.id);
  };

  const handleProductSelect = (p, idx) => {
    setItems(prev => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        item_name: p.name,
        hsn_code: p.hsn_code,
        unit: p.unit,
        price_per_unit: p.sale_price,
        cgst_rate: p.cgst_rate,
        sgst_rate: p.sgst_rate,
        igst_rate: p.igst_rate,
        product_id: p.id,
      };
      return updated;
    });
  };

  const buildInvoiceObj = () => ({
    user_id: user.id,
    invoice_no: invoiceNo,
    invoice_date: invoiceDate,
    due_date: dueDate,
    customer_id: customerId,
    customer_name: customerName,
    customer_address: customerAddress,
    customer_mobile: customerMobile,
    customer_gstin: customerGstin,
    ship_to: shipTo,
    transport_name: transportName,
    vehicle_number: vehicleNumber,
    sub_total: subTotal,
    cgst_total: cgstTotal,
    sgst_total: sgstTotal,
    igst_total: 0,
    taxable_total: taxableTotal,
    round_off: roundOff,
    grand_total: grandTotal,
    received_amount: receivedAmount,
    payment_mode: paymentMode,
    status: receivedAmount >= grandTotal ? 'paid' : 'unpaid',
    whatsapp_sent: false,
    notes: '',
    is_draft: false,
    invoice_items: items.filter(i => i.item_name),
  });

  const saveInvoice = async () => {
    if (!user || !customerName || !invoiceNo) { showToast('Please fill required fields'); return null; }
    setSaving(true);
    try {
      const obj = buildInvoiceObj();
      const itemsToSave = (_nullishCoalesce(obj.invoice_items, () => ( []))).map((item, idx) => ({ ...item, sort_order: idx }));

      let savedId = id;
      if (isEdit && id) {
        await supabase.from('invoices').update({
          ...obj, invoice_items: undefined, updated_at: new Date().toISOString()
        }).eq('id', id);
        await supabase.from('invoice_items').delete().eq('invoice_id', id);
        await supabase.from('invoice_items').insert(itemsToSave.map(i => ({ ...i, invoice_id: id })));
      } else {
        const { data } = await supabase.from('invoices').insert({
          ...obj, invoice_items: undefined
        }).select('id').single();
        savedId = _optionalChain([data, 'optionalAccess', _2 => _2.id]);
        if (savedId) {
          await supabase.from('invoice_items').insert(itemsToSave.map(i => ({ ...i, invoice_id: savedId })));
          // Deduct stock
          for (const item of itemsToSave) {
            if (item.product_id) {
              await supabase.rpc('decrement_stock', { p_id: item.product_id, qty: item.quantity }).maybeSingle().then(() => null, () => null);
            }
          }
        }
      }
      showToast('Invoice saved successfully!');
      setSaving(false);
      return _nullishCoalesce(savedId, () => ( null));
    } catch (e2) {
      showToast('Error saving invoice');
      setSaving(false);
      return null;
    }
  };

  // Build the invoice PDF as base64 (no download) – used for WhatsApp auto-send
  const buildPdfBase64 = async () => {
    if (!printRef.current) return null;
    const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    const pageH = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, w, Math.min(h, pageH));
    // jsPDF returns "data:application/pdf;filename=...;base64,XXXX" — strip the header
    const dataUri = pdf.output('datauristring');
    return dataUri.substring(dataUri.indexOf(',') + 1);
  };

  // Auto-send the invoice PDF to the customer on WhatsApp (Cloud API)
  const autoSendWhatsApp = async (invoiceId) => {
    if (!invoiceId) return;
    if (!customerMobile) { showToast('Saved – but customer has no mobile, WhatsApp skipped'); return; }
    try {
      setWhatsappLoading(true);
      // Give the print DOM a tick to render the latest totals
      await new Promise((r) => setTimeout(r, 150));
      const pdf_base64 = await buildPdfBase64();
      if (!pdf_base64) { showToast('Could not build PDF for WhatsApp'); return; }
      const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');
      const token = localStorage.getItem('sb-access-token');
      const res = await fetch(`${API}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          invoice_id: invoiceId,
          pdf_base64,
          filename: `Invoice_${invoiceNo.replace(/\//g, '_')}.pdf`,
          message: `Hello ${customerName}, your Invoice ${invoiceNo} from ${settings.business_name} – Total ₹${formatCurrency(grandTotal)}.`,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { showToast(`WhatsApp failed: ${json.error || res.status}`); return; }
      showToast('Invoice sent on WhatsApp');
    } catch (e4) {
      showToast(`WhatsApp error: ${e4.message}`);
    } finally {
      setWhatsappLoading(false);
    }
  };

  const handleSave = async () => {
    const savedId = await saveInvoice();
    if (savedId) await autoSendWhatsApp(savedId);
    if (savedId && !isEdit) navigate(`/invoices/${savedId}`);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onBeforePrint: async () => { setPrinting(true); },
    onAfterPrint: async () => {
      setPrinting(false);
      // Ensure the invoice exists before sending; save if needed
      let targetId = isEdit ? id : null;
      if (!targetId) targetId = await saveInvoice();
      if (targetId) await autoSendWhatsApp(targetId);
    },
  });

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setPdfLoading(true);
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      const pageH = pdf.internal.pageSize.getHeight();
      // Page 1
      pdf.addImage(imgData, 'PNG', 0, 0, w, Math.min(h, pageH));
      pdf.save(`Invoice_${invoiceNo.replace(/\//g, '_')}.pdf`);
    } catch (e3) {
      showToast('PDF generation failed');
    }
    setPdfLoading(false);
  };

  const handleWhatsApp = async () => {
    if (!customerMobile) { showToast('No customer mobile number'); return; }
    setWhatsappLoading(true);
    const msg = encodeURIComponent(
      `Hello ${customerName},\n\nYour Invoice ${invoiceNo} from ${settings.business_name} is ready.\n\nTotal Amount: ₹${formatCurrency(grandTotal)}\nDue Date: ${dueDate}\n\nThank you for your business!`
    );
    const phone = customerMobile.replace(/\D/g, '');
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
    setWhatsappLoading(false);
  };

  const currentInvoice = {
    id: _nullishCoalesce(id, () => ( '')),
    ...buildInvoiceObj(),
    created_at: '', updated_at: '',
    invoice_items: items.filter(i => i.item_name),
  };

  return (
    _jsxDEV('div', { className: "space-y-4", children: [
      /* Toast */
      toast && (
        _jsxDEV('div', { className: "fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl text-sm animate-pulse"           , children: 
          toast
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 284}, this)
      )

      /* Header */
      , _jsxDEV('div', { className: "flex flex-wrap items-center justify-between gap-3"    , children: [
        _jsxDEV('h1', { className: "text-xl font-bold text-gray-800"  , children: isEdit ? 'Edit Invoice' : 'New Invoice'}, void 0, false, {fileName: _jsxFileName, lineNumber: 291}, this)
        , _jsxDEV('div', { className: "flex flex-wrap gap-2"  , children: [
          _jsxDEV('button', { onClick: () => setPreviewOpen(true), className: "flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"          , children: [
            _jsxDEV(Eye, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 294}, this ), " Preview"
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 293}, this)
          , _jsxDEV('button', { onClick: () => handlePrint(), disabled: printing,
            className: "flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"           , children: [
            _jsxDEV(Printer, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 298}, this ), " " , printing ? 'Printing...' : 'Print'
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 296}, this)
          , _jsxDEV('button', { onClick: handleDownloadPDF, disabled: pdfLoading,
            className: "flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"           , children: [
            _jsxDEV(Download, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 302}, this ), " " , pdfLoading ? 'Generating...' : 'PDF'
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 300}, this)
          , _jsxDEV('button', { onClick: handleWhatsApp, disabled: whatsappLoading,
            className: "flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50"           , children: [
            _jsxDEV(MessageCircle, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 306}, this ), " WhatsApp"
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 304}, this)
          , _jsxDEV('button', { onClick: handleSave, disabled: saving,
            className: "flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"            , children: [
            _jsxDEV(Save, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 310}, this ), " " , saving ? 'Saving...' : 'Save Invoice'
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 308}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 292}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 290}, this)

      /* Invoice details */
      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5 grid grid-cols-1 md:grid-cols-3 gap-4"       , children: [
        _jsxDEV('div', { children: [
          _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Invoice No. *"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 318}, this)
          , _jsxDEV('input', { value: invoiceNo, onChange: e => setInvoiceNo(e.target.value), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 319}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 317}, this)
        , _jsxDEV('div', { children: [
          _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Invoice Date *"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 322}, this)
          , _jsxDEV('input', { type: "date", value: invoiceDate, onChange: e => setInvoiceDate(e.target.value), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 323}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 321}, this)
        , _jsxDEV('div', { children: [
          _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Due Date" }, void 0, false, {fileName: _jsxFileName, lineNumber: 326}, this)
          , _jsxDEV('input', { type: "date", value: dueDate, onChange: e => setDueDate(e.target.value), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 327}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 325}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 316}, this)

      /* Customer + Shipping */
      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5 grid grid-cols-1 md:grid-cols-2 gap-5"       , children: [
        _jsxDEV('div', { className: "space-y-3", children: [
          _jsxDEV('h3', { className: "font-semibold text-gray-700 text-sm"  , children: "Bill To" }, void 0, false, {fileName: _jsxFileName, lineNumber: 334}, this)
          , _jsxDEV(CustomerSearch, { value: customerName, onChange: setCustomerName, onSelect: handleCustomerSelect,}, void 0, false, {fileName: _jsxFileName, lineNumber: 335}, this )
          , _jsxDEV('input', { value: customerAddress, onChange: e => setCustomerAddress(e.target.value), placeholder: "Address", className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 336}, this )
          , _jsxDEV('input', { value: customerMobile, onChange: e => setCustomerMobile(e.target.value), placeholder: "Mobile", className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 337}, this )
          , _jsxDEV('input', { value: customerGstin, onChange: e => setCustomerGstin(e.target.value), placeholder: "GSTIN", className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 338}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 333}, this)
        , _jsxDEV('div', { className: "space-y-3", children: [
          _jsxDEV('h3', { className: "font-semibold text-gray-700 text-sm"  , children: "Ship To / Transport"   }, void 0, false, {fileName: _jsxFileName, lineNumber: 341}, this)
          , _jsxDEV('input', { value: shipTo, onChange: e => setShipTo(e.target.value), placeholder: "Ship To" , className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 342}, this )
          , _jsxDEV('input', { value: transportName, onChange: e => setTransportName(e.target.value), placeholder: "Transport Name" , className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 343}, this )
          , _jsxDEV('input', { value: vehicleNumber, onChange: e => setVehicleNumber(e.target.value), placeholder: "Vehicle Number" , className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 344}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 340}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 332}, this)

      /* Items table */
      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsxDEV('h3', { className: "font-semibold text-gray-700 text-sm mb-3"   , children: "Items"}, void 0, false, {fileName: _jsxFileName, lineNumber: 350}, this)
        , _jsxDEV('div', { className: "overflow-x-auto", children: 
          _jsxDEV('table', { className: "w-full text-xs border-collapse"  , children: [
            _jsxDEV('thead', { children: 
              _jsxDEV('tr', { className: "bg-gray-50", children: [
                _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 text-left w-6"     , children: "#"}, void 0, false, {fileName: _jsxFileName, lineNumber: 355}, this)
                , _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 text-left"    , style: { minWidth: '200px' }, children: "Item Name" }, void 0, false, {fileName: _jsxFileName, lineNumber: 356}, this)
                , _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 text-left w-24"     , children: "HSN/SAC"}, void 0, false, {fileName: _jsxFileName, lineNumber: 357}, this)
                , _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 text-center w-16"     , children: "Qty"}, void 0, false, {fileName: _jsxFileName, lineNumber: 358}, this)
                , _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 text-center w-20"     , children: "Unit"}, void 0, false, {fileName: _jsxFileName, lineNumber: 359}, this)
                , _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 text-right w-20"     , children: "Price/Unit"}, void 0, false, {fileName: _jsxFileName, lineNumber: 360}, this)
                , _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 text-center w-16"     , children: "CGST%"}, void 0, false, {fileName: _jsxFileName, lineNumber: 361}, this)
                , _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 text-center w-16"     , children: "SGST%"}, void 0, false, {fileName: _jsxFileName, lineNumber: 362}, this)
                , _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 text-right w-24"     , children: "Taxable"}, void 0, false, {fileName: _jsxFileName, lineNumber: 363}, this)
                , _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 text-right w-24"     , children: "Amount"}, void 0, false, {fileName: _jsxFileName, lineNumber: 364}, this)
                , _jsxDEV('th', { className: "border border-gray-200 px-2 py-2 w-8"    ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 365}, this)
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 354}, this)
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 353}, this)
            , _jsxDEV('tbody', { children: 
              items.map((item, idx) => (
                _jsxDEV('tr', { className: "hover:bg-gray-50", children: [
                  _jsxDEV('td', { className: "border border-gray-200 px-2 py-1.5 text-center text-gray-500"     , children: idx + 1}, void 0, false, {fileName: _jsxFileName, lineNumber: 371}, this)
                  , _jsxDEV('td', { className: "border border-gray-200 px-1 py-1"   , children: 
                    _jsxDEV(ProductSearch, {
                      value: item.item_name,
                      onChange: val => updateItem(idx, 'item_name', val),
                      onSelect: p => handleProductSelect(p, idx),}, void 0, false, {fileName: _jsxFileName, lineNumber: 373}, this
                    )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 372}, this)
                  , _jsxDEV('td', { className: "border border-gray-200 px-1 py-1"   , children: 
                    _jsxDEV('input', { value: item.hsn_code, onChange: e => updateItem(idx, 'hsn_code', e.target.value),
                      className: "w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 380}, this )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 379}, this)
                  , _jsxDEV('td', { className: "border border-gray-200 px-1 py-1"   , children: 
                    _jsxDEV('input', { type: "number", value: item.quantity, onChange: e => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0),
                      className: "w-full border border-gray-200 rounded px-2 py-1 text-xs text-right focus:outline-none focus:ring-1 focus:ring-sky-400"          ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 384}, this )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 383}, this)
                  , _jsxDEV('td', { className: "border border-gray-200 px-1 py-1"   , children: 
                    _jsxDEV('input', { value: item.unit, onChange: e => updateItem(idx, 'unit', e.target.value),
                      className: "w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 388}, this )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 387}, this)
                  , _jsxDEV('td', { className: "border border-gray-200 px-1 py-1"   , children: 
                    _jsxDEV('input', { type: "number", value: item.price_per_unit, onChange: e => updateItem(idx, 'price_per_unit', parseFloat(e.target.value) || 0),
                      className: "w-full border border-gray-200 rounded px-2 py-1 text-xs text-right focus:outline-none focus:ring-1 focus:ring-sky-400"          ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 392}, this )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 391}, this)
                  , _jsxDEV('td', { className: "border border-gray-200 px-1 py-1"   , children: 
                    _jsxDEV('input', { type: "number", value: item.cgst_rate, onChange: e => updateItem(idx, 'cgst_rate', parseFloat(e.target.value) || 0),
                      className: "w-full border border-gray-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-sky-400"          ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 396}, this )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 395}, this)
                  , _jsxDEV('td', { className: "border border-gray-200 px-1 py-1"   , children: 
                    _jsxDEV('input', { type: "number", value: item.sgst_rate, onChange: e => updateItem(idx, 'sgst_rate', parseFloat(e.target.value) || 0),
                      className: "w-full border border-gray-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-sky-400"          ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 400}, this )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 399}, this)
                  , _jsxDEV('td', { className: "border border-gray-200 px-2 py-1 text-right text-gray-600"     , children: ["₹", formatCurrency(item.taxable_amount)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 403}, this)
                  , _jsxDEV('td', { className: "border border-gray-200 px-2 py-1 text-right font-medium"     , children: ["₹", formatCurrency(item.amount)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 404}, this)
                  , _jsxDEV('td', { className: "border border-gray-200 px-1 py-1 text-center"    , children: 
                    _jsxDEV('button', { onClick: () => removeRow(idx), className: "text-rose-400 hover:text-rose-600 transition-colors"  , children: 
                      _jsxDEV(Trash2, { className: "w-3.5 h-3.5" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 407}, this )
                    }, void 0, false, {fileName: _jsxFileName, lineNumber: 406}, this)
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 405}, this)
                ]}, idx, true, {fileName: _jsxFileName, lineNumber: 370}, this)
              ))
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 368}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 352}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 351}, this)
        , _jsxDEV('button', { onClick: addRow, className: "mt-3 flex items-center gap-1.5 text-sky-600 hover:text-sky-700 text-sm font-medium transition-colors"        , children: [
          _jsxDEV(Plus, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 416}, this ), " Add Item"
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 415}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 349}, this)

      /* Totals + Payment */
      , _jsxDEV('div', { className: "grid md:grid-cols-2 gap-4"  , children: [
        _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
          _jsxDEV('h3', { className: "font-semibold text-gray-700 text-sm mb-3"   , children: "Payment"}, void 0, false, {fileName: _jsxFileName, lineNumber: 423}, this)
          , _jsxDEV('div', { className: "space-y-3", children: [
            _jsxDEV('div', { children: [
              _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Payment Mode" }, void 0, false, {fileName: _jsxFileName, lineNumber: 426}, this)
              , _jsxDEV('select', { value: paymentMode, onChange: e => setPaymentMode(e.target.value),
                className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         , children: [
                _jsxDEV('option', { children: "Credit"}, void 0, false, {fileName: _jsxFileName, lineNumber: 429}, this), _jsxDEV('option', { children: "Cash"}, void 0, false, {fileName: _jsxFileName, lineNumber: 429}, this), _jsxDEV('option', { children: "UPI"}, void 0, false, {fileName: _jsxFileName, lineNumber: 429}, this)
                , _jsxDEV('option', { children: "Bank Transfer" }, void 0, false, {fileName: _jsxFileName, lineNumber: 430}, this), _jsxDEV('option', { children: "Cheque"}, void 0, false, {fileName: _jsxFileName, lineNumber: 430}, this)
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 427}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 425}, this)
            , _jsxDEV('div', { children: [
              _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Amount Received (₹)"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 434}, this)
              , _jsxDEV('input', { type: "number", value: receivedAmount, onChange: e => setReceivedAmount(parseFloat(e.target.value) || 0),
                className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 435}, this )
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 433}, this)
            , _jsxDEV('div', { className: "text-xs text-gray-500 italic"  , children: 
              numberToWords(grandTotal)
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 438}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 424}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 422}, this)

        , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
          _jsxDEV('h3', { className: "font-semibold text-gray-700 text-sm mb-3"   , children: "Summary"}, void 0, false, {fileName: _jsxFileName, lineNumber: 445}, this)
          , _jsxDEV('div', { className: "space-y-2 text-sm" , children: [
            _jsxDEV('div', { className: "flex justify-between text-gray-600"  , children: [
              _jsxDEV('span', { children: "Taxable Amount" }, void 0, false, {fileName: _jsxFileName, lineNumber: 448}, this), _jsxDEV('span', { children: ["₹", formatCurrency(taxableTotal)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 448}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 447}, this)
            , _jsxDEV('div', { className: "flex justify-between text-gray-600"  , children: [
              _jsxDEV('span', { children: "CGST"}, void 0, false, {fileName: _jsxFileName, lineNumber: 451}, this), _jsxDEV('span', { children: ["₹", formatCurrency(cgstTotal)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 451}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 450}, this)
            , _jsxDEV('div', { className: "flex justify-between text-gray-600"  , children: [
              _jsxDEV('span', { children: "SGST"}, void 0, false, {fileName: _jsxFileName, lineNumber: 454}, this), _jsxDEV('span', { children: ["₹", formatCurrency(sgstTotal)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 454}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 453}, this)
            , _jsxDEV('div', { className: "flex justify-between text-gray-600"  , children: [
              _jsxDEV('span', { children: "Sub Total" }, void 0, false, {fileName: _jsxFileName, lineNumber: 457}, this), _jsxDEV('span', { children: ["₹", formatCurrency(subTotal)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 457}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 456}, this)
            , _jsxDEV('div', { className: "flex justify-between text-gray-600"  , children: [
              _jsxDEV('span', { children: "Round Off" }, void 0, false, {fileName: _jsxFileName, lineNumber: 460}, this), _jsxDEV('span', { children: ["₹", formatCurrency(roundOff)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 460}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 459}, this)
            , _jsxDEV('div', { className: "flex justify-between font-bold text-gray-800 text-base border-t pt-2"      , children: [
              _jsxDEV('span', { children: "Grand Total" }, void 0, false, {fileName: _jsxFileName, lineNumber: 463}, this), _jsxDEV('span', { children: ["₹", formatCurrency(grandTotal)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 463}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 462}, this)
            , _jsxDEV('div', { className: "flex justify-between text-gray-600"  , children: [
              _jsxDEV('span', { children: "Received"}, void 0, false, {fileName: _jsxFileName, lineNumber: 466}, this), _jsxDEV('span', { children: ["₹", formatCurrency(receivedAmount)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 466}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 465}, this)
            , _jsxDEV('div', { className: "flex justify-between font-semibold text-amber-600"   , children: [
              _jsxDEV('span', { children: "Balance Due" }, void 0, false, {fileName: _jsxFileName, lineNumber: 469}, this), _jsxDEV('span', { children: ["₹", formatCurrency(grandTotal - receivedAmount)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 469}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 468}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 446}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 444}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 421}, this)

      /* Hidden print area */
      , _jsxDEV('div', { className: "hidden print:block" , children: 
        _jsxDEV(InvoicePrint, { ref: printRef, invoice: currentInvoice, settings: settings,}, void 0, false, {fileName: _jsxFileName, lineNumber: 477}, this )
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 476}, this)
      , _jsxDEV('div', { style: { position: 'absolute', left: '-9999px', top: 0 }, children: 
        _jsxDEV(InvoicePrint, { ref: printRef, invoice: currentInvoice, settings: settings,}, void 0, false, {fileName: _jsxFileName, lineNumber: 480}, this )
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 479}, this)

      /* Preview Modal */
      , previewOpen && (
        _jsxDEV('div', { className: "fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto"        , children: 
          _jsxDEV('div', { className: "bg-white rounded-xl shadow-2xl w-full max-w-5xl"    , children: [
            _jsxDEV('div', { className: "flex items-center justify-between p-4 border-b"    , children: [
              _jsxDEV('h2', { className: "font-bold text-gray-800" , children: "Invoice Preview" }, void 0, false, {fileName: _jsxFileName, lineNumber: 488}, this)
              , _jsxDEV('div', { className: "flex gap-2" , children: [
                _jsxDEV('button', { onClick: () => { handlePrint(); setPreviewOpen(false); },
                  className: "flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-sm"        , children: [
                  _jsxDEV(Printer, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 492}, this ), " Print"
                ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 490}, this)
                , _jsxDEV('button', { onClick: () => setPreviewOpen(false), className: "p-1.5 hover:bg-gray-100 rounded-lg"  , children: 
                  _jsxDEV(X, { className: "w-5 h-5" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 495}, this )
                }, void 0, false, {fileName: _jsxFileName, lineNumber: 494}, this)
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 489}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 487}, this)
            , _jsxDEV('div', { className: "p-4 overflow-x-auto bg-gray-100"  , children: 
              _jsxDEV('div', { className: "border border-gray-300 inline-block"  , children: 
                _jsxDEV(InvoiceCopyPreview, { invoice: currentInvoice, settings: settings,}, void 0, false, {fileName: _jsxFileName, lineNumber: 501}, this )
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 500}, this)
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 499}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 486}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 485}, this)
      )
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 281}, this)
  );
}

// Inline preview (single copy)
function InvoiceCopyPreview({ invoice, settings }) {
  const items = _nullishCoalesce(invoice.invoice_items, () => ( []));
  const taxMap = {};
  items.forEach(item => {
    if (item.sgst_rate > 0) {
      const key = `sgst_${item.sgst_rate}`;
      if (!taxMap[key]) taxMap[key] = { taxable: 0, rate: item.sgst_rate, tax: 0, type: 'SGST' };
      taxMap[key].taxable += item.taxable_amount;
      taxMap[key].tax += item.sgst_amount;
    }
    if (item.cgst_rate > 0) {
      const key = `cgst_${item.cgst_rate}`;
      if (!taxMap[key]) taxMap[key] = { taxable: 0, rate: item.cgst_rate, tax: 0, type: 'CGST' };
      taxMap[key].taxable += item.taxable_amount;
      taxMap[key].tax += item.cgst_amount;
    }
  });
  const taxRows = Object.values(taxMap);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  return (
    _jsxDEV('div', { style: { fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#000', width: '210mm', padding: '6mm 8mm', boxSizing: 'border-box', backgroundColor: '#fff' }, children: [
      _jsxDEV('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }, children: [
        _jsxDEV('div', { style: { flex: 1 },}, void 0, false, {fileName: _jsxFileName, lineNumber: 535}, this )
        , _jsxDEV('div', { style: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }, children: "Tax Invoice" }, void 0, false, {fileName: _jsxFileName, lineNumber: 536}, this)
        , _jsxDEV('div', { style: { flex: 1, textAlign: 'right', fontSize: '10px', color: '#555' }, children: "ORIGINAL FOR RECIPIENT"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 537}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 534}, this)
      , _jsxDEV('div', { style: { display: 'flex', alignItems: 'flex-start', borderBottom: '1px solid #000', paddingBottom: '4px' }, children: [
        _jsxDEV('div', { style: { marginRight: '10px', width: '52px', height: '52px', flexShrink: 0 }, children: 
          settings.logo_url ? _jsxDEV('img', { src: settings.logo_url, alt: "logo", style: { width: '52px', height: '52px', objectFit: 'contain' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 541}, this ) : _jsxDEV('div', { style: { width: '52px', height: '52px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }, children: _jsxDEV('span', { style: { fontSize: '20px' }, children: "🥛"}, void 0, false, {fileName: _jsxFileName, lineNumber: 541}, this)}, void 0, false, {fileName: _jsxFileName, lineNumber: 541}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 540}, this)
        , _jsxDEV('div', { style: { flex: 1, textAlign: 'right' }, children: [
          _jsxDEV('div', { style: { fontWeight: 'bold', fontSize: '18px' }, children: settings.business_name}, void 0, false, {fileName: _jsxFileName, lineNumber: 544}, this)
          , _jsxDEV('div', { style: { fontSize: '10px' }, children: settings.address}, void 0, false, {fileName: _jsxFileName, lineNumber: 545}, this)
          , _jsxDEV('div', { style: { fontSize: '10px' }, children: ["Phone no.: "  , settings.phone, " Email: "  , settings.email]}, void 0, true, {fileName: _jsxFileName, lineNumber: 546}, this)
          , _jsxDEV('div', { style: { fontSize: '10px' }, children: ["GSTIN: " , settings.gstin, ", State: "  , settings.state]}, void 0, true, {fileName: _jsxFileName, lineNumber: 547}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 543}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 539}, this)
      , _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }, children: 
        _jsxDEV('tbody', { children: [
          _jsxDEV('tr', { children: [
            _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', width: '25%', fontWeight: 'bold', backgroundColor: '#f3f3f3' }, children: "Bill To" }, void 0, false, {fileName: _jsxFileName, lineNumber: 553}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', width: '25%', fontWeight: 'bold', backgroundColor: '#f3f3f3' }, children: "Ship To" }, void 0, false, {fileName: _jsxFileName, lineNumber: 554}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', width: '25%', fontWeight: 'bold', backgroundColor: '#f3f3f3' }, children: "Transportation Details" }, void 0, false, {fileName: _jsxFileName, lineNumber: 555}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', width: '25%', fontWeight: 'bold', backgroundColor: '#f3f3f3', textAlign: 'right' }, children: "Invoice Details" }, void 0, false, {fileName: _jsxFileName, lineNumber: 556}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 552}, this)
          , _jsxDEV('tr', { children: [
            _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top' }, children: [_jsxDEV('div', { style: { fontWeight: 'bold' }, children: invoice.customer_name}, void 0, false, {fileName: _jsxFileName, lineNumber: 559}, this), _jsxDEV('div', { children: invoice.customer_address}, void 0, false, {fileName: _jsxFileName, lineNumber: 559}, this), _jsxDEV('div', { children: invoice.customer_mobile}, void 0, false, {fileName: _jsxFileName, lineNumber: 559}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 559}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top' }, children: invoice.ship_to}, void 0, false, {fileName: _jsxFileName, lineNumber: 560}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top' }, children: [_jsxDEV('div', { children: ["Transport Name: "  , invoice.transport_name]}, void 0, true, {fileName: _jsxFileName, lineNumber: 561}, this), _jsxDEV('div', { children: ["Vehicle Number: "  , invoice.vehicle_number]}, void 0, true, {fileName: _jsxFileName, lineNumber: 561}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 561}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', textAlign: 'right' }, children: [_jsxDEV('div', { children: ["Invoice No. : "   , invoice.invoice_no]}, void 0, true, {fileName: _jsxFileName, lineNumber: 562}, this), _jsxDEV('div', { children: ["Date : "  , formatDate(invoice.invoice_date)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 562}, this), _jsxDEV('div', { children: ["Due Date : "   , formatDate(invoice.due_date)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 562}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 562}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 558}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 551}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 550}, this)
      , _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none' }, children: [
        _jsxDEV('thead', { children: 
          _jsxDEV('tr', { style: { backgroundColor: '#f3f3f3' }, children: [
            _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', width: '4%' }, children: "#"}, void 0, false, {fileName: _jsxFileName, lineNumber: 569}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'left', width: '22%' }, children: "Item name" }, void 0, false, {fileName: _jsxFileName, lineNumber: 570}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', width: '9%' }, children: "HSN/SAC"}, void 0, false, {fileName: _jsxFileName, lineNumber: 571}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', width: '7%' }, children: "Qty"}, void 0, false, {fileName: _jsxFileName, lineNumber: 572}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', width: '7%' }, children: "Unit"}, void 0, false, {fileName: _jsxFileName, lineNumber: 573}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', width: '9%' }, children: "Price/Unit"}, void 0, false, {fileName: _jsxFileName, lineNumber: 574}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', width: '10%' }, children: "Taxable"}, void 0, false, {fileName: _jsxFileName, lineNumber: 575}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', width: '11%' }, children: "CGST"}, void 0, false, {fileName: _jsxFileName, lineNumber: 576}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', width: '11%' }, children: "SGST"}, void 0, false, {fileName: _jsxFileName, lineNumber: 577}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', width: '10%' }, children: "Amount"}, void 0, false, {fileName: _jsxFileName, lineNumber: 578}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 568}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 567}, this)
        , _jsxDEV('tbody', { children: [
          items.map((item, idx) => (
            _jsxDEV('tr', { children: [
              _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center' }, children: idx + 1}, void 0, false, {fileName: _jsxFileName, lineNumber: 584}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', fontWeight: 'bold' }, children: item.item_name}, void 0, false, {fileName: _jsxFileName, lineNumber: 585}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center' }, children: item.hsn_code}, void 0, false, {fileName: _jsxFileName, lineNumber: 586}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center' }, children: item.quantity}, void 0, false, {fileName: _jsxFileName, lineNumber: 587}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center' }, children: item.unit}, void 0, false, {fileName: _jsxFileName, lineNumber: 588}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(item.price_per_unit)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 589}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(item.taxable_amount)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 590}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(item.cgst_amount), " (" , item.cgst_rate, "%)"]}, void 0, true, {fileName: _jsxFileName, lineNumber: 591}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(item.sgst_amount), " (" , item.sgst_rate, "%)"]}, void 0, true, {fileName: _jsxFileName, lineNumber: 592}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(item.amount)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 593}, this)
            ]}, idx, true, {fileName: _jsxFileName, lineNumber: 583}, this)
          ))
          , _jsxDEV('tr', { style: { fontWeight: 'bold', backgroundColor: '#f3f3f3' }, children: [
            _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 597}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px' }, children: "Total"}, void 0, false, {fileName: _jsxFileName, lineNumber: 598}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 599}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center' }, children: totalQty}, void 0, false, {fileName: _jsxFileName, lineNumber: 600}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 601}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 602}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(invoice.taxable_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 603}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(invoice.cgst_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 604}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(invoice.sgst_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 605}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(invoice.sub_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 606}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 596}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 581}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 566}, this)
      , _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none' }, children: 
        _jsxDEV('tbody', { children: 
          _jsxDEV('tr', { children: [
            _jsxDEV('td', { style: { border: '1px solid #000', padding: '0', verticalAlign: 'top', width: '55%' }, children: 
              _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse' }, children: [
                _jsxDEV('thead', { children: _jsxDEV('tr', { style: { backgroundColor: '#f3f3f3' }, children: [_jsxDEV('th', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'left' }, children: "Tax type" }, void 0, false, {fileName: _jsxFileName, lineNumber: 615}, this), _jsxDEV('th', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right' }, children: "Taxable amount" }, void 0, false, {fileName: _jsxFileName, lineNumber: 615}, this), _jsxDEV('th', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'center' }, children: "Rate"}, void 0, false, {fileName: _jsxFileName, lineNumber: 615}, this), _jsxDEV('th', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right' }, children: "Tax amount" }, void 0, false, {fileName: _jsxFileName, lineNumber: 615}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 615}, this)}, void 0, false, {fileName: _jsxFileName, lineNumber: 615}, this)
                , _jsxDEV('tbody', { children: taxRows.map((r, i) => _jsxDEV('tr', { children: [_jsxDEV('td', { style: { border: '1px solid #ccc', padding: '3px 5px' }, children: r.type}, void 0, false, {fileName: _jsxFileName, lineNumber: 616}, this), _jsxDEV('td', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right' }, children: ["₹ " , formatCurrency(r.taxable)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 616}, this), _jsxDEV('td', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'center' }, children: [r.rate, "%"]}, void 0, true, {fileName: _jsxFileName, lineNumber: 616}, this), _jsxDEV('td', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right' }, children: ["₹ " , formatCurrency(r.tax)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 616}, this)]}, i, true, {fileName: _jsxFileName, lineNumber: 616}, this))}, void 0, false, {fileName: _jsxFileName, lineNumber: 616}, this)
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 614}, this)
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 613}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '45%' }, children: 
              _jsxDEV('table', { style: { width: '100%' }, children: [_jsxDEV('thead', { children: _jsxDEV('tr', { style: { backgroundColor: '#f3f3f3' }, children: [_jsxDEV('th', { style: { textAlign: 'left', padding: '2px 4px' }, children: "Amounts"}, void 0, false, {fileName: _jsxFileName, lineNumber: 620}, this), _jsxDEV('th', {}, void 0, false, {fileName: _jsxFileName, lineNumber: 620}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this)}, void 0, false, {fileName: _jsxFileName, lineNumber: 620}, this), _jsxDEV('tbody', { children: [_jsxDEV('tr', { children: [_jsxDEV('td', { style: { padding: '2px 4px' }, children: "Sub Total" }, void 0, false, {fileName: _jsxFileName, lineNumber: 620}, this), _jsxDEV('td', { style: { textAlign: 'right', padding: '2px 4px' }, children: ["₹ " , formatCurrency(invoice.sub_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this), _jsxDEV('tr', { children: [_jsxDEV('td', { style: { padding: '2px 4px' }, children: "Round off" }, void 0, false, {fileName: _jsxFileName, lineNumber: 620}, this), _jsxDEV('td', { style: { textAlign: 'right', padding: '2px 4px' }, children: ["₹ " , formatCurrency(invoice.round_off)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this), _jsxDEV('tr', { style: { fontWeight: 'bold' }, children: [_jsxDEV('td', { style: { padding: '2px 4px' }, children: "Total"}, void 0, false, {fileName: _jsxFileName, lineNumber: 620}, this), _jsxDEV('td', { style: { textAlign: 'right', padding: '2px 4px' }, children: ["₹ " , formatCurrency(invoice.grand_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this), _jsxDEV('tr', { children: [_jsxDEV('td', { style: { padding: '2px 4px' }, children: "Received"}, void 0, false, {fileName: _jsxFileName, lineNumber: 620}, this), _jsxDEV('td', { style: { textAlign: 'right', padding: '2px 4px' }, children: ["₹ " , formatCurrency(invoice.received_amount)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 620}, this)
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 619}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 612}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 611}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 610}, this)
      , _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none' }, children: 
        _jsxDEV('tbody', { children: _jsxDEV('tr', { children: [_jsxDEV('td', { style: { border: '1px solid #000', padding: '2px 5px', width: '55%' }, children: [_jsxDEV('div', { style: { backgroundColor: '#f3f3f3', fontWeight: 'bold', padding: '2px 3px', marginBottom: '2px' }, children: "Invoice Amount In Words"   }, void 0, false, {fileName: _jsxFileName, lineNumber: 626}, this), _jsxDEV('div', { style: { padding: '2px 3px' }, children: numberToWords(invoice.grand_total)}, void 0, false, {fileName: _jsxFileName, lineNumber: 626}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 626}, this), _jsxDEV('td', { style: { border: '1px solid #000', padding: '2px 5px', width: '45%', textAlign: 'center' }, children: [_jsxDEV('div', { style: { backgroundColor: '#f3f3f3', fontWeight: 'bold', padding: '2px 3px', marginBottom: '2px' }, children: "Payment mode" }, void 0, false, {fileName: _jsxFileName, lineNumber: 626}, this), _jsxDEV('div', { style: { padding: '2px 3px' }, children: invoice.payment_mode}, void 0, false, {fileName: _jsxFileName, lineNumber: 626}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 626}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 626}, this)}, void 0, false, {fileName: _jsxFileName, lineNumber: 626}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 625}, this)
      , _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none' }, children: 
        _jsxDEV('tbody', { children: _jsxDEV('tr', { children: [
          _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '40%' }, children: [_jsxDEV('div', { style: { fontWeight: 'bold', marginBottom: '3px', backgroundColor: '#f3f3f3', padding: '2px 3px' }, children: "Bank Details" }, void 0, false, {fileName: _jsxFileName, lineNumber: 630}, this), _jsxDEV('div', { children: ["Name : "  , settings.bank_name]}, void 0, true, {fileName: _jsxFileName, lineNumber: 630}, this), _jsxDEV('div', { children: ["Account No. : "   , settings.account_no]}, void 0, true, {fileName: _jsxFileName, lineNumber: 630}, this), _jsxDEV('div', { children: ["IFSC code : "   , settings.ifsc_code]}, void 0, true, {fileName: _jsxFileName, lineNumber: 630}, this), _jsxDEV('div', { children: ["Account holder's name : "    , settings.account_holder]}, void 0, true, {fileName: _jsxFileName, lineNumber: 630}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 630}, this)
          , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '35%' }, children: [_jsxDEV('div', { style: { fontWeight: 'bold', marginBottom: '3px', backgroundColor: '#f3f3f3', padding: '2px 3px' }, children: "Terms and Conditions"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 631}, this), _jsxDEV('div', { style: { whiteSpace: 'pre-wrap', fontSize: '10px' }, children: settings.terms}, void 0, false, {fileName: _jsxFileName, lineNumber: 631}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 631}, this)
          , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '25%', textAlign: 'center' }, children: [_jsxDEV('div', { style: { textAlign: 'right', marginBottom: '4px', fontSize: '10px' }, children: ["For : "  , settings.business_name]}, void 0, true, {fileName: _jsxFileName, lineNumber: 632}, this), _jsxDEV('div', { style: { minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: settings.signature_url && _jsxDEV('img', { src: settings.signature_url, alt: "sig", style: { maxHeight: '40px', maxWidth: '100px', objectFit: 'contain' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 632}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 632}, this), _jsxDEV('div', { style: { marginTop: '4px', fontWeight: 'bold', fontSize: '10px', borderTop: '1px solid #000', paddingTop: '2px' }, children: "Authorized Signatory" }, void 0, false, {fileName: _jsxFileName, lineNumber: 632}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 632}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 629}, this)}, void 0, false, {fileName: _jsxFileName, lineNumber: 629}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 628}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 533}, this)
  );
}

