// Configuração de integração para Supabase
import { supabase } from './supabase/client';

export interface IntegrationConfig {
  backend: 'supabase';
  enableRealtime: boolean;
  enableRowLevelSecurity: boolean;
}

export const integrationConfig: IntegrationConfig = {
  backend: 'supabase',
  enableRealtime: true,
  enableRowLevelSecurity: true,
};

// Função para verificar qual backend está ativo
export const getActiveBackend = () => {
  return integrationConfig.backend;
};

// Função para verificar conectividade com Supabase
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    return { connected: true, data };
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return { connected: false, error };
  }
};

// Exportar configurações
export default integrationConfig;
