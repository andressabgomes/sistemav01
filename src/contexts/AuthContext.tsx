import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import supabaseAuthService from '../services/supabaseAuthService';
import { User, LoginCredentials } from '../types/entities';

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
        const currentUser = await supabaseAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao carregar usuário atual:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabaseAuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await supabaseAuthService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
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
      await supabaseAuthService.logout();
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