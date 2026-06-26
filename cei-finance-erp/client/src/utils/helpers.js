/**
 * Formata um número como moeda brasileira (R$)
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata uma data para o padrão brasileiro (DD/MM/YYYY)
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

/**
 * Valida um email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - True se válido, false caso contrário
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calcula a diferença entre receitas e despesas
 * @param {number} income - Receitas
 * @param {number} expenses - Despesas
 * @returns {number} - Diferença
 */
export const calculateProfit = (income, expenses) => {
  return income - expenses;
};

/**
 * Agrupa transações por categoria
 * @param {Array} transactions - Lista de transações
 * @returns {Object} - Transações agrupadas por categoria
 */
export const groupByCategory = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category || 'Sem Categoria';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(transaction);
    return acc;
  }, {});
};

/**
 * Filtra transações por tipo
 * @param {Array} transactions - Lista de transações
 * @param {string} type - Tipo de transação ('receita' ou 'despesa')
 * @returns {Array} - Transações filtradas
 */
export const filterByType = (transactions, type) => {
  return transactions.filter(t => t.type === type);
};

/**
 * Filtra transações por status
 * @param {Array} transactions - Lista de transações
 * @param {string} status - Status da transação ('pago' ou 'pendente')
 * @returns {Array} - Transações filtradas
 */
export const filterByStatus = (transactions, status) => {
  return transactions.filter(t => t.status === status);
};
