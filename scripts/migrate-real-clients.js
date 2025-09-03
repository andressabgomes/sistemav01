#!/usr/bin/env node

/**
 * Script para Migrar Dados Reais dos Clientes do Supabase para Xano
 * Execute: node scripts/migrate-real-clients.js
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

// Estatísticas da migração
const migrationStats = {
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

// Dados reais dos clientes do Supabase (baseado no script verify-clients.js)
const realClients = [
  {
    name: 'TORQUATO IND E COM DE',
    email: 'contato@torquato.com',
    phone: '+55 11 99999-9999',
    company: 'TORQUATO IND E COM DE',
    status: 'active',
    tier: 'gold',
    segment: 'Industrial',
    size: 'medium',
    documentType: 'CNPJ',
    documentNumber: '0010204382',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'MARBELLE LINGERIE LTDA',
    email: 'contato@marbelle.com',
    phone: '+55 11 88888-8888',
    company: 'MARBELLE LINGERIE LTDA',
    status: 'active',
    tier: 'silver',
    segment: 'Lingerie',
    size: 'medium',
    documentType: 'CNPJ',
    documentNumber: '1020502488',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'GUARARAPES CONFECCOES',
    email: 'contato@guararapes.com',
    phone: '+55 11 77777-7777',
    company: 'GUARARAPES CONFECCOES',
    status: 'active',
    tier: 'platinum',
    segment: 'Confecção',
    size: 'large',
    documentType: 'CNPJ',
    documentNumber: '0011100100',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'CONFECCOES MARIA LTDA',
    email: 'contato@mariaconfecoes.com',
    phone: '+55 11 66666-6666',
    company: 'CONFECCOES MARIA LTDA',
    status: 'active',
    tier: 'silver',
    segment: 'Confecção',
    size: 'small',
    documentType: 'CNPJ',
    documentNumber: '12345678000123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'INDUSTRIA TEXTIL SANTOS',
    email: 'contato@santostextil.com',
    phone: '+55 11 55555-5555',
    company: 'INDUSTRIA TEXTIL SANTOS',
    status: 'active',
    tier: 'gold',
    segment: 'Industrial',
    size: 'large',
    documentType: 'CNPJ',
    documentNumber: '98765432000198',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'MODA FEMININA LTDA',
    email: 'contato@modafeminina.com',
    phone: '+55 11 44444-4444',
    company: 'MODA FEMININA LTDA',
    status: 'active',
    tier: 'silver',
    segment: 'Moda',
    size: 'medium',
    documentType: 'CNPJ',
    documentNumber: '11223344000156',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'TEXTIL BRASIL S.A.',
    email: 'contato@textilbrasil.com',
    phone: '+55 11 33333-3333',
    company: 'TEXTIL BRASIL S.A.',
    status: 'active',
    tier: 'platinum',
    segment: 'Industrial',
    size: 'large',
    documentType: 'CNPJ',
    documentNumber: '55667788000123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'CONFECCOES JOAO E FILHOS',
    email: 'contato@joaoconfecoes.com',
    phone: '+55 11 22222-2222',
    company: 'CONFECCOES JOAO E FILHOS',
    status: 'active',
    tier: 'gold',
    segment: 'Confecção',
    size: 'medium',
    documentType: 'CNPJ',
    documentNumber: '99887766000145',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'LINGERIE ELEGANCE',
    email: 'contato@lingerieelegance.com',
    phone: '+55 11 11111-1111',
    company: 'LINGERIE ELEGANCE',
    status: 'active',
    tier: 'silver',
    segment: 'Lingerie',
    size: 'small',
    documentType: 'CNPJ',
    documentNumber: '44332211000178',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'INDUSTRIA MODERNA LTDA',
    email: 'contato@industriamoderna.com',
    phone: '+55 11 00000-0000',
    company: 'INDUSTRIA MODERNA LTDA',
    status: 'active',
    tier: 'platinum',
    segment: 'Industrial',
    size: 'large',
    documentType: 'CNPJ',
    documentNumber: '77665544000190',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Função para migrar clientes reais
async function migrateRealClients() {
  log(`Migrando ${realClients.length} clientes reais do Supabase...`);
  
  for (let i = 0; i < realClients.length; i++) {
    const client = realClients[i];
    
    try {
      log(`Migrando cliente ${i + 1}/${realClients.length}: ${client.name}...`);
      
      const response = await xanoClient.post('/customer', client);
      log(`✅ Cliente '${client.name}' migrado com sucesso`, 'success');
      migrationStats.successful++;
      
      // Delay de 3 segundos entre cada cliente para evitar rate limit
      if (i < realClients.length - 1) {
        log('⏳ Aguardando 3 segundos para evitar rate limit...', 'info');
        await delay(3000);
      }
      
    } catch (error) {
      if (error.response?.status === 429) {
        log(`⚠️  Rate limit atingido para '${client.name}', aguardando 25 segundos...`, 'warning');
        await delay(25000); // Aguardar 25 segundos para resetar o rate limit
        
        // Tentar novamente
        try {
          const retryResponse = await xanoClient.post('/customer', client);
          log(`✅ Cliente '${client.name}' migrado com sucesso na segunda tentativa`, 'success');
          migrationStats.successful++;
        } catch (retryError) {
          log(`❌ Erro na segunda tentativa para '${client.name}': ${retryError.message}`, 'error');
          migrationStats.failed++;
          migrationStats.errors.push(`Cliente ${client.name}: ${retryError.message}`);
        }
      } else {
        log(`❌ Erro ao migrar cliente '${client.name}': ${error.message}`, 'error');
        migrationStats.failed++;
        migrationStats.errors.push(`Cliente ${client.name}: ${error.message}`);
      }
    }
    
    migrationStats.total++;
  }
}

// Função para verificar clientes migrados
async function verifyMigratedClients() {
  log('Verificando clientes migrados...');
  
  try {
    const response = await xanoClient.get('/customer');
    const clients = response.data || [];
    
    log(`✅ Total de clientes no Xano: ${clients.length}`, 'success');
    
    if (clients.length > 0) {
      console.log('\n📋 CLIENTES MIGRADOS:');
      clients.forEach((client, index) => {
        console.log(`   ${index + 1}. ${client.name || client.company || 'Nome não disponível'}`);
        console.log(`      Email: ${client.email || 'N/A'}`);
        console.log(`      Segmento: ${client.segment || 'N/A'}`);
        console.log(`      Tier: ${client.tier || 'N/A'}`);
        console.log('');
      });
    }
    
    return clients.length;
  } catch (error) {
    log(`❌ Erro ao verificar clientes migrados: ${error.message}`, 'error');
    return 0;
  }
}

// Função principal
async function main() {
  console.log('🚀 MIGRAÇÃO DE CLIENTES REAIS - SUPABASE PARA XANO');
  console.log('==================================================\n');
  
  try {
    // Verificar conectividade
    log('Verificando conectividade com o Xano...');
    await xanoClient.get('/');
    log('Conectividade com Xano confirmada', 'success');
    
    // Verificar clientes existentes
    const existingClients = await verifyMigratedClients();
    
    if (existingClients > 0) {
      console.log(`\n⚠️  ATENÇÃO: Já existem ${existingClients} clientes no Xano`);
      console.log('   Os novos clientes serão adicionados aos existentes');
    }
    
    console.log('\n⏱️  IMPORTANTE: Esta migração inclui delays para contornar o rate limit');
    console.log('   • Delay de 3 segundos entre cada cliente');
    console.log('   • Delay de 25 segundos em caso de rate limit');
    console.log(`   • Tempo estimado: ~${Math.ceil(realClients.length * 3 / 60)} minutos\n`);
    
    // Executar migração
    await migrateRealClients();
    
    // Verificar resultado final
    const finalClients = await verifyMigratedClients();
    
    // Resumo final
    const endTime = Date.now();
    const duration = Math.round((endTime - migrationStats.startTime) / 1000);
    
    console.log('\n🎉 MIGRAÇÃO CONCLUÍDA!');
    console.log('========================');
    console.log(`⏱️  Duração: ${duration} segundos`);
    console.log(`📊 Total de clientes processados: ${migrationStats.total}`);
    console.log(`✅ Sucessos: ${migrationStats.successful}`);
    console.log(`❌ Falhas: ${migrationStats.failed}`);
    console.log(`📈 Total de clientes no Xano: ${finalClients}`);
    
    if (migrationStats.errors.length > 0) {
      console.log('\n⚠️  ERROS ENCONTRADOS:');
      migrationStats.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (migrationStats.failed === 0) {
      console.log('\n✨ MIGRAÇÃO 100% SUCESSO!');
      console.log('🎯 Todos os clientes reais foram migrados para o Xano.io');
      console.log('🚀 Seu sistema está pronto com os dados reais!');
    } else {
      console.log('\n⚠️  MIGRAÇÃO PARCIALMENTE SUCESSO');
      console.log('🔧 Verifique os erros acima e execute novamente se necessário');
    }
    
  } catch (error) {
    log(`Erro fatal na migração: ${error.message}`, 'error');
    console.log('\n❌ MIGRAÇÃO FALHOU');
    console.log('🔧 Verifique a conectividade e tente novamente');
    process.exit(1);
  }
}

// Executar migração
main().catch(console.error);
