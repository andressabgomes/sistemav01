# 🚀 StarPrint CRM - Sistema de Gestão de Relacionamento com Cliente

<div align="center">

![StarPrint CRM](https://img.shields.io/badge/StarPrint-CRM-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC?style=for-the-badge&logo=tailwind-css)

**Sistema completo de gestão de relacionamento com cliente para empresas de impressão**

[🚀 Demo](#-demo) • [📋 Funcionalidades](#-funcionalidades) • [🛠️ Tecnologias](#️-tecnologias) • [🚀 Instalação](#-como-executar) • [📚 Documentação](#-documentação)

</div>

---

## 📋 Sobre o Projeto

O **StarPrint CRM** é um sistema completo de gestão de relacionamento com cliente desenvolvido especificamente para empresas de impressão. O sistema oferece funcionalidades avançadas de atendimento, gestão de equipe, monitoramento em tempo real e relatórios detalhados, tudo integrado em uma interface moderna e responsiva.

### 🎯 **Objetivos do Sistema**
- **Automatizar** processos de atendimento ao cliente
- **Centralizar** informações de clientes e projetos
- **Otimizar** gestão de equipe e recursos
- **Fornecer** insights em tempo real para tomada de decisão
- **Melhorar** a experiência do cliente e satisfação

### 🏢 **Público-Alvo**
- Empresas de impressão e gráficas
- Equipes de atendimento ao cliente
- Gerentes e supervisores
- Administradores de sistemas

---

## ✨ Funcionalidades Principais

### 🎯 **Dashboard Inteligente**
- **KPIs em tempo real** com atualizações automáticas
- **Gráficos interativos** usando Recharts
- **Métricas de performance** da equipe
- **Status do sistema** e monitoramento
- **Widgets personalizáveis** por usuário

### 💬 **Atendimento ao Cliente**
- **Chat em tempo real** com interface moderna e intuitiva
- **Fila de atendimento** inteligente com priorização
- **Base de conhecimento** com artigos organizados por categoria
- **Sistema de avaliação NPS** integrado
- **Gestão de tickets** completa com workflow
- **Histórico de atendimentos** detalhado

### 👥 **Gestão de Equipe**
- **Controle de escalas** e presenças
- **Monitoramento de performance** individual e em equipe
- **Metas e indicadores** configuráveis
- **Cobertura da equipe** em tempo real
- **Gestão de permissões** baseada em roles

### 📊 **Monitoramento e Relatórios**
- **Monitoramento em tempo real** de atividades
- **Relatórios customizáveis** por período e métricas
- **Exportação de dados** em múltiplos formatos
- **Análises avançadas** com gráficos interativos
- **Dashboards executivos** para tomada de decisão

### ⚙️ **Administração**
- **Configurações do sistema** centralizadas
- **Gestão de usuários** e perfis
- **Controle de permissões** granular
- **Logs de auditoria** completos
- **Backup e restauração** de dados

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.3.1 | Biblioteca principal para UI |
| **TypeScript** | 5.5.3 | Tipagem estática e melhor DX |
| **Vite** | 5.4.1 | Bundler e dev server rápido |
| **Tailwind CSS** | 3.4.11 | Framework CSS utilitário |
| **Shadcn/ui** | Latest | Componentes base acessíveis |
| **React Router** | 6.26.2 | Roteamento da aplicação |
| **React Query** | 5.56.2 | Gerenciamento de estado e cache |
| **Recharts** | 2.12.7 | Biblioteca de gráficos |
| **Radix UI** | Latest | Primitivos acessíveis |

### **Backend & Integrações**
| Serviço | Propósito | Status |
|----------|-----------|--------|
| **Xano.io** | Backend as a Service | ✅ Principal |
| **Supabase** | Alternativa de backend | ✅ Suporte |
| **PostgreSQL** | Banco de dados | ✅ Integrado |
| **Row Level Security** | Segurança de dados | ✅ Implementado |

### **Ferramentas de Desenvolvimento**
| Ferramenta | Propósito |
|------------|-----------|
| **ESLint** | Linting e qualidade de código |
| **Prettier** | Formatação automática |
| **Husky** | Git hooks |
| **TypeScript** | Verificação de tipos |
| **Vite** | Build tool e dev server |

### **Testes**
| Framework | Propósito | Status |
|-----------|-----------|--------|
| **Vitest** | Framework de testes unitários | ✅ Configurado |
| **Testing Library** | Utilitários para testes React | ✅ Implementado |
| **MSW** | Mock Service Worker | ✅ Configurado |
| **jsdom** | Ambiente DOM para testes | ✅ Funcionando |

---

## 🧪 Sistema de Testes

O projeto possui uma suite completa de testes implementada com as melhores práticas da indústria:

### **✅ Testes Unitários**
- **Componentes React** (StatCard, SectionHeader, Dashboard)
- **Hooks customizados** (usePermissions, useAuth)
- **Funções utilitárias** (validação, formatação)
- **Contextos** (AuthContext, ThemeContext)

### **✅ Testes de Integração**
- **APIs REST** com MSW para mocking
- **Autenticação e autorização** completa
- **CRUD de clientes** e operações
- **Sistema de atendimento** end-to-end
- **Gestão de equipe** e permissões
- **Relatórios e exportação** de dados

### **✅ Configuração Avançada**
- **Vitest** configurado com jsdom para ambiente DOM
- **MSW** para mock de APIs externas
- **Cobertura de código** configurada com relatórios
- **Utilitários de teste** personalizados
- **Mocks abrangentes** para dependências externas
- **Setup automático** de ambiente de testes

### **🚀 Comandos de Teste**
```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes uma vez (CI/CD)
npm run test:run

# Interface gráfica para testes
npm run test:ui

# Executar com cobertura de código
npm run test:coverage

# Executar testes específicos
npm run test -- --run src/components/Dashboard.test.tsx
```

---

## 🚀 Como Executar

### **📋 Pré-requisitos**
- **Node.js** 18+ (recomendado: 20.x LTS)
- **npm** 9+ ou **yarn** 1.22+
- **Git** para clonar o repositório
- **Conta no Xano.io** ou **Supabase**

### **🔧 Instalação Passo a Passo**

#### **1. Clone o Repositório**
```bash
git clone <repository-url>
cd starprint-crm
```

#### **2. Instale as Dependências**
```bash
npm install
# ou
yarn install
```

#### **3. Configure as Variáveis de Ambiente**
```bash
# Copie o arquivo de exemplo
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Configurações do Xano.io (Principal)
VITE_XANO_BASE_URL=https://your-workspace.xano.app
VITE_XANO_API_KEY=your_api_key_here

# Configurações do Supabase (Alternativa)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Configurações da Aplicação
VITE_APP_NAME=StarPrint CRM
VITE_APP_VERSION=1.0.0
VITE_DEBUG_MODE=true
VITE_API_TIMEOUT=10000

# Configurações de Autenticação
VITE_TOKEN_STORAGE_KEY=starprint.token
VITE_REFRESH_STORAGE_KEY=starprint.refresh
```

#### **4. Execute o Projeto**
```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

#### **5. Configurações de Logging (Opcional)**
```env
# Níveis de log: debug, info, warn, error, critical
VITE_LOG_LEVEL=info

# Habilitar/desabilitar transportes
VITE_LOG_ENABLE_CONSOLE=true
VITE_LOG_ENABLE_FILE=false
VITE_LOG_ENABLE_REMOTE=false

# Configurações remotas (se habilitado)
VITE_LOG_REMOTE_ENDPOINT=https://your-logging-service.com/api/logs
VITE_LOG_REMOTE_API_KEY=your_logging_api_key_here
```

O projeto estará disponível em: **http://localhost:8080**

---

## 📁 Estrutura do Projeto

```
starprint-crm/
├── 📁 src/                          # Código fonte principal
│   ├── 📁 components/               # Componentes React
│   │   ├── 📁 ui/                   # Componentes base (Shadcn/ui)
│   │   ├── 📁 atendimento/          # Módulo de atendimento
│   │   ├── 📁 dashboard/            # Componentes do dashboard
│   │   ├── 📁 layouts/              # Layouts da aplicação
│   │   ├── 📁 shared/               # Componentes compartilhados
│   │   └── 📁 auth/                 # Componentes de autenticação
│   ├── 📁 hooks/                    # Custom hooks
│   ├── 📁 contexts/                 # Contextos React
│   ├── 📁 utils/                    # Utilitários e helpers
│   ├── 📁 types/                    # Definições de tipos TypeScript
│   ├── 📁 constants/                # Constantes da aplicação
│   ├── 📁 integrations/             # Integrações externas
│   ├── 📁 pages/                    # Páginas da aplicação
│   ├── 📁 services/                 # Serviços de API
│   ├── 📁 lib/                      # Bibliotecas e configurações
│   └── 📁 test/                     # Suite de testes
│       ├── 📁 setup.ts              # Configuração dos testes
│       ├── 📁 utils/                # Utilitários de teste
│       ├── 📁 mocks/                # Mocks e handlers
│       └── 📁 integration/          # Testes de integração
├── 📁 public/                       # Arquivos estáticos
├── 📁 docs/                         # Documentação adicional
├── 📁 scripts/                      # Scripts utilitários
├── 📁 supabase/                     # Configurações Supabase
└── 📁 configurações/                # Arquivos de configuração
```

---

## 🔧 Scripts Disponíveis

### **🚀 Desenvolvimento**
```bash
npm run dev              # Inicia o servidor de desenvolvimento
npm run build            # Build para produção
npm run build:dev        # Build para desenvolvimento
npm run build:prod       # Build otimizado para produção
npm run preview          # Preview do build
```

### **🔍 Qualidade de Código**
```bash
npm run lint             # Executa o ESLint
npm run lint:fix         # Corrige problemas do ESLint automaticamente
npm run type-check       # Verifica tipos TypeScript
npm run format           # Formata o código com Prettier
npm run format:check     # Verifica formatação sem alterar
```

### **🧪 Testes**
```bash
npm run test             # Executa todos os testes
npm run test:watch       # Executa testes em modo watch
npm run test:run         # Executa testes uma vez
npm run test:ui          # Interface gráfica de testes
npm run test:coverage    # Executa com relatório de cobertura
```

### **📊 Análise e Build**
```bash
npm run build:analyze    # Analisa o bundle com visualização
npm run build:dev        # Build para desenvolvimento
npm run build:prod       # Build otimizado para produção
```

---

## 🔄 Migração para Xano.io

Este projeto suporta migração completa do Supabase para o Xano.io:

### **📚 Documentação de Migração**
- **Guia Completo**: [docs/MIGRATION.md](docs/MIGRATION.md)
- **Gerenciador**: [src/components/MigrationManager.tsx](src/components/MigrationManager.tsx)
- **Scripts**: [scripts/](scripts/) para automação

### **🧪 Teste de Conectividade**
```bash
# Testar conexão com o Xano
node scripts/test-xano-connection.js

# Verificar status da migração
npm run migration:status
```

### **⚙️ Configuração do Xano.io**
```env
VITE_XANO_BASE_URL=https://your-workspace.xano.app
VITE_XANO_API_KEY=your_api_key_here
VITE_XANO_AUTH_ENDPOINT=/auth/login
VITE_XANO_REFRESH_ENDPOINT=/auth/refresh
```

---

## 🗄️ Banco de Dados

### **📊 Tabelas Principais**

| Tabela | Descrição | Campos Principais |
|--------|-----------|-------------------|
| `users` | Usuários do sistema | id, email, role, permissions |
| `clients` | Clientes cadastrados | id, name, email, phone, status |
| `tickets` | Tickets de atendimento | id, client_id, agent_id, status, priority |
| `nps_responses` | Avaliações de satisfação | id, ticket_id, rating, feedback |
| `strategic_clients` | Clientes estratégicos | id, client_id, tier, value |
| `monitoring_sessions` | Sessões de monitoramento | id, user_id, start_time, end_time |
| `team_capacity` | Capacidade da equipe | id, user_id, max_tickets, current_load |

### **🔐 Segurança**
- **Row Level Security (RLS)** implementado
- **Autenticação JWT** com refresh automático
- **Controle de acesso** baseado em roles
- **Validação de entrada** em todas as APIs

### **📈 Migrations**
As migrations estão localizadas em `supabase/migrations/` e podem ser executadas via:
- **Supabase CLI**
- **Interface web do Supabase**
- **Scripts automatizados**

---

## 🔐 Sistema de Autenticação

### **🏗️ Arquitetura**
- **Context API** para gerenciamento de estado
- **JWT tokens** com refresh automático
- **Interceptors** para tratamento de tokens
- **Fila de requisições** durante refresh
- **Rotas protegidas** com redirecionamento

### **👥 Roles e Permissões**
| Role | Acesso | Funcionalidades |
|------|--------|-----------------|
| **ADMIN** | Completo | Todas as funcionalidades |
| **MANAGER** | Gerencial | Gestão de equipe + atendimento |
| **USER** | Básico | Atendimento e visualização |

### **🔑 Configurações de Segurança**
```env
VITE_TOKEN_STORAGE_KEY=starprint.token
VITE_REFRESH_STORAGE_KEY=starprint.refresh
VITE_SESSION_TIMEOUT=3600000
VITE_REFRESH_THRESHOLD=300000
```

### **📝 Sistema de Logging**
```env
# Níveis de log configuráveis
VITE_LOG_LEVEL=info

# Transportes de log
VITE_LOG_ENABLE_CONSOLE=true
VITE_LOG_ENABLE_FILE=false
VITE_LOG_ENABLE_REMOTE=false

# Categorias de log
VITE_LOG_CATEGORIES=auth,api,performance,security,user-actions
```

---

## 📱 Responsividade e UX

### **📱 Breakpoints**
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1279px
- **Large**: 1280px+

### **🎨 Sistema de Temas**
- **Tema claro** (padrão)
- **Tema escuro** (automático)
- **Tema automático** baseado no sistema
- **Transições suaves** entre temas

### **♿ Acessibilidade**
- **ARIA labels** implementados
- **Navegação por teclado** completa
- **Contraste adequado** em todos os temas
- **Screen readers** suportados

---

## 🚀 Deploy e Produção

### **🌐 Vercel (Recomendado)**
1. **Conecte** seu repositório ao Vercel
2. **Configure** as variáveis de ambiente
3. **Deploy automático** a cada push
4. **Preview deployments** para branches

### **🌐 Netlify**
1. **Conecte** o repositório
2. **Configure** build settings
3. **Deploy** automático
4. **Forms** e funções serverless

### **🐳 Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

### **☁️ Outras Plataformas**
- **AWS Amplify**
- **Google Cloud Run**
- **Azure Static Web Apps**
- **Heroku**

---

## 🤝 Contribuição

### **📋 Como Contribuir**
1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

### **🔧 Padrões de Desenvolvimento**
- **Conventional Commits** para mensagens
- **ESLint + Prettier** para formatação
- **TypeScript** para tipagem
- **Testes** obrigatórios para novas features

### **🧪 Padrões de Teste**
- ✅ **Cobertura mínima** de 70%
- ✅ **Testes unitários** para todas as funções
- ✅ **Testes de integração** para APIs
- ✅ **Mocks** para dependências externas
- ✅ **Padrão AAA** (Arrange, Act, Assert)

---

## 📚 Documentação Adicional

### **📖 Guias Detalhados**
- [📋 API Reference](docs/API.md) - Documentação completa da API
- [🔐 Sistema de Autenticação](docs/AUTH_SYSTEM.md) - Detalhes de segurança
- [🚀 Deploy e Produção](docs/DEPLOY.md) - Guias de deploy
- [🔄 Migração](docs/MIGRATION.md) - Migração para Xano.io
- [⚙️ Configuração Xano](docs/XANO_SETUP.md) - Setup do Xano.io

### **🔧 Scripts e Utilitários**
- [📊 Inserir Clientes](scripts/insert-main-clients.js)
- [🔍 Verificar Clientes](scripts/verify-clients.js)
- [🧪 Testar Navegação](scripts/test-navigation.js)
- [🔌 Testar Conexão Xano](scripts/test-xano-connection.js)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🆘 Suporte e Contato

### **📧 Contato Direto**
- **Email**: suporte@starprint.com
- **Discord**: [Servidor da Comunidade](https://discord.gg/starprint)
- **Documentação**: [docs.starprint.com](https://docs.starprint.com)

### **🐛 Reportar Bugs**
1. **Verifique** se já foi reportado
2. **Use** o template de issue
3. **Inclua** logs e screenshots
4. **Descreva** os passos para reproduzir

### **💡 Solicitar Features**
1. **Descreva** a funcionalidade desejada
2. **Explique** o caso de uso
3. **Discuta** com a comunidade
4. **Aguarde** avaliação da equipe

---

## 🔄 Changelog

### **v1.0.0 (2024-01-XX) - Lançamento Inicial**
- ✨ **Dashboard completo** com KPIs em tempo real
- 💬 **Sistema de atendimento** com chat e filas
- 👥 **Gestão de equipe** e escalas
- 📊 **Relatórios avançados** e exportação
- 🧪 **Suite completa de testes** com cobertura
- 🔐 **Sistema de autenticação** robusto
- 📱 **Interface responsiva** para todos os dispositivos
- 🌐 **Integração Xano.io** como backend principal

### **v0.9.0 (2023-12-XX) - Beta Release**
- 🚀 **MVP** com funcionalidades core
- 🔧 **Configuração básica** do sistema
- 📋 **Estrutura** da aplicação
- 🧪 **Testes iniciais** implementados

---

## 🏆 Reconhecimentos

### **🛠️ Tecnologias Utilizadas**
- **React** - Biblioteca de UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Shadcn/ui** - Componentes
- **Supabase** - Backend as a Service

### **👥 Contribuidores**
- **Equipe StarPrint** - Desenvolvimento principal
- **Comunidade Open Source** - Contribuições e feedback

---

<div align="center">

**Desenvolvido com ❤️ pela equipe StarPrint**

[⭐ Star no GitHub](https://github.com/starprint/crm) • [📖 Documentação](https://docs.starprint.com) • [🚀 Demo](https://demo.starprint.com)

</div>
