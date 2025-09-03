#!/usr/bin/env node

/**
 * Script para criar um usuário de teste no Xano
 * Execute: node scripts/create-test-user.js
 */

import axios from 'axios';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obter o diretório atual do módulo ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente do arquivo .env.local
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

// Configurações do Xano
const XANO_BASE_URL = env.VITE_XANO_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:hzPTkRyB';
const XANO_API_KEY = 'hzPTkRyB';

console.log('🚀 CRIANDO USUÁRIO DE TESTE NO XANO');
console.log('=====================================\n');

console.log(`📍 URL da API: ${XANO_BASE_URL}`);
console.log(`🔑 API Key: ${XANO_API_KEY}\n`);

// Cliente HTTP para testes
const xanoClient = axios.create({
  baseURL: XANO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${XANO_API_KEY}`,
  },
  timeout: 10000,
});

async function createTestUser() {
  try {
    console.log('1️⃣ Testando conectividade...');
    const testResponse = await xanoClient.get('/');
    console.log('✅ Conectividade OK\n');
    
    console.log('2️⃣ Criando usuário de teste...');
    
    // Dados do usuário de teste
    const testUser = {
      email: 'admin@starpint.com',
      password: 'admin123',
      name: 'Administrador',
      role: 'ADMIN',
      department: 'Administração',
      status: 'active'
    };
    
    // Tentar criar usuário via endpoint de registro
    try {
      const response = await xanoClient.post('/auth/register', testUser);
      console.log('✅ Usuário criado com sucesso!');
      console.log(`   ID: ${response.data.id}`);
      console.log(`   Email: ${response.data.email}`);
      console.log(`   Nome: ${response.data.name}`);
      console.log(`   Role: ${response.data.role}\n`);
      
      console.log('🔑 CREDENCIAIS DE TESTE:');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Senha: ${testUser.password}\n`);
      
      console.log('🎯 Agora você pode fazer login com essas credenciais!');
      
    } catch (registerError) {
      console.log('⚠️  Endpoint de registro não encontrado, tentando criar via tabela direta...');
      
      // Tentar inserir diretamente na tabela users
      try {
        const userResponse = await xanoClient.post('/users', {
          ...testUser,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        console.log('✅ Usuário criado via tabela direta!');
        console.log(`   ID: ${userResponse.data.id}`);
        console.log(`   Email: ${userResponse.data.email}\n`);
        
        console.log('🔑 CREDENCIAIS DE TESTE:');
        console.log(`   Email: ${testUser.email}`);
        console.log(`   Senha: ${testUser.password}\n`);
        
        console.log('🎯 Agora você pode fazer login com essas credenciais!');
        
      } catch (tableError) {
        console.log('❌ Erro ao criar usuário via tabela:');
        console.log(`   Status: ${tableError.response?.status}`);
        console.log(`   Erro: ${tableError.response?.data?.message || tableError.message}\n`);
        
        console.log('🔧 SOLUÇÃO MANUAL:');
        console.log('1. Acesse o painel do Xano: https://x8ki-letl-twmt.n7.xano.io');
        console.log('2. Vá para "Database" > "Tables"');
        console.log('3. Crie uma tabela chamada "users" com os campos:');
        console.log('   - id (UUID, Primary Key)');
        console.log('   - email (String, Unique)');
        console.log('   - password (String)');
        console.log('   - name (String)');
        console.log('   - role (String)');
        console.log('   - department (String)');
        console.log('   - status (String)');
        console.log('   - created_at (Timestamp)');
        console.log('   - updated_at (Timestamp)');
        console.log('4. Execute este script novamente');
      }
    }
    
  } catch (error) {
    console.log('❌ Erro geral:');
    console.log(`   Status: ${error.response?.status}`);
    console.log(`   Erro: ${error.response?.data?.message || error.message}`);
    
    if (error.response?.status === 404) {
      console.log('\n🔧 PROBLEMA IDENTIFICADO:');
      console.log('   As tabelas não foram criadas no Xano.');
      console.log('   Você precisa configurar manualmente as tabelas.');
      console.log('\n📋 PASSO A PASSO:');
      console.log('1. Acesse: https://x8ki-letl-twmt.n7.xano.io');
      console.log('2. Vá para "Database" > "Tables"');
      console.log('3. Crie as tabelas necessárias (clients, users, tickets, etc.)');
      console.log('4. Execute este script novamente');
    }
  }
}

// Executar o script
createTestUser();
