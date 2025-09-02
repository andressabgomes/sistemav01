# 📚 Documentação StarPrint CRM

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Funcionalidades](#funcionalidades)
4. [Tecnologias](#tecnologias)
5. [Instalação e Configuração](#instalação-e-configuração)
6. [Estrutura do Projeto](#estrutura-do-projeto)
7. [API e Banco de Dados](#api-e-banco-de-dados)
8. [Testes](#testes)
9. [Deploy](#deploy)
10. [Contribuição](#contribuição)
11. [FAQ](#faq)

---

## 🎯 Visão Geral

O **StarPrint CRM** é um sistema completo de gestão de relacionamento com cliente desenvolvido especificamente para empresas de impressão. O sistema integra múltiplos módulos de negócio em uma plataforma unificada, oferecendo uma solução end-to-end para gestão de clientes, atendimento, equipe e relatórios.

### **Objetivo Principal**
Automatizar e otimizar todos os processos de relacionamento com clientes em empresas de impressão, desde o primeiro contato até a fidelização, passando por atendimento, gestão de projetos e análise de performance.

### **Público-Alvo**
- Gráficas e empresas de impressão
- Centros de impressão
- Bureaus de serviços gráficos
- Empresas de plotagem e sinalização
- Estabelecimentos que oferecem serviços de impressão

---

## 🏗️ Arquitetura do Sistema

### **Arquitetura Geral**
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)           │
├─────────────────────────────────────────────────────────────┤
│                    Camada de API (Supabase)                │
├─────────────────────────────────────────────────────────────┤
│                    Banco de Dados (PostgreSQL)             │
└─────────────────────────────────────────────────────────────┘
```

### **Padrões Arquiteturais**
- **Frontend**: Component-based architecture com React
- **Estado**: React Query para cache e sincronização
- **Backend**: Supabase como BaaS (Backend as a Service)
- **Banco**: PostgreSQL com Row Level Security
- **Autenticação**: JWT com roles e permissões

### **Princípios de Design**
- **Responsividade**: Mobile-first approach
- **Acessibilidade**: WCAG 2.1 compliance
- **Performance**: Lazy loading e code splitting
- **Segurança**: RLS e validação em múltiplas camadas

---

## ✨ Funcionalidades

### **1. Dashboard Inteligente**
- **KPIs em Tempo Real**
  - Atendimentos ativos
  - Taxa de resolução
  - Satisfação média
  - Tempo médio de resposta

- **Gráficos Interativos**
  - Evolução de atendimentos
  - Distribuição por canais
  - Performance da equipe
  - Metas vs. realização

- **Status do Sistema**
  - Monitoramento de saúde
  - Indicadores de performance
  - Alertas e notificações

### **2. Sistema de Atendimento**
- **Chat em Tempo Real**
  - Interface moderna e intuitiva
  - Suporte a múltiplos canais
  - Histórico de conversas
  - Transferência entre agentes

- **Fila de Atendimento**
  - Distribuição inteligente
  - Priorização automática
  - Balanceamento de carga
  - Métricas de performance

- **Base de Conhecimento**
  - Artigos organizados por categoria
  - Sistema de busca avançada
  - Versões e histórico
  - Feedback dos usuários

- **Gestão de Tickets**
  - Criação e acompanhamento
  - Categorização e priorização
  - Workflow personalizável
  - SLA e alertas

- **Avaliação NPS**
  - Coleta automática de feedback
  - Análise de satisfação
  - Relatórios de tendências
  - Ações corretivas

### **3. Gestão de Equipe**
- **Controle de Escalas**
  - Planejamento de horários
  - Controle de presenças
  - Gestão de folgas
  - Substituições

- **Monitoramento de Performance**
  - Métricas individuais
  - Comparativos de equipe
  - Identificação de gaps
  - Planos de desenvolvimento

- **Metas e Indicadores**
  - Definição de objetivos
  - Acompanhamento em tempo real
  - Alertas de performance
  - Relatórios de progresso

### **4. Gestão de Clientes**
- **CRM Completo**
  - Cadastro de clientes
  - Histórico de interações
  - Preferências e perfil
  - Segmentação automática

- **Histórico de Serviços**
  - Registro de projetos
  - Orçamentos e propostas
  - Faturamento
  - Satisfação pós-venda

- **Contratos e Equipamentos**
  - Gestão de contratos
  - Inventário de equipamentos
  - Manutenção preventiva
  - Renovação automática

### **5. Monitoramento e Relatórios**
- **Monitoramento em Tempo Real**
  - Status dos sistemas
  - Performance de agentes
  - Fila de atendimento
  - Alertas críticos

- **Relatórios Customizáveis**
  - Dashboards personalizados
  - Exportação em múltiplos formatos
  - Agendamento automático
  - Compartilhamento seguro

- **Análises Avançadas**
  - Business Intelligence
  - Previsões e tendências
  - Análise de comportamento
  - ROI de campanhas

---

## 🛠️ Tecnologias

### **Frontend**
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.3.1 | Biblioteca principal para UI |
| **TypeScript** | 5.5.3 | Tipagem estática e segurança |
| **Vite** | 5.4.1 | Bundler e dev server |
| **Tailwind CSS** | 3.4.11 | Framework CSS utilitário |
| **Shadcn/ui** | Latest | Biblioteca de componentes |
| **Radix UI** | Latest | Componentes primitivos |
| **React Router** | 6.26.2 | Roteamento da aplicação |
| **React Query** | 5.56.2 | Gerenciamento de estado |
| **Recharts** | 2.12.7 | Gráficos e visualizações |

### **Backend**
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Supabase** | 2.55.0 | Backend as a Service |
| **PostgreSQL** | 15+ | Banco de dados principal |
| **Row Level Security** | Built-in | Segurança em nível de linha |
| **Real-time** | Built-in | Atualizações em tempo real |
| **Storage** | Built-in | Armazenamento de arquivos |

### **Ferramentas de Desenvolvimento**
| Ferramenta | Propósito |
|------------|-----------|
| **ESLint** | Linting e qualidade de código |
| **Prettier** | Formatação automática |
| **Husky** | Git hooks |
| **Vitest** | Framework de testes |
| **Testing Library** | Utilitários para testes |
| **MSW** | Mock Service Worker |

---

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Git

### **Passo a Passo**

#### **1. Clone do Repositório**
```bash
git clone <repository-url>
cd starprint-crm
```

#### **2. Instalação de Dependências**
```bash
npm install
```

#### **3. Configuração de Variáveis de Ambiente**
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local`:
```env
# Supabase
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

# Aplicação
VITE_APP_NAME=StarPrint CRM
VITE_DEBUG_MODE=true

# Ambiente
NODE_ENV=development
```

#### **4. Configuração do Supabase**
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute as migrations do banco:
```bash
npx supabase db push
```

#### **5. Execução do Projeto**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

O projeto estará disponível em: **http://localhost:8080**

---

## 📁 Estrutura do Projeto

```
starprint-crm/
├── 📁 src/                          # Código fonte
│   ├── 📁 components/               # Componentes React
│   │   ├── 📁 ui/                   # Componentes base (Shadcn/ui)
│   │   ├── 📁 atendimento/          # Módulo de atendimento
│   │   ├── 📁 dashboard/            # Componentes do dashboard
│   │   ├── 📁 layouts/              # Layouts da aplicação
│   │   ├── 📁 shared/               # Componentes compartilhados
│   │   └── 📁 auth/                 # Autenticação
│   ├── 📁 hooks/                    # Custom hooks
│   ├── 📁 contexts/                 # Contextos React
│   ├── 📁 utils/                    # Utilitários
│   ├── 📁 types/                    # Definições de tipos
│   ├── 📁 constants/                # Constantes da aplicação
│   ├── 📁 integrations/             # Integrações externas
│   ├── 📁 pages/                    # Páginas da aplicação
│   └── 📁 test/                     # Suite de testes
├── 📁 supabase/                     # Configuração Supabase
│   ├── 📁 migrations/               # Migrations do banco
│   └── config.toml                  # Configuração do projeto
├── 📁 docs/                         # Documentação
├── 📁 public/                       # Arquivos estáticos
└── 📁 scripts/                      # Scripts utilitários
```

### **Descrição dos Módulos**

#### **Components**
- **ui/**: Componentes base reutilizáveis
- **atendimento/**: Sistema completo de atendimento
- **dashboard/**: Dashboard e métricas
- **layouts/**: Estruturas de página
- **shared/**: Componentes compartilhados

#### **Hooks**
- **usePermissions**: Controle de permissões
- **useAuth**: Autenticação e usuário
- **useDataCache**: Cache de dados
- **usePerformance**: Métricas de performance

#### **Contexts**
- **AuthContext**: Estado de autenticação
- **ThemeContext**: Gerenciamento de temas

---

## 🔌 API e Banco de Dados

### **Estrutura do Banco**

#### **Tabelas Principais**
```sql
-- Usuários e Autenticação
users                    -- Usuários do sistema
user_profiles           -- Perfis estendidos
user_roles              -- Roles e permissões

-- Clientes
clients                 -- Cadastro de clientes
client_addresses        -- Endereços
client_contacts         -- Contatos
client_persons          -- Pessoas de contato
client_contracts        -- Contratos
client_equipment        -- Equipamentos

-- Atendimento
tickets                 -- Tickets de atendimento
ticket_messages         -- Mensagens dos tickets
ticket_attachments      -- Anexos
knowledge_base          -- Base de conhecimento
nps_responses           -- Avaliações NPS

-- Equipe
team_members            -- Membros da equipe
team_schedules          -- Escalas
team_performance        -- Métricas de performance
team_goals              -- Metas e objetivos

-- Relatórios
reports                 -- Relatórios gerados
report_schedules        -- Agendamentos
analytics_data          -- Dados analíticos
```

#### **Relacionamentos**
- Clientes podem ter múltiplos endereços e contatos
- Tickets são vinculados a clientes e agentes
- Equipe tem escalas e metas associadas
- Relatórios são baseados em dados agregados

### **Endpoints da API**

#### **Autenticação**
```
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
GET    /api/auth/me             # Perfil do usuário
POST   /api/auth/refresh        # Renovar token
```

#### **Clientes**
```
GET    /api/clients             # Listar clientes
GET    /api/clients/:id         # Obter cliente
POST   /api/clients             # Criar cliente
PUT    /api/clients/:id         # Atualizar cliente
DELETE /api/clients/:id         # Deletar cliente
```

#### **Atendimento**
```
GET    /api/tickets             # Listar tickets
GET    /api/tickets/:id         # Obter ticket
POST   /api/tickets             # Criar ticket
PUT    /api/tickets/:id         # Atualizar ticket
POST   /api/tickets/:id/message # Adicionar mensagem
```

#### **Equipe**
```
GET    /api/team/members        # Listar equipe
GET    /api/team/performance    # Métricas de performance
GET    /api/team/schedules      # Escalas
POST   /api/team/goals          # Definir metas
```

### **Segurança**
- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Políticas de acesso** baseadas em roles
- **Validação** em múltiplas camadas
- **Auditoria** de todas as operações

---

## 🧪 Testes

### **Estrutura de Testes**
```
src/test/
├── 📁 setup.ts                 # Configuração global
├── 📁 utils/                   # Utilitários de teste
├── 📁 mocks/                   # Mocks e handlers
└── 📁 integration/             # Testes de integração
```

### **Tipos de Teste**

#### **Testes Unitários**
- Componentes React
- Hooks customizados
- Funções utilitárias
- Contextos

#### **Testes de Integração**
- APIs REST
- Fluxos de autenticação
- Operações CRUD
- Tratamento de erros

#### **Testes E2E**
- Fluxos completos de usuário
- Navegação entre páginas
- Interações com formulários

### **Execução de Testes**
```bash
# Todos os testes
npm run test

# Modo watch
npm run test:watch

# Cobertura
npm run test:coverage

# Interface gráfica
npm run test:ui
```

### **Cobertura Mínima**
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

---

## 🚀 Deploy

### **Plataformas Suportadas**

#### **Vercel (Recomendado)**
1. Conecte seu repositório
2. Configure variáveis de ambiente
3. Deploy automático a cada push

#### **Netlify**
1. Conecte o repositório
2. Configure build settings
3. Deploy automático

#### **Outras Plataformas**
- AWS Amplify
- Google Cloud Run
- Azure Static Web Apps
- DigitalOcean App Platform

### **Variáveis de Ambiente de Produção**
```env
VITE_SUPABASE_URL=sua_url_producao
VITE_SUPABASE_ANON_KEY=sua_chave_producao
VITE_APP_NAME=StarPrint CRM
VITE_DEBUG_MODE=false
NODE_ENV=production
```

### **Build de Produção**
```bash
npm run build:prod
```

### **Monitoramento Pós-Deploy**
- Logs de erro
- Métricas de performance
- Uptime e disponibilidade
- Alertas automáticos

---

## 🤝 Contribuição

### **Como Contribuir**

#### **1. Fork do Projeto**
```bash
git clone https://github.com/seu-usuario/starprint-crm.git
cd starprint-crm
```

#### **2. Criação de Branch**
```bash
git checkout -b feature/nova-funcionalidade
```

#### **3. Desenvolvimento**
- Siga os padrões de código
- Escreva testes para novas funcionalidades
- Mantenha a cobertura de testes
- Documente mudanças importantes

#### **4. Commit e Push**
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

#### **5. Pull Request**
- Crie um PR no GitHub
- Descreva as mudanças
- Aguarde review e aprovação

### **Padrões de Código**

#### **Convenções de Nomenclatura**
- **Componentes**: PascalCase (ex: `UserProfile`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAuth`)
- **Funções**: camelCase (ex: `validateEmail`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `MAX_RETRY_ATTEMPTS`)

#### **Estrutura de Arquivos**
- Um componente por arquivo
- Nomes descritivos e claros
- Organização por funcionalidade
- Separação de responsabilidades

#### **Testes**
- Sempre escreva testes para novas funcionalidades
- Mantenha cobertura mínima de 70%
- Use mocks para dependências externas
- Siga o padrão AAA (Arrange, Act, Assert)

---

## ❓ FAQ

### **Perguntas Frequentes**

#### **Q: O sistema funciona offline?**
A: O sistema funciona parcialmente offline. Dados são sincronizados quando a conexão é restaurada.

#### **Q: Quantos usuários simultâneos suporta?**
A: O Supabase suporta milhares de conexões simultâneas. Para casos específicos, consulte a documentação.

#### **Q: Posso personalizar o sistema?**
A: Sim! O sistema é altamente customizável através de configurações e temas.

#### **Q: Como faço backup dos dados?**
A: O Supabase oferece backups automáticos. Você também pode exportar dados via API.

#### **Q: O sistema é compatível com mobile?**
A: Sim! O sistema é totalmente responsivo e otimizado para dispositivos móveis.

#### **Q: Posso integrar com outros sistemas?**
A: Sim! O sistema oferece APIs REST para integração com outros sistemas.

---

## 📞 Suporte

### **Canais de Suporte**
- 📧 **Email**: suporte@starprint.com
- 💬 **Discord**: [Link do servidor]
- 📖 **Documentação**: [Link da documentação]
- 🐛 **Issues**: [GitHub Issues]

### **Horário de Atendimento**
- **Segunda a Sexta**: 8h às 18h (GMT-3)
- **Sábado**: 9h às 12h (GMT-3)

### **Níveis de Suporte**
- **Básico**: Documentação e FAQ
- **Técnico**: Issues no GitHub
- **Premium**: Suporte direto por email
- **Enterprise**: Suporte dedicado

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🔄 Changelog

### **v1.0.0 (2024-01-XX)**
- ✨ Lançamento inicial
- 🎯 Dashboard completo
- 💬 Sistema de atendimento
- 👥 Gestão de equipe
- 📊 Relatórios avançados
- 🧪 Suite completa de testes

---

**Desenvolvido com ❤️ pela equipe StarPrint**

*Última atualização: Janeiro 2024*
