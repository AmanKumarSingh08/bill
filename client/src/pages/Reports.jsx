const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { BarChart2, Download } from 'lucide-react';






export default function Reports() {
  const { user } = useAuth();
  const [from, setFrom] = useState(() => { const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0]; });
  const [to, setTo] = useState(new Date().toISOString().split('T')[0]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('invoices').select('id,invoice_no,customer_name,invoice_date,taxable_total,cgst_total,sgst_total,grand_total,status')
      .eq('user_id', user.id).eq('is_draft', false).gte('invoice_date', from).lte('invoice_date', to).order('invoice_date');
    setInvoices(_nullishCoalesce(data, () => ( [])));
    setLoading(false);
  };

  useEffect(() => { load(); }, [from, to, user]);

  const totalTaxable = invoices.reduce((s, i) => s + i.taxable_total, 0);
  const totalCgst = invoices.reduce((s, i) => s + i.cgst_total, 0);
  const totalSgst = invoices.reduce((s, i) => s + i.sgst_total, 0);
  const totalGrand = invoices.reduce((s, i) => s + i.grand_total, 0);

  const exportCSV = () => {
    const rows = [
      ['Invoice No', 'Customer', 'Date', 'Taxable', 'CGST', 'SGST', 'Total', 'Status'],
      ...invoices.map(i => [i.invoice_no, i.customer_name, formatDate(i.invoice_date), i.taxable_total, i.cgst_total, i.sgst_total, i.grand_total, i.status]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_report_${from}_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    _jsxDEV('div', { className: "space-y-5", children: [
      _jsxDEV('div', { className: "flex items-center justify-between"  , children: 
        _jsxDEV('h1', { className: "text-xl font-bold text-gray-800"  , children: "Reports"}, void 0, false, {fileName: _jsxFileName, lineNumber: 53}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 52}, this)

      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsxDEV('div', { className: "flex flex-wrap items-center gap-4 mb-5"    , children: [
          _jsxDEV('div', { children: [
            _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "From"}, void 0, false, {fileName: _jsxFileName, lineNumber: 59}, this)
            , _jsxDEV('input', { type: "date", value: from, onChange: e => setFrom(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"        ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 60}, this )
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 58}, this)
          , _jsxDEV('div', { children: [
            _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "To"}, void 0, false, {fileName: _jsxFileName, lineNumber: 63}, this)
            , _jsxDEV('input', { type: "date", value: to, onChange: e => setTo(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"        ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 64}, this )
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 62}, this)
          , _jsxDEV('button', { onClick: exportCSV, className: "flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 mt-4"          , children: [
            _jsxDEV(Download, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 67}, this ), " Export CSV"
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 66}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 57}, this)

        /* Summary cards */
        , _jsxDEV('div', { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"    , children: 
          [
            { label: 'Invoices', value: invoices.length.toString(), color: 'text-sky-600' },
            { label: 'Taxable Amount', value: `₹${formatCurrency(totalTaxable)}`, color: 'text-gray-800' },
            { label: 'Total GST (CGST+SGST)', value: `₹${formatCurrency(totalCgst + totalSgst)}`, color: 'text-amber-600' },
            { label: 'Grand Total', value: `₹${formatCurrency(totalGrand)}`, color: 'text-emerald-600' },
          ].map(c => (
            _jsxDEV('div', { className: "bg-gray-50 rounded-lg p-4"  , children: [
              _jsxDEV('p', { className: "text-xs text-gray-500 mb-1"  , children: c.label}, void 0, false, {fileName: _jsxFileName, lineNumber: 80}, this)
              , _jsxDEV('p', { className: `text-lg font-bold ${c.color}`, children: c.value}, void 0, false, {fileName: _jsxFileName, lineNumber: 81}, this)
            ]}, c.label, true, {fileName: _jsxFileName, lineNumber: 79}, this)
          ))
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 72}, this)

        /* GST Summary */
        , _jsxDEV('div', { className: "mb-5 bg-amber-50 rounded-lg p-4"   , children: [
          _jsxDEV('div', { className: "flex items-center gap-2 mb-3"   , children: [
            _jsxDEV(BarChart2, { className: "w-4 h-4 text-amber-600"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 89}, this )
            , _jsxDEV('h3', { className: "font-semibold text-gray-700 text-sm"  , children: "GST Summary" }, void 0, false, {fileName: _jsxFileName, lineNumber: 90}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 88}, this)
          , _jsxDEV('div', { className: "grid grid-cols-3 gap-4 text-sm"   , children: [
            _jsxDEV('div', { children: [_jsxDEV('p', { className: "text-gray-500 text-xs" , children: "CGST"}, void 0, false, {fileName: _jsxFileName, lineNumber: 93}, this), _jsxDEV('p', { className: "font-medium", children: ["₹", formatCurrency(totalCgst)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 93}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 93}, this)
            , _jsxDEV('div', { children: [_jsxDEV('p', { className: "text-gray-500 text-xs" , children: "SGST"}, void 0, false, {fileName: _jsxFileName, lineNumber: 94}, this), _jsxDEV('p', { className: "font-medium", children: ["₹", formatCurrency(totalSgst)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 94}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 94}, this)
            , _jsxDEV('div', { children: [_jsxDEV('p', { className: "text-gray-500 text-xs" , children: "Total GST" }, void 0, false, {fileName: _jsxFileName, lineNumber: 95}, this), _jsxDEV('p', { className: "font-medium text-amber-700" , children: ["₹", formatCurrency(totalCgst + totalSgst)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 95}, this)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 95}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 92}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 87}, this)

        /* Invoice table */
        , loading ? (
          _jsxDEV('div', { className: "flex justify-center py-8"  , children: _jsxDEV('div', { className: "animate-spin w-6 h-6 border-4 border-sky-500 border-t-transparent rounded-full"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 101}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 101}, this)
        ) : (
          _jsxDEV('div', { className: "overflow-x-auto", children: [
            _jsxDEV('table', { className: "w-full text-sm" , children: [
              _jsxDEV('thead', { children: 
                _jsxDEV('tr', { className: "border-b border-gray-100" , children: [
                  _jsxDEV('th', { className: "text-left py-2 text-gray-500 font-medium"   , children: "Invoice No" }, void 0, false, {fileName: _jsxFileName, lineNumber: 107}, this)
                  , _jsxDEV('th', { className: "text-left py-2 text-gray-500 font-medium"   , children: "Customer"}, void 0, false, {fileName: _jsxFileName, lineNumber: 108}, this)
                  , _jsxDEV('th', { className: "text-left py-2 text-gray-500 font-medium"   , children: "Date"}, void 0, false, {fileName: _jsxFileName, lineNumber: 109}, this)
                  , _jsxDEV('th', { className: "text-right py-2 text-gray-500 font-medium"   , children: "Taxable"}, void 0, false, {fileName: _jsxFileName, lineNumber: 110}, this)
                  , _jsxDEV('th', { className: "text-right py-2 text-gray-500 font-medium"   , children: "CGST"}, void 0, false, {fileName: _jsxFileName, lineNumber: 111}, this)
                  , _jsxDEV('th', { className: "text-right py-2 text-gray-500 font-medium"   , children: "SGST"}, void 0, false, {fileName: _jsxFileName, lineNumber: 112}, this)
                  , _jsxDEV('th', { className: "text-right py-2 text-gray-500 font-medium"   , children: "Total"}, void 0, false, {fileName: _jsxFileName, lineNumber: 113}, this)
                  , _jsxDEV('th', { className: "text-center py-2 text-gray-500 font-medium"   , children: "Status"}, void 0, false, {fileName: _jsxFileName, lineNumber: 114}, this)
                ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 106}, this)
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 105}, this)
              , _jsxDEV('tbody', { children: 
                invoices.map(i => (
                  _jsxDEV('tr', { className: "border-b border-gray-50 hover:bg-gray-50"  , children: [
                    _jsxDEV('td', { className: "py-2.5 text-sky-600 font-medium"  , children: i.invoice_no}, void 0, false, {fileName: _jsxFileName, lineNumber: 120}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-gray-700" , children: i.customer_name}, void 0, false, {fileName: _jsxFileName, lineNumber: 121}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-gray-500" , children: formatDate(i.invoice_date)}, void 0, false, {fileName: _jsxFileName, lineNumber: 122}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-right text-gray-700"  , children: ["₹", formatCurrency(i.taxable_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 123}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-right text-gray-600"  , children: ["₹", formatCurrency(i.cgst_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 124}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-right text-gray-600"  , children: ["₹", formatCurrency(i.sgst_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 125}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-right font-medium text-gray-800"   , children: ["₹", formatCurrency(i.grand_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 126}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-center" , children: 
                      _jsxDEV('span', { className: `px-2 py-0.5 rounded-full text-xs font-medium ${i.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`, children: i.status}, void 0, false, {fileName: _jsxFileName, lineNumber: 128}, this)
                    }, void 0, false, {fileName: _jsxFileName, lineNumber: 127}, this)
                  ]}, i.id, true, {fileName: _jsxFileName, lineNumber: 119}, this)
                ))
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 117}, this)
              , invoices.length > 0 && (
                _jsxDEV('tfoot', { children: 
                  _jsxDEV('tr', { className: "border-t-2 border-gray-300 font-bold"  , children: [
                    _jsxDEV('td', { colSpan: 3, className: "py-2.5 text-gray-700" , children: ["Total (" , invoices.length, " invoices)" ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 136}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-right text-gray-800"  , children: ["₹", formatCurrency(totalTaxable)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 137}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-right text-gray-800"  , children: ["₹", formatCurrency(totalCgst)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 138}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-right text-gray-800"  , children: ["₹", formatCurrency(totalSgst)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 139}, this)
                    , _jsxDEV('td', { className: "py-2.5 text-right text-gray-800"  , children: ["₹", formatCurrency(totalGrand)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 140}, this)
                    , _jsxDEV('td', {}, void 0, false, {fileName: _jsxFileName, lineNumber: 141}, this)
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 135}, this)
                }, void 0, false, {fileName: _jsxFileName, lineNumber: 134}, this)
              )
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 104}, this)
            , invoices.length === 0 && _jsxDEV('div', { className: "text-center py-10 text-gray-400 text-sm"   , children: "No invoices in selected period"    }, void 0, false, {fileName: _jsxFileName, lineNumber: 146}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 103}, this)
        )
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 56}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 51}, this)
  );
}
