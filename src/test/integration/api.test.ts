import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server, setupTestServer } from '../mocks/server';
import { rest } from 'msw';

// Configurar o servidor de teste
setupTestServer();

describe('API Integration Tests', () => {
  describe('Autenticação', () => {
    it('faz login com credenciais válidas', async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('test@example.com');
      expect(data.token).toBeDefined();
    });

    it('faz logout com sucesso', async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token',
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Logout realizado com sucesso');
    });

    it('obtém dados do usuário autenticado', async () => {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': 'Bearer mock-token',
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user.id).toBe('test-user-id');
      expect(data.user.role).toBe('admin');
    });
  });

  describe('Clientes', () => {
    it('lista todos os clientes', async () => {
      const response = await fetch('/api/clients');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.clients).toHaveLength(2);
      expect(data.total).toBe(2);
      expect(data.clients[0].name).toBe('Cliente Teste 1');
    });

    it('obtém cliente específico por ID', async () => {
      const response = await fetch('/api/clients/1');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe('1');
      expect(data.name).toBe('Cliente 1');
      expect(data.status).toBe('active');
    });

    it('cria novo cliente', async () => {
      const newClient = {
        name: 'Novo Cliente',
        email: 'novo@cliente.com',
        phone: '(11) 77777-7777',
      };

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.id).toBe('new-client-id');
      expect(data.message).toBe('Cliente criado com sucesso');
    });
  });

  describe('Atendimento', () => {
    it('obtém estatísticas de atendimento', async () => {
      const response = await fetch('/api/atendimento/stats');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.atendimentosHoje).toBe(127);
      expect(data.tempoMedioResposta).toBe('2.3min');
      expect(data.taxaResolucao).toBe('94.2%');
      expect(data.satisfacaoMedia).toBe('4.2/5');
    });

    it('lista tickets de atendimento', async () => {
      const response = await fetch('/api/atendimento/tickets');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.tickets).toHaveLength(2);
      expect(data.tickets[0].cliente).toBe('João Silva');
      expect(data.tickets[0].status).toBe('aberto');
    });
  });

  describe('Equipe', () => {
    it('lista membros da equipe', async () => {
      const response = await fetch('/api/team/members');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.members).toHaveLength(2);
      expect(data.members[0].name).toBe('Ana Costa');
      expect(data.members[0].status).toBe('online');
    });

    it('obtém performance da equipe', async () => {
      const response = await fetch('/api/team/performance');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.suporte.meta).toBe(90);
      expect(data.suporte.atual).toBe(87);
      expect(data.vendas.atual).toBe(92);
    });
  });

  describe('Relatórios', () => {
    it('obtém relatório de vendas', async () => {
      const response = await fetch('/api/reports/sales');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.period).toBe('2024-01');
      expect(data.total).toBe(150000);
      expect(data.growth).toBe(12.5);
      expect(data.categories).toHaveLength(3);
    });

    it('obtém relatório de clientes', async () => {
      const response = await fetch('/api/reports/customers');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.total).toBe(1250);
      expect(data.newThisMonth).toBe(45);
      expect(data.active).toBe(980);
    });
  });

  describe('Tratamento de Erros', () => {
    it('retorna 404 para endpoint inexistente', async () => {
      // Adicionar handler temporário para simular erro 404
      server.use(
        rest.get('/api/nonexistent', (req, res, ctx) => {
          return res(ctx.status(404));
        })
      );

      const response = await fetch('/api/nonexistent');
      expect(response.status).toBe(404);
    });

    it('retorna 500 para erro interno do servidor', async () => {
      // Adicionar handler temporário para simular erro 500
      server.use(
        rest.get('/api/error', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      const response = await fetch('/api/error');
      expect(response.status).toBe(500);
    });
  });

  describe('Headers e Autenticação', () => {
    it('inclui headers de autorização corretos', async () => {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(200);
    });

    it('rejeita requisição sem token de autorização', async () => {
      // Adicionar handler temporário para simular erro de autorização
      server.use(
        rest.get('/api/protected', (req, res, ctx) => {
          const authHeader = req.headers.get('Authorization');
          if (!authHeader) {
            return res(ctx.status(401));
          }
          return res(ctx.status(200));
        })
      );

      const response = await fetch('/api/protected');
      expect(response.status).toBe(401);
    });
  });
});
