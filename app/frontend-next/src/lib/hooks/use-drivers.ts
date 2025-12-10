'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driversApi, DriverFilters } from '@/lib/api';
import type { Driver, DriverFormData } from '@/types';
import { toast } from 'sonner';

// Query keys
export const driverKeys = {
  all: ['drivers'] as const,
  lists: () => [...driverKeys.all, 'list'] as const,
  list: (filters: DriverFilters) => [...driverKeys.lists(), filters] as const,
  details: () => [...driverKeys.all, 'detail'] as const,
  detail: (id: number) => [...driverKeys.details(), id] as const,
  expiringLicenses: (daysAhead: number) => [...driverKeys.all, 'expiring', daysAhead] as const,
};

// Get paginated drivers list
export function useDrivers(filters: DriverFilters = {}) {
  return useQuery({
    queryKey: driverKeys.list(filters),
    queryFn: () => driversApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  });
}

// Get single driver by ID
export function useDriver(id: number | null) {
  return useQuery({
    queryKey: driverKeys.detail(id!),
    queryFn: () => driversApi.getById(id!),
    enabled: !!id,
  });
}

// Create driver mutation
export function useCreateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DriverFormData) => driversApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
      toast.success('Șoferul a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea șoferului: ${error.message}`);
    },
  });
}

// Update driver mutation
export function useUpdateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DriverFormData> }) =>
      driversApi.update(id, data),
    onSuccess: (driver) => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
      queryClient.invalidateQueries({ queryKey: driverKeys.detail(driver.id) });
      toast.success('Șoferul a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea șoferului: ${error.message}`);
    },
  });
}

// Delete driver mutation
export function useDeleteDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => driversApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
      toast.success('Șoferul a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea șoferului: ${error.message}`);
    },
  });
}

// Get expiring licenses
export function useExpiringLicenses(daysAhead: number = 30) {
  return useQuery({
    queryKey: driverKeys.expiringLicenses(daysAhead),
    queryFn: () => driversApi.getExpiringLicenses(daysAhead),
  });
}
