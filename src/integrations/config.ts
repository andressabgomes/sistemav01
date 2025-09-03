// Configuração de integração para Supabase
import { supabase } from './supabase/client';

export interface IntegrationConfig {
  backend: 'supabase';
  enableRealtime: boolean;
  enableRowLevelSecurity: boolean;
  enableAuth: boolean;
  enableStorage: boolean;
}

export const integrationConfig: IntegrationConfig = {
  backend: 'supabase',
  enableRealtime: true,
  enableRowLevelSecurity: true,
  enableAuth: true,
  enableStorage: true,
};

// Função para verificar qual backend está ativo
export const getActiveBackend = () => {
  return integrationConfig.backend;
};

// Função para verificar conectividade com Supabase
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    return { 
      connected: true, 
      data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    };
  }
};

// Função para verificar status dos serviços
export const checkSupabaseServices = async () => {
  const services = {
    database: false,
    auth: false,
    realtime: false,
    storage: false,
  };

  try {
    // Testar banco de dados
    const { error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    services.database = !dbError;

    // Testar autenticação
    const { error: authError } = await supabase.auth.getSession();
    services.auth = !authError;

    // Testar realtime (verificar se está configurado)
    services.realtime = integrationConfig.enableRealtime;

    // Testar storage (verificar se está configurado)
    services.storage = integrationConfig.enableStorage;

    return {
      success: true,
      services,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      services,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    };
  }
};

// Função para obter informações do projeto
export const getSupabaseInfo = async () => {
  try {
    const connection = await checkSupabaseConnection();
    const services = await checkSupabaseServices();
    
    return {
      project: {
        backend: integrationConfig.backend,
        url: import.meta.env.VITE_SUPABASE_URL,
        connected: connection.connected,
      },
      services: services.services,
      config: integrationConfig,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    };
  }
};

// Exportar configurações
export default integrationConfig;
