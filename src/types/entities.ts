// ============================================================================
// TIPOS DE ENTIDADES PRINCIPAIS - STARPRINT CRM
// ============================================================================

// ============================================================================
// TIPOS BASE
// ============================================================================

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface BaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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

export interface QueryParams extends PaginationParams {
  sort?: SortParams[];
  filters?: FilterParams[];
  search?: string;
  include?: string[];
}

// ============================================================================
// USUÁRIOS E AUTENTICAÇÃO
// ============================================================================

export interface User extends BaseEntity {
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  permissions: Permission[];
  is_active: boolean;
  last_login?: string;
  avatar_url?: string;
  phone?: string;
  department?: string;
  position?: string;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'USER' | 'AGENT' | 'SUPPORT';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  conditions?: Record<string, unknown>;
}

export interface UserProfile extends BaseEntity {
  user_id: string;
  bio?: string;
  skills: string[];
  experience_years: number;
  specializations: string[];
  availability: AvailabilityStatus;
  working_hours: WorkingHours;
  timezone: string;
  language: string;
}

export type AvailabilityStatus = 'available' | 'busy' | 'away' | 'offline' | 'break';

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  is_working: boolean;
  start_time?: string; // HH:mm format
  end_time?: string; // HH:mm format
  break_start?: string;
  break_end?: string;
}

// ============================================================================
// CLIENTES
// ============================================================================

export interface Client extends BaseEntity {
  code: string;
  company_name: string;
  trade_name?: string;
  document_type: DocumentType;
  document_number: string;
  client_type: ClientType;
  segment: BusinessSegment;
  size: CompanySize;
  status: ClientStatus;
  priority: PriorityLevel;
  email: string;
  phone: string;
  website?: string;
  notes?: string;
  tags: string[];
  assigned_agent_id?: string;
  assigned_agent?: User;
  addresses: ClientAddress[];
  contacts: ClientContact[];
  persons: ClientPerson[];
  contracts: ClientContract[];
  equipment: ClientEquipment[];
}

export type DocumentType = 'CNPJ' | 'CPF' | 'RG' | 'IE' | 'Outro';
export type ClientType = 'strategic' | 'regular' | 'prospect' | 'inactive';
export type BusinessSegment = 'Industrial' | 'Comércio' | 'Serviços' | 'Confecção' | 'Lingerie' | 'Calçados' | 'Química' | 'Distribuição' | 'Varejo' | 'Moda' | 'Alimentos' | 'Saúde' | 'Empreendimentos' | 'E-commerce' | 'Agrícola' | 'Plásticos' | 'Outro';
export type CompanySize = 'small' | 'medium' | 'large' | 'enterprise';
export type ClientStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ClientAddress extends BaseEntity {
  client_id: string;
  type: AddressType;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_primary: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export type AddressType = 'billing' | 'shipping' | 'main' | 'branch';

export interface ClientContact extends BaseEntity {
  client_id: string;
  type: ContactType;
  value: string;
  is_primary: boolean;
  notes?: string;
}

export type ContactType = 'email' | 'phone' | 'mobile' | 'fax' | 'whatsapp' | 'skype';

export interface ClientPerson extends BaseEntity {
  client_id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  is_primary_contact: boolean;
  department?: string;
  notes?: string;
}

export interface ClientContract extends BaseEntity {
  client_id: string;
  contract_number: string;
  type: ContractType;
  status: ContractStatus;
  start_date: string;
  end_date: string;
  value: number;
  currency: string;
  terms: string;
  auto_renewal: boolean;
  next_renewal_date?: string;
}

export type ContractType = 'service' | 'maintenance' | 'equipment' | 'consulting' | 'support';
export type ContractStatus = 'active' | 'expired' | 'cancelled' | 'pending' | 'renewed';

export interface ClientEquipment extends BaseEntity {
  client_id: string;
  name: string;
  model: string;
  serial_number: string;
  manufacturer: string;
  installation_date: string;
  warranty_expiry?: string;
  maintenance_schedule: MaintenanceSchedule;
  status: EquipmentStatus;
  location?: string;
  specifications: Record<string, unknown>;
}

export interface MaintenanceSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  last_maintenance?: string;
  next_maintenance: string;
  maintenance_type: 'preventive' | 'corrective' | 'predictive';
}

export type EquipmentStatus = 'operational' | 'maintenance' | 'broken' | 'retired';

// ============================================================================
// ATENDIMENTO E TICKETS
// ============================================================================

export interface Ticket extends BaseEntity {
  ticket_number: string;
  client_id: string;
  client?: Client;
  assigned_agent_id?: string;
  assigned_agent?: User;
  title: string;
  description: string;
  category: TicketCategory;
  priority: PriorityLevel;
  status: TicketStatus;
  source: TicketSource;
  tags: string[];
  estimated_resolution_time?: number; // em minutos
  actual_resolution_time?: number; // em minutos
  satisfaction_rating?: number; // 1-5
  satisfaction_feedback?: string;
  is_urgent: boolean;
  sla_breach: boolean;
  escalation_level: number;
  parent_ticket_id?: string;
  child_tickets?: Ticket[];
  attachments: TicketAttachment[];
  messages: TicketMessage[];
  activities: TicketActivity[];
}

