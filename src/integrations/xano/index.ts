// Exportações principais do Xano
export { xanoClient, xanoAuth, xanoAPI } from './client';
export type {
  XanoUser,
  XanoAuthResponse,
  XanoError,
  XanoClient,
  XanoTicket,
  XanoArticle,
  XanoRating,
  XanoTeamMember,
  XanoSchedule,
  XanoGoal,
  XanoReport,
  XanoNotification,
  XanoAuditLog,
  XanoSettings,
  XanoResponse,
  XanoPaginatedResponse,
  XanoQueryParams,
  XanoWebhook,
} from './types';

// Re-export do cliente como padrão
export { default } from './client';
