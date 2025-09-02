import { useCallback, useRef, useEffect, useState } from 'react';

/**
 * Hook para debounce otimizado com cleanup automático
 */
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
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
 */
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
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
 */
export const useLazyLoad = (
  options: IntersectionObserverInit = {}
) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observerRef.current.observe(targetRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options]);

  return { targetRef, isVisible };
};

/**
 * Hook para medir performance de componentes
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef(performance.now());
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`);
    }
    
    setRenderCount(prev => prev + 1);
    startTime.current = performance.now();
  });

  return { renderCount };
};

/**
 * Hook para cache de dados com TTL
 */
export const useCache = <T>(key: string, ttl: number = 5 * 60 * 1000) => {
  const [data, setData] = useState<T | null>(null);
  const [isValid, setIsValid] = useState(false);

  const setCachedData = useCallback((newData: T) => {
    const cacheItem = {
      data: newData,
      timestamp: Date.now(),
      ttl
    };
    
    localStorage.setItem(key, JSON.stringify(cacheItem));
    setData(newData);
    setIsValid(true);
  }, [key, ttl]);

  const getCachedData = useCallback(() => {
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
      return cacheItem.data;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }, [key]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(key);
    setData(null);
    setIsValid(false);
  }, [key]);

  return {
    data,
    isValid,
    setCachedData,
    getCachedData,
    clearCache
  };
};
