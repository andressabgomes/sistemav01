import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export interface ClientFilters {
  page?: number;
  pageSize?: number;
  status?: Client['status'];
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

class SupabaseClientService {
  /**
   * Listar clientes com paginação e filtros
   */
  async listClients(filters: ClientFilters = {}): Promise<PaginatedResponse<Client>> {
    const { page = 1, pageSize = 10, status, search } = filters;
    const offset = (page - 1) * pageSize;

    try {
      let query = supabase
        .from('clients')
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (status) {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
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
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  }

  /**
   * Obter cliente por ID
   */
  async getClient(id: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Cliente não encontrado
        }
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Erro ao obter cliente:', error);
      throw error;
    }
  }

  /**
   * Criar novo cliente
   */
  async createClient(clientData: ClientInsert): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
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
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  /**
   * Atualizar cliente
   */
  async updateClient(id: string, updates: ClientUpdate): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
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
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  /**
   * Deletar cliente
   */
  async deleteClient(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  }

  /**
   * Buscar clientes por termo
   */
  async searchClients(term: string): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${term}%,email.ilike.%${term}%,company.ilike.%${term}%`)
        .limit(20);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  /**
   * Obter estatísticas dos clientes
   */
  async getClientStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    prospects: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('status');

      if (error) {
        throw new Error(error.message);
      }

      const stats = {
        total: data?.length || 0,
        active: data?.filter(c => c.status === 'active').length || 0,
        inactive: data?.filter(c => c.status === 'inactive').length || 0,
        prospects: data?.filter(c => c.status === 'prospect').length || 0,
      };

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas dos clientes:', error);
      throw error;
    }
  }
}

export default new SupabaseClientService();
