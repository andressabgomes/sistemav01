import { useCallback, useRef, useEffect } from 'react';
import { useLogger as useBaseLogger, LogLevel, LogEntry } from '@/lib/logger';
import { useAuth } from '@/contexts/AuthContext';

// ============================================================================
// HOOK PERSONALIZADO DE LOGGING - STARPRINT CRM
// ============================================================================

export interface UseLoggerOptions {
  category: string;
  enableContext?: boolean;
  enablePerformance?: boolean;
  enableUserTracking?: boolean;
  logLevel?: LogLevel;
}

export interface LoggerMethods {
  debug: (message: string, data?: Record<string, unknown>) => void;
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
  critical: (message: string, data?: Record<string, unknown>) => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
  group: (label: string) => void;
  groupEnd: () => void;
  table: (data: unknown[]) => void;
  setContext: (context: Record<string, unknown>) => void;
  addContext: (key: string, value: unknown) => void;
  clearContext: () => void;
  logUserAction: (action: string, details?: Record<string, unknown>) => void;
  logPerformance: (operation: string, duration: number, metadata?: Record<string, unknown>) => void;
  logError: (error: Error | string, context?: Record<string, unknown>) => void;
  logSecurity: (event: string, details?: Record<string, unknown>) => void;
}

export const useLogger = (options: UseLoggerOptions): LoggerMethods => {
  const { category, enableContext = true, enablePerformance = true, enableUserTracking = true, logLevel = 'info' } = options;
  
  const baseLogger = useBaseLogger(category);
  const { user } = useAuth();
  const contextRef = useRef<Record<string, unknown>>({});
  const performanceTimersRef = useRef<Record<string, number>>({});
  const sessionIdRef = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // ============================================================================
  // INICIALIZAÇÃO E CONTEXTO
  // ============================================================================

  useEffect(() => {
    if (enableContext) {
      const baseContext: Record<string, unknown> = {
        category,
        logLevel,
        sessionId: sessionIdRef.current,
        timestamp: new Date().toISOString(),
      };

      if (user) {
        baseContext.userId = user.id;
        baseContext.userRole = user.role;
        baseContext.userEmail = user.email;
      }

      contextRef.current = baseContext;
      baseLogger.setContext(baseContext);
    }
  }, [category, logLevel, user, enableContext, baseLogger]);

  // ============================================================================
  // MÉTODOS DE LOGGING BÁSICOS
  // ============================================================================

  const debug = useCallback((message: string, data?: Record<string, unknown>) => {
    if (logLevel === 'debug') {
      baseLogger.debug(message, data);
    }
  }, [baseLogger, logLevel]);

  const info = useCallback((message: string, data?: Record<string, unknown>) => {
    if (['debug', 'info'].includes(logLevel)) {
      baseLogger.info(message, data);
    }
  }, [baseLogger, logLevel]);

  const warn = useCallback((message: string, data?: Record<string, unknown>) => {
    if (['debug', 'info', 'warn'].includes(logLevel)) {
      baseLogger.warn(message, data);
    }
  }, [baseLogger, logLevel]);

  const error = useCallback((message: string, data?: Record<string, unknown>) => {
    if (['debug', 'info', 'warn', 'error'].includes(logLevel)) {
      baseLogger.error(message, data);
    }
  }, [baseLogger, logLevel]);

  const critical = useCallback((message: string, data?: Record<string, unknown>) => {
    baseLogger.critical(message, data);
  }, [baseLogger]);

  // ============================================================================
  // MÉTODOS DE PERFORMANCE
  // ============================================================================

  const time = useCallback((label: string) => {
    if (enablePerformance) {
      performanceTimersRef.current[label] = performance.now();
      baseLogger.time(label);
    }
  }, [enablePerformance, baseLogger]);

  const timeEnd = useCallback((label: string) => {
    if (enablePerformance && performanceTimersRef.current[label]) {
      const duration = performance.now() - performanceTimersRef.current[label];
      delete performanceTimersRef.current[label];
      
      baseLogger.timeEnd(label);
      
      // Log automático de performance
      logPerformance(label, duration);
    }
  }, [enablePerformance, baseLogger]);

  const group = useCallback((label: string) => {
    baseLogger.group(label);
  }, [baseLogger]);

  const groupEnd = useCallback(() => {
    baseLogger.groupEnd();
  }, [baseLogger]);

  const table = useCallback((data: unknown[]) => {
    baseLogger.table(data);
  }, [baseLogger]);

  // ============================================================================
  // MÉTODOS DE CONTEXTO
  // ============================================================================

  const setContext = useCallback((context: Record<string, unknown>) => {
    if (enableContext) {
      contextRef.current = { ...contextRef.current, ...context };
      baseLogger.setContext(contextRef.current);
    }
  }, [enableContext, baseLogger]);

  const addContext = useCallback((key: string, value: unknown) => {
    if (enableContext) {
      contextRef.current[key] = value;
      baseLogger.addContext(key, value);
    }
  }, [enableContext, baseLogger]);

  const clearContext = useCallback(() => {
    if (enableContext) {
      contextRef.current = {};
      baseLogger.clearContext();
    }
  }, [enableContext, baseLogger]);

  // ============================================================================
  // MÉTODOS ESPECIALIZADOS
  // ============================================================================

  const logUserAction = useCallback((action: string, details?: Record<string, unknown>) => {
    if (enableUserTracking) {
      const actionData: Record<string, unknown> = {
        action,
        timestamp: new Date().toISOString(),
        sessionId: sessionIdRef.current,
        ...details,
      };

      if (user) {
        actionData.userId = user.id;
        actionData.userRole = user.role;
      }

      baseLogger.info(`User Action: ${action}`, actionData);
    }
  }, [enableUserTracking, baseLogger, user]);

  const logPerformance = useCallback((operation: string, duration: number, metadata?: Record<string, unknown>) => {
    if (enablePerformance) {
      const performanceData: Record<string, unknown> = {
        operation,
        duration,
        durationMs: Math.round(duration),
        timestamp: new Date().toISOString(),
        ...metadata,
      };

      if (duration > 1000) {
        baseLogger.warn(`Performance Warning: ${operation} took ${Math.round(duration)}ms`, performanceData);
      } else if (duration > 500) {
        baseLogger.info(`Performance Info: ${operation} took ${Math.round(duration)}ms`, performanceData);
      } else {
        baseLogger.debug(`Performance Debug: ${operation} took ${Math.round(duration)}ms`, performanceData);
      }
    }
  }, [enablePerformance, baseLogger]);

  const logError = useCallback((error: Error | string, context?: Record<string, unknown>) => {
    const errorData: Record<string, unknown> = {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      sessionId: sessionIdRef.current,
      ...context,
    };

    if (user) {
      errorData.userId = user.id;
      errorData.userRole = user.role;
    }

    baseLogger.error(`Error: ${error instanceof Error ? error.message : error}`, errorData);
  }, [baseLogger, user]);

  const logSecurity = useCallback((event: string, details?: Record<string, unknown>) => {
    const securityData: Record<string, unknown> = {
      event,
      timestamp: new Date().toISOString(),
      sessionId: sessionIdRef.current,
      ipAddress: 'N/A', // Em produção, seria obtido do contexto da requisição
      userAgent: navigator.userAgent,
      ...details,
    };

    if (user) {
      securityData.userId = user.id;
      securityData.userRole = user.role;
    }

    baseLogger.warn(`Security Event: ${event}`, securityData);
  }, [baseLogger, user]);

  // ============================================================================
  // HOOKS DE CICLO DE VIDA
  // ============================================================================

  useEffect(() => {
    // Log de inicialização
    info('Logger initialized', { category, options });

    // Log de limpeza ao desmontar
    return () => {
      info('Logger cleanup', { category });
      
      // Fazer flush de logs pendentes
      baseLogger.flush?.();
    };
  }, [category, options, info, baseLogger]);

  // ============================================================================
  // RETORNO DO HOOK
  // ============================================================================

  return {
    debug,
    info,
    warn,
    error,
    critical,
    time,
    timeEnd,
    group,
    groupEnd,
    table,
    setContext,
    addContext,
    clearContext,
    logUserAction,
    logPerformance,
    logError,
    logSecurity,
  };
};

