import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Se já estiver autenticado, redirecionar para o dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Se estiver autenticado, não mostrar nada (será redirecionado)
  if (isAuthenticated) {
    return null;
  }

  return <LoginForm />;
};

export default LoginPage;
