const _jsxFileName = "";import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

import { Plus, Search, CreditCard as Edit, Trash2, X, AlertTriangle } from 'lucide-react';

const emptyProduct = {
  name: '', hsn_code: '', unit: 'Pcs', sale_price: 0, purchase_price: 0,
  cgst_rate: 2.5, sgst_rate: 2.5, igst_rate: 0, stock_quantity: 0, low_stock_alert: 5,
};

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyProduct });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('products').select('*').eq('user_id', user.id).order('name');
    setProducts(_nullishCoalesce(data, () => ( [])));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const openCreate = () => { setEditing(null); setForm({ ...emptyProduct }); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, hsn_code: p.hsn_code, unit: p.unit, sale_price: p.sale_price, purchase_price: p.purchase_price, cgst_rate: p.cgst_rate, sgst_rate: p.sgst_rate, igst_rate: p.igst_rate, stock_quantity: p.stock_quantity, low_stock_alert: p.low_stock_alert });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!user) { alert('You are not logged in.'); return; }
    if (!form.name) { alert('Name is required.'); return; }
    setSaving(true);
    try {
      const res = editing
        ? await supabase.from('products').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
        : await supabase.from('products').insert({ ...form, user_id: user.id });
      if (res && res.error) throw res.error;
      setModalOpen(false);
      await load();
    } catch (e) {
      console.error('Save product failed:', e);
      alert('Save failed: ' + (e && e.message ? e.message : 'Unknown error. Make sure the API server is running and reachable.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.hsn_code.includes(search)
  );

  return (
    _jsx('div', { className: "space-y-4", children: [
      _jsx('div', { className: "flex flex-wrap items-center justify-between gap-3"    , children: [
        _jsx('h1', { className: "text-xl font-bold text-gray-800"  , children: "Products / Items"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 66}, this)
        , _jsx('button', { onClick: openCreate, className: "flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"           , children: [
          _jsx(Plus, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 68}, this ), " Add Product"
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 67}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 65}, this)

      , _jsx('div', { className: "bg-white rounded-xl shadow-sm p-4"   , children: [
        _jsx('div', { className: "relative mb-4" , children: [
          _jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 74}, this )
          , _jsx('input', { value: search, onChange: e => setSearch(e.target.value), placeholder: "Search products..." , className: "w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"          ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 75}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 73}, this)

        , loading ? (
          _jsx('div', { className: "flex justify-center py-10"  , children: _jsx('div', { className: "animate-spin w-6 h-6 border-4 border-sky-500 border-t-transparent rounded-full"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 79}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 79}, this)
        ) : (
          _jsx('div', { className: "overflow-x-auto", children: [
            _jsx('table', { className: "w-full text-sm" , children: [
              _jsx('thead', { children: 
                _jsx('tr', { className: "border-b border-gray-100" , children: [
                  _jsx('th', { className: "text-left py-3 text-gray-500 font-medium"   , children: "Name"}, void 0, false, {fileName: _jsxFileName, lineNumber: 85}, this)
                  , _jsx('th', { className: "text-left py-3 text-gray-500 font-medium"   , children: "HSN"}, void 0, false, {fileName: _jsxFileName, lineNumber: 86}, this)
                  , _jsx('th', { className: "text-center py-3 text-gray-500 font-medium"   , children: "Unit"}, void 0, false, {fileName: _jsxFileName, lineNumber: 87}, this)
                  , _jsx('th', { className: "text-right py-3 text-gray-500 font-medium"   , children: "Sale Price" }, void 0, false, {fileName: _jsxFileName, lineNumber: 88}, this)
                  , _jsx('th', { className: "text-center py-3 text-gray-500 font-medium"   , children: "GST%"}, void 0, false, {fileName: _jsxFileName, lineNumber: 89}, this)
                  , _jsx('th', { className: "text-center py-3 text-gray-500 font-medium"   , children: "Stock"}, void 0, false, {fileName: _jsxFileName, lineNumber: 90}, this)
                  , _jsx('th', { className: "text-center py-3 text-gray-500 font-medium"   , children: "Actions"}, void 0, false, {fileName: _jsxFileName, lineNumber: 91}, this)
                ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 84}, this)
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 83}, this)
              , _jsx('tbody', { children: 
                filtered.map(p => (
                  _jsx('tr', { className: "border-b border-gray-50 hover:bg-gray-50"  , children: [
                    _jsx('td', { className: "py-3 font-medium text-gray-800"  , children: p.name}, void 0, false, {fileName: _jsxFileName, lineNumber: 97}, this)
                    , _jsx('td', { className: "py-3 text-gray-500 font-mono text-xs"   , children: p.hsn_code}, void 0, false, {fileName: _jsxFileName, lineNumber: 98}, this)
                    , _jsx('td', { className: "py-3 text-center text-gray-600"  , children: p.unit}, void 0, false, {fileName: _jsxFileName, lineNumber: 99}, this)
                    , _jsx('td', { className: "py-3 text-right text-gray-800"  , children: ["₹", p.sale_price.toFixed(2)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 100}, this)
                    , _jsx('td', { className: "py-3 text-center text-gray-600"  , children: [p.cgst_rate + p.sgst_rate, "%"]}, void 0, true, {fileName: _jsxFileName, lineNumber: 101}, this)
                    , _jsx('td', { className: "py-3 text-center" , children: 
                      _jsx('div', { className: "flex items-center justify-center gap-1"   , children: [
                        p.stock_quantity <= p.low_stock_alert && _jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-rose-500"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 104}, this )
                        , _jsx('span', { className: p.stock_quantity <= p.low_stock_alert ? 'text-rose-600 font-medium' : 'text-emerald-600', children: 
                          p.stock_quantity
                        }, void 0, false, {fileName: _jsxFileName, lineNumber: 105}, this)
                      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 103}, this)
                    }, void 0, false, {fileName: _jsxFileName, lineNumber: 102}, this)
                    , _jsx('td', { className: "py-3", children: 
                      _jsx('div', { className: "flex items-center justify-center gap-2"   , children: [
                        _jsx('button', { onClick: () => openEdit(p), className: "p-1.5 text-gray-400 hover:text-amber-600 transition-colors"   , children: _jsx(Edit, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 112}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 112}, this)
                        , _jsx('button', { onClick: () => handleDelete(p.id), className: "p-1.5 text-gray-400 hover:text-rose-600 transition-colors"   , children: _jsx(Trash2, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 113}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 113}, this)
                      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 111}, this)
                    }, void 0, false, {fileName: _jsxFileName, lineNumber: 110}, this)
                  ]}, p.id, true, {fileName: _jsxFileName, lineNumber: 96}, this)
                ))
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 94}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 82}, this)
            , filtered.length === 0 && _jsx('div', { className: "text-center py-10 text-gray-400 text-sm"   , children: "No products found"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 120}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 81}, this)
        )
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 72}, this)

      , modalOpen && (
        _jsx('div', { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"       , children: 
          _jsx('div', { className: "bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"      , children: [
            _jsx('div', { className: "flex items-center justify-between p-5 border-b sticky top-0 bg-white"       , children: [
              _jsx('h2', { className: "font-bold text-gray-800" , children: editing ? 'Edit Product' : 'Add Product'}, void 0, false, {fileName: _jsxFileName, lineNumber: 129}, this)
              , _jsx('button', { onClick: () => setModalOpen(false), className: "p-1 hover:bg-gray-100 rounded-lg"  , children: _jsx(X, { className: "w-5 h-5" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 130}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 130}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 128}, this)
            , _jsx('div', { className: "p-5 grid grid-cols-2 gap-3"   , children: [
              _jsx('div', { className: "col-span-2", children: [
                _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Name *" }, void 0, false, {fileName: _jsxFileName, lineNumber: 134}, this)
                , _jsx('input', { value: form.name, onChange: e => setForm(p => ({ ...p, name: e.target.value })), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 135}, this )
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 133}, this)
              , _jsx('div', { children: [
                _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "HSN/SAC Code" }, void 0, false, {fileName: _jsxFileName, lineNumber: 138}, this)
                , _jsx('input', { value: form.hsn_code, onChange: e => setForm(p => ({ ...p, hsn_code: e.target.value })), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 139}, this )
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 137}, this)
              , _jsx('div', { children: [
                _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Unit"}, void 0, false, {fileName: _jsxFileName, lineNumber: 142}, this)
                , _jsx('select', { value: form.unit, onChange: e => setForm(p => ({ ...p, unit: e.target.value })), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         , children: 
                  ['Pcs', 'Kg', 'Ltr', 'Bag', 'Box', 'Dozen', 'Meter'].map(u => _jsx('option', { children: u}, u, false, {fileName: _jsxFileName, lineNumber: 144}, this))
                }, void 0, false, {fileName: _jsxFileName, lineNumber: 143}, this)
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 141}, this)
              , _jsx('div', { children: [
                _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Sale Price (₹)"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 148}, this)
                , _jsx('input', { type: "number", value: form.sale_price, onChange: e => setForm(p => ({ ...p, sale_price: parseFloat(e.target.value) || 0 })), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 149}, this )
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 147}, this)
              , _jsx('div', { children: [
                _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Purchase Price (₹)"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 152}, this)
                , _jsx('input', { type: "number", value: form.purchase_price, onChange: e => setForm(p => ({ ...p, purchase_price: parseFloat(e.target.value) || 0 })), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 153}, this )
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 151}, this)
              , _jsx('div', { children: [
                _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "CGST %" }, void 0, false, {fileName: _jsxFileName, lineNumber: 156}, this)
                , _jsx('input', { type: "number", value: form.cgst_rate, onChange: e => setForm(p => ({ ...p, cgst_rate: parseFloat(e.target.value) || 0 })), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 157}, this )
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 155}, this)
              , _jsx('div', { children: [
                _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "SGST %" }, void 0, false, {fileName: _jsxFileName, lineNumber: 160}, this)
                , _jsx('input', { type: "number", value: form.sgst_rate, onChange: e => setForm(p => ({ ...p, sgst_rate: parseFloat(e.target.value) || 0 })), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 161}, this )
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 159}, this)
              , _jsx('div', { children: [
                _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Stock Quantity" }, void 0, false, {fileName: _jsxFileName, lineNumber: 164}, this)
                , _jsx('input', { type: "number", value: form.stock_quantity, onChange: e => setForm(p => ({ ...p, stock_quantity: parseFloat(e.target.value) || 0 })), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 165}, this )
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 163}, this)
              , _jsx('div', { children: [
                _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Low Stock Alert"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 168}, this)
                , _jsx('input', { type: "number", value: form.low_stock_alert, onChange: e => setForm(p => ({ ...p, low_stock_alert: parseFloat(e.target.value) || 0 })), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 169}, this )
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 167}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 132}, this)
            , _jsx('div', { className: "flex justify-end gap-3 p-5 border-t sticky bottom-0 bg-white"       , children: [
              _jsx('button', { onClick: () => setModalOpen(false), className: "px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"      , children: "Cancel"}, void 0, false, {fileName: _jsxFileName, lineNumber: 173}, this)
              , _jsx('button', { onClick: handleSave, disabled: saving || !form.name, className: "px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"        , children: 
                saving ? 'Saving...' : 'Save'
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 174}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 172}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 127}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 126}, this)
      )
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 64}, this)
  );
}
