const _jsxFileName = "";import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

import { useAuth } from '../contexts/AuthContext';
import { Search } from 'lucide-react';








export default function ProductSearch({ value, onChange, onSelect, placeholder }) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target )) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(async () => {
      const query = supabase.from('products').select('*').eq('user_id', user.id);
      const { data } = value
        ? await query.ilike('name', `%${value}%`).limit(30)
        : await query.order('name').limit(50);
      setSuggestions(_nullishCoalesce(data, () => ( [])));
    }, 150);
    return () => clearTimeout(t);
  }, [value, user]);

  return (
    _jsx('div', { ref: ref, className: "relative", children: [
      _jsx('div', { className: "relative", children: [
        _jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 43}, this )
        , _jsx('input', {
          type: "text",
          value: value,
          onChange: e => onChange(e.target.value),
          onFocus: () => setOpen(true),
          placeholder: _nullishCoalesce(placeholder, () => ( 'Search item...')),
          className: "w-full border border-gray-300 rounded pl-7 pr-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"          ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 44}, this
        )
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 42}, this)
      , open && suggestions.length > 0 && (
        _jsx('div', { className: "absolute z-50 left-0 bg-white border border-gray-200 rounded-lg shadow-2xl mt-1 overflow-y-auto"         ,
          style: { minWidth: '340px', maxHeight: '400px' }, children: [
          _jsx('div', { className: "sticky top-0 bg-gray-50 px-3 py-2 border-b border-gray-100 text-xs text-gray-500 font-medium grid grid-cols-4 gap-2"            , children: [
            _jsx('span', { className: "col-span-2", children: "Item Name" }, void 0, false, {fileName: _jsxFileName, lineNumber: 57}, this)
            , _jsx('span', { className: "text-right", children: "Price"}, void 0, false, {fileName: _jsxFileName, lineNumber: 58}, this)
            , _jsx('span', { className: "text-right", children: "Stock"}, void 0, false, {fileName: _jsxFileName, lineNumber: 59}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 56}, this)
          , suggestions.map(p => (
            _jsx('button', {

              type: "button",
              className: "w-full text-left px-3 py-2.5 hover:bg-sky-50 border-b border-gray-50 last:border-0 transition-colors grid grid-cols-4 gap-2 items-center"            ,
              onClick: () => { onSelect(p); setOpen(false); onChange(p.name); },
 children: [
              _jsx('div', { className: "col-span-2", children: [
                _jsx('div', { className: "font-medium text-gray-800 text-sm"  , children: p.name}, void 0, false, {fileName: _jsxFileName, lineNumber: 69}, this)
                , _jsx('div', { className: "text-xs text-gray-400" , children: [p.hsn_code, " • GST "   , p.cgst_rate + p.sgst_rate, "%"]}, void 0, true, {fileName: _jsxFileName, lineNumber: 70}, this)
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 68}, this)
              , _jsx('div', { className: "text-right text-sm font-medium text-gray-700"   , children: ["₹", p.sale_price]}, void 0, true, {fileName: _jsxFileName, lineNumber: 72}, this)
              , _jsx('div', { className: `text-right text-sm font-medium ${p.stock_quantity <= p.low_stock_alert ? 'text-rose-600' : 'text-emerald-600'}`, children: [
                p.stock_quantity, " " , p.unit
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 73}, this)
            ]}, p.id, true, {fileName: _jsxFileName, lineNumber: 62}, this)
          ))
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 54}, this)
      )
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 41}, this)
  );
}
