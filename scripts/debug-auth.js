#!/usr/bin/env node

/**
 * Script de diagnóstico para problemas de autenticação
 * Execute com: node scripts/debug-auth.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar dotenv para encontrar o arquivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

console.log('🔍 DIAGNÓSTICO DE AUTENTICAÇÃO - SISTEMA V01\n');

// 1. Verificar variáveis de ambiente
console.log('1️⃣ VERIFICANDO VARIÁVEIS DE AMBIENTE...');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.log('   ❌ VITE_SUPABASE_URL não encontrada');
} else {
  console.log('   ✅ VITE_SUPABASE_URL:', supabaseUrl);
}

if (!supabaseAnonKey) {
  console.log('   ❌ VITE_SUPABASE_ANON_KEY não encontrada');
} else {
  console.log('   ✅ VITE_SUPABASE_ANON_KEY:', supabaseAnonKey.substring(0, 20) + '...');
}

if (!serviceKey) {
  console.log('   ❌ SUPABASE_SERVICE_ROLE_KEY não encontrada');
} else {
  console.log('   ✅ SUPABASE_SERVICE_ROLE_KEY:', serviceKey.substring(0, 20) + '...');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Variáveis de ambiente não configuradas corretamente!');
  console.log('   Crie um arquivo .env.local com as variáveis necessárias.');
  process.exit(1);
}

console.log('');

// 2. Testar conexão com Supabase
console.log('2️⃣ TESTANDO CONEXÃO COM SUPABASE...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) {
      console.log('   ❌ Erro na conexão:', error.message);
      return;
    }
    console.log('   ✅ Conexão estabelecida com sucesso');
    console.log('   📊 Sessão atual:', data.session ? 'Ativa' : 'Nenhuma');
  })
  .catch(error => {
    console.log('   ❌ Falha na conexão:', error.message);
  });

console.log('');

// 3. Verificar se a tabela users existe
console.log('3️⃣ VERIFICANDO TABELA USERS...');
supabase
  .from('users')
  .select('count')
  .limit(1)
  .then(({ data, error, count }) => {
    if (error) {
      console.log('   ❌ Erro ao acessar tabela users:', error.message);
      console.log('   💡 Verifique se as migrações foram executadas');
      return;
    }
    console.log('   ✅ Tabela users acessível');
  })
  .catch(error => {
    console.log('   ❌ Falha ao acessar tabela users:', error.message);
  });

console.log('');

// 4. Testar login com credenciais de teste
console.log('4️⃣ TESTANDO LOGIN COM CREDENCIAIS DE TESTE...');
const testCredentials = [
  { email: 'admin@exemplo.com', password: 'senha123' },
  { email: 'manager@exemplo.com', password: 'senha123' },
  { email: 'agent@exemplo.com', password: 'senha123' }
];

async function testLogin() {
  for (const cred of testCredentials) {
    try {
      console.log(`   🔐 Testando: ${cred.email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword(cred);
      
      if (error) {
        console.log(`      ❌ Erro: ${error.message}`);
        
        if (error.message.includes('Invalid login credentials')) {
          console.log('      💡 Usuário não existe no Supabase Auth');
        } else if (error.message.includes('Email not confirmed')) {
          console.log('      💡 Email não confirmado');
        }
      } else if (data.user) {
        console.log(`      ✅ Login bem-sucedido!`);
        console.log(`         User ID: ${data.user.id}`);
        console.log(`         Email: ${data.user.email}`);
        
        // Verificar se existe na tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (userError || !userData) {
          console.log(`         ⚠️  Usuário não encontrado na tabela users`);
        } else {
          console.log(`         ✅ Usuário encontrado na tabela users`);
          console.log(`            Nome: ${userData.first_name} ${userData.last_name}`);
          console.log(`            Role: ${userData.role}`);
        }
        
        // Fazer logout
        await supabase.auth.signOut();
      }
      
    } catch (error) {
      console.log(`      ❌ Erro inesperado: ${error.message}`);
    }
    
    console.log(''); // Linha em branco
  }
}

testLogin().then(() => {
  console.log('5️⃣ RESUMO DO DIAGNÓSTICO...');
  console.log('   📋 Verifique os resultados acima para identificar o problema.');
  console.log('   💡 Problemas comuns:');
  console.log('      - Usuários não criados no Supabase Auth');
  console.log('      - Tabela users não existe ou não acessível');
  console.log('      - Variáveis de ambiente incorretas');
  console.log('      - Projeto Supabase pausado ou inacessível');
  console.log('\n🔧 Para resolver:');
  console.log('   1. Execute: npm run auth:create-users');
  console.log('   2. Verifique as migrações do banco');
  console.log('   3. Confirme as variáveis de ambiente');
});
