# Configuração do Xano.io

Este guia explica como configurar o Xano.io como backend para o StarPrint CRM.

## 🚀 Primeiros Passos

### 1. Criar Conta no Xano
1. Acesse [xano.io](https://xano.io)
2. Clique em "Get Started Free"
3. Crie uma conta ou faça login
4. Crie um novo workspace

### 2. Configurar o Workspace
1. **Nome do Workspace**: `starpint-crm`
2. **Região**: Escolha a mais próxima (ex: US East)
3. **Plano**: Free tier para começar

## 🗄️ Estrutura do Banco de Dados

### Tabela: `clients`
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_company ON clients(company);
```

### Tabela: `tickets`
```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  assigned_to UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tickets_client_id ON tickets(client_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
```

### Tabela: `articles`
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
```

### Tabela: `team_members`
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_team_members_email ON team_members(email);
CREATE INDEX idx_team_members_role ON team_members(role);
CREATE INDEX idx_team_members_department ON team_members(department);
CREATE INDEX idx_team_members_status ON team_members(status);
```

### Tabela: `schedules`
```sql
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  type VARCHAR(20) DEFAULT 'work' CHECK (type IN ('work', 'on_call', 'break')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_schedules_team_member_id ON schedules(team_member_id);
CREATE INDEX idx_schedules_date ON schedules(date);
CREATE INDEX idx_schedules_type ON schedules(type);
```

### Tabela: `goals`
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  deadline DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_goals_deadline ON goals(deadline);
CREATE INDEX idx_goals_status ON goals(status);
```

## 🔐 Configuração de Autenticação

### 1. Habilitar Autenticação
1. No painel do Xano, vá para **API > Auth**
2. Clique em **"Enable Auth"**
3. Configure os campos:
   - **Email**: Habilitado
   - **Password**: Habilitado
   - **Confirm Password**: Habilitado

### 2. Configurar Endpoints de Auth
```javascript
// POST /auth/signup
{
  "email": "string",
  "password": "string",
  "confirm_password": "string"
}

// POST /auth/login
{
  "email": "string",
  "password": "string"
}

// POST /auth/logout
// Requer token de autenticação

// GET /auth/me
// Retorna usuário atual
```

## 🌐 Configuração da API

### 1. Endpoints Principais

#### Clientes
```javascript
// GET /clients - Listar clientes
// POST /clients - Criar cliente
// GET /clients/:id - Obter cliente
// PUT /clients/:id - Atualizar cliente
// DELETE /clients/:id - Excluir cliente
```

#### Tickets
```javascript
// GET /tickets - Listar tickets
// POST /tickets - Criar ticket
// GET /tickets/:id - Obter ticket
// PUT /tickets/:id - Atualizar ticket
// DELETE /tickets/:id - Excluir ticket
```

#### Artigos
```javascript
// GET /articles - Listar artigos
// POST /articles - Criar artigo
// GET /articles/:id - Obter artigo
// PUT /articles/:id - Atualizar artigo
// DELETE /articles/:id - Excluir artigo
```

### 2. Configurar CORS
1. Vá para **API > Settings**
2. Em **CORS**, adicione:
   - `http://localhost:8080` (desenvolvimento)
   - `https://seu-dominio.com` (produção)

### 3. Configurar Rate Limiting
1. Em **API > Settings > Rate Limiting**
2. Configure limites apropriados:
   - **Requests per minute**: 100
   - **Requests per hour**: 1000

## 🔑 Obter Credenciais

### 1. API Key
1. Vá para **API > Settings**
2. Em **API Keys**, clique em **"Generate New Key"**
3. Copie a chave gerada

### 2. URL da API
1. No painel principal, copie a URL do workspace
2. Formato: `https://your-workspace.xano.app`

## 📝 Variáveis de Ambiente

Atualize seu arquivo `.env`:

```env
# Configurações do Xano.io
VITE_XANO_BASE_URL=https://your-workspace.xano.app
VITE_XANO_API_KEY=your_api_key_here

# Manter Supabase para migração
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 🧪 Testar Configuração

### 1. Script de Teste
Execute o script de teste incluído:

```bash
node scripts/test-xano-connection.js
```

### 2. Teste Manual
```bash
# Testar conectividade
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://your-workspace.xano.app/clients

# Testar criação
curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -d '{"name":"Teste","email":"teste@exemplo.com"}' \
     https://your-workspace.xano.app/clients
```

## 🚨 Troubleshooting

### Erro 404 - Tabela não encontrada
- Verifique se a tabela foi criada corretamente
- Confirme o nome da tabela no endpoint

### Erro 401 - Não autorizado
- Verifique se a API key está correta
- Confirme se a autenticação está habilitada

### Erro 500 - Erro interno
- Verifique os logs do Xano
- Confirme se a estrutura da tabela está correta

### Timeout
- Aumente o timeout no cliente
- Verifique a conectividade de rede

## 📚 Recursos Adicionais

- [Documentação Oficial do Xano](https://docs.xano.com/)
- [Comunidade do Xano](https://community.xano.com/)
- [Exemplos de API](https://docs.xano.com/api-examples)
- [Guia de Migração](MIGRATION.md)

## 🎯 Próximos Passos

1. ✅ Configurar tabelas no Xano
2. ✅ Configurar autenticação
3. ✅ Obter credenciais da API
4. ✅ Testar conectividade
5. ✅ Executar migração de dados
6. ✅ Configurar produção

---

**Nota**: Este guia assume que você está usando o plano gratuito do Xano. Para recursos avançados, considere fazer upgrade para um plano pago.
