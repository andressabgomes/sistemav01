#!/usr/bin/env node

/**
 * Script para criar um usuário de teste no Supabase
 * Execute: node scripts/create-supabase-user.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obter o diretório atual do módulo ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente do arquivo .env
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#')) {
        let value = valueParts.join('=').trim();
        // Remover aspas se existirem
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        env[key.trim()] = value;
      }
    });
    
    return env;
  } catch (error) {
    console.log('⚠️  Arquivo .env não encontrado');
    return {};
  }
}

const env = loadEnv();

// Configurações do Supabase
const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://vtzukmbnbmzzlqcdzjto.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0enVrbWJuYm16emxxY2R6anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTA2MzYsImV4cCI6MjA3MTEyNjYzNn0.fAyCAIV2daSk578xlrRVwtoMgj6rgQoQkLBG1ptguUg';

console.log('🚀 CRIANDO USUÁRIO DE TESTE NO SUPABASE');
console.log('==========================================\n');

console.log(`📍 URL: ${SUPABASE_URL}`);
console.log(`🔑 Chave: ${SUPABASE_ANON_KEY.substring(0, 20)}...\n`);

// Cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createTestUser() {
  try {
    console.log('1️⃣ Testando conectividade com Supabase...');
    
    // Testar conectividade
    const { data: testData, error: testError } = await supabase
      .from('clients')
      .select('count')
      .limit(1);
    
    if (testError && testError.code !== 'PGRST116') {
      console.log('❌ Erro de conectividade:', testError.message);
      return;
    }
    
    console.log('✅ Conectividade com Supabase OK\n');
    
    console.log('2️⃣ Criando usuário de teste...');
    
    // Dados do usuário de teste
    const testUser = {
      email: 'admin@gmail.com',
      password: 'admin123',
      name: 'Administrador',
      role: 'ADMIN',
      department: 'Administração',
      status: 'active'
    };
    
    // Criar usuário via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          name: testUser.name,
          role: testUser.role,
          department: testUser.department,
          status: testUser.status
        }
      }
    });
    
    if (authError) {
      console.log('❌ Erro ao criar usuário:', authError.message);
      
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Usuário já existe, tentando fazer login...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testUser.email,
          password: testUser.password
        });
        
        if (signInError) {
          console.log('❌ Erro no login:', signInError.message);
          return;
        }
        
        console.log('✅ Login realizado com sucesso!');
        console.log(`   ID: ${signInData.user.id}`);
        console.log(`   Email: ${signInData.user.email}\n`);
        
        console.log('🔑 CREDENCIAIS DE TESTE:');
        console.log(`   Email: ${testUser.email}`);
        console.log(`   Senha: ${testUser.password}\n`);
        
        console.log('🎯 Agora você pode fazer login com essas credenciais!');
        return;
      }
      
      return;
    }
    
    if (authData.user) {
      console.log('✅ Usuário criado com sucesso!');
      console.log(`   ID: ${authData.user.id}`);
      console.log(`   Email: ${authData.user.email}\n`);
      
      // Criar registro na tabela users se existir
      try {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            name: testUser.name,
            role: testUser.role,
            department: testUser.department,
            status: testUser.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (userError) {
          console.log('⚠️  Tabela users não encontrada, usuário criado apenas no auth');
        } else {
          console.log('✅ Registro criado na tabela users');
        }
      } catch (error) {
        console.log('⚠️  Tabela users não encontrada, usuário criado apenas no auth');
      }
      
      console.log('🔑 CREDENCIAIS DE TESTE:');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Senha: ${testUser.password}\n`);
      
      console.log('🎯 Agora você pode fazer login com essas credenciais!');
      
      // Fazer logout para não deixar sessão ativa
      await supabase.auth.signOut();
      console.log('🔒 Sessão encerrada');
      
    } else {
      console.log('❌ Erro: Usuário não foi criado');
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n🔧 PROBLEMA IDENTIFICADO:');
      console.log('   Erro de conectividade com o Supabase.');
      console.log('   Verifique se as credenciais estão corretas.');
    }
  }
}

// Executar o script
createTestUser();
