import { User, UserRole, Permission } from './entities';

// ============================================================================
// TIPOS DE AUTENTICAÇÃO - STARPRINT CRM
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: string;
  message?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data?: {
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastActivity: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  isAuthenticated: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

export interface TokenPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  permissions: Permission[];
  iat: number; // issued at
  exp: number; // expiration
}

export interface AuthConfig {
  tokenKey: string;
  refreshTokenKey: string;
  userKey: string;
  tokenExpiryKey: string;
  autoRefresh: boolean;
  refreshThreshold: number; // milliseconds before expiry to refresh
  sessionTimeout: number; // milliseconds
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorAuth {
  enabled: boolean;
  method: 'totp' | 'sms' | 'email';
  backupCodes?: string[];
  qrCode?: string;
  secret?: string;
}

export interface TwoFactorVerify {
  code: string;
  rememberDevice?: boolean;
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
}

export interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  timestamp: string;
  failureReason?: string;
}

export interface SecurityPolicy {
  maxLoginAttempts: number;
  lockoutDuration: number; // milliseconds
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMinutes: number;
  requireTwoFactor: boolean;
  allowedIpRanges?: string[];
  blockedIpRanges?: string[];
}

// ============================================================================
// TIPOS DE VALIDAÇÃO
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface PasswordStrength {
  score: number; // 0-100
  level: 'very_weak' | 'weak' | 'fair' | 'good' | 'strong' | 'very_strong';
  feedback: string[];
  suggestions: string[];
}

// ============================================================================
// TIPOS DE NOTIFICAÇÕES
// ============================================================================

export interface AuthNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoDismiss?: boolean;
  dismissAfter?: number; // milliseconds
  timestamp: number;
}

// ============================================================================
// PERMISSÕES POR ROLE
// ============================================================================

export const rolePermissions: Record<string, string[]> = {
  ADMIN: ['dashboard', 'equipe', 'escalas', 'metas', 'clientes', 'atendimento', 'monitoramento', 'relatorios', 'administracao'],
  MANAGER: ['dashboard', 'equipe', 'escalas', 'metas', 'clientes', 'monitoramento', 'relatorios'],
  AGENT: ['dashboard', 'clientes', 'atendimento'],
  USER: ['dashboard', 'clientes', 'atendimento'],
  SUPPORT: ['dashboard', 'atendimento']
};

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  AuthState,
  AuthContextType,
  TokenPayload,
  AuthConfig,
  AuthError,
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordChangeRequest,
  TwoFactorAuth,
  TwoFactorVerify,
  SessionInfo,
  DeviceInfo,
  LoginAttempt,
  SecurityPolicy,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  PasswordStrength,
  AuthNotification
};