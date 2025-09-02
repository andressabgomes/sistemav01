// Configurações de autenticação
export const AUTH_CONFIG = {
  // Chaves de armazenamento
  STORAGE_KEYS: {
    ACCESS_TOKEN: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'access_token',
    REFRESH_TOKEN: import.meta.env.VITE_REFRESH_STORAGE_KEY || 'refresh_token',
  },
  
  // Configurações de refresh
  REFRESH: {
    ENABLED: true,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 segundo
  },
  
  // Configurações de sessão
  SESSION: {
    AUTO_LOGOUT_ON_401: true,
    REDIRECT_TO_LOGIN_ON_401: true,
    LOGIN_REDIRECT_PATH: '/',
    LOGOUT_REDIRECT_PATH: '/login',
  },
  
  // Roles e permissões
  ROLES: {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    AGENT: 'AGENT',
    VIEWER: 'VIEWER',
  },
  
  // Hierarquia de roles (quem pode acessar o quê)
  ROLE_HIERARCHY: {
    ADMIN: ['ADMIN', 'MANAGER', 'AGENT', 'VIEWER'],
    MANAGER: ['MANAGER', 'AGENT', 'VIEWER'],
    AGENT: ['AGENT', 'VIEWER'],
    VIEWER: ['VIEWER'],
  },
} as const;

export default AUTH_CONFIG;
