-- Create tables for StarPrint CRM features

-- NPS responses table
CREATE TABLE public.nps_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID,
  problem_resolved BOOLEAN NOT NULL,
  satisfaction_level INTEGER NOT NULL CHECK (satisfaction_level >= 0 AND satisfaction_level <= 10),
  nps_score INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN satisfaction_level >= 9 THEN 1
      WHEN satisfaction_level >= 7 THEN 0
      ELSE -1
    END
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Strategic clients table
CREATE TABLE public.strategic_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  responsible_team_member TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tickets table
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.strategic_clients(id),
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  type VARCHAR(50) NOT NULL DEFAULT 'online',
  priority VARCHAR(50) NOT NULL DEFAULT 'medium',
  assigned_to TEXT,
  conversion_reason TEXT,
  converted_at TIMESTAMP WITH TIME ZONE,
  pipefy_card_id TEXT,
  pipefy_sync_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User monitoring sessions table
CREATE TABLE public.monitoring_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  session_id TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  platform TEXT,
  browser TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team capacity table
CREATE TABLE public.team_capacity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  total_capacity INTEGER NOT NULL,
  actual_attendance INTEGER NOT NULL DEFAULT 0,
  coverage_percentage DECIMAL GENERATED ALWAYS AS (
    CASE 
      WHEN total_capacity > 0 THEN (actual_attendance::DECIMAL / total_capacity::DECIMAL) * 100
      ELSE 0
    END
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.nps_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_capacity ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now, to be refined with authentication)
CREATE POLICY "Allow all operations on nps_responses" ON public.nps_responses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on strategic_clients" ON public.strategic_clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tickets" ON public.tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on monitoring_sessions" ON public.monitoring_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on team_capacity" ON public.team_capacity FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_nps_responses_updated_at
  BEFORE UPDATE ON public.nps_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_strategic_clients_updated_at
  BEFORE UPDATE ON public.strategic_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_capacity_updated_at
  BEFORE UPDATE ON public.team_capacity
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for strategic clients
INSERT INTO public.strategic_clients (code, name, responsible_team_member) VALUES
('CLI001', 'TechCorp Soluções', 'Ana Silva'),
('CLI002', 'Inovação Digital Ltda', 'Carlos Santos'),
('CLI003', 'Empresa Global Tech', 'Maria Oliveira'),
('CLI004', 'Soluções Avançadas SA', 'João Costa'),
('CLI005', 'TechMaster Sistemas', 'Paula Lima');

-- Insert sample data for team capacity
INSERT INTO public.team_capacity (date, total_capacity, actual_attendance) VALUES
(CURRENT_DATE, 20, 18),
(CURRENT_DATE - INTERVAL '1 day', 20, 20),
(CURRENT_DATE - INTERVAL '2 days', 20, 17),
(CURRENT_DATE - INTERVAL '3 days', 20, 19),
(CURRENT_DATE - INTERVAL '4 days', 20, 16);

-- Insert sample tickets
INSERT INTO public.tickets (client_id, title, description, status, type, priority, assigned_to) VALUES
((SELECT id FROM public.strategic_clients WHERE code = 'CLI001'), 'Problema na impressão', 'Cliente relatando falhas na impressora', 'open', 'online', 'high', 'Ana Silva'),
((SELECT id FROM public.strategic_clients WHERE code = 'CLI002'), 'Configuração de rede', 'Necessita ajuda com configuração', 'in_progress', 'online', 'medium', 'Carlos Santos'),
((SELECT id FROM public.strategic_clients WHERE code = 'CLI003'), 'Manutenção preventiva', 'Agendamento de manutenção', 'open', 'presencial', 'low', 'Maria Oliveira');