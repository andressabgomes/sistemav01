import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { SectionHeader } from './SectionHeader';
import { Plus, Download, Filter } from 'lucide-react';

describe('SectionHeader', () => {
  const defaultProps = {
    title: 'Título da Seção',
    subtitle: 'Subtítulo da seção',
  };

  it('renderiza corretamente com título e subtítulo', () => {
    render(<SectionHeader {...defaultProps} />);
    
    expect(screen.getByText('Título da Seção')).toBeInTheDocument();
    expect(screen.getByText('Subtítulo da seção')).toBeInTheDocument();
  });

  it('renderiza apenas com título quando não há subtítulo', () => {
    render(<SectionHeader title="Título Simples" />);
    
    expect(screen.getByText('Título Simples')).toBeInTheDocument();
    expect(screen.queryByTestId('section-subtitle')).not.toBeInTheDocument();
  });

  it('renderiza ações quando fornecidas', () => {
    const actions = [
      { label: 'Adicionar', icon: Plus, onClick: () => {} },
      { label: 'Exportar', icon: Download, onClick: () => {} },
    ];

    render(<SectionHeader {...defaultProps} actions={actions} />);
    
    expect(screen.getByText('Adicionar')).toBeInTheDocument();
    expect(screen.getByText('Exportar')).toBeInTheDocument();
  });

  it('renderiza badges quando fornecidos', () => {
    const badges = [
      { text: 'Ativo', variant: 'default' as const },
      { text: 'Novo', variant: 'secondary' as const },
    ];

    render(<SectionHeader {...defaultProps} badges={badges} />);
    
    expect(screen.getByText('Ativo')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('renderiza com variante de tamanho grande', () => {
    render(<SectionHeader {...defaultProps} size="lg" />);
    
    const header = screen.getByTestId('section-header');
    expect(header).toHaveClass('text-3xl');
  });

  it('renderiza com variante de tamanho pequeno', () => {
    render(<SectionHeader {...defaultProps} size="sm" />);
    
    const header = screen.getByTestId('section-header');
    expect(header).toHaveClass('text-xl');
  });

  it('aplica classes de alinhamento corretas', () => {
    const { rerender } = render(
      <SectionHeader {...defaultProps} align="left" />
    );
    
    let container = screen.getByTestId('section-header-container');
    expect(container).toHaveClass('text-left');
    
    rerender(<SectionHeader {...defaultProps} align="center" />);
    container = screen.getByTestId('section-header-container');
    expect(container).toHaveClass('text-center');
    
    rerender(<SectionHeader {...defaultProps} align="right" />);
    container = screen.getByTestId('section-header-container');
    expect(container).toHaveClass('text-right');
  });

  it('renderiza com descrição adicional', () => {
    render(
      <SectionHeader
        {...defaultProps}
        description="Descrição adicional da seção"
      />
    );
    
    expect(screen.getByText('Descrição adicional da seção')).toBeInTheDocument();
  });

  it('renderiza com loading state', () => {
    render(<SectionHeader {...defaultProps} isLoading={true} />);
    
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Título da Seção')).not.toBeInTheDocument();
  });

  it('aplica classes responsivas corretamente', () => {
    render(<SectionHeader {...defaultProps} size="md" />);
    
    const header = screen.getByTestId('section-header');
    expect(header).toHaveClass('text-2xl', 'md:text-3xl');
  });

  it('renderiza com ícone personalizado', () => {
    render(
      <SectionHeader
        {...defaultProps}
        emoji="🚀"
      />
    );
    
    const icon = screen.getByTestId('section-icon');
    expect(icon).toBeInTheDocument();
  });

  it('chama função onClick das ações quando clicadas', () => {
    const mockOnClick = vi.fn();
    const actions = [
      { label: 'Teste', icon: Plus, onClick: mockOnClick },
    ];

    render(<SectionHeader {...defaultProps} actions={actions} />);
    
    const actionButton = screen.getByText('Teste');
    actionButton.click();
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
