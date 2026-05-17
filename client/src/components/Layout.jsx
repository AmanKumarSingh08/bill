const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime";import { useState, } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, Package, BarChart2,
  Settings, LogOut, Milk, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout({ children }) {
  const { signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    _jsxDEV('div', { className: "flex h-screen bg-gray-100 overflow-hidden"   , children: [
      /* Mobile overlay */
      mobileOpen && (
        _jsxDEV('div', { className: "fixed inset-0 bg-black/40 z-20 lg:hidden"    , onClick: () => setMobileOpen(false),}, void 0, false, {fileName: _jsxFileName, lineNumber: 28}, this )
      )

      /* Sidebar */
      , _jsxDEV('aside', { className: `
        fixed lg:static inset-y-0 left-0 z-30 flex flex-col bg-gray-900 text-white transition-all duration-300
        ${collapsed ? 'w-16' : 'w-60'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `, children: [
        _jsxDEV('div', { className: "flex items-center justify-between p-4 border-b border-gray-700 h-16"      , children: [
          !collapsed && (
            _jsxDEV('div', { className: "flex items-center gap-2 min-w-0"   , children: [
              _jsxDEV(Milk, { className: "w-6 h-6 text-sky-400 shrink-0"   ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 40}, this )
              , _jsxDEV('span', { className: "font-bold text-sm truncate"  , children: "Shakti Dairy" }, void 0, false, {fileName: _jsxFileName, lineNumber: 41}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 39}, this)
          )
          , collapsed && _jsxDEV(Milk, { className: "w-6 h-6 text-sky-400 mx-auto"   ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 44}, this )
          , _jsxDEV('button', { onClick: () => setCollapsed(!collapsed), className: "hidden lg:flex text-gray-400 hover:text-white ml-auto"    , children: 
            collapsed ? _jsxDEV(ChevronRight, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 46}, this ) : _jsxDEV(ChevronLeft, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 46}, this )
          }, void 0, false, {fileName: _jsxFileName, lineNumber: 45}, this)
          , _jsxDEV('button', { onClick: () => setMobileOpen(false), className: "lg:hidden text-gray-400 hover:text-white"  , children: 
            _jsxDEV(X, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 49}, this )
          }, void 0, false, {fileName: _jsxFileName, lineNumber: 48}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 37}, this)

        , _jsxDEV('nav', { className: "flex-1 py-4 overflow-y-auto"  , children: 
          nav.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              _jsxDEV(Link, {

                to: to,
                onClick: () => setMobileOpen(false),
                className: `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-colors ${
                  active ? 'bg-sky-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`,
 children: [
                _jsxDEV(Icon, { className: "w-5 h-5 shrink-0"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 65}, this )
                , !collapsed && _jsxDEV('span', { className: "text-sm font-medium" , children: label}, void 0, false, {fileName: _jsxFileName, lineNumber: 66}, this)
              ]}, to, true, {fileName: _jsxFileName, lineNumber: 57}, this)
            );
          })
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 53}, this)

        , _jsxDEV('div', { className: "p-3 border-t border-gray-700"  , children: 
          _jsxDEV('button', {
            onClick: signOut,
            className: "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"          ,
 children: [
            _jsxDEV(LogOut, { className: "w-5 h-5 shrink-0"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 77}, this )
            , !collapsed && _jsxDEV('span', { className: "text-sm font-medium" , children: "Sign Out" }, void 0, false, {fileName: _jsxFileName, lineNumber: 78}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 73}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 72}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 32}, this)

      /* Main content */
      , _jsxDEV('div', { className: "flex-1 flex flex-col min-w-0 overflow-hidden"    , children: [
        _jsxDEV('header', { className: "bg-white border-b border-gray-200 h-16 flex items-center px-4 gap-3 shrink-0"        , children: [
          _jsxDEV('button', { onClick: () => setMobileOpen(true), className: "lg:hidden text-gray-500 hover:text-gray-700"  , children: 
            _jsxDEV(Menu, { className: "w-5 h-5" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 87}, this )
          }, void 0, false, {fileName: _jsxFileName, lineNumber: 86}, this)
          , _jsxDEV('span', { className: "text-gray-800 font-semibold text-sm"  , children: "Shakti Dairy Billing Software"   }, void 0, false, {fileName: _jsxFileName, lineNumber: 89}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 85}, this)
        , _jsxDEV('main', { className: "flex-1 overflow-y-auto p-4 lg:p-6"   , children: 
          children
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 91}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 84}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 25}, this)
  );
}
