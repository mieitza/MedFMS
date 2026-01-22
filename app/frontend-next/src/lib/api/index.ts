export { api, ApiClientError } from './client';
export { authApi } from './auth';
export { companiesApi } from './companies';
export { vehiclesApi } from './vehicles';
export { driversApi } from './drivers';
export { dashboardApi } from './dashboard';
export { fuelApi } from './fuel';
export { maintenanceApi } from './maintenance';
export { warehouseApi } from './warehouse';
export { adminApi } from './admin';
export { chatApi } from './chat';

// Re-export types
export type { VehicleFilters } from './vehicles';
export type { DriverFilters } from './drivers';
export type { FuelTransactionFilters, FuelStats } from './fuel';
export type { MaintenanceWorkOrderFilters, MaintenanceStats, MaintenanceWorkOrderFormData } from './maintenance';
export type { MaterialFilters, MaterialFormData, TransferRequestFilters, TransferRequestFormData, WarehouseStats } from './warehouse';
export type {
  ReferenceDataType,
  UserFormData,
  BrandFormData,
  ModelFormData,
  VehicleTypeFormData,
  VehicleStatusFormData,
  FuelTypeFormData,
  FuelStationFormData,
  MaintenanceTypeFormData,
  DepartmentFormData,
  LocationFormData,
  CityFormData,
  SupplierFormData,
  MaterialUnitFormData,
  MaterialCategoryFormData,
  MaterialCategory,
  PositionFormData,
  Position,
  LicenseTypeFormData,
  LicenseType,
  InspectionTypeFormData,
  InspectionType,
} from './admin';
export type { ChatMessage, ChatResponse, ChatHealthResponse, ChatConfigResponse, ChatTool, StreamEvent } from './chat';
export type { CompanyWithStats, CreateCompanyData, UpdateCompanyData } from './companies';
