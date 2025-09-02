import { UserRole, Permission } from './entities';

// ============================================================================
// TIPOS DE NAVEGAÇÃO - STARPRINT CRM
// ============================================================================

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'destructive' | 'outline' | 'secondary';
  isActive?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  children?: NavigationItem[];
  permissions?: Permission[];
  roles?: UserRole[];
  order: number;
  category: NavigationCategory;
  external?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  description?: string;
  keywords?: string[];
}

export type NavigationCategory = 
  | 'main'
  | 'dashboard'
  | 'clients'
  | 'tickets'
  | 'team'
  | 'reports'
  | 'administration'
  | 'support'
  | 'settings';

export interface NavigationGroup {
  id: string;
  title: string;
  items: NavigationItem[];
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  order: number;
  category: NavigationCategory;
  permissions?: Permission[];
  roles?: UserRole[];
}

export interface NavigationConfig {
  groups: NavigationGroup[];
  items: NavigationItem[];
  settings: NavigationSettings;
}

export interface NavigationSettings {
  enableSearch: boolean;
  enableShortcuts: boolean;
  enableBreadcrumbs: boolean;
  enableBreadcrumbHome: boolean;
  maxBreadcrumbItems: number;
  enableActiveState: boolean;
  enableHighlighting: boolean;
  enableAnimations: boolean;
  enableResponsive: boolean;
  mobileBreakpoint: number;
  tabletBreakpoint: number;
  desktopBreakpoint: number;
}

export interface BreadcrumbItem {
  title: string;
  path: string;
  isActive: boolean;
  isClickable: boolean;
  icon?: string;
}

export interface NavigationState {
  currentPath: string;
  activeItems: string[];
  expandedGroups: string[];
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
  filteredItems: NavigationItem[];
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isSidebarCollapsed: boolean;
}

export interface NavigationContextType {
  items: NavigationItem[];
  groups: NavigationGroup[];
  currentPath: string;
  activeItems: string[];
  breadcrumbs: BreadcrumbItem[];
  isMobileMenuOpen: boolean;
  isSidebarCollapsed: boolean;
  searchQuery: string;
  filteredItems: NavigationItem[];
  navigate: (path: string) => void;
  toggleMobileMenu: () => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  expandGroup: (groupId: string) => void;
  collapseGroup: (groupId: string) => void;
  isItemVisible: (item: NavigationItem) => boolean;
  isGroupVisible: (group: NavigationGroup) => boolean;
}

export interface NavigationShortcut {
  key: string;
  keyCode: number;
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'search' | 'help';
  isGlobal: boolean;
  isEnabled: boolean;
}

export interface NavigationSearchResult {
  item: NavigationItem;
  score: number;
  matchedFields: string[];
  highlights: SearchHighlight[];
}

export interface SearchHighlight {
  field: string;
  value: string;
  matches: {
    start: number;
    end: number;
    text: string;
  }[];
}

export interface NavigationAnalytics {
  pageViews: Record<string, number>;
  navigationPaths: Record<string, number>;
  searchQueries: Record<string, number>;
  popularItems: NavigationItem[];
  userJourneys: UserJourney[];
  timeOnPage: Record<string, number>;
  bounceRate: Record<string, number>;
}

export interface UserJourney {
  userId: string;
  sessionId: string;
  startTime: string;
  endTime: string;
  path: string[];
  duration: number;
  interactions: NavigationInteraction[];
}

export interface NavigationInteraction {
  timestamp: string;
  action: 'click' | 'hover' | 'search' | 'navigate';
  target: string;
  metadata: Record<string, unknown>;
}

export interface NavigationPermission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

export interface NavigationRole {
  id: string;
  name: string;
  permissions: NavigationPermission[];
  navigationAccess: NavigationAccess;
}

export interface NavigationAccess {
  allowedItems: string[];
  allowedGroups: string[];
  restrictedItems: string[];
  restrictedGroups: string[];
  customItems?: NavigationItem[];
  customGroups?: NavigationGroup[];
}

export interface NavigationTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  shadowColor: string;
  hoverColor: string;
  activeColor: string;
  disabledColor: string;
  errorColor: string;
  successColor: string;
  warningColor: string;
  infoColor: string;
}

export interface NavigationResponsive {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
    large: number;
  };
  behaviors: {
    mobile: MobileBehavior;
    tablet: TabletBehavior;
    desktop: DesktopBehavior;
    large: LargeBehavior;
  };
}

export interface MobileBehavior {
  sidebar: 'overlay' | 'push' | 'slide';
  menu: 'dropdown' | 'drawer' | 'modal';
  search: 'inline' | 'modal' | 'header';
  breadcrumbs: 'inline' | 'collapsed' | 'hidden';
}

export interface TabletBehavior {
  sidebar: 'collapsible' | 'overlay' | 'push';
  menu: 'dropdown' | 'inline' | 'drawer';
  search: 'inline' | 'expanded' | 'modal';
  breadcrumbs: 'inline' | 'collapsed';
}

export interface DesktopBehavior {
  sidebar: 'expanded' | 'collapsible' | 'fixed';
  menu: 'inline' | 'dropdown' | 'mega';
  search: 'inline' | 'expanded';
  breadcrumbs: 'inline' | 'expanded';
}

export interface LargeBehavior {
  sidebar: 'expanded' | 'fixed' | 'wide';
  menu: 'inline' | 'mega' | 'horizontal';
  search: 'inline' | 'expanded' | 'wide';
  breadcrumbs: 'inline' | 'expanded' | 'detailed';
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export type {
  NavigationItem,
  NavigationCategory,
  NavigationGroup,
  NavigationConfig,
  NavigationSettings,
  BreadcrumbItem,
  NavigationState,
  NavigationContextType,
  NavigationShortcut,
  NavigationSearchResult,
  SearchHighlight,
  NavigationAnalytics,
  UserJourney,
  NavigationInteraction,
  NavigationPermission,
  NavigationRole,
  NavigationAccess,
  NavigationTheme,
  NavigationResponsive,
  MobileBehavior,
  TabletBehavior,
  DesktopBehavior,
  LargeBehavior
};