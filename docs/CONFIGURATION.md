# ⚙️ Configuração do Sistema V01

Este guia explica como configurar o sistema de autenticação e as variáveis de ambiente necessárias.

## 🔧 Configuração Inicial

### 1. Criar Arquivo de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```bash
# ============================================================================
# CONFIGURAÇÕES DO SUPABASE
# ============================================================================
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# Chave de serviço do Supabase (apenas para scripts administrativos)
# ⚠️ NUNCA exponha esta chave no frontend!
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_aqui

# ============================================================================
# CONFIGURAÇÕES DE DESENVOLVIMENTO
# ============================================================================
NODE_ENV=development
VITE_DEBUG_MODE=true

# ============================================================================
# CONFIGURAÇÕES DE SEGURANÇA
# ============================================================================
VITE_SESSION_TIMEOUT=1800000
VITE_MAX_LOGIN_ATTEMPTS=5
```

### 2. Obter Credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto ou use um existente
3. Vá para **Settings > API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Executar Migrações

```bash
# Se usando Supabase CLI
supabase db push

# Ou execute manualmente no dashboard do Supabase:
# 1. Vá para SQL Editor
# 2. Execute o conteúdo de supabase/migrations/20250103000001_initial_schema.sql
# 3. Execute o conteúdo de supabase/migrations/20250103000002_seed_data.sql
```

### 4. Criar Usuários de Teste

```bash
npm run auth:create-users
```

### 5. Testar Autenticação

```bash
npm run auth:test
```

## 🚀 Iniciar o Sistema

```bash
# Instalar dependências
npm install

# Iniciar em modo de desenvolvimento
npm run dev

# Construir para produção
npm run build
```

## 🔍 Verificar Configuração

### Teste de Conexão

O sistema deve:
1. ✅ Conectar ao Supabase sem erros
2. ✅ Mostrar a tela de login
3. ✅ Permitir login com usuários de teste
4. ✅ Redirecionar para o dashboard após login
5. ✅ Proteger rotas baseado em roles

### Logs de Debug

Se houver problemas, verifique:
- Console do navegador
- Network tab (requisições para Supabase)
- Logs do terminal onde o app está rodando

## 🛠️ Troubleshooting

### Erro: "Missing Supabase environment variables"

**Solução:** Verifique se o arquivo `.env.local` existe e tem as variáveis corretas.

### Erro: "Failed to fetch"

**Solução:** Verifique se a URL do Supabase está correta e acessível.

### Erro: "Invalid API key"

**Solução:** Verifique se a chave anônima está correta.

### Usuários não conseguem fazer login

**Solução:** Execute `npm run auth:create-users` para recriar os usuários.

## 📱 Acesso ao Sistema

### URLs Principais

- **Login:** `/login`
- **Dashboard:** `/`
- **Admin:** `/admin` (apenas ADMIN)
- **Manager:** `/manager` (ADMIN + MANAGER)

### Usuários de Teste

| Email | Senha | Role | Acesso |
|-------|-------|------|--------|
| admin@exemplo.com | senha123 | ADMIN | Completo |
| manager@exemplo.com | senha123 | MANAGER | Gerencial |
| agent@exemplo.com | senha123 | AGENT | Atendimento |
| user@exemplo.com | senha123 | USER | Básico |
| support@exemplo.com | senha123 | SUPPORT | Suporte |

## 🔒 Segurança

### Configurações Recomendadas

```bash
# Timeout de sessão (30 minutos)
VITE_SESSION_TIMEOUT=1800000

# Máximo de tentativas de login
VITE_MAX_LOGIN_ATTEMPTS=5

# Habilitar logs de debug em desenvolvimento
VITE_DEBUG_MODE=true
```

### Boas Práticas

1. ✅ Nunca commite o arquivo `.env.local`
2. ✅ Use HTTPS em produção
3. ✅ Configure Row Level Security no Supabase
4. ✅ Monitore logs de autenticação
5. ✅ Implemente rate limiting se necessário

---

**Próximos passos:** Após a configuração, consulte `AUTH_SETUP.md` para detalhes sobre o sistema de autenticação.
