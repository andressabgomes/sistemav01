-- Criar estrutura completa para cadastro de clientes e atendimento

-- Tabela de clientes principais
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  trade_name TEXT,
  document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('CNPJ', 'CPF')),
  document_number VARCHAR(20) NOT NULL UNIQUE,
  state_registration VARCHAR(50),
  municipal_registration VARCHAR(50),
  client_type VARCHAR(20) NOT NULL DEFAULT 'regular' CHECK (client_type IN ('strategic', 'regular', 'prospect')),
  segment VARCHAR(100),
  size VARCHAR(20) CHECK (size IN ('micro', 'small', 'medium', 'large')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'prospect')),
  website TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de endereços dos clientes
CREATE TABLE public.client_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  address_type VARCHAR(20) NOT NULL DEFAULT 'main' CHECK (address_type IN ('main', 'billing', 'delivery', 'other')),
  street TEXT NOT NULL,
  number VARCHAR(20),
  complement TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  country VARCHAR(50) NOT NULL DEFAULT 'Brasil',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de contatos dos clientes
CREATE TABLE public.client_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN ('phone', 'mobile', 'email', 'whatsapp', 'fax')),
  contact_value TEXT NOT NULL,
  description TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_whatsapp BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de pessoas de contato (responsáveis no cliente)
CREATE TABLE public.client_persons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  department TEXT,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_decision_maker BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de contratos/acordos com clientes
CREATE TABLE public.client_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  contract_number VARCHAR(50) NOT NULL UNIQUE,
  contract_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'cancelled')),
  start_date DATE NOT NULL,
  end_date DATE,
  value DECIMAL(15,2),
  description TEXT,
  terms TEXT,
  responsible_team_member TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de histórico de atendimentos
CREATE TABLE public.service_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES public.tickets(id),
  service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('support', 'maintenance', 'installation', 'training', 'consultation', 'other')),
  service_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  responsible_technician TEXT NOT NULL,
  description TEXT NOT NULL,
  solution TEXT,
  equipment_serviced TEXT,
  parts_used TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  client_feedback TEXT,
  internal_notes TEXT,
  cost DECIMAL(10,2),
  billing_status VARCHAR(20) DEFAULT 'pending' CHECK (billing_status IN ('pending', 'billed', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de equipamentos do cliente
CREATE TABLE public.client_equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  equipment_type VARCHAR(50) NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number VARCHAR(100),
  installation_date DATE,
  warranty_expiry DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'replaced')),
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Atualizar tabela de tickets para incluir referência ao cliente
ALTER TABLE public.tickets 
DROP CONSTRAINT IF EXISTS tickets_client_id_fkey,
ADD CONSTRAINT tickets_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id);

-- Atualizar tabela strategic_clients para referenciar a nova tabela clients
ALTER TABLE public.strategic_clients 
ADD COLUMN client_id UUID REFERENCES public.clients(id);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_equipment ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now)
CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on client_addresses" ON public.client_addresses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on client_contacts" ON public.client_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on client_persons" ON public.client_persons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on client_contracts" ON public.client_contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on service_history" ON public.service_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on client_equipment" ON public.client_equipment FOR ALL USING (true) WITH CHECK (true);

-- Create triggers for automatic timestamp updates
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

-- Create indexes for better performance
CREATE INDEX idx_clients_document_number ON public.clients(document_number);
CREATE INDEX idx_clients_code ON public.clients(code);
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_client_addresses_client_id ON public.client_addresses(client_id);
CREATE INDEX idx_client_contacts_client_id ON public.client_contacts(client_id);
CREATE INDEX idx_client_persons_client_id ON public.client_persons(client_id);
CREATE INDEX idx_service_history_client_id ON public.service_history(client_id);
CREATE INDEX idx_service_history_service_date ON public.service_history(service_date);
CREATE INDEX idx_client_equipment_client_id ON public.client_equipment(client_id);

-- Insert sample data
INSERT INTO public.clients (code, company_name, trade_name, document_type, document_number, client_type, segment, size, status) VALUES
('CLI001', 'TechCorp Soluções Ltda', 'TechCorp', 'CNPJ', '12.345.678/0001-90', 'strategic', 'Tecnologia', 'medium', 'active'),
('CLI002', 'Inovação Digital Ltda', 'Inovação Digital', 'CNPJ', '98.765.432/0001-10', 'strategic', 'Marketing Digital', 'small', 'active'),
('CLI003', 'Empresa Global Tech SA', 'Global Tech', 'CNPJ', '11.222.333/0001-44', 'strategic', 'Consultoria', 'large', 'active'),
('CLI004', 'Comercial Santos & Cia', 'Santos Comercial', 'CNPJ', '55.666.777/0001-88', 'regular', 'Comércio', 'small', 'active'),
('CLI005', 'Indústria Moderna Ltda', 'Moderna', 'CNPJ', '77.888.999/0001-22', 'regular', 'Industrial', 'medium', 'active');

-- Insert sample addresses
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
WHERE c.code IN ('CLI001', 'CLI002', 'CLI003');

-- Insert sample contacts
INSERT INTO public.client_contacts (client_id, contact_type, contact_value, is_primary)
SELECT 
  c.id,
  'email',
  'contato@' || lower(replace(c.trade_name, ' ', '')) || '.com.br',
  true
FROM public.clients c
WHERE c.code IN ('CLI001', 'CLI002', 'CLI003');

-- Insert sample persons
INSERT INTO public.client_persons (client_id, name, role, email, is_primary, is_decision_maker)
SELECT 
  c.id,
  'João Silva',
  'Gerente de TI',
  'joao@' || lower(replace(c.trade_name, ' ', '')) || '.com.br',
  true,
  true
FROM public.clients c
WHERE c.code IN ('CLI001', 'CLI002', 'CLI003');

-- Insert sample service history
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
WHERE c.code IN ('CLI001', 'CLI002');