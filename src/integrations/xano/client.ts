import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  XanoResponse, 
  XanoPaginatedResponse, 
  XanoError,
  XanoAuthRequest,
  XanoAuthResponse,
  XanoRefreshRequest,
  XanoRefreshResponse,
  XanoLogoutRequest,
  XanoLogoutResponse,
  XanoCreateRequest,
  XanoUpdateRequest,
  XanoDeleteRequest,
  XanoBulkRequest,
  XanoBulkResponse,
  XanoQuery,
  XanoFilter,
  XanoSort
} from './types';
import { BaseEntity, QueryParams } from '@/types/entities';
import { logger } from '@/lib/logger';
import { XANO_CONFIG } from '@/config/xano';

// ============================================================================
// CLIENTE HTTP XANO.IO - STARPRINT CRM
// ============================================================================

// Configuração do cliente Xano usando configuração centralizada
const XANO_BASE_URL = XANO_CONFIG.API_BASE_URL;
const XANO_API_KEY = import.meta.env.VITE_XANO_API_KEY;

// Cliente HTTP para o Xano
export const xanoClient = axios.create({
  baseURL: XANO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${XANO_API_KEY}`,
  },
  timeout: XANO_CONFIG.REQUEST.TIMEOUT,
});

// ============================================================================
// INTERCEPTORS
// ============================================================================

// Interceptor para requisições
xanoClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Log da requisição se habilitado
    if (XANO_CONFIG.LOGGING.ENABLED && XANO_CONFIG.LOGGING.REQUEST_LOGGING) {
      logger.info('Xano API Request', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
      });
    }

    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem(XANO_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: unknown) => {
    if (XANO_CONFIG.LOGGING.ENABLED && XANO_CONFIG.LOGGING.ERROR_LOGGING) {
      logger.error('Xano Request Interceptor Error', { error });
    }
    return Promise.reject(error);
  }
);

// Interceptor para respostas
xanoClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log da resposta se habilitado
    if (XANO_CONFIG.LOGGING.ENABLED && XANO_CONFIG.LOGGING.RESPONSE_LOGGING) {
      logger.info('Xano API Response', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
      });
    }
    
    return response;
  },
  async (error: unknown) => {
    // Log do erro se habilitado
    if (XANO_CONFIG.LOGGING.ENABLED && XANO_CONFIG.LOGGING.ERROR_LOGGING) {
      logger.error('Xano API Error Response', {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      });
    }

    // Tratamento de erros específicos do Xano
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          // Token expirado ou inválido
          localStorage.removeItem(XANO_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(XANO_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
          
          // Tentar refresh automático se habilitado
          if (XANO_CONFIG.AUTH.AUTO_REFRESH) {
            try {
              const refreshToken = localStorage.getItem(XANO_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
              if (refreshToken) {
                const refreshResponse = await xanoClient.post(XANO_CONFIG.ENDPOINTS.AUTH.REFRESH, {
                  refreshToken
                });
                
                if (refreshResponse.data?.data?.token) {
                  localStorage.setItem(XANO_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, refreshResponse.data.data.token);
                  // Retry da requisição original
                  const originalRequest = error.config;
                  if (originalRequest) {
                    originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.token}`;
                    return xanoClient(originalRequest);
                  }
                }
              }
            } catch (refreshError) {
              // Refresh falhou, redirecionar para login
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
            }
          } else {
            // Redirecionar para login se refresh automático estiver desabilitado
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
          break;
          
        case 403:
          // Acesso negado
          logger.warn('Access denied', { 
            url: error.config?.url,
            status: error.response?.status 
          });
          break;
          
        case 404:
          // Recurso não encontrado
          logger.warn('Resource not found', { 
            url: error.config?.url,
            status: error.response?.status 
          });
          break;
          
        case 429:
          // Rate limit excedido
          logger.warn('Rate limit exceeded', { 
            url: error.config?.url,
            status: error.response?.status 
          });
          break;
          
        case 500:
          // Erro interno do servidor
          logger.error('Internal server error', { 
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data 
          });
          break;
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================================================

export const xanoAuth = {
  // Login
  async login(credentials: XanoAuthRequest): Promise<XanoAuthResponse> {
    try {
      logger.info('Attempting login', { email: credentials.email });
      
      const response = await xanoClient.post<XanoAuthResponse>('/auth/login', credentials);
      
      if (response.data?.data?.token) {
        localStorage.setItem(XANO_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, response.data.data.token);
        localStorage.setItem(XANO_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.data.data.refreshToken);
        localStorage.setItem(XANO_CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
        
        logger.info('Login successful', { 
          userId: response.data.data.user.id,
          userRole: response.data.data.user.role 
        });
      }
      
      return response.data;
    } catch (error) {
      logger.error('Login failed', { 
        email: credentials.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw this.handleError(error);
    }
  },

  // Logout
  async logout(request: XanoLogoutRequest): Promise<XanoLogoutResponse> {
    try {
      const response = await xanoClient.post<XanoLogoutResponse>('/auth/logout', request);
      return response.data;
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem(XANO_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(XANO_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(XANO_CONFIG.STORAGE_KEYS.USER);
    }
    
    return {
      success: true,
      message: 'Logout realizado com sucesso'
    };
  },

  // Refresh token
  async refreshToken(request: XanoRefreshRequest): Promise<XanoRefreshResponse> {
    try {
      const response = await xanoClient.post<XanoRefreshResponse>('/auth/refresh', request);
      
      if (response.data?.data?.token) {
        localStorage.setItem(XANO_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, response.data.data.token);
        localStorage.setItem(XANO_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.data.data.refreshToken);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem(XANO_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Obter usuário atual
  getCurrentUser(): unknown {
    const user = localStorage.getItem(XANO_CONFIG.STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  // Obter token
  getToken(): string | null {
    return localStorage.getItem(XANO_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Obter refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(XANO_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }
};

// ============================================================================
// FUNÇÕES CRUD GENÉRICAS
// ============================================================================

export const xanoAPI = {
  // GET genérico
  async get<T>(endpoint: string, params?: QueryParams): Promise<XanoResponse<T>> {
    try {
      const response = await xanoClient.get<XanoResponse<T>>(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // POST genérico
  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<XanoResponse<T>> {
    try {
      const response = await xanoClient.post<XanoResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // PUT genérico
  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<XanoResponse<T>> {
    try {
      const response = await xanoClient.put<XanoResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // PATCH genérico
  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<XanoResponse<T>> {
    try {
      const response = await xanoClient.patch<XanoResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // DELETE genérico
  async delete<T>(endpoint: string): Promise<XanoResponse<T>> {
    try {
      const response = await xanoClient.delete<XanoResponse<T>>(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
};

// ============================================================================
// FUNÇÕES DE ENTIDADE ESPECÍFICAS
// ============================================================================

export const xanoEntities = {
  // Clientes
  clients: {
    async create<T extends BaseEntity>(data: XanoCreateRequest<T>): Promise<XanoResponse<T>> {
      return xanoAPI.post<T>('/clients', data);
    },

    async get<T extends BaseEntity>(id: string): Promise<XanoResponse<T>> {
      return xanoAPI.get<T>(`/clients/${id}`);
    },

    async list<T extends BaseEntity>(params?: QueryParams): Promise<XanoPaginatedResponse<T>> {
      return xanoAPI.get<T[]>(`/clients`, params) as Promise<XanoPaginatedResponse<T>>;
    },

    async update<T extends BaseEntity>(id: string, data: XanoUpdateRequest<T>): Promise<XanoResponse<T>> {
      return xanoAPI.put<T>(`/clients/${id}`, data);
    },

    async delete<T extends BaseEntity>(id: string): Promise<XanoResponse<T>> {
      return xanoAPI.delete<T>(`/clients/${id}`);
    },

    async search<T extends BaseEntity>(query: XanoQuery): Promise<XanoPaginatedResponse<T>> {
      return xanoAPI.post<T[]>(`/clients/search`, query) as Promise<XanoPaginatedResponse<T>>;
    }
  },

  // Tickets
  tickets: {
    async create<T extends BaseEntity>(data: XanoCreateRequest<T>): Promise<XanoResponse<T>> {
      return xanoAPI.post<T>('/tickets', data);
    },

    async get<T extends BaseEntity>(id: string): Promise<XanoResponse<T>> {
      return xanoAPI.get<T>(`/tickets/${id}`);
    },

    async list<T extends BaseEntity>(params?: QueryParams): Promise<XanoPaginatedResponse<T>> {
      return xanoAPI.get<T[]>(`/tickets`, params) as Promise<XanoPaginatedResponse<T>>;
    },

    async update<T extends BaseEntity>(id: string, data: XanoUpdateRequest<T>): Promise<XanoResponse<T>> {
      return xanoAPI.put<T>(`/tickets/${id}`, data);
    },

    async delete<T extends BaseEntity>(id: string): Promise<XanoResponse<T>> {
      return xanoAPI.delete<T>(`/tickets/${id}`);
    },

    async search<T extends BaseEntity>(query: XanoQuery): Promise<XanoPaginatedResponse<T>> {
      return xanoAPI.post<T[]>(`/tickets/search`, query) as Promise<XanoPaginatedResponse<T>>;
    }
  },

  // Base de Conhecimento
  articles: {
    async create<T extends BaseEntity>(data: XanoCreateRequest<T>): Promise<XanoResponse<T>> {
      return xanoAPI.post<T>('/articles', data);
    },

    async get<T extends BaseEntity>(id: string): Promise<XanoResponse<T>> {
      return xanoAPI.get<T>(`/articles/${id}`);
    },

    async list<T extends BaseEntity>(params?: QueryParams): Promise<XanoPaginatedResponse<T>> {
      return xanoAPI.get<T[]>(`/articles`, params) as Promise<XanoPaginatedResponse<T>>;
    },

    async update<T extends BaseEntity>(id: string, data: XanoUpdateRequest<T>): Promise<XanoResponse<T>> {
      return xanoAPI.put<T>(`/articles/${id}`, data);
    },

    async delete<T extends BaseEntity>(id: string): Promise<XanoResponse<T>> {
      return xanoAPI.delete<T>(`/articles/${id}`);
    },

    async search<T extends BaseEntity>(query: XanoQuery): Promise<XanoPaginatedResponse<T>> {
      return xanoAPI.post<T[]>(`/articles/search`, query) as Promise<XanoPaginatedResponse<T>>;
    }
  },

  // Equipe
  team: {
    async create<T extends BaseEntity>(data: XanoCreateRequest<T>): Promise<XanoResponse<T>> {
      return xanoAPI.post<T>('/team', data);
    },

    async get<T extends BaseEntity>(id: string): Promise<XanoResponse<T>> {
      return xanoAPI.get<T>(`/team/${id}`);
    },

    async list<T extends BaseEntity>(params?: QueryParams): Promise<XanoPaginatedResponse<T>> {
      return xanoAPI.get<T[]>(`/team`, params) as Promise<XanoPaginatedResponse<T>>;
    },

    async update<T extends BaseEntity>(id: string, data: XanoUpdateRequest<T>): Promise<XanoResponse<T>> {
      return xanoAPI.put<T>(`/team/${id}`, data);
    },

    async delete<T extends BaseEntity>(id: string): Promise<XanoResponse<T>> {
      return xanoAPI.delete<T>(`/team/${id}`);
    },

    async search<T extends BaseEntity>(query: XanoQuery): Promise<XanoPaginatedResponse<T>> {
      return xanoAPI.post<T[]>(`/team/search`, query) as Promise<XanoPaginatedResponse<T>>;
    }
  },

  // NPS
  nps: {
    async create<T extends BaseEntity>(data: XanoCreateRequest<T>): Promise<XanoResponse<T>> {
      return xanoAPI.post<T>('/nps', data);
    },

    async get<T extends BaseEntity>(id: string): Promise<XanoResponse<T>> {
      return xanoAPI.get<T>(`/nps/${id}`);
    },

    async list<T extends BaseEntity>(params?: QueryParams): Promise<XanoPaginatedResponse<T>> {
      return xanoAPI.get<T[]>(`/nps`, params) as Promise<XanoPaginatedResponse<T>>;
    },

    async update<T extends BaseEntity>(id: string, data: XanoUpdateRequest<T>): Promise<XanoResponse<T>> {
      return xanoAPI.put<T>(`/nps/${id}`, data);
    },

    async delete<T extends BaseEntity>(id: string): Promise<XanoResponse<T>> {
      return xanoAPI.delete<T>(`/nps/${id}`);
    },

    async search<T extends BaseEntity>(query: XanoQuery): Promise<XanoPaginatedResponse<T>> {
      return xanoAPI.post<T[]>(`/nps/search`, query) as Promise<XanoPaginatedResponse<T>>;
    }
  }
};

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

export const xanoUtils = {
  // Construir query string
  buildQueryString(query: XanoQuery): string {
    const params = new URLSearchParams();

    if (query.select) {
      params.append('select', query.select.join(','));
    }

    if (query.filters) {
      query.filters.forEach((filter, index) => {
        params.append(`filters[${index}][field]`, filter.field);
        params.append(`filters[${index}][operator]`, filter.operator);
        if (filter.value !== null) {
          if (Array.isArray(filter.value)) {
            params.append(`filters[${index}][value]`, filter.value.join(','));
          } else {
            params.append(`filters[${index}][value]`, String(filter.value));
          }
        }
      });
    }

    if (query.sorts) {
      query.sorts.forEach((sort, index) => {
        params.append(`sorts[${index}][field]`, sort.field);
        params.append(`sorts[${index}][direction]`, sort.direction);
        if (sort.nulls) {
          params.append(`sorts[${index}][nulls]`, sort.nulls);
        }
      });
    }

    if (query.limit) {
      params.append('limit', query.limit.toString());
    }

    if (query.offset) {
      params.append('offset', query.offset.toString());
    }

    if (query.page) {
      params.append('page', query.page.toString());
    }

    if (query.search) {
      params.append('search', query.search);
    }

    if (query.searchFields) {
      params.append('searchFields', query.searchFields.join(','));
    }

    return params.toString();
  },

  // Validar filtros
  validateFilters(filters: XanoFilter[]): boolean {
    return filters.every(filter => {
      return filter.field && filter.operator && filter.value !== undefined;
    });
  },

  // Validar ordenação
  validateSorts(sorts: XanoSort[]): boolean {
    return sorts.every(sort => {
      return sort.field && ['asc', 'desc'].includes(sort.direction);
    });
  },

  // Tratar erro
  handleError(error: unknown): XanoError {
    if (axios.isAxiosError(error)) {
      const xanoError: XanoError = {
        code: error.response?.status?.toString() || 'UNKNOWN',
        message: error.response?.data?.message || error.message || 'Erro desconhecido',
        details: error.response?.data,
        timestamp: new Date().toISOString(),
        requestId: error.response?.headers?.['x-request-id'],
        path: error.config?.url,
        method: error.config?.method?.toUpperCase()
      };

      // Log do erro
      logger.error('Xano API Error', {
        error: xanoError,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      return xanoError;
    }

    const unknownError: XanoError = {
      code: 'UNKNOWN',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      details: { error },
      timestamp: new Date().toISOString()
    };

    // Log do erro desconhecido
    logger.error('Unknown Xano Error', { error: unknownError });

    return unknownError;
  }
};

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export {
  xanoClient,
  xanoAuth,
  xanoAPI,
  xanoEntities,
  xanoUtils
};
