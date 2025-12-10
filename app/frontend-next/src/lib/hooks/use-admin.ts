'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
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
} from '@/types';
import type {
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
  MaterialCategory,
  MaterialCategoryFormData,
  Position,
  PositionFormData,
  LicenseType,
  LicenseTypeFormData,
  InspectionType,
  InspectionTypeFormData,
} from '@/lib/api/admin';
import { toast } from 'sonner';

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  user: (id: number) => [...adminKeys.users(), id] as const,
  referenceData: (type: ReferenceDataType) => [...adminKeys.all, 'reference', type] as const,
  brands: () => [...adminKeys.all, 'brands'] as const,
  models: (brandId?: number) => [...adminKeys.all, 'models', brandId] as const,
  vehicleTypes: () => [...adminKeys.all, 'vehicle-types'] as const,
  vehicleStatuses: () => [...adminKeys.all, 'vehicle-statuses'] as const,
  fuelTypes: () => [...adminKeys.all, 'fuel-types'] as const,
  fuelStations: () => [...adminKeys.all, 'fuel-stations'] as const,
  maintenanceTypes: () => [...adminKeys.all, 'maintenance-types'] as const,
  departments: () => [...adminKeys.all, 'departments'] as const,
  locations: () => [...adminKeys.all, 'locations'] as const,
  cities: () => [...adminKeys.all, 'cities'] as const,
  suppliers: () => [...adminKeys.all, 'suppliers'] as const,
  materialUnits: () => [...adminKeys.all, 'material-units'] as const,
  materialCategories: () => [...adminKeys.all, 'material-categories'] as const,
  positions: () => [...adminKeys.all, 'positions'] as const,
  licenseTypes: () => [...adminKeys.all, 'license-types'] as const,
  inspectionTypes: () => [...adminKeys.all, 'inspection-types'] as const,
};

// ========================
// Users Hooks
// ========================

export function useUsers() {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: () => adminApi.getUsers(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: adminKeys.user(id!),
    queryFn: () => adminApi.getUser(id!),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserFormData) => adminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success('Utilizatorul a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea utilizatorului: ${error.message}`);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserFormData> }) =>
      adminApi.updateUser(id, data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(user.id) });
      toast.success('Utilizatorul a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea utilizatorului: ${error.message}`);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success('Utilizatorul a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea utilizatorului: ${error.message}`);
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success('Utilizatorul a fost activat');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la activarea utilizatorului: ${error.message}`);
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success('Utilizatorul a fost dezactivat');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la dezactivarea utilizatorului: ${error.message}`);
    },
  });
}

export function useResetUserPin() {
  return useMutation({
    mutationFn: ({ id, pin }: { id: number; pin: string }) => adminApi.resetUserPin(id, pin),
    onSuccess: () => {
      toast.success('PIN-ul a fost resetat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la resetarea PIN-ului: ${error.message}`);
    },
  });
}

// ========================
// Brands Hooks
// ========================

export function useAdminBrands() {
  return useQuery({
    queryKey: adminKeys.brands(),
    queryFn: () => adminApi.getBrands(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BrandFormData) => adminApi.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.brands() });
      toast.success('Marca a fost creată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea mărcii: ${error.message}`);
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BrandFormData> }) =>
      adminApi.updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.brands() });
      toast.success('Marca a fost actualizată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea mărcii: ${error.message}`);
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.brands() });
      toast.success('Marca a fost ștearsă cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea mărcii: ${error.message}`);
    },
  });
}

// ========================
// Models Hooks
// ========================

export function useAdminModels(brandId?: number) {
  return useQuery({
    queryKey: adminKeys.models(brandId),
    queryFn: () => adminApi.getModels(brandId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModelFormData) => adminApi.createModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.models() });
      toast.success('Modelul a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea modelului: ${error.message}`);
    },
  });
}

export function useUpdateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ModelFormData> }) =>
      adminApi.updateModel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.models() });
      toast.success('Modelul a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea modelului: ${error.message}`);
    },
  });
}

export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.models() });
      toast.success('Modelul a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea modelului: ${error.message}`);
    },
  });
}

// ========================
// Vehicle Types Hooks
// ========================

export function useAdminVehicleTypes() {
  return useQuery({
    queryKey: adminKeys.vehicleTypes(),
    queryFn: () => adminApi.getVehicleTypes(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateVehicleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleTypeFormData) => adminApi.createVehicleType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.vehicleTypes() });
      toast.success('Tipul de vehicul a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea tipului de vehicul: ${error.message}`);
    },
  });
}

export function useUpdateVehicleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VehicleTypeFormData> }) =>
      adminApi.updateVehicleType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.vehicleTypes() });
      toast.success('Tipul de vehicul a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea tipului de vehicul: ${error.message}`);
    },
  });
}

export function useDeleteVehicleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteVehicleType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.vehicleTypes() });
      toast.success('Tipul de vehicul a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea tipului de vehicul: ${error.message}`);
    },
  });
}

// ========================
// Vehicle Statuses Hooks
// ========================

