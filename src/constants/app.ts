// ============================================================================
// CONFIGURAÇÕES CENTRALIZADAS - STARPRINT CRM
// ============================================================================

export const APP_CONFIG = {
  // ============================================================================
  // CONFIGURAÇÕES GERAIS
  // ============================================================================
  APP_NAME: 'StarPrint CRM',
  VERSION: '1.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'development',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  
  // ============================================================================
  // CONFIGURAÇÕES DE API
  // ============================================================================
  API: {
    BASE_URL: import.meta.env.VITE_XANO_BASE_URL || 'https://your-workspace.xano.app',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    CACHE_TTL: 5 * 60 * 1000, // 5 minutos
  },

  // ============================================================================
  // CONFIGURAÇÕES DE PERFORMANCE
  // ============================================================================
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100,
    LAZY_LOAD_THRESHOLD: 0.1,
    CACHE_TTL: 10 * 60 * 1000, // 10 minutos
    MAX_CACHE_SIZE: 100,
    PERFORMANCE_MONITORING: true,
  },

  // ============================================================================
  // CONFIGURAÇÕES DE LOGGING
  // ============================================================================
  LOGGING: {
    LEVEL: (import.meta.env.VITE_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error' | 'critical') || 'info',
    ENABLE_CONSOLE: import.meta.env.VITE_LOG_ENABLE_CONSOLE !== 'false',
    ENABLE_FILE: import.meta.env.VITE_LOG_ENABLE_FILE === 'true',
    ENABLE_REMOTE: import.meta.env.VITE_LOG_ENABLE_REMOTE === 'true',
    REMOTE_ENDPOINT: import.meta.env.VITE_LOG_REMOTE_ENDPOINT,
    REMOTE_API_KEY: import.meta.env.VITE_LOG_REMOTE_API_KEY,
    MAX_FILE_SIZE: 10, // MB
    MAX_FILES: 5,
    RETENTION_DAYS: 30,
    CATEGORIES: {
      'auth': { level: 'info', enabled: true },
      'api': { level: 'info', enabled: true },
      'performance': { level: 'warn', enabled: true },
      'security': { level: 'warn', enabled: true },
      'user-actions': { level: 'info', enabled: true },
      'system': { level: 'info', enabled: true },
      'database': { level: 'warn', enabled: true },
      'network': { level: 'warn', enabled: true },
      'ui': { level: 'debug', enabled: true },
      'errors': { level: 'error', enabled: true },
    },
  },

  // ============================================================================
  // CONFIGURAÇÕES DE SEGURANÇA
  // ============================================================================
  SECURITY: {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 dias
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
    PASSWORD_MIN_LENGTH: 8,
    REQUIRE_2FA: false,
    ALLOWED_ORIGINS: ['http://localhost:3000', 'http://localhost:8080'],
  },

  // ============================================================================
  // CONFIGURAÇÕES DE UI/UX
  // ============================================================================
  UI: {
    THEME: 'light',
    LANGUAGE: 'pt-BR',
    TIMEZONE: 'America/Sao_Paulo',
    DATE_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:mm',
    CURRENCY: 'BRL',
    DECIMAL_PLACES: 2,
    ANIMATIONS_ENABLED: true,
    SOUND_ENABLED: false,
    NOTIFICATIONS_ENABLED: true,
    AUTO_SAVE_INTERVAL: 30 * 1000, // 30 segundos
  },

  // ============================================================================
  // CONFIGURAÇÕES DE NOTIFICAÇÕES
  // ============================================================================
  NOTIFICATIONS: {
    ENABLE_PUSH: true,
    ENABLE_EMAIL: false,
    ENABLE_SMS: false,
    AUTO_DISMISS_DELAY: 5000, // 5 segundos
    MAX_VISIBLE: 5,
    POSITION: 'top-right',
    SOUND_ENABLED: false,
  },

  // ============================================================================
  // CONFIGURAÇÕES DE CACHE
  // ============================================================================
  CACHE: {
    ENABLED: true,
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
    MAX_SIZE: 100,
    CLEANUP_INTERVAL: 60 * 1000, // 1 minuto
    PERSISTENCE: 'localStorage',
  },

  // ============================================================================
  // CONFIGURAÇÕES DE MONITORAMENTO
  // ============================================================================
  MONITORING: {
    ENABLED: true,
    PERFORMANCE_TRACKING: true,
    ERROR_TRACKING: true,
    USER_BEHAVIOR_TRACKING: false,
    METRICS_COLLECTION: true,
    REPORTING_INTERVAL: 60 * 1000, // 1 minuto
  },

  // ============================================================================
  // CONFIGURAÇÕES DE TESTES
  // ============================================================================
  TESTING: {
    ENABLE_MOCKS: true,
    ENABLE_MSW: true,
    COVERAGE_THRESHOLD: 70,
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },

  // ============================================================================
  // CONFIGURAÇÕES DE DESENVOLVIMENTO
  // ============================================================================
  DEVELOPMENT: {
    HOT_RELOAD: true,
    SOURCE_MAPS: true,
    DEBUG_TOOLS: true,
    PERFORMANCE_PROFILING: false,
    LOG_LEVEL: 'debug',
  },

  // ============================================================================
  // CONFIGURAÇÕES DE PRODUÇÃO
  // ============================================================================
  PRODUCTION: {
    MINIFY: true,
    COMPRESS: true,
    SOURCE_MAPS: false,
    DEBUG_TOOLS: false,
    PERFORMANCE_PROFILING: false,
    LOG_LEVEL: 'warn',
  },
} as const;

