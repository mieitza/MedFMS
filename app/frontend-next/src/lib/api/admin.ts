import { api } from './client';
import type {
  User,
  Brand,
  Model,
  VehicleType,
  VehicleStatus,
  FuelType,
  FuelStation,
  MaintenanceType,
  Department,
  Location,
  City,
  Supplier,
  MaterialUnit,
  PaginatedResponse,
} from '@/types';

// Reference data type names
export type ReferenceDataType =
  | 'brands'
  | 'models'
  | 'vehicle-types'
  | 'vehicle-statuses'
  | 'fuel-types'
  | 'fuel-stations'
  | 'maintenance-types'
  | 'departments'
  | 'locations'
  | 'cities'
  | 'suppliers'
  | 'material-units'
  | 'material-categories'
  | 'positions'
  | 'license-types'
  | 'inspection-types';

// Generic reference data item
export interface ReferenceDataItem {
  id: number;
  [key: string]: unknown;
}

// User form data
export interface UserFormData {
  username: string;
  fullName: string;
  email: string | null;
  pin?: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  departmentId?: number | null;
  locationId?: number | null;
  phoneNumber?: string | null;
  isActive: boolean;
}

// Brand form data
export interface BrandFormData {
  brandCode?: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

// Model form data
export interface ModelFormData {
  modelCode?: string;
  brandId: number;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

// Vehicle type form data
export interface VehicleTypeFormData {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

// Vehicle status form data
export interface VehicleStatusFormData {
  name: string;
  color?: string | null;
  description?: string | null;
  isActive?: boolean;
}

// Fuel type form data
export interface FuelTypeFormData {
  fuelCode?: string;
  name: string;
  pricePerLiter?: number | null;
  density?: number | null;
  description?: string | null;
  isActive?: boolean;
}

// Fuel station form data
export interface FuelStationFormData {
  name: string;
  address?: string | null;
  cityId?: number | null;
  phone?: string | null;
  operatingHours?: string | null;
  paymentMethods?: string | null;
  services?: string | null;
  isActive?: boolean;
}

// Maintenance type form data
export interface MaintenanceTypeFormData {
  name: string;
  category: 'preventive' | 'corrective' | 'emergency' | 'inspection';
  priority?: number;
  estimatedCost?: number | null;
  estimatedDuration?: number | null;
  description?: string | null;
  isActive?: boolean;
}

// Department form data
export interface DepartmentFormData {
  departmentCode?: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

// Location form data
export interface LocationFormData {
  name: string;
  address?: string | null;
  cityId?: number | null;
  phone?: string | null;
  description?: string | null;
  isActive?: boolean;
}

// City form data
export interface CityFormData {
  cityCode?: string;
  name: string;
  county?: string | null;
  country?: string | null;
  isActive?: boolean;
}

// Supplier form data
export interface SupplierFormData {
  supplierCode?: string;
  name: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  cityId?: number | null;
  taxId?: string | null;
  paymentTerms?: string | null;
  notes?: string | null;
  isActive?: boolean;
}

// Material unit form data
export interface MaterialUnitFormData {
  unitCode?: string;
  name: string;
  abbreviation?: string | null;
  description?: string | null;
  isActive?: boolean;
}

// Material category type
export interface MaterialCategory {
  id: number;
  categoryCode: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

// Material category form data
export interface MaterialCategoryFormData {
  categoryCode?: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

// Position type
export interface Position {
  id: number;
  positionCode: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

// Position form data
export interface PositionFormData {
  positionCode?: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

// License type
export interface LicenseType {
  id: number;
  typeCode: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

// License type form data
export interface LicenseTypeFormData {
  typeCode?: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

// Inspection type
export interface InspectionType {
  id: number;
  typeCode: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

// Inspection type form data
export interface InspectionTypeFormData {
  typeCode?: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export const adminApi = {
  // ========================
  // Users
  // ========================
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<{ data: User[] }>('/users');
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    return api.get<User>(`/users/${id}`);
  },

