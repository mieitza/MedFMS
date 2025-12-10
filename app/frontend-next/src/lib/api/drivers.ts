import { api } from './client';
import type { Driver, DriverFormData, PaginatedResponse } from '@/types';

export interface DriverFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  departmentId?: number;
  cityId?: number;
  licenseType?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const driversApi = {
  // Get paginated list of drivers
  getAll: async (filters: DriverFilters = {}): Promise<PaginatedResponse<Driver>> => {
    return api.get<PaginatedResponse<Driver>>('/drivers', filters as Record<string, string | number | boolean | undefined>);
  },

  // Get single driver by ID
  getById: async (id: number): Promise<Driver> => {
    return api.get<Driver>(`/drivers/${id}`);
  },

  // Create new driver
  create: async (data: DriverFormData): Promise<Driver> => {
    return api.post<Driver>('/drivers', data);
  },

  // Update driver
  update: async (id: number, data: Partial<DriverFormData>): Promise<Driver> => {
    return api.put<Driver>(`/drivers/${id}`, data);
  },

  // Delete driver
  delete: async (id: number): Promise<void> => {
    return api.delete(`/drivers/${id}`);
  },

  // Get driver documents
  getDocuments: async (id: number): Promise<{ documents: { id: number; name: string; path: string; type: string; createdAt: string }[] }> => {
    return api.get(`/drivers/${id}/documents`);
  },

  // Upload driver document
  uploadDocument: async (id: number, file: File, documentType?: string): Promise<{ document: { id: number; name: string; path: string } }> => {
    const formData = new FormData();
    formData.append('document', file);
    if (documentType) {
      formData.append('documentType', documentType);
    }
    return api.upload(`/drivers/${id}/documents`, formData);
  },

  // Get drivers expiring licenses
  getExpiringLicenses: async (daysAhead: number = 30): Promise<Driver[]> => {
    return api.get<Driver[]>('/drivers/expiring-licenses', { daysAhead });
  },
};

export default driversApi;
