// ============================================================================
// SISTEMA DE LOGGING CENTRALIZADO - STARPRINT CRM
// ============================================================================

import { APP_CONFIG } from '@/constants/app';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  stack?: string;
  tags?: string[];
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  maxFileSize: number; // MB
  maxFiles: number;
  retentionDays: number;
  remoteEndpoint?: string;
  remoteApiKey?: string;
  categories: {
    [key: string]: {
      level: LogLevel;
      enabled: boolean;
    };
  };
}

export interface LoggerTransport {
  name: string;
  enabled: boolean;
  log(entry: LogEntry): Promise<void>;
  flush?(): Promise<void>;
}

// ============================================================================
// TRANSPORTES DE LOG
// ============================================================================

class ConsoleTransport implements LoggerTransport {
  name = 'console';
  enabled = true;

  async log(entry: LogEntry): Promise<void> {
    if (!this.enabled) return;

    const { level, category, message, data, timestamp } = entry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${category}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, data || '');
        break;
      case 'info':
        console.info(prefix, message, data || '');
        break;
      case 'warn':
        console.warn(prefix, message, data || '');
        break;
      case 'error':
        console.error(prefix, message, data || '');
        break;
      case 'critical':
        console.error(prefix, '🚨 CRÍTICO:', message, data || '');
        break;
    }
  }

  async flush(): Promise<void> {
    // Console não precisa de flush
  }
}

class FileTransport implements LoggerTransport {
  name = 'file';
  enabled = false;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  async log(entry: LogEntry): Promise<void> {
    if (!this.enabled) return;

    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Em produção, aqui seria implementado o salvamento em arquivo
    // Por enquanto, apenas armazenamos em memória
  }

  async flush(): Promise<void> {
    if (this.logs.length === 0) return;

    try {
      // Em produção, aqui seria implementado o salvamento em arquivo
      // Por enquanto, apenas limpamos o buffer
      this.logs = [];
    } catch (error) {
      console.error('Erro ao fazer flush dos logs:', error);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}

class RemoteTransport implements LoggerTransport {
  name = 'remote';
  enabled = false;
  private endpoint?: string;
  private apiKey?: string;
  private queue: LogEntry[] = [];
  private maxQueueSize = 100;
  private flushInterval = 5000; // 5 segundos
  private flushTimer?: NodeJS.Timeout;

  constructor(config: LoggerConfig) {
    this.endpoint = config.remoteEndpoint;
    this.apiKey = config.remoteApiKey;
    this.enabled = !!this.endpoint && !!this.apiKey;
    
    if (this.enabled) {
      this.startFlushTimer();
    }
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.enabled) return;

    this.queue.push(entry);
    
    if (this.queue.length > this.maxQueueSize) {
      this.queue = this.queue.slice(-this.maxQueueSize);
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0 || !this.endpoint || !this.apiKey) return;

    const logsToSend = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ logs: logsToSend }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      // Em caso de erro, recolocamos os logs na fila
      this.queue.unshift(...logsToSend);
      console.error('Erro ao enviar logs remotos:', error);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }
}

// ============================================================================
// LOGGER PRINCIPAL
// ============================================================================