export type TicketCategory = 'technical' | 'billing' | 'sales' | 'support' | 'complaint' | 'request' | 'bug' | 'feature' | 'other';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'waiting_third_party' | 'resolved' | 'closed' | 'cancelled';
export type TicketSource = 'email' | 'phone' | 'chat' | 'web_form' | 'social_media' | 'walk_in' | 'other';

export interface TicketMessage extends BaseEntity {
  ticket_id: string;
  sender_id: string;
  sender: User;
  message_type: MessageType;
  content: string;
  is_internal: boolean;
  attachments: MessageAttachment[];
  read_by: string[];
  read_at?: Record<string, string>;
}

export type MessageType = 'text' | 'html' | 'system' | 'note' | 'email' | 'sms';

export interface TicketAttachment extends BaseEntity {
  ticket_id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  uploaded_by: string;
  description?: string;
}

export interface MessageAttachment extends BaseEntity {
  message_id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  description?: string;
}

export interface TicketActivity extends BaseEntity {
  ticket_id: string;
  user_id: string;
  user: User;
  action: TicketAction;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

export type TicketAction = 'created' | 'assigned' | 'status_changed' | 'priority_changed' | 'escalated' | 'resolved' | 'closed' | 'reopened' | 'commented' | 'attachment_added';

// ============================================================================
// BASE DE CONHECIMENTO
// ============================================================================

export interface KnowledgeArticle extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category_id: string;
  category: KnowledgeCategory;
  tags: string[];
  author_id: string;
  author: User;
  status: ArticleStatus;
  visibility: ArticleVisibility;
  view_count: number;
  helpful_count: number;
  not_helpful_count: number;
  rating: number;
  reviews: ArticleReview[];
  attachments: ArticleAttachment[];
  related_articles: string[];
  version: number;
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

export interface KnowledgeCategory extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  parent_id?: string;
  parent?: KnowledgeCategory;
  children?: KnowledgeCategory[];
  icon?: string;
  color?: string;
  sort_order: number;
  article_count: number;
}

export type ArticleStatus = 'draft' | 'published' | 'archived' | 'pending_review';
export type ArticleVisibility = 'public' | 'private' | 'internal' | 'restricted';

export interface ArticleReview extends BaseEntity {
  article_id: string;
  user_id: string;
  user: User;
  rating: number; // 1-5
  comment?: string;
  is_helpful: boolean;
}

export interface ArticleAttachment extends BaseEntity {
  article_id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  description?: string;
}

// ============================================================================
// EQUIPE E ESCALAS
// ============================================================================

export interface TeamMember extends BaseEntity {
  user_id: string;
  user: User;
  team_id: string;
  team: Team;
  role: TeamRole;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  skills: string[];
  specializations: string[];
  max_tickets: number;
  current_tickets: number;
  performance_metrics: PerformanceMetrics;
  goals: TeamGoal[];
}

export interface Team extends BaseEntity {
  name: string;
  description: string;
  department: string;
  manager_id: string;
  manager: User;
  members: TeamMember[];
  color: string;
  icon?: string;
  is_active: boolean;
}

export type TeamRole = 'member' | 'senior' | 'lead' | 'manager' | 'specialist';

export interface PerformanceMetrics extends BaseEntity {
  user_id: string;
  period: string; // YYYY-MM format
  tickets_resolved: number;
  avg_resolution_time: number; // em minutos
  customer_satisfaction: number; // 1-5
  first_response_time: number; // em minutos
  response_time_compliance: number; // porcentagem
  quality_score: number; // 1-100
  productivity_score: number; // 1-100
}

export interface TeamGoal extends BaseEntity {
  team_member_id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  status: GoalStatus;
  progress: number; // 0-100
  category: GoalCategory;
}

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
export type GoalCategory = 'productivity' | 'quality' | 'customer_satisfaction' | 'response_time' | 'learning' | 'other';

export interface TeamSchedule extends BaseEntity {
  team_member_id: string;
  team_member: TeamMember;
  date: string;
  shift_start: string;
  shift_end: string;
  break_start?: string;
  break_end?: string;
  status: ScheduleStatus;
  type: ScheduleType;
  notes?: string;
  overtime_hours?: number;
  is_holiday: boolean;
  holiday_type?: HolidayType;
}

export type ScheduleStatus = 'scheduled' | 'confirmed' | 'completed' | 'absent' | 'late' | 'early_leave';
export type ScheduleType = 'regular' | 'overtime' | 'on_call' | 'training' | 'meeting' | 'other';
export type HolidayType = 'national' | 'state' | 'city' | 'company' | 'personal' | 'other';

// ============================================================================
// RELATÓRIOS E ANALYTICS
// ============================================================================

