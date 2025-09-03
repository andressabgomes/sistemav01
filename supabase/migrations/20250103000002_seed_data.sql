-- ============================================================================
-- DADOS DE EXEMPLO - SISTEMA V01
-- ============================================================================

-- ============================================================================
-- USUÁRIOS DE EXEMPLO
-- ============================================================================

INSERT INTO users (id, email, first_name, last_name, role, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@sistemav01.com', 'Admin', 'Sistema', 'ADMIN', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'manager@sistemav01.com', 'Manager', 'Sistema', 'MANAGER', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'agent@sistemav01.com', 'Agent', 'Sistema', 'AGENT', 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'user@sistemav01.com', 'User', 'Sistema', 'USER', 'active'),
('550e8400-e29b-41d4-a716-446655440005', 'support@sistemav01.com', 'Support', 'Sistema', 'SUPPORT', 'active');

-- ============================================================================
-- CLIENTES DE EXEMPLO
-- ============================================================================

INSERT INTO clients (id, name, email, phone, company, status) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao.silva@empresa.com', '(11) 99999-1111', 'Empresa ABC Ltda', 'active'),
('650e8400-e29b-41d4-a716-446655440002', 'Maria Santos', 'maria.santos@empresa.com', '(11) 99999-2222', 'Empresa XYZ Ltda', 'active'),
('650e8400-e29b-41d4-a716-446655440003', 'Pedro Oliveira', 'pedro.oliveira@empresa.com', '(11) 99999-3333', 'Empresa DEF Ltda', 'prospect'),
('650e8400-e29b-41d4-a716-446655440004', 'Ana Costa', 'ana.costa@empresa.com', '(11) 99999-4444', 'Empresa GHI Ltda', 'active'),
('650e8400-e29b-41d4-a716-446655440005', 'Carlos Lima', 'carlos.lima@empresa.com', '(11) 99999-5555', 'Empresa JKL Ltda', 'inactive');

-- ============================================================================
-- TICKETS DE EXEMPLO
-- ============================================================================

INSERT INTO tickets (id, title, description, status, priority, client_id, assigned_to) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Problema com login', 'Cliente não consegue fazer login no sistema', 'open', 'high', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('750e8400-e29b-41d4-a716-446655440002', 'Dúvida sobre funcionalidade', 'Cliente tem dúvidas sobre como usar a funcionalidade X', 'in_progress', 'medium', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'),
('750e8400-e29b-41d4-a716-446655440003', 'Solicitação de nova feature', 'Cliente solicita implementação de nova funcionalidade', 'open', 'low', '650e8400-e29b-41d4-a716-446655440003', null),
('750e8400-e29b-41d4-a716-446655440004', 'Bug crítico reportado', 'Sistema apresentando erro crítico em produção', 'open', 'urgent', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002'),
('750e8400-e29b-41d4-a716-446655440005', 'Tutorial solicitado', 'Cliente precisa de tutorial para usar o sistema', 'resolved', 'medium', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005');

-- ============================================================================
-- ARTIGOS DE EXEMPLO (BASE DE CONHECIMENTO)
-- ============================================================================

INSERT INTO articles (id, title, content, category, tags, author_id, status, views) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Como fazer login no sistema', 'Para fazer login no sistema, siga os seguintes passos...', 'Autenticação', ARRAY['login', 'autenticação', 'acesso'], '550e8400-e29b-41d4-a716-446655440001', 'published', 150),
('850e8400-e29b-41d4-a716-446655440002', 'Configuração de perfil', 'Aprenda como configurar seu perfil no sistema...', 'Configuração', ARRAY['perfil', 'configuração', 'usuário'], '550e8400-e29b-41d4-a716-446655440002', 'published', 89),
('850e8400-e29b-41d4-a716-446655440003', 'Solução de problemas comuns', 'Lista de problemas comuns e suas soluções...', 'Suporte', ARRAY['problemas', 'soluções', 'suporte'], '550e8400-e29b-41d4-a716-446655440003', 'published', 234),
('850e8400-e29b-41d4-a716-446655440004', 'Guia de funcionalidades avançadas', 'Explore as funcionalidades avançadas do sistema...', 'Funcionalidades', ARRAY['avançado', 'funcionalidades', 'guia'], '550e8400-e29b-41d4-a716-446655440004', 'draft', 0);

-- ============================================================================
-- MEMBROS DA EQUIPE DE EXEMPLO
-- ============================================================================

INSERT INTO team_members (id, name, email, role, department, status) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao.silva@equipe.com', 'Desenvolvedor Senior', 'Tecnologia', 'active'),
('950e8400-e29b-41d4-a716-446655440002', 'Maria Santos', 'maria.santos@equipe.com', 'Analista de Suporte', 'Atendimento', 'active'),
('950e8400-e29b-41d4-a716-446655440003', 'Pedro Oliveira', 'pedro.oliveira@equipe.com', 'Gerente de Projetos', 'Gestão', 'active'),
('950e8400-e29b-41d4-a716-446655440004', 'Ana Costa', 'ana.costa@equipe.com', 'Designer UX/UI', 'Design', 'active'),
('950e8400-e29b-41d4-a716-446655440005', 'Carlos Lima', 'carlos.lima@equipe.com', 'Analista de Qualidade', 'QA', 'inactive');

-- ============================================================================
-- ESCALAS DE EXEMPLO
-- ============================================================================

INSERT INTO schedules (id, team_member_id, date, start_time, end_time, type) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', '2024-01-15', '08:00:00', '17:00:00', 'work'),
('a50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', '2024-01-15', '09:00:00', '18:00:00', 'work'),
('a50e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', '2024-01-15', '08:30:00', '17:30:00', 'work'),
('a50e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440004', '2024-01-15', '10:00:00', '19:00:00', 'work'),
('a50e8400-e29b-41d4-a716-446655440005', '950e8400-e29b-41d4-a716-446655440001', '2024-01-15', '12:00:00', '13:00:00', 'break'),
('a50e8400-e29b-41d4-a716-446655440006', '950e8400-e29b-41d4-a716-446655440002', '2024-01-15', '14:00:00', '15:00:00', 'meeting');

-- ============================================================================
-- METAS DE EXEMPLO
-- ============================================================================

INSERT INTO goals (id, title, description, target_value, current_value, unit, deadline, status) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'Tickets Resolvidos', 'Meta de tickets resolvidos no mês', 100, 75, 'tickets', '2024-01-31', 'active'),
('b50e8400-e29b-41d4-a716-446655440002', 'Satisfação do Cliente', 'Meta de satisfação do cliente', 4.5, 4.2, 'pontos', '2024-01-31', 'active'),
('b50e8400-e29b-41d4-a716-446655440003', 'Tempo de Resposta', 'Meta de tempo médio de resposta', 2, 1.8, 'horas', '2024-01-31', 'active'),
('b50e8400-e29b-41d4-a716-446655440004', 'Novos Clientes', 'Meta de novos clientes no mês', 20, 15, 'clientes', '2024-01-31', 'active'),
('b50e8400-e29b-41d4-a716-446655440005', 'Artigos Publicados', 'Meta de artigos publicados', 10, 8, 'artigos', '2024-01-31', 'active');