// ============================================================================
// TIPOS DE CONFIGURAÇÃO
// ============================================================================

export type AppConfig = typeof APP_CONFIG;
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
export type Environment = 'development' | 'staging' | 'production';
export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'pt-BR' | 'en-US' | 'es-ES';
export type Currency = 'BRL' | 'USD' | 'EUR';
export type NotificationPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

// ============================================================================
// FUNÇÕES UTILITÁRIAS DE CONFIGURAÇÃO
// ============================================================================

export const isDevelopment = (): boolean => APP_CONFIG.ENVIRONMENT === 'development';
export const isProduction = (): boolean => APP_CONFIG.ENVIRONMENT === 'production';
export const isStaging = (): boolean => APP_CONFIG.ENVIRONMENT === 'staging';

export const getConfigValue = <K extends keyof AppConfig>(key: K): AppConfig[K] => {
  return APP_CONFIG[key];
};

export const getNestedConfigValue = <K extends keyof AppConfig, N extends keyof AppConfig[K]>(
  key: K,
  nestedKey: N
): AppConfig[K][N] => {
  return APP_CONFIG[key][nestedKey];
};

export const updateConfig = <K extends keyof AppConfig>(
  key: K,
  value: AppConfig[K]
): void => {
  (APP_CONFIG as any)[key] = value;
};

export const getEnvironmentVariable = (key: string, defaultValue?: string): string => {
  return import.meta.env[key] || defaultValue || '';
};

export const validateConfig = (): boolean => {
  try {
    // Validar configurações obrigatórias
    if (!APP_CONFIG.API.BASE_URL) {
      console.error('API_BASE_URL é obrigatório');
      return false;
    }

    if (!APP_CONFIG.APP_NAME) {
      console.error('APP_NAME é obrigatório');
      return false;
    }

    // Validar configurações de logging
    if (APP_CONFIG.LOGGING.ENABLE_REMOTE && !APP_CONFIG.LOGGING.REMOTE_ENDPOINT) {
      console.error('REMOTE_ENDPOINT é obrigatório quando ENABLE_REMOTE é true');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao validar configurações:', error);
    return false;
  }
};

// ============================================================================
// CONFIGURAÇÕES DINÂMICAS BASEADAS NO AMBIENTE
// ============================================================================

export const getDynamicConfig = () => {
  const baseConfig = { ...APP_CONFIG };

  if (isDevelopment()) {
    baseConfig.LOGGING.LEVEL = 'debug';
    baseConfig.DEVELOPMENT.DEBUG_TOOLS = true;
    baseConfig.PERFORMANCE.PERFORMANCE_MONITORING = true;
  }

  if (isProduction()) {
    baseConfig.LOGGING.LEVEL = 'warn';
    baseConfig.DEVELOPMENT.DEBUG_TOOLS = false;
    baseConfig.PERFORMANCE.PERFORMANCE_MONITORING = false;
    baseConfig.MONITORING.USER_BEHAVIOR_TRACKING = false;
  }

  return baseConfig;
};

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export default APP_CONFIG;