import { create } from 'zustand';

interface AppState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Command palette
  commandPaletteOpen: boolean;

  // Mobile navigation
  mobileNavOpen: boolean;

  // Theme
  theme: 'light' | 'dark' | 'system';

  // Language
  locale: 'ro' | 'en';
}

interface AppActions {
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Command palette actions
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;

  // Mobile nav actions
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;

  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Language actions
  setLocale: (locale: 'ro' | 'en') => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  sidebarOpen: true,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  mobileNavOpen: false,
  theme: 'system',
  locale: 'ro',

  // Sidebar actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Command palette actions
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  // Mobile nav actions
  openMobileNav: () => set({ mobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),

  // Theme actions
  setTheme: (theme) => set({ theme }),

  // Language actions
  setLocale: (locale) => set({ locale }),
}));

// Selector hooks
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);
export const useCommandPaletteOpen = () => useAppStore((state) => state.commandPaletteOpen);
export const useMobileNavOpen = () => useAppStore((state) => state.mobileNavOpen);
export const useTheme = () => useAppStore((state) => state.theme);
export const useLocale = () => useAppStore((state) => state.locale);
