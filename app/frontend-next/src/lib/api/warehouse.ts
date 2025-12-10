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

  // Import materials from CSV
  importMaterials: async (file: File): Promise<{ imported: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload<{ imported: number; errors: string[] }>('/warehouse/materials/import', formData);
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

  // Reports
  getStockReport: async (filters?: { warehouseId?: number; lowStockOnly?: boolean }): Promise<StockReportResponse> => {
    return api.get<StockReportResponse>('/materials/reports/stock', filters as Record<string, string | number | boolean | undefined>);
  },

  getPricingReport: async (filters?: { materialId?: number; supplierId?: number; startDate?: string; endDate?: string }): Promise<PricingReportResponse> => {
    return api.get<PricingReportResponse>('/materials/reports/pricing', filters as Record<string, string | number | boolean | undefined>);
  },

  getTransfersReport: async (filters?: { status?: string; startDate?: string; endDate?: string }): Promise<TransfersReportResponse> => {
    return api.get<TransfersReportResponse>('/materials/reports/transfers', filters as Record<string, string | number | boolean | undefined>);
  },

  getExpirationReport: async (filters?: { warehouseId?: number; daysThreshold?: number; includeExpired?: boolean }): Promise<ExpirationReportResponse> => {
    return api.get<ExpirationReportResponse>('/materials/reports/expiration', filters as Record<string, string | number | boolean | undefined>);
  },

  getUsageReport: async (filters?: { warehouseId?: number; startDate?: string; endDate?: string; month?: number; year?: number }): Promise<UsageReportResponse> => {
    return api.get<UsageReportResponse>('/materials/reports/usage', filters as Record<string, string | number | boolean | undefined>);
  },
};

// Report response types
export interface StockReportResponse {
  data: StockReportItem[];
  summary: {
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
}

export interface StockReportItem {
  material: {
    id: number;
    materialCode: string;
    materialName: string;
    currentStock: number;
    criticalLevel: number | null;
    standardPrice: number | null;
  };
  warehouse: { id: number; warehouseName: string } | null;
  unit: { id: number; unitName: string; abbreviation: string } | null;
}

export interface PricingReportResponse {
  data: PricingReportItem[];
  summary: {
    totalMaterials: number;
    averagePriceChange: number;
  };
}

export interface PricingReportItem {
  material: { id: number; materialCode: string; materialName: string };
  priceHistory: { date: string; price: number; supplier: string }[];
  statistics: { min: number; max: number; avg: number; variance: number };
}

export interface TransfersReportResponse {
  data: TransfersReportItem[];
  summary: {
    totalTransfers: number;
    completed: number;
    pending: number;
    cancelled: number;
    averageCompletionTime: number;
  };
}

export interface TransfersReportItem {
  transfer: {
    id: number;
    transferNumber: string;
    status: string;
    transferType: string;
    createdAt: string;
    completedAt: string | null;
  };
  sourceWarehouse: { id: number; warehouseName: string } | null;
  destinationWarehouse: { id: number; warehouseName: string } | null;
  itemCount: number;
  totalValue: number;
}

export interface ExpirationReportResponse {
  data: ExpirationReportItem[];
  summary: {
    totalExpiring: number;
    alreadyExpired: number;
    expiringSoon: number;
    totalExpiredValue: number;
    totalExpiringValue: number;
  };
}

export interface ExpirationReportItem {
  material: {
    id: number;
    materialCode: string;
    materialName: string;
    currentStock: number;
    standardPrice: number | null;
    expirationDate: string;
  };
  warehouse: { id: number; warehouseName: string } | null;
  daysUntilExpiration: number;
  isExpired: boolean;
  value: number;
}

export interface UsageReportResponse {
  data: {
    categoryBreakdown: CategoryUsageItem[];
    topUsedMaterials: TopUsedMaterialItem[];
  };
  summary: {
    totalCategories: number;
    totalMaterialsUsed: number;
    totalConsumption: number;
    totalValue: number;
    period: { start: string; end: string };
  };
}

export interface CategoryUsageItem {
  category: string;
  itemCount: number;
  totalConsumption: number;
  totalValue: number;
  percentOfTotal: number;
  topItems: { name: string; consumption: number; value: number }[];
}

export interface TopUsedMaterialItem {
  materialCode: string;
  materialName: string;
  category: string;
  totalConsumption: number;
  totalValue: number;
  averageConsumption: number;
}

export default warehouseApi;
