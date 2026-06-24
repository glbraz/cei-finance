// Constantes da aplicação CEI Finance

export const APP_NAME = 'CEI Finance ERP';
export const APP_VERSION = '1.0.0';

// Configurações de Supabase
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  key: import.meta.env.VITE_SUPABASE_KEY || ''
};

// Tipos de Transação
export const TRANSACTION_TYPES = {
  INCOME: 'receita',
  EXPENSE: 'despesa'
};

// Status de Transação
export const TRANSACTION_STATUS = {
  PAID: 'pago',
  PENDING: 'pendente'
};

// Categorias de Transação
export const TRANSACTION_CATEGORIES = [
  'Vendas',
  'Aluguel',
  'Salário',
  'Fornecedores',
  'Utilidades',
  'Marketing',
  'Outros'
];

// Bancos
export const BANKS = [
  { value: 'asaas', label: 'Asaas' },
  { value: 'nubank', label: 'Nubank' },
  { value: 'bradesco', label: 'Bradesco' },
  { value: 'itau', label: 'Itaú' },
  { value: 'caixa', label: 'Caixa' }
];
