import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { StatCard } from './StatCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

describe('StatCard', () => {
  const defaultProps = {
    title: 'Teste de Título',
    value: '123',
    subtitle: 'Subtítulo de teste',
    icon: TrendingUp,
    description: 'Descrição de teste',
  };

  it('renderiza corretamente com todas as props', () => {
    render(<StatCard {...defaultProps} />);
    
    expect(screen.getByText('Teste de Título')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Subtítulo de teste')).toBeInTheDocument();
    expect(screen.getByText('Descrição de teste')).toBeInTheDocument();
  });

  it('renderiza com tendência positiva', () => {
    render(
      <StatCard
        {...defaultProps}
        trend="up"
        trendValue="+15%"
      />
    );
    
    expect(screen.getByText('+15%')).toBeInTheDocument();
    expect(screen.getByTestId('trend-icon')).toHaveClass('text-green-600');
  });

  it('renderiza com tendência negativa', () => {
    render(
      <StatCard
        {...defaultProps}
        trend="down"
        trendValue="-8%"
      />
    );
    
    expect(screen.getByText('-8%')).toBeInTheDocument();
    expect(screen.getByTestId('trend-icon')).toHaveClass('text-red-600');
  });

  it('renderiza sem tendência', () => {
    render(<StatCard {...defaultProps} />);
    
    expect(screen.queryByTestId('trend-icon')).not.toBeInTheDocument();
  });

  it('aplica classes CSS corretas para diferentes variantes', () => {
    const { rerender } = render(
      <StatCard {...defaultProps} variant="default" />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('bg-card');
    
    rerender(<StatCard {...defaultProps} variant="secondary" />);
    expect(card).toHaveClass('bg-muted');
  });

  it('renderiza com ícone personalizado', () => {
    render(<StatCard {...defaultProps} icon={TrendingDown} />);
    
    const icon = screen.getByTestId('stat-icon');
    expect(icon).toBeInTheDocument();
  });

  it('aplica classes de cor corretas para diferentes status', () => {
    const { rerender } = render(
      <StatCard {...defaultProps} status="success" />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('border-green-200');
    
    rerender(<StatCard {...defaultProps} status="warning" />);
    expect(card).toHaveClass('border-yellow-200');
    
    rerender(<StatCard {...defaultProps} status="error" />);
    expect(card).toHaveClass('border-red-200');
  });

  it('renderiza com loading state', () => {
    render(<StatCard {...defaultProps} isLoading={true} />);
    
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('123')).not.toBeInTheDocument();
  });

  it('renderiza com estado de erro', () => {
    render(
      <StatCard
        {...defaultProps}
        error="Erro ao carregar dados"
      />
    );
    
    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('aplica classes responsivas corretamente', () => {
    render(<StatCard {...defaultProps} />);
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('p-4', 'md:p-6');
  });
});