  createUser: async (data: UserFormData): Promise<User> => {
    return api.post<User>('/users', data);
  },

  updateUser: async (id: number, data: Partial<UserFormData>): Promise<User> => {
    return api.patch<User>(`/users/${id}`, data);
  },

  deleteUser: async (id: number): Promise<void> => {
    return api.delete(`/users/${id}`);
  },

  activateUser: async (id: number): Promise<User> => {
    return api.post<User>(`/users/${id}/activate`, {});
  },

  deactivateUser: async (id: number): Promise<User> => {
    return api.post<User>(`/users/${id}/deactivate`, {});
  },

  resetUserPin: async (id: number, pin: string): Promise<void> => {
    return api.post(`/users/${id}/reset-pin`, { pin });
  },

  // ========================
  // Generic Reference Data
  // ========================
  getReferenceData: async <T = ReferenceDataItem>(type: ReferenceDataType): Promise<T[]> => {
    return api.get<T[]>(`/system/${type}`);
  },

  getReferenceDataItem: async <T = ReferenceDataItem>(type: ReferenceDataType, id: number): Promise<T> => {
    return api.get<T>(`/system/${type}/${id}`);
  },

  createReferenceData: async <T = ReferenceDataItem>(type: ReferenceDataType, data: Record<string, unknown>): Promise<T> => {
    return api.post<T>(`/system/${type}`, data);
  },

  updateReferenceData: async <T = ReferenceDataItem>(type: ReferenceDataType, id: number, data: Record<string, unknown>): Promise<T> => {
    return api.patch<T>(`/system/${type}/${id}`, data);
  },

  deleteReferenceData: async (type: ReferenceDataType, id: number): Promise<void> => {
    return api.delete(`/system/${type}/${id}`);
  },

  // ========================
  // Specific Reference Data Endpoints
  // ========================

  // Brands
  getBrands: async (): Promise<Brand[]> => {
    return api.get<Brand[]>('/system/brands');
  },

  createBrand: async (data: BrandFormData): Promise<Brand> => {
    return api.post<Brand>('/system/brands', data);
  },

  updateBrand: async (id: number, data: Partial<BrandFormData>): Promise<Brand> => {
    return api.patch<Brand>(`/system/brands/${id}`, data);
  },

  deleteBrand: async (id: number): Promise<void> => {
    return api.delete(`/system/brands/${id}`);
  },

  // Models
  getModels: async (brandId?: number): Promise<Model[]> => {
    const params = brandId ? { brandId } : {};
    return api.get<Model[]>('/system/models', params);
  },

  createModel: async (data: ModelFormData): Promise<Model> => {
    return api.post<Model>('/system/models', data);
  },

  updateModel: async (id: number, data: Partial<ModelFormData>): Promise<Model> => {
    return api.patch<Model>(`/system/models/${id}`, data);
  },

  deleteModel: async (id: number): Promise<void> => {
    return api.delete(`/system/models/${id}`);
  },

  // Vehicle Types
  getVehicleTypes: async (): Promise<VehicleType[]> => {
    return api.get<VehicleType[]>('/system/vehicle-types');
  },

  createVehicleType: async (data: VehicleTypeFormData): Promise<VehicleType> => {
    return api.post<VehicleType>('/system/vehicle-types', data);
  },

  updateVehicleType: async (id: number, data: Partial<VehicleTypeFormData>): Promise<VehicleType> => {
    return api.patch<VehicleType>(`/system/vehicle-types/${id}`, data);
  },

  deleteVehicleType: async (id: number): Promise<void> => {
    return api.delete(`/system/vehicle-types/${id}`);
  },

  // Vehicle Statuses
  getVehicleStatuses: async (): Promise<VehicleStatus[]> => {
    return api.get<VehicleStatus[]>('/system/vehicle-statuses');
  },

  createVehicleStatus: async (data: VehicleStatusFormData): Promise<VehicleStatus> => {
    return api.post<VehicleStatus>('/system/vehicle-statuses', data);
  },

