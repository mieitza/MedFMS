import { api } from './client';
import type { Material, Warehouse, MaterialUnit, TransferRequest, PaginatedResponse } from '@/types';

export interface MaterialFormData {
  materialCode: string;
  name: string;
  description?: string | null;
  categoryId?: number | null;
  unitId?: number | null;
  standardPrice?: number | null;
  currentStock?: number;
  criticalLevel?: number | null;
  expirationDate?: string | null;
  barcode?: string | null;
  serialNumber?: string | null;
  warehouseId?: number | null;
  locationInWarehouse?: string | null;
}

export interface MaterialFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  warehouseId?: number;
  categoryId?: number;
  lowStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransferRequestFormData {
  sourceWarehouseId?: number | null;
  destinationWarehouseId?: number | null;
  destinationVehicleId?: number | null;
  notes?: string | null;
  items: { materialId: number; quantity: number }[];
}

export interface TransferRequestFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sourceWarehouseId?: number;
  destinationWarehouseId?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface WarehouseStats {
  totalMaterials: number;
  lowStockMaterials: number;
  totalValue: number;
  pendingTransfers: number;
  materialsByWarehouse: { warehouse: string; count: number; value: number }[];
  lowStockItems: { materialCode: string; name: string; currentStock: number; criticalLevel: number }[];
}

export const warehouseApi = {
  // Materials CRUD
  getMaterials: async (filters: MaterialFilters = {}): Promise<PaginatedResponse<Material>> => {
    return api.get<PaginatedResponse<Material>>('/warehouse/materials', filters as Record<string, string | number | boolean | undefined>);
  },

  getMaterialById: async (id: number): Promise<Material> => {
    return api.get<Material>(`/warehouse/materials/${id}`);
  },

  createMaterial: async (data: MaterialFormData): Promise<Material> => {
    return api.post<Material>('/warehouse/materials', data);
  },

  updateMaterial: async (id: number, data: Partial<MaterialFormData>): Promise<Material> => {
    return api.put<Material>(`/warehouse/materials/${id}`, data);
  },

  deleteMaterial: async (id: number): Promise<void> => {
    return api.delete(`/warehouse/materials/${id}`);
  },

  // Transfer Requests CRUD
  getTransferRequests: async (filters: TransferRequestFilters = {}): Promise<PaginatedResponse<TransferRequest>> => {
    return api.get<PaginatedResponse<TransferRequest>>('/warehouse/transfers', filters as Record<string, string | number | boolean | undefined>);
  },

  getTransferRequestById: async (id: number): Promise<TransferRequest> => {
    return api.get<TransferRequest>(`/warehouse/transfers/${id}`);
  },

  createTransferRequest: async (data: TransferRequestFormData): Promise<TransferRequest> => {
    return api.post<TransferRequest>('/warehouse/transfers', data);
  },

  updateTransferStatus: async (id: number, status: TransferRequest['status']): Promise<TransferRequest> => {
    return api.put<TransferRequest>(`/warehouse/transfers/${id}/status`, { status });
  },

  // Statistics
  getStats: async (): Promise<WarehouseStats> => {
    return api.get<WarehouseStats>('/warehouse/stats');
  },

  // Reference data
  getWarehouses: async (): Promise<Warehouse[]> => {
    return api.get<Warehouse[]>('/system/warehouses');
  },

  getMaterialUnits: async (): Promise<MaterialUnit[]> => {
    return api.get<MaterialUnit[]>('/system/material-units');
  },

  getMaterialCategories: async (): Promise<{ id: number; name: string }[]> => {
    return api.get<{ id: number; name: string }[]>('/system/material-categories');
  },
};

export default warehouseApi;
