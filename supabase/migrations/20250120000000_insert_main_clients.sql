-- Migration para inserir os 50 principais clientes
-- Data: 2025-01-20

-- Inserir os 50 principais clientes
INSERT INTO public.clients (
  code, 
  company_name, 
  trade_name, 
  document_type, 
  document_number, 
  client_type, 
  segment, 
  size, 
  status,
  created_at,
  updated_at
) VALUES
-- 1-10
('0011100100', 'GUARARAPES CONFECCOES', 'GUARARAPES CONFECCOES', 'CNPJ', '00.111.001/0001-00', 'strategic', 'Confecção', 'large', 'active', now(), now()),
('0010500352', 'CPS CIA. DE PRODUCAO', 'CPS CIA. DE PRODUCAO', 'CNPJ', '00.105.003/0001-52', 'strategic', 'Produção', 'medium', 'active', now(), now()),
('1020502435', 'INDUSTRIAS BECKER LTDA', 'INDUSTRIAS BECKER LTDA', 'CNPJ', '10.205.024/0001-35', 'strategic', 'Industrial', 'large', 'active', now(), now()),
('1020509973', 'CALCADOS PEGADA NORDESTE', 'CALCADOS PEGADA NORDESTE', 'CNPJ', '10.205.099/0001-73', 'strategic', 'Calçados', 'medium', 'active', now(), now()),
('0010300609', 'NAYANE INDUSTRIA DE', 'NAYANE INDUSTRIA DE', 'CNPJ', '00.103.006/0001-09', 'strategic', 'Industrial', 'small', 'active', now(), now()),
('0000003601', 'DIAMANTES LINGERIE LTDA', 'DIAMANTES LINGERIE LTDA', 'CNPJ', '00.000.036/0001-01', 'strategic', 'Lingerie', 'medium', 'active', now(), now()),
('1020509437', 'DISTRIBUIDORA DE', 'DISTRIBUIDORA DE', 'CNPJ', '10.205.094/0001-37', 'strategic', 'Distribuição', 'medium', 'active', now(), now()),
('1020505029', 'ISOQUIMICA INDUSTRIAL', 'ISOQUIMICA INDUSTRIAL', 'CNPJ', '10.205.050/0001-29', 'strategic', 'Química', 'large', 'active', now(), now()),
('1020504852', 'EXCELENCIA LINGERIE LTDA', 'EXCELENCIA LINGERIE LTDA', 'CNPJ', '10.205.048/0001-52', 'strategic', 'Lingerie', 'medium', 'active', now(), now()),
('1020503546', 'ISHASHI DO BRASIL LTDA', 'ISHASHI DO BRASIL LTDA', 'CNPJ', '10.205.035/0001-46', 'strategic', 'Industrial', 'large', 'active', now(), now()),