  updateVehicleStatus: async (id: number, data: Partial<VehicleStatusFormData>): Promise<VehicleStatus> => {
    return api.patch<VehicleStatus>(`/system/vehicle-statuses/${id}`, data);
  },

  deleteVehicleStatus: async (id: number): Promise<void> => {
    return api.delete(`/system/vehicle-statuses/${id}`);
  },

  // Fuel Types
  getFuelTypes: async (): Promise<FuelType[]> => {
    return api.get<FuelType[]>('/system/fuel-types');
  },

  createFuelType: async (data: FuelTypeFormData): Promise<FuelType> => {
    return api.post<FuelType>('/system/fuel-types', data);
  },

  updateFuelType: async (id: number, data: Partial<FuelTypeFormData>): Promise<FuelType> => {
    return api.patch<FuelType>(`/system/fuel-types/${id}`, data);
  },

  deleteFuelType: async (id: number): Promise<void> => {
    return api.delete(`/system/fuel-types/${id}`);
  },

  // Fuel Stations
  getFuelStations: async (): Promise<FuelStation[]> => {
    return api.get<FuelStation[]>('/system/fuel-stations');
  },

  createFuelStation: async (data: FuelStationFormData): Promise<FuelStation> => {
    return api.post<FuelStation>('/system/fuel-stations', data);
  },

  updateFuelStation: async (id: number, data: Partial<FuelStationFormData>): Promise<FuelStation> => {
    return api.patch<FuelStation>(`/system/fuel-stations/${id}`, data);
  },

  deleteFuelStation: async (id: number): Promise<void> => {
    return api.delete(`/system/fuel-stations/${id}`);
  },

  // Maintenance Types
  getMaintenanceTypes: async (): Promise<MaintenanceType[]> => {
    return api.get<MaintenanceType[]>('/system/maintenance-types');
  },

  createMaintenanceType: async (data: MaintenanceTypeFormData): Promise<MaintenanceType> => {
    return api.post<MaintenanceType>('/system/maintenance-types', data);
  },

  updateMaintenanceType: async (id: number, data: Partial<MaintenanceTypeFormData>): Promise<MaintenanceType> => {
    return api.patch<MaintenanceType>(`/system/maintenance-types/${id}`, data);
  },

  deleteMaintenanceType: async (id: number): Promise<void> => {
    return api.delete(`/system/maintenance-types/${id}`);
  },

  // Departments
  getDepartments: async (): Promise<Department[]> => {
    return api.get<Department[]>('/system/departments');
  },

  createDepartment: async (data: DepartmentFormData): Promise<Department> => {
    return api.post<Department>('/system/departments', data);
  },

  updateDepartment: async (id: number, data: Partial<DepartmentFormData>): Promise<Department> => {
    return api.patch<Department>(`/system/departments/${id}`, data);
  },

  deleteDepartment: async (id: number): Promise<void> => {
    return api.delete(`/system/departments/${id}`);
  },

  // Locations
  getLocations: async (): Promise<Location[]> => {
    return api.get<Location[]>('/system/locations');
  },

  createLocation: async (data: LocationFormData): Promise<Location> => {
    return api.post<Location>('/system/locations', data);
  },

  updateLocation: async (id: number, data: Partial<LocationFormData>): Promise<Location> => {
    return api.patch<Location>(`/system/locations/${id}`, data);
  },

  deleteLocation: async (id: number): Promise<void> => {
    return api.delete(`/system/locations/${id}`);
  },

  // Cities
  getCities: async (): Promise<City[]> => {
    return api.get<City[]>('/system/cities');
  },

  createCity: async (data: CityFormData): Promise<City> => {
    return api.post<City>('/system/cities', data);
  },

  updateCity: async (id: number, data: Partial<CityFormData>): Promise<City> => {
    return api.patch<City>(`/system/cities/${id}`, data);
  },

