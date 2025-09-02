// Script para inserir os 50 principais clientes
// Execute com: node scripts/insert-main-clients.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vtzukmbnbmzzlqcdzjto.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0enVrbWJuYm16emxxY2R6anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTA2MzYsImV4cCI6MjA3MTEyNjYzNn0.fAyCAIV2daSk578xlrRVwtoMgj6rgQoQkLBG1ptguUg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dados dos 50 principais clientes
const mainClients = [
  { code: '0011100100', company_name: 'GUARARAPES CONFECCOES', trade_name: 'GUARARAPES CONFECCOES', document_type: 'CNPJ', document_number: '00.111.001/0001-00', client_type: 'strategic', segment: 'Confecção', size: 'large' },
  { code: '0010500352', company_name: 'CPS CIA. DE PRODUCAO', trade_name: 'CPS CIA. DE PRODUCAO', document_type: 'CNPJ', document_number: '00.105.003/0001-52', client_type: 'strategic', segment: 'Produção', size: 'medium' },
  { code: '1020502435', company_name: 'INDUSTRIAS BECKER LTDA', trade_name: 'INDUSTRIAS BECKER LTDA', document_type: 'CNPJ', document_number: '10.205.024/0001-35', client_type: 'strategic', segment: 'Industrial', size: 'large' },
  { code: '1020509973', company_name: 'CALCADOS PEGADA NORDESTE', trade_name: 'CALCADOS PEGADA NORDESTE', document_type: 'CNPJ', document_number: '10.205.099/0001-73', client_type: 'strategic', segment: 'Calçados', size: 'medium' },
  { code: '0010300609', company_name: 'NAYANE INDUSTRIA DE', trade_name: 'NAYANE INDUSTRIA DE', document_type: 'CNPJ', document_number: '00.103.006/0001-09', client_type: 'strategic', segment: 'Industrial', size: 'small' },
  { code: '0000003601', company_name: 'DIAMANTES LINGERIE LTDA', trade_name: 'DIAMANTES LINGERIE LTDA', document_type: 'CNPJ', document_number: '00.000.036/0001-01', client_type: 'strategic', segment: 'Lingerie', size: 'medium' },
  { code: '1020509437', company_name: 'DISTRIBUIDORA DE', trade_name: 'DISTRIBUIDORA DE', document_type: 'CNPJ', document_number: '10.205.094/0001-37', client_type: 'strategic', segment: 'Distribuição', size: 'medium' },
  { code: '1020505029', company_name: 'ISOQUIMICA INDUSTRIAL', trade_name: 'ISOQUIMICA INDUSTRIAL', document_type: 'CNPJ', document_number: '10.205.050/0001-29', client_type: 'strategic', segment: 'Química', size: 'large' },
  { code: '1020504852', company_name: 'EXCELENCIA LINGERIE LTDA', trade_name: 'EXCELENCIA LINGERIE LTDA', document_type: 'CNPJ', document_number: '10.205.048/0001-52', client_type: 'strategic', segment: 'Lingerie', size: 'medium' },
  { code: '1020503546', company_name: 'ISHASHI DO BRASIL LTDA', trade_name: 'ISHASHI DO BRASIL LTDA', document_type: 'CNPJ', document_number: '10.205.035/0001-46', client_type: 'strategic', segment: 'Industrial', size: 'large' },
  { code: '1020506253', company_name: 'MAXIMUM DO BRASIL', trade_name: 'MAXIMUM DO BRASIL', document_type: 'CNPJ', document_number: '10.205.062/0001-53', client_type: 'strategic', segment: 'Industrial', size: 'large' },
  { code: '0010400186', company_name: 'HOPE DO NORDESTE LTDA', trade_name: 'HOPE DO NORDESTE LTDA', document_type: 'CNPJ', document_number: '00.104.001/0001-86', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '1020510941', company_name: 'AGUINALDO COELHO DA', trade_name: 'AGUINALDO COELHO DA', document_type: 'CPF', document_number: '123.456.789-01', client_type: 'regular', segment: 'Comércio', size: 'small' },
  { code: '0010400189', company_name: 'N & S INDUSTRIA DE', trade_name: 'N & S INDUSTRIA DE', document_type: 'CNPJ', document_number: '00.104.001/0001-89', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '0011200223', company_name: 'CR INDUSTRIA COMERCIO DE', trade_name: 'CR INDUSTRIA COMERCIO DE', document_type: 'CNPJ', document_number: '00.112.002/0001-23', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '0010400997', company_name: 'KALLIFON EMPREEDIMENTOS', trade_name: 'KALLIFON EMPREEDIMENTOS', document_type: 'CNPJ', document_number: '00.104.009/0001-97', client_type: 'strategic', segment: 'Empreendimentos', size: 'medium' },
  { code: '0010102861', company_name: 'ISM GOMES MATTOS', trade_name: 'ISM GOMES MATTOS', document_type: 'CPF', document_number: '987.654.321-00', client_type: 'regular', segment: 'Serviços', size: 'small' },
  { code: '0010203661', company_name: 'THAIS FERREIRA', trade_name: 'THAIS FERREIRA', document_type: 'CPF', document_number: '111.222.333-44', client_type: 'regular', segment: 'Comércio', size: 'small' },
  { code: '0010400837', company_name: 'VECTRA WORK IND E COM DE', trade_name: 'VECTRA WORK IND E COM DE', document_type: 'CNPJ', document_number: '00.104.008/0001-37', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '1020511169', company_name: 'POMAR AGRICOLA PRODUCAO', trade_name: 'POMAR AGRICOLA PRODUCAO', document_type: 'CNPJ', document_number: '10.205.111/0001-69', client_type: 'strategic', segment: 'Agrícola', size: 'medium' },
  { code: '0010400955', company_name: 'DILADY SA EMPRESA IND DE', trade_name: 'DILADY SA EMPRESA IND DE', document_type: 'CNPJ', document_number: '00.104.009/0001-55', client_type: 'strategic', segment: 'Industrial', size: 'large' },
  { code: '1020506669', company_name: 'VAPLAST - INDUSTRIA DE', trade_name: 'VAPLAST - INDUSTRIA DE', document_type: 'CNPJ', document_number: '10.205.066/0001-69', client_type: 'strategic', segment: 'Plásticos', size: 'medium' },
  { code: '1020509583', company_name: 'EBAZAR.COM.BR LTDA', trade_name: 'EBAZAR.COM.BR LTDA', document_type: 'CNPJ', document_number: '10.205.095/0001-83', client_type: 'strategic', segment: 'E-commerce', size: 'medium' },
  { code: '1020510817', company_name: 'LOJAS RIACHUELO SA', trade_name: 'LOJAS RIACHUELO SA', document_type: 'CNPJ', document_number: '10.205.108/0001-17', client_type: 'strategic', segment: 'Varejo', size: 'large' },
  { code: '0010500140', company_name: 'FLOR DALIA MODA INTIMA', trade_name: 'FLOR DALIA MODA INTIMA', document_type: 'CNPJ', document_number: '00.105.001/0001-40', client_type: 'strategic', segment: 'Moda Íntima', size: 'medium' },
  { code: '1020507935', company_name: 'PRIME LINGERIE INDUSTRIA', trade_name: 'PRIME LINGERIE INDUSTRIA', document_type: 'CNPJ', document_number: '10.205.079/0001-35', client_type: 'strategic', segment: 'Lingerie', size: 'medium' },
  { code: '0010501135', company_name: 'ADEL COCO BRASIL', trade_name: 'ADEL COCO BRASIL', document_type: 'CNPJ', document_number: '00.105.011/0001-35', client_type: 'strategic', segment: 'Alimentos', size: 'medium' },
  { code: '0010400737', company_name: 'SOCIEDADE BENF SAO', trade_name: 'SOCIEDADE BENF SAO', document_type: 'CNPJ', document_number: '00.104.007/0001-37', client_type: 'strategic', segment: 'Saúde', size: 'large' },
  { code: '0010400033', company_name: 'SAND BEACH IND CONF LTDA', trade_name: 'SAND BEACH IND CONF LTDA', document_type: 'CNPJ', document_number: '00.104.000/0001-33', client_type: 'strategic', segment: 'Confecção', size: 'medium' },
  { code: '1020511347', company_name: 'NRS INDUSTRIA DE', trade_name: 'NRS INDUSTRIA DE', document_type: 'CNPJ', document_number: '10.205.113/0001-47', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '3000200031', company_name: 'LOJAS RIACHUELO SA', trade_name: 'LOJAS RIACHUELO SA', document_type: 'CNPJ', document_number: '30.002.000/0001-31', client_type: 'strategic', segment: 'Varejo', size: 'large' },
  { code: '1020510460', company_name: 'BARBARA SERVICOS DE', trade_name: 'BARBARA SERVICOS DE', document_type: 'CNPJ', document_number: '10.205.104/0001-60', client_type: 'regular', segment: 'Serviços', size: 'small' },
  { code: '1020510775', company_name: 'JPS FINA CRISTAL LTDA.', trade_name: 'JPS FINA CRISTAL LTDA.', document_type: 'CNPJ', document_number: '10.205.107/0001-75', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '1020507007', company_name: 'BRASIL MODA E', trade_name: 'BRASIL MODA E', document_type: 'CNPJ', document_number: '10.205.070/0001-07', client_type: 'strategic', segment: 'Moda', size: 'medium' },
  { code: '0010103229', company_name: 'EDILSON VIEIRA DE', trade_name: 'EDILSON VIEIRA DE', document_type: 'CPF', document_number: '555.666.777-88', client_type: 'regular', segment: 'Comércio', size: 'small' },
  { code: '1020505073', company_name: 'SAO CARLOS COMÉRCIO E', trade_name: 'SAO CARLOS COMÉRCIO E', document_type: 'CNPJ', document_number: '10.205.050/0001-73', client_type: 'regular', segment: 'Comércio', size: 'small' },
  { code: '1020501874', company_name: 'ALUPAN INDUSTRIA DE', trade_name: 'ALUPAN INDUSTRIA DE', document_type: 'CNPJ', document_number: '10.205.018/0001-74', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '1020511977', company_name: 'EMPORIO INDUSTRIA DE', trade_name: 'EMPORIO INDUSTRIA DE', document_type: 'CNPJ', document_number: '10.205.119/0001-77', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '1020511174', company_name: 'VIA VIP CALCADOS LTDA', trade_name: 'VIA VIP CALCADOS LTDA', document_type: 'CNPJ', document_number: '10.205.111/0001-74', client_type: 'strategic', segment: 'Calçados', size: 'medium' },
  { code: '1020510482', company_name: 'J B AMARO', trade_name: 'J B AMARO', document_type: 'CPF', document_number: '999.888.777-66', client_type: 'regular', segment: 'Comércio', size: 'small' },
  { code: '0010900084', company_name: 'UNIMED FORTALEZA SOC.', trade_name: 'UNIMED FORTALEZA SOC.', document_type: 'CNPJ', document_number: '00.109.000/0001-84', client_type: 'strategic', segment: 'Saúde', size: 'large' },
  { code: '0010501467', company_name: 'ALUMINIO LUZIE', trade_name: 'ALUMINIO LUZIE', document_type: 'CNPJ', document_number: '00.105.014/0001-67', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '1020507112', company_name: 'T DISTRIBUIDORA LTDA -', trade_name: 'T DISTRIBUIDORA LTDA -', document_type: 'CNPJ', document_number: '10.205.071/0001-12', client_type: 'strategic', segment: 'Distribuição', size: 'medium' },
  { code: '1020510074', company_name: 'BINO\'S INDUSTRIA E', trade_name: 'BINO\'S INDUSTRIA E', document_type: 'CNPJ', document_number: '10.205.100/0001-74', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '1020507966', company_name: 'UNIMED FORTALEZA', trade_name: 'UNIMED FORTALEZA', document_type: 'CNPJ', document_number: '10.205.079/0001-66', client_type: 'strategic', segment: 'Saúde', size: 'large' },
  { code: '0010501410', company_name: 'NOVA FIACAO INDUSTRIA', trade_name: 'NOVA FIACAO INDUSTRIA', document_type: 'CNPJ', document_number: '00.105.014/0001-10', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '1020509986', company_name: 'COMPANHIA BRASILEIRA DE', trade_name: 'COMPANHIA BRASILEIRA DE', document_type: 'CNPJ', document_number: '10.205.099/0001-86', client_type: 'strategic', segment: 'Industrial', size: 'large' },
  { code: '0010400187', company_name: 'INDUSTRIA DE CONFECCOES', trade_name: 'INDUSTRIA DE CONFECCOES', document_type: 'CNPJ', document_number: '00.104.001/0001-87', client_type: 'strategic', segment: 'Confecção', size: 'medium' },
  { code: '1020502488', company_name: 'MARBELLE LINGERIE LTDA', trade_name: 'MARBELLE LINGERIE LTDA', document_type: 'CNPJ', document_number: '10.205.024/0001-88', client_type: 'strategic', segment: 'Lingerie', size: 'medium' },
  { code: '1020505189', company_name: 'INDUSTRIA E COMERCIO DE', trade_name: 'INDUSTRIA E COMERCIO DE', document_type: 'CNPJ', document_number: '10.205.051/0001-89', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '1020507200', company_name: 'N F VALE INDUSTRIA E', trade_name: 'N F VALE INDUSTRIA E', document_type: 'CNPJ', document_number: '10.205.072/0001-00', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '1020508216', company_name: 'MARIA DA PAZ ROCHA COSTA', trade_name: 'MARIA DA PAZ ROCHA COSTA', document_type: 'CPF', document_number: '777.888.999-00', client_type: 'regular', segment: 'Comércio', size: 'small' },
  { code: '0010500376', company_name: 'L S B INDUSTRIA DE', trade_name: 'L S B INDUSTRIA DE', document_type: 'CNPJ', document_number: '00.105.003/0001-76', client_type: 'strategic', segment: 'Industrial', size: 'medium' },
  { code: '0010204382', company_name: 'TORQUATO IND E COM DE', trade_name: 'TORQUATO IND E COM DE', document_type: 'CNPJ', document_number: '00.102.043/0001-82', client_type: 'strategic', segment: 'Industrial', size: 'medium' }
];

