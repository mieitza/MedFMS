import { api } from './client';
import type { LoginCredentials, LoginResponse, User } from '@/types';

export const authApi = {
  // Login with PIN
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    // Store token after successful login
    api.setToken(response.token);
    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      api.setToken(null);
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  // Validate token - decode JWT and check expiration
  // Note: Backend doesn't have /auth/me endpoint, so we validate locally
  validateToken: async (): Promise<{ valid: boolean; user?: User }> => {
    const token = api.getToken();
    if (!token) {
      return { valid: false };
    }

    try {
      // Decode JWT payload (base64)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false };
      }

      const payload = JSON.parse(atob(parts[1]));

      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return { valid: false };
      }

      // Return user data from token payload
      const user: User = {
        id: payload.id,
        username: payload.username,
        fullName: payload.fullName || payload.username,
        email: payload.email || null,
        role: payload.role,
        departmentId: payload.departmentId || null,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      };

      return { valid: true, user };
    } catch {
      return { valid: false };
    }
  },

  // Change PIN
  changePin: async (oldPin: string, newPin: string): Promise<void> => {
    return api.post('/auth/change-pin', { oldPin, newPin });
  },
};

export default authApi;
