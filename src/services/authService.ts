import { User, LoginCredentials } from '@/types/entities';

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

class AuthService {
  // Wrapper para o serviço de autenticação do Supabase

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return supabaseAuthService.login(credentials);
  }

  async refreshToken(): Promise<RefreshResponse> {
    return supabaseAuthService.refreshToken();
  }

  async getMe(): Promise<AuthResponse> {
    return supabaseAuthService.getMe();
  }

  async logout(): Promise<void> {
    return supabaseAuthService.logout();
  }

  isAuthenticated(): boolean {
    return supabaseAuthService.isAuthenticated();
  }

  getToken(): string | null {
    return supabaseAuthService.getToken();
  }
}

export default new AuthService();
