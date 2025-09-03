// Tipos base do sistema

export type Role = "ADMIN" | "MANAGER" | "AGENT" | "VIEWER";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  status?: "active" | "inactive" | "pending";
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  customer_id: string;
  assigned_user_id?: string;
  assigned_team_id?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TicketFilters {
  page?: number;
  pageSize?: number;
  status?: Ticket["status"];
  priority?: Ticket["priority"];
  customer_id?: string;
  assigned_user_id?: string;
  assigned_team_id?: string;
  q?: string; // busca textual
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

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, string | number | boolean>;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'not_in';
  value: string | number | boolean | string[] | number[];
}

export interface AdvancedQueryParams extends QueryParams {
  sort?: SortParams[];
  filters?: FilterParams[];
  include?: string[];
}
