import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Ticket = Database['public']['Tables']['tickets']['Row'];
type TicketInsert = Database['public']['Tables']['tickets']['Insert'];
type TicketUpdate = Database['public']['Tables']['tickets']['Update'];

export interface TicketFilters {
  page?: number;
  pageSize?: number;
  status?: Ticket['status'];
  priority?: Ticket['priority'];
  client_id?: string;
  assigned_to?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class SupabaseTicketService {
  /**
   * Listar tickets com paginação e filtros
   */
  async listTickets(filters: TicketFilters = {}): Promise<PaginatedResponse<Ticket>> {
    const { 
      page = 1, 
      pageSize = 10, 
      status, 
      priority, 
      client_id, 
      assigned_to, 
      search 
    } = filters;
    const offset = (page - 1) * pageSize;

    try {
      let query = supabase
        .from('tickets')
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (status) {
        query = query.eq('status', status);
      }

      if (priority) {
        query = query.eq('priority', priority);
      }

      if (client_id) {
        query = query.eq('client_id', client_id);
      }

      if (assigned_to) {
        query = query.eq('assigned_to', assigned_to);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Aplicar paginação
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: data || [],
        pagination: {
          page,
          limit: pageSize,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Erro ao listar tickets:', error);
      throw error;
    }
  }

  /**
   * Obter ticket por ID
   */
  async getTicket(id: string): Promise<Ticket | null> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Ticket não encontrado
        }
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Erro ao obter ticket:', error);
      throw error;
    }
  }

  /**
   * Criar novo ticket
   */
  async createTicket(ticketData: TicketInsert): Promise<Ticket> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          ...ticketData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      throw error;
    }
  }

  /**
   * Atualizar ticket
   */
  async updateTicket(id: string, updates: TicketUpdate): Promise<Ticket> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error);
      throw error;
    }
  }

  /**
   * Deletar ticket
   */
  async deleteTicket(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar ticket:', error);
      throw error;
    }
  }

  /**
   * Atribuir ticket a um usuário
   */
  async assignTicket(ticketId: string, userId: string): Promise<Ticket> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update({
          assigned_to: userId,
          status: 'in_progress',
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Erro ao atribuir ticket:', error);
      throw error;
    }
  }

  /**
   * Alterar status do ticket
   */
  async updateTicketStatus(ticketId: string, status: Ticket['status']): Promise<Ticket> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar status do ticket:', error);
      throw error;
    }
  }

  /**
   * Obter estatísticas dos tickets
   */
  async getTicketStats(): Promise<{
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
    urgent: number;
    high: number;
    medium: number;
    low: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('status, priority');

      if (error) {
        throw new Error(error.message);
      }

      const stats = {
        total: data?.length || 0,
        open: data?.filter(t => t.status === 'open').length || 0,
        in_progress: data?.filter(t => t.status === 'in_progress').length || 0,
        resolved: data?.filter(t => t.status === 'resolved').length || 0,
        closed: data?.filter(t => t.status === 'closed').length || 0,
        urgent: data?.filter(t => t.priority === 'urgent').length || 0,
        high: data?.filter(t => t.priority === 'high').length || 0,
        medium: data?.filter(t => t.priority === 'medium').length || 0,
        low: data?.filter(t => t.priority === 'low').length || 0,
      };

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas dos tickets:', error);
      throw error;
    }
  }

  /**
   * Obter tickets por cliente
   */
  async getTicketsByClient(clientId: string): Promise<Ticket[]> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao obter tickets do cliente:', error);
      throw error;
    }
  }
}

export default new SupabaseTicketService();
