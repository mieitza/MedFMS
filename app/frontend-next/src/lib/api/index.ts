export { api, ApiClientError } from './client';
export { authApi } from './auth';
export { vehiclesApi } from './vehicles';
export { driversApi } from './drivers';
export { dashboardApi } from './dashboard';
export { fuelApi } from './fuel';

// Re-export types
export type { VehicleFilters } from './vehicles';
export type { DriverFilters } from './drivers';
export type { FuelTransactionFilters, FuelStats } from './fuel';
