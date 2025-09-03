// Configuração de integração para migração Supabase -> Xano
import { supabase } from './supabase/client';
import { xanoClient, xanoAuth } from './xano';

export interface IntegrationConfig {
  backend: 'supabase' | 'xano' | 'hybrid';
  enableMigration: boolean;
  syncInterval: number; // em milissegundos
}

export const integrationConfig: IntegrationConfig = {
  backend: 'supabase', // Configurado para usar Supabase como backend principal
  enableMigration: false,
  syncInterval: 30000, // 30 segundos
};

// Função para verificar qual backend está ativo
export const getActiveBackend = () => {
  return integrationConfig.backend;
};

// Função para migrar dados do Supabase para o Xano
export const migrateDataToXano = async () => {
  if (!integrationConfig.enableMigration) {
    console.log('Migração desabilitada');
    return;
  }

  try {
    console.log('Iniciando migração de dados para o Xano...');

    // Migrar clientes
    await migrateClients();
    
    // Migrar tickets
    await migrateTickets();
    
    // Migrar artigos da base de conhecimento
    await migrateArticles();
    
    // Migrar usuários da equipe
    await migrateTeamMembers();
    
    // Migrar escalas
    await migrateSchedules();
    
    // Migrar metas
    await migrateGoals();
    
    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
    throw error;
  }
};

// Migração de clientes
const migrateClients = async () => {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) throw error;
    
    for (const client of clients || []) {
      await xanoClient.post('/clients', {
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        status: client.status || 'active',
      });
    }
    
    console.log(`${clients?.length || 0} clientes migrados`);
  } catch (error) {
    console.error('Erro ao migrar clientes:', error);
  }
};

// Migração de tickets
const migrateTickets = async () => {
  try {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*');
    
    if (error) throw error;
    
    for (const ticket of tickets || []) {
      await xanoClient.post('/tickets', {
        title: ticket.title,
        description: ticket.description,
        status: ticket.status || 'open',
        priority: ticket.priority || 'medium',
        client_id: ticket.client_id,
        assigned_to: ticket.assigned_to,
      });
    }
    
    console.log(`${tickets?.length || 0} tickets migrados`);
  } catch (error) {
    console.error('Erro ao migrar tickets:', error);
  }
};

// Migração de artigos
const migrateArticles = async () => {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*');
    
    if (error) throw error;
    
    for (const article of articles || []) {
      await xanoClient.post('/articles', {
        title: article.title,
        content: article.content,
        category: article.category || 'geral',
        tags: article.tags || [],
        author_id: article.author_id,
        status: article.status || 'published',
      });
    }
    
    console.log(`${articles?.length || 0} artigos migrados`);
  } catch (error) {
    console.error('Erro ao migrar artigos:', error);
  }
};

// Migração de membros da equipe
const migrateTeamMembers = async () => {
  try {
    const { data: members, error } = await supabase
      .from('team_members')
      .select('*');
    
    if (error) throw error;
    
    for (const member of members || []) {
      await xanoClient.post('/team_members', {
        name: member.name,
        email: member.email,
        role: member.role || 'member',
        department: member.department || 'geral',
        status: member.status || 'active',
      });
    }
    
    console.log(`${members?.length || 0} membros da equipe migrados`);
  } catch (error) {
    console.error('Erro ao migrar membros da equipe:', error);
  }
};

// Migração de escalas
const migrateSchedules = async () => {
  try {
    const { data: schedules, error } = await supabase
      .from('schedules')
      .select('*');
    
    if (error) throw error;
    
    for (const schedule of schedules || []) {
      await xanoClient.post('/schedules', {
        team_member_id: schedule.team_member_id,
        date: schedule.date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        type: schedule.type || 'work',
      });
    }
    
    console.log(`${schedules?.length || 0} escalas migradas`);
  } catch (error) {
    console.error('Erro ao migrar escalas:', error);
  }
};

// Migração de metas
const migrateGoals = async () => {
  try {
    const { data: goals, error } = await supabase
      .from('goals')
      .select('*');
    
    if (error) throw error;
    
    for (const goal of goals || []) {
      await xanoClient.post('/goals', {
        title: goal.title,
        description: goal.description,
        target_value: goal.target_value,
        current_value: goal.current_value || 0,
        unit: goal.unit || 'unidade',
        deadline: goal.deadline,
        status: goal.status || 'active',
      });
    }
    
    console.log(`${goals?.length || 0} metas migradas`);
  } catch (error) {
    console.error('Erro ao migrar metas:', error);
  }
};

// Função para sincronizar dados entre os backends
export const syncData = async () => {
  if (integrationConfig.backend === 'hybrid') {
    // Implementar sincronização bidirecional
    console.log('Sincronizando dados entre Supabase e Xano...');
  }
};

// Função para limpar dados do Supabase após migração bem-sucedida
export const cleanupSupabaseData = async () => {
  if (integrationConfig.backend === 'xano') {
    console.log('Limpando dados do Supabase...');
    // Implementar limpeza dos dados
  }
};

// Exportar configurações
export default integrationConfig;
