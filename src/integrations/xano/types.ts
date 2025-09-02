import { 
  BaseEntity, 
  BaseResponse, 
  PaginatedResponse, 
  QueryParams,
  User,
  Client,
  Ticket,
  KnowledgeArticle,
  TeamMember,
  NPSResponse,
  Report
} from '@/types/entities';

// ============================================================================
// TIPOS ESPECÍFICOS DO XANO.IO - STARPRINT CRM
// ============================================================================

// ============================================================================
// TIPOS DE RESPOSTA DA API
// ============================================================================

export interface XanoResponse<T> extends BaseResponse<T> {
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

export interface XanoPaginatedResponse<T> extends PaginatedResponse<T> {
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

export interface XanoError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
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

export interface XanoAuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: 'Bearer';
  };
  error?: XanoError;
}

export interface XanoRefreshRequest {
  refreshToken: string;
}

export interface XanoRefreshResponse {
  success: boolean;
  data?: {
    token: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: 'Bearer';
  };
  error?: XanoError;
}

export interface XanoLogoutRequest {
  token: string;
  refreshToken: string;
}

export interface XanoLogoutResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// TIPOS DE CLIENTE
// ============================================================================

export interface XanoClientRequest {
  code?: string;
  company_name: string;
  trade_name?: string;
  document_type: string;
  document_number: string;
  client_type: string;
  segment: string;
  size: string;
  status: string;
  priority: string;
  email: string;
  phone: string;
  website?: string;
  notes?: string;
  tags?: string[];
  assigned_agent_id?: string;
}

export interface XanoClientResponse extends XanoResponse<Client> {}

export interface XanoClientListResponse extends XanoPaginatedResponse<Client> {}

export interface XanoClientSearchParams extends QueryParams {
  search?: string;
  filters?: {
    client_type?: string[];
    segment?: string[];
    size?: string[];
    status?: string[];
    priority?: string[];
    assigned_agent_id?: string;
    tags?: string[];
  };
}

// ============================================================================
// TIPOS DE TICKET
// ============================================================================

export interface XanoTicketRequest {
  ticket_number?: string;
  client_id: string;
  assigned_agent_id?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  source: string;
  tags?: string[];
  estimated_resolution_time?: number;
  is_urgent?: boolean;
  parent_ticket_id?: string;
}

export interface XanoTicketResponse extends XanoResponse<Ticket> {}

export interface XanoTicketListResponse extends XanoPaginatedResponse<Ticket> {}

export interface XanoTicketSearchParams extends QueryParams {
  search?: string;
  filters?: {
    client_id?: string;
    assigned_agent_id?: string;
    category?: string[];
    priority?: string[];
    status?: string[];
    source?: string[];
    tags?: string[];
    is_urgent?: boolean;
    created_after?: string;
    created_before?: string;
  };
}

// ============================================================================
// TIPOS DE BASE DE CONHECIMENTO
// ============================================================================

export interface XanoArticleRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  category_id: string;
  tags?: string[];
  author_id?: string;
  status?: string;
  visibility?: string;
  is_featured?: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

export interface XanoArticleResponse extends XanoResponse<KnowledgeArticle> {}

export interface XanoArticleListResponse extends XanoPaginatedResponse<KnowledgeArticle> {}

export interface XanoArticleSearchParams extends QueryParams {
  search?: string;
  filters?: {
    category_id?: string;
    author_id?: string;
    status?: string[];
    visibility?: string[];
    tags?: string[];
    is_featured?: boolean;
    created_after?: string;
    created_before?: string;
  };
}

// ============================================================================
// TIPOS DE EQUIPE
// ============================================================================

export interface XanoTeamMemberRequest {
  user_id: string;
  team_id: string;
  role: string;
  start_date: string;
  end_date?: string;
  is_active?: boolean;
  skills?: string[];
  specializations?: string[];
  max_tickets?: number;
}

export interface XanoTeamMemberResponse extends XanoResponse<TeamMember> {}

export interface XanoTeamMemberListResponse extends XanoPaginatedResponse<TeamMember> {}

export interface XanoTeamMemberSearchParams extends QueryParams {
  search?: string;
  filters?: {
    team_id?: string;
    role?: string[];
    is_active?: boolean;
    skills?: string[];
    specializations?: string[];
  };
}

// ============================================================================
// TIPOS DE NPS
// ============================================================================

export interface XanoNPSRequest {
  ticket_id?: string;
  client_id: string;
  score: number;
  feedback?: string;
  follow_up_required?: boolean;
  follow_up_notes?: string;
  tags?: string[];
}

export interface XanoNPSResponse extends XanoResponse<NPSResponse> {}

export interface XanoNPSListResponse extends XanoPaginatedResponse<NPSResponse> {}

export interface XanoNPSSearchParams extends QueryParams {
  search?: string;
  filters?: {
    client_id?: string;
    ticket_id?: string;
    score?: number[];
    category?: string[];
    follow_up_required?: boolean;
    follow_up_status?: string[];
    created_after?: string;
    created_before?: string;
  };
}

// ============================================================================
// TIPOS DE RELATÓRIOS
// ============================================================================

