#!/usr/bin/env node

/**
 * Script para Configurar Tabelas no Xano.io
 * Cria a estrutura básica das tabelas necessárias
 * Execute: node scripts/setup-xano-tables.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';

// Obter o diretório atual do módulo ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#')) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return env;
  } catch (error) {
    console.log('⚠️  Arquivo .env.local não encontrado, usando configurações padrão');
    return {};
  }
}

const env = loadEnv();

// Configurações
const XANO_BASE_URL = env.VITE_XANO_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:hzPTkRyB';
const XANO_API_KEY = env.VITE_XANO_API_KEY || 'hzPTkRyB';

// Cliente Xano
const xanoClient = axios.create({
  baseURL: XANO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${XANO_API_KEY}`,
  },
  timeout: 30000,
});

// Função para log
function log(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

// Função para criar tabela de clientes
async function createClientsTable() {
  log('Criando tabela de clientes...');
  
  try {
    // Criar um cliente de teste para forçar a criação da tabela
    const testClient = {
      name: 'Cliente Teste Setup',
      email: 'teste@setup.com',
      phone: '+55 11 00000-0000',
      company: 'Empresa Teste',
      status: 'active',
      tier: 'bronze',
      segment: 'Teste',
      size: 'small',
      documentType: 'CNPJ',
      documentNumber: '00000000000000',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await xanoClient.post('/clients', testClient);
    log('Tabela de clientes criada com sucesso', 'success');
    
    // Remover o cliente de teste
    if (response.data?.id) {
      await xanoClient.delete(`/clients/${response.data.id}`);
      log('Cliente de teste removido', 'success');
    }
    
    return true;
  } catch (error) {
    log(`Erro ao criar tabela de clientes: ${error.message}`, 'error');
    return false;
  }
}

// Função para criar tabela de tickets
async function createTicketsTable() {
  log('Criando tabela de tickets...');
  
  try {
    const testTicket = {
      title: 'Ticket Teste Setup',
      description: 'Ticket criado para configurar a tabela',
      status: 'open',
      priority: 'low',
      category: 'general',
      clientId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await xanoClient.post('/tickets', testTicket);
    log('Tabela de tickets criada com sucesso', 'success');
    
    if (response.data?.id) {
      await xanoClient.delete(`/tickets/${response.data.id}`);
      log('Ticket de teste removido', 'success');
    }
    
    return true;
  } catch (error) {
    log(`Erro ao criar tabela de tickets: ${error.message}`, 'error');
    return false;
  }
}

// Função para criar tabela de artigos
async function createArticlesTable() {
  log('Criando tabela de artigos...');
  
  try {
    const testArticle = {
      title: 'Artigo Teste Setup',
      content: 'Conteúdo de teste para configurar a tabela',
      category: 'teste',
      tags: ['teste', 'setup'],
      authorId: '1',
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await xanoClient.post('/articles', testArticle);
    log('Tabela de artigos criada com sucesso', 'success');
    
    if (response.data?.id) {
      await xanoClient.delete(`/articles/${response.data.id}`);
      log('Artigo de teste removido', 'success');
    }
    
    return true;
  } catch (error) {
    log(`Erro ao criar tabela de artigos: ${error.message}`, 'error');
    return false;
  }
}

// Função para criar tabela de membros da equipe
async function createTeamMembersTable() {
  log('Criando tabela de membros da equipe...');
  
  try {
    const testMember = {
      name: 'Membro Teste Setup',
      email: 'membro@setup.com',
      role: 'USER',
      department: 'Teste',
      skills: ['teste'],
      maxTickets: 10,
      currentLoad: 0,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await xanoClient.post('/team_members', testMember);
    log('Tabela de membros da equipe criada com sucesso', 'success');
    
    if (response.data?.id) {
      await xanoClient.delete(`/team_members/${response.data.id}`);
      log('Membro de teste removido', 'success');
    }
    
    return true;
  } catch (error) {
    log(`Erro ao criar tabela de membros da equipe: ${error.message}`, 'error');
    return false;
  }
}

// Função para criar tabela de escalas
async function createSchedulesTable() {
  log('Criando tabela de escalas...');
  
  try {
    const testSchedule = {
      userId: '1',
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '17:00',
      type: 'work',
      status: 'confirmed',
      notes: 'Escala de teste',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await xanoClient.post('/schedules', testSchedule);
    log('Tabela de escalas criada com sucesso', 'success');
    
    if (response.data?.id) {
      await xanoClient.delete(`/schedules/${response.data.id}`);
      log('Escala de teste removida', 'success');
    }
    
    return true;
  } catch (error) {
    log(`Erro ao criar tabela de escalas: ${error.message}`, 'error');
    return false;
  }
}

// Função para criar tabela de metas
async function createGoalsTable() {
  log('Criando tabela de metas...');
  
  try {
    const testGoal = {
      userId: '1',
      title: 'Meta Teste Setup',
      description: 'Meta de teste para configurar a tabela',
      target: 100,
      current: 0,
      unit: 'unidades',
      period: 'monthly',
      status: 'not_started',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await xanoClient.post('/goals', testGoal);
    log('Tabela de metas criada com sucesso', 'success');
    
    if (response.data?.id) {
      await xanoClient.delete(`/goals/${response.data.id}`);
      log('Meta de teste removida', 'success');
    }
    
    return true;
  } catch (error) {
    log(`Erro ao criar tabela de metas: ${error.message}`, 'error');
    return false;
  }
}

// Função para criar tabela de NPS
async function createNPSTable() {
  log('Criando tabela de NPS...');
  
  try {
    const testNPS = {
      ticketId: '1',
      rating: 5,
      feedback: 'Feedback de teste',
      category: 'teste',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await xanoClient.post('/nps', testNPS);
    log('Tabela de NPS criada com sucesso', 'success');
    
    if (response.data?.id) {
      await xanoClient.delete(`/nps/${response.data.id}`);
      log('NPS de teste removido', 'success');
    }
    
    return true;
  } catch (error) {
    log(`Erro ao criar tabela de NPS: ${error.message}`, 'error');
    return false;
  }
}

// Função para criar tabela de monitoramento
async function createMonitoringTable() {
  log('Criando tabela de monitoramento...');
  
  try {
    const testMonitoring = {
      userId: '1',
      sessionId: 'session-test-setup',
      startTime: new Date().toISOString(),
      activity: [
        {
          type: 'login',
          timestamp: new Date().toISOString(),
          details: { action: 'test' }
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await xanoClient.post('/monitoring', testMonitoring);
    log('Tabela de monitoramento criada com sucesso', 'success');
    
    if (response.data?.id) {
      await xanoClient.delete(`/monitoring/${response.data.id}`);
      log('Monitoramento de teste removido', 'success');
    }
    
    return true;
  } catch (error) {
    log(`Erro ao criar tabela de monitoramento: ${error.message}`, 'error');
    return false;
  }
}

// Função principal para configurar todas as tabelas
async function setupXanoTables() {
  console.log('🔧 CONFIGURANDO TABELAS NO XANO.IO');
  console.log('====================================\n');
  
  try {
    // Verificar conectividade
    log('Verificando conectividade com o Xano...');
    await xanoClient.get('/');
    log('Conectividade com Xano confirmada', 'success');
    
    // Criar todas as tabelas
    const results = await Promise.allSettled([
      createClientsTable(),
      createTicketsTable(),
      createArticlesTable(),
      createTeamMembersTable(),
      createSchedulesTable(),
      createGoalsTable(),
      createNPSTable(),
      createMonitoringTable()
    ]);
    
    // Resumo dos resultados
    console.log('\n📊 RESUMO DA CONFIGURAÇÃO');
    console.log('==========================');
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const failed = results.length - successful;
    
    console.log(`✅ Tabelas criadas com sucesso: ${successful}`);
    console.log(`❌ Falhas na criação: ${failed}`);
    
    if (failed === 0) {
      console.log('\n🎉 CONFIGURAÇÃO 100% SUCESSO!');
      console.log('🚀 Todas as tabelas foram criadas no Xano.io');
      console.log('📋 Agora você pode executar a migração de dados');
    } else {
      console.log('\n⚠️  CONFIGURAÇÃO PARCIALMENTE SUCESSO');
      console.log('🔧 Verifique os erros acima e tente novamente');
    }
    
  } catch (error) {
    log(`Erro fatal na configuração: ${error.message}`, 'error');
    console.log('\n❌ CONFIGURAÇÃO FALHOU');
    console.log('🔧 Verifique a conectividade e tente novamente');
    process.exit(1);
  }
}

// Executar configuração
setupXanoTables().catch(console.error);