async function insertMainClients() {
  console.log('🚀 Iniciando inserção dos 50 principais clientes...');
  
  try {
    // Inserir clientes
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .upsert(mainClients, { 
        onConflict: 'code',
        ignoreDuplicates: false 
      });

    if (clientsError) {
      throw clientsError;
    }

    console.log(`✅ ${mainClients.length} clientes inseridos/atualizados com sucesso!`);

    // Buscar clientes estratégicos para criar dados relacionados
    const { data: strategicClients, error: strategicError } = await supabase
      .from('clients')
      .select('id, code, trade_name')
      .eq('client_type', 'strategic');

    if (strategicError) {
      throw strategicError;
    }

    console.log(`📊 ${strategicClients.length} clientes estratégicos encontrados`);

    // Criar endereços para clientes estratégicos
    const addresses = strategicClients.map(client => ({
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
    }));

    const { error: addressesError } = await supabase
      .from('client_addresses')
      .upsert(addresses, { 
        onConflict: 'client_id,address_type',
        ignoreDuplicates: true 
      });

    if (addressesError) {
      console.warn('⚠️ Erro ao inserir endereços:', addressesError.message);
    } else {
      console.log(`📍 ${addresses.length} endereços criados`);
    }

    // Criar contatos para clientes estratégicos
    const contacts = strategicClients.map(client => ({
      client_id: client.id,
      contact_type: 'email',
      contact_value: `contato@${client.trade_name?.toLowerCase().replace(/\s+/g, '')}.com.br`,
      description: 'Email principal',
      is_primary: true,
      is_whatsapp: false
    }));

    const { error: contactsError } = await supabase
      .from('client_contacts')
      .upsert(contacts, { 
        onConflict: 'client_id,contact_type',
        ignoreDuplicates: true 
      });

    if (contactsError) {
      console.warn('⚠️ Erro ao inserir contatos:', contactsError.message);
    } else {
      console.log(`📞 ${contacts.length} contatos criados`);
    }

    // Criar pessoas de contato para clientes estratégicos
    const persons = strategicClients.map(client => ({
      client_id: client.id,
      name: 'Gerente de TI',
      role: 'Gerente de Tecnologia da Informação',
      email: `gerente.ti@${client.trade_name?.toLowerCase().replace(/\s+/g, '')}.com.br`,
      is_primary: true,
      is_decision_maker: true
    }));

    const { error: personsError } = await supabase
      .from('client_persons')
      .upsert(persons, { 
        onConflict: 'client_id,name',
        ignoreDuplicates: true 
      });

    if (personsError) {
      console.warn('⚠️ Erro ao inserir pessoas de contato:', personsError.message);
    } else {
      console.log(`👤 ${persons.length} pessoas de contato criadas`);
    }

    // Atualizar strategic_clients
    const strategicClientsData = strategicClients.map(client => ({
      code: client.code,
      name: mainClients.find(mc => mc.code === client.code)?.company_name || client.trade_name,
      responsible_team_member: 'Equipe StarPrint',
      client_id: client.id
    }));

    const { error: strategicUpdateError } = await supabase
      .from('strategic_clients')
      .upsert(strategicClientsData, { 
        onConflict: 'code',
        ignoreDuplicates: false 
      });

    if (strategicUpdateError) {
      console.warn('⚠️ Erro ao atualizar strategic_clients:', strategicUpdateError.message);
    } else {
      console.log(`⭐ ${strategicClientsData.length} clientes estratégicos atualizados`);
    }

    console.log('🎉 Processo concluído com sucesso!');
    console.log(`📈 Total de clientes no sistema: ${mainClients.length}`);
    console.log(`🎯 Clientes estratégicos: ${strategicClients.length}`);
    console.log(`👥 Clientes regulares: ${mainClients.length - strategicClients.length}`);

  } catch (error) {
    console.error('❌ Erro durante a inserção:', error);
    process.exit(1);
  }
}

// Executar o script
insertMainClients();
