'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceApi, MaintenanceWorkOrderFilters, MaintenanceWorkOrderFormData } from '@/lib/api/maintenance';
import type { MaintenanceWorkOrder } from '@/types';
import { toast } from 'sonner';

// Query keys
export const maintenanceKeys = {
  all: ['maintenance'] as const,
  lists: () => [...maintenanceKeys.all, 'list'] as const,
  list: (filters: MaintenanceWorkOrderFilters) => [...maintenanceKeys.lists(), filters] as const,
  details: () => [...maintenanceKeys.all, 'detail'] as const,
  detail: (id: number) => [...maintenanceKeys.details(), id] as const,
  stats: (filters?: { dateFrom?: string; dateTo?: string; vehicleId?: number }) => [...maintenanceKeys.all, 'stats', filters] as const,
  maintenanceTypes: ['maintenanceTypes'] as const,
};

// Get paginated work orders list
export function useMaintenanceWorkOrders(filters: MaintenanceWorkOrderFilters = {}) {
  return useQuery({
    queryKey: maintenanceKeys.list(filters),
    queryFn: () => maintenanceApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  });
}

// Get single work order by ID
export function useMaintenanceWorkOrder(id: number | null) {
  return useQuery({
    queryKey: maintenanceKeys.detail(id!),
    queryFn: () => maintenanceApi.getById(id!),
    enabled: !!id,
  });
}

// Get maintenance statistics
export function useMaintenanceStats(filters?: { dateFrom?: string; dateTo?: string; vehicleId?: number }) {
  return useQuery({
    queryKey: maintenanceKeys.stats(filters),
    queryFn: () => maintenanceApi.getStats(filters),
  });
}

// Create work order mutation
export function useCreateMaintenanceWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaintenanceWorkOrderFormData) => maintenanceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.stats() });
      toast.success('Comanda de lucru a fost creată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea comenzii de lucru: ${error.message}`);
    },
  });
}

// Update work order mutation
export function useUpdateMaintenanceWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MaintenanceWorkOrderFormData> }) =>
      maintenanceApi.update(id, data),
    onSuccess: (workOrder) => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.detail(workOrder.id) });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.stats() });
      toast.success('Comanda de lucru a fost actualizată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea comenzii de lucru: ${error.message}`);
    },
  });
}

// Delete work order mutation
export function useDeleteMaintenanceWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => maintenanceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.stats() });
      toast.success('Comanda de lucru a fost ștearsă cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea comenzii de lucru: ${error.message}`);
    },
  });
}

// Update work order status
export function useUpdateWorkOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: MaintenanceWorkOrder['status'] }) =>
      maintenanceApi.updateStatus(id, status),
    onSuccess: (workOrder) => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.detail(workOrder.id) });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.stats() });
      toast.success('Statusul comenzii a fost actualizat');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea statusului: ${error.message}`);
    },
  });
}

// Reference data hooks
export function useMaintenanceTypes() {
  return useQuery({
    queryKey: maintenanceKeys.maintenanceTypes,
    queryFn: () => maintenanceApi.getMaintenanceTypes(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
