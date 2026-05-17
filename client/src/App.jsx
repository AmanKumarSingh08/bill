const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime";import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
      _jsxDEV('div', { className: "min-h-screen flex items-center justify-center bg-gray-50"    , children: 
        _jsxDEV('div', { className: "animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full"      ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 21}, this )
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 20}, this)
    );
  }

  if (!user) return _jsxDEV(Login, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 26}, this );

  return (
    _jsxDEV(SettingsProvider, { children: 
      _jsxDEV(Layout, { children: 
        _jsxDEV(Routes, { children: [
          _jsxDEV(Route, { path: "/", element: _jsxDEV(Dashboard, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 32}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 32}, this )
          , _jsxDEV(Route, { path: "/invoices", element: _jsxDEV(InvoiceList, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 33}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 33}, this )
          , _jsxDEV(Route, { path: "/invoices/new", element: _jsxDEV(InvoiceForm, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 34}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 34}, this )
          , _jsxDEV(Route, { path: "/invoices/:id", element: _jsxDEV(InvoiceView, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 35}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 35}, this )
          , _jsxDEV(Route, { path: "/invoices/:id/edit", element: _jsxDEV(InvoiceForm, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 36}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 36}, this )
          , _jsxDEV(Route, { path: "/customers", element: _jsxDEV(Customers, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 37}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 37}, this )
          , _jsxDEV(Route, { path: "/products", element: _jsxDEV(Products, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 38}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 38}, this )
          , _jsxDEV(Route, { path: "/reports", element: _jsxDEV(Reports, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 39}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 39}, this )
          , _jsxDEV(Route, { path: "/settings", element: _jsxDEV(Settings, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 40}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 40}, this )
          , _jsxDEV(Route, { path: "*", element: _jsxDEV(Navigate, { to: "/",}, void 0, false, {fileName: _jsxFileName, lineNumber: 41}, this ),}, void 0, false, {fileName: _jsxFileName, lineNumber: 41}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 31}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 30}, this)
    }, void 0, false, {fileName: _jsxFileName, lineNumber: 29}, this)
  );
}

export default function App() {
  return (
    _jsxDEV(AuthProvider, { children: 
      _jsxDEV(BrowserRouter, { children: 
        _jsxDEV(ProtectedApp, {}, void 0, false, {fileName: _jsxFileName, lineNumber: 52}, this )
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 51}, this)
    }, void 0, false, {fileName: _jsxFileName, lineNumber: 50}, this)
  );
}
