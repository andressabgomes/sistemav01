#!/usr/bin/env node

/**
 * Script para testar a autenticação do sistema
 * Execute com: node scripts/test-authentication.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar dotenv para encontrar o arquivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas:');
  console.error('   VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('   VITE_SUPABASE_ANON_KEY:', !!supabaseAnonKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testCredentials = [
  { email: 'admin@exemplo.com', password: 'senha123', role: 'ADMIN' },
  { email: 'manager@exemplo.com', password: 'senha123', role: 'MANAGER' },
  { email: 'agent@exemplo.com', password: 'senha123', role: 'AGENT' },
  { email: 'user@exemplo.com', password: 'senha123', role: 'USER' },
  { email: 'support@exemplo.com', password: 'senha123', role: 'SUPPORT' }
];

async function testAuthentication() {
  console.log('🧪 Testando autenticação do sistema...\n');

  for (const credentials of testCredentials) {
    try {
      console.log(`🔐 Testando login: ${credentials.email}`);
      
      // Testar login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (authError) {
        console.log(`   ❌ Erro no login: ${authError.message}`);
        continue;
      }

      if (!authData.user || !authData.session) {
        console.log(`   ❌ Login falhou: dados de sessão não encontrados`);
        continue;
      }

      console.log(`   ✅ Login bem-sucedido!`);
      console.log(`      User ID: ${authData.user.id}`);
      console.log(`      Email: ${authData.user.email}`);

      // Testar busca de dados do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        console.log(`   ⚠️  Erro ao buscar dados do usuário: ${userError.message}`);
      } else if (!userData) {
        console.log(`   ⚠️  Usuário não encontrado na tabela users`);
      } else {
        console.log(`   ✅ Dados do usuário encontrados:`);
        console.log(`      Nome: ${userData.first_name} ${userData.last_name}`);
        console.log(`      Role: ${userData.role}`);
        console.log(`      Status: ${userData.status}`);
      }

      // Testar logout
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) {
        console.log(`   ⚠️  Erro no logout: ${logoutError.message}`);
      } else {
        console.log(`   ✅ Logout bem-sucedido!`);
      }

    } catch (error) {
      console.error(`   ❌ Erro inesperado: ${error.message}`);
    }
    
    console.log(''); // Linha em branco
  }

  console.log('🎉 Teste de autenticação concluído!');
}

// Executar o teste
testAuthentication().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
