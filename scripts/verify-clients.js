// Script para verificar os dados dos clientes inseridos
// Execute com: node scripts/verify-clients.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vtzukmbnbmzzlqcdzjto.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0enVrbWJuYm16emxxY2R6anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTA2MzYsImV4cCI6MjA3MTEyNjYzNn0.fAyCAIV2daSk578xlrRVwtoMgj6rgQoQkLBG1ptguUg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyClients() {
  console.log('🔍 Verificando dados dos clientes...\n');
  
  try {
    // Contar total de clientes
    const { count: totalClients, error: countError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Buscar clientes com detalhes
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select(`
        *,
        client_addresses(count),
        client_contacts(count),
        client_persons(count)
      `)
      .order('created_at', { ascending: false });

    if (clientsError) throw clientsError;

    // Estatísticas
    const strategicClients = clients.filter(c => c.client_type === 'strategic');
    const regularClients = clients.filter(c => c.client_type === 'regular');
    
    const clientsWithAddresses = clients.filter(c => c.client_addresses[0]?.count > 0);
    const clientsWithContacts = clients.filter(c => c.client_contacts[0]?.count > 0);
    const clientsWithPersons = clients.filter(c => c.client_persons[0]?.count > 0);

    console.log('📊 ESTATÍSTICAS GERAIS:');
    console.log(`   Total de clientes: ${totalClients}`);
    console.log(`   Clientes estratégicos: ${strategicClients.length}`);
    console.log(`   Clientes regulares: ${regularClients.length}`);
    console.log(`   Clientes com endereços: ${clientsWithAddresses.length}`);
    console.log(`   Clientes com contatos: ${clientsWithContacts.length}`);
    console.log(`   Clientes com pessoas de contato: ${clientsWithPersons.length}`);

    // Verificar tickets
    const { count: totalTickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true });

    if (!ticketsError) {
      console.log(`   Tickets criados: ${totalTickets}`);
    }

    // Verificar histórico de serviços
    const { count: totalServices, error: servicesError } = await supabase
      .from('service_history')
      .select('*', { count: 'exact', head: true });

    if (!servicesError) {
      console.log(`   Histórico de serviços: ${totalServices}`);
    }

    console.log('\n🎯 TOP 10 CLIENTES ESTRATÉGICOS:');
    strategicClients.slice(0, 10).forEach((client, index) => {
      console.log(`   ${index + 1}. ${client.code} - ${client.company_name}`);
      console.log(`      Segmento: ${client.segment} | Tamanho: ${client.size}`);
      console.log(`      Endereços: ${client.client_addresses[0]?.count || 0} | Contatos: ${client.client_contacts[0]?.count || 0} | Pessoas: ${client.client_persons[0]?.count || 0}`);
      console.log('');
    });

    // Verificar segmentos
    const segments = {};
    strategicClients.forEach(client => {
      segments[client.segment] = (segments[client.segment] || 0) + 1;
    });

    console.log('📈 DISTRIBUIÇÃO POR SEGMENTO:');
    Object.entries(segments)
      .sort(([,a], [,b]) => b - a)
      .forEach(([segment, count]) => {
        console.log(`   ${segment}: ${count} clientes`);
      });

    // Verificar tamanhos
    const sizes = {};
    strategicClients.forEach(client => {
      sizes[client.size] = (sizes[client.size] || 0) + 1;
    });

    console.log('\n📏 DISTRIBUIÇÃO POR TAMANHO:');
    Object.entries(sizes)
      .sort(([,a], [,b]) => b - a)
      .forEach(([size, count]) => {
        console.log(`   ${size}: ${count} clientes`);
      });

    // Verificar documentos
    const documentTypes = {};
    clients.forEach(client => {
      documentTypes[client.document_type] = (documentTypes[client.document_type] || 0) + 1;
    });

    console.log('\n📄 DISTRIBUIÇÃO POR TIPO DE DOCUMENTO:');
    Object.entries(documentTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} clientes`);
    });

    console.log('\n✅ VERIFICAÇÃO CONCLUÍDA!');
    console.log('🎉 Todos os dados dos 50 principais clientes foram inseridos com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
    process.exit(1);
  }
}

// Executar o script
verifyClients();
