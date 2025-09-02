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
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: ApiError[];
}
