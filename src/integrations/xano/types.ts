// Tipos para o Xano.io

export interface XanoUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

export interface XanoAuthResponse {
  token: string;
  user: XanoUser;
  refresh_token?: string;
}

export interface XanoError {
  message: string;
  code?: string;
  details?: any;
}

// Tipos para clientes
export interface XanoClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

// Tipos para tickets
export interface XanoTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

// Tipos para artigos da base de conhecimento
export interface XanoArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

// Tipos para avaliações
export interface XanoRating {
  id: string;
  ticket_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Tipos para equipe
export interface XanoTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Tipos para escalas
export interface XanoSchedule {
  id: string;
  team_member_id: string;
  date: string;
  start_time: string;
  end_time: string;
  type: 'work' | 'on_call' | 'break';
  created_at: string;
  updated_at: string;
}

// Tipos para metas
export interface XanoGoal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
  created_at: string;
  updated_at: string;
}

// Tipos para relatórios
export interface XanoReport {
  id: string;
  title: string;
  type: 'performance' | 'financial' | 'operational';
  data: any;
  generated_at: string;
  created_by: string;
}

// Tipos para notificações
export interface XanoNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
}

// Tipos para logs de auditoria
export interface XanoAuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Tipos para configurações
export interface XanoSettings {
  id: string;
  key: string;
  value: any;
  description?: string;
  updated_at: string;
}

// Tipos para respostas da API
export interface XanoResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: XanoError[];
}

export interface XanoPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  success: boolean;
  message?: string;
}

// Tipos para filtros e consultas
export interface XanoQueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// Tipos para webhooks
export interface XanoWebhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}
