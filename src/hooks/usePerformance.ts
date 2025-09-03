import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderCount: number;
  renderTime: number;
  mountTime: number;
  unmountTime: number;
  interactions: Array<{
    type: string;
    timestamp: number;
    duration: number;
  }>;
}

interface PerformanceConfig {
  enableTracking: boolean;
  enableLogging: boolean;
  slowRenderThreshold: number;
  maxInteractions: number;
}

export const usePerformance = (
  componentName: string,
  config: Partial<PerformanceConfig> = {}
): {
  trackRender: () => void;
  trackInteraction: (type: string, duration?: number) => void;
  getMetrics: () => PerformanceMetrics;
  resetMetrics: () => void;
} => {
  const metricsRef = useRef<PerformanceMetrics>({
    componentName,
    renderCount: 0,
    renderTime: 0,
    mountTime: 0,
    unmountTime: 0,
    interactions: [],
  });

  const configRef = useRef<PerformanceConfig>({
    enableTracking: true,
    enableLogging: false,
    slowRenderThreshold: 16, // 60fps threshold
    maxInteractions: 100,
    ...config,
  });

  const mountTimeRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);

  const trackRender = useCallback(() => {
    if (!configRef.current.enableTracking) return;

    const now = performance.now();
    
    if (renderStartRef.current > 0) {
      const renderTime = now - renderStartRef.current;
      metricsRef.current.renderTime = renderTime;
      metricsRef.current.renderCount++;

      if (configRef.current.enableLogging && renderTime > configRef.current.slowRenderThreshold) {
        console.warn(
          `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }
    }

    renderStartRef.current = now;
  }, [componentName]);

  const trackInteraction = useCallback((type: string, duration = 0) => {
    if (!configRef.current.enableTracking) return;

    const interaction = {
      type,
      timestamp: performance.now(),
      duration,
    };

    metricsRef.current.interactions.push(interaction);

    // Manter apenas as últimas interações
    if (metricsRef.current.interactions.length > configRef.current.maxInteractions) {
      metricsRef.current.interactions.shift();
    }

    if (configRef.current.enableLogging && duration > 100) {
      console.warn(
        `Slow interaction detected in ${componentName}: ${type} took ${duration.toFixed(2)}ms`
      );
    }
  }, [componentName]);

  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current };
  }, []);

  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      componentName,
      renderCount: 0,
      renderTime: 0,
      mountTime: 0,
      unmountTime: 0,
      interactions: [],
    };
  }, [componentName]);

  useEffect(() => {
    mountTimeRef.current = performance.now();
    metricsRef.current.mountTime = mountTimeRef.current;

    return () => {
      const config = configRef.current;
      metricsRef.current.unmountTime = performance.now();
      
      if (config.enableLogging) {
        const totalTime = metricsRef.current.unmountTime - metricsRef.current.mountTime;
        console.log(
          `${componentName} unmounted after ${totalTime.toFixed(2)}ms with ${metricsRef.current.renderCount} renders`
        );
      }
    };
  }, [componentName]);

  return {
    trackRender,
    trackInteraction,
    getMetrics,
    resetMetrics,
  };
};
