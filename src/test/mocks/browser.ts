import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configurar o worker do MSW para o ambiente de teste
export const worker = setupWorker(...handlers);

// Inicializar o worker quando necessário
export const startWorker = () => {
  if (process.env.NODE_ENV === 'test') {
    worker.start({
      onUnhandledRequest: 'bypass', // Ignorar requisições não tratadas
    });
  }
};

// Parar o worker quando necessário
export const stopWorker = () => {
  if (process.env.NODE_ENV === 'test') {
    worker.stop();
  }
};
