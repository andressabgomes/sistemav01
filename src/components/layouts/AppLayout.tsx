import React, { memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = memo(({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">Sistema V01</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Dashboard
              </a>
              <a href="/tickets" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Tickets
              </a>
              {user?.role === 'ADMIN' && (
                <a href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Admin
                </a>
              )}
              {['ADMIN', 'MANAGER'].includes(user?.role || '') && (
                <a href="/manager" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Gerência
                </a>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {user?.role}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';