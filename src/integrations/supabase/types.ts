// Tipos do banco de dados Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER' | 'SUPPORT';
          status: 'active' | 'inactive' | 'pending';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          role?: 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER' | 'SUPPORT';
          status?: 'active' | 'inactive' | 'pending';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER' | 'SUPPORT';
          status?: 'active' | 'inactive' | 'pending';
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone?: string;
          company?: string;
          status: 'active' | 'inactive' | 'prospect';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          company?: string;
          status?: 'active' | 'inactive' | 'prospect';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string;
          status?: 'active' | 'inactive' | 'prospect';
          created_at?: string;
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          title: string;
          description?: string;
          status: 'open' | 'in_progress' | 'resolved' | 'closed';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          client_id: string;
          assigned_to?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          client_id: string;
          assigned_to?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          client_id?: string;
          assigned_to?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          tags: string[];
          author_id: string;
          status: 'draft' | 'published' | 'archived' | 'review';
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: string;
          tags?: string[];
          author_id: string;
          status?: 'draft' | 'published' | 'archived' | 'review';
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: string;
          tags?: string[];
          author_id?: string;
          status?: 'draft' | 'published' | 'archived' | 'review';
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          department: string;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: string;
          department: string;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          department?: string;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
      schedules: {
        Row: {
          id: string;
          team_member_id: string;
          date: string;
          start_time: string;
          end_time: string;
          type: 'work' | 'break' | 'meeting';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_member_id: string;
          date: string;
          start_time: string;
          end_time: string;
          type?: 'work' | 'break' | 'meeting';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_member_id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          type?: 'work' | 'break' | 'meeting';
          created_at?: string;
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          title: string;
          description?: string;
          target_value: number;
          current_value: number;
          unit: string;
          deadline?: string;
          status: 'active' | 'completed' | 'paused';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          target_value: number;
          current_value?: number;
          unit: string;
          deadline?: string;
          status?: 'active' | 'completed' | 'paused';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          target_value?: number;
          current_value?: number;
          unit?: string;
          deadline?: string;
          status?: 'active' | 'completed' | 'paused';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}