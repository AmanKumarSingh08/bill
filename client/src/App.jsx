const _jsxFileName = "";import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InvoiceList from './pages/InvoiceList';
import InvoiceForm from './pages/InvoiceForm';
import InvoiceView from './pages/InvoiceView';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function ProtectedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      _jsx('div', { className: "min-h-screen flex items-center justify-center bg-gray-50"    , children: 
        _jsx('div', { className: "animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 21}, this )
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 20}, this)
    );
  }

  if (!user) return _jsx(Login, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 26}, this );

  return (
    _jsx(SettingsProvider, { children: 
      _jsx(Layout, { children: 
        _jsx(Routes, { children: [
          _jsx(Route, { path: "/", element: _jsx(Dashboard, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 32}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 32}, this )
          , _jsx(Route, { path: "/invoices", element: _jsx(InvoiceList, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 33}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 33}, this )
          , _jsx(Route, { path: "/invoices/new", element: _jsx(InvoiceForm, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 34}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 34}, this )
          , _jsx(Route, { path: "/invoices/:id", element: _jsx(InvoiceView, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 35}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 35}, this )
          , _jsx(Route, { path: "/invoices/:id/edit", element: _jsx(InvoiceForm, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 36}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 36}, this )
          , _jsx(Route, { path: "/customers", element: _jsx(Customers, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 37}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 37}, this )
          , _jsx(Route, { path: "/products", element: _jsx(Products, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 38}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 38}, this )
          , _jsx(Route, { path: "/reports", element: _jsx(Reports, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 39}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 39}, this )
          , _jsx(Route, { path: "/settings", element: _jsx(Settings, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 40}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 40}, this )
          , _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/",}, void 0, false, {fileName: _jsxFileName, lineNumber: 41}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 41}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 31}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 30}, this)
    }, void 0, false, {fileName: _jsxFileName, lineNumber: 29}, this)
  );
}

export default function App() {
  return (
    _jsx(AuthProvider, { children: 
      _jsx(BrowserRouter, { children: 
        _jsx(ProtectedApp, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 52}, this )
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 51}, this)
    }, void 0, false, {fileName: _jsxFileName, lineNumber: 50}, this)
  );
}
