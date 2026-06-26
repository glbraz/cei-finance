import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_SUPABASE_URL
  : undefined) || '';
const SUPABASE_KEY = (typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_SUPABASE_KEY
  : undefined) || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Autenticação ─────────────────────────────────────────────────────────────
export const authService = {
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
  signUp: async (email, password) => supabase.auth.signUp({ email, password }),
  signIn: async (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signOut: async () => supabase.auth.signOut(),
  onAuthStateChange: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  },
};

// ── Transações ───────────────────────────────────────────────────────────────
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
      .insert([{ ...transaction, user_id: userId, amount: parseFloat(transaction.amount) }]);
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
  },
};

// ── Cálculos financeiros ─────────────────────────────────────────────────────
const isCurrentMonth = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
};

export const financialService = {
  /** Saldo real: soma todas as transações pagas (receitas - despesas) */
  calculateBalance: (transactions) =>
    transactions.reduce((acc, t) =>
      acc + (t.status === 'pago' ? (t.type === 'receita' ? t.amount : -t.amount) : 0), 0),

  /** Receitas pagas do mês corrente */
  calculateMonthlyIncome: (transactions) =>
    transactions
      .filter(t => t.type === 'receita' && t.status === 'pago' && isCurrentMonth(t.date))
      .reduce((acc, t) => acc + t.amount, 0),

  /** Despesas pagas do mês corrente */
  calculateMonthlyExpenses: (transactions) =>
    transactions
      .filter(t => t.type === 'despesa' && t.status === 'pago' && isCurrentMonth(t.date))
      .reduce((acc, t) => acc + t.amount, 0),

  /** Totais por banco */
  calculateByBank: (transactions) =>
    transactions.reduce((acc, t) => {
      if (t.status !== 'pago') return acc;
      const key = t.bank || 'outros';
      acc[key] = (acc[key] || 0) + (t.type === 'receita' ? t.amount : -t.amount);
      return acc;
    }, {}),

  /** Totais por categoria */
  calculateByCategory: (transactions, type) =>
    transactions
      .filter(t => t.type === type && t.status === 'pago')
      .reduce((acc, t) => {
        acc[t.category || 'Outros'] = (acc[t.category || 'Outros'] || 0) + t.amount;
        return acc;
      }, {}),
};
