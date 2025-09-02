import apiClient, { tokenHelpers } from '../lib/apiClient';
import { AuthResponse, User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: AuthResponse;
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface GetMeResponse {
  success: boolean;
  data?: User;
  error?: string;
}

class AuthService {
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Salvar tokens no localStorage
      const { access_token, refresh_token, user } = response.data;
      tokenHelpers.setTokens(access_token, refresh_token);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<LogoutResponse> {
    try {
      await apiClient.post('/auth/logout');
      
      // Limpar tokens do localStorage
      tokenHelpers.clearTokens();
      
      return {
        success: true,
        message: 'Logout realizado com sucesso',
      };
    } catch (error: any) {
      // Mesmo com erro, limpar tokens locais
      tokenHelpers.clearTokens();
      
      const errorMessage = error.response?.data?.message || 'Erro ao fazer logout';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Obtém informações do usuário atual
   */
  async getMe(): Promise<GetMeResponse> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao obter dados do usuário';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return tokenHelpers.isAuthenticated();
  }

  /**
   * Obtém o token de acesso atual
   */
  getAccessToken(): string | null {
    return tokenHelpers.getAccessToken();
  }

  /**
   * Obtém o token de refresh atual
   */
  getRefreshToken(): string | null {
    return tokenHelpers.getRefreshToken();
  }
}

export default new AuthService();
