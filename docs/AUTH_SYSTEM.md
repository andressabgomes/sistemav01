# Sistema de Autenticação

Este documento descreve o sistema de autenticação implementado no StarPrint CRM.

## 🏗️ Arquitetura

### Componentes Principais

1. **`apiClient.ts`** - Cliente HTTP com interceptors para autenticação
2. **`authService.ts`** - Serviço de autenticação com funções de login/logout
3. **`AuthContext.tsx`** - Contexto React para gerenciar estado de autenticação
4. **`ProtectedRoute.tsx`** - Componente para proteger rotas
5. **`LoginPage.tsx`** - Página de login

## 🔐 Funcionalidades

### Autenticação JWT
- **Access Token**: Token de acesso principal
- **Refresh Token**: Token para renovar o access token
- **Armazenamento**: LocalStorage com chaves configuráveis

### Refresh Automático
- Interceptor que detecta erros 401
- Tenta renovar o token automaticamente
- Fila de requisições durante refresh
- Fallback para login em caso de falha

### Controle de Acesso
- **Roles**: ADMIN, MANAGER, AGENT, VIEWER
- **Hierarquia**: ADMIN > MANAGER > AGENT > VIEWER
- **Proteção de Rotas**: Baseada em roles
- **Redirecionamento**: Automático para páginas apropriadas

## 🚀 Como Usar

### 1. Configuração

```env
# Variáveis de ambiente
VITE_API_BASE_URL=https://x8ki-letl-twmt.n7.xano.io/api:hzPTkRyB
VITE_TOKEN_STORAGE_KEY=starprint.token
VITE_REFRESH_STORAGE_KEY=starprint.refresh
```

### 2. Proteger Rotas

```tsx
import { ProtectedRoute } from './components/ProtectedRoute';

// Rota protegida para qualquer usuário autenticado
<ProtectedRoute>
  <TicketsPage />
</ProtectedRoute>

// Rota protegida para roles específicos
<ProtectedRoute roles={["ADMIN", "MANAGER"]}>
  <AdminPanel />
</ProtectedRoute>
```

### 3. Usar Autenticação

```tsx
import { useAuth } from './contexts/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();

// Login
const handleLogin = async () => {
  const success = await login({ email, password });
  if (success) {
    // Redirecionar ou atualizar UI
  }
};

// Logout
const handleLogout = async () => {
  await logout();
  // Usuário será redirecionado para /login
};
```

## 📊 Estrutura de Dados

### User
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  status?: "active" | "inactive" | "pending";
}
```

### AuthResponse
```typescript
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

### Role
```typescript
type Role = "ADMIN" | "MANAGER" | "AGENT" | "VIEWER";
```

## 🔄 Fluxo de Autenticação

### 1. Login
```
Usuário → LoginPage → authService.login() → Salvar tokens → getMe() → AuthContext
```

### 2. Requisições Autenticadas
```
Componente → apiClient → Interceptor adiciona token → API → Resposta
```

### 3. Token Expirado
```
API → 401 → Interceptor detecta → POST /auth/refresh → Novo token → Retry requisição
```

### 4. Refresh Falhou
```
Refresh falhou → Limpar tokens → Redirecionar para /login
```

## 🛡️ Segurança

### Tokens
- **Access Token**: Vida útil limitada (configurável)
- **Refresh Token**: Vida útil maior, mas revogável
- **Armazenamento**: LocalStorage (HTTPS em produção)

### Validação
- Verificação de roles em cada rota protegida
- Hierarquia de permissões
- Redirecionamento automático para páginas apropriadas

### Logout
- Limpeza de tokens locais
- Chamada para API de logout
- Redirecionamento para login

## 🧪 Testes

### Dados de Teste (Desenvolvimento)
```
Admin: admin@exemplo.com / senha123
Manager: manager@exemplo.com / senha123
Agent: agent@exemplo.com / senha123
```

### Cenários de Teste
1. **Login bem-sucedido**
2. **Login com credenciais inválidas**
3. **Acesso a rota protegida sem autenticação**
4. **Acesso a rota com role insuficiente**
5. **Refresh automático de token**
6. **Logout e limpeza de estado**

## 🚨 Tratamento de Erros

### Erros de Autenticação
- **401 Unauthorized**: Token inválido/expirado
- **403 Forbidden**: Role insuficiente
- **Network Error**: Falha de conexão

### Recuperação
- Refresh automático de token
- Fila de requisições durante refresh
- Fallback para login
- Limpeza de estado em caso de erro

## 📱 Responsividade

### Páginas
- **LoginPage**: Formulário responsivo
- **TicketsPage**: Tabela com scroll horizontal
- **Error Pages**: Layout centralizado

### Componentes
- **ProtectedRoute**: Renderização condicional
- **AuthContext**: Estado global acessível

## 🔧 Configuração Avançada

### Timeouts
```typescript
// apiClient.ts
timeout: 10000, // 10 segundos
```

### Retry
```typescript
// queryClient.ts
retry: 1, // Tentar apenas uma vez
```

### Refresh Interval
```typescript
// TicketsPage.tsx
refetchInterval: 15000, // 15 segundos
```

## 📚 Recursos Adicionais

### Documentação
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query)
- [Axios](https://axios-http.com/)

### Exemplos
- Ver `src/pages/` para exemplos de uso
- Ver `src/components/` para componentes reutilizáveis
- Ver `src/services/` para serviços de API

---

## 🎯 Próximos Passos

1. **Implementar persistência de estado**
2. **Adicionar refresh token rotation**
3. **Implementar logout em múltiplas abas**
4. **Adicionar auditoria de login**
5. **Implementar 2FA (opcional)**

---

**Desenvolvido com ❤️ pela equipe StarPrint**
