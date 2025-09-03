#!/usr/bin/env node

/**
 * Script para Limpar o Sistema Xano
 * Mantém apenas a base de clientes
 * Execute: node scripts/clean-system.js
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

// Estatísticas da limpeza
const cleanStats = {
  total: 0,
  successful: 0,
  failed: 0,
  errors: [],
  startTime: Date.now(),
};

// Função para log
function log(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

// Função para delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para limpar uma tabela
async function cleanTable(tableName, keepTable = false) {
  try {
    log(`Limpando tabela '${tableName}'...`);
    
    // Buscar todos os registros
    const response = await xanoClient.get(`/${tableName}`);
    const records = response.data || [];
    
    if (records.length === 0) {
      log(`Tabela '${tableName}' já está vazia`, 'success');
      return true;
    }
    
    log(`Encontrados ${records.length} registros para remover`);
    
    let deletedCount = 0;
    
    // Deletar registros um por um para evitar rate limit
    for (const record of records) {
      try {
        if (record.id) {
          await xanoClient.delete(`/${tableName}/${record.id}`);
          deletedCount++;
          
          // Delay de 2 segundos entre cada deleção
          if (deletedCount < records.length) {
            await delay(2000);
          }
        }
      } catch (deleteError) {
        if (deleteError.response?.status === 429) {
          log(`Rate limit atingido, aguardando 25 segundos...`, 'warning');
          await delay(25000);
          
          // Tentar novamente
          try {
            await xanoClient.delete(`/${tableName}/${record.id}`);
            deletedCount++;
          } catch (retryError) {
            log(`Erro na segunda tentativa para deletar registro ${record.id}: ${retryError.message}`, 'error');
            cleanStats.failed++;
            cleanStats.errors.push(`Tabela ${tableName} - Registro ${record.id}: ${retryError.message}`);
          }
        } else {
          log(`Erro ao deletar registro ${record.id}: ${deleteError.message}`, 'error');
          cleanStats.failed++;
          cleanStats.errors.push(`Tabela ${tableName} - Registro ${record.id}: ${deleteError.message}`);
        }
      }
    }
    
    log(`✅ Tabela '${tableName}' limpa: ${deletedCount}/${records.length} registros removidos`, 'success');
    cleanStats.successful++;
    
    return true;
    
  } catch (error) {
    if (error.response?.status === 429) {
      log(`Rate limit atingido para tabela '${tableName}', aguardando 25 segundos...`, 'warning');
      await delay(25000);
      
      // Tentar novamente
      try {
        return await cleanTable(tableName, keepTable);
      } catch (retryError) {
        log(`Erro na segunda tentativa para tabela '${tableName}': ${retryError.message}`, 'error');
        cleanStats.failed++;
        cleanStats.errors.push(`Tabela ${tableName}: ${retryError.message}`);
        return false;
      }
    } else {
      log(`❌ Erro ao limpar tabela '${tableName}': ${error.message}`, 'error');
      cleanStats.failed++;
      cleanStats.errors.push(`Tabela ${tableName}: ${error.message}`);
      return false;
    }
  }
}

// Função para verificar status das tabelas
async function checkTableStatus() {
  log('Verificando status das tabelas após limpeza...');
  
  const tables = [
    'customer',           // Manter (clientes)
    'ticket',            // Limpar
    'knowledge_article', // Limpar
    'team_member',       // Limpar
    'schedule',          // Limpar
    'goal',              // Limpar
    'nps_response',      // Limpar
    'monitoring_session', // Limpar
    'audit_log',         // Limpar
    'interaction'        // Limpar
  ];
  
  const tableStatus = {};
  
  for (const table of tables) {
    try {
      const response = await xanoClient.get(`/${table}?limit=1`);
      const count = response.data?.length || 0;
      tableStatus[table] = count;
      
      if (table === 'customer') {
        log(`Tabela '${table}' (CLIENTES): ${count} registros mantidos`, 'success');
      } else {
        log(`Tabela '${table}': ${count} registros`, count === 0 ? 'success' : 'warning');
      }
      
      // Delay para evitar rate limit
      await delay(2000);
      
    } catch (error) {
      log(`Erro ao verificar tabela '${table}': ${error.message}`, 'error');
      tableStatus[table] = 'error';
    }
  }
  
  return tableStatus;
}

// Função principal
async function cleanSystem() {
  console.log('🧹 LIMPANDO SISTEMA XANO - MANTENDO APENAS CLIENTES');
  console.log('====================================================\n');
  
  try {
    // Verificar conectividade
    log('Verificando conectividade com o Xano...');
    await xanoClient.get('/');
    log('Conectividade com Xano confirmada', 'success');
    
    // Verificar status inicial
    console.log('\n📊 STATUS INICIAL DAS TABELAS:');
    console.log('================================');
    await checkTableStatus();
    
    console.log('\n🧹 INICIANDO LIMPEZA DO SISTEMA...');
    console.log('==================================');
    console.log('⚠️  ATENÇÃO: Esta operação irá remover TODOS os dados exceto clientes');
    console.log('   • Clientes serão mantidos');
    console.log('   • Tickets serão removidos');
    console.log('   • Artigos serão removidos');
    console.log('   • Equipe será removida');
    console.log('   • Escalas serão removidas');
    console.log('   • Metas serão removidas');
    console.log('   • Outros dados serão removidos');
    
    // Tabelas para limpar (exceto customer)
    const tablesToClean = [
      'ticket',
      'knowledge_article', 
      'team_member',
      'schedule',
      'goal',
      'nps_response',
      'monitoring_session',
      'audit_log',
      'interaction'
    ];
    
    // Limpar cada tabela
    for (const table of tablesToClean) {
      await cleanTable(table);
      cleanStats.total++;
      
      // Delay extra entre tabelas
      if (table !== tablesToClean[tablesToClean.length - 1]) {
        log('⏳ Aguardando 5 segundos entre tabelas...', 'info');
        await delay(5000);
      }
    }
    
    // Verificar status final
    console.log('\n📊 STATUS FINAL DAS TABELAS:');
    console.log('==============================');
    const finalStatus = await checkTableStatus();
    
    // Resumo final
    const endTime = Date.now();
    const duration = Math.round((endTime - cleanStats.startTime) / 1000);
    
    console.log('\n🎉 LIMPEZA CONCLUÍDA!');
    console.log('======================');
    console.log(`⏱️  Duração: ${duration} segundos`);
    console.log(`📊 Total de tabelas processadas: ${cleanStats.total}`);
    console.log(`✅ Sucessos: ${cleanStats.successful}`);
    console.log(`❌ Falhas: ${cleanStats.failed}`);
    
    if (cleanStats.errors.length > 0) {
      console.log('\n⚠️  ERROS ENCONTRADOS:');
      cleanStats.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    // Resumo do status final
    console.log('\n📋 RESUMO FINAL:');
    console.log('=================');
    Object.entries(finalStatus).forEach(([table, count]) => {
      if (table === 'customer') {
        console.log(`   • ${table}: ${count} registros (MANTIDOS)`);
      } else if (count === 0) {
        console.log(`   • ${table}: ${count} registros (LIMPADO)`);
      } else if (count === 'error') {
        console.log(`   • ${table}: ERRO na verificação`);
      } else {
        console.log(`   • ${table}: ${count} registros (NÃO LIMPO)`);
      }
    });
    
    if (cleanStats.failed === 0) {
      console.log('\n✨ SISTEMA LIMPO COM SUCESSO!');
      console.log('🎯 Apenas a base de clientes foi mantida');
      console.log('🚀 Sistema pronto para uso do zero!');
    } else {
      console.log('\n⚠️  LIMPEZA PARCIALMENTE SUCESSO');
      console.log('🔧 Verifique os erros acima e execute novamente se necessário');
    }
    
  } catch (error) {
    log(`Erro fatal na limpeza: ${error.message}`, 'error');
    console.log('\n❌ LIMPEZA FALHOU');
    console.log('🔧 Verifique a conectividade e tente novamente');
    process.exit(1);
  }
}

// Executar limpeza
cleanSystem().catch(console.error);
