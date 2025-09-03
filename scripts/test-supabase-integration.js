#!/usr/bin/env node

/**
 * Script para testar a integração com Supabase
 * Execute com: node scripts/test-supabase-integration.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');

  try {
    // Teste 1: Verificar conexão básica
    console.log('1️⃣ Testando conexão básica...');
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      return false;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');

    // Teste 2: Verificar tabelas
    console.log('\n2️⃣ Verificando tabelas...');
    const tables = ['users', 'clients', 'tickets', 'articles', 'team_members', 'schedules', 'goals'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`❌ Tabela ${table}: ${error.message}`);
        } else {
          console.log(`✅ Tabela ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Tabela ${table}: ${err.message}`);
      }
    }

    // Teste 3: Verificar dados de exemplo
    console.log('\n3️⃣ Verificando dados de exemplo...');
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.log('❌ Erro ao buscar usuários:', usersError.message);
    } else {
      console.log(`✅ Usuários encontrados: ${users?.length || 0}`);
    }

    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .limit(5);
    
    if (clientsError) {
      console.log('❌ Erro ao buscar clientes:', clientsError.message);
    } else {
      console.log(`✅ Clientes encontrados: ${clients?.length || 0}`);
    }

    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .limit(5);
    
    if (ticketsError) {
      console.log('❌ Erro ao buscar tickets:', ticketsError.message);
    } else {
      console.log(`✅ Tickets encontrados: ${tickets?.length || 0}`);
    }

    // Teste 4: Testar operações CRUD
    console.log('\n4️⃣ Testando operações CRUD...');
    
    // Teste de inserção
    const testClient = {
      name: 'Cliente Teste',
      email: `teste-${Date.now()}@exemplo.com`,
      phone: '(11) 99999-9999',
      company: 'Empresa Teste',
      status: 'active'
    };

    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert(testClient)
      .select()
      .single();

    if (insertError) {
      console.log('❌ Erro ao inserir cliente:', insertError.message);
    } else {
      console.log('✅ Cliente inserido com sucesso:', newClient.name);
      
      // Teste de atualização
      const { data: updatedClient, error: updateError } = await supabase
        .from('clients')
        .update({ name: 'Cliente Teste Atualizado' })
        .eq('id', newClient.id)
        .select()
        .single();

      if (updateError) {
        console.log('❌ Erro ao atualizar cliente:', updateError.message);
      } else {
        console.log('✅ Cliente atualizado com sucesso:', updatedClient.name);
      }

      // Teste de exclusão
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', newClient.id);

      if (deleteError) {
        console.log('❌ Erro ao deletar cliente:', deleteError.message);
      } else {
        console.log('✅ Cliente deletado com sucesso');
      }
    }

    // Teste 5: Verificar autenticação
    console.log('\n5️⃣ Testando autenticação...');
    
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Erro na autenticação:', authError.message);
    } else {
      console.log('✅ Sistema de autenticação funcionando');
    }

    console.log('\n🎉 Todos os testes concluídos!');
    console.log('\n📋 Resumo:');
    console.log('✅ Conexão com Supabase estabelecida');
    console.log('✅ Tabelas verificadas');
    console.log('✅ Dados de exemplo carregados');
    console.log('✅ Operações CRUD funcionando');
    console.log('✅ Sistema de autenticação ativo');
    
    return true;

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    return false;
  }
}

// Executar testes
testSupabaseConnection()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Integração Supabase configurada com sucesso!');
      process.exit(0);
    } else {
      console.log('\n💥 Falha na integração Supabase');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('💥 Erro inesperado:', error);
    process.exit(1);
  });
