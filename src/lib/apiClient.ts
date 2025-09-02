import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configurações
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:hzPTkRyB';
const tokenStorageKey = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'starprint.token';
const refreshStorageKey = import.meta.env.VITE_REFRESH_STORAGE_KEY || 'starprint.refresh';

// Cliente HTTP base
const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Fila de requisições durante refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Processar fila de requisições
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor para requisições
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem(tokenStorageKey);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Adicionar à fila se refresh já estiver em andamento
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(refreshStorageKey);
      
      if (!refreshToken) {
        processQueue(new Error('No refresh token'), null);
        isRefreshing = false;
        // Redirecionar para login
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;
        
        // Salvar novos tokens
        localStorage.setItem(tokenStorageKey, access_token);
        if (newRefreshToken) {
          localStorage.setItem(refreshStorageKey, newRefreshToken);
        }

        // Processar fila de requisições
        processQueue(null, access_token);
        
        // Retry da requisição original
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Limpar tokens e redirecionar para login
        localStorage.removeItem(tokenStorageKey);
        localStorage.removeItem(refreshStorageKey);
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helpers para gerenciar tokens
export const tokenHelpers = {
  getAccessToken: () => localStorage.getItem(tokenStorageKey),
  getRefreshToken: () => localStorage.getItem(refreshStorageKey),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(tokenStorageKey, accessToken);
    localStorage.setItem(refreshStorageKey, refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(refreshStorageKey);
  },
  isAuthenticated: () => !!localStorage.getItem(tokenStorageKey),
};

export default apiClient;