export function useAdminVehicleStatuses() {
  return useQuery({
    queryKey: adminKeys.vehicleStatuses(),
    queryFn: () => adminApi.getVehicleStatuses(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateVehicleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleStatusFormData) => adminApi.createVehicleStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.vehicleStatuses() });
      toast.success('Statusul vehiculului a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea statusului: ${error.message}`);
    },
  });
}

export function useUpdateVehicleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VehicleStatusFormData> }) =>
      adminApi.updateVehicleStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.vehicleStatuses() });
      toast.success('Statusul vehiculului a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea statusului: ${error.message}`);
    },
  });
}

export function useDeleteVehicleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteVehicleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.vehicleStatuses() });
      toast.success('Statusul vehiculului a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea statusului: ${error.message}`);
    },
  });
}

// ========================
// Fuel Types Hooks
// ========================

export function useAdminFuelTypes() {
  return useQuery({
    queryKey: adminKeys.fuelTypes(),
    queryFn: () => adminApi.getFuelTypes(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateFuelType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FuelTypeFormData) => adminApi.createFuelType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.fuelTypes() });
      toast.success('Tipul de combustibil a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea tipului de combustibil: ${error.message}`);
    },
  });
}

export function useUpdateFuelType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FuelTypeFormData> }) =>
      adminApi.updateFuelType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.fuelTypes() });
      toast.success('Tipul de combustibil a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea tipului de combustibil: ${error.message}`);
    },
  });
}

export function useDeleteFuelType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteFuelType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.fuelTypes() });
      toast.success('Tipul de combustibil a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea tipului de combustibil: ${error.message}`);
    },
  });
}

// ========================
// Fuel Stations Hooks
// ========================

export function useAdminFuelStations() {
  return useQuery({
    queryKey: adminKeys.fuelStations(),
    queryFn: () => adminApi.getFuelStations(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateFuelStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FuelStationFormData) => adminApi.createFuelStation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.fuelStations() });
      toast.success('Stația de combustibil a fost creată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea stației: ${error.message}`);
    },
  });
}

export function useUpdateFuelStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FuelStationFormData> }) =>
      adminApi.updateFuelStation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.fuelStations() });
      toast.success('Stația de combustibil a fost actualizată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea stației: ${error.message}`);
    },
  });
}

export function useDeleteFuelStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteFuelStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.fuelStations() });
      toast.success('Stația de combustibil a fost ștearsă cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea stației: ${error.message}`);
    },
  });
}

// ========================
// Maintenance Types Hooks
// ========================

export function useAdminMaintenanceTypes() {
  return useQuery({
    queryKey: adminKeys.maintenanceTypes(),
    queryFn: () => adminApi.getMaintenanceTypes(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateMaintenanceType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaintenanceTypeFormData) => adminApi.createMaintenanceType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.maintenanceTypes() });
      toast.success('Tipul de mentenanță a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea tipului de mentenanță: ${error.message}`);
    },
  });
}

export function useUpdateMaintenanceType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MaintenanceTypeFormData> }) =>
      adminApi.updateMaintenanceType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.maintenanceTypes() });
      toast.success('Tipul de mentenanță a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea tipului de mentenanță: ${error.message}`);
    },
  });
}

export function useDeleteMaintenanceType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteMaintenanceType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.maintenanceTypes() });
      toast.success('Tipul de mentenanță a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea tipului de mentenanță: ${error.message}`);
    },
  });
}

// ========================
// Departments Hooks
// ========================

export function useAdminDepartments() {
  return useQuery({
    queryKey: adminKeys.departments(),
    queryFn: () => adminApi.getDepartments(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepartmentFormData) => adminApi.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.departments() });
      toast.success('Departamentul a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea departamentului: ${error.message}`);
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DepartmentFormData> }) =>
      adminApi.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.departments() });
      toast.success('Departamentul a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea departamentului: ${error.message}`);
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.departments() });
      toast.success('Departamentul a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea departamentului: ${error.message}`);
    },
  });
}

// ========================
// Locations Hooks
// ========================

export function useAdminLocations() {
  return useQuery({
    queryKey: adminKeys.locations(),
    queryFn: () => adminApi.getLocations(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LocationFormData) => adminApi.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.locations() });
      toast.success('Locația a fost creată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea locației: ${error.message}`);
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LocationFormData> }) =>
      adminApi.updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.locations() });
      toast.success('Locația a fost actualizată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea locației: ${error.message}`);
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.locations() });
      toast.success('Locația a fost ștearsă cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea locației: ${error.message}`);
    },
  });
}

// ========================
// Cities Hooks
// ========================

export function useAdminCities() {
  return useQuery({
    queryKey: adminKeys.cities(),
    queryFn: () => adminApi.getCities(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CityFormData) => adminApi.createCity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.cities() });
      toast.success('Orașul a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea orașului: ${error.message}`);
    },
  });
}

export function useUpdateCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CityFormData> }) =>
      adminApi.updateCity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.cities() });
      toast.success('Orașul a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea orașului: ${error.message}`);
    },
  });
}

