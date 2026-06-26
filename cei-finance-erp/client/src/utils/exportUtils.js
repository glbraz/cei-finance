/**
 * Utilitários de exportação — Excel (XLSX) e PDF
 * Usa apenas APIs nativas do browser: não precisa de dependências extras.
 */

import { formatCurrency, formatDate } from './helpers';

// ── EXCEL (CSV com BOM para abrir corretamente no Excel BR) ──────────────────
/**
 * Exporta uma lista de transações para .xlsx-compatível (CSV com separador ;)
 * O BOM UTF-8 garante que acentos apareçam corretamente no Excel.
 */
export function exportToExcel(transactions, filename = 'cei-finance') {
  const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Banco', 'Valor (R$)', 'Status'];

  const rows = transactions.map(t => [
    formatDate(t.date),
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.category || '',
    t.type === 'receita' ? 'Receita' : 'Despesa',
    (t.bank || '').toUpperCase(),
    String(t.amount.toFixed(2)).replace('.', ','),
    t.status === 'pago' ? 'Pago' : 'Pendente',
  ]);

  // Totais
  const totalReceitas = transactions.filter(t => t.type === 'receita').reduce((a, t) => a + t.amount, 0);
  const totalDespesas = transactions.filter(t => t.type === 'despesa').reduce((a, t) => a + t.amount, 0);
  const saldo = totalReceitas - totalDespesas;

  const separator = ';';
  const lines = [
    headers.join(separator),
    ...rows.map(r => r.join(separator)),
    '',
    `Total Receitas;${String(totalReceitas.toFixed(2)).replace('.', ',')}`,
    `Total Despesas;${String(totalDespesas.toFixed(2)).replace('.', ',')}`,
    `Saldo;${String(saldo.toFixed(2)).replace('.', ',')}`,
    `Exportado em;${new Date().toLocaleDateString('pt-BR')}`,
  ];

  const BOM = '\uFEFF';
  const csvContent = BOM + lines.join('\r\n');

  downloadFile(csvContent, `${filename}-${today()}.csv`, 'text/csv;charset=utf-8;');
}

// ── PDF (via window.print com estilos embutidos) ─────────────────────────────
export function exportToPDF(transactions, filename = 'CEI Finance — Relatório') {
  const totalReceitas = transactions.filter(t => t.type === 'receita').reduce((a, t) => a + t.amount, 0);
  const totalDespesas = transactions.filter(t => t.type === 'despesa').reduce((a, t) => a + t.amount, 0);
  const saldo = totalReceitas - totalDespesas;

  const rows = transactions.map(t => `
    <tr>
      <td>${formatDate(t.date)}</td>
      <td>${t.description || '—'}</td>
      <td>${t.category || '—'}</td>
      <td class="${t.type === 'receita' ? 'receita' : 'despesa'}">
        ${t.type === 'receita' ? '↑ Receita' : '↓ Despesa'}
      </td>
      <td>${(t.bank || '').toUpperCase()}</td>
      <td class="valor ${t.type === 'receita' ? 'receita' : 'despesa'}">
        ${formatCurrency(t.amount)}
      </td>
      <td class="${t.status === 'pago' ? 'pago' : 'pendente'}">
        ${t.status === 'pago' ? 'Pago' : 'Pendente'}
      </td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${filename}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; font-size: 11px; padding: 20px; }
    .header { background: #0d1b3e; color: #fff; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px; }
    .header h1 { font-size: 18px; }
    .header p  { font-size: 11px; opacity: 0.7; margin-top: 4px; }
    .kpis { display: flex; gap: 12px; margin-bottom: 20px; }
    .kpi { flex: 1; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .kpi .label { font-size: 10px; color: #64748b; margin-bottom: 4px; }
    .kpi .value { font-size: 16px; font-weight: 700; }
    .kpi.verde .value { color: #15803d; }
    .kpi.vermelho .value { color: #b91c1c; }
    .kpi.azul .value { color: #1565c0; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1565c0; color: #fff; padding: 8px 10px; text-align: left; font-size: 10px; }
    td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
    tr:nth-child(even) td { background: #f8fafc; }
    .receita { color: #15803d; font-weight: 600; }
    .despesa { color: #b91c1c; font-weight: 600; }
    .pago    { color: #15803d; }
    .pendente{ color: #d97706; }
    .valor   { text-align: right; font-weight: 600; }
    .footer  { margin-top: 16px; font-size: 9px; color: #94a3b8; text-align: right; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏫 CEI Finance — Relatório de Transações</h1>
    <p>Gerado em ${new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })}</p>
  </div>

  <div class="kpis">
    <div class="kpi verde">
      <div class="label">Total Receitas</div>
      <div class="value">${formatCurrency(totalReceitas)}</div>
    </div>
    <div class="kpi vermelho">
      <div class="label">Total Despesas</div>
      <div class="value">${formatCurrency(totalDespesas)}</div>
    </div>
    <div class="kpi ${saldo >= 0 ? 'verde' : 'vermelho'}">
      <div class="label">Saldo</div>
      <div class="value">${formatCurrency(saldo)}</div>
    </div>
    <div class="kpi azul">
      <div class="label">Transações</div>
      <div class="value">${transactions.length}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Data</th>
        <th>Descrição</th>
        <th>Categoria</th>
        <th>Tipo</th>
        <th>Banco</th>
        <th>Valor</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>${rows || '<tr><td colspan="7" style="text-align:center;color:#94a3b8;">Nenhuma transação</td></tr>'}</tbody>
  </table>

  <div class="footer">CEI Finance ERP · ${new Date().getFullYear()}</div>
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  // Aguarda o load antes de imprimir
  printWindow.onload = () => {
    printWindow.print();
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function today() {
  return new Date().toISOString().split('T')[0];
}
