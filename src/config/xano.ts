// Configurações específicas do Xano.io
export const XANO_CONFIG = {
  // URL base da API
  API_BASE_URL: 'https://x8ki-letl-twmt.n7.xano.io/api:hzPTkRyB',
  
  // Chaves de armazenamento
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'starprint.token',
    REFRESH_TOKEN: 'starprint.refresh',
  },
  
  // Endpoints da API
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
    },
    TICKETS: '/tickets',
    CLIENTS: '/clients',
    ARTICLES: '/articles',
    TEAM_MEMBERS: '/team_members',
    SCHEDULES: '/schedules',
    GOALS: '/goals',
  },
  
  // Configurações de autenticação
  AUTH: {
    TOKEN_PREFIX: 'Bearer',
    REFRESH_ENDPOINT: '/auth/refresh',
    AUTO_REFRESH: true,
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutos antes da expiração
  },
  
  // Configurações de requisições
  REQUEST: {
    TIMEOUT: 10000, // 10 segundos
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 segundo
  },
  
  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  },
} as const;

export default XANO_CONFIG;
