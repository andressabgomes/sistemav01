import axios from 'axios';

// Configuração do cliente Xano
const XANO_BASE_URL = import.meta.env.VITE_XANO_BASE_URL || 'https://your-workspace.xano.app';
const XANO_API_KEY = import.meta.env.VITE_XANO_API_KEY;

// Cliente HTTP para o Xano
export const xanoClient = axios.create({
  baseURL: XANO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${XANO_API_KEY}`,
  },
  timeout: 10000,
});

// Interceptor para requisições
xanoClient.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem('xano_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
xanoClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erros específicos do Xano
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('xano_auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções auxiliares para autenticação
export const xanoAuth = {
  // Login
  async login(email: string, password: string) {
    try {
      const response = await xanoClient.post('/auth/login', {
        email,
        password,
      });
      
      if (response.data?.token) {
        localStorage.setItem('xano_auth_token', response.data.token);
        localStorage.setItem('xano_user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await xanoClient.post('/auth/logout');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('xano_auth_token');
      localStorage.removeItem('xano_user');
    }
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('xano_auth_token');
  },

  // Obter usuário atual
  getCurrentUser() {
    const user = localStorage.getItem('xano_user');
    return user ? JSON.parse(user) : null;
  },

  // Obter token
  getToken() {
    return localStorage.getItem('xano_auth_token');
  }
};

// Funções para operações CRUD genéricas
export const xanoAPI = {
  // GET
  async get(endpoint: string, params?: any) {
    const response = await xanoClient.get(endpoint, { params });
    return response.data;
  },

  // POST
  async post(endpoint: string, data?: any) {
    const response = await xanoClient.post(endpoint, data);
    return response.data;
  },

  // PUT
  async put(endpoint: string, data?: any) {
    const response = await xanoClient.put(endpoint, data);
    return response.data;
  },

  // DELETE
  async delete(endpoint: string) {
    const response = await xanoClient.delete(endpoint);
    return response.data;
  },

  // PATCH
  async patch(endpoint: string, data?: any) {
    const response = await xanoClient.patch(endpoint, data);
    return response.data;
  }
};

export default xanoClient;
