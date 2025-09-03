import { Ticket, TicketStatus, TicketPriority, TicketFilters } from '@/types/entities';

interface TicketResponse {
  success: boolean;
  data?: Ticket | Ticket[];
  error?: string;
  message?: string;
}

interface PaginatedTicketResponse extends TicketResponse {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class TicketService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_XANO_BASE_URL || '';
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('starprint.token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getTickets(filters?: TicketFilters): Promise<PaginatedTicketResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(`${this.baseURL}/tickets?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.tickets || data,
          pagination: data.pagination,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao buscar tickets',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async getTicket(id: string): Promise<TicketResponse> {
    try {
      const response = await fetch(`${this.baseURL}/tickets/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.ticket || data,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao buscar ticket',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async createTicket(ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<TicketResponse> {
    try {
      const response = await fetch(`${this.baseURL}/tickets`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.ticket || data,
          message: 'Ticket criado com sucesso',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao criar ticket',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async updateTicket(id: string, ticketData: Partial<Ticket>): Promise<TicketResponse> {
    try {
      const response = await fetch(`${this.baseURL}/tickets/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.ticket || data,
          message: 'Ticket atualizado com sucesso',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao atualizar ticket',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async deleteTicket(id: string): Promise<TicketResponse> {
    try {
      const response = await fetch(`${this.baseURL}/tickets/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Ticket excluído com sucesso',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao excluir ticket',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async updateTicketStatus(id: string, status: TicketStatus): Promise<TicketResponse> {
    try {
      const response = await fetch(`${this.baseURL}/tickets/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.ticket || data,
          message: 'Status do ticket atualizado com sucesso',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao atualizar status do ticket',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async updateTicketPriority(id: string, priority: TicketPriority): Promise<TicketResponse> {
    try {
      const response = await fetch(`${this.baseURL}/tickets/${id}/priority`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ priority }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.ticket || data,
          message: 'Prioridade do ticket atualizada com sucesso',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao atualizar prioridade do ticket',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async assignTicket(id: string, agentId: string): Promise<TicketResponse> {
    try {
      const response = await fetch(`${this.baseURL}/tickets/${id}/assign`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ agent_id: agentId }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.ticket || data,
          message: 'Ticket atribuído com sucesso',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao atribuir ticket',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }
}

export default new TicketService();
