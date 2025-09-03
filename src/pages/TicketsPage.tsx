import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import ticketService from '../services/ticketService';
import { TicketFilters } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  MessageCircle,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Ticket, TicketStatus, TicketPriority } from '@/types/entities';

export const TicketsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    pageSize: 10,
  });

  // Query para buscar tickets
  const {
    data: ticketsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketService.listTickets(filters),
    refetchInterval: 15000, // Refetch a cada 15 segundos
  });

  const handleFilterChange = (key: keyof TicketFilters, value: string | number | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset para primeira página ao alterar filtros
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">
              Erro ao carregar tickets. Tente novamente.
            </div>
            <button
              onClick={() => refetch()}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tickets = ticketsResponse?.data?.data || [];
  const pagination = ticketsResponse?.data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gerenciamento de Tickets
              </h1>
              <p className="text-gray-600">
                Bem-vindo, {user?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Role: {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                name="status-filter"
                aria-label="Filtrar por status"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todos</option>
                <option value="open">Aberto</option>
                <option value="in_progress">Em Progresso</option>
                <option value="resolved">Resolvido</option>
                <option value="closed">Fechado</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Prioridade
              </label>
              <select
                id="priority-filter"
                name="priority-filter"
                aria-label="Filtrar por prioridade"
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todas</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Busca
              </label>
              <input
                type="text"
                placeholder="Buscar por assunto..."
                value={filters.q || ''}
                onChange={(e) => handleFilterChange('q', e.target.value || undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="page-size-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Por Página
              </label>
              <select
                id="page-size-filter"
                name="page-size-filter"
                aria-label="Selecionar quantidade por página"
                value={filters.pageSize || 10}
                onChange={(e) => handleFilterChange('pageSize', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Tickets */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Tickets ({pagination?.total || 0})
            </h2>
          </div>

          {tickets.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">Nenhum ticket encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assunto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioridade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Atribuído
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.subject}
                        </div>
                        {ticket.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {ticket.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status === 'in_progress' ? 'Em Progresso' : 
                           ticket.status === 'open' ? 'Aberto' :
                           ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority === 'urgent' ? 'Urgente' :
                           ticket.priority === 'high' ? 'Alta' :
                           ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.customer_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.assigned_user_id || 'Não atribuído'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a{' '}
                  {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
                  {pagination.total} resultados
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-700">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
