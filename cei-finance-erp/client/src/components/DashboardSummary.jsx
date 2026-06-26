import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Building2 } from 'lucide-react';
import { financialService } from '../services/supabase';
import { formatCurrency } from '../utils/helpers';

const KpiCard = ({ label, value, icon: Icon, colorClass, bgClass }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${bgClass}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <h3 className={`text-2xl font-bold ${colorClass}`}>{value}</h3>
      </div>
      <Icon className={`w-10 h-10 opacity-20 ${colorClass}`} />
    </div>
  </div>
);

export default function DashboardSummary({ transactions }) {
  const balance         = financialService.calculateBalance(transactions);
  const monthlyIncome   = financialService.calculateMonthlyIncome(transactions);
  const monthlyExpenses = financialService.calculateMonthlyExpenses(transactions);
  const byBank          = financialService.calculateByBank(transactions);

  const pendingCount = transactions.filter(t => t.status === 'pendente').length;
  const pendingValue = transactions
    .filter(t => t.status === 'pendente')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          label="Saldo Atual"
          value={formatCurrency(balance)}
          icon={Wallet}
          colorClass={balance >= 0 ? 'text-slate-800' : 'text-rose-600'}
        />
        <KpiCard
          label={`Receitas — ${new Date().toLocaleString('pt-BR', { month: 'long' })}`}
          value={formatCurrency(monthlyIncome)}
          icon={TrendingUp}
          colorClass="text-emerald-600"
        />
        <KpiCard
          label={`Despesas — ${new Date().toLocaleString('pt-BR', { month: 'long' })}`}
          value={formatCurrency(monthlyExpenses)}
          icon={TrendingDown}
          colorClass="text-rose-600"
        />
      </div>

      {/* Saldo por banco + pendentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saldo por banco */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-slate-700">Saldo por Banco</h4>
          </div>
          {Object.keys(byBank).length === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma transação registrada.</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(byBank).map(([bank, value]) => (
                <li key={bank} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-slate-600">{bank}</span>
                  <span className={`font-semibold ${value >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(value)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pendentes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h4 className="font-semibold text-slate-700 mb-4">⏳ Pendentes</h4>
          <p className="text-3xl font-bold text-amber-600 mb-1">{formatCurrency(pendingValue)}</p>
          <p className="text-sm text-slate-500">{pendingCount} transaç{pendingCount === 1 ? 'ão' : 'ões'} aguardando pagamento</p>
        </div>
      </div>
    </div>
  );
}
