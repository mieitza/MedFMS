'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehouseApi, MaterialFilters, MaterialFormData, TransferRequestFilters, TransferRequestFormData } from '@/lib/api/warehouse';
import type { TransferRequest } from '@/types';
import { toast } from 'sonner';

// Query keys
export const warehouseKeys = {
  all: ['warehouse'] as const,
  materials: () => [...warehouseKeys.all, 'materials'] as const,
  materialsList: (filters: MaterialFilters) => [...warehouseKeys.materials(), 'list', filters] as const,
  materialDetail: (id: number) => [...warehouseKeys.materials(), 'detail', id] as const,
  transfers: () => [...warehouseKeys.all, 'transfers'] as const,
  transfersList: (filters: TransferRequestFilters) => [...warehouseKeys.transfers(), 'list', filters] as const,
  transferDetail: (id: number) => [...warehouseKeys.transfers(), 'detail', id] as const,
  stats: () => [...warehouseKeys.all, 'stats'] as const,
  warehouses: ['warehouses'] as const,
  materialUnits: ['materialUnits'] as const,
  materialCategories: ['materialCategories'] as const,
};

// Materials hooks
export function useMaterials(filters: MaterialFilters = {}) {
  return useQuery({
    queryKey: warehouseKeys.materialsList(filters),
    queryFn: () => warehouseApi.getMaterials(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useMaterial(id: number | null) {
  return useQuery({
    queryKey: warehouseKeys.materialDetail(id!),
    queryFn: () => warehouseApi.getMaterialById(id!),
    enabled: !!id,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaterialFormData) => warehouseApi.createMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.materials() });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.stats() });
      toast.success('Materialul a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea materialului: ${error.message}`);
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MaterialFormData> }) =>
      warehouseApi.updateMaterial(id, data),
    onSuccess: (material) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.materials() });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.materialDetail(material.id) });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.stats() });
      toast.success('Materialul a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea materialului: ${error.message}`);
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => warehouseApi.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.materials() });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.stats() });
      toast.success('Materialul a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea materialului: ${error.message}`);
    },
  });
}

// Transfer requests hooks
export function useTransferRequests(filters: TransferRequestFilters = {}) {
  return useQuery({
    queryKey: warehouseKeys.transfersList(filters),
    queryFn: () => warehouseApi.getTransferRequests(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useTransferRequest(id: number | null) {
  return useQuery({
    queryKey: warehouseKeys.transferDetail(id!),
    queryFn: () => warehouseApi.getTransferRequestById(id!),
    enabled: !!id,
  });
}

export function useCreateTransferRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferRequestFormData) => warehouseApi.createTransferRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.transfers() });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.stats() });
      toast.success('Cererea de transfer a fost creată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea cererii: ${error.message}`);
    },
  });
}

export function useUpdateTransferStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TransferRequest['status'] }) =>
      warehouseApi.updateTransferStatus(id, status),
    onSuccess: (transfer) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.transfers() });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.transferDetail(transfer.id) });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.stats() });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.materials() });
      toast.success('Statusul cererii a fost actualizat');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea statusului: ${error.message}`);
    },
  });
}

// Stats
export function useWarehouseStats() {
  return useQuery({
    queryKey: warehouseKeys.stats(),
    queryFn: () => warehouseApi.getStats(),
  });
}

// Reference data hooks
export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.warehouses,
    queryFn: () => warehouseApi.getWarehouses(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useMaterialUnits() {
  return useQuery({
    queryKey: warehouseKeys.materialUnits,
    queryFn: () => warehouseApi.getMaterialUnits(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useMaterialCategories() {
  return useQuery({
    queryKey: warehouseKeys.materialCategories,
    queryFn: () => warehouseApi.getMaterialCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
