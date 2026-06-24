import React from 'react';
import { CheckCircle2, Clock, Trash2 } from 'lucide-react';

export default function TransactionList({ transactions, onToggleStatus, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Data</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Descrição</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Categoria</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tipo</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Valor</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                  Nenhuma transação registrada.
                </td>
              </tr>
            ) : (
              transactions.map(t => (
                <tr key={t.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-700">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{t.description}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{t.category}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.type === 'receita' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {t.type === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-slate-800">
                    R$ {t.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onToggleStatus(t)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                      title={t.status === 'pago' ? 'Marcar como pendente' : 'Marcar como pago'}
                    >
                      {t.status === 'pago' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600">Pago</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="text-amber-600">Pendente</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(t.id)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Deletar transação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
