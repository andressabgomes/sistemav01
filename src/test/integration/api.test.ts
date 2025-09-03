import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { handlers } from '../mocks/handlers';

// Configurar servidor MSW
const server = setupServer(...handlers);

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  server.close();
});

describe('API Integration Tests', () => {
  describe('Autenticação', () => {
    it('realiza login com sucesso', async () => {
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
      expect(data.token).toBeDefined();
    });

    it('realiza logout com sucesso', async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Logout realizado com sucesso');
    });

    it('obtém dados do usuário autenticado', async () => {
      const response = await fetch('/api/auth/me');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('test@example.com');
    });
  });

  describe('Clientes', () => {
    it('lista todos os clientes', async () => {
      const response = await fetch('/api/clients');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.clients).toBeDefined();
      expect(data.clients).toHaveLength(2);
      expect(data.total).toBe(2);
    });

    it('obtém cliente específico por ID', async () => {
      const response = await fetch('/api/clients/1');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe('1');
      expect(data.name).toBe('Cliente 1');
    });

    it('cria novo cliente', async () => {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Novo Cliente',
          email: 'novo@cliente.com',
          phone: '(11) 99999-9999',
        }),
      });

      expect(response.status).toBe(200);
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
    });

    it('lista tickets de atendimento', async () => {
      const response = await fetch('/api/atendimento/tickets');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.tickets).toBeDefined();
      expect(data.tickets).toHaveLength(2);
    });
  });

  describe('Equipe', () => {
    it('lista membros da equipe', async () => {
      const response = await fetch('/api/team/members');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.members).toBeDefined();
      expect(data.members).toHaveLength(2);
    });

    it('obtém performance da equipe', async () => {
      const response = await fetch('/api/team/performance');

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.suporte).toBeDefined();
      expect(data.vendas).toBeDefined();
      expect(data.retencao).toBeDefined();
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
        http.get('/api/nonexistent', () => {
          return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
        })
      );

      const response = await fetch('/api/nonexistent');
      expect(response.status).toBe(404);
    });

    it('retorna 500 para erro interno do servidor', async () => {
      // Adicionar handler temporário para simular erro 500
      server.use(
        http.get('/api/error', () => {
          return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
          'Authorization': 'Bearer mock-jwt-token',
        },
      });

      expect(response.status).toBe(200);
    });

    it('rejeita requisição sem token de autorização', async () => {
      // Adicionar handler temporário para simular erro de autorização
      server.use(
        http.get('/api/protected', ({ request }) => {
          const authHeader = request.headers.get('Authorization');
          if (!authHeader) {
            return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }
          return HttpResponse.json({ message: 'Authorized' });
        })
      );

      const response = await fetch('/api/protected');
      expect(response.status).toBe(401);
    });
  });
});
