export type UserRole = 'admin' | 'gestao' | 'atendente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

export const rolePermissions: Record<UserRole, string[]> = {
  admin: ['dashboard', 'equipe', 'escalas', 'metas', 'clientes', 'atendimento', 'monitoramento', 'relatorios', 'administracao'],
  gestao: ['dashboard', 'equipe', 'escalas', 'metas', 'clientes', 'monitoramento', 'relatorios'],
  atendente: ['dashboard', 'clientes', 'atendimento']
};

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  gestao: 'Gestão',
  atendente: 'Atendente'
};