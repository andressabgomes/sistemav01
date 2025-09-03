// Configurações específicas do Xano.io
export const XANO_CONFIG = {
  // URL base da API - usar variável de ambiente ou fallback
  API_BASE_URL: import.meta.env.VITE_XANO_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:hzPTkRyB',
  
  // Chaves de armazenamento
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'xano_auth_token',
    REFRESH_TOKEN: 'xano_refresh_token',
    USER_DATA: 'xano_user',
  },
  
  // Endpoints da API
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
      REGISTER: '/auth/register',
    },
    TICKETS: '/tickets',
    CLIENTS: '/clients',
    ARTICLES: '/articles',
    TEAM_MEMBERS: '/team_members',
    SCHEDULES: '/schedules',
    GOALS: '/goals',
    NPS: '/nps',
    MONITORING: '/monitoring',
  },
  
  // Configurações de autenticação
  AUTH: {
    TOKEN_PREFIX: 'Bearer',
    REFRESH_ENDPOINT: '/auth/refresh',
    AUTO_REFRESH: true,
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutos antes da expiração
    TOKEN_EXPIRY_BUFFER: 30 * 1000, // 30 segundos de buffer
  },
  
  // Configurações de requisições
  REQUEST: {
    TIMEOUT: 15000, // 15 segundos
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 segundo
    RETRY_ON_TIMEOUT: true,
  },
  
  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },
  
  // Configurações de cache
  CACHE: {
    ENABLED: true,
    TTL: 5 * 60 * 1000, // 5 minutos
    MAX_ITEMS: 100,
  },
  
  // Configurações de logging
  LOGGING: {
    ENABLED: import.meta.env.VITE_DEBUG_MODE === 'true',
    LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
    REQUEST_LOGGING: true,
    RESPONSE_LOGGING: true,
    ERROR_LOGGING: true,
  },
} as const;

export default XANO_CONFIG;
