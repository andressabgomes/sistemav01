import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  alert?: string;
  variant?: 'default' | 'secondary';
  status?: 'success' | 'warning' | 'error';
  isLoading?: boolean;
  error?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  description, 
  alert,
  variant = 'default',
  status,
  isLoading = false,
  error
}: StatCardProps) => {
  if (isLoading) {
    return (
      <Card data-testid="stat-card" className="p-4 md:p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-48" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 md:p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" data-testid="error-icon" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  const variantClasses = {
    default: 'bg-card',
    secondary: 'bg-muted'
  };

  const statusClasses = {
    success: 'border-green-200',
    warning: 'border-yellow-200',
    error: 'border-red-200'
  };

  return (
    <Card 
      data-testid="stat-card"
      className={`group relative overflow-hidden hover:shadow-lg transition-all duration-300 p-4 md:p-6 ${variantClasses[variant]} ${status ? statusClasses[status] : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg">
                <Icon className="h-5 w-5 text-primary-foreground" data-testid="stat-icon" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                  {title}
                </CardTitle>
                {trendValue && (
                  <div className={`flex items-center text-xs font-medium ${
                    trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    <div 
                      data-testid="trend-icon"
                      className={`h-3 w-3 mr-1 ${
                        trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {trend === 'up' ? 
                        <TrendingUp className="h-3 w-3" /> : 
                        <TrendingDown className="h-3 w-3" />
                      }
                    </div>
                    {trendValue}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground tracking-tight">{value}</div>
              <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      {description && (
        <CardContent className="pt-0 pb-4 relative z-10">
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{description}</p>
          {alert && (
            <Badge variant="destructive" className="text-xs font-medium">
              <AlertCircle className="h-3 w-3 mr-1" />
              {alert}
            </Badge>
          )}
        </CardContent>
      )}
    </Card>
  );
};