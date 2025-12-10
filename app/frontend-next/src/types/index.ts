// Core entity types matching the backend database schema

// User & Auth
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  departmentId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  pin: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Vehicle related types
export interface Vehicle {
  id: number;
  vehicleCode: string;
  licensePlate: string;
  brandId: number;
  modelId: number;
  year: number | null;
  vehicleTypeId: number | null;
  fuelTypeId: number | null;
  statusId: number | null;
  departmentId: number | null;
  locationId: number | null;
  odometer: number | null;
  registrationDate: string | null;
  acquisitionDate: string | null;
  vin: string | null;
  engineNumber: string | null;
  color: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // ANMDM fields
  anmdmAuthNumber: string | null;
  anmdmAuthType: string | null;
  anmdmDocumentPath: string | null;
  // Relations (when expanded)
  brand?: Brand;
  model?: Model;
  vehicleType?: VehicleType;
  fuelType?: FuelType;
  status?: VehicleStatus;
  department?: Department;
  location?: Location;
  // Custom fields
  customField1?: string | null;
  customField2?: string | null;
  customField3?: string | null;
  customField4?: string | null;
  customField5?: string | null;
  customField6?: string | null;
  customField7?: string | null;
  customField8?: string | null;
  customField9?: string | null;
  customField10?: string | null;
  customField11?: string | null;
  customField12?: string | null;
}

export interface Brand {
  id: number;
  brandCode: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface Model {
  id: number;
  modelCode: string;
  brandId: number;
  name: string;
  description: string | null;
  isActive: boolean;
  brand?: Brand;
}

export interface VehicleType {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface VehicleStatus {
  id: number;
  name: string;
  color: string | null;
  description: string | null;
  isActive: boolean;
}

// Driver related types
export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  idNumber: string | null;
  dateOfBirth: string | null;
  licenseNumber: string;
  licenseType: string | null;
  licenseExpiryDate: string | null;
  hireDate: string | null;
  terminationDate: string | null;
  departmentId: number | null;
  positionId: number | null;
  cityId: number | null;
  phoneNumber: string | null;
  mobileNumber: string | null;
  email: string | null;
  address: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  department?: Department;
  city?: City;
}

// Fuel related types
export interface FuelType {
  id: number;
  fuelCode: string;
  name: string;
  pricePerLiter: number | null;
  density: number | null;
  description: string | null;
  isActive: boolean;
}

export interface FuelTransaction {
  id: number;
  vehicleId: number;
  driverId: number | null;
  fuelTypeId: number;
  fuelStationId: number | null;
  quantity: number;
  pricePerUnit: number | null;
  totalCost: number | null;
  odometer: number | null;
  transactionDate: string;
  deliveryDate: string | null;
  invoiceDate: string | null;
  invoiceNumber: string | null;
  cardNumber: string | null;
  costCenter: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  vehicle?: Vehicle;
  driver?: Driver;
  fuelType?: FuelType;
  fuelStation?: FuelStation;
}

export interface FuelStation {
  id: number;
  name: string;
  address: string | null;
  cityId: number | null;
  phone: string | null;
  operatingHours: string | null;
  paymentMethods: string | null;
  services: string | null;
  isActive: boolean;
}

// Maintenance related types
export interface MaintenanceType {
  id: number;
  name: string;
  category: 'preventive' | 'corrective' | 'emergency' | 'inspection';
  priority: number;
  estimatedCost: number | null;
  estimatedDuration: number | null;
  description: string | null;
  isActive: boolean;
}

export interface MaintenanceWorkOrder {
  id: number;
  workOrderNumber: string;
  vehicleId: number;
  maintenanceTypeId: number;
  title: string | null;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: number;
  scheduledDate: string | null;
  startDate: string | null;
  completionDate: string | null;
  odometer: number | null;
  description: string | null;
  diagnosis: string | null;
  workPerformed: string | null;
  technicianNotes: string | null;
  estimatedCost: number | null;
  actualCost: number | null;
  partsCost: number | null;
  laborCost: number | null;
  approvedBy: number | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  vehicle?: Vehicle;
  maintenanceType?: MaintenanceType;
}

// Material/Warehouse related types
export interface Material {
  id: number;
  materialCode: string;
  name: string;
  description: string | null;
  categoryId: number | null;
  unitId: number | null;
  standardPrice: number | null;
  lastPurchasePrice: number | null;
  lastSalePrice: number | null;
  currentStock: number;
  criticalLevel: number | null;
  expirationDate: string | null;
  barcode: string | null;
  serialNumber: string | null;
  warehouseId: number | null;
  locationInWarehouse: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  warehouse?: Warehouse;
  unit?: MaterialUnit;
}

export interface Warehouse {
  id: number;
  name: string;
  address: string | null;
  cityId: number | null;
  capacity: number | null;
  managerId: number | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  isActive: boolean;
}

export interface MaterialUnit {
  id: number;
  unitCode: string;
  name: string;
  abbreviation: string | null;
  description: string | null;
  isActive: boolean;
}

export interface TransferRequest {
  id: number;
  requestNumber: string;
  sourceWarehouseId: number | null;
  destinationWarehouseId: number | null;
  destinationVehicleId: number | null;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  requestedBy: number;
  requestedAt: string;
  approvedBy: number | null;
  approvedAt: string | null;
  completedAt: string | null;
  notes: string | null;
  // Relations
  sourceWarehouse?: Warehouse;
  destinationWarehouse?: Warehouse;
  destinationVehicle?: Vehicle;
}

// Reference data types
export interface Department {
  id: number;
  departmentCode: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface Location {
  id: number;
  name: string;
  address: string | null;
  cityId: number | null;
  phone: string | null;
  description: string | null;
  isActive: boolean;
}

export interface City {
  id: number;
  cityCode: string;
  name: string;
  county: string | null;
  country: string | null;
  isActive: boolean;
}

export interface Supplier {
  id: number;
  supplierCode: string;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  cityId: number | null;
  taxId: string | null;
  paymentTerms: string | null;
  notes: string | null;
  isActive: boolean;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

// Dashboard types
export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  pendingWorkOrders: number;
  overdueMaintenances: number;
  fuelCostMTD: number;
  fuelCostChange: number;
  expiringDocuments: number;
  lowStockMaterials: number;
}

export interface RecentActivity {
  id: number;
  type: 'vehicle' | 'driver' | 'fuel' | 'maintenance' | 'material' | 'transfer';
  action: 'created' | 'updated' | 'deleted' | 'completed' | 'approved';
  description: string;
  entityId: number;
  entityName: string;
  userId: number;
  userName: string;
  timestamp: string;
}

// Form types
export interface VehicleFormData {
  vehicleCode: string;
  licensePlate: string;
  brandId: number;
  modelId: number;
  year?: number | null;
  vehicleTypeId?: number | null;
  fuelTypeId?: number | null;
  statusId?: number | null;
  departmentId?: number | null;
  locationId?: number | null;
  odometer?: number | null;
  registrationDate?: string | null;
  acquisitionDate?: string | null;
  vin?: string | null;
  engineNumber?: string | null;
  color?: string | null;
  notes?: string | null;
}

export interface DriverFormData {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  idNumber?: string | null;
  dateOfBirth?: string | null;
  licenseType?: string | null;
  licenseExpiryDate?: string | null;
  hireDate?: string | null;
  departmentId?: number | null;
  cityId?: number | null;
  phoneNumber?: string | null;
  mobileNumber?: string | null;
  email?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  notes?: string | null;
}

export interface FuelTransactionFormData {
  vehicleId: number;
  driverId?: number | null;
  fuelTypeId: number;
  fuelStationId?: number | null;
  quantity: number;
  pricePerUnit?: number | null;
  totalCost?: number | null;
  odometer?: number | null;
  transactionDate: string;
  deliveryDate?: string | null;
  invoiceDate?: string | null;
  invoiceNumber?: string | null;
  cardNumber?: string | null;
  costCenter?: string | null;
  notes?: string | null;
}

// Navigation types for command palette
export interface NavigationItem {
  title: string;
  href: string;
  icon?: string;
  description?: string;
  keywords?: string[];
}

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  shortcut?: string[];
  action: () => void;
}
