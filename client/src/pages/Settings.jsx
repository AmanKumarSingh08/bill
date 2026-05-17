const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState, useRef } from 'react';
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

  const uploadFile = async (file, kind) => {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = `${user.id}/${kind}_${Date.now()}.${ext}`;
  const { data, error } = await supabase
    .storage
    .from('business-assets')
    .upload(path, file, { upsert: true });
  if (error) throw error;
  // Prefer the URL the server returned; fall back to computed one.
  if (data?.publicUrl) return data.publicUrl;
  const { data: pub } = supabase.storage.from('business-assets').getPublicUrl(data.path);
  return pub.publicUrl;
};

  const handleLogoChange = async (e) => {
  const file = e.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => setLogoPreview(ev.target?.result);
  reader.readAsDataURL(file);
  try {
    const url = await uploadFile(file, 'logo');
    setLogoPreview(url);
    setForm(p => ({ ...p, logo_url: url }));
    showToast('Logo uploaded');
  } catch (err) {
    console.error(err);
    alert('Logo upload failed: ' + (err?.message || err));
  }
};

  const handleSigChange = async (e) => {
  const file = e.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => setSigPreview(ev.target?.result);
  reader.readAsDataURL(file);
  try {
    const url = await uploadFile(file, 'signature');
    setSigPreview(url);
    setForm(p => ({ ...p, signature_url: url }));
    showToast('Signature uploaded');
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
    _jsxDEV('div', { children: [
      _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-1"    , children: label}, void 0, false, {fileName: _jsxFileName, lineNumber: 65}, this)
      , _jsxDEV('input', { type: type, value: (form )[key] , onChange: e => setForm(p => ({ ...p, [key]: e.target.value })),
        className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         , ...props,}, void 0, false, {fileName: _jsxFileName, lineNumber: 66}, this )
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 64}, this)
  );

  return (
    _jsxDEV('div', { className: "space-y-5 max-w-3xl" , children: [
      toast && (
        _jsxDEV('div', { className: "fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl text-sm"          , children: toast}, void 0, false, {fileName: _jsxFileName, lineNumber: 74}, this)
      )

      , _jsxDEV('div', { className: "flex items-center justify-between"  , children: [
        _jsxDEV('h1', { className: "text-xl font-bold text-gray-800"  , children: "Settings"}, void 0, false, {fileName: _jsxFileName, lineNumber: 78}, this)
        , _jsxDEV('button', { onClick: handleSave, disabled: saving, className: "flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"           , children: [
          _jsxDEV(Save, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 80}, this ), " " , saving ? 'Saving...' : 'Save Settings'
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 79}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 77}, this)

      /* Business Info */
      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsxDEV('h2', { className: "font-semibold text-gray-700 text-sm mb-4"   , children: "Business Information" }, void 0, false, {fileName: _jsxFileName, lineNumber: 86}, this)
        , _jsxDEV('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , children: [
          field('Business Name *', 'business_name')
          , field('Phone', 'phone')
          , field('Email', 'email', 'email')
          , field('GSTIN', 'gstin')
          , field('State', 'state')
          , field('Invoice Prefix', 'invoice_prefix')
          , _jsxDEV('div', { className: "col-span-2", children: field('Address', 'address')}, void 0, false, {fileName: _jsxFileName, lineNumber: 94}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 87}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 85}, this)

      /* Bank Details */
      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsxDEV('h2', { className: "font-semibold text-gray-700 text-sm mb-4"   , children: "Bank Details" }, void 0, false, {fileName: _jsxFileName, lineNumber: 100}, this)
        , _jsxDEV('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , children: [
          field('Bank Name', 'bank_name')
          , field('Account Number', 'account_no')
          , field('IFSC Code', 'ifsc_code')
          , field('Account Holder Name', 'account_holder')
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 101}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 99}, this)

      /* Logo + Signature */
      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsxDEV('h2', { className: "font-semibold text-gray-700 text-sm mb-4"   , children: "Logo & Signature"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 111}, this)
        , _jsxDEV('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6"   , children: [
          _jsxDEV('div', { children: [
            _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-2"    , children: "Company Logo" }, void 0, false, {fileName: _jsxFileName, lineNumber: 114}, this)
            , _jsxDEV('div', { className: "flex items-center gap-4"  , children: [
              logoPreview ? (
                _jsxDEV('img', { src: logoPreview, alt: "logo", className: "w-16 h-16 object-contain border border-gray-200 rounded-lg p-1"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 117}, this )
              ) : (
                _jsxDEV('div', { className: "w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs"        , children: "No Logo" }, void 0, false, {fileName: _jsxFileName, lineNumber: 119}, this)
              )
              , _jsxDEV('button', { type: "button", onClick: () => _optionalChain([logoRef, 'access', _11 => _11.current, 'optionalAccess', _12 => _12.click, 'call', _13 => _13()]),
                className: "flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"         , children: [
                _jsxDEV(Upload, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 123}, this ), " Upload Logo"
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 121}, this)
              , _jsxDEV('input', { ref: logoRef, type: "file", accept: "image/*", className: "hidden", onChange: handleLogoChange,}, void 0, false, {fileName: _jsxFileName, lineNumber: 125}, this )
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 115}, this)
            , _jsxDEV('p', { className: "text-xs text-gray-400 mt-1"  , children: "PNG or JPG. Will appear on invoices."      }, void 0, false, {fileName: _jsxFileName, lineNumber: 127}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 113}, this)
          , _jsxDEV('div', { children: [
            _jsxDEV('label', { className: "block text-xs font-medium text-gray-600 mb-2"    , children: "Digital Signature" }, void 0, false, {fileName: _jsxFileName, lineNumber: 130}, this)
            , _jsxDEV('div', { className: "flex items-center gap-4"  , children: [
              sigPreview ? (
                _jsxDEV('img', { src: sigPreview, alt: "signature", className: "w-16 h-16 object-contain border border-gray-200 rounded-lg p-1"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 133}, this )
              ) : (
                _jsxDEV('div', { className: "w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs"        , children: "No Sig" }, void 0, false, {fileName: _jsxFileName, lineNumber: 135}, this)
              )
              , _jsxDEV('button', { type: "button", onClick: () => _optionalChain([sigRef, 'access', _14 => _14.current, 'optionalAccess', _15 => _15.click, 'call', _16 => _16()]),
                className: "flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"         , children: [
                _jsxDEV(Upload, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 139}, this ), " Upload Signature"
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 137}, this)
              , _jsxDEV('input', { ref: sigRef, type: "file", accept: "image/*", className: "hidden", onChange: handleSigChange,}, void 0, false, {fileName: _jsxFileName, lineNumber: 141}, this )
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 131}, this)
            , _jsxDEV('p', { className: "text-xs text-gray-400 mt-1"  , children: "PNG transparent recommended."  }, void 0, false, {fileName: _jsxFileName, lineNumber: 143}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 129}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 112}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 110}, this)

      /* Terms */
      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsxDEV('h2', { className: "font-semibold text-gray-700 text-sm mb-4"   , children: "Terms & Conditions"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 150}, this)
        , _jsxDEV('textarea', { value: form.terms, onChange: e => setForm(p => ({ ...p, terms: e.target.value })),
          rows: 5, className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 151}, this )
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 149}, this)

      /* WhatsApp */
      , _jsxDEV('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
        _jsxDEV('h2', { className: "font-semibold text-gray-700 text-sm mb-4"   , children: "WhatsApp Integration" }, void 0, false, {fileName: _jsxFileName, lineNumber: 157}, this)
        , _jsxDEV('div', { className: "space-y-3", children: [
          _jsxDEV('label', { className: "flex items-center gap-3 cursor-pointer"   , children: [
            _jsxDEV('input', { type: "checkbox", checked: form.whatsapp_auto_send,
              onChange: e => setForm(p => ({ ...p, whatsapp_auto_send: e.target.checked })),
              className: "w-4 h-4 text-sky-600 rounded"   ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 160}, this )
            , _jsxDEV('span', { className: "text-sm text-gray-700" , children: "Auto-send WhatsApp after saving invoice"    }, void 0, false, {fileName: _jsxFileName, lineNumber: 163}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 159}, this)
          , field('WhatsApp API Token', 'whatsapp_api_token')
          , field('WhatsApp Phone Number ID', 'whatsapp_phone_id')
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 158}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 156}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 72}, this)
  );
}
