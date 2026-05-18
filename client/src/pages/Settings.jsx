const _jsxFileName = "";import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Save, Upload } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [logoPreview, setLogoPreview] = useState(settings.logo_url);
  const [sigPreview, setSigPreview] = useState(settings.signature_url);
  const logoRef = useRef(null);
  const sigRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const uploadFile = async (file) => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleLogoChange = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Logo too large (max 2MB)'); return; }
    try {
      const url = await uploadFile(file);
      setLogoPreview(url);
      const next = { ...form, logo_url: url };
      setForm(next);
      await saveSettings(next);
      showToast('Logo saved');
    } catch (err) {
      console.error(err);
      alert('Logo upload failed: ' + (err?.message || err));
    }
  };

  const handleSigChange = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Signature too large (max 2MB)'); return; }
    try {
      const url = await uploadFile(file);
      setSigPreview(url);
      const next = { ...form, signature_url: url };
      setForm(next);
      await saveSettings(next);
      showToast('Signature saved');
    } catch (err) {
      console.error(err);
      alert('Signature upload failed: ' + (err?.message || err));
    }
  };


  const handleSave = async () => {
    setSaving(true);
    await saveSettings(form);
    setSaving(false);
    showToast('Settings saved!');
  };

  const field = (label, key, type = 'text', props) => (
    _jsx('div', { children: [
      _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: label}, void 0, false, {fileName: _jsxFileName, lineNumber: 65}, this)
      , _jsx('input', { type: type, value: (form )[key] , onChange: e => setForm(p => ({ ...p, [key]: e.target.value })),
        className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         , ...props,}, void 0, false, {fileName: _jsxFileName, lineNumber: 66}, this )
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 64}, this)
  );

  return (
    _jsx('div', { className: "space-y-5 max-w-3xl" , children: [
      toast && (
        _jsx('div', { className: "fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl text-sm"          , children: toast}, void 0, false, {fileName: _jsxFileName, lineNumber: 74}, this)
      )

      , _jsx('div', { className: "flex items-center justify-between"  , children: [
        _jsx('h1', { className: "text-xl font-bold text-gray-800"  , children: "Settings"}, void 0, false, {fileName: _jsxFileName, lineNumber: 78}, this)
        , _jsx('button', { onClick: handleSave, disabled: saving, className: "flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"           , children: [
          _jsx(Save, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 80}, this ), " " , saving ? 'Saving...' : 'Save Settings'
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 79}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 77}, this)

      /* Business Info */
      , _jsx('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsx('h2', { className: "font-semibold text-gray-700 text-sm mb-4"   , children: "Business Information" }, void 0, false, {fileName: _jsxFileName, lineNumber: 86}, this)
        , _jsx('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , children: [
          field('Business Name *', 'business_name')
          , field('Phone', 'phone')
          , field('Email', 'email', 'email')
          , field('GSTIN', 'gstin')
          , field('State', 'state')
          , field('Invoice Prefix', 'invoice_prefix')
          , _jsx('div', { className: "col-span-2", children: field('Address', 'address')}, void 0, false, {fileName: _jsxFileName, lineNumber: 94}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 87}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 85}, this)

      /* Bank Details */
      , _jsx('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsx('h2', { className: "font-semibold text-gray-700 text-sm mb-4"   , children: "Bank Details" }, void 0, false, {fileName: _jsxFileName, lineNumber: 100}, this)
        , _jsx('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , children: [
          field('Bank Name', 'bank_name')
          , field('Account Number', 'account_no')
          , field('IFSC Code', 'ifsc_code')
          , field('Account Holder Name', 'account_holder')
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 101}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 99}, this)

      /* Logo + Signature */
      , _jsx('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsx('h2', { className: "font-semibold text-gray-700 text-sm mb-4"   , children: "Logo & Signature"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 111}, this)
        , _jsx('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6"   , children: [
          _jsx('div', { children: [
            _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-2"    , children: "Company Logo" }, void 0, false, {fileName: _jsxFileName, lineNumber: 114}, this)
            , _jsx('div', { className: "flex items-center gap-4"  , children: [
              logoPreview ? (
                _jsx('img', { src: logoPreview, alt: "logo", className: "w-16 h-16 object-contain border border-gray-200 rounded-lg p-1"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 117}, this )
              ) : (
                _jsx('div', { className: "w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs"        , children: "No Logo" }, void 0, false, {fileName: _jsxFileName, lineNumber: 119}, this)
              )
              , _jsx('button', { type: "button", onClick: () => _optionalChain([logoRef, 'access', _11 => _11.current, 'optionalAccess', _12 => _12.click, 'call', _13 => _13()]),
                className: "flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"         , children: [
                _jsx(Upload, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 123}, this ), " Upload Logo"
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 121}, this)
              , _jsx('input', { ref: logoRef, type: "file", accept: "image/*", className: "hidden", onChange: handleLogoChange,}, void 0, false, {fileName: _jsxFileName, lineNumber: 125}, this )
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 115}, this)
            , _jsx('p', { className: "text-xs text-gray-400 mt-1"  , children: "PNG or JPG. Will appear on invoices."      }, void 0, false, {fileName: _jsxFileName, lineNumber: 127}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 113}, this)
          , _jsx('div', { children: [
            _jsx('label', { className: "block text-xs font-medium text-gray-600 mb-2"    , children: "Digital Signature" }, void 0, false, {fileName: _jsxFileName, lineNumber: 130}, this)
            , _jsx('div', { className: "flex items-center gap-4"  , children: [
              sigPreview ? (
                _jsx('img', { src: sigPreview, alt: "signature", className: "w-16 h-16 object-contain border border-gray-200 rounded-lg p-1"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 133}, this )
              ) : (
                _jsx('div', { className: "w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs"        , children: "No Sig" }, void 0, false, {fileName: _jsxFileName, lineNumber: 135}, this)
              )
              , _jsx('button', { type: "button", onClick: () => _optionalChain([sigRef, 'access', _14 => _14.current, 'optionalAccess', _15 => _15.click, 'call', _16 => _16()]),
                className: "flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"         , children: [
                _jsx(Upload, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 139}, this ), " Upload Signature"
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 137}, this)
              , _jsx('input', { ref: sigRef, type: "file", accept: "image/*", className: "hidden", onChange: handleSigChange,}, void 0, false, {fileName: _jsxFileName, lineNumber: 141}, this )
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 131}, this)
            , _jsx('p', { className: "text-xs text-gray-400 mt-1"  , children: "PNG transparent recommended."  }, void 0, false, {fileName: _jsxFileName, lineNumber: 143}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 129}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 112}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 110}, this)

      /* Terms */
      , _jsx('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsx('h2', { className: "font-semibold text-gray-700 text-sm mb-4"   , children: "Terms & Conditions"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 150}, this)
        , _jsx('textarea', { value: form.terms, onChange: e => setForm(p => ({ ...p, terms: e.target.value })),
          rows: 5, className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 151}, this )
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 149}, this)

      /* WhatsApp */
      , _jsx('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsx('h2', { className: "font-semibold text-gray-700 text-sm mb-4"   , children: "WhatsApp Integration" }, void 0, false, {fileName: _jsxFileName, lineNumber: 157}, this)
        , _jsx('div', { className: "space-y-3", children: [
          _jsx('label', { className: "flex items-center gap-3 cursor-pointer"   , children: [
            _jsx('input', { type: "checkbox", checked: form.whatsapp_auto_send,
              onChange: e => setForm(p => ({ ...p, whatsapp_auto_send: e.target.checked })),
              className: "w-4 h-4 text-sky-600 rounded"   ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 160}, this )
            , _jsx('span', { className: "text-sm text-gray-700" , children: "Auto-send WhatsApp after saving invoice"    }, void 0, false, {fileName: _jsxFileName, lineNumber: 163}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 159}, this)
          , field('WhatsApp API Token', 'whatsapp_api_token')
          , field('WhatsApp Phone Number ID', 'whatsapp_phone_id')
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 158}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 156}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 72}, this)
  );
}
