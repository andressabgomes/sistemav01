# 🚨 Resolução de Problemas - Autenticação

Este guia ajuda a resolver problemas comuns de autenticação no Sistema V01.

## ❌ Problema: "Credenciais inválidas"

### 🔍 Diagnóstico Rápido

Execute o script de diagnóstico para identificar o problema:

```bash
npm run auth:debug
```

### 🎯 Soluções por Tipo de Problema

#### 1. **Usuários não existem no Supabase Auth**

**Sintomas:**
- Erro: "Invalid login credentials"
- Script de debug mostra "Usuário não existe no Supabase Auth"

**Solução:**
```bash
# Criar usuários de teste
npm run auth:create-users
```

#### 2. **Tabela users não existe ou não acessível**

**Sintomas:**
- Erro: "Usuário não encontrado no sistema"
- Script de debug mostra erro ao acessar tabela users

**Solução:**
1. Execute as migrações no Supabase:
   ```sql
   -- No SQL Editor do Supabase, execute:
   -- 1. supabase/migrations/20250103000001_initial_schema.sql
   -- 2. supabase/migrations/20250103000002_seed_data.sql
   ```

2. Ou use o Supabase CLI:
   ```bash
   supabase db push
   ```

#### 3. **Variáveis de ambiente incorretas**

**Sintomas:**
- Erro: "Missing Supabase environment variables"
- Script de debug mostra variáveis não encontradas

**Solução:**
1. Crie o arquivo `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Configure as variáveis:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_aqui
   ```

#### 4. **Projeto Supabase pausado ou inacessível**

**Sintomas:**
- Erro: "Failed to fetch" ou "Network error"
- Script de debug mostra falha na conexão

**Solução:**
1. Verifique o status do projeto no [dashboard do Supabase](https://supabase.com/dashboard)
2. Confirme se o projeto está ativo
3. Verifique se a URL está correta

### 🧪 Teste Passo a Passo

#### Passo 1: Verificar Configuração
```bash
npm run auth:debug
```

#### Passo 2: Criar Usuários (se necessário)
```bash
npm run auth:create-users
```

#### Passo 3: Testar Autenticação
```bash
npm run auth:test
```

#### Passo 4: Testar no Navegador
1. Inicie o sistema: `npm run dev`
2. Acesse: `http://localhost:5173/login`
3. Use credenciais: `admin@exemplo.com` / `senha123`
4. Verifique o console do navegador para logs

### 🔧 Verificações Manuais

#### 1. **Verificar Supabase Auth**
1. Acesse o dashboard do Supabase
2. Vá para **Authentication > Users**
3. Confirme se os usuários existem

#### 2. **Verificar Tabela Users**
1. Vá para **Table Editor**
2. Confirme se a tabela `users` existe
3. Verifique se há registros

#### 3. **Verificar Políticas RLS**
1. Vá para **Authentication > Policies**
2. Confirme se as políticas estão ativas
3. Teste as permissões

### 📊 Logs de Debug

#### Console do Navegador
Procure por mensagens como:
- `🔐 Tentando login com: admin@exemplo.com`
- `❌ Erro na autenticação Supabase: [mensagem]`
- `✅ Autenticação Supabase bem-sucedida`

#### Network Tab
1. Abra DevTools > Network
2. Tente fazer login
3. Verifique as requisições para Supabase
4. Confirme códigos de status HTTP

### 🚀 Solução Rápida (Reset Completo)

Se nada funcionar, faça um reset completo:

```bash
# 1. Parar o sistema
Ctrl+C

# 2. Verificar variáveis de ambiente
npm run auth:debug

# 3. Executar migrações no Supabase (manualmente)

# 4. Criar usuários
npm run auth:create-users

# 5. Testar autenticação
npm run auth:test

# 6. Iniciar sistema
npm run dev
```

### 📞 Suporte Adicional

Se o problema persistir:

1. **Execute o diagnóstico completo:**
   ```bash
   npm run auth:debug
   ```

2. **Verifique os logs do console do navegador**

3. **Confirme as configurações do Supabase:**
   - URL do projeto
   - Chaves de API
   - Status do projeto
   - Migrações executadas

4. **Teste com um projeto Supabase novo** para isolar o problema

---

**💡 Dica:** Sempre execute `npm run auth:debug` primeiro para identificar rapidamente o problema!
