import api from './client';
import type { Company, CompanySettings } from '@/types';

export interface CompanyWithStats extends Company {
  userCount: number;
}

export interface CreateCompanyData {
  companyCode: string;
  companyName: string;
  legalName?: string;
  taxId?: string;
  registrationNumber?: string;
  address?: string;
  city?: string;
  county?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  logo?: string;
  settings?: CompanySettings;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  active?: boolean;
}

export const companiesApi = {
  // Get all companies (super_admin only)
  getAll: async (params?: { search?: string; active?: boolean }) => {
    return api.get<CompanyWithStats[]>('/companies', params as Record<string, string | boolean>);
  },

  // Get single company
  getById: async (id: number) => {
    return api.get<CompanyWithStats>(`/companies/${id}`);
  },

  // Create new company (super_admin only)
  create: async (data: CreateCompanyData) => {
    return api.post<Company>('/companies', data);
  },

  // Update company (super_admin only)
  update: async (id: number, data: UpdateCompanyData) => {
    return api.put<Company>(`/companies/${id}`, data);
  },

  // Delete (deactivate) company (super_admin only)
  delete: async (id: number) => {
    return api.delete<{ message: string }>(`/companies/${id}`);
  },

  // Get current user's company
  getMyCompany: async () => {
    return api.get<Company | null>('/companies/my-company');
  },
};

export default companiesApi;
