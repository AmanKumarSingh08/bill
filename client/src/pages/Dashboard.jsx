const _jsxFileName = "";import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Package, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatDate } from '../lib/utils';













export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSales: 0, pendingAmount: 0, customerCount: 0, productCount: 0,
    recentInvoices: [], lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [invRes, custRes, prodRes] = await Promise.all([
        supabase.from('invoices').select('id,invoice_no,customer_name,grand_total,status,invoice_date,received_amount').eq('user_id', user.id).eq('is_draft', false).order('created_at', { ascending: false }),
        supabase.from('customers').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('products').select('id,name,stock_quantity,low_stock_alert').eq('user_id', user.id),
      ]);

      const invoices = _nullishCoalesce(invRes.data, () => ( []));
      const totalSales = invoices.reduce((s, i) => s + (_nullishCoalesce(i.grand_total, () => ( 0))), 0);
      const pendingAmount = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + ((_nullishCoalesce(i.grand_total, () => ( 0))) - (_nullishCoalesce(i.received_amount, () => ( 0)))), 0);
      const products = _nullishCoalesce(prodRes.data, () => ( []));
      const lowStockProducts = products.filter(p => p.stock_quantity <= p.low_stock_alert);

      setStats({
        totalSales, pendingAmount,
        customerCount: _nullishCoalesce(custRes.count, () => ( 0)),
        productCount: products.length,
        recentInvoices: invoices.slice(0, 8),
        lowStockProducts: lowStockProducts.slice(0, 5),
      });
      setLoading(false);
    };
    load();
  }, [user]);

  const cards = [
    { label: 'Total Sales', value: `₹${formatCurrency(stats.totalSales)}`, icon: TrendingUp, color: 'bg-sky-500', light: 'bg-sky-50 text-sky-700' },
    { label: 'Pending Amount', value: `₹${formatCurrency(stats.pendingAmount)}`, icon: AlertTriangle, color: 'bg-amber-500', light: 'bg-amber-50 text-amber-700' },
    { label: 'Total Customers', value: stats.customerCount.toString(), icon: Users, color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700' },
    { label: 'Total Products', value: stats.productCount.toString(), icon: Package, color: 'bg-rose-500', light: 'bg-rose-50 text-rose-700' },
  ];

  if (loading) return (
    _jsx('div', { className: "flex items-center justify-center h-64"   , children: 
      _jsx('div', { className: "animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 64}, this )
    }, void 0, false, {fileName: _jsxFileName, lineNumber: 63}, this)
  );

  return (
    _jsx('div', { className: "space-y-6", children: [
      _jsx('div', { className: "flex items-center justify-between"  , children: [
        _jsx('h1', { className: "text-2xl font-bold text-gray-800"  , children: "Dashboard"}, void 0, false, {fileName: _jsxFileName, lineNumber: 71}, this)
        , _jsx(Link, { to: "/invoices/new", className: "flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"           , children: [
          _jsx(Plus, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 73}, this ), " New Invoice"
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 72}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 70}, this)

      , _jsx('div', { className: "grid grid-cols-2 lg:grid-cols-4 gap-4"   , children: 
        cards.map(({ label, value, icon: Icon, color, light }) => (
          _jsx('div', { className: "bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"      , children: [
            _jsx('div', { className: `w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`, children: 
              _jsx(Icon, { className: "w-6 h-6 text-white"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 81}, this )
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 80}, this)
            , _jsx('div', { className: "min-w-0", children: [
              _jsx('p', { className: "text-xs text-gray-500 truncate"  , children: label}, void 0, false, {fileName: _jsxFileName, lineNumber: 84}, this)
              , _jsx('p', { className: `text-lg font-bold truncate ${light.split(' ')[1]}`, children: value}, void 0, false, {fileName: _jsxFileName, lineNumber: 85}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 83}, this)
          ]}, label, true, {fileName: _jsxFileName, lineNumber: 79}, this)
        ))
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 77}, this)

      , _jsx('div', { className: "grid lg:grid-cols-3 gap-6"  , children: [
        _jsx('div', { className: "lg:col-span-2 bg-white rounded-xl shadow-sm p-5"    , children: [
          _jsx('div', { className: "flex items-center justify-between mb-4"   , children: [
            _jsx('h2', { className: "font-semibold text-gray-800" , children: "Recent Invoices" }, void 0, false, {fileName: _jsxFileName, lineNumber: 94}, this)
            , _jsx(Link, { to: "/invoices", className: "text-sm text-sky-600 hover:underline"  , children: "View all" }, void 0, false, {fileName: _jsxFileName, lineNumber: 95}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 93}, this)
          , stats.recentInvoices.length === 0 ? (
            _jsx('div', { className: "text-center py-10 text-gray-400"  , children: [
              _jsx(FileText, { className: "w-10 h-10 mx-auto mb-2 opacity-40"    ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 99}, this )
              , _jsx('p', { className: "text-sm", children: "No invoices yet"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 100}, this)
              , _jsx(Link, { to: "/invoices/new", className: "mt-3 inline-block text-sky-600 text-sm hover:underline"    , children: "Create first invoice"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 101}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 98}, this)
          ) : (
            _jsx('div', { className: "overflow-x-auto", children: 
              _jsx('table', { className: "w-full text-sm" , children: [
                _jsx('thead', { children: 
                  _jsx('tr', { className: "border-b border-gray-100" , children: [
                    _jsx('th', { className: "text-left py-2 text-gray-500 font-medium"   , children: "Invoice"}, void 0, false, {fileName: _jsxFileName, lineNumber: 108}, this)
                    , _jsx('th', { className: "text-left py-2 text-gray-500 font-medium"   , children: "Customer"}, void 0, false, {fileName: _jsxFileName, lineNumber: 109}, this)
                    , _jsx('th', { className: "text-left py-2 text-gray-500 font-medium"   , children: "Date"}, void 0, false, {fileName: _jsxFileName, lineNumber: 110}, this)
                    , _jsx('th', { className: "text-right py-2 text-gray-500 font-medium"   , children: "Amount"}, void 0, false, {fileName: _jsxFileName, lineNumber: 111}, this)
                    , _jsx('th', { className: "text-center py-2 text-gray-500 font-medium"   , children: "Status"}, void 0, false, {fileName: _jsxFileName, lineNumber: 112}, this)
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 107}, this)
                }, void 0, false, {fileName: _jsxFileName, lineNumber: 106}, this)
                , _jsx('tbody', { children: 
                  stats.recentInvoices.map(inv => (
                    _jsx('tr', { className: "border-b border-gray-50 hover:bg-gray-50"  , children: [
                      _jsx('td', { className: "py-2.5", children: 
                        _jsx(Link, { to: `/invoices/${inv.id}`, className: "text-sky-600 hover:underline font-medium"  , children: inv.invoice_no}, void 0, false, {fileName: _jsxFileName, lineNumber: 119}, this)
                      }, void 0, false, {fileName: _jsxFileName, lineNumber: 118}, this)
                      , _jsx('td', { className: "py-2.5 text-gray-700" , children: inv.customer_name}, void 0, false, {fileName: _jsxFileName, lineNumber: 121}, this)
                      , _jsx('td', { className: "py-2.5 text-gray-500" , children: formatDate(inv.invoice_date)}, void 0, false, {fileName: _jsxFileName, lineNumber: 122}, this)
                      , _jsx('td', { className: "py-2.5 text-right font-medium text-gray-800"   , children: ["₹", formatCurrency(inv.grand_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 123}, this)
                      , _jsx('td', { className: "py-2.5 text-center" , children: 
                        _jsx('span', { className: `px-2 py-0.5 rounded-full text-xs font-medium ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`, children: inv.status}, void 0, false, {fileName: _jsxFileName, lineNumber: 125}, this)
                      }, void 0, false, {fileName: _jsxFileName, lineNumber: 124}, this)
                    ]}, inv.id, true, {fileName: _jsxFileName, lineNumber: 117}, this)
                  ))
                }, void 0, false, {fileName: _jsxFileName, lineNumber: 115}, this)
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 105}, this)
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 104}, this)
          )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 92}, this)

        , _jsx('div', { className: "bg-white rounded-xl shadow-sm p-5"   , children: [
          _jsx('h2', { className: "font-semibold text-gray-800 mb-4"  , children: "Low Stock Alert"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 138}, this)
          , stats.lowStockProducts.length === 0 ? (
            _jsx('div', { className: "text-center py-10 text-gray-400"  , children: [
              _jsx(Package, { className: "w-10 h-10 mx-auto mb-2 opacity-40"    ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 141}, this )
              , _jsx('p', { className: "text-sm", children: "All items well-stocked"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 142}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 140}, this)
          ) : (
            _jsx('div', { className: "space-y-3", children: 
              stats.lowStockProducts.map(p => (
                _jsx('div', { className: "flex items-center justify-between p-3 bg-rose-50 rounded-lg"     , children: [
                  _jsx('div', { children: [
                    _jsx('p', { className: "text-sm font-medium text-gray-800"  , children: p.name}, void 0, false, {fileName: _jsxFileName, lineNumber: 149}, this)
                    , _jsx('p', { className: "text-xs text-gray-500" , children: ["Alert: " , p.low_stock_alert]}, void 0, true, {fileName: _jsxFileName, lineNumber: 150}, this)
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 148}, this)
                  , _jsx('span', { className: "text-rose-600 font-bold text-sm"  , children: p.stock_quantity}, void 0, false, {fileName: _jsxFileName, lineNumber: 152}, this)
                ]}, p.id, true, {fileName: _jsxFileName, lineNumber: 147}, this)
              ))
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 145}, this)
          )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 137}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 91}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 69}, this)
  );
}
