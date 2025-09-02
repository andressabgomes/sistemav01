import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { DashboardAtendimento } from './DashboardAtendimento';

describe('DashboardAtendimento', () => {
  it('renderiza o título da página', () => {
    render(<DashboardAtendimento />);
    
    expect(screen.getByText('Dashboard de Atendimento')).toBeInTheDocument();
  });

  it('renderiza todos os cards de estatísticas', () => {
    render(<DashboardAtendimento />);
    
    expect(screen.getByText('Atendimentos Hoje')).toBeInTheDocument();
    expect(screen.getByText('Tempo Médio de Resposta')).toBeInTheDocument();
    expect(screen.getByText('Taxa de Resolução')).toBeInTheDocument();
    expect(screen.getByText('Satisfação Média')).toBeInTheDocument();
  });

  it('renderiza os valores corretos das estatísticas', () => {
    render(<DashboardAtendimento />);
    
    expect(screen.getByText('127')).toBeInTheDocument();
    expect(screen.getByText('2.3min')).toBeInTheDocument();
    expect(screen.getByText('94.2%')).toBeInTheDocument();
    expect(screen.getByText('4.2/5')).toBeInTheDocument();
  });

  it('renderiza as mudanças percentuais com cores corretas', () => {
    render(<DashboardAtendimento />);
    
    const upTrend = screen.getByText('+12%');
    expect(upTrend).toHaveClass('text-green-600');
    
    const downTrend = screen.getByText('-8%');
    expect(downTrend).toHaveClass('text-red-600');
  });

  it('renderiza a seção de atividade recente', () => {
    render(<DashboardAtendimento />);
    
    expect(screen.getByText('Atividade Recente')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
    expect(screen.getByText('Ana Lima')).toBeInTheDocument();
  });

  it('renderiza as ações dos clientes', () => {
    render(<DashboardAtendimento />);
    
    expect(screen.getByText('Iniciou chat')).toBeInTheDocument();
    expect(screen.getByText('Ticket resolvido')).toBeInTheDocument();
    expect(screen.getByText('Email respondido')).toBeInTheDocument();
    expect(screen.getByText('Chamada finalizada')).toBeInTheDocument();
  });

  it('renderiza os tempos das atividades', () => {
    render(<DashboardAtendimento />);
    
    expect(screen.getByText('2 min atrás')).toBeInTheDocument();
    expect(screen.getByText('5 min atrás')).toBeInTheDocument();
    expect(screen.getByText('8 min atrás')).toBeInTheDocument();
    expect(screen.getByText('12 min atrás')).toBeInTheDocument();
  });

  it('renderiza a seção de agentes online', () => {
    render(<DashboardAtendimento />);
    
    expect(screen.getByText('Agentes Online')).toBeInTheDocument();
    expect(screen.getByText('Ana Costa')).toBeInTheDocument();
    expect(screen.getByText('Carlos Lima')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Silva')).toBeInTheDocument();
  });

  it('renderiza os status dos agentes', () => {
    render(<DashboardAtendimento />);
    
    expect(screen.getByText('Disponível')).toBeInTheDocument();
    expect(screen.getByText('Ocupado')).toBeInTheDocument();
    expect(screen.getByText('Pausa')).toBeInTheDocument();
  });

  it('renderiza o número de atendimentos dos agentes', () => {
    render(<DashboardAtendimento />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renderiza os avatares dos agentes', () => {
    render(<DashboardAtendimento />);
    
    expect(screen.getByText('AC')).toBeInTheDocument();
    expect(screen.getByText('CL')).toBeInTheDocument();
    expect(screen.getByText('MS')).toBeInTheDocument();
    expect(screen.getByText('PS')).toBeInTheDocument();
  });

  it('aplica classes CSS responsivas corretamente', () => {
    render(<DashboardAtendimento />);
    
    const container = screen.getByTestId('dashboard-atendimento');
    expect(container).toHaveClass('p-6', 'space-y-6', 'h-full', 'overflow-auto');
  });

  it('renderiza o grid de estatísticas com layout responsivo', () => {
    render(<DashboardAtendimento />);
    
    const statsGrid = screen.getByTestId('stats-grid');
    expect(statsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  it('renderiza o grid de conteúdo com layout responsivo', () => {
    render(<DashboardAtendimento />);
    
    const contentGrid = screen.getByTestId('content-grid');
    expect(contentGrid).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
  });

  it('renderiza os indicadores de status com cores corretas', () => {
    render(<DashboardAtendimento />);
    
    const statusIndicators = screen.getAllByTestId('status-indicator');
    expect(statusIndicators).toHaveLength(4);
    
    // Verificar se os indicadores têm as classes de cor corretas
    expect(statusIndicators[0]).toHaveClass('bg-green-500'); // ativo
    expect(statusIndicators[1]).toHaveClass('bg-blue-500'); // resolvido
    expect(statusIndicators[2]).toHaveClass('bg-yellow-500'); // respondido
    expect(statusIndicators[3]).toHaveClass('bg-gray-500'); // finalizado
  });

  it('renderiza os cards com padding correto', () => {
    render(<DashboardAtendimento />);
    
    const cards = screen.getAllByTestId('stat-card');
    cards.forEach(card => {
      expect(card).toHaveClass('p-6');
    });
  });

  it('renderiza os ícones das estatísticas', () => {
    render(<DashboardAtendimento />);
    
    const icons = screen.getAllByTestId('stat-icon');
    expect(icons).toHaveLength(4);
  });
});
