# Migração para Xano.io

Este documento descreve o processo de migração do backend Supabase para o Xano.io no projeto StarPrint CRM.

## Visão Geral

A migração permite transferir todos os dados existentes do Supabase para o Xano.io de forma segura e controlada, mantendo a integridade dos dados e oferecendo opções de rollback.

## Pré-requisitos

### 1. Configuração do Xano.io
- Criar uma conta no [Xano.io](https://xano.io)
- Criar um novo workspace
- Configurar as tabelas necessárias (veja seção "Estrutura de Dados")
- Obter a URL da API e chave de API

### 2. Variáveis de Ambiente
Atualize seu arquivo `.env` com as seguintes variáveis:

```env
# Configurações do Xano.io
VITE_XANO_BASE_URL=https://your-workspace.xano.app
VITE_XANO_API_KEY=your_xano_api_key_here

# Manter configurações do Supabase para migração
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Estrutura de Dados

### Tabelas Necessárias no Xano

#### 1. Clientes (`clients`)
```sql
- id (UUID, Primary Key)
- name (String, Required)
- email (String, Required, Unique)
- phone (String, Optional)
- company (String, Optional)
- status (Enum: 'active', 'inactive', 'pending')
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### 2. Tickets (`tickets`)
```sql
- id (UUID, Primary Key)
- title (String, Required)
- description (Text, Required)
- status (Enum: 'open', 'in_progress', 'resolved', 'closed')
- priority (Enum: 'low', 'medium', 'high', 'urgent')
- client_id (UUID, Foreign Key to clients.id)
- assigned_to (UUID, Optional, Foreign Key to team_members.id)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### 3. Artigos (`articles`)
```sql
- id (UUID, Primary Key)
- title (String, Required)
- content (Text, Required)
- category (String, Required)
- tags (Array of Strings)
- author_id (UUID, Foreign Key to team_members.id)
- status (Enum: 'draft', 'published', 'archived')
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### 4. Equipe (`team_members`)
```sql
- id (UUID, Primary Key)
- name (String, Required)
- email (String, Required, Unique)
- role (String, Required)
- department (String, Required)
- status (Enum: 'active', 'inactive')
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### 5. Escalas (`schedules`)
```sql
- id (UUID, Primary Key)
- team_member_id (UUID, Foreign Key to team_members.id)
- date (Date, Required)
- start_time (Time, Required)
- end_time (Time, Required)
- type (Enum: 'work', 'on_call', 'break')
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### 6. Metas (`goals`)
```sql
- id (UUID, Primary Key)
- title (String, Required)
- description (Text, Required)
- target_value (Number, Required)
- current_value (Number, Default: 0)
- unit (String, Required)
- deadline (Date, Required)
- status (Enum: 'active', 'completed', 'overdue')
- created_at (Timestamp)
- updated_at (Timestamp)
```

## Processo de Migração

### 1. Preparação
- Faça backup completo dos dados do Supabase
- Verifique se todas as tabelas estão criadas no Xano
- Teste a conectividade com o Xano

### 2. Execução
1. Acesse o componente `MigrationManager` na interface
2. Verifique o status do backend atual
3. Clique em "Iniciar Migração"
4. Monitore o progresso da migração
5. Verifique se não há erros

### 3. Verificação
- Confirme que todos os dados foram transferidos
- Teste as funcionalidades principais
- Verifique a integridade dos relacionamentos

### 4. Finalização
- Altere o backend ativo para "Xano"
- Execute testes completos
- Remova dados do Supabase (opcional)

## Modos de Operação

### 1. Modo Supabase
- Usa apenas o Supabase como backend
- Ideal para desenvolvimento e testes

### 2. Modo Xano
- Usa apenas o Xano.io como backend
- Configuração de produção recomendada

### 3. Modo Híbrido
- Usa ambos os backends simultaneamente
- Útil para transição gradual

## Tratamento de Erros

### Erros Comuns
1. **Falha de Conexão**: Verifique as credenciais do Xano
2. **Timeout**: Aumente o timeout nas configurações
3. **Validação**: Verifique se os dados estão no formato correto
4. **Relacionamentos**: Confirme se as chaves estrangeiras estão corretas

### Recuperação
- Use a função de reset para limpar o status
- Verifique os logs de erro
- Execute a migração novamente

## Segurança

### Autenticação
- Tokens JWT para autenticação
- Refresh automático de tokens
- Logout automático em caso de erro 401

### Dados Sensíveis
- Criptografia em trânsito (HTTPS)
- Validação de entrada
- Sanitização de dados

## Performance

### Otimizações
- Migração em lotes
- Timeout configurável
- Retry automático em falhas
- Cache de dados

### Monitoramento
- Logs detalhados
- Métricas de progresso
- Alertas de erro

## Rollback

### Estratégias
1. **Backup Automático**: Dados originais preservados
2. **Migração Reversa**: Script para voltar ao Supabase
3. **Modo Híbrido**: Manter ambos os backends ativos

### Procedimento
1. Pare a aplicação
2. Restaure o backup do Supabase
3. Altere o backend para "Supabase"
4. Reinicie a aplicação

## Manutenção

### Atualizações
- Verificar compatibilidade de versões
- Testar em ambiente de desenvolvimento
- Documentar mudanças

### Backup
- Backup automático antes da migração
- Backup manual periódico
- Teste de restauração

## Suporte

### Recursos
- Documentação da API do Xano
- Comunidade do Xano
- Suporte técnico

### Contatos
- Equipe de desenvolvimento
- Administrador do sistema
- Suporte do Xano

## Conclusão

A migração para o Xano.io oferece uma solução robusta e escalável para o StarPrint CRM. Siga este guia cuidadosamente para garantir uma transição suave e sem perda de dados.

Para dúvidas ou problemas, consulte a documentação oficial ou entre em contato com a equipe de desenvolvimento.
