// Script para inserir detalhes dos clientes (endereços, contatos, pessoas)
// Execute com: node scripts/insert-client-details.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vtzukmbnbmzzlqcdzjto.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0enVrbWJuYm16emxxY2R6anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTA2MzYsImV4cCI6MjA3MTEyNjYzNn0.fAyCAIV2daSk578xlrRVwtoMgj6rgQoQkLBG1ptguUg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function insertClientDetails() {
  console.log('🚀 Iniciando inserção dos detalhes dos clientes...');
  
  try {
    // Buscar clientes estratégicos
    const { data: strategicClients, error: strategicError } = await supabase
      .from('clients')
      .select('id, code, trade_name, company_name')
      .eq('client_type', 'strategic');

    if (strategicError) {
      throw strategicError;
    }

    console.log(`📊 ${strategicClients.length} clientes estratégicos encontrados`);

    // Inserir endereços (sem conflito)
    for (const client of strategicClients) {
      const { error: addressError } = await supabase
        .from('client_addresses')
        .insert({
          client_id: client.id,
          address_type: 'main',
          street: 'Rua das Empresas',
          number: '123',
          neighborhood: 'Centro',
          city: 'Fortaleza',
          state: 'CE',
          zip_code: '60000-000',
          country: 'Brasil',
          is_primary: true
        });

      if (addressError && !addressError.message.includes('duplicate key')) {
        console.warn(`⚠️ Erro ao inserir endereço para ${client.code}:`, addressError.message);
      }
    }
    console.log(`📍 Endereços processados para ${strategicClients.length} clientes`);

    // Inserir contatos (sem conflito)
    for (const client of strategicClients) {
      const { error: contactError } = await supabase
        .from('client_contacts')
        .insert({
          client_id: client.id,
          contact_type: 'email',
          contact_value: `contato@${client.trade_name?.toLowerCase().replace(/\s+/g, '')}.com.br`,
          description: 'Email principal',
          is_primary: true,
          is_whatsapp: false
        });

      if (contactError && !contactError.message.includes('duplicate key')) {
        console.warn(`⚠️ Erro ao inserir contato para ${client.code}:`, contactError.message);
      }
    }
    console.log(`📞 Contatos processados para ${strategicClients.length} clientes`);

    // Inserir pessoas de contato (sem conflito)
    for (const client of strategicClients) {
      const { error: personError } = await supabase
        .from('client_persons')
        .insert({
          client_id: client.id,
          name: 'Gerente de TI',
          role: 'Gerente de Tecnologia da Informação',
          email: `gerente.ti@${client.trade_name?.toLowerCase().replace(/\s+/g, '')}.com.br`,
          is_primary: true,
          is_decision_maker: true
        });

      if (personError && !personError.message.includes('duplicate key')) {
        console.warn(`⚠️ Erro ao inserir pessoa de contato para ${client.code}:`, personError.message);
      }
    }
    console.log(`👤 Pessoas de contato processadas para ${strategicClients.length} clientes`);

    // Criar alguns tickets de exemplo para clientes estratégicos
    const sampleTickets = [];
    for (let i = 0; i < Math.min(10, strategicClients.length); i++) {
      const client = strategicClients[i];
      sampleTickets.push({
        client_id: client.id,
        title: `Suporte técnico - ${client.company_name}`,
        description: 'Solicitação de suporte técnico para equipamentos',
        status: 'open',
        type: 'online',
        priority: 'medium',
        assigned_to: 'Equipe StarPrint'
      });
    }

    const { error: ticketsError } = await supabase
      .from('tickets')
      .insert(sampleTickets);

    if (ticketsError) {
      console.warn('⚠️ Erro ao inserir tickets de exemplo:', ticketsError.message);
    } else {
      console.log(`🎫 ${sampleTickets.length} tickets de exemplo criados`);
    }

    // Criar histórico de serviços de exemplo
    const sampleServices = [];
    for (let i = 0; i < Math.min(5, strategicClients.length); i++) {
      const client = strategicClients[i];
      sampleServices.push({
        client_id: client.id,
        service_type: 'support',
        service_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        responsible_technician: 'Ana Silva',
        description: 'Manutenção preventiva realizada com sucesso',
        status: 'completed',
        satisfaction_rating: Math.floor(Math.random() * 3) + 3, // 3-5
        cost: Math.floor(Math.random() * 500) + 100
      });
    }

    const { error: servicesError } = await supabase
      .from('service_history')
      .insert(sampleServices);

    if (servicesError) {
      console.warn('⚠️ Erro ao inserir histórico de serviços:', servicesError.message);
    } else {
      console.log(`🔧 ${sampleServices.length} registros de histórico de serviços criados`);
    }

    console.log('🎉 Processo de detalhes concluído com sucesso!');
    console.log(`📈 Resumo:`);
    console.log(`   - Clientes estratégicos: ${strategicClients.length}`);
    console.log(`   - Endereços criados: ${strategicClients.length}`);
    console.log(`   - Contatos criados: ${strategicClients.length}`);
    console.log(`   - Pessoas de contato: ${strategicClients.length}`);
    console.log(`   - Tickets de exemplo: ${sampleTickets.length}`);
    console.log(`   - Histórico de serviços: ${sampleServices.length}`);

  } catch (error) {
    console.error('❌ Erro durante a inserção:', error);
    process.exit(1);
  }
}

// Executar o script
insertClientDetails();
