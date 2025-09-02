import { rest } from 'msw';

// Mock da API de autenticação
export const authHandlers = [
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          role: 'admin',
        },
        token: 'mock-jwt-token',
      })
    );
  }),

  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Logout realizado com sucesso' })
    );
  }),

  rest.get('/api/auth/me', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          role: 'admin',
        },
      })
    );
  }),
];

// Mock da API de clientes
export const clientHandlers = [
  rest.get('/api/clients', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
      })
    );
  }),

  rest.get('/api/clients/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id,
        name: `Cliente ${id}`,
        email: `cliente${id}@teste.com`,
        phone: '(11) 99999-9999',
        status: 'active',
      })
    );
  }),

  rest.post('/api/clients', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 'new-client-id',
        message: 'Cliente criado com sucesso',
      })
    );
  }),
];

// Mock da API de atendimento
export const atendimentoHandlers = [
  rest.get('/api/atendimento/stats', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        atendimentosHoje: 127,
        tempoMedioResposta: '2.3min',
        taxaResolucao: '94.2%',
        satisfacaoMedia: '4.2/5',
      })
    );
  }),

  rest.get('/api/atendimento/tickets', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
      })
    );
  }),
];

// Mock da API de equipe
export const teamHandlers = [
  rest.get('/api/team/members', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
      })
    );
  }),

  rest.get('/api/team/performance', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        suporte: { meta: 90, atual: 87 },
        vendas: { meta: 85, atual: 92 },
        retencao: { meta: 80, atual: 75 },
      })
    );
  }),
];

// Mock da API de relatórios
export const reportHandlers = [
  rest.get('/api/reports/sales', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        period: '2024-01',
        total: 150000,
        growth: 12.5,
        categories: [
          { name: 'Impressão', value: 80000 },
          { name: 'Plotagem', value: 45000 },
          { name: 'Digital', value: 25000 },
        ],
      })
    );
  }),

  rest.get('/api/reports/customers', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        total: 1250,
        newThisMonth: 45,
        active: 980,
        inactive: 270,
      })
    );
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
