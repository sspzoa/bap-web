'use client';

import { CONFIG } from '@/config';
import { logger } from '@/utils/logger';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';

const queryLogger = logger.child({ component: 'react-query' });

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: CONFIG.CACHE.MEAL_DATA_STALE_TIME,
            retry: (failureCount, error) => {
              if (failureCount >= CONFIG.API.RETRY.COUNT) {
                return false;
              }

              if (error instanceof Error && 'status' in error) {
                const status = (error as any).status;
                if (status >= 400 && status < 500 && status !== 429) {
                  return false;
                }
              }

              return true;
            },
            retryDelay: (attemptIndex) => {
              return Math.min(1000 * 2 ** attemptIndex, 30000);
            },
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'added' || event.type === 'updated') {
        if (event.query.state.status === 'error') {
          queryLogger.error('Query error', {
            queryKey: event.query.queryKey,
            error: event.query.state.error instanceof Error ? event.query.state.error.message : 'Unknown error',
          });
        } else if (event.query.state.status === 'success') {
          queryLogger.debug('Query success', {
            queryKey: event.query.queryKey,
          });
        }
      }
    });

    const unsubscribeMutation = queryClient.getMutationCache().subscribe((event) => {
      if (event.type === 'added' || event.type === 'updated') {
        if (event.mutation?.state.status === 'error') {
          queryLogger.error('Mutation error', {
            error: event.mutation.state.error instanceof Error ? event.mutation.state.error.message : 'Unknown error',
          });
        } else if (event.mutation?.state.status === 'success') {
          queryLogger.debug('Mutation success');
        }
      }
    });

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [queryClient]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const intervalId = setInterval(() => {
      const queryCache = queryClient.getQueryCache();
      const mutationCache = queryClient.getMutationCache();
      const queries = queryCache.getAll();

      queryLogger.debug('Query client stats', {
        queries: {
          count: queries.length,
          active: queries.filter((q) => q.state.status === 'pending').length,
          stale: queries.filter((q) => q.isStale()).length,
        },
        mutations: {
          count: mutationCache.getAll().length,
        },
      });
    }, 30000);

    return () => clearInterval(intervalId);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
