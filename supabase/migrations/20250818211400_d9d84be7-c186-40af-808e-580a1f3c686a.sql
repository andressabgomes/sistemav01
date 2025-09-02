-- Habilitar RLS e criar políticas para todas as tabelas criadas

-- Habilitar RLS em todas as tabelas de clientes
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_equipment ENABLE ROW LEVEL SECURITY;

-- Criar políticas para a tabela clients
CREATE POLICY "Allow all operations on clients" 
ON public.clients FOR ALL 
USING (true) WITH CHECK (true);

-- Criar políticas para a tabela client_addresses
CREATE POLICY "Allow all operations on client_addresses" 
ON public.client_addresses FOR ALL 
USING (true) WITH CHECK (true);

-- Criar políticas para a tabela client_contacts
CREATE POLICY "Allow all operations on client_contacts" 
ON public.client_contacts FOR ALL 
USING (true) WITH CHECK (true);

-- Criar políticas para a tabela client_persons
CREATE POLICY "Allow all operations on client_persons" 
ON public.client_persons FOR ALL 
USING (true) WITH CHECK (true);

-- Criar políticas para a tabela client_contracts
CREATE POLICY "Allow all operations on client_contracts" 
ON public.client_contracts FOR ALL 
USING (true) WITH CHECK (true);

-- Criar políticas para a tabela service_history
CREATE POLICY "Allow all operations on service_history" 
ON public.service_history FOR ALL 
USING (true) WITH CHECK (true);

-- Criar políticas para a tabela client_equipment
CREATE POLICY "Allow all operations on client_equipment" 
ON public.client_equipment FOR ALL 
USING (true) WITH CHECK (true);

-- Criar triggers para atualização automática de timestamps
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_addresses_updated_at
  BEFORE UPDATE ON public.client_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_contacts_updated_at
  BEFORE UPDATE ON public.client_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_persons_updated_at
  BEFORE UPDATE ON public.client_persons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_contracts_updated_at
  BEFORE UPDATE ON public.client_contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_history_updated_at
  BEFORE UPDATE ON public.service_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_equipment_updated_at
  BEFORE UPDATE ON public.client_equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clients_document_number ON public.clients(document_number);
CREATE INDEX IF NOT EXISTS idx_clients_code ON public.clients(code);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_client_addresses_client_id ON public.client_addresses(client_id);
CREATE INDEX IF NOT EXISTS idx_client_contacts_client_id ON public.client_contacts(client_id);
CREATE INDEX IF NOT EXISTS idx_client_persons_client_id ON public.client_persons(client_id);
CREATE INDEX IF NOT EXISTS idx_service_history_client_id ON public.service_history(client_id);
CREATE INDEX IF NOT EXISTS idx_service_history_service_date ON public.service_history(service_date);
CREATE INDEX IF NOT EXISTS idx_client_equipment_client_id ON public.client_equipment(client_id);

-- Inserir dados de exemplo completos
INSERT INTO public.client_addresses (client_id, address_type, street, number, neighborhood, city, state, zip_code, is_primary) 
SELECT 
  c.id,
  'main',
  'Rua das Empresas',
  '123',
  'Centro',
  'São Paulo',
  'SP',
  '01234-567',
  true
FROM public.clients c
WHERE c.code IN ('CLI001', 'CLI002', 'CLI003')
ON CONFLICT DO NOTHING;

-- Inserir contatos de exemplo
INSERT INTO public.client_contacts (client_id, contact_type, contact_value, is_primary)
SELECT 
  c.id,
  'email',
  'contato@' || lower(replace(c.trade_name, ' ', '')) || '.com.br',
  true
FROM public.clients c
WHERE c.code IN ('CLI001', 'CLI002', 'CLI003')
ON CONFLICT DO NOTHING;

-- Inserir pessoas de contato de exemplo
INSERT INTO public.client_persons (client_id, name, role, email, is_primary, is_decision_maker)
SELECT 
  c.id,
  'João Silva',
  'Gerente de TI',
  'joao@' || lower(replace(c.trade_name, ' ', '')) || '.com.br',
  true,
  true
FROM public.clients c
WHERE c.code IN ('CLI001', 'CLI002', 'CLI003')
ON CONFLICT DO NOTHING;

-- Inserir histórico de atendimento de exemplo
INSERT INTO public.service_history (client_id, service_type, service_date, responsible_technician, description, status, satisfaction_rating)
SELECT 
  c.id,
  'support',
  now() - interval '1 day',
  'Ana Silva',
  'Suporte técnico realizado - Problema resolvido com sucesso',
  'completed',
  5
FROM public.clients c
WHERE c.code IN ('CLI001', 'CLI002')
ON CONFLICT DO NOTHING;