import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { TicketsPage } from './pages/TicketsPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import EnhancedDashboard from './components/dashboard/EnhancedDashboard';
import { AppLayout } from './components/layouts/AppLayout';
import queryClient from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rota de login - pública */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Rota de acesso negado - pública */}
              <Route path="/403" element={<AccessDeniedPage />} />
              
              {/* Rota principal - Dashboard */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <EnhancedDashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rota de tickets */}
              <Route 
                path="/tickets" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TicketsPage />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rota para admin - protegida com role específico */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <AppLayout>
                      <div className="min-h-screen bg-gray-50 p-6">
                        <div className="max-w-7xl mx-auto">
                          <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Painel Administrativo
                          </h1>
                          <p className="text-muted-foreground">
                            Esta área é restrita apenas para administradores.
                          </p>
                        </div>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rota para manager - protegida com role específico */}
              <Route 
                path="/manager" 
                element={
                  <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                    <AppLayout>
                      <div className="min-h-screen bg-gray-50 p-6">
                        <div className="max-w-7xl mx-auto">
                          <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Painel de Gerência
                          </h1>
                          <p className="text-muted-foreground">
                            Esta área é restrita para administradores e gerentes.
                          </p>
                        </div>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rota fallback - 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
