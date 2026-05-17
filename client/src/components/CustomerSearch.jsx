const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

import { useAuth } from '../contexts/AuthContext';
import { Search } from 'lucide-react';







export default function CustomerSearch({ value, onChange, onSelect }) {
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
    if (!value || !user) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase.from('customers').select('*')
        .eq('user_id', user.id).ilike('name', `${value}%`).limit(20);
      setSuggestions(_nullishCoalesce(data, () => ( [])));
      setOpen(true);
    }, 200);
    return () => clearTimeout(t);
  }, [value, user]);

  return (
    _jsxDEV('div', { ref: ref, className: "relative", children: [
      _jsxDEV('div', { className: "relative", children: [
        _jsxDEV(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 41}, this )
        , _jsxDEV('input', {
          type: "text",
          value: value,
          onChange: e => onChange(e.target.value),
          onFocus: () => value && setOpen(true),
          placeholder: "Search customer..." ,
          className: "w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"          ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 42}, this
        )
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 40}, this)
      , open && suggestions.length > 0 && (
        _jsxDEV('div', { className: "absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-64 overflow-y-auto"          , children: 
          suggestions.map(c => (
            _jsxDEV('button', {

              type: "button",
              className: "w-full text-left px-4 py-3 hover:bg-sky-50 border-b border-gray-50 last:border-0 transition-colors"        ,
              onClick: () => { onSelect(c); setOpen(false); },
 children: [
              _jsxDEV('div', { className: "font-medium text-gray-800 text-sm"  , children: c.name}, void 0, false, {fileName: _jsxFileName, lineNumber: 60}, this)
              , _jsxDEV('div', { className: "text-xs text-gray-500 mt-0.5"  , children: [c.mobile, " " , c.address && `• ${c.address}`]}, void 0, true, {fileName: _jsxFileName, lineNumber: 61}, this)
              , c.outstanding_balance > 0 && (
                _jsxDEV('div', { className: "text-xs text-amber-600 mt-0.5"  , children: ["Outstanding: ₹" , c.outstanding_balance]}, void 0, true, {fileName: _jsxFileName, lineNumber: 63}, this)
              )
            ]}, c.id, true, {fileName: _jsxFileName, lineNumber: 54}, this)
          ))
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 52}, this)
      )
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 39}, this)
  );
}