  deleteCity: async (id: number): Promise<void> => {
    return api.delete(`/system/cities/${id}`);
  },

  // Suppliers
  getSuppliers: async (): Promise<Supplier[]> => {
    return api.get<Supplier[]>('/system/suppliers');
  },

  createSupplier: async (data: SupplierFormData): Promise<Supplier> => {
    return api.post<Supplier>('/system/suppliers', data);
  },

  updateSupplier: async (id: number, data: Partial<SupplierFormData>): Promise<Supplier> => {
    return api.patch<Supplier>(`/system/suppliers/${id}`, data);
  },

  deleteSupplier: async (id: number): Promise<void> => {
    return api.delete(`/system/suppliers/${id}`);
  },

  // Material Units
  getMaterialUnits: async (): Promise<MaterialUnit[]> => {
    return api.get<MaterialUnit[]>('/system/material-units');
  },

  createMaterialUnit: async (data: MaterialUnitFormData): Promise<MaterialUnit> => {
    return api.post<MaterialUnit>('/system/material-units', data);
  },

  updateMaterialUnit: async (id: number, data: Partial<MaterialUnitFormData>): Promise<MaterialUnit> => {
    return api.patch<MaterialUnit>(`/system/material-units/${id}`, data);
  },

  deleteMaterialUnit: async (id: number): Promise<void> => {
    return api.delete(`/system/material-units/${id}`);
  },

  // Material Categories
  getMaterialCategories: async (): Promise<MaterialCategory[]> => {
    return api.get<MaterialCategory[]>('/system/material-categories');
  },

  createMaterialCategory: async (data: MaterialCategoryFormData): Promise<MaterialCategory> => {
    return api.post<MaterialCategory>('/system/material-categories', data);
  },

  updateMaterialCategory: async (id: number, data: Partial<MaterialCategoryFormData>): Promise<MaterialCategory> => {
    return api.patch<MaterialCategory>(`/system/material-categories/${id}`, data);
  },

  deleteMaterialCategory: async (id: number): Promise<void> => {
    return api.delete(`/system/material-categories/${id}`);
  },

  // Positions
  getPositions: async (): Promise<Position[]> => {
    return api.get<Position[]>('/system/positions');
  },

  createPosition: async (data: PositionFormData): Promise<Position> => {
    return api.post<Position>('/system/positions', data);
  },

  updatePosition: async (id: number, data: Partial<PositionFormData>): Promise<Position> => {
    return api.patch<Position>(`/system/positions/${id}`, data);
  },

  deletePosition: async (id: number): Promise<void> => {
    return api.delete(`/system/positions/${id}`);
  },

  // License Types
  getLicenseTypes: async (): Promise<LicenseType[]> => {
    return api.get<LicenseType[]>('/system/license-types');
  },

  createLicenseType: async (data: LicenseTypeFormData): Promise<LicenseType> => {
    return api.post<LicenseType>('/system/license-types', data);
  },

  updateLicenseType: async (id: number, data: Partial<LicenseTypeFormData>): Promise<LicenseType> => {
    return api.patch<LicenseType>(`/system/license-types/${id}`, data);
  },

  deleteLicenseType: async (id: number): Promise<void> => {
    return api.delete(`/system/license-types/${id}`);
  },

  // Inspection Types
  getInspectionTypes: async (): Promise<InspectionType[]> => {
    return api.get<InspectionType[]>('/system/inspection-types');
  },

  createInspectionType: async (data: InspectionTypeFormData): Promise<InspectionType> => {
    return api.post<InspectionType>('/system/inspection-types', data);
  },

  updateInspectionType: async (id: number, data: Partial<InspectionTypeFormData>): Promise<InspectionType> => {
    return api.patch<InspectionType>(`/system/inspection-types/${id}`, data);
  },

  deleteInspectionType: async (id: number): Promise<void> => {
    return api.delete(`/system/inspection-types/${id}`);
  },
};

export default adminApi;
