export const APP_NAME = 'CEI Finance ERP';
export const APP_VERSION = '1.0.0';

export const TRANSACTION_TYPES = {
  INCOME:  'receita',
  EXPENSE: 'despesa',
} as const;

export const TRANSACTION_STATUS = {
  PAID:    'pago',
  PENDING: 'pendente',
} as const;

export const TRANSACTION_CATEGORIES = [
  'Mensalidades', 'Matrículas', 'Material', 'Eventos', 'Convênios',
  'Repasses', 'Salários', 'Alimentação', 'Água', 'Energia', 'Internet',
  'Limpeza', 'Pedagógico', 'Manutenção', 'Administrativo', 'Impostos', 'Outros',
];

export const BANKS = [
  { value: 'asaas',  label: 'Asaas'  },
  { value: 'sicoob', label: 'Sicoob' },
];
