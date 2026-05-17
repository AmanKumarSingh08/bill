const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime";import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Milk, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fn = isRegister ? signUp : signIn;
    const { error } = await fn(email, password);
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    _jsxDEV('div', { className: "min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center p-4"       , children: 
      _jsxDEV('div', { className: "bg-white rounded-2xl shadow-xl w-full max-w-md p-8"     , children: [
        _jsxDEV('div', { className: "flex flex-col items-center mb-8"   , children: [
          _jsxDEV('div', { className: "w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg"        , children: 
            _jsxDEV(Milk, { className: "w-9 h-9 text-white"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 29}, this )
          }, void 0, false, {fileName: _jsxFileName, lineNumber: 28}, this)
          , _jsxDEV('h1', { className: "text-2xl font-bold text-gray-800"  , children: "Shakti Dairy" }, void 0, false, {fileName: _jsxFileName, lineNumber: 31}, this)
          , _jsxDEV('p', { className: "text-gray-500 text-sm mt-1"  , children: "Billing Software" }, void 0, false, {fileName: _jsxFileName, lineNumber: 32}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 27}, this)

        , _jsxDEV('h2', { className: "text-xl font-semibold text-gray-700 mb-6 text-center"    , children: 
          isRegister ? 'Create Account' : 'Sign In'
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 35}, this)

        , error && (
          _jsxDEV('div', { className: "bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4"        , children: 
            error
          }, void 0, false, {fileName: _jsxFileName, lineNumber: 40}, this)
        )

        , _jsxDEV('form', { onSubmit: handleSubmit, className: "space-y-4", children: [
          _jsxDEV('div', { children: [
            _jsxDEV('label', { className: "block text-sm font-medium text-gray-700 mb-1"    , children: "Email"}, void 0, false, {fileName: _jsxFileName, lineNumber: 47}, this)
            , _jsxDEV('input', {
              type: "email",
              value: email,
              onChange: e => setEmail(e.target.value),
              required: true,
              className: "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"          ,
              placeholder: "you@example.com",}, void 0, false, {fileName: _jsxFileName, lineNumber: 48}, this
            )
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 46}, this)
          , _jsxDEV('div', { children: [
            _jsxDEV('label', { className: "block text-sm font-medium text-gray-700 mb-1"    , children: "Password"}, void 0, false, {fileName: _jsxFileName, lineNumber: 58}, this)
            , _jsxDEV('div', { className: "relative", children: [
              _jsxDEV('input', {
                type: showPwd ? 'text' : 'password',
                value: password,
                onChange: e => setPassword(e.target.value),
                required: true,
                className: "w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"           ,
                placeholder: "••••••••",}, void 0, false, {fileName: _jsxFileName, lineNumber: 60}, this
              )
              , _jsxDEV('button', { type: "button", onClick: () => setShowPwd(!showPwd),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"     , children: 
                showPwd ? _jsxDEV(EyeOff, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 70}, this ) : _jsxDEV(Eye, { className: "w-4 h-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 70}, this )
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 68}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 59}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 57}, this)

          , _jsxDEV('button', {
            type: "submit",
            disabled: loading,
            className: "w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"         ,
 children: 
            loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'
          }, void 0, false, {fileName: _jsxFileName, lineNumber: 75}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 45}, this)

        , _jsxDEV('p', { className: "text-center text-sm text-gray-500 mt-6"   , children: [
          isRegister ? 'Already have an account?' : "Don't have an account?"
          , ' '
          , _jsxDEV('button', { onClick: () => setIsRegister(!isRegister), className: "text-sky-600 font-medium hover:underline"  , children: 
            isRegister ? 'Sign In' : 'Register'
          }, void 0, false, {fileName: _jsxFileName, lineNumber: 87}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 84}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 26}, this)
    }, void 0, false, {fileName: _jsxFileName, lineNumber: 25}, this)
  );
}
