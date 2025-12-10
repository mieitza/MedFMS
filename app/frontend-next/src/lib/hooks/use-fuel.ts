'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelApi, FuelTransactionFilters } from '@/lib/api';
import type { FuelTransaction, FuelTransactionFormData } from '@/types';
import { toast } from 'sonner';

// Query keys
export const fuelKeys = {
  all: ['fuel'] as const,
  lists: () => [...fuelKeys.all, 'list'] as const,
  list: (filters: FuelTransactionFilters) => [...fuelKeys.lists(), filters] as const,
  details: () => [...fuelKeys.all, 'detail'] as const,
  detail: (id: number) => [...fuelKeys.details(), id] as const,
  stats: (filters?: { dateFrom?: string; dateTo?: string; vehicleId?: number }) => [...fuelKeys.all, 'stats', filters] as const,
  fuelTypes: ['fuelTypes'] as const,
  fuelStations: ['fuelStations'] as const,
};

// Get paginated fuel transactions list
export function useFuelTransactions(filters: FuelTransactionFilters = {}) {
  return useQuery({
    queryKey: fuelKeys.list(filters),
    queryFn: () => fuelApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  });
}

// Get single fuel transaction by ID
export function useFuelTransaction(id: number | null) {
  return useQuery({
    queryKey: fuelKeys.detail(id!),
    queryFn: () => fuelApi.getById(id!),
    enabled: !!id,
  });
}

// Get fuel statistics
export function useFuelStats(filters?: { dateFrom?: string; dateTo?: string; vehicleId?: number }) {
  return useQuery({
    queryKey: fuelKeys.stats(filters),
    queryFn: () => fuelApi.getStats(filters),
  });
}

// Create fuel transaction mutation
export function useCreateFuelTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FuelTransactionFormData) => fuelApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fuelKeys.stats() });
      toast.success('Alimentarea a fost înregistrată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la înregistrarea alimentării: ${error.message}`);
    },
  });
}

// Update fuel transaction mutation
export function useUpdateFuelTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FuelTransactionFormData> }) =>
      fuelApi.update(id, data),
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({ queryKey: fuelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fuelKeys.detail(transaction.id) });
      queryClient.invalidateQueries({ queryKey: fuelKeys.stats() });
      toast.success('Alimentarea a fost actualizată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea alimentării: ${error.message}`);
    },
  });
}

// Delete fuel transaction mutation
export function useDeleteFuelTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => fuelApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fuelKeys.stats() });
      toast.success('Alimentarea a fost ștearsă cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea alimentării: ${error.message}`);
    },
  });
}

// Import CSV mutation
export function useImportFuelCsv() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => fuelApi.importCsv(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: fuelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fuelKeys.stats() });
      toast.success(`S-au importat ${result.imported} tranzacții`);
      if (result.errors.length > 0) {
        toast.warning(`${result.errors.length} erori la import`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Eroare la importul fișierului: ${error.message}`);
    },
  });
}

// Reference data hooks
export function useFuelTypes() {
  return useQuery({
    queryKey: fuelKeys.fuelTypes,
    queryFn: () => fuelApi.getFuelTypes(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useFuelStations() {
  return useQuery({
    queryKey: fuelKeys.fuelStations,
    queryFn: () => fuelApi.getFuelStations(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
