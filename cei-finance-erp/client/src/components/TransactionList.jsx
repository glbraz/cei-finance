import React, { useState } from 'react';
import { CheckCircle2, Clock, Trash2, Download, FileSpreadsheet, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

export default function TransactionList({ transactions, onToggleStatus, onDelete }) {
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filtered = transactions
    .filter(t => filterType   === 'todos' || t.type   === filterType)
    .filter(t => filterStatus === 'todos' || t.status === filterStatus)
    .sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === 'amount') { va = +va; vb = +vb; }
      if (va < vb) return sortDir === 'asc' ? -1 :  1;
      if (va > vb) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />;
  };

  const thCls = "px-4 py-3 text-left text-xs font-semibold text-slate-600 cursor-pointer hover:text-blue-600 select-none";

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filtros */}
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="todos">Todos os tipos</option>
          <option value="receita">Receitas</option>
          <option value="despesa">Despesas</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="todos">Todos os status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
        </select>
        <span className="text-xs text-slate-400">{filtered.length} registro{filtered.length !== 1 ? 's' : ''}</span>

        {/* Export */}
        <div className="ml-auto relative">
          <button
            onClick={() => setExportMenuOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
            <ChevronDown className="w-3 h-3" />
          </button>
          {exportMenuOpen && (
            <div
              className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10 overflow-hidden"
              onMouseLeave={() => setExportMenuOpen(false)}
            >
              <button
                onClick={() => { exportToExcel(filtered); setExportMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Exportar para Excel
              </button>
              <button
                onClick={() => { exportToPDF(filtered); setExportMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-t border-slate-100"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                Exportar para PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className={thCls} onClick={() => handleSort('date')}>Data <SortIcon field="date" /></th>
                <th className={thCls} onClick={() => handleSort('description')}>Descrição <SortIcon field="description" /></th>
                <th className={thCls} onClick={() => handleSort('category')}>Categoria <SortIcon field="category" /></th>
                <th className={thCls} onClick={() => handleSort('type')}>Tipo <SortIcon field="type" /></th>
                <th className={thCls} onClick={() => handleSort('bank')}>Banco <SortIcon field="bank" /></th>
                <th className={`${thCls} text-right`} onClick={() => handleSort('amount')}>Valor <SortIcon field="amount" /></th>
                <th className={`${thCls} text-center`} onClick={() => handleSort('status')}>Status <SortIcon field="status" /></th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-slate-400 text-sm">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 max-w-[200px] truncate" title={t.description}>{t.description || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{t.category || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        t.type === 'receita' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {t.type === 'receita' ? '↑ Receita' : '↓ Despesa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 uppercase">{t.bank || '—'}</td>
                    <td className={`px-4 py-3 text-sm text-right font-semibold ${
                      t.type === 'receita' ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onToggleStatus(t)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-colors"
                        title={t.status === 'pago' ? 'Marcar como pendente' : 'Marcar como pago'}
                      >
                        {t.status === 'pago'
                          ? <><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="text-emerald-600">Pago</span></>
                          : <><Clock className="w-4 h-4 text-amber-600" /><span className="text-amber-600">Pendente</span></>
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onDelete(t.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Deletar"
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
    </div>
  );
}
