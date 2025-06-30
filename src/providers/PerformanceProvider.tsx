'use client';

import { CONFIG } from '@/config';
import { useMemoryMonitor, usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logger } from '@/utils/logger';
import { type ReactNode, useEffect } from 'react';

interface PerformanceProviderProps {
  children: ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const { mark, measure } = usePerformanceMonitor('App');
  useMemoryMonitor('App');

  useEffect(() => {
    if (!CONFIG.MONITORING.ENABLE_PERFORMANCE_LOGGING) {
      return;
    }

    mark('init');

    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            logger.performance('FCP', entry.startTime);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        logger.warn('Failed to observe paint metrics', error);
      }

      const checkInteractive = () => {
        if (document.readyState === 'complete') {
          const tti = performance.now();
          logger.performance('TTI', tti);
          mark('interactive');
          measure('time-to-interactive', 'init', 'interactive');
        }
      };

      if (document.readyState === 'complete') {
        checkInteractive();
      } else {
        window.addEventListener('load', checkInteractive);
      }

      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        logger.info('Connection info', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      }

      return () => {
        observer.disconnect();
        window.removeEventListener('load', checkInteractive);
      };
    }
  }, [mark, measure]);

  return <>{children}</>;
}
