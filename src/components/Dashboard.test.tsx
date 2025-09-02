import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { Dashboard } from './Dashboard';

// Mock dos componentes externos
vi.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-tooltip">{children}</div>,
  ChartTooltipContent: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-tooltip-content">{children}</div>,
}));

vi.mock('recharts', () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: ({ children }: { children: React.ReactNode }) => <div data-testid="area">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
}));

describe('Dashboard', () => {
  it('renderiza o título principal do dashboard', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Dashboard StarPrint CRM')).toBeInTheDocument();
  });

  it('renderiza a data atual no subtítulo', () => {
    render(<Dashboard />);
    
    const today = new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    expect(screen.getByText(`Visão geral do sistema de atendimento • ${today}`)).toBeInTheDocument();
  });

  it('renderiza o badge de status do sistema', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Sistema Online')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('renderiza o badge de atualização', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Atualizado há 2min')).toBeInTheDocument();
    expect(screen.getByText('2min')).toBeInTheDocument();
  });

  it('renderiza os cards de estatísticas principais', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Atendimentos Ativos')).toBeInTheDocument();
    expect(screen.getByText('Taxa de Resolução')).toBeInTheDocument();
    expect(screen.getByText('Satisfação Média')).toBeInTheDocument();
    expect(screen.getByText('Tempo Médio de Resposta')).toBeInTheDocument();
  });

  it('renderiza os valores das estatísticas', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('23')).toBeInTheDocument();
    expect(screen.getByText('89%')).toBeInTheDocument();
    expect(screen.getByText('4.2/5')).toBeInTheDocument();
    expect(screen.getByText('2.3min')).toBeInTheDocument();
  });

  it('renderiza os subtítulos das estatísticas', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('12 na fila de espera')).toBeInTheDocument();
    expect(screen.getByText('+5% vs. semana passada')).toBeInTheDocument();
    expect(screen.getByText('+0.3 vs. mês passado')).toBeInTheDocument();
    expect(screen.getByText('-0.5min vs. semana passada')).toBeInTheDocument();
  });

  it('renderiza o gráfico de atendimentos', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('renderiza o gráfico de canais de atendimento', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Canais de Atendimento')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Telefone')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('renderiza as porcentagens dos canais', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('renderiza a seção de metas da equipe', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Metas da Equipe')).toBeInTheDocument();
    expect(screen.getByText('Suporte')).toBeInTheDocument();
    expect(screen.getByText('Vendas')).toBeInTheDocument();
    expect(screen.getByText('Retenção')).toBeInTheDocument();
  });

  it('renderiza as barras de progresso das metas', () => {
    render(<Dashboard />);
    
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(3);
  });

  it('renderiza os valores das metas', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('87%')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renderiza a seção de atividade recente', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Atividade Recente')).toBeInTheDocument();
  });

  it('renderiza a seção de próximas ações', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Próximas Ações')).toBeInTheDocument();
  });

  it('aplica classes CSS responsivas corretamente', () => {
    render(<Dashboard />);
    
    const container = screen.getByTestId('dashboard-container');
    expect(container).toHaveClass('min-h-screen', 'bg-gradient-to-br');
  });

  it('renderiza com layout responsivo', () => {
    render(<Dashboard />);
    
    const statsGrid = screen.getByTestId('stats-grid');
    expect(statsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'xl:grid-cols-4');
  });
});
