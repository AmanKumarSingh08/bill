const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime";import { createContext, useContext, useEffect, useState, } from 'react';
import { supabase } from '../lib/supabase';

import { useAuth } from './AuthContext';

const defaultSettings = {
  business_name: 'Shakti Dairy Billing Software',
  address: 'Baijnathpur Station Road Chauradano East Champaran Bihar',
  phone: '9523910002 , 9523910005',
  email: 'marketing@a1shakti.com',
  gstin: '10BYRPS3970F1Z6',
  state: '10-Bihar',
  bank_name: 'AXIS BANK, MOTIHARI',
  account_no: '920010001624926',
  ifsc_code: 'UTIB0001231',
  account_holder: 'Janardan Singh',
  invoice_prefix: 'KD',
  terms: '1. Thanks for doing business with us!\n2. All Dispute are subject to Motihari Jurisdiction.\n3. Goods once sold will not taken back of exchanged.\n4. Our responsibility ceases on delivery of goods to the customers.',
  logo_url: '',
  signature_url: '',
  whatsapp_auto_send: false,
  whatsapp_api_token: '',
  whatsapp_phone_id: '',
};








const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (data) setSettings({ ...defaultSettings, ...data });
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const saveSettings = async (partial) => {
    if (!user) return;
    const merged = { ...settings, ...partial };
    const { data: existing } = await supabase
      .from('settings')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (existing) {
      await supabase.from('settings').update({ ...merged, updated_at: new Date().toISOString() }).eq('user_id', user.id);
    } else {
      await supabase.from('settings').insert({ ...merged, user_id: user.id });
    }
    setSettings(merged);
  };

  return (
    _jsxDEV(SettingsContext.Provider, { value: { settings, loading, saveSettings, refresh: load }, children: 
      children
    }, void 0, false, {fileName: _jsxFileName, lineNumber: 71}, this)
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
