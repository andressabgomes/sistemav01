import { useCallback, useRef, useEffect, useState } from 'react';
import { APP_CONFIG } from '@/constants/app';

// ============================================================================
// HOOKS DE PERFORMANCE CONSOLIDADOS
// ============================================================================

/**
 * Hook para debounce otimizado com cleanup automático
 * @param callback - Função a ser executada com debounce
 * @param delay - Delay em milissegundos
 * @returns Função com debounce aplicado
 */
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number = APP_CONFIG.PERFORMANCE.DEBOUNCE_DELAY
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook para throttle otimizado
 * @param callback - Função a ser executada com throttle
 * @param delay - Delay em milissegundos
 * @returns Função com throttle aplicado
 */
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number = APP_CONFIG.PERFORMANCE.THROTTLE_DELAY || 300
): T => {
  const lastRun = useRef(Date.now());
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callbackRef.current(...args);
      lastRun.current = Date.now();
    }
  }, [delay]) as T;

  return throttledCallback;
};

/**
 * Hook para lazy loading com Intersection Observer
 * @param options - Opções do Intersection Observer
 * @returns Referência do elemento e status de visibilidade
 */
export const useLazyLoad = (
  options: IntersectionObserverInit = {}
) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { targetRef, isVisible };
};

/**
 * Hook para medir performance de componentes
 * @param componentName - Nome do componente para identificação
 * @returns Contador de renders e métricas de performance
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef(performance.now());
  const [renderCount, setRenderCount] = useState(0);
  const [totalRenderTime, setTotalRenderTime] = useState(0);

  useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`);
    }
    
    setRenderCount(prev => prev + 1);
    setTotalRenderTime(prev => prev + duration);
    startTime.current = performance.now();
  });

  const averageRenderTime = renderCount > 0 ? totalRenderTime / renderCount : 0;

  return { 
    renderCount, 
    averageRenderTime: averageRenderTime.toFixed(2),
    totalRenderTime: totalRenderTime.toFixed(2)
  };
};

/**
 * Hook para cache de dados com TTL e localStorage
 * @param key - Chave única para o cache
 * @param ttl - Tempo de vida em milissegundos (padrão: 5 minutos)
 * @returns Funções para gerenciar cache
 */
export const useCache = <T>(
  key: string, 
  ttl: number = 5 * 60 * 1000
) => {
  const [data, setData] = useState<T | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const setCachedData = useCallback((newData: T) => {
    const cacheItem = {
      data: newData,
      timestamp: Date.now(),
      ttl
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(cacheItem));
      setData(newData);
      setIsValid(true);
      setLastUpdated(new Date());
    } catch (error) {
      console.warn(`[Cache] Erro ao salvar no localStorage: ${error}`);
    }
  }, [key, ttl]);

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const cacheItem = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > cacheItem.ttl;

      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      setData(cacheItem.data);
      setIsValid(true);
      setLastUpdated(new Date(cacheItem.timestamp));
      return cacheItem.data;
    } catch (error) {
      console.warn(`[Cache] Erro ao ler do localStorage: ${error}`);
      localStorage.removeItem(key);
      return null;
    }
  }, [key]);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setData(null);
      setIsValid(false);
      setLastUpdated(null);
    } catch (error) {
      console.warn(`[Cache] Erro ao limpar cache: ${error}`);
    }
  }, [key]);

  const isExpired = useCallback((): boolean => {
    if (!lastUpdated) return true;
    return Date.now() - lastUpdated.getTime() > ttl;
  }, [lastUpdated, ttl]);

  // Carregar dados do cache na inicialização
  useEffect(() => {
    getCachedData();
  }, [getCachedData]);

  return {
    data,
    isValid,
    lastUpdated,
    isExpired: isExpired(),
    setCachedData,
    getCachedData,
    clearCache
  };
};

/**
 * Hook para estado otimizado com debounce
 * @param initialValue - Valor inicial
 * @param debounceMs - Delay para debounce em milissegundos
 * @returns Estado com funções de atualização
 */
export const useOptimizedState = <T>(
  initialValue: T,
  debounceMs: number = APP_CONFIG.PERFORMANCE.DEBOUNCE_DELAY
) => {
  const [value, setValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);

  const debouncedSetValue = useCallback((newValue: T | ((prev: T) => T)) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isUpdatingRef.current = true;

    timeoutRef.current = setTimeout(() => {
      setValue(newValue);
      isUpdatingRef.current = false;
    }, debounceMs);
  }, [debounceMs]);

  const setValueImmediate = useCallback((newValue: T | ((prev: T) => T)) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setValue(newValue);
    isUpdatingRef.current = false;
  }, []);

  return {
    value,
    setValue: debouncedSetValue,
    setValueImmediate,
    isUpdating: isUpdatingRef.current
  };
};

/**
 * Hook para filtros com performance otimizada
 * @param items - Array de itens a serem filtrados
 * @param filterFn - Função de filtro
 * @returns Estado do filtro e itens filtrados
 */
export const useFilterState = <T>(
  items: T[],
  filterFn: (item: T, query: string) => boolean
) => {
  const { value: query, setValue: setQuery } = useOptimizedState('');
  
  const filteredItems = query.trim() 
    ? items.filter(item => filterFn(item, query.toLowerCase()))
    : items;

  return {
    query,
    setQuery,
    filteredItems,
    hasFilter: query.trim().length > 0,
    totalItems: items.length,
    filteredCount: filteredItems.length
  };
};

// ============================================================================
// EXPORTAÇÕES PARA COMPATIBILIDADE
// ============================================================================

// Exportar hooks individuais para uso direto
export { useDebounce, useThrottle, useLazyLoad, usePerformanceMonitor, useCache, useOptimizedState, useFilterState };

// Exportar como objeto para uso em lote
export const performanceHooks = {
  useDebounce,
  useThrottle,
  useLazyLoad,
  usePerformanceMonitor,
  useCache,
  useOptimizedState,
  useFilterState
};
