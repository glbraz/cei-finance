import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Inicializar Supabase com fallback seguro para variáveis de ambiente
const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : process.env.VITE_SUPABASE_URL) || "";
const SUPABASE_KEY = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_KEY : process.env.VITE_SUPABASE_KEY) || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Funções de Autenticação
export const authService = {
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  signUp: async (email, password) => {
    return await supabase.auth.signUp({ email, password });
  },

  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  onAuthStateChange: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  }
};

// Funções de Transações
export const transactionService = {
  fetchTransactions: async (userId) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    return { data, error };
  },

  addTransaction: async (userId, transaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transaction,
        user_id: userId,
        amount: parseFloat(transaction.amount)
      }]);
    
    return { data, error };
  },

  updateTransactionStatus: async (transactionId, status) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', transactionId);
    
    return { error };
  },

  deleteTransaction: async (transactionId) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);
    
    return { error };
  }
};

// Funções de Cálculos Financeiros
export const financialService = {
  calculateBalance: (transactions) => {
    return transactions.reduce((acc, t) => acc + (t.status === 'pago' ? (t.type === 'receita' ? t.amount : -t.amount) : 0), 0);
  },

  calculateMonthlyIncome: (transactions) => {
    return transactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((acc, t) => acc + t.amount, 0);
  },

  calculateMonthlyExpenses: (transactions) => {
    return transactions.filter(t => t.type === 'despesa' && t.status === 'pago').reduce((acc, t) => acc + t.amount, 0);
  }
};
