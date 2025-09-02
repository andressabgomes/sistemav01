# 🔌 Documentação da API - StarPrint CRM

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints](#endpoints)
4. [Modelos de Dados](#modelos-de-dados)
5. [Códigos de Status](#códigos-de-status)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Rate Limiting](#rate-limiting)
8. [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 Visão Geral

A API do StarPrint CRM é baseada em REST e utiliza o Supabase como backend. Todos os endpoints retornam respostas em JSON e utilizam autenticação JWT.

### **Base URL**
```
https://[seu-projeto].supabase.co/rest/v1/
```

### **Headers Padrão**
```http
Content-Type: application/json
Authorization: Bearer [seu-token-jwt]
apikey: [sua-chave-api]
```

---

## 🔐 Autenticação

### **Fluxo de Autenticação**

#### **1. Login**
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "bearer",
  "user": {
    "id": "uuid-do-usuario",
    "email": "usuario@exemplo.com",
    "role": "admin"
  }
}
```

#### **2. Renovação de Token**
```http
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json

{
  "refresh_token": "seu-refresh-token"
}
```

#### **3. Logout**
```http
POST /auth/v1/logout
Authorization: Bearer [seu-token-jwt]
```

### **Roles e Permissões**

| Role | Permissões |
|------|------------|
| **admin** | Acesso completo a todas as funcionalidades |
| **manager** | Gestão de equipe, relatórios e clientes |
| **user** | Atendimento básico e visualização de relatórios |

---

## 🔗 Endpoints

### **Usuários**

#### **Obter Perfil do Usuário**
```http
GET /users?select=*&id=eq.[user-id]
```

#### **Atualizar Perfil**
```http
PATCH /users?id=eq.[user-id]
Content-Type: application/json

{
  "name": "Novo Nome",
  "phone": "(11) 99999-9999"
}
```

### **Clientes**

#### **Listar Clientes**
```http
GET /clients?select=*,client_addresses(*),client_contacts(*)
```

**Parâmetros de Query:**
- `select`: Campos a retornar
- `order`: Ordenação (ex: `created_at.desc`)
- `limit`: Limite de resultados
- `offset`: Offset para paginação

#### **Obter Cliente Específico**
```http
GET /clients?select=*&id=eq.[client-id]
```

#### **Criar Cliente**
```http
POST /clients
Content-Type: application/json

{
  "name": "Nome da Empresa",
  "document_number": "12.345.678/0001-90",
  "email": "contato@empresa.com",
  "phone": "(11) 3333-3333",
  "status": "active"
}
```

#### **Atualizar Cliente**
```http
PATCH /clients?id=eq.[client-id]
Content-Type: application/json

{
  "status": "inactive",
  "notes": "Cliente inativo por 6 meses"
}
```

#### **Deletar Cliente**
```http
DELETE /clients?id=eq.[client-id]
```

### **Endereços de Clientes**

#### **Listar Endereços**
```http
GET /client_addresses?select=*&client_id=eq.[client-id]
```

#### **Adicionar Endereço**
```http
POST /client_addresses
Content-Type: application/json

{
  "client_id": "uuid-do-cliente",
  "address_type": "main",
  "street": "Rua das Flores",
  "number": "123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567",
  "is_primary": true
}
```

### **Contatos de Clientes**

#### **Listar Contatos**
```http
GET /client_contacts?select=*&client_id=eq.[client-id]
```

#### **Adicionar Contato**
```http
POST /client_contacts
Content-Type: application/json

{
  "client_id": "uuid-do-cliente",
  "name": "João Silva",
  "position": "Gerente",
  "email": "joao@empresa.com",
  "phone": "(11) 99999-9999",
  "is_primary": true
}
```

### **Tickets de Atendimento**

#### **Listar Tickets**
```http
GET /tickets?select=*,clients(name),users(name)
```

**Filtros Disponíveis:**
- `status`: `open`, `in_progress`, `resolved`, `closed`
- `priority`: `low`, `medium`, `high`, `urgent`
- `client_id`: ID do cliente
- `assigned_to`: ID do usuário responsável

#### **Criar Ticket**
```http
POST /tickets
Content-Type: application/json

{
  "client_id": "uuid-do-cliente",
  "subject": "Problema com impressão",
  "description": "A impressora não está funcionando corretamente",
  "priority": "high",
  "category": "technical",
  "assigned_to": "uuid-do-usuario"
}
```

#### **Atualizar Ticket**
```http
PATCH /tickets?id=eq.[ticket-id]
Content-Type: application/json

{
  "status": "in_progress",
  "assigned_to": "novo-uuid-usuario"
}
```

#### **Adicionar Mensagem ao Ticket**
```http
POST /ticket_messages
Content-Type: application/json

{
  "ticket_id": "uuid-do-ticket",
  "user_id": "uuid-do-usuario",
  "message": "Estou analisando o problema",
  "is_internal": false
}
```

### **Base de Conhecimento**

#### **Listar Artigos**
```http
GET /knowledge_base?select=*&category=eq.[categoria]
```

#### **Buscar Artigos**
```http
GET /knowledge_base?select=*&or=(title.ilike.*[termo]*,content.ilike.*[termo]*)
```

#### **Criar Artigo**
```http
POST /knowledge_base
Content-Type: application/json

{
  "title": "Como resolver problemas de impressão",
  "content": "Conteúdo do artigo...",
  "category": "technical",
  "tags": ["impressão", "problemas", "solução"],
  "author_id": "uuid-do-usuario"
}
```

### **Equipe**

#### **Listar Membros**
```http
GET /team_members?select=*,users(name,email)
```

#### **Obter Performance**
```http
GET /team_performance?select=*&member_id=eq.[member-id]
```

#### **Definir Metas**
```http
POST /team_goals
Content-Type: application/json

{
  "member_id": "uuid-do-membro",
  "goal_type": "tickets_resolved",
  "target_value": 50,
  "period": "monthly",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

### **Relatórios**

#### **Relatório de Atendimento**
```http
GET /analytics/attendance?start_date=2024-01-01&end_date=2024-01-31
```

#### **Relatório de Clientes**
```http
GET /analytics/clients?status=active&created_after=2024-01-01
```

#### **Relatório de Performance**
```http
GET /analytics/performance?team_id=[team-id]&period=monthly
```

---

## 📊 Modelos de Dados

### **Cliente**
```typescript
interface Client {
  id: string;
  name: string;
  document_number: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

### **Ticket**
```typescript
interface Ticket {
  id: string;
  client_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}
```

### **Usuário**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### **Mensagem de Ticket**
```typescript
interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}
```

---

## 📋 Códigos de Status

### **Sucesso**
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição bem-sucedida sem conteúdo

### **Erro do Cliente**
- `400 Bad Request` - Requisição inválida
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Não autorizado
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito de dados
- `422 Unprocessable Entity` - Dados inválidos

### **Erro do Servidor**
- `500 Internal Server Error` - Erro interno
- `502 Bad Gateway` - Erro de gateway
- `503 Service Unavailable` - Serviço indisponível

---

## ⚠️ Tratamento de Erros

### **Formato de Erro**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição do erro",
    "details": {
      "field": "campo_específico",
      "value": "valor_inválido"
    }
  }
}
```

### **Códigos de Erro Comuns**

| Código | Descrição | Solução |
|--------|-----------|---------|
| `AUTH_REQUIRED` | Autenticação necessária | Faça login e inclua o token |
| `INVALID_TOKEN` | Token inválido ou expirado | Renove o token |
| `INSUFFICIENT_PERMISSIONS` | Permissões insuficientes | Verifique seu role |
| `VALIDATION_ERROR` | Dados inválidos | Verifique o formato dos dados |
| `RESOURCE_NOT_FOUND` | Recurso não encontrado | Verifique o ID fornecido |
| `DUPLICATE_ENTRY` | Entrada duplicada | Use dados únicos |

### **Exemplo de Tratamento de Erro**
```typescript
try {
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(clientData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  const client = await response.json();
  return client;
} catch (error) {
  console.error('Erro ao criar cliente:', error.message);
  throw error;
}
```

---

## 🚦 Rate Limiting

### **Limites por Endpoint**

| Endpoint | Limite | Período |
|----------|--------|---------|
| **GET** | 1000 | Por minuto |
| **POST** | 100 | Por minuto |
| **PATCH** | 100 | Por minuto |
| **DELETE** | 50 | Por minuto |

### **Headers de Rate Limiting**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### **Tratamento de Rate Limiting**
```typescript
if (response.status === 429) {
  const resetTime = response.headers.get('X-RateLimit-Reset');
  const waitTime = Math.max(0, resetTime - Date.now());
  
  console.log(`Rate limit excedido. Aguarde ${waitTime}ms`);
  await new Promise(resolve => setTimeout(resolve, waitTime));
}
```

---

## 💡 Exemplos de Uso

### **JavaScript/TypeScript**

#### **Cliente Completo**
```typescript
class StarPrintAPI {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string, token: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  // Clientes
  async getClients() {
    return this.request('/clients?select=*');
  }

  async createClient(clientData: Partial<Client>) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(id: string, updates: Partial<Client>) {
    return this.request(`/clients?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Tickets
  async getTickets(filters?: TicketFilters) {
    let endpoint = '/tickets?select=*,clients(name)';
    
    if (filters?.status) {
      endpoint += `&status=eq.${filters.status}`;
    }
    
    if (filters?.priority) {
      endpoint += `&priority=eq.${filters.priority}`;
    }

    return this.request(endpoint);
  }

  async createTicket(ticketData: Partial<Ticket>) {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }
}

// Uso
const api = new StarPrintAPI('https://api.starprint.com', 'seu-token');

// Listar clientes
const clients = await api.getClients();

// Criar cliente
const newClient = await api.createClient({
  name: 'Nova Empresa',
  email: 'contato@novaempresa.com',
  status: 'active'
});

// Listar tickets abertos
const openTickets = await api.getTickets({ status: 'open' });
```

#### **React Hook**
```typescript
import { useState, useEffect } from 'react';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        const response = await api.getClients();
        setClients(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  return { clients, loading, error };
}
```

### **cURL**

#### **Autenticação**
```bash
# Login
curl -X POST "https://api.starprint.com/auth/v1/token?grant_type=password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'

# Usar token
export TOKEN="seu-token-aqui"
```

#### **Clientes**
```bash
# Listar clientes
curl -X GET "https://api.starprint.com/rest/v1/clients?select=*" \
  -H "Authorization: Bearer $TOKEN" \
  -H "apikey: sua-chave-api"

# Criar cliente
curl -X POST "https://api.starprint.com/rest/v1/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Empresa Teste",
    "email": "teste@empresa.com",
    "status": "active"
  }'
```

#### **Tickets**
```bash
# Listar tickets abertos
curl -X GET "https://api.starprint.com/rest/v1/tickets?select=*&status=eq.open" \
  -H "Authorization: Bearer $TOKEN"

# Criar ticket
curl -X POST "https://api.starprint.com/rest/v1/tickets" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "uuid-do-cliente",
    "subject": "Problema técnico",
    "description": "Descrição do problema",
    "priority": "high"
  }'
```

---

## 🔧 Configuração Avançada

### **Variáveis de Ambiente**
```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# API
API_RATE_LIMIT=1000
API_TIMEOUT=30000
API_MAX_RETRIES=3
```

### **Configuração de Retry**
```typescript
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
};

async function requestWithRetry(endpoint: string, options: RequestInit) {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await request(endpoint, options);
    } catch (error) {
      lastError = error;
      
      if (attempt === retryConfig.maxRetries) {
        throw lastError;
      }
      
      const delay = retryConfig.retryDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

---

## 📚 Recursos Adicionais

### **Documentação Oficial**
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [REST API Guidelines](https://restfulapi.net/)

### **Ferramentas de Teste**
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [cURL](https://curl.se/)

### **Bibliotecas Recomendadas**
- **JavaScript/TypeScript**: `axios`, `fetch`
- **Python**: `requests`, `httpx`
- **PHP**: `Guzzle`, `cURL`
- **Java**: `OkHttp`, `Apache HttpClient`

---

**Última atualização: Janeiro 2024**
