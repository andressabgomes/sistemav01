#!/usr/bin/env node

/**
 * Script para criar usuários de teste no Supabase Auth
 * Execute com: node scripts/create-test-users.js
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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Chave de serviço para criar usuários

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas:');
  console.error('   VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  console.error('\n📝 Adicione essas variáveis ao seu arquivo .env');
  process.exit(1);
}

// Cliente com chave de serviço para operações administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  {
    email: 'admin@exemplo.com',
    password: 'senha123',
    user_metadata: {
      first_name: 'Admin',
      last_name: 'Sistema',
      role: 'ADMIN'
    }
  },
  {
    email: 'manager@exemplo.com',
    password: 'senha123',
    user_metadata: {
      first_name: 'Manager',
      last_name: 'Sistema',
      role: 'MANAGER'
    }
  },
  {
    email: 'agent@exemplo.com',
    password: 'senha123',
    user_metadata: {
      first_name: 'Agent',
      last_name: 'Sistema',
      role: 'AGENT'
    }
  },
  {
    email: 'user@exemplo.com',
    password: 'senha123',
    user_metadata: {
      first_name: 'User',
      last_name: 'Sistema',
      role: 'USER'
    }
  },
  {
    email: 'support@exemplo.com',
    password: 'senha123',
    user_metadata: {
      first_name: 'Support',
      last_name: 'Sistema',
      role: 'SUPPORT'
    }
  }
];

async function createTestUsers() {
  console.log('🚀 Criando usuários de teste no Supabase Auth...\n');

  for (const userData of testUsers) {
    try {
      console.log(`📝 Criando usuário: ${userData.email}`);
      
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: userData.user_metadata,
        email_confirm: true // Confirmar email automaticamente
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`   ⚠️  Usuário ${userData.email} já existe, pulando...`);
          continue;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Usuário não foi criado');
      }

      // Criar registro na tabela users
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          first_name: userData.user_metadata.first_name,
          last_name: userData.user_metadata.last_name,
          role: userData.user_metadata.role,
          status: 'active'
        })
        .select()
        .single();

      if (userError) {
        console.log(`   ⚠️  Erro ao criar registro na tabela users: ${userError.message}`);
        console.log(`   ✅ Usuário criado no Auth, mas não na tabela users`);
      } else {
        console.log(`   ✅ Usuário criado com sucesso!`);
        console.log(`      ID: ${userRecord.id}`);
        console.log(`      Role: ${userRecord.role}`);
      }

    } catch (error) {
      console.error(`   ❌ Erro ao criar usuário ${userData.email}:`, error.message);
    }
    
    console.log(''); // Linha em branco
  }

  console.log('🎉 Processo de criação de usuários concluído!');
  console.log('\n📋 Usuários de teste criados:');
  testUsers.forEach(user => {
    console.log(`   • ${user.email} / ${user.password} (${user.user_metadata.role})`);
  });
  
  console.log('\n🔐 Agora você pode fazer login com essas credenciais!');
}

// Executar o script
createTestUsers().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
