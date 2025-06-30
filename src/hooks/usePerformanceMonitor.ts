import { CONFIG } from '@/config';
import { logger } from '@/utils/logger';
import { useEffect, useRef } from 'react';

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  entryType: string;
}

export function usePerformanceMonitor(componentName: string) {
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (!CONFIG.MONITORING.ENABLE_PERFORMANCE_LOGGING) {
      return;
    }

    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    const perfLogger = logger.child({ component: componentName });

    if (performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0] as PerformanceNavigationTiming;
        perfLogger.performance('page-load', nav.loadEventEnd - nav.fetchStart, {
          dns: nav.domainLookupEnd - nav.domainLookupStart,
          tcp: nav.connectEnd - nav.connectStart,
          request: nav.responseStart - nav.requestStart,
          response: nav.responseEnd - nav.responseStart,
          dom: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          load: nav.loadEventEnd - nav.loadEventStart,
        });
      }
    }

    try {
      observerRef.current = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            perfLogger.performance(entry.name, entry.duration);
          } else if (entry.entryType === 'largest-contentful-paint') {
            perfLogger.performance('LCP', entry.startTime);
          } else if (entry.entryType === 'first-input' && 'processingStart' in entry) {
            const firstInput = entry as PerformanceEventTiming;
            perfLogger.performance('FID', firstInput.processingStart - firstInput.startTime);
          } else if (entry.entryType === 'layout-shift' && 'value' in entry) {
            const layoutShift = entry as any;
            if (!layoutShift.hadRecentInput) {
              perfLogger.performance('CLS', layoutShift.value);
            }
          }
        }
      });

      observerRef.current.observe({
        entryTypes: ['measure', 'largest-contentful-paint', 'first-input', 'layout-shift'],
      });
    } catch (error) {
      perfLogger.warn('Failed to create PerformanceObserver', error);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [componentName]);

  const mark = (markName: string) => {
    if (typeof window !== 'undefined' && performance.mark) {
      performance.mark(`${componentName}-${markName}`);
    }
  };

  const measure = (measureName: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && performance.measure) {
      try {
        const start = `${componentName}-${startMark}`;
        const end = endMark ? `${componentName}-${endMark}` : undefined;
        performance.measure(`${componentName}-${measureName}`, start, end);
      } catch (error) {
        logger.warn('Failed to measure performance', error);
      }
    }
  };

  return { mark, measure };
}

export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(0);
  const perfLogger = logger.child({ component: componentName });

  useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();

    if (lastRenderTime.current > 0) {
      const timeSinceLastRender = now - lastRenderTime.current;

      if (timeSinceLastRender < 100) {
        perfLogger.warn('Rapid re-render detected', {
          renderCount: renderCount.current,
          timeSinceLastRender: Math.round(timeSinceLastRender),
        });
      }
    }

    lastRenderTime.current = now;

    if (renderCount.current > 10) {
      perfLogger.warn('High render count', {
        renderCount: renderCount.current,
      });
    }
  });

  return renderCount.current;
}

export function useMemoryMonitor(componentName: string, interval = 60000) {
  useEffect(() => {
    if (!CONFIG.MONITORING.ENABLE_PERFORMANCE_LOGGING) {
      return;
    }

    if (typeof window === 'undefined' || !(performance as any).memory) {
      return;
    }

    const memLogger = logger.child({ component: componentName });

    const checkMemory = () => {
      const memory = (performance as any).memory;

      memLogger.performance('memory-usage', memory.usedJSHeapSize / 1048576, {
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576),
        percentUsed: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
      });

      if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
        memLogger.warn('High memory usage detected', {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          limit: Math.round(memory.jsHeapSizeLimit / 1048576),
        });
      }
    };

    checkMemory();
    const intervalId = setInterval(checkMemory, interval);

    return () => clearInterval(intervalId);
  }, [componentName, interval]);
}
