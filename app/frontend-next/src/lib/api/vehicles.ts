import { api } from './client';
import type { Vehicle, VehicleFormData, PaginatedResponse, Brand, Model, VehicleType, VehicleStatus } from '@/types';

export interface VehicleFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  brandId?: number;
  modelId?: number;
  vehicleTypeId?: number;
  statusId?: number;
  departmentId?: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const vehiclesApi = {
  // Get paginated list of vehicles
  getAll: async (filters: VehicleFilters = {}): Promise<PaginatedResponse<Vehicle>> => {
    return api.get<PaginatedResponse<Vehicle>>('/vehicles', filters as Record<string, string | number | boolean | undefined>);
  },

  // Get single vehicle by ID
  getById: async (id: number): Promise<Vehicle> => {
    return api.get<Vehicle>(`/vehicles/${id}`);
  },

  // Create new vehicle
  create: async (data: VehicleFormData): Promise<Vehicle> => {
    return api.post<Vehicle>('/vehicles', data);
  },

  // Update vehicle
  update: async (id: number, data: Partial<VehicleFormData>): Promise<Vehicle> => {
    return api.put<Vehicle>(`/vehicles/${id}`, data);
  },

  // Delete (soft delete) vehicle
  delete: async (id: number): Promise<void> => {
    return api.delete(`/vehicles/${id}`);
  },

  // Upload ANMDM document
  uploadAnmdmDocument: async (id: number, file: File): Promise<Vehicle> => {
    const formData = new FormData();
    formData.append('document', file);
    return api.upload<Vehicle>(`/vehicles/${id}/anmdm-document`, formData);
  },

  // Upload vehicle photos
  uploadPhotos: async (id: number, files: File[]): Promise<{ photos: string[] }> => {
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));
    return api.upload<{ photos: string[] }>(`/vehicles/${id}/photos`, formData);
  },

  // Delete vehicle photo
  deletePhoto: async (id: number, photoId: number): Promise<void> => {
    return api.delete(`/vehicles/${id}/photos/${photoId}`);
  },

  // Get vehicle documents
  getDocuments: async (id: number): Promise<{ documents: { id: number; name: string; path: string; type: string; createdAt: string }[] }> => {
    return api.get(`/vehicles/${id}/documents`);
  },

  // Upload vehicle document
  uploadDocument: async (id: number, file: File, documentType?: string): Promise<{ document: { id: number; name: string; path: string } }> => {
    const formData = new FormData();
    formData.append('document', file);
    if (documentType) {
      formData.append('documentType', documentType);
    }
    return api.upload(`/vehicles/${id}/documents`, formData);
  },

  // Reference data
  getBrands: async (): Promise<Brand[]> => {
    return api.get<Brand[]>('/system/brands');
  },

  getModels: async (brandId?: number): Promise<Model[]> => {
    const params = brandId ? { brandId } : {};
    return api.get<Model[]>('/system/models', params);
  },

  getVehicleTypes: async (): Promise<VehicleType[]> => {
    return api.get<VehicleType[]>('/system/vehicle-types');
  },

  getVehicleStatuses: async (): Promise<VehicleStatus[]> => {
    return api.get<VehicleStatus[]>('/system/vehicle-statuses');
  },
};

export default vehiclesApi;