export function useDeleteCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteCity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.cities() });
      toast.success('Orașul a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea orașului: ${error.message}`);
    },
  });
}

// ========================
// Suppliers Hooks
// ========================

export function useAdminSuppliers() {
  return useQuery({
    queryKey: adminKeys.suppliers(),
    queryFn: () => adminApi.getSuppliers(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierFormData) => adminApi.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.suppliers() });
      toast.success('Furnizorul a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea furnizorului: ${error.message}`);
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SupplierFormData> }) =>
      adminApi.updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.suppliers() });
      toast.success('Furnizorul a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea furnizorului: ${error.message}`);
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.suppliers() });
      toast.success('Furnizorul a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea furnizorului: ${error.message}`);
    },
  });
}

// ========================
// Material Units Hooks
// ========================

export function useAdminMaterialUnits() {
  return useQuery({
    queryKey: adminKeys.materialUnits(),
    queryFn: () => adminApi.getMaterialUnits(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateMaterialUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaterialUnitFormData) => adminApi.createMaterialUnit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.materialUnits() });
      toast.success('Unitatea de măsură a fost creată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea unității de măsură: ${error.message}`);
    },
  });
}

export function useUpdateMaterialUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MaterialUnitFormData> }) =>
      adminApi.updateMaterialUnit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.materialUnits() });
      toast.success('Unitatea de măsură a fost actualizată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea unității de măsură: ${error.message}`);
    },
  });
}

export function useDeleteMaterialUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteMaterialUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.materialUnits() });
      toast.success('Unitatea de măsură a fost ștearsă cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea unității de măsură: ${error.message}`);
    },
  });
}

// ========================
// Material Categories Hooks
// ========================

export function useAdminMaterialCategories() {
  return useQuery({
    queryKey: adminKeys.materialCategories(),
    queryFn: () => adminApi.getMaterialCategories(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateMaterialCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaterialCategoryFormData) => adminApi.createMaterialCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.materialCategories() });
      toast.success('Categoria de materiale a fost creată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea categoriei: ${error.message}`);
    },
  });
}

export function useUpdateMaterialCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MaterialCategoryFormData> }) =>
      adminApi.updateMaterialCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.materialCategories() });
      toast.success('Categoria de materiale a fost actualizată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea categoriei: ${error.message}`);
    },
  });
}

export function useDeleteMaterialCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteMaterialCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.materialCategories() });
      toast.success('Categoria de materiale a fost ștearsă cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea categoriei: ${error.message}`);
    },
  });
}

// ========================
// Positions Hooks
// ========================

export function useAdminPositions() {
  return useQuery({
    queryKey: adminKeys.positions(),
    queryFn: () => adminApi.getPositions(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PositionFormData) => adminApi.createPosition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.positions() });
      toast.success('Poziția a fost creată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea poziției: ${error.message}`);
    },
  });
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PositionFormData> }) =>
      adminApi.updatePosition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.positions() });
      toast.success('Poziția a fost actualizată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea poziției: ${error.message}`);
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deletePosition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.positions() });
      toast.success('Poziția a fost ștearsă cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea poziției: ${error.message}`);
    },
  });
}

// ========================
// License Types Hooks
// ========================

export function useAdminLicenseTypes() {
  return useQuery({
    queryKey: adminKeys.licenseTypes(),
    queryFn: () => adminApi.getLicenseTypes(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateLicenseType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LicenseTypeFormData) => adminApi.createLicenseType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.licenseTypes() });
      toast.success('Tipul de licență a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea tipului de licență: ${error.message}`);
    },
  });
}

export function useUpdateLicenseType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LicenseTypeFormData> }) =>
      adminApi.updateLicenseType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.licenseTypes() });
      toast.success('Tipul de licență a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea tipului de licență: ${error.message}`);
    },
  });
}

export function useDeleteLicenseType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteLicenseType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.licenseTypes() });
      toast.success('Tipul de licență a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea tipului de licență: ${error.message}`);
    },
  });
}

// ========================
// Inspection Types Hooks
// ========================

export function useAdminInspectionTypes() {
  return useQuery({
    queryKey: adminKeys.inspectionTypes(),
    queryFn: () => adminApi.getInspectionTypes(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateInspectionType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InspectionTypeFormData) => adminApi.createInspectionType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.inspectionTypes() });
      toast.success('Tipul de inspecție a fost creat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la crearea tipului de inspecție: ${error.message}`);
    },
  });
}

export function useUpdateInspectionType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InspectionTypeFormData> }) =>
      adminApi.updateInspectionType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.inspectionTypes() });
      toast.success('Tipul de inspecție a fost actualizat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la actualizarea tipului de inspecție: ${error.message}`);
    },
  });
}

export function useDeleteInspectionType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteInspectionType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.inspectionTypes() });
      toast.success('Tipul de inspecție a fost șters cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea tipului de inspecție: ${error.message}`);
    },
  });
}
