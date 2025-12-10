'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi, VehicleFilters } from '@/lib/api';
import type { Vehicle, VehicleFormData, PaginatedResponse } from '@/types';
import { toast } from 'sonner';

// Query keys
export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: VehicleFilters) => [...vehicleKeys.lists(), filters] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: number) => [...vehicleKeys.details(), id] as const,
  brands: ['brands'] as const,
  models: (brandId?: number) => ['models', brandId] as const,
  vehicleTypes: ['vehicleTypes'] as const,
  vehicleStatuses: ['vehicleStatuses'] as const,
};

// Get paginated vehicles list
export function useVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: vehicleKeys.list(filters),
    queryFn: () => vehiclesApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  });
}

// Get single vehicle by ID
export function useVehicle(id: number | null) {
  return useQuery({
    queryKey: vehicleKeys.detail(id!),
    queryFn: () => vehiclesApi.getById(id!),
    enabled: !!id,
  });
}

// Create vehicle mutation
export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleFormData) => vehiclesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      toast.success('Vehiculul a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea vehiculului: ${error.message}`);
    },
  });
}

// Update vehicle mutation
export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VehicleFormData> }) =>
      vehiclesApi.update(id, data),
    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(vehicle.id) });
      toast.success('Vehiculul a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea vehiculului: ${error.message}`);
    },
  });
}

// Delete vehicle mutation
export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vehiclesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      toast.success('Vehiculul a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea vehiculului: ${error.message}`);
    },
  });
}

// Upload ANMDM document mutation
export function useUploadAnmdmDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      vehiclesApi.uploadAnmdmDocument(id, file),
    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(vehicle.id) });
      toast.success('Documentul ANMDM a fost încărcat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la încărcarea documentului: ${error.message}`);
    },
  });
}

// Upload photos mutation
export function useUploadVehiclePhotos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, files }: { id: number; files: File[] }) =>
      vehiclesApi.uploadPhotos(id, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(variables.id) });
      toast.success('Fotografiile au fost încărcate cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la încărcarea fotografiilor: ${error.message}`);
    },
  });
}

// Reference data hooks
export function useBrands() {
  return useQuery({
    queryKey: vehicleKeys.brands,
    queryFn: () => vehiclesApi.getBrands(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useModels(brandId?: number) {
  return useQuery({
    queryKey: vehicleKeys.models(brandId),
    queryFn: () => vehiclesApi.getModels(brandId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useVehicleTypes() {
  return useQuery({
    queryKey: vehicleKeys.vehicleTypes,
    queryFn: () => vehiclesApi.getVehicleTypes(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useVehicleStatuses() {
  return useQuery({
    queryKey: vehicleKeys.vehicleStatuses,
    queryFn: () => vehiclesApi.getVehicleStatuses(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