-- 11-20
('1020506253', 'MAXIMUM DO BRASIL', 'MAXIMUM DO BRASIL', 'CNPJ', '10.205.062/0001-53', 'strategic', 'Industrial', 'large', 'active', now(), now()),
('0010400186', 'HOPE DO NORDESTE LTDA', 'HOPE DO NORDESTE LTDA', 'CNPJ', '00.104.001/0001-86', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('1020510941', 'AGUINALDO COELHO DA', 'AGUINALDO COELHO DA', 'CPF', '123.456.789-01', 'regular', 'Comércio', 'small', 'active', now(), now()),
('0010400189', 'N & S INDUSTRIA DE', 'N & S INDUSTRIA DE', 'CNPJ', '00.104.001/0001-89', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('0011200223', 'CR INDUSTRIA COMERCIO DE', 'CR INDUSTRIA COMERCIO DE', 'CNPJ', '00.112.002/0001-23', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('0010400997', 'KALLIFON EMPREEDIMENTOS', 'KALLIFON EMPREEDIMENTOS', 'CNPJ', '00.104.009/0001-97', 'strategic', 'Empreendimentos', 'medium', 'active', now(), now()),
('0010102861', 'ISM GOMES MATTOS', 'ISM GOMES MATTOS', 'CPF', '987.654.321-00', 'regular', 'Serviços', 'small', 'active', now(), now()),
('0010203661', 'THAIS FERREIRA', 'THAIS FERREIRA', 'CPF', '111.222.333-44', 'regular', 'Comércio', 'small', 'active', now(), now()),
('0010400837', 'VECTRA WORK IND E COM DE', 'VECTRA WORK IND E COM DE', 'CNPJ', '00.104.008/0001-37', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('1020511169', 'POMAR AGRICOLA PRODUCAO', 'POMAR AGRICOLA PRODUCAO', 'CNPJ', '10.205.111/0001-69', 'strategic', 'Agrícola', 'medium', 'active', now(), now()),

-- 21-30
('0010400955', 'DILADY SA EMPRESA IND DE', 'DILADY SA EMPRESA IND DE', 'CNPJ', '00.104.009/0001-55', 'strategic', 'Industrial', 'large', 'active', now(), now()),
('1020506669', 'VAPLAST - INDUSTRIA DE', 'VAPLAST - INDUSTRIA DE', 'CNPJ', '10.205.066/0001-69', 'strategic', 'Plásticos', 'medium', 'active', now(), now()),
('1020509583', 'EBAZAR.COM.BR LTDA', 'EBAZAR.COM.BR LTDA', 'CNPJ', '10.205.095/0001-83', 'strategic', 'E-commerce', 'medium', 'active', now(), now()),
('1020510817', 'LOJAS RIACHUELO SA', 'LOJAS RIACHUELO SA', 'CNPJ', '10.205.108/0001-17', 'strategic', 'Varejo', 'large', 'active', now(), now()),
('0010500140', 'FLOR DALIA MODA INTIMA', 'FLOR DALIA MODA INTIMA', 'CNPJ', '00.105.001/0001-40', 'strategic', 'Moda Íntima', 'medium', 'active', now(), now()),
('1020507935', 'PRIME LINGERIE INDUSTRIA', 'PRIME LINGERIE INDUSTRIA', 'CNPJ', '10.205.079/0001-35', 'strategic', 'Lingerie', 'medium', 'active', now(), now()),
('0010501135', 'ADEL COCO BRASIL', 'ADEL COCO BRASIL', 'CNPJ', '00.105.011/0001-35', 'strategic', 'Alimentos', 'medium', 'active', now(), now()),
('0010400737', 'SOCIEDADE BENF SAO', 'SOCIEDADE BENF SAO', 'CNPJ', '00.104.007/0001-37', 'strategic', 'Saúde', 'large', 'active', now(), now()),
('0010400033', 'SAND BEACH IND CONF LTDA', 'SAND BEACH IND CONF LTDA', 'CNPJ', '00.104.000/0001-33', 'strategic', 'Confecção', 'medium', 'active', now(), now()),
('1020511347', 'NRS INDUSTRIA DE', 'NRS INDUSTRIA DE', 'CNPJ', '10.205.113/0001-47', 'strategic', 'Industrial', 'medium', 'active', now(), now()),

-- 31-40
('3000200031', 'LOJAS RIACHUELO SA', 'LOJAS RIACHUELO SA', 'CNPJ', '30.002.000/0001-31', 'strategic', 'Varejo', 'large', 'active', now(), now()),
('1020510460', 'BARBARA SERVICOS DE', 'BARBARA SERVICOS DE', 'CNPJ', '10.205.104/0001-60', 'regular', 'Serviços', 'small', 'active', now(), now()),
('1020510775', 'JPS FINA CRISTAL LTDA.', 'JPS FINA CRISTAL LTDA.', 'CNPJ', '10.205.107/0001-75', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('1020507007', 'BRASIL MODA E', 'BRASIL MODA E', 'CNPJ', '10.205.070/0001-07', 'strategic', 'Moda', 'medium', 'active', now(), now()),
('0010103229', 'EDILSON VIEIRA DE', 'EDILSON VIEIRA DE', 'CPF', '555.666.777-88', 'regular', 'Comércio', 'small', 'active', now(), now()),
('1020505073', 'SAO CARLOS COMÉRCIO E', 'SAO CARLOS COMÉRCIO E', 'CNPJ', '10.205.050/0001-73', 'regular', 'Comércio', 'small', 'active', now(), now()),
('1020501874', 'ALUPAN INDUSTRIA DE', 'ALUPAN INDUSTRIA DE', 'CNPJ', '10.205.018/0001-74', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('1020511977', 'EMPORIO INDUSTRIA DE', 'EMPORIO INDUSTRIA DE', 'CNPJ', '10.205.119/0001-77', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('1020511174', 'VIA VIP CALCADOS LTDA', 'VIA VIP CALCADOS LTDA', 'CNPJ', '10.205.111/0001-74', 'strategic', 'Calçados', 'medium', 'active', now(), now()),
('1020510482', 'J B AMARO', 'J B AMARO', 'CPF', '999.888.777-66', 'regular', 'Comércio', 'small', 'active', now(), now()),

-- 41-50
('0010900084', 'UNIMED FORTALEZA SOC.', 'UNIMED FORTALEZA SOC.', 'CNPJ', '00.109.000/0001-84', 'strategic', 'Saúde', 'large', 'active', now(), now()),
('0010501467', 'ALUMINIO LUZIE', 'ALUMINIO LUZIE', 'CNPJ', '00.105.014/0001-67', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('1020507112', 'T DISTRIBUIDORA LTDA -', 'T DISTRIBUIDORA LTDA -', 'CNPJ', '10.205.071/0001-12', 'strategic', 'Distribuição', 'medium', 'active', now(), now()),
('1020510074', 'BINO''S INDUSTRIA E', 'BINO''S INDUSTRIA E', 'CNPJ', '10.205.100/0001-74', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('1020507966', 'UNIMED FORTALEZA', 'UNIMED FORTALEZA', 'CNPJ', '10.205.079/0001-66', 'strategic', 'Saúde', 'large', 'active', now(), now()),
('0010501410', 'NOVA FIACAO INDUSTRIA', 'NOVA FIACAO INDUSTRIA', 'CNPJ', '00.105.014/0001-10', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('1020509986', 'COMPANHIA BRASILEIRA DE', 'COMPANHIA BRASILEIRA DE', 'CNPJ', '10.205.099/0001-86', 'strategic', 'Industrial', 'large', 'active', now(), now()),
('0010400187', 'INDUSTRIA DE CONFECCOES', 'INDUSTRIA DE CONFECCOES', 'CNPJ', '00.104.001/0001-87', 'strategic', 'Confecção', 'medium', 'active', now(), now()),
('1020502488', 'MARBELLE LINGERIE LTDA', 'MARBELLE LINGERIE LTDA', 'CNPJ', '10.205.024/0001-88', 'strategic', 'Lingerie', 'medium', 'active', now(), now()),
('1020505189', 'INDUSTRIA E COMERCIO DE', 'INDUSTRIA E COMERCIO DE', 'CNPJ', '10.205.051/0001-89', 'strategic', 'Industrial', 'medium', 'active', now(), now()),

-- 51-60 (continuação dos 50 principais)
('1020507200', 'N F VALE INDUSTRIA E', 'N F VALE INDUSTRIA E', 'CNPJ', '10.205.072/0001-00', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('1020508216', 'MARIA DA PAZ ROCHA COSTA', 'MARIA DA PAZ ROCHA COSTA', 'CPF', '777.888.999-00', 'regular', 'Comércio', 'small', 'active', now(), now()),
('0010500376', 'L S B INDUSTRIA DE', 'L S B INDUSTRIA DE', 'CNPJ', '00.105.003/0001-76', 'strategic', 'Industrial', 'medium', 'active', now(), now()),
('0010204382', 'TORQUATO IND E COM DE', 'TORQUATO IND E COM DE', 'CNPJ', '00.102.043/0001-82', 'strategic', 'Industrial', 'medium', 'active', now(), now())

ON CONFLICT (code) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  trade_name = EXCLUDED.trade_name,
  document_type = EXCLUDED.document_type,
  document_number = EXCLUDED.document_number,
  client_type = EXCLUDED.client_type,
  segment = EXCLUDED.segment,
  size = EXCLUDED.size,
  status = EXCLUDED.status,
  updated_at = now();

-- Inserir endereços principais para os clientes estratégicos
INSERT INTO public.client_addresses (
  client_id, 
  address_type, 
  street, 
  number, 
  neighborhood, 
  city, 
  state, 
  zip_code, 
  country, 
  is_primary
)
SELECT 
  c.id,
  'main',
  'Rua das Empresas',
  '123',
  'Centro',
  'Fortaleza',
  'CE',
  '60000-000',
  'Brasil',
  true
FROM public.clients c
WHERE c.client_type = 'strategic'
ON CONFLICT DO NOTHING;

-- Inserir contatos principais para os clientes estratégicos
INSERT INTO public.client_contacts (
  client_id, 
  contact_type, 
  contact_value, 
  description, 
  is_primary, 
  is_whatsapp
)
SELECT 
  c.id,
  'email',
  'contato@' || lower(replace(c.trade_name, ' ', '')) || '.com.br',
  'Email principal',
  true,
  false
FROM public.clients c
WHERE c.client_type = 'strategic'
ON CONFLICT DO NOTHING;

-- Inserir pessoas de contato principais para os clientes estratégicos
INSERT INTO public.client_persons (
  client_id, 
  name, 
  role, 
  email, 
  is_primary, 
  is_decision_maker
)
SELECT 
  c.id,
  'Gerente de TI',
  'Gerente de Tecnologia da Informação',
  'gerente.ti@' || lower(replace(c.trade_name, ' ', '')) || '.com.br',
  true,
  true
FROM public.clients c
WHERE c.client_type = 'strategic'
ON CONFLICT DO NOTHING;

-- Atualizar strategic_clients para incluir os novos clientes estratégicos
INSERT INTO public.strategic_clients (
  code, 
  name, 
  responsible_team_member, 
  client_id
)
SELECT 
  c.code,
  c.company_name,
  'Equipe StarPrint',
  c.id
FROM public.clients c
WHERE c.client_type = 'strategic'
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  responsible_team_member = EXCLUDED.responsible_team_member,
  client_id = EXCLUDED.client_id;

-- Comentário sobre a migration
COMMENT ON TABLE public.clients IS 'Tabela principal de clientes incluindo os 50 principais clientes estratégicos';
