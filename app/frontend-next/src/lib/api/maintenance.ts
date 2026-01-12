import { api } from './client';
import type { MaintenanceWorkOrder, MaintenanceType, PaginatedResponse } from '@/types';

export interface MaintenanceWorkOrderFormData {
  vehicleId: number;
  maintenanceTypeId: number;
  status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority?: number;
  scheduledDate?: string | null;
  startDate?: string | null;
  completionDate?: string | null;
  odometer?: number | null;
  description?: string | null;
  diagnosis?: string | null;
  workPerformed?: string | null;
  technicianNotes?: string | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  partsCost?: number | null;
  laborCost?: number | null;
}

export interface MaintenanceWorkOrderFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  vehicleId?: number;
  maintenanceTypeId?: number;
  status?: string;
  priority?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MaintenanceStats {
  totalWorkOrders: number;
  pendingWorkOrders: number;
  inProgressWorkOrders: number;
  completedWorkOrders: number;
  totalCost: number;
  averageCost: number;
  workOrdersByType: { maintenanceType: string; count: number; cost: number }[];
  workOrdersByVehicle: { vehicleCode: string; count: number; cost: number }[];
  monthlyTrend: { month: string; count: number; cost: number }[];
}

export const maintenanceApi = {
  // Get paginated list of work orders
  getAll: async (filters: MaintenanceWorkOrderFilters = {}): Promise<PaginatedResponse<MaintenanceWorkOrder>> => {
    return api.get<PaginatedResponse<MaintenanceWorkOrder>>('/maintenance/work-orders', filters as Record<string, string | number | boolean | undefined>);
  },

  // Get single work order by ID
  getById: async (id: number): Promise<MaintenanceWorkOrder> => {
    return api.get<MaintenanceWorkOrder>(`/maintenance/work-orders/${id}`);
  },

  // Create new work order
  create: async (data: MaintenanceWorkOrderFormData): Promise<MaintenanceWorkOrder> => {
    return api.post<MaintenanceWorkOrder>('/maintenance/work-orders', data);
  },

  // Update work order
  update: async (id: number, data: Partial<MaintenanceWorkOrderFormData>): Promise<MaintenanceWorkOrder> => {
    return api.put<MaintenanceWorkOrder>(`/maintenance/work-orders/${id}`, data);
  },

  // Delete work order
  delete: async (id: number): Promise<void> => {
    return api.delete(`/maintenance/work-orders/${id}`);
  },

  // Get maintenance statistics
  getStats: async (filters?: { dateFrom?: string; dateTo?: string; vehicleId?: number }): Promise<MaintenanceStats> => {
    return api.get<MaintenanceStats>('/maintenance/work-orders/stats', filters as Record<string, string | number | undefined>);
  },

  // Update work order status
  updateStatus: async (id: number, status: MaintenanceWorkOrder['status']): Promise<MaintenanceWorkOrder> => {
    return api.put<MaintenanceWorkOrder>(`/maintenance/work-orders/${id}/status`, { status });
  },

  // Reference data
  getMaintenanceTypes: async (): Promise<MaintenanceType[]> => {
    return api.get<MaintenanceType[]>('/maintenance/types');
  },

  // Get work orders pending approval (managers/admins only)
  // Note: Backend returns plain array, not paginated response
  getPendingApproval: async (filters: MaintenanceWorkOrderFilters = {}): Promise<{ data: MaintenanceWorkOrder[] }> => {
    const data = await api.get<MaintenanceWorkOrder[]>('/maintenance/work-orders/pending-approval', filters as Record<string, string | number | boolean | undefined>);
    return { data };
  },

  // Approve work order
  approve: async (id: number, notes?: string): Promise<MaintenanceWorkOrder> => {
    return api.put<MaintenanceWorkOrder>(`/maintenance/work-orders/${id}/status`, { status: 'approved', notes });
  },

  // Reject work order
  reject: async (id: number, notes: string): Promise<MaintenanceWorkOrder> => {
    return api.put<MaintenanceWorkOrder>(`/maintenance/work-orders/${id}/status`, { status: 'cancelled', notes });
  },
};

export default maintenanceApi;
