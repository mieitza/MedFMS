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
  // Materials CRUD - backend uses /materials endpoint
  getMaterials: async (filters: MaterialFilters = {}): Promise<PaginatedResponse<Material>> => {
    return api.get<PaginatedResponse<Material>>('/materials', filters as Record<string, string | number | boolean | undefined>);
  },

  getMaterialById: async (id: number): Promise<Material> => {
    return api.get<Material>(`/materials/${id}`);
  },

  createMaterial: async (data: MaterialFormData): Promise<Material> => {
    return api.post<Material>('/materials', data);
  },

  updateMaterial: async (id: number, data: Partial<MaterialFormData>): Promise<Material> => {
    return api.put<Material>(`/materials/${id}`, data);
  },

  deleteMaterial: async (id: number): Promise<void> => {
    return api.delete(`/materials/${id}`);
  },

  // Import materials from CSV
  importMaterials: async (file: File): Promise<{ imported: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload<{ imported: number; errors: string[] }>('/materials/import', formData);
  },

  // Transfer Requests CRUD - backend uses /materials/transfer-requests
  getTransferRequests: async (filters: TransferRequestFilters = {}): Promise<PaginatedResponse<TransferRequest>> => {
    return api.get<PaginatedResponse<TransferRequest>>('/materials/transfer-requests', filters as Record<string, string | number | boolean | undefined>);
  },

  getTransferRequestById: async (id: number): Promise<TransferRequest> => {
    return api.get<TransferRequest>(`/materials/transfer-requests/${id}`);
  },

  createTransferRequest: async (data: TransferRequestFormData): Promise<TransferRequest> => {
    return api.post<TransferRequest>('/materials/transfer-requests', data);
  },

  updateTransferStatus: async (id: number, status: TransferRequest['status']): Promise<TransferRequest> => {
    return api.patch<TransferRequest>(`/materials/transfer-requests/${id}/status`, { status });
  },

  // Additional transfer request actions
  approveTransfer: async (id: number, notes?: string): Promise<TransferRequest> => {
    return api.post<TransferRequest>(`/materials/transfer-requests/${id}/approve`, { notes });
  },

  rejectTransfer: async (id: number, notes: string): Promise<TransferRequest> => {
    return api.post<TransferRequest>(`/materials/transfer-requests/${id}/reject`, { notes });
  },

  completeTransfer: async (id: number): Promise<TransferRequest> => {
    return api.post<TransferRequest>(`/materials/transfer-requests/${id}/complete`, {});
  },

  getPendingApprovalTransfers: async (filters: TransferRequestFilters = {}): Promise<PaginatedResponse<TransferRequest>> => {
    return api.get<PaginatedResponse<TransferRequest>>('/materials/transfer-requests/pending-approval', filters as Record<string, string | number | boolean | undefined>);
  },

  // Reference data - backend uses /materials/warehouses and /materials/units
  getWarehouses: async (): Promise<Warehouse[]> => {
    return api.get<Warehouse[]>('/materials/warehouses');
  },

  getWarehouseById: async (id: number): Promise<Warehouse> => {
    return api.get<Warehouse>(`/materials/warehouses/${id}`);
  },

  createWarehouse: async (data: Partial<Warehouse>): Promise<Warehouse> => {
    return api.post<Warehouse>('/materials/warehouses', data);
  },

  updateWarehouse: async (id: number, data: Partial<Warehouse>): Promise<Warehouse> => {
    return api.put<Warehouse>(`/materials/warehouses/${id}`, data);
  },

  deleteWarehouse: async (id: number): Promise<void> => {
    return api.delete(`/materials/warehouses/${id}`);
  },

  getMaterialUnits: async (): Promise<MaterialUnit[]> => {
    return api.get<MaterialUnit[]>('/materials/units');
  },

  createMaterialUnit: async (data: Partial<MaterialUnit>): Promise<MaterialUnit> => {
    return api.post<MaterialUnit>('/materials/units', data);
  },

  updateMaterialUnit: async (id: number, data: Partial<MaterialUnit>): Promise<MaterialUnit> => {
    return api.put<MaterialUnit>(`/materials/units/${id}`, data);
  },

  // Low stock materials
  getLowStockMaterials: async (): Promise<Material[]> => {
    return api.get<Material[]>('/materials/low-stock');
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
