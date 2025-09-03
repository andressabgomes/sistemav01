import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePermissions } from './usePermissions';

// Mock do contexto de autenticação
const mockUseAuth = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

describe('usePermissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna permissões de admin para usuário admin', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canManageUsers).toBe(true);
    expect(result.current.canManageTeam).toBe(true);
    expect(result.current.canViewReports).toBe(true);
    expect(result.current.canManageSettings).toBe(true);
    expect(result.current.canAccessAdmin).toBe(true);
  });

  it('retorna permissões de manager para usuário manager', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'manager' },
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canManageUsers).toBe(false);
    expect(result.current.canManageTeam).toBe(true);
    expect(result.current.canViewReports).toBe(true);
    expect(result.current.canManageSettings).toBe(false);
    expect(result.current.canAccessAdmin).toBe(false);
  });

  it('retorna permissões limitadas para usuário comum', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'user' },
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canManageUsers).toBe(false);
    expect(result.current.canManageTeam).toBe(false);
    expect(result.current.canViewReports).toBe(true);
    expect(result.current.canManageSettings).toBe(false);
    expect(result.current.canAccessAdmin).toBe(false);
  });

  it('retorna permissões vazias para usuário não autenticado', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canManageUsers).toBe(false);
    expect(result.current.canManageUsers).toBe(false);
    expect(result.current.canManageTeam).toBe(false);
    expect(result.current.canViewReports).toBe(false);
    expect(result.current.canManageSettings).toBe(false);
    expect(result.current.canAccessAdmin).toBe(false);
  });

  it('retorna permissões vazias durante loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canManageUsers).toBe(false);
    expect(result.current.canManageTeam).toBe(false);
    expect(result.current.canViewReports).toBe(false);
    expect(result.current.canManageSettings).toBe(false);
    expect(result.current.canAccessAdmin).toBe(false);
  });

  it('retorna permissões para role personalizado', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'supervisor' },
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => usePermissions());

    // Role personalizado deve ter permissões padrão
    expect(result.current.canManageUsers).toBe(false);
    expect(result.current.canManageTeam).toBe(false);
    expect(result.current.canViewReports).toBe(true);
    expect(result.current.canManageSettings).toBe(false);
    expect(result.current.canAccessAdmin).toBe(false);
  });

  it('verifica permissão específica com hasPermission', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission('manage_users')).toBe(true);
    expect(result.current.hasPermission('manage_team')).toBe(true);
    expect(result.current.hasPermission('invalid_permission')).toBe(false);
  });

  it('verifica múltiplas permissões com hasAnyPermission', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'manager' },
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasAnyPermission(['manage_team', 'view_reports'])).toBe(true);
    expect(result.current.hasAnyPermission(['manage_users', 'access_admin'])).toBe(false);
    expect(result.current.hasAnyPermission(['invalid_permission'])).toBe(false);
  });

  it('verifica todas as permissões com hasAllPermissions', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasAllPermissions(['manage_users', 'manage_team'])).toBe(true);
    expect(result.current.hasAllPermissions(['manage_users', 'invalid_permission'])).toBe(false);
  });
});
