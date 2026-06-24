import React, { useState } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : process.env.VITE_SUPABASE_URL) || "";
const SUPABASE_KEY = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_KEY : process.env.VITE_SUPABASE_KEY) || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function AuthForm({ onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    const { error } = authMode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      onAuthSuccess();
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">{authMode === 'login' ? 'Acessar Sistema' : 'Criar Conta'}</h2>
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" className="w-full p-3 border rounded-lg" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleAuth} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">
            {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
          <p className="text-center text-sm text-slate-500 cursor-pointer" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
            {authMode === 'login' ? 'Criar conta' : 'Já tenho conta'}
          </p>
        </div>
      </div>
    </div>
  );
}
