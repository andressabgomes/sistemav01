import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AuthContext, { useAuth } from './AuthContext';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

describe('AuthContext', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'admin',
  };

  const mockSupabase = {
    auth: {
      getSession: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fornece contexto de autenticação para componentes filhos', () => {
    const TestComponent = () => {
      const { user, isAuthenticated, isLoading } = useAuth();
      return (
        <div>
          <span data-testid="user-id">{user?.id || 'no-user'}</span>
          <span data-testid="is-authenticated">{isAuthenticated.toString()}</span>
          <span data-testid="is-loading">{isLoading.toString()}</span>
        </div>
      );
    };

    render(
      <AuthContext.Provider value={{
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      }}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('user-id')).toHaveTextContent('test-user-id');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
  });

  it('renderiza loading state inicialmente', () => {
    const TestComponent = () => {
      const { isLoading } = useAuth();
      return <div data-testid="loading">{isLoading.toString()}</div>;
    };

    render(
      <AuthContext.Provider value={{
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: vi.fn(),
        logout: vi.fn(),
      }}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('renderiza estado não autenticado', () => {
    const TestComponent = () => {
      const { user, isAuthenticated } = useAuth();
      return (
        <div>
          <span data-testid="user">{user ? 'authenticated' : 'not-authenticated'}</span>
          <span data-testid="auth-status">{isAuthenticated.toString()}</span>
        </div>
      );
    };

    render(
      <AuthContext.Provider value={{
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      }}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('auth-status')).toHaveTextContent('false');
  });

  it('renderiza estado autenticado', () => {
    const TestComponent = () => {
      const { user, isAuthenticated } = useAuth();
      return (
        <div>
          <span data-testid="user-email">{user?.email || 'no-email'}</span>
          <span data-testid="user-role">{user?.role || 'no-role'}</span>
          <span data-testid="auth-status">{isAuthenticated.toString()}</span>
        </div>
      );
    };

    render(
      <AuthContext.Provider value={{
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
      }}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
    expect(screen.getByTestId('auth-status')).toHaveTextContent('true');
  });
});
