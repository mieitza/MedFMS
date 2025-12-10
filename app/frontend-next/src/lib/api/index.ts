export { api, ApiClientError } from './client';
export { authApi } from './auth';
export { vehiclesApi } from './vehicles';
export { driversApi } from './drivers';
export { dashboardApi } from './dashboard';
export { fuelApi } from './fuel';
export { maintenanceApi } from './maintenance';
export { warehouseApi } from './warehouse';

// Re-export types
export type { VehicleFilters } from './vehicles';
export type { DriverFilters } from './drivers';
export type { FuelTransactionFilters, FuelStats } from './fuel';
export type { MaintenanceWorkOrderFilters, MaintenanceStats, MaintenanceWorkOrderFormData } from './maintenance';
export type { MaterialFilters, MaterialFormData, TransferRequestFilters, TransferRequestFormData, WarehouseStats } from './warehouse';
