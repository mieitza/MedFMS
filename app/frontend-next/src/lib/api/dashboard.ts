import { api } from './client';
import type { DashboardStats, RecentActivity } from '@/types';

export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    return api.get<DashboardStats>('/dashboard/stats');
  },

  // Get recent activity
  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    return api.get<RecentActivity[]>('/dashboard/activity', { limit });
  },

  // Get alerts (expiring documents, overdue maintenance, low stock, etc.)
  getAlerts: async (): Promise<{
    expiringDocuments: { id: number; type: string; vehicleId: number; licensePlate: string; expiryDate: string }[];
    overdueMaintenances: { id: number; vehicleId: number; licensePlate: string; dueDate: string; maintenanceType: string }[];
    lowStockMaterials: { id: number; name: string; currentStock: number; criticalLevel: number }[];
    expiringLicenses: { id: number; driverName: string; licenseNumber: string; expiryDate: string }[];
  }> => {
    return api.get('/dashboard/alerts');
  },

  // Get fuel consumption summary
  getFuelSummary: async (period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<{
    totalLiters: number;
    totalCost: number;
    averageConsumption: number;
    comparedToPrevious: number;
    byVehicleType: { vehicleType: string; liters: number; cost: number }[];
    dailyData: { date: string; liters: number; cost: number }[];
  }> => {
    return api.get('/dashboard/fuel-summary', { period });
  },

  // Get maintenance summary
  getMaintenanceSummary: async (): Promise<{
    pending: number;
    inProgress: number;
    completedThisMonth: number;
    totalCostThisMonth: number;
    byType: { type: string; count: number; cost: number }[];
  }> => {
    return api.get('/dashboard/maintenance-summary');
  },

  // Get vehicle status distribution
  getVehicleStatusDistribution: async (): Promise<{
    status: string;
    color: string;
    count: number;
    percentage: number;
  }[]> => {
    return api.get('/dashboard/vehicle-status-distribution');
  },
};

export default dashboardApi;
