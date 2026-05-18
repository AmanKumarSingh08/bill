const _jsxFileName = "";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Trash2,
  CreditCard as Edit,
  Eye,
  Copy
} from 'lucide-react';

import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatDate } from '../lib/utils';

function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs;
  } else {
    return rhsFn();
  }
}

export default function InvoiceList() {
  const { user } = useAuth();

  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;

    setLoading(true);

    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_draft', false)
      .order('created_at', { ascending: false });

    setInvoices(_nullishCoalesce(data, () => ([])));

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return;

    await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);

    await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  const handleDeleteAll = async () => {
    if (!confirm('Delete ALL invoices? This cannot be undone.')) return;

    if (
      !confirm(
        'Are you absolutely sure? Every invoice will be permanently removed.'
      )
    )
      return;

    try {
      const ids = invoices.map(i => i.id);

      if (ids.length) {
        await supabase
          .from('invoice_items')
          .delete()
          .in('invoice_id', ids);
      }

      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setInvoices([]);

      alert('All invoices deleted.');
    } catch (e) {
      console.error(e);

      alert(
        'Failed to delete all invoices: ' +
          (e?.message || e)
      );
    }
  };

  const handleDuplicate = async (inv) => {
    if (!user) return;

    const { data: items } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', inv.id);

    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const year = new Date().getFullYear();

    const y2 = String(year).slice(2);
    const y2n = String(year + 1).slice(2);

    const newNo =
      `${inv.invoice_no.split('/')[0]}/${y2}/${y2n}/` +
      `${String((_nullishCoalesce(count, () => (0))) + 1).padStart(3, '0')}`;

    const today = new Date()
      .toISOString()
      .split('T')[0];

    const { data: newInv } = await supabase
      .from('invoices')
      .insert({
        ...inv,
        id: undefined,
        invoice_no: newNo,
        invoice_date: today,
        created_at: undefined,
        updated_at: undefined,
        user_id: user.id
      })
      .select('id')
      .single();

    if (newInv && items) {
      await supabase
        .from('invoice_items')
        .insert(
          items.map((i) => ({
            ...i,
            id: undefined,
            invoice_id: newInv.id
          }))
        );
    }

    load();
  };

  const filtered = invoices.filter(
    i =>
      i.invoice_no
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      i.customer_name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        <h1 className="text-xl font-bold text-gray-800">
          Invoices
        </h1>

        <div className="flex items-center gap-2">

          <button
            onClick={handleDeleteAll}
            disabled={invoices.length === 0}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete All Invoices
          </button>

          <Link
            to="/invoices/new"
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Link>

        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-xl shadow-sm p-4">

        {/* SEARCH */}
        <div className="relative mb-4">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search invoice or customer..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin w-6 h-6 border-4 border-sky-500 border-t-transparent rounded-full" />
          </div>

        ) : filtered.length === 0 ? (

          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">
              No invoices found
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-gray-100">

                  <th className="text-left py-3 text-gray-500 font-medium">
                    Invoice No.
                  </th>

                  <th className="text-left py-3 text-gray-500 font-medium">
                    Customer
                  </th>

                  <th className="text-left py-3 text-gray-500 font-medium">
                    Date
                  </th>

                  <th className="text-left py-3 text-gray-500 font-medium">
                    Due Date
                  </th>

                  <th className="text-right py-3 text-gray-500 font-medium">
                    Amount
                  </th>

                  <th className="text-center py-3 text-gray-500 font-medium">
                    Status
                  </th>

                  <th className="text-center py-3 text-gray-500 font-medium">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filtered.map(inv => (

                  <tr
                    key={inv.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >

                    <td className="py-3">
                      <Link
                        to={`/invoices/${inv.id}`}
                        className="text-sky-600 hover:underline font-medium"
                      >
                        {inv.invoice_no}
                      </Link>
                    </td>

                    <td className="py-3 text-gray-700">
                      {inv.customer_name}
                    </td>

                    <td className="py-3 text-gray-500">
                      {formatDate(inv.invoice_date)}
                    </td>

                    <td className="py-3 text-gray-500">
                      {inv.due_date
                        ? formatDate(inv.due_date)
                        : '-'}
                    </td>

                    <td className="py-3 text-right font-medium text-gray-800">
                      ₹{formatCurrency(inv.grand_total)}
                    </td>

                    <td className="py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3">

                      <div className="flex items-center justify-center gap-2">

                        <Link
                          to={`/invoices/${inv.id}`}
                          className="p-1.5 text-gray-400 hover:text-sky-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/invoices/${inv.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDuplicate(inv)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}