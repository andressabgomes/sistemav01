import apiClient from '../lib/apiClient';
import { Ticket, TicketFilters, PaginatedResponse, ApiResponse } from '../types';

export interface CreateTicketPayload {
  subject: string;
  description: string;
  priority: Ticket['priority'];
  customer_id: string;
  assigned_user_id?: string;
  assigned_team_id?: string;
}

export interface ListTicketsResponse {
  success: boolean;
  data?: PaginatedResponse<Ticket>;
  error?: string;
}

export interface CreateTicketResponse {
  success: boolean;
  data?: Ticket;
  error?: string;
}

class TicketService {
  /**
   * Lista tickets com filtros e paginação
   */
  async listTickets(filters: TicketFilters = {}): Promise<ListTicketsResponse> {
    try {
      const params = new URLSearchParams();
      
      // Adicionar filtros como query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await apiClient.get<PaginatedResponse<Ticket>>(`/tickets?${params.toString()}`);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao listar tickets';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Cria um novo ticket
   */
  async createTicket(payload: CreateTicketPayload): Promise<CreateTicketResponse> {
    try {
      const response = await apiClient.post<Ticket>('/tickets', payload);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar ticket';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Obtém um ticket específico por ID
   */
  async getTicket(id: string): Promise<{ success: boolean; data?: Ticket; error?: string }> {
    try {
      const response = await apiClient.get<Ticket>(`/tickets/${id}`);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao obter ticket';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Atualiza um ticket existente
   */
  async updateTicket(id: string, payload: Partial<CreateTicketPayload>): Promise<{ success: boolean; data?: Ticket; error?: string }> {
    try {
      const response = await apiClient.put<Ticket>(`/tickets/${id}`, payload);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar ticket';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Exclui um ticket
   */
  async deleteTicket(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      await apiClient.delete(`/tickets/${id}`);
      
      return {
        success: true,
        message: 'Ticket excluído com sucesso',
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir ticket';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Altera o status de um ticket
   */
  async updateTicketStatus(id: string, status: Ticket['status']): Promise<{ success: boolean; data?: Ticket; error?: string }> {
    try {
      const response = await apiClient.patch<Ticket>(`/tickets/${id}/status`, { status });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao alterar status do ticket';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Atribui um ticket a um usuário
   */
  async assignTicket(id: string, userId: string): Promise<{ success: boolean; data?: Ticket; error?: string }> {
    try {
      const response = await apiClient.patch<Ticket>(`/tickets/${id}/assign`, { 
        assigned_user_id: userId 
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atribuir ticket';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export default new TicketService();
