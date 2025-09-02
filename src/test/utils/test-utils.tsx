import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

// Criar um QueryClient limpo para cada teste
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { route = '/', ...renderOptions } = options;

  // Mock da rota se especificada
  if (route !== '/') {
    window.history.pushState({}, 'Test page', route);
  }

  return render(ui, {
    wrapper: AllTheProviders,
    ...renderOptions,
  });
};

// Re-exportar tudo
export * from '@testing-library/react';
export { customRender as render };
export { createTestQueryClient };

// Função helper para esperar elementos desaparecerem
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(element).not.toBeInTheDocument();
};

// Função helper para simular usuário logado
export const mockAuthenticatedUser = () => {
  // Mock do contexto de autenticação
  vi.mocked(require('@/contexts/AuthContext')).useAuth = vi.fn(() => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'admin',
    },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }));
};

// Função helper para simular usuário não logado
export const mockUnauthenticatedUser = () => {
  vi.mocked(require('@/contexts/AuthContext')).useAuth = vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }));
};
