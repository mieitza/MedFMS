import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

function createAuthStore() {
  const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  // Load from localStorage if in browser
  if (browser) {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        initialState.user = JSON.parse(storedUser);
        initialState.token = storedToken;
        initialState.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Error loading auth state from localStorage:', error);
    }
  }

  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    login: (user: User, token: string) => {
      if (browser) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      }

      set({
        user,
        token,
        isAuthenticated: true,
      });
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },
    updateUser: (user: User) => {
      if (browser) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      update(state => ({
        ...state,
        user,
      }));
    },
    checkAuth: () => {
      if (browser) {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
          try {
            const user = JSON.parse(storedUser);
            set({
              user,
              token: storedToken,
              isAuthenticated: true,
            });
            return true;
          } catch (error) {
            console.error('Error parsing stored user:', error);
            return false;
          }
        }
      }
      return false;
    },
  };
}

export const auth = createAuthStore();

// Helper function to check if user has required role
export function hasRole(requiredRole: User['role'] | User['role'][]): boolean {
  if (browser) {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return false;

      const user: User = JSON.parse(storedUser);
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

      return roles.includes(user.role);
    } catch (error) {
      return false;
    }
  }
  return false;
}

// Role hierarchy helper
export function hasMinimumRole(minimumRole: User['role']): boolean {
  if (browser) {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return false;

      const user: User = JSON.parse(storedUser);

      const roleHierarchy: Record<User['role'], number> = {
        'viewer': 1,
        'operator': 2,
        'manager': 3,
        'admin': 4,
      };

      return roleHierarchy[user.role] >= roleHierarchy[minimumRole];
    } catch (error) {
      return false;
    }
  }
  return false;
}
