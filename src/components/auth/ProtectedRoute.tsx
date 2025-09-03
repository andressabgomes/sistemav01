import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/entities';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Se roles específicos foram especificados, verificar permissão
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.includes(user.role);
    
    if (!hasRequiredRole) {
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children}</>;
};