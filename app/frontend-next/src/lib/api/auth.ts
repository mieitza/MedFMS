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

  // Validate token
  validateToken: async (): Promise<{ valid: boolean; user?: User }> => {
    try {
      const user = await api.get<User>('/auth/me');
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
