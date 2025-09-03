// ============================================================================
// TIPOS PARA INTEGRAÇÃO COM XANO.IO - STARPRINT CRM
// ============================================================================

// ============================================================================
// TIPOS BASE
// ============================================================================

export interface XanoBaseResponse {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: string;
  timestamp?: string;
}

export interface XanoResponse<T> extends XanoBaseResponse {
  data: T;
}

export interface XanoPaginatedResponse<T> extends XanoBaseResponse {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface XanoError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
  requestId?: string;
  path?: string;
  method?: string;
}

// ============================================================================
// TIPOS DE AUTENTICAÇÃO
// ============================================================================

export interface XanoAuthRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface XanoAuthResponse extends XanoBaseResponse {
  data: {
    token: string;
    refreshToken: string;
    user: XanoUser;
    expiresAt: string;
  };
}

export interface XanoRefreshRequest {
  refreshToken: string;
}

export interface XanoRefreshResponse extends XanoBaseResponse {
  data: {
    token: string;
    refreshToken: string;
    expiresAt: string;
  };
}

export interface XanoLogoutRequest {
  token: string;
}

export interface XanoLogoutResponse extends XanoBaseResponse {
  data: {
    message: string;
  };
}

export interface XanoUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'USER' | 'GUEST';

// ============================================================================
// TIPOS DE ENTIDADES
// ============================================================================

export interface XanoClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: ClientStatus;
  tier: ClientTier;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastContactAt?: string;
  notes?: string;
  tags?: string[];
}

export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'lead';
export type ClientTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface XanoTicket {
  id: string;
  clientId: string;
  agentId?: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedAt?: string;
  tags?: string[];
  attachments?: string[];
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report';

export interface XanoArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  viewCount: number;
  helpfulCount: number;
}

export interface XanoTeamMember {
  id: string;
  userId: string;
  role: UserRole;
  department: string;
  skills: string[];
  maxTickets: number;
  currentLoad: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface XanoSchedule {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: ScheduleType;
  status: ScheduleStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleType = 'work' | 'break' | 'meeting' | 'training' | 'off';
export type ScheduleStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

export interface XanoGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  period: GoalPeriod;
  status: GoalStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export type GoalPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';

export interface XanoNPS {
  id: string;
  ticketId: string;
  rating: number;
  feedback?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface XanoMonitoring {
  id: string;
  userId: string;
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  activity: MonitoringActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface MonitoringActivity {
  type: string;
  timestamp: string;
  details?: unknown;
}

// ============================================================================
// TIPOS DE QUERY E FILTROS
// ============================================================================

export interface XanoQuery {
  select?: string[];
  filters?: XanoFilter[];
  sorts?: XanoSort[];
  limit?: number;
  offset?: number;
  page?: number;
  search?: string;
  searchFields?: string[];
}

export interface XanoFilter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export type FilterOperator = 
  | 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'
  | 'in' | 'nin' | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with' | 'is_null' | 'is_not_null';

export interface XanoSort {
  field: string;
  direction: 'asc' | 'desc';
  nulls?: 'first' | 'last';
}

// ============================================================================
// TIPOS DE REQUISIÇÕES
// ============================================================================

export interface XanoCreateRequest<T> {
  data: Partial<T>;
  options?: {
    returnData?: boolean;
    validateOnly?: boolean;
  };
}

export interface XanoUpdateRequest<T> {
  data: Partial<T>;
  options?: {
    returnData?: boolean;
    validateOnly?: boolean;
  };
}

export interface XanoDeleteRequest {
  options?: {
    softDelete?: boolean;
    returnData?: boolean;
  };
}

export interface XanoBulkRequest<T> {
  operations: Array<{
    type: 'create' | 'update' | 'delete';
    data?: Partial<T>;
    id?: string;
  }>;
  options?: {
    returnData?: boolean;
    validateOnly?: boolean;
  };
}

export interface XanoBulkResponse<T> extends XanoBaseResponse {
  data: {
    results: Array<{
      success: boolean;
      data?: T;
      error?: string;
    }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  };
}

// ============================================================================
// TIPOS DE CONFIGURAÇÃO
// ============================================================================

export interface XanoConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// ============================================================================
// TIPOS DE EVENTOS
// ============================================================================

export interface XanoEvent {
  type: string;
  payload: unknown;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface XanoWebhookPayload {
  event: string;
  data: unknown;
  timestamp: string;
  signature?: string;
}

// ============================================================================
// TIPOS DE CACHE
// ============================================================================

export interface XanoCacheItem<T> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
}

export interface XanoCacheConfig {
  enabled: boolean;
  ttl: number;
  maxItems: number;
  strategy: 'lru' | 'fifo' | 'ttl';
}

// ============================================================================
// TIPOS DE VALIDAÇÃO
// ============================================================================

export interface XanoValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface XanoValidationResult {
  isValid: boolean;
  errors: XanoValidationError[];
}

// ============================================================================
// TIPOS DE MONITORAMENTO
// ============================================================================

export interface XanoMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestAt?: string;
  lastErrorAt?: string;
}

export interface XanoHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warn';
    responseTime?: number;
    error?: string;
  }>;
  timestamp: string;
}