// ============================================================================
// HOOKS ESPECIALIZADOS POR CATEGORIA
// ============================================================================

export const useAuthLogger = () => useLogger({ category: 'auth', enableUserTracking: true });
export const useAPILogger = () => useLogger({ category: 'api', enablePerformance: true });
export const usePerformanceLogger = () => useLogger({ category: 'performance', enablePerformance: true });
export const useSecurityLogger = () => useLogger({ category: 'security', enableUserTracking: true });
export const useUserActionsLogger = () => useLogger({ category: 'user-actions', enableUserTracking: true });
export const useSystemLogger = () => useLogger({ category: 'system' });
export const useDatabaseLogger = () => useLogger({ category: 'database' });
export const useNetworkLogger = () => useLogger({ category: 'network' });
export const useUILogger = () => useLogger({ category: 'ui', enablePerformance: true });
export const useErrorsLogger = () => useLogger({ category: 'errors' });

// ============================================================================
// HOOK DE LOGGING GLOBAL
// ============================================================================

export const useGlobalLogger = () => {
  const logger = useLogger({ 
    category: 'global',
    enableContext: true,
    enablePerformance: true,
    enableUserTracking: true,
    logLevel: 'info'
  });

  return {
    ...logger,
    // Métodos adicionais específicos para logging global
    logAppStart: () => logger.info('Application started'),
    logAppStop: () => logger.info('Application stopping'),
    logRouteChange: (from: string, to: string) => logger.info('Route changed', { from, to }),
    logFeatureUsage: (feature: string, details?: Record<string, unknown>) => 
      logger.info('Feature used', { feature, ...details }),
  };
};

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export default useLogger;
