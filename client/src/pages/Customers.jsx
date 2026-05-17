const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

import { Plus, Search, CreditCard as Edit, Trash2, X } from 'lucide-react';

const emptyCustomer = {
  name: '', mobile: '', address: '', gstin: '', state: '', outstanding_balance: 0,
};

export default function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyCustomer });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('customers').select('*').eq('user_id', user.id).order('name');
    setCustomers(_nullishCoalesce(data, () => ( [])));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const openCreate = () => { setEditing(null); setForm({ ...emptyCustomer }); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, mobile: c.mobile, address: c.address, gstin: c.gstin, state: c.state, outstanding_balance: c.outstanding_balance }); setModalOpen(true); };

  const handleSave = async () => {
    if (!user) { alert('You are not logged in.'); return; }
    if (!form.name) { alert('Name is required.'); return; }
    setSaving(true);
    try {
      const res = editing
        ? await supabase.from('customers').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
        : await supabase.from('customers').insert({ ...form, user_id: user.id });
      if (res && res.error) throw res.error;
      setModalOpen(false);
      await load();
    } catch (e) {
      console.error('Save customer failed:', e);
      alert('Save failed: ' + (e && e.message ? e.message : 'Unknown error. Make sure the API server is running and reachable.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    await supabase.from('customers').delete().eq('id', id);
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search)
  );

  return (
    _jsxDEV('div', { className: "space-y-4", children: [
      _jsxDEV('div', { className: "flex flex-wrap items-center justify-between gap-3"    , children: [
        _jsxDEV('h1', { className: "text-xl font-bold text-gray-800"  , children: "Customers"}, void 0, false, {fileName: _jsxFileName, lineNumber: 61}, this)
        , _jsxDEV('button', { onClick: openCreate, className: "flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"           , children: [
          _jsxDEV(Plus, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 63}, this ), " Add Customer"
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 62}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 60}, this)

      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-4"   , children: [
        _jsxDEV('div', { className: "relative mb-4" , children: [
          _jsxDEV(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 69}, this )
          , _jsxDEV('input', { value: search, onChange: e => setSearch(e.target.value), placeholder: "Search customers..." , className: "w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"          ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 70}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 68}, this)

        , loading ? (
          _jsxDEV('div', { className: "flex justify-center py-10"  , children: _jsxDEV('div', { className: "animate-spin w-6 h-6 border-4 border-sky-500 border-t-transparent rounded-full"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 74}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 74}, this)
        ) : (
          _jsxDEV('div', { className: "overflow-x-auto", children: [
            _jsxDEV('table', { className: "w-full text-sm" , children: [
              _jsxDEV('thead', { children: 
                _jsxDEV('tr', { className: "border-b border-gray-100" , children: [
                  _jsxDEV('th', { className: "text-left py-3 text-gray-500 font-medium"   , children: "Name"}, void 0, false, {fileName: _jsxFileName, lineNumber: 80}, this)
                  , _jsxDEV('th', { className: "text-left py-3 text-gray-500 font-medium"   , children: "Mobile"}, void 0, false, {fileName: _jsxFileName, lineNumber: 81}, this)
                  , _jsxDEV('th', { className: "text-left py-3 text-gray-500 font-medium"   , children: "Address"}, void 0, false, {fileName: _jsxFileName, lineNumber: 82}, this)
                  , _jsxDEV('th', { className: "text-left py-3 text-gray-500 font-medium"   , children: "GSTIN"}, void 0, false, {fileName: _jsxFileName, lineNumber: 83}, this)
                  , _jsxDEV('th', { className: "text-right py-3 text-gray-500 font-medium"   , children: "Outstanding"}, void 0, false, {fileName: _jsxFileName, lineNumber: 84}, this)
                  , _jsxDEV('th', { className: "text-center py-3 text-gray-500 font-medium"   , children: "Actions"}, void 0, false, {fileName: _jsxFileName, lineNumber: 85}, this)
                ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 79}, this)
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 78}, this)
              , _jsxDEV('tbody', { children: 
                filtered.map(c => (
                  _jsxDEV('tr', { className: "border-b border-gray-50 hover:bg-gray-50"  , children: [
                    _jsxDEV('td', { className: "py-3 font-medium text-gray-800"  , children: c.name}, void 0, false, {fileName: _jsxFileName, lineNumber: 91}, this)
                    , _jsxDEV('td', { className: "py-3 text-gray-600" , children: c.mobile}, void 0, false, {fileName: _jsxFileName, lineNumber: 92}, this)
                    , _jsxDEV('td', { className: "py-3 text-gray-500 max-w-xs truncate"   , children: c.address}, void 0, false, {fileName: _jsxFileName, lineNumber: 93}, this)
                    , _jsxDEV('td', { className: "py-3 text-gray-500 font-mono text-xs"   , children: c.gstin}, void 0, false, {fileName: _jsxFileName, lineNumber: 94}, this)
                    , _jsxDEV('td', { className: "py-3 text-right" , children: 
                      _jsxDEV('span', { className: c.outstanding_balance > 0 ? 'text-amber-600 font-medium' : 'text-gray-500', children: ["₹"
                        , c.outstanding_balance.toFixed(2)
                      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 96}, this)
                    }, void 0, false, {fileName: _jsxFileName, lineNumber: 95}, this)
                    , _jsxDEV('td', { className: "py-3", children: 
                      _jsxDEV('div', { className: "flex items-center justify-center gap-2"   , children: [
                        _jsxDEV('button', { onClick: () => openEdit(c), className: "p-1.5 text-gray-400 hover:text-amber-600 transition-colors"   , children: _jsxDEV(Edit, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 102}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 102}, this)
                        , _jsxDEV('button', { onClick: () => handleDelete(c.id), className: "p-1.5 text-gray-400 hover:text-rose-600 transition-colors"   , children: _jsxDEV(Trash2, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 103}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 103}, this)
                      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 101}, this)
                    }, void 0, false, {fileName: _jsxFileName, lineNumber: 100}, this)
                  ]}, c.id, true, {fileName: _jsxFileName, lineNumber: 90}, this)
                ))
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 88}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 77}, this)
            , filtered.length === 0 && _jsxDEV('div', { className: "text-center py-10 text-gray-400 text-sm"   , children: "No customers found"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 110}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 76}, this)
        )
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 67}, this)

      /* Modal */
      , modalOpen && (
        _jsxDEV('div', { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"       , children: 
          _jsxDEV('div', { className: "bg-white rounded-xl shadow-2xl w-full max-w-md"    , children: [
            _jsxDEV('div', { className: "flex items-center justify-between p-5 border-b"    , children: [
              _jsxDEV('h2', { className: "font-bold text-gray-800" , children: editing ? 'Edit Customer' : 'Add Customer'}, void 0, false, {fileName: _jsxFileName, lineNumber: 120}, this)
              , _jsxDEV('button', { onClick: () => setModalOpen(false), className: "p-1 hover:bg-gray-100 rounded-lg"  , children: _jsxDEV(X, { className: "w-5 h-5" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 121}, this )}, void 0, false, {fileName: _jsxFileName, lineNumber: 121}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 119}, this)
            , _jsxDEV('div', { className: "p-5 space-y-3" , children: [
              (['name', 'mobile', 'address', 'gstin', 'state'] ).map(f => (
                _jsxDEV('div', { children: [
                  _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-1 capitalize"     , children: [f, f === 'name' && ' *']}, void 0, true, {fileName: _jsxFileName, lineNumber: 126}, this)
                  , _jsxDEV('input', { value: (form )[f] , onChange: e => setForm(p => ({ ...p, [f]: e.target.value })),
                    className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 127}, this )
                ]}, f, true, {fileName: _jsxFileName, lineNumber: 125}, this)
              ))
              , _jsxDEV('div', { children: [
                _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: "Outstanding Balance (₹)"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 132}, this)
                , _jsxDEV('input', { type: "number", value: form.outstanding_balance, onChange: e => setForm(p => ({ ...p, outstanding_balance: parseFloat(e.target.value) || 0 })),
                  className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 133}, this )
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 131}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 123}, this)
            , _jsxDEV('div', { className: "flex justify-end gap-3 p-5 border-t"    , children: [
              _jsxDEV('button', { onClick: () => setModalOpen(false), className: "px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"      , children: "Cancel"}, void 0, false, {fileName: _jsxFileName, lineNumber: 138}, this)
              , _jsxDEV('button', { onClick: handleSave, disabled: saving || !form.name, className: "px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"        , children: 
                saving ? 'Saving...' : 'Save'
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 139}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 137}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 118}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 117}, this)
      )
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 59}, this)
  );
}
