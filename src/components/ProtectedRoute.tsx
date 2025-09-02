import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  redirectTo = '/login',
}) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Se ainda está carregando, não renderizar nada
  if (loading) {
    return null;
  }

  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se roles foram especificados, verificar se o usuário tem permissão
  if (roles && roles.length > 0) {
    if (!roles.includes(user.role)) {
      // Usuário não tem role necessário, redirecionar para 403
      return <Navigate to="/403" replace />;
    }
  }

  // Usuário autenticado e com permissão, renderizar children
  return <>{children}</>;
};

export default ProtectedRoute;
