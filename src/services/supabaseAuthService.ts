import { supabase } from '@/integrations/supabase/client';
import { User, LoginCredentials } from '@/types';

interface AuthResponse {
  success: boolean;
  data?: User;
  error?: string;
  message?: string;
}

interface RefreshResponse {
  success: boolean;
  data?: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
  error?: string;
}

class SupabaseAuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Erro no login',
        };
      }

      if (data.user) {
        // Buscar dados adicionais do usuário na tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.warn('Erro ao buscar dados do usuário:', userError);
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: userData?.name || data.user.user_metadata?.name || 'Usuário',
          role: userData?.role || 'USER',
          department: userData?.department || '',
          status: userData?.status || 'active',
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        };

        return {
          success: true,
          data: user,
          message: 'Login realizado com sucesso',
        };
      }

      return {
        success: false,
        error: 'Usuário não encontrado',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async register(credentials: LoginCredentials & { name: string }): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Erro no registro',
        };
      }

      if (data.user) {
        // Criar registro na tabela users
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: credentials.name,
            role: 'USER',
            department: '',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (userError) {
          console.warn('Erro ao criar registro do usuário:', userError);
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: credentials.name,
          role: 'USER',
          department: '',
          status: 'active',
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        };

        return {
          success: true,
          data: user,
          message: 'Usuário registrado com sucesso',
        };
      }

      return {
        success: false,
        error: 'Erro ao criar usuário',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }

  async getMe(): Promise<AuthResponse> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return {
          success: false,
          error: 'Usuário não autenticado',
        };
      }

      // Buscar dados adicionais do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.warn('Erro ao buscar dados do usuário:', userError);
      }

      const userInfo: User = {
        id: user.id,
        email: user.email || '',
        name: userData?.name || user.user_metadata?.name || 'Usuário',
        role: userData?.role || 'USER',
        department: userData?.department || '',
        status: userData?.status || 'active',
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
      };

      return {
        success: true,
        data: userInfo,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async refreshToken(): Promise<RefreshResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        return {
          success: false,
          error: error.message || 'Erro ao renovar token',
        };
      }

      if (data.session) {
        return {
          success: true,
          data: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user as any, // Converter para User se necessário
          },
        };
      }

      return {
        success: false,
        error: 'Sessão não encontrada',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  isAuthenticated(): boolean {
    const { data: { session } } = supabase.auth.getSession();
    return !!session;
  }

  getToken(): string | null {
    const { data: { session } } = supabase.auth.getSession();
    return session?.access_token || null;
  }

  // Listener para mudanças de autenticação
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export default new SupabaseAuthService();