export interface XanoReportRequest {
  name: string;
  description: string;
  type: string;
  category: string;
  parameters: Record<string, unknown>;
  schedule?: Record<string, unknown>;
  recipients?: string[];
  format: string;
  status?: string;
}

export interface XanoReportResponse extends XanoResponse<Report> {}

export interface XanoReportListResponse extends XanoPaginatedResponse<Report> {}

export interface XanoReportSearchParams extends QueryParams {
  search?: string;
  filters?: {
    type?: string[];
    category?: string[];
    status?: string[];
    format?: string[];
    created_after?: string;
    created_before?: string;
  };
}

// ============================================================================
// TIPOS DE OPERAÇÕES CRUD GENÉRICAS
// ============================================================================

export interface XanoCreateRequest<T> {
  data: Partial<T>;
  options?: {
    returnData?: boolean;
    validateOnly?: boolean;
    ignorePermissions?: boolean;
  };
}

export interface XanoUpdateRequest<T> {
  id: string;
  data: Partial<T>;
  options?: {
    returnData?: boolean;
    validateOnly?: boolean;
    ignorePermissions?: boolean;
    merge?: boolean;
  };
}

export interface XanoDeleteRequest {
  id: string;
  options?: {
    softDelete?: boolean;
    cascade?: boolean;
    ignorePermissions?: boolean;
  };
}

export interface XanoBulkRequest<T> {
  operations: Array<{
    type: 'create' | 'update' | 'delete';
    data?: Partial<T>;
    id?: string;
    options?: Record<string, unknown>;
  }>;
  options?: {
    transaction?: boolean;
    validateOnly?: boolean;
    ignorePermissions?: boolean;
  };
}

export interface XanoBulkResponse {
  success: boolean;
  results: Array<{
    operation: string;
    success: boolean;
    id?: string;
    data?: unknown;
    error?: XanoError;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// ============================================================================
// TIPOS DE FILTROS E QUERIES
// ============================================================================

export interface XanoFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'not_in' | 'is_null' | 'is_not_null';
  value: string | number | boolean | string[] | number[] | null;
}

export interface XanoSort {
  field: string;
  direction: 'asc' | 'desc';
  nulls?: 'first' | 'last';
}

export interface XanoQuery {
  select?: string[];
  filters?: XanoFilter[];
  sorts?: XanoSort[];
  limit?: number;
  offset?: number;
  page?: number;
  include?: string[];
  exclude?: string[];
  search?: string;
  searchFields?: string[];
  groupBy?: string[];
  having?: XanoFilter[];
}

// ============================================================================
// TIPOS DE WEBHOOKS E EVENTOS
// ============================================================================

export interface XanoWebhookPayload<T = unknown> {
  event: string;
  timestamp: string;
  data: T;
  metadata: {
    table: string;
    operation: 'insert' | 'update' | 'delete';
    recordId: string;
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface XanoWebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  table: string;
  isActive: boolean;
  headers?: Record<string, string>;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
}

// ============================================================================
// TIPOS DE CONFIGURAÇÃO E METADADOS
// ============================================================================

export interface XanoTableInfo {
  name: string;
  schema: Record<string, {
    type: string;
    nullable: boolean;
    defaultValue?: unknown;
    isPrimary?: boolean;
    isUnique?: boolean;
    isIndexed?: boolean;
    references?: {
      table: string;
      column: string;
    };
  }>;
  indexes: Array<{
    name: string;
    columns: string[];
    type: 'btree' | 'hash' | 'gin' | 'gist';
    isUnique: boolean;
  }>;
  rowCount: number;
  size: number;
  lastAnalyzed: string;
}

export interface XanoWorkspaceInfo {
  id: string;
  name: string;
  domain: string;
  region: string;
  plan: string;
  features: string[];
  limits: {
    apiCalls: number;
    storage: number;
    users: number;
    tables: number;
  };
  usage: {
    apiCalls: number;
    storage: number;
    users: number;
    tables: number;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export type {
  XanoResponse,
  XanoPaginatedResponse,
  XanoError,
  XanoAuthRequest,
  XanoAuthResponse,
  XanoRefreshRequest,
  XanoRefreshResponse,
  XanoLogoutRequest,
  XanoLogoutResponse,
  XanoClientRequest,
  XanoClientResponse,
  XanoClientListResponse,
  XanoClientSearchParams,
  XanoTicketRequest,
  XanoTicketResponse,
  XanoTicketListResponse,
  XanoTicketSearchParams,
  XanoArticleRequest,
  XanoArticleResponse,
  XanoArticleListResponse,
  XanoArticleSearchParams,
  XanoTeamMemberRequest,
  XanoTeamMemberResponse,
  XanoTeamMemberListResponse,
  XanoTeamMemberSearchParams,
  XanoNPSRequest,
  XanoNPSResponse,
  XanoNPSListResponse,
  XanoNPSSearchParams,
  XanoReportRequest,
  XanoReportResponse,
  XanoReportListResponse,
  XanoReportSearchParams,
  XanoCreateRequest,
  XanoUpdateRequest,
  XanoDeleteRequest,
  XanoBulkRequest,
  XanoBulkResponse,
  XanoFilter,
  XanoSort,
  XanoQuery,
  XanoWebhookPayload,
  XanoWebhookConfig,
  XanoTableInfo,
  XanoWorkspaceInfo
};
