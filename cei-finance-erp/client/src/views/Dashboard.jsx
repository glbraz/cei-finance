import React, { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react';
import DashboardSummary from '../components/DashboardSummary';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';
import { transactionService, authService } from '../services/supabase';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await transactionService.fetchTransactions(user.id);
    if (data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const handleAddTransaction = async (formData) => {
    const { data, error } = await transactionService.addTransaction(user.id, formData);
    if (!error) {
      setIsAddModalOpen(false);
      await fetchTransactions();
    } else {
      alert('Erro ao adicionar transação: ' + error.message);
    }
  };

  const handleToggleStatus = async (transaction) => {
    const newStatus = transaction.status === 'pago' ? 'pendente' : 'pago';
    const { error } = await transactionService.updateTransactionStatus(transaction.id, newStatus);
    if (!error) {
      setTransactions(transactions.map(item =>
        item.id === transaction.id ? { ...item, status: newStatus } : item
      ));
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      const { error } = await transactionService.deleteTransaction(transactionId);
      if (!error) {
        setTransactions(transactions.filter(t => t.id !== transactionId));
      } else {
        alert('Erro ao deletar transação: ' + error.message);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-8">CEI Finance</h1>
        <nav className="space-y-4 flex-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('lancamentos')}
            className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'lancamentos' ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
          >
            Lançamentos
          </button>
        </nav>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full text-rose-400 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">Carregando...</p>
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
            <DashboardSummary transactions={transactions} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">Lançamentos</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nova Transação
              </button>
            </div>
            <TransactionList
              transactions={transactions}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTransaction}
            />
          </div>
        )}
      </main>

      {/* Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}
