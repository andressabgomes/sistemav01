import { Ticket, TicketStatus, TicketPriority } from '@/types/entities';
import supabaseTicketService from './supabaseTicketService';

interface TicketResponse {
  success: boolean;
  data?: Ticket | Ticket[];
  error?: string;
}

interface TicketFilters {
  page?: number;
  pageSize?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  customer_id?: string;
  assigned_user_id?: string;
  search?: string;
}

class TicketService {
  /**
   * Listar tickets com filtros
   */
  async listTickets(filters: TicketFilters = {}): Promise<TicketResponse> {
    try {
      const response = await supabaseTicketService.listTickets(filters);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao listar tickets'
      };
    }
  }

  /**
   * Obter ticket por ID
   */
  async getTicket(id: string): Promise<TicketResponse> {
    try {
      const ticket = await supabaseTicketService.getTicket(id);
      
      if (!ticket) {
        return {
          success: false,
          error: 'Ticket não encontrado'
        };
      }

      return {
        success: true,
        data: ticket
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao obter ticket'
      };
    }
  }

  /**
   * Criar novo ticket
   */
  async createTicket(ticketData: {
    title: string;
    description?: string;
    priority?: TicketPriority;
    client_id: string;
    assigned_to?: string;
  }): Promise<TicketResponse> {
    try {
      const ticket = await supabaseTicketService.createTicket({
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority || 'medium',
        status: 'open',
        client_id: ticketData.client_id,
        assigned_to: ticketData.assigned_to,
      });

      return {
        success: true,
        data: ticket
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar ticket'
      };
    }
  }

  /**
   * Atualizar ticket
   */
  async updateTicket(id: string, updates: {
    title?: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    assigned_to?: string;
  }): Promise<TicketResponse> {
    try {
      const ticket = await supabaseTicketService.updateTicket(id, updates);

      return {
        success: true,
        data: ticket
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar ticket'
      };
    }
  }

  /**
   * Deletar ticket
   */
  async deleteTicket(id: string): Promise<TicketResponse> {
    try {
      await supabaseTicketService.deleteTicket(id);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao deletar ticket'
      };
    }
  }

  /**
   * Atribuir ticket
   */
  async assignTicket(ticketId: string, userId: string): Promise<TicketResponse> {
    try {
      const ticket = await supabaseTicketService.assignTicket(ticketId, userId);

      return {
        success: true,
        data: ticket
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atribuir ticket'
      };
    }
  }

  /**
   * Atualizar status do ticket
   */
  async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<TicketResponse> {
    try {
      const ticket = await supabaseTicketService.updateTicketStatus(ticketId, status);

      return {
        success: true,
        data: ticket
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar status do ticket'
      };
    }
  }

  /**
   * Obter estatísticas dos tickets
   */
  async getTicketStats(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const stats = await supabaseTicketService.getTicketStats();

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao obter estatísticas'
      };
    }
  }

  /**
   * Obter tickets por cliente
   */
  async getTicketsByClient(clientId: string): Promise<TicketResponse> {
    try {
      const tickets = await supabaseTicketService.getTicketsByClient(clientId);

      return {
        success: true,
        data: tickets
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao obter tickets do cliente'
      };
    }
  }
}

export default new TicketService();