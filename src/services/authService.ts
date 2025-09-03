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

class AuthService {
  private baseURL: string;
  private tokenStorageKey: string;
  private refreshStorageKey: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_XANO_BASE_URL || '';
    this.tokenStorageKey = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'starprint.token';
    this.refreshStorageKey = import.meta.env.VITE_REFRESH_STORAGE_KEY || 'starprint.refresh';
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  private setStoredToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.refreshStorageKey);
  }

  private setStoredRefreshToken(token: string): void {
    localStorage.setItem(this.refreshStorageKey, token);
  }

  private clearStoredTokens(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.refreshStorageKey);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        this.setStoredToken(data.access_token);
        if (data.refresh_token) {
          this.setStoredRefreshToken(data.refresh_token);
        }
        return {
          success: true,
          data: data.user,
          message: 'Login realizado com sucesso',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro no login',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async refreshToken(): Promise<RefreshResponse> {
    try {
      const refreshToken = this.getStoredRefreshToken();
      if (!refreshToken) {
        return {
          success: false,
          error: 'Refresh token não encontrado',
        };
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        this.setStoredToken(data.access_token);
        if (data.refresh_token) {
          this.setStoredRefreshToken(data.refresh_token);
        }
        return {
          success: true,
          data: {
            access_token: data.access_token,
            refresh_token: data.refresh_token || refreshToken,
            user: data.user,
          },
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao renovar token',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async getMe(): Promise<AuthResponse> {
    try {
      const token = this.getStoredToken();
      if (!token) {
        return {
          success: false,
          error: 'Token não encontrado',
        };
      }

      const response = await fetch(`${this.baseURL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.user,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao obter dados do usuário',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getStoredToken();
      if (token) {
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      this.clearStoredTokens();
    }
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  getToken(): string | null {
    return this.getStoredToken();
  }
}

export default new AuthService();
