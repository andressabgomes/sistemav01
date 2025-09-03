#!/usr/bin/env node

/**
 * Script para Verificar Tabelas Existentes no Xano
 * Execute: node scripts/check-xano-tables.js
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

// Função para verificar tabelas
async function checkTables() {
  console.log('🔍 VERIFICANDO TABELAS EXISTENTES NO XANO');
  console.log('==========================================\n');
  
  // Lista de possíveis nomes de tabelas
  const possibleTables = [
    // Nomes que vimos na imagem
    'customer',
    'ticket', 
    'knowledge_article',
    'team_member',
    'schedule',
    'goal',
    'nps_response',
    'monitoring_session',
    'audit_log',
    'interaction',
    'product',
    'strategic_client',
    'team',
    'team_capacity',
    'ticket_message',
    'ticket_product',
    
    // Nomes alternativos que podem existir
    'clients',
    'tickets',
    'articles',
    'team_members',
    'schedules',
    'goals',
    'nps',
    'monitoring',
    'users',
    'customers'
  ];
  
  const existingTables = [];
  const nonExistingTables = [];
  
  for (const table of possibleTables) {
    try {
      const response = await xanoClient.get(`/${table}?limit=1`);
      log(`Tabela '${table}' - EXISTE (${response.data?.length || 0} registros)`, 'success');
      existingTables.push(table);
    } catch (error) {
      if (error.response?.status === 404) {
        log(`Tabela '${table}' - Não encontrada`, 'warning');
        nonExistingTables.push(table);
      } else {
        log(`Erro ao verificar tabela '${table}': ${error.message}`, 'error');
      }
    }
  }
  
  console.log('\n📊 RESUMO:');
  console.log('==========');
  console.log(`✅ Tabelas existentes: ${existingTables.length}`);
  console.log(`❌ Tabelas não encontradas: ${nonExistingTables.length}`);
  
  if (existingTables.length > 0) {
    console.log('\n✅ TABELAS EXISTENTES:');
    existingTables.forEach(table => console.log(`   • ${table}`));
  }
  
  if (nonExistingTables.length > 0) {
    console.log('\n❌ TABELAS NÃO ENCONTRADAS:');
    nonExistingTables.forEach(table => console.log(`   • ${table}`));
  }
  
  return existingTables;
}

// Função para testar inserção em uma tabela
async function testInsert(tableName) {
  log(`Testando inserção na tabela '${tableName}'...`);
  
  try {
    // Dados de teste simples
    const testData = {
      name: 'Teste de Inserção',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await xanoClient.post(`/${tableName}`, testData);
    log(`✅ Inserção bem-sucedida na tabela '${tableName}'`, 'success');
    
    // Tentar deletar o registro de teste
    if (response.data?.id) {
      try {
        await xanoClient.delete(`/${tableName}/${response.data.id}`);
        log(`✅ Registro de teste removido da tabela '${tableName}'`, 'success');
      } catch (deleteError) {
        log(`⚠️  Não foi possível remover o registro de teste da tabela '${tableName}'`, 'warning');
      }
    }
    
    return true;
  } catch (error) {
    log(`❌ Erro ao inserir na tabela '${tableName}': ${error.message}`, 'error');
    if (error.response?.data) {
      console.log('   Dados do erro:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Função principal
async function main() {
  try {
    // Verificar conectividade
    log('Verificando conectividade com o Xano...');
    await xanoClient.get('/');
    log('Conectividade com Xano confirmada', 'success');
    
    // Verificar tabelas
    const existingTables = await checkTables();
    
    if (existingTables.length === 0) {
      console.log('\n❌ NENHUMA TABELA ENCONTRADA!');
      console.log('🔧 SOLUÇÃO:');
      console.log('   1. Acesse o painel do Xano');
      console.log('   2. Crie as tabelas necessárias');
      console.log('   3. Execute este script novamente');
      return;
    }
    
    // Testar inserção nas tabelas principais
    console.log('\n🧪 TESTANDO INSERÇÃO NAS TABELAS:');
    console.log('==================================');
    
    const mainTables = ['customer', 'ticket', 'knowledge_article', 'team_member', 'schedule', 'goal'];
    
    for (const table of mainTables) {
      if (existingTables.includes(table)) {
        await testInsert(table);
      } else {
        log(`Tabela '${table}' não existe, pulando teste de inserção`, 'warning');
      }
    }
    
    console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA!');
    console.log('==========================');
    console.log(`📊 Total de tabelas encontradas: ${existingTables.length}`);
    console.log('✅ Sistema pronto para migração de dados');
    
  } catch (error) {
    log(`Erro fatal: ${error.message}`, 'error');
    console.log('\n❌ VERIFICAÇÃO FALHOU');
    console.log('🔧 Verifique a conectividade e tente novamente');
    process.exit(1);
  }
}

// Executar verificação
main().catch(console.error);
