import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService from '../services/authService';
import { User, LoginCredentials } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário atual quando o componente montar
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        // Verificar se há token válido
        if (authService.isAuthenticated()) {
          const response = await authService.getMe();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token inválido, limpar estado
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário atual:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        // Obter dados do usuário após login
        const meResponse = await authService.getMe();
        if (meResponse.success && meResponse.data) {
          setUser(meResponse.data);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;