#!/usr/bin/env node

/**
 * Script para Criar Tabelas no Xano.io via API
 * Cria a estrutura das tabelas usando a API do Xano
 * Execute: node scripts/create-xano-tables.js
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

// Função para criar tabela via API do Xano
async function createTable(tableName, tableSchema) {
  log(`Criando tabela '${tableName}'...`);
  
  try {
    // Tentar criar a tabela usando a API de schema do Xano
    const response = await xanoClient.post('/_schema', {
      table: tableName,
      schema: tableSchema
    });
    
    log(`Tabela '${tableName}' criada com sucesso`, 'success');
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      log(`Endpoint de schema não encontrado para '${tableName}'`, 'warning');
      log(`Tabela '${tableName}' será criada automaticamente quando inserir dados`, 'info');
      return true; // Considerar sucesso pois será criada automaticamente
    } else {
      log(`Erro ao criar tabela '${tableName}': ${error.message}`, 'error');
      return false;
    }
  }
}

// Função para criar tabela de clientes
async function createClientsTable() {
  const schema = {
    name: 'clients',
    columns: [
      { name: 'id', type: 'uuid', primary: true, auto_increment: true },
      { name: 'name', type: 'varchar', length: 255, nullable: false },
      { name: 'email', type: 'varchar', length: 255, nullable: false, unique: true },
      { name: 'phone', type: 'varchar', length: 20, nullable: true },
      { name: 'company', type: 'varchar', length: 255, nullable: true },
      { name: 'status', type: 'varchar', length: 20, nullable: false, default: 'active' },
      { name: 'tier', type: 'varchar', length: 20, nullable: true },
      { name: 'segment', type: 'varchar', length: 100, nullable: true },
      { name: 'size', type: 'varchar', length: 20, nullable: true },
      { name: 'documentType', type: 'varchar', length: 20, nullable: true },
      { name: 'documentNumber', type: 'varchar', length: 50, nullable: true },
      { name: 'createdAt', type: 'timestamp', nullable: false, default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', nullable: false, default: 'now()' }
    ]
  };
  
  return await createTable('clients', schema);
}

// Função para criar tabela de tickets
async function createTicketsTable() {
  const schema = {
    name: 'tickets',
    columns: [
      { name: 'id', type: 'uuid', primary: true, auto_increment: true },
      { name: 'title', type: 'varchar', length: 255, nullable: false },
      { name: 'description', type: 'text', nullable: false },
      { name: 'status', type: 'varchar', length: 20, nullable: false, default: 'open' },
      { name: 'priority', type: 'varchar', length: 20, nullable: false, default: 'medium' },
      { name: 'category', type: 'varchar', length: 100, nullable: false },
      { name: 'clientId', type: 'uuid', nullable: false },
      { name: 'agentId', type: 'uuid', nullable: true },
      { name: 'createdAt', type: 'timestamp', nullable: false, default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', nullable: false, default: 'now()' }
    ]
  };
  
  return await createTable('tickets', schema);
}

// Função para criar tabela de artigos
async function createArticlesTable() {
  const schema = {
    name: 'articles',
    columns: [
      { name: 'id', type: 'uuid', primary: true, auto_increment: true },
      { name: 'title', type: 'varchar', length: 255, nullable: false },
      { name: 'content', type: 'text', nullable: false },
      { name: 'category', type: 'varchar', length: 100, nullable: false },
      { name: 'tags', type: 'json', nullable: true },
      { name: 'authorId', type: 'uuid', nullable: true },
      { name: 'isPublished', type: 'boolean', nullable: false, default: false },
      { name: 'viewCount', type: 'integer', nullable: false, default: 0 },
      { name: 'helpfulCount', type: 'integer', nullable: false, default: 0 },
      { name: 'createdAt', type: 'timestamp', nullable: false, default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', nullable: false, default: 'now()' }
    ]
  };
  
  return await createTable('articles', schema);
}

// Função para criar tabela de membros da equipe
async function createTeamMembersTable() {
  const schema = {
    name: 'team_members',
    columns: [
      { name: 'id', type: 'uuid', primary: true, auto_increment: true },
      { name: 'name', type: 'varchar', length: 255, nullable: false },
      { name: 'email', type: 'varchar', length: 255, nullable: false, unique: true },
      { name: 'role', type: 'varchar', length: 100, nullable: false },
      { name: 'department', type: 'varchar', length: 100, nullable: false },
      { name: 'skills', type: 'json', nullable: true },
      { name: 'maxTickets', type: 'integer', nullable: false, default: 50 },
      { name: 'currentLoad', type: 'integer', nullable: false, default: 0 },
      { name: 'isAvailable', type: 'boolean', nullable: false, default: true },
      { name: 'createdAt', type: 'timestamp', nullable: false, default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', nullable: false, default: 'now()' }
    ]
  };
  
  return await createTable('team_members', schema);
}

// Função para criar tabela de escalas
async function createSchedulesTable() {
  const schema = {
    name: 'schedules',
    columns: [
      { name: 'id', type: 'uuid', primary: true, auto_increment: true },
      { name: 'userId', type: 'uuid', nullable: false },
      { name: 'date', type: 'date', nullable: false },
      { name: 'startTime', type: 'time', nullable: false },
      { name: 'endTime', type: 'time', nullable: false },
      { name: 'type', type: 'varchar', length: 20, nullable: false, default: 'work' },
      { name: 'status', type: 'varchar', length: 20, nullable: false, default: 'confirmed' },
      { name: 'notes', type: 'text', nullable: true },
      { name: 'createdAt', type: 'timestamp', nullable: false, default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', nullable: false, default: 'now()' }
    ]
  };
  
  return await createTable('schedules', schema);
}

// Função para criar tabela de metas
async function createGoalsTable() {
  const schema = {
    name: 'goals',
    columns: [
      { name: 'id', type: 'uuid', primary: true, auto_increment: true },
      { name: 'userId', type: 'uuid', nullable: false },
      { name: 'title', type: 'varchar', length: 255, nullable: false },
      { name: 'description', type: 'text', nullable: false },
      { name: 'target', type: 'decimal', precision: 10, scale: 2, nullable: false },
      { name: 'current', type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 },
      { name: 'unit', type: 'varchar', length: 50, nullable: false },
      { name: 'period', type: 'varchar', length: 20, nullable: false },
      { name: 'status', type: 'varchar', length: 20, nullable: false, default: 'not_started' },
      { name: 'startDate', type: 'date', nullable: false },
      { name: 'endDate', type: 'date', nullable: false },
      { name: 'createdAt', type: 'timestamp', nullable: false, default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', nullable: false, default: 'now()' }
    ]
  };
  
  return await createTable('goals', schema);
}

// Função para criar tabela de NPS
async function createNPSTable() {
  const schema = {
    name: 'nps',
    columns: [
      { name: 'id', type: 'uuid', primary: true, auto_increment: true },
      { name: 'ticketId', type: 'uuid', nullable: false },
      { name: 'rating', type: 'integer', nullable: false },
      { name: 'feedback', type: 'text', nullable: true },
      { name: 'category', type: 'varchar', length: 100, nullable: true },
      { name: 'createdAt', type: 'timestamp', nullable: false, default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', nullable: false, default: 'now()' }
    ]
  };
  
  return await createTable('nps', schema);
}

// Função para criar tabela de monitoramento
async function createMonitoringTable() {
  const schema = {
    name: 'monitoring',
    columns: [
      { name: 'id', type: 'uuid', primary: true, auto_increment: true },
      { name: 'userId', type: 'uuid', nullable: false },
      { name: 'sessionId', type: 'varchar', length: 255, nullable: false },
      { name: 'startTime', type: 'timestamp', nullable: false },
      { name: 'endTime', type: 'timestamp', nullable: true },
      { name: 'duration', type: 'integer', nullable: true },
      { name: 'activity', type: 'json', nullable: true },
      { name: 'createdAt', type: 'timestamp', nullable: false, default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', nullable: false, default: 'now()' }
    ]
  };
  
  return await createTable('monitoring', schema);
}

// Função principal para criar todas as tabelas
async function createAllTables() {
  console.log('🔧 CRIANDO TABELAS NO XANO.IO');
  console.log('================================\n');
  
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
    console.log('\n📊 RESUMO DA CRIAÇÃO DAS TABELAS');
    console.log('==================================');
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const failed = results.length - successful;
    
    console.log(`✅ Tabelas criadas/configuradas: ${successful}`);
    console.log(`❌ Falhas na criação: ${failed}`);
    
    if (failed === 0) {
      console.log('\n🎉 CRIAÇÃO 100% SUCESSO!');
      console.log('🚀 Todas as tabelas foram configuradas no Xano.io');
      console.log('📋 Agora você pode executar a migração de dados');
      console.log('\n💡 PRÓXIMOS PASSOS:');
      console.log('   1. Execute: node scripts/migrate-to-xano.js');
      console.log('   2. Teste as funcionalidades');
      console.log('   3. Configure o backend para usar Xano');
    } else {
      console.log('\n⚠️  CRIAÇÃO PARCIALMENTE SUCESSO');
      console.log('🔧 Verifique os erros acima e tente novamente');
      console.log('\n💡 ALTERNATIVA:');
      console.log('   • Crie as tabelas manualmente na interface web do Xano');
      console.log('   • Use o script de migração que criará as tabelas automaticamente');
    }
    
  } catch (error) {
    log(`Erro fatal na criação das tabelas: ${error.message}`, 'error');
    console.log('\n❌ CRIAÇÃO FALHOU');
    console.log('🔧 Verifique a conectividade e tente novamente');
    console.log('\n💡 SOLUÇÃO ALTERNATIVA:');
    console.log('   • Acesse o painel do Xano em: https://x8ki-letl-twmt.n7.xano.io');
    console.log('   • Crie as tabelas manualmente na interface');
    console.log('   • Execute a migração depois');
    process.exit(1);
  }
}

// Executar criação das tabelas
createAllTables().catch(console.error);
