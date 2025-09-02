import { QueryClient } from '@tanstack/react-query';

// Configuração do React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // 30 segundos
      gcTime: 5 * 60 * 1000, // 5 minutos (anteriormente cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;
