-- Primeiro, vamos corrigir o problema com a foreign key constraint

-- Remover a constraint problemática
ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_client_id_fkey;

-- Limpar dados inválidos na tabela tickets (client_id que não existem)
UPDATE public.tickets SET client_id = NULL WHERE client_id IS NOT NULL;

-- Agora criar a estrutura completa para cadastro de clientes

-- Tabela de clientes principais
CREATE TABLE IF NOT EXISTS public.clients (
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
CREATE TABLE IF NOT EXISTS public.client_addresses (
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
CREATE TABLE IF NOT EXISTS public.client_contacts (
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
CREATE TABLE IF NOT EXISTS public.client_persons (
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
CREATE TABLE IF NOT EXISTS public.client_contracts (
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
CREATE TABLE IF NOT EXISTS public.service_history (
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
CREATE TABLE IF NOT EXISTS public.client_equipment (
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

-- Inserir dados de exemplo primeiro
INSERT INTO public.clients (code, company_name, trade_name, document_type, document_number, client_type, segment, size, status) VALUES
('CLI001', 'TechCorp Soluções Ltda', 'TechCorp', 'CNPJ', '12.345.678/0001-90', 'strategic', 'Tecnologia', 'medium', 'active'),
('CLI002', 'Inovação Digital Ltda', 'Inovação Digital', 'CNPJ', '98.765.432/0001-10', 'strategic', 'Marketing Digital', 'small', 'active'),
('CLI003', 'Empresa Global Tech SA', 'Global Tech', 'CNPJ', '11.222.333/0001-44', 'strategic', 'Consultoria', 'large', 'active'),
('CLI004', 'Comercial Santos & Cia', 'Santos Comercial', 'CNPJ', '55.666.777/0001-88', 'regular', 'Comércio', 'small', 'active'),
('CLI005', 'Indústria Moderna Ltda', 'Moderna', 'CNPJ', '77.888.999/0001-22', 'regular', 'Industrial', 'medium', 'active')
ON CONFLICT (code) DO NOTHING;

-- Agora recriar a constraint da tabela tickets
ALTER TABLE public.tickets 
ADD CONSTRAINT tickets_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id);

-- Atualizar strategic_clients para referenciar clients
ALTER TABLE public.strategic_clients 
ADD COLUMN IF NOT EXISTS client_id UUID;

-- Vincular strategic_clients com clients
UPDATE public.strategic_clients 
SET client_id = c.id 
FROM public.clients c 
WHERE public.strategic_clients.code = c.code;