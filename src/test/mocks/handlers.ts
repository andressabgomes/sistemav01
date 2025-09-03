import { http, HttpResponse } from 'msw';

// Mock da API de autenticação
export const authHandlers = [
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'admin',
      },
      token: 'mock-jwt-token',
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ message: 'Logout realizado com sucesso' });
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'admin',
      },
    });
  }),
];

// Mock da API de clientes
export const clientHandlers = [
  http.get('/api/clients', () => {
    return HttpResponse.json({
      clients: [
        {
          id: '1',
          name: 'Cliente Teste 1',
          email: 'cliente1@teste.com',
          phone: '(11) 99999-9999',
          status: 'active',
        },
        {
          id: '2',
          name: 'Cliente Teste 2',
          email: 'cliente2@teste.com',
          phone: '(11) 88888-8888',
          status: 'inactive',
        },
      ],
      total: 2,
    });
  }),

  http.get('/api/clients/:id', (req) => {
    const { id } = req.params;
    return HttpResponse.json({
      id,
      name: `Cliente ${id}`,
      email: `cliente${id}@teste.com`,
      phone: '(11) 99999-9999',
      status: 'active',
    });
  }),

  http.post('/api/clients', () => {
    return HttpResponse.json({
      id: 'new-client-id',
      message: 'Cliente criado com sucesso',
    });
  }),
];

// Mock da API de atendimento
export const atendimentoHandlers = [
  http.get('/api/atendimento/stats', () => {
    return HttpResponse.json({
      atendimentosHoje: 127,
      tempoMedioResposta: '2.3min',
      taxaResolucao: '94.2%',
      satisfacaoMedia: '4.2/5',
    });
  }),

  http.get('/api/atendimento/tickets', () => {
    return HttpResponse.json({
      tickets: [
        {
          id: '1',
          cliente: 'João Silva',
          assunto: 'Problema com impressão',
          status: 'aberto',
          prioridade: 'alta',
        },
        {
          id: '2',
          cliente: 'Maria Santos',
          assunto: 'Dúvida sobre orçamento',
          status: 'em_andamento',
          prioridade: 'média',
        },
      ],
      total: 2,
    });
  }),
];

// Mock da API de equipe
export const teamHandlers = [
  http.get('/api/team/members', () => {
    return HttpResponse.json({
      members: [
        {
          id: '1',
          name: 'Ana Costa',
          role: 'Atendente',
          status: 'online',
          atendimentos: 3,
        },
        {
          id: '2',
          name: 'Carlos Lima',
          role: 'Supervisor',
          status: 'busy',
          atendimentos: 5,
        },
      ],
      total: 2,
    });
  }),

  http.get('/api/team/performance', () => {
    return HttpResponse.json({
      suporte: { meta: 90, atual: 87 },
      vendas: { meta: 85, atual: 92 },
      retencao: { meta: 80, atual: 75 },
    });
  }),
];

// Mock da API de relatórios
export const reportHandlers = [
  http.get('/api/reports/sales', () => {
    return HttpResponse.json({
      period: '2024-01',
      total: 150000,
      growth: 12.5,
      categories: [
        { name: 'Impressão', value: 80000 },
        { name: 'Plotagem', value: 45000 },
        { name: 'Digital', value: 25000 },
      ],
    });
  }),

  http.get('/api/reports/customers', () => {
    return HttpResponse.json({
      total: 1250,
      newThisMonth: 45,
      active: 980,
      inactive: 270,
    });
  }),
];

// Combinar todos os handlers
export const handlers = [
  ...authHandlers,
  ...clientHandlers,
  ...atendimentoHandlers,
  ...teamHandlers,
  ...reportHandlers,
];
