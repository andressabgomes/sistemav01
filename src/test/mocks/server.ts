import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Configurar o servidor do MSW para testes em Node.js
export const server = setupServer(...handlers);

// Configurar handlers antes de cada teste
export const setupTestServer = () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};

// Função helper para adicionar handlers temporários
export const addTemporaryHandlers = (temporaryHandlers: any[]) => {
  server.use(...temporaryHandlers);
};

// Função helper para limpar handlers temporários
export const clearTemporaryHandlers = () => {
  server.resetHandlers();
};
