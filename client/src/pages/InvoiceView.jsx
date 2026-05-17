const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { supabase } from '../lib/supabase';
import { useSettings } from '../contexts/SettingsContext';

import InvoicePrint from '../components/InvoicePrint';
import { Printer, Download, MessageCircle, CreditCard as Edit, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const printRef = useRef(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('invoices').select('*, invoice_items(*)').eq('id', id).maybeSingle()
      .then(({ data }) => { setInvoice(data); setLoading(false); });
  }, [id]);

  const handlePrint = useReactToPrint({ contentRef: printRef });

  const handlePDF = async () => {
    if (!printRef.current || !invoice) return;
    setPdfLoading(true);
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, w, h);
      pdf.save(`Invoice_${invoice.invoice_no.replace(/\//g, '_')}.pdf`);
    } catch (e) { /* ignore */ }
    setPdfLoading(false);
  };

  const handleWhatsApp = () => {
    if (!_optionalChain([invoice, 'optionalAccess', _ => _.customer_mobile])) return;
    const msg = encodeURIComponent(`Hello ${invoice.customer_name},\n\nYour Invoice ${invoice.invoice_no} from ${settings.business_name} is ready.\n\nTotal Amount: ₹${formatCurrency(invoice.grand_total)}\n\nThank you!`);
    const phone = invoice.customer_mobile.replace(/\D/g, '');
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
  };

  if (loading) return _jsxDEV('div', { className: "flex justify-center py-20"  , children: _jsxDEV('div', { className: "animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 52}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 52}, this);
  if (!invoice) return _jsxDEV('div', { className: "text-center py-20 text-gray-500"  , children: "Invoice not found"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 53}, this);

  return (
    _jsxDEV('div', { className: "space-y-4", children: [
      _jsxDEV('div', { className: "flex flex-wrap items-center justify-between gap-3"    , children: [
        _jsxDEV('div', { className: "flex items-center gap-3"  , children: [
          _jsxDEV('button', { onClick: () => navigate('/invoices'), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors"   , children: 
            _jsxDEV(ArrowLeft, { className: "w-5 h-5 text-gray-600"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 60}, this )
          }, void 0, false, {fileName: _jsxFileName, lineNumber: 59}, this)
          , _jsxDEV('h1', { className: "text-xl font-bold text-gray-800"  , children: invoice.invoice_no}, void 0, false, {fileName: _jsxFileName, lineNumber: 62}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 58}, this)
        , _jsxDEV('div', { className: "flex flex-wrap gap-2"  , children: [
          _jsxDEV('button', { onClick: () => handlePrint(), className: "flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"         , children: [
            _jsxDEV(Printer, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 66}, this ), " Print"
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 65}, this)
          , _jsxDEV('button', { onClick: handlePDF, disabled: pdfLoading, className: "flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"          , children: [
            _jsxDEV(Download, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 69}, this ), " " , pdfLoading ? 'Generating...' : 'PDF'
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 68}, this)
          , _jsxDEV('button', { onClick: handleWhatsApp, className: "flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"         , children: [
            _jsxDEV(MessageCircle, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 72}, this ), " WhatsApp"
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 71}, this)
          , _jsxDEV(Link, { to: `/invoices/${id}/edit`, className: "flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium"          , children: [
            _jsxDEV(Edit, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 75}, this ), " Edit"
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 74}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 64}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 57}, this)

      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm overflow-x-auto p-4"    , children: 
        _jsxDEV('div', { className: "border border-gray-200" , children: 
          _jsxDEV(InvoicePrint, { ref: printRef, invoice: invoice, settings: settings,}, void 0, false, {fileName: _jsxFileName, lineNumber: 82}, this )
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 81}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 80}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 56}, this)
  );
}
