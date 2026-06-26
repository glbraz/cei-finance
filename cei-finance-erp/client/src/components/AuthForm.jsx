import React, { useState } from 'react';
import { authService } from '../services/supabase';

export default function AuthForm({ onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    setLoading(true);
    const { error } = authMode === 'login'
      ? await authService.signIn(email, password)
      : await authService.signUp(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onAuthSuccess();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAuth();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          {authMode === 'login' ? 'Acessar Sistema' : 'Criar Conta'}
        </h2>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Aguarde...' : authMode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
          <p
            className="text-center text-sm text-slate-500 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }}
          >
            {authMode === 'login' ? 'Não tem conta? Criar agora' : 'Já tenho conta — fazer login'}
          </p>
        </div>
      </div>
    </div>
  );
}
