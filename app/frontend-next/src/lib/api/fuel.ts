import { api } from './client';
import type { FuelTransaction, FuelTransactionFormData, FuelType, FuelStation, PaginatedResponse } from '@/types';

export interface FuelTransactionFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  vehicleId?: number;
  driverId?: number;
  fuelTypeId?: number;
  fuelStationId?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FuelStats {
  totalTransactions: number;
  totalQuantity: number;
  totalCost: number;
  averagePricePerLiter: number;
  transactionsByFuelType: { fuelType: string; quantity: number; cost: number }[];
  transactionsByVehicle: { vehicleCode: string; quantity: number; cost: number }[];
  monthlyTrend: { month: string; quantity: number; cost: number }[];
}

export const fuelApi = {
  // Get paginated list of fuel transactions
  getAll: async (filters: FuelTransactionFilters = {}): Promise<PaginatedResponse<FuelTransaction>> => {
    return api.get<PaginatedResponse<FuelTransaction>>('/fuel-transactions', filters as Record<string, string | number | boolean | undefined>);
  },

  // Get single fuel transaction by ID
  getById: async (id: number): Promise<FuelTransaction> => {
    return api.get<FuelTransaction>(`/fuel-transactions/${id}`);
  },

  // Create new fuel transaction
  create: async (data: FuelTransactionFormData): Promise<FuelTransaction> => {
    return api.post<FuelTransaction>('/fuel-transactions', data);
  },

  // Update fuel transaction
  update: async (id: number, data: Partial<FuelTransactionFormData>): Promise<FuelTransaction> => {
    return api.put<FuelTransaction>(`/fuel-transactions/${id}`, data);
  },

  // Delete fuel transaction
  delete: async (id: number): Promise<void> => {
    return api.delete(`/fuel-transactions/${id}`);
  },

  // Get fuel statistics
  getStats: async (filters?: { dateFrom?: string; dateTo?: string; vehicleId?: number }): Promise<FuelStats> => {
    return api.get<FuelStats>('/fuel-transactions/stats', filters as Record<string, string | number | undefined>);
  },

  // Import fuel transactions from CSV
  importCsv: async (file: File): Promise<{ imported: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload<{ imported: number; errors: string[] }>('/fuel-transactions/import', formData);
  },

  // Export fuel transactions to CSV
  exportCsv: async (filters?: FuelTransactionFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fuel-transactions/export?${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.blob();
  },

  // Reference data
  getFuelTypes: async (): Promise<FuelType[]> => {
    return api.get<FuelType[]>('/system/fuel-types');
  },

  getFuelStations: async (): Promise<FuelStation[]> => {
    return api.get<FuelStation[]>('/system/fuel-stations');
  },
};

export default fuelApi;