export interface Report extends BaseEntity {
  name: string;
  description: string;
  type: ReportType;
  category: ReportCategory;
  parameters: ReportParameters;
  schedule?: ReportSchedule;
  recipients: string[];
  format: ReportFormat;
  status: ReportStatus;
  last_generated?: string;
  next_generation?: string;
  generated_count: number;
  file_size?: number;
  download_url?: string;
}

export type ReportType = 'dashboard' | 'table' | 'chart' | 'export' | 'email' | 'pdf';
export type ReportCategory = 'sales' | 'support' | 'performance' | 'financial' | 'operational' | 'customer' | 'team';
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'xml' | 'html';
export type ReportStatus = 'active' | 'inactive' | 'draft' | 'archived';

export interface ReportParameters {
  date_range: DateRange;
  filters: Record<string, unknown>;
  grouping: string[];
  sorting: SortParams[];
  aggregation: AggregationType[];
}

export interface DateRange {
  start_date: string;
  end_date: string;
  type: 'custom' | 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'this_year' | 'last_year';
}

export type AggregationType = 'sum' | 'average' | 'count' | 'min' | 'max' | 'percentage' | 'growth';

export interface ReportSchedule {
  frequency: ScheduleFrequency;
  day_of_week?: number; // 0-6 (Sunday-Saturday)
  day_of_month?: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
  timezone: string;
  is_active: boolean;
}

export type ScheduleFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// ============================================================================
// NPS E AVALIAÇÕES
// ============================================================================

export interface NPSResponse extends BaseEntity {
  ticket_id?: string;
  ticket?: Ticket;
  client_id: string;
  client?: Client;
  score: number; // 0-10
  category: NPSCategory;
  feedback?: string;
  follow_up_required: boolean;
  follow_up_notes?: string;
  follow_up_status: FollowUpStatus;
  follow_up_assigned_to?: string;
  follow_up_assigned_to_user?: User;
  follow_up_deadline?: string;
  follow_up_completed_at?: string;
  tags: string[];
  sentiment: SentimentAnalysis;
}

export type NPSCategory = 'detractor' | 'passive' | 'promoter';
export type FollowUpStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  confidence: number; // 0-1
  keywords: string[];
  emotions: Record<string, number>;
}

// ============================================================================
// CONFIGURAÇÕES E SISTEMA
// ============================================================================

export interface SystemConfig extends BaseEntity {
  key: string;
  value: unknown;
  type: ConfigType;
  description: string;
  is_public: boolean;
  category: ConfigCategory;
  validation_rules?: ValidationRule[];
}

export type ConfigType = 'string' | 'number' | 'boolean' | 'json' | 'array' | 'object';
export type ConfigCategory = 'general' | 'email' | 'sms' | 'integrations' | 'security' | 'performance' | 'ui' | 'notifications';

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value: unknown;
  message: string;
}

export interface AuditLog extends BaseEntity {
  user_id?: string;
  user?: User;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  severity: AuditSeverity;
}

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

// ============================================================================
// TIPOS UTILITÁRIOS
// ============================================================================

export type StatusType = 'success' | 'error' | 'warning' | 'info';
export type SizeType = 'sm' | 'md' | 'lg' | 'xl';
export type VariantType = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], record: T) => React.ReactNode;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'datetime' | 'file' | 'custom';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationRule[];
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: unknown;
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export type {
  BaseEntity,
  BaseResponse,
  PaginationParams,
  PaginatedResponse,
  SortParams,
  FilterParams,
  QueryParams,
  User,
  UserRole,
  Permission,
  UserProfile,
  AvailabilityStatus,
  WorkingHours,
  DaySchedule,
  Client,
  DocumentType,
  ClientType,
  BusinessSegment,
  CompanySize,
  ClientStatus,
  PriorityLevel,
  ClientAddress,
  AddressType,
  ClientContact,
  ContactType,
  ClientPerson,
  ClientContract,
  ContractType,
  ContractStatus,
  ClientEquipment,
  MaintenanceSchedule,
  EquipmentStatus,
  Ticket,
  TicketCategory,
  TicketStatus,
  TicketSource,
  TicketMessage,
  MessageType,
  TicketAttachment,
  MessageAttachment,
  TicketActivity,
  TicketAction,
  KnowledgeArticle,
  KnowledgeCategory,
  ArticleStatus,
  ArticleVisibility,
  ArticleReview,
  ArticleAttachment,
  TeamMember,
  Team,
  TeamRole,
  PerformanceMetrics,
  TeamGoal,
  GoalStatus,
  GoalCategory,
  TeamSchedule,
  ScheduleStatus,
  ScheduleType,
  HolidayType,
  Report,
  ReportType,
  ReportCategory,
  ReportFormat,
  ReportStatus,
  ReportParameters,
  DateRange,
  AggregationType,
  ReportSchedule,
  ScheduleFrequency,
  NPSResponse,
  NPSCategory,
  FollowUpStatus,
  SentimentAnalysis,
  SystemConfig,
  ConfigType,
  ConfigCategory,
  ValidationRule,
  AuditLog,
  AuditSeverity,
  StatusType,
  SizeType,
  VariantType,
  SelectOption,
  TableColumn,
  FormField
};
