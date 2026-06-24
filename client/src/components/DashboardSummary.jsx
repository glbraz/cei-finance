import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { financialService } from '../services/supabase';

export default function DashboardSummary({ transactions }) {
  const balance = financialService.calculateBalance(transactions);
  const monthlyIncome = financialService.calculateMonthlyIncome(transactions);
  const monthlyExpenses = financialService.calculateMonthlyExpenses(transactions);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Saldo Atual */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-2">Saldo Atual</p>
            <h3 className="text-3xl font-bold text-slate-800">R$ {balance.toFixed(2)}</h3>
          </div>
          <Wallet className="w-12 h-12 text-blue-600 opacity-20" />
        </div>
      </div>

      {/* Receitas do Mês */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-2">Receitas Mês</p>
            <h3 className="text-3xl font-bold text-emerald-600">R$ {monthlyIncome.toFixed(2)}</h3>
          </div>
          <TrendingUp className="w-12 h-12 text-emerald-600 opacity-20" />
        </div>
      </div>

      {/* Despesas do Mês */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-2">Despesas Mês</p>
            <h3 className="text-3xl font-bold text-rose-600">R$ {monthlyExpenses.toFixed(2)}</h3>
          </div>
          <TrendingDown className="w-12 h-12 text-rose-600 opacity-20" />
        </div>
      </div>
    </div>
  );
}
