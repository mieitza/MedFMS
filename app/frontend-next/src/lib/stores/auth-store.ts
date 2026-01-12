import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@/types';
import { authApi } from '@/lib/api/auth';
import { api } from '@/lib/api/client';

interface AuthStore extends AuthState {
  // Actions
  login: (username: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Login action
      login: async (username: string, pin: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ username, pin });
          // authApi.login already calls api.setToken, but also sync to localStorage
          api.setToken(response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Ignore logout errors
        } finally {
          api.setToken(null);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Check if current token is still valid
      checkAuth: async () => {
        const { token, user: storedUser } = get();
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return false;
        }

        // Restore token to API client
        api.setToken(token);

        try {
          const { valid, user: tokenUser } = await authApi.validateToken();
          if (valid) {
            // Prefer stored user data (from login), fall back to token data
            const user = storedUser || tokenUser;
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            api.setToken(null);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return false;
          }
        } catch {
          api.setToken(null);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      // Set user manually
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // When store rehydrates from localStorage, sync token to API client
        if (state?.token) {
          api.setToken(state.token);
        }
      },
    }
  )
);

// Selector hooks for convenience
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