class Logger {
  private config: LoggerConfig;
  private transports: LoggerTransport[] = [];
  private context: Record<string, unknown> = {};

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: 'info',
      enableConsole: true,
      enableFile: false,
      enableRemote: false,
      maxFileSize: 10,
      maxFiles: 5,
      retentionDays: 30,
      categories: {},
      ...config,
    };

    this.initializeTransports();
  }

  private initializeTransports(): void {
    if (this.config.enableConsole) {
      this.transports.push(new ConsoleTransport());
    }

    if (this.config.enableFile) {
      this.transports.push(new FileTransport());
    }

    if (this.config.enableRemote) {
      this.transports.push(new RemoteTransport(this.config));
    }
  }

  private shouldLog(level: LogLevel, category: string): boolean {
    const levelPriority: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      critical: 4,
    };

    const configLevel = this.config.level;
    const categoryConfig = this.config.categories[category];
    
    // Verificar nível global
    if (levelPriority[level] < levelPriority[configLevel]) {
      return false;
    }

    // Verificar configuração da categoria
    if (categoryConfig && !categoryConfig.enabled) {
      return false;
    }

    if (categoryConfig && levelPriority[level] < levelPriority[categoryConfig.level]) {
      return false;
    }

    return true;
  }

  private createLogEntry(
    level: LogLevel,
    category: string,
    message: string,
    data?: Record<string, unknown>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: { ...this.context, ...data },
      userId: this.context.userId as string,
      sessionId: this.context.sessionId as string,
      requestId: this.context.requestId as string,
      tags: this.context.tags as string[],
    };
  }

  private async writeLog(entry: LogEntry): Promise<void> {
    if (!this.shouldLog(entry.level, entry.category)) return;

    const promises = this.transports.map(transport => transport.log(entry));
    await Promise.allSettled(promises);
  }

  // ============================================================================
  // MÉTODOS PÚBLICOS DE LOGGING
  // ============================================================================

  debug(category: string, message: string, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry('debug', category, message, data);
    this.writeLog(entry);
  }

  info(category: string, message: string, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', category, message, data);
    this.writeLog(entry);
  }

  warn(category: string, message: string, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', category, message, data);
    this.writeLog(entry);
  }

  error(category: string, message: string, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry('error', category, message, data);
    this.writeLog(entry);
  }

  critical(category: string, message: string, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry('critical', category, message, data);
    this.writeLog(entry);
  }

  // ============================================================================
  // MÉTODOS DE CONTEXTO
  // ============================================================================

  setContext(context: Record<string, unknown>): void {
    this.context = { ...this.context, ...context };
  }

  addContext(key: string, value: unknown): void {
    this.context[key] = value;
  }

  clearContext(): void {
    this.context = {};
  }

  // ============================================================================
  // MÉTODOS DE UTILIDADE
  // ============================================================================

  async flush(): Promise<void> {
    const promises = this.transports.map(transport => transport.flush?.() || Promise.resolve());
    await Promise.allSettled(promises);
  }

  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...updates };
    
    // Reinicializar transportes se necessário
    if (updates.enableConsole !== undefined || updates.enableFile !== undefined || updates.enableRemote !== undefined) {
      this.transports = [];
      this.initializeTransports();
    }
  }

  // ============================================================================
  // MÉTODOS DE PERFORMANCE
  // ============================================================================

  time(category: string, label: string): void {
    console.time(`[${category}] ${label}`);
  }

  timeEnd(category: string, label: string): void {
    console.timeEnd(`[${category}] ${label}`);
  }

  // ============================================================================
  // MÉTODOS DE GRUPO
  // ============================================================================

  group(category: string, label: string): void {
    console.group(`[${category}] ${label}`);
  }

  groupEnd(): void {
    console.groupEnd();
  }

  // ============================================================================
  // MÉTODOS DE TABELA
  // ============================================================================

  table(category: string, data: unknown[]): void {
    console.table(data);
  }
}

// ============================================================================
// INSTÂNCIA GLOBAL DO LOGGER
// ============================================================================

export const logger = new Logger({
  level: APP_CONFIG.LOGGING?.LEVEL || 'info',
  enableConsole: APP_CONFIG.LOGGING?.ENABLE_CONSOLE !== false,
  enableFile: APP_CONFIG.LOGGING?.ENABLE_FILE || false,
  enableRemote: APP_CONFIG.LOGGING?.ENABLE_REMOTE || false,
  categories: APP_CONFIG.LOGGING?.CATEGORIES || {},
});

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

export const createLogger = (config?: Partial<LoggerConfig>): Logger => {
  return new Logger(config);
};

export const setGlobalLogLevel = (level: LogLevel): void => {
  logger.updateConfig({ level });
};

export const enableCategory = (category: string, level: LogLevel = 'info'): void => {
  const currentConfig = logger.getConfig();
  const updatedCategories = {
    ...currentConfig.categories,
    [category]: { level, enabled: true },
  };
  logger.updateConfig({ categories: updatedCategories });
};

export const disableCategory = (category: string): void => {
  const currentConfig = logger.getConfig();
  const updatedCategories = {
    ...currentConfig.categories,
    [category]: { level: 'debug', enabled: false },
  };
  logger.updateConfig({ categories: updatedCategories });
};

// ============================================================================
// HOOKS DE LOGGING PARA REACT
// ============================================================================

export const useLogger = (category: string) => {
  return {
    debug: (message: string, data?: Record<string, unknown>) => logger.debug(category, message, data),
    info: (message: string, data?: Record<string, unknown>) => logger.info(category, message, data),
    warn: (message: string, data?: Record<string, unknown>) => logger.warn(category, message, data),
    error: (message: string, data?: Record<string, unknown>) => logger.error(category, message, data),
    critical: (message: string, data?: Record<string, unknown>) => logger.critical(category, message, data),
    setContext: (context: Record<string, unknown>) => logger.setContext(context),
    time: (label: string) => logger.time(category, label),
    timeEnd: (label: string) => logger.timeEnd(category, label),
    group: (label: string) => logger.group(category, label),
    groupEnd: () => logger.groupEnd(),
    table: (data: unknown[]) => logger.table(category, data),
  };
};

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export {
  Logger,
  ConsoleTransport,
  FileTransport,
  RemoteTransport,
  createLogger,
  setGlobalLogLevel,
  enableCategory,
  disableCategory,
  useLogger,
};

export type {
  LogLevel,
  LogEntry,
  LoggerConfig,
  LoggerTransport,
};
