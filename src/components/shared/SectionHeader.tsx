import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
  description?: string;
  isLoading?: boolean;
  actions?: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }>;
  badges?: Array<{
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }>;
}

export const SectionHeader = ({ 
  title, 
  subtitle, 
  emoji, 
  children, 
  size = 'lg',
  align = 'left',
  description,
  isLoading = false,
  actions,
  badges
}: SectionHeaderProps) => {
  if (isLoading) {
    return (
      <div data-testid="loading-skeleton" className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <div 
      data-testid="section-header-container"
      className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border ${alignClasses[align]}`}
    >
      <div className="space-y-2">
        <h1 
          data-testid="section-header"
          className={`${sizeClasses[size]} font-bold text-foreground flex items-center gap-2`}
        >
          {emoji && <span data-testid="section-icon">{emoji}</span>}
          {title}
        </h1>
        {subtitle && (
          <p data-testid="section-subtitle" className="text-base md:text-lg text-muted-foreground font-medium">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {badges && (
          <div className="flex gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant}>
                {badge.text}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions && (
          <div className="flex gap-2">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.onClick}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};