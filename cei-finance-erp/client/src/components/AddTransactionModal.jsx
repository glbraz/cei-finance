import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BANKS, TRANSACTION_CATEGORIES } from '../const';

const CEI_CATEGORIES_INCOME  = ['Mensalidades', 'Matrículas', 'Material', 'Eventos', 'Convênios', 'Repasses', 'Outros'];
const CEI_CATEGORIES_EXPENSE = ['Salários', 'Alimentação', 'Água', 'Energia', 'Internet', 'Limpeza', 'Pedagógico', 'Manutenção', 'Administrativo', 'Impostos', 'Outros'];

const initialForm = {
  date: new Date().toISOString().split('T')[0],
  type: 'receita',
  category: '',
  description: '',
  bank: 'asaas',
  amount: '',
  status: 'pago',
};

export default function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const categories = formData.type === 'receita' ? CEI_CATEGORIES_INCOME : CEI_CATEGORIES_EXPENSE;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' ? { category: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;
    setSubmitting(true);
    await onAdd(formData);
    setSubmitting(false);
    setFormData(initialForm);
  };

  if (!isOpen) return null;

  const inputCls = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-bold text-slate-800">Nova Transação</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo — destaque visual */}
          <div className="flex gap-2">
            {['receita', 'despesa'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: t, category: '' }))}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                  formData.type === t
                    ? t === 'receita'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-rose-600 text-white border-rose-600'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t === 'receita' ? '↑ Receita' : '↓ Despesa'}
              </button>
            ))}
          </div>

          <div>
            <label className={labelCls}>Data</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputCls} required />
          </div>

          <div>
            <label className={labelCls}>Categoria</label>
            <select name="category" value={formData.category} onChange={handleChange} className={inputCls} required>
              <option value="">Selecione...</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalhes da transação"
              rows="2"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Banco / Conta</label>
            <select name="bank" value={formData.bank} onChange={handleChange} className={inputCls}>
              <option value="asaas">Asaas</option>
              <option value="sicoob">Sicoob</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Valor (R$)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0,00"
              step="0.01"
              min="0.01"
              className={inputCls}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputCls}>
              <option value="pago">Pago / Recebido</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
