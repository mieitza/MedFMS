'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi, type CompanyWithStats, type CreateCompanyData, type UpdateCompanyData } from '@/lib/api';
import type { Company } from '@/types';

// Query keys
export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (filters: { search?: string; active?: boolean }) => [...companyKeys.lists(), filters] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: number) => [...companyKeys.details(), id] as const,
  myCompany: () => [...companyKeys.all, 'my-company'] as const,
};

// Hook to get all companies (super_admin only)
export function useCompanies(params?: { search?: string; active?: boolean }) {
  return useQuery({
    queryKey: companyKeys.list(params || {}),
    queryFn: () => companiesApi.getAll(params),
  });
}

// Hook to get a single company
export function useCompany(id: number) {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => companiesApi.getById(id),
    enabled: !!id,
  });
}

// Hook to get current user's company
export function useMyCompany() {
  return useQuery({
    queryKey: companyKeys.myCompany(),
    queryFn: () => companiesApi.getMyCompany(),
  });
}

// Hook to create a company
export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyData) => companiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
}

// Hook to update a company
export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyData }) =>
      companiesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(id) });
    },
  });
}

// Hook to delete (deactivate) a company
export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => companiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
}
