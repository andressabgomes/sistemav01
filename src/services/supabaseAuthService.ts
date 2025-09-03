import { supabase } from '@/integrations/supabase/client';
import type { User, LoginCredentials } from '@/types/entities';
import type { AuthResponse } from '@supabase/supabase-js';

export interface SupabaseUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER' | 'SUPPORT';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    session: any;
  };
  error?: string;
  message?: string;
}

class SupabaseAuthService {
  /**
   * Fazer login com email e senha
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          error: 'Falha na autenticação',
        };
      }

      // Buscar dados do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError || !userData) {
        return {
          success: false,
          error: 'Usuário não encontrado no sistema',
        };
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        role: userData.role,
        status: userData.status,
      };

      return {
        success: true,
        data: {
          user,
          session: data.session,
        },
        message: 'Login realizado com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
      };
    }
  }

  /**
   * Fazer logout
   */
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
      };
    }
  }

  /**
   * Obter usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      // Buscar dados do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        return null;
      }

      return {
        id: userData.id,
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        role: userData.role,
        status: userData.status,
      };
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  /**
   * Verificar se o usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      return false;
    }
  }

  /**
   * Registrar novo usuário
   */
  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER' | 'SUPPORT';
  }): Promise<LoginResponse> {
    try {
      // Registrar no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        return {
          success: false,
          error: authError.message,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Falha no registro',
        };
      }

      // Criar registro na tabela users
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role || 'USER',
          status: 'active',
        })
        .select()
        .single();

      if (userError) {
        return {
          success: false,
          error: 'Erro ao criar perfil do usuário',
        };
      }

      const user: User = {
        id: userRecord.id,
        email: userRecord.email,
        name: `${userRecord.first_name} ${userRecord.last_name}`,
        role: userRecord.role,
        status: userRecord.status,
      };

      return {
        success: true,
        data: {
          user,
          session: authData.session,
        },
        message: 'Usuário registrado com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
      };
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(userId: string, updates: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
      };
    }
  }

  /**
   * Escutar mudanças na autenticação
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

export default new SupabaseAuthService();
