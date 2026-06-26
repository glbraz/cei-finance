# CEI Finance ERP

Um sistema ERP financeiro simples e intuitivo para gerenciamento de transações, construído com React, Supabase e TailwindCSS.

## 📋 Características

- ✅ Autenticação segura com Supabase
- ✅ Dashboard com resumo financeiro
- ✅ Gerenciamento de transações (receitas e despesas)
- ✅ Visualização de saldo, receitas e despesas mensais
- ✅ Interface responsiva e moderna
- ✅ Suporte a múltiplos bancos

## 🏗️ Arquitetura do Projeto

```
/
├── client/
│   ├── public/                 # Arquivos estáticos
│   ├── src/
│   │   ├── assets/            # Imagens e recursos
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── AuthForm.jsx
│   │   │   ├── DashboardSummary.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── AddTransactionModal.jsx
│   │   │   └── ui/            # Componentes shadcn/ui
│   │   ├── hooks/             # Hooks personalizados
│   │   │   └── useAuth.js
│   │   ├── services/          # Serviços de API
│   │   │   └── supabase.js
│   │   ├── utils/             # Funções utilitárias
│   │   │   └── helpers.js
│   │   ├── views/             # Páginas/Telas
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── NotFound.tsx
│   │   ├── contexts/          # React Contexts
│   │   ├── App.tsx            # Componente raiz
│   │   ├── main.tsx           # Ponto de entrada
│   │   ├── index.css          # Estilos globais
│   │   └── vite-env.d.ts      # Tipos Vite
│   └── index.html
├── server/                     # Código do servidor (placeholder)
├── shared/                     # Código compartilhado (placeholder)
├── .env.local                  # Variáveis de ambiente (desenvolvimento)
├── .env.production             # Variáveis de ambiente (produção)
├── vercel.json                 # Configuração Vercel
├── vite.config.ts             # Configuração Vite
├── tsconfig.json              # Configuração TypeScript
├── package.json               # Dependências
└── README.md                  # Este arquivo
```

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- pnpm (ou npm/yarn)
- Conta Supabase

### Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd cei-finance-erp
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-chave-publica-aqui
```

### Desenvolvimento

Para iniciar o servidor de desenvolvimento:
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```bash
pnpm build
```

Os arquivos compilados estarão em `dist/`

### Preview da Build

```bash
pnpm preview
```

## 📦 Estrutura de Módulos

### `services/supabase.js`
Contém toda a lógica de integração com Supabase:
- `authService`: Funções de autenticação
- `transactionService`: Funções de gerenciamento de transações
- `financialService`: Cálculos financeiros

### `hooks/useAuth.js`
Hook personalizado para gerenciar o estado de autenticação:
- `user`: Usuário autenticado
- `loading`: Estado de carregamento
- `signUp()`: Registrar novo usuário
- `signIn()`: Fazer login
- `signOut()`: Fazer logout

### `components/`
Componentes reutilizáveis:
- `AuthForm.jsx`: Formulário de autenticação
- `DashboardSummary.jsx`: Resumo do dashboard
- `TransactionList.jsx`: Lista de transações
- `AddTransactionModal.jsx`: Modal para adicionar transações

### `utils/helpers.js`
Funções utilitárias:
- `formatCurrency()`: Formata valores em moeda brasileira
- `formatDate()`: Formata datas
- `validateEmail()`: Valida email
- `groupByCategory()`: Agrupa transações por categoria
- E mais...

## 🗄️ Banco de Dados

O projeto utiliza Supabase com a seguinte tabela:

### `transactions`
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date DATE NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'receita' ou 'despesa'
  category VARCHAR(100),
  description TEXT,
  bank VARCHAR(50),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'pago' ou 'pendente'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Autenticação

O projeto utiliza Supabase Auth para autenticação segura:
- Registro de novos usuários
- Login com email e senha
- Logout
- Gerenciamento de sessão

## 🎨 Design

O projeto segue um design minimalista corporativo com:
- Paleta de cores profissional (azul, cinza, branco)
- Tipografia clara e hierárquica
- Componentes com sombras suaves
- Interface responsiva

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta Vercel
- Repositório Git (GitHub, GitLab ou Bitbucket)

### Passos

1. Faça push do código para seu repositório Git
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Selecione seu repositório
5. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_KEY`: Chave pública do Supabase
6. Clique em "Deploy"

A aplicação será automaticamente implantada e você receberá um URL público.

## 📚 Dependências Principais

- **React 19**: Framework UI
- **Vite**: Build tool
- **TailwindCSS 4**: Utilitários CSS
- **shadcn/ui**: Componentes UI
- **Supabase**: Backend e autenticação
- **Lucide React**: Ícones
- **Recharts**: Gráficos
- **Wouter**: Roteamento

## 🛠️ Scripts Disponíveis

- `pnpm dev`: Inicia o servidor de desenvolvimento
- `pnpm build`: Compila para produção
- `pnpm preview`: Visualiza a build
- `pnpm check`: Verifica tipos TypeScript
- `pnpm format`: Formata o código com Prettier

## 📝 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📧 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através de [seu-email@exemplo.com]

---

**Desenvolvido com ❤️ usando React, Supabase e TailwindCSS**
