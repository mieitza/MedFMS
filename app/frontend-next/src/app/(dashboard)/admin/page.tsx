'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Settings,
  Users,
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Loader2,
  Car,
  Fuel,
  Wrench,
  MapPin,
  Building2,
  Tag,
  Package,
  Save,
} from 'lucide-react';
import {
  useAdminBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
  useAdminModels,
  useCreateModel,
  useUpdateModel,
  useDeleteModel,
  useAdminVehicleTypes,
  useCreateVehicleType,
  useUpdateVehicleType,
  useDeleteVehicleType,
  useAdminVehicleStatuses,
  useCreateVehicleStatus,
  useUpdateVehicleStatus,
  useDeleteVehicleStatus,
  useAdminFuelTypes,
  useCreateFuelType,
  useUpdateFuelType,
  useDeleteFuelType,
  useAdminFuelStations,
  useCreateFuelStation,
  useUpdateFuelStation,
  useDeleteFuelStation,
  useAdminMaintenanceTypes,
  useCreateMaintenanceType,
  useUpdateMaintenanceType,
  useDeleteMaintenanceType,
  useAdminDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useAdminLocations,
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation,
  useAdminCities,
  useCreateCity,
  useUpdateCity,
  useDeleteCity,
  useAdminSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
  useAdminMaterialUnits,
  useCreateMaterialUnit,
  useUpdateMaterialUnit,
  useDeleteMaterialUnit,
  useAdminMaterialCategories,
  useCreateMaterialCategory,
  useUpdateMaterialCategory,
  useDeleteMaterialCategory,
  useAdminPositions,
  useCreatePosition,
  useUpdatePosition,
  useDeletePosition,
} from '@/lib/hooks';
import type {
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
import type { MaterialCategory, Position } from '@/lib/api/admin';

// Tab configuration
const adminTabs = [
  { value: 'brands', label: 'Mărci', icon: Car },
  { value: 'models', label: 'Modele', icon: Car },
  { value: 'vehicle-types', label: 'Tipuri vehicule', icon: Car },
  { value: 'vehicle-statuses', label: 'Statusuri vehicule', icon: Tag },
  { value: 'fuel-types', label: 'Tipuri combustibil', icon: Fuel },
  { value: 'fuel-stations', label: 'Stații combustibil', icon: Fuel },
  { value: 'maintenance-types', label: 'Tipuri mentenanță', icon: Wrench },
  { value: 'departments', label: 'Departamente', icon: Building2 },
  { value: 'locations', label: 'Locații', icon: MapPin },
  { value: 'cities', label: 'Orașe', icon: MapPin },
  { value: 'suppliers', label: 'Furnizori', icon: Package },
  { value: 'material-units', label: 'Unități măsură', icon: Package },
  { value: 'material-categories', label: 'Categorii materiale', icon: Package },
  { value: 'positions', label: 'Poziții', icon: Users },
];

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'brands';

  const handleTabChange = (value: string) => {
    router.push(`/admin?tab=${value}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
            <Settings className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Administrare
            </h1>
            <p className="text-sm text-slate-500">
              Gestionare date de referință și setări sistem
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/users')}>
          <Users className="mr-2 h-4 w-4" />
          Utilizatori
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="overflow-x-auto">
          <TabsList className="inline-flex h-auto min-w-full flex-wrap gap-1 bg-transparent p-0">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <TabsContent value="brands" className="mt-6">
          <BrandsTab />
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <ModelsTab />
        </TabsContent>

        <TabsContent value="vehicle-types" className="mt-6">
          <VehicleTypesTab />
        </TabsContent>

        <TabsContent value="vehicle-statuses" className="mt-6">
          <VehicleStatusesTab />
        </TabsContent>

        <TabsContent value="fuel-types" className="mt-6">
          <FuelTypesTab />
        </TabsContent>

        <TabsContent value="fuel-stations" className="mt-6">
          <FuelStationsTab />
        </TabsContent>

        <TabsContent value="maintenance-types" className="mt-6">
          <MaintenanceTypesTab />
        </TabsContent>

        <TabsContent value="departments" className="mt-6">
          <DepartmentsTab />
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <LocationsTab />
        </TabsContent>

        <TabsContent value="cities" className="mt-6">
          <CitiesTab />
        </TabsContent>

        <TabsContent value="suppliers" className="mt-6">
          <SuppliersTab />
        </TabsContent>

        <TabsContent value="material-units" className="mt-6">
          <MaterialUnitsTab />
        </TabsContent>

        <TabsContent value="material-categories" className="mt-6">
          <MaterialCategoriesTab />
        </TabsContent>

        <TabsContent value="positions" className="mt-6">
          <PositionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ========================
// Brands Tab
// ========================

function BrandsTab() {
  const { data: brands, isLoading } = useAdminBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Brand | null>(null);
  const [formData, setFormData] = React.useState({ name: '', description: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: Brand) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți această marcă?')) {
      await deleteBrand.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateBrand.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createBrand.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createBrand.isPending || updateBrand.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mărci</CardTitle>
            <CardDescription>Gestionare mărci vehicule</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă marcă
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cod</TableHead>
              <TableHead>Denumire</TableHead>
              <TableHead>Descriere</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.brandCode}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-slate-500">{item.description || '-'}</TableCell>
                <TableCell>
                  <StatusBadge isActive={item.isActive} />
                </TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {brands?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500">
                  Nu există mărci înregistrate
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează marca' : 'Adaugă marcă nouă'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modificați datele mărcii' : 'Completați datele noii mărci'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Denumire *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Toyota"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descriere</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descriere opțională..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Activ</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Anulează</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingItem ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ========================
// Models Tab
// ========================

function ModelsTab() {
  const { data: models, isLoading } = useAdminModels();
  const { data: brands } = useAdminBrands();
  const createModel = useCreateModel();
  const updateModel = useUpdateModel();
  const deleteModel = useDeleteModel();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Model | null>(null);
  const [formData, setFormData] = React.useState({ name: '', brandId: 0, description: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', brandId: brands?.[0]?.id || 0, description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: Model) => {
    setEditingItem(item);
    setFormData({ name: item.name, brandId: item.brandId, description: item.description || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți acest model?')) {
      await deleteModel.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateModel.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createModel.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createModel.isPending || updateModel.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Modele</CardTitle>
            <CardDescription>Gestionare modele vehicule</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă model
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cod</TableHead>
              <TableHead>Marcă</TableHead>
              <TableHead>Denumire</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.modelCode}</TableCell>
                <TableCell>{item.brand?.name || '-'}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <StatusBadge isActive={item.isActive} />
                </TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează modelul' : 'Adaugă model nou'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modificați datele modelului' : 'Completați datele noului model'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Marcă *</label>
              <Select
                value={formData.brandId.toString()}
                onValueChange={(value) => setFormData({ ...formData, brandId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands?.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Denumire *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Corolla"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descriere</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Activ</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Anulează</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.name || !formData.brandId}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingItem ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ========================
// Vehicle Types Tab
// ========================

function VehicleTypesTab() {
  const { data: items, isLoading } = useAdminVehicleTypes();
  const createItem = useCreateVehicleType();
  const updateItem = useUpdateVehicleType();
  const deleteItem = useDeleteVehicleType();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<VehicleType | null>(null);
  const [formData, setFormData] = React.useState({ name: '', description: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: VehicleType) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți acest tip de vehicul?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tipuri vehicule</CardTitle>
            <CardDescription>Gestionare tipuri de vehicule</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă tip
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SimpleTable
          items={items}
          columns={['Denumire', 'Descriere', 'Status']}
          renderRow={(item) => (
            <>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-slate-500">{item.description || '-'}</TableCell>
              <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
            </>
          )}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>

      <SimpleFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={editingItem ? 'Editează tipul' : 'Adaugă tip nou'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        isEditing={!!editingItem}
      />
    </Card>
  );
}

// ========================
// Vehicle Statuses Tab
// ========================

function VehicleStatusesTab() {
  const { data: items, isLoading } = useAdminVehicleStatuses();
  const createItem = useCreateVehicleStatus();
  const updateItem = useUpdateVehicleStatus();
  const deleteItem = useDeleteVehicleStatus();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<VehicleStatus | null>(null);
  const [formData, setFormData] = React.useState({ name: '', color: '', description: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', color: '', description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: VehicleStatus) => {
    setEditingItem(item);
    setFormData({ name: item.name, color: item.color || '', description: item.description || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți acest status?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Statusuri vehicule</CardTitle>
            <CardDescription>Gestionare statusuri vehicule</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă status
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Denumire</TableHead>
              <TableHead>Culoare</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  {item.color ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded border"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-slate-500">{item.color}</span>
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează statusul' : 'Adaugă status nou'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modificați datele statusului' : 'Completați datele noului status'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Denumire *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Activ"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Culoare</label>
              <Input
                type="color"
                value={formData.color || '#000000'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descriere</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Activ</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Anulează</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingItem ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ========================
// Fuel Types Tab
// ========================

function FuelTypesTab() {
  const { data: items, isLoading } = useAdminFuelTypes();
  const createItem = useCreateFuelType();
  const updateItem = useUpdateFuelType();
  const deleteItem = useDeleteFuelType();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<FuelType | null>(null);
  const [formData, setFormData] = React.useState({ name: '', pricePerLiter: 0, description: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', pricePerLiter: 0, description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: FuelType) => {
    setEditingItem(item);
    setFormData({ name: item.name, pricePerLiter: item.pricePerLiter || 0, description: item.description || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți acest tip de combustibil?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tipuri combustibil</CardTitle>
            <CardDescription>Gestionare tipuri de combustibil</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă tip
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cod</TableHead>
              <TableHead>Denumire</TableHead>
              <TableHead>Preț/Litru</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.fuelCode}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.pricePerLiter ? `${item.pricePerLiter.toFixed(2)} RON` : '-'}</TableCell>
                <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează tipul' : 'Adaugă tip nou'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modificați datele tipului de combustibil' : 'Completați datele noului tip de combustibil'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Denumire *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Motorină"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Preț per litru (RON)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.pricePerLiter || ''}
                onChange={(e) => setFormData({ ...formData, pricePerLiter: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descriere</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Activ</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Anulează</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingItem ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ========================
// Remaining tabs use simplified patterns
// ========================

function FuelStationsTab() {
  const { data: items, isLoading } = useAdminFuelStations();
  const createItem = useCreateFuelStation();
  const updateItem = useUpdateFuelStation();
  const deleteItem = useDeleteFuelStation();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<FuelStation | null>(null);
  const [formData, setFormData] = React.useState({ name: '', address: '', phone: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', address: '', phone: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: FuelStation) => {
    setEditingItem(item);
    setFormData({ name: item.name, address: item.address || '', phone: item.phone || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți această stație?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Stații combustibil</CardTitle>
            <CardDescription>Gestionare stații de combustibil</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă stație
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Denumire</TableHead>
              <TableHead>Adresă</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-slate-500">{item.address || '-'}</TableCell>
                <TableCell>{item.phone || '-'}</TableCell>
                <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează stația' : 'Adaugă stație nouă'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modificați datele stației de combustibil' : 'Completați datele noii stații de combustibil'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Denumire *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Adresă</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Telefon</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Activ</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Anulează</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingItem ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function MaintenanceTypesTab() {
  const { data: items, isLoading } = useAdminMaintenanceTypes();
  const createItem = useCreateMaintenanceType();
  const updateItem = useUpdateMaintenanceType();
  const deleteItem = useDeleteMaintenanceType();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MaintenanceType | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    category: 'preventive' as MaintenanceType['category'],
    priority: 1,
    description: '',
    isActive: true
  });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', category: 'preventive', priority: 1, description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: MaintenanceType) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      priority: item.priority,
      description: item.description || '',
      isActive: item.isActive
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți acest tip?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  const categoryLabels: Record<string, string> = {
    preventive: 'Preventivă',
    corrective: 'Corectivă',
    emergency: 'Urgență',
    inspection: 'Inspecție',
  };

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tipuri mentenanță</CardTitle>
            <CardDescription>Gestionare tipuri de lucrări de mentenanță</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă tip
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Denumire</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead>Prioritate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{categoryLabels[item.category] || item.category}</TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează tipul' : 'Adaugă tip nou'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modificați datele tipului de mentenanță' : 'Completați datele noului tip de mentenanță'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Denumire *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Categorie *</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as MaintenanceType['category'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Preventivă</SelectItem>
                  <SelectItem value="corrective">Corectivă</SelectItem>
                  <SelectItem value="emergency">Urgență</SelectItem>
                  <SelectItem value="inspection">Inspecție</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Prioritate</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descriere</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Activ</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Anulează</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingItem ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function DepartmentsTab() {
  const { data: items, isLoading } = useAdminDepartments();
  const createItem = useCreateDepartment();
  const updateItem = useUpdateDepartment();
  const deleteItem = useDeleteDepartment();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Department | null>(null);
  const [formData, setFormData] = React.useState({ name: '', description: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: Department) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți acest departament?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Departamente</CardTitle>
            <CardDescription>Gestionare departamente</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă departament
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SimpleTable
          items={items}
          columns={['Cod', 'Denumire', 'Status']}
          renderRow={(item) => (
            <>
              <TableCell className="font-mono text-sm">{item.departmentCode}</TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
            </>
          )}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>

      <SimpleFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={editingItem ? 'Editează departamentul' : 'Adaugă departament nou'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        isEditing={!!editingItem}
      />
    </Card>
  );
}

function LocationsTab() {
  const { data: items, isLoading } = useAdminLocations();
  const createItem = useCreateLocation();
  const updateItem = useUpdateLocation();
  const deleteItem = useDeleteLocation();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Location | null>(null);
  const [formData, setFormData] = React.useState({ name: '', address: '', phone: '', description: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', address: '', phone: '', description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: Location) => {
    setEditingItem(item);
    setFormData({ name: item.name, address: item.address || '', phone: item.phone || '', description: item.description || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți această locație?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Locații</CardTitle>
            <CardDescription>Gestionare locații</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă locație
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Denumire</TableHead>
              <TableHead>Adresă</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-slate-500">{item.address || '-'}</TableCell>
                <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează locația' : 'Adaugă locație nouă'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modificați datele locației' : 'Completați datele noii locații'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Denumire *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Adresă</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Telefon</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descriere</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Activ</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Anulează</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingItem ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function CitiesTab() {
  const { data: items, isLoading } = useAdminCities();
  const createItem = useCreateCity();
  const updateItem = useUpdateCity();
  const deleteItem = useDeleteCity();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<City | null>(null);
  const [formData, setFormData] = React.useState({ name: '', county: '', country: 'România', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', county: '', country: 'România', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: City) => {
    setEditingItem(item);
    setFormData({ name: item.name, county: item.county || '', country: item.country || 'România', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți acest oraș?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Orașe</CardTitle>
            <CardDescription>Gestionare orașe</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă oraș
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cod</TableHead>
              <TableHead>Denumire</TableHead>
              <TableHead>Județ</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.cityCode}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.county || '-'}</TableCell>
                <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează orașul' : 'Adaugă oraș nou'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modificați datele orașului' : 'Completați datele noului oraș'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Denumire *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Județ</label>
              <Input
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Țară</label>
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Activ</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Anulează</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingItem ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function SuppliersTab() {
  const { data: items, isLoading } = useAdminSuppliers();
  const createItem = useCreateSupplier();
  const updateItem = useUpdateSupplier();
  const deleteItem = useDeleteSupplier();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Supplier | null>(null);
  const [formData, setFormData] = React.useState({ name: '', contactPerson: '', phone: '', email: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', contactPerson: '', phone: '', email: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: Supplier) => {
    setEditingItem(item);
    setFormData({ name: item.name, contactPerson: item.contactPerson || '', phone: item.phone || '', email: item.email || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți acest furnizor?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Furnizori</CardTitle>
            <CardDescription>Gestionare furnizori</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă furnizor
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cod</TableHead>
              <TableHead>Denumire</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.supplierCode}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.contactPerson || '-'}</TableCell>
                <TableCell>{item.phone || '-'}</TableCell>
                <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează furnizorul' : 'Adaugă furnizor nou'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modificați datele furnizorului' : 'Completați datele noului furnizor'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Denumire *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Persoană contact</label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Telefon</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Activ</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Anulează</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingItem ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function MaterialUnitsTab() {
  const { data: items, isLoading } = useAdminMaterialUnits();
  const createItem = useCreateMaterialUnit();
  const updateItem = useUpdateMaterialUnit();
  const deleteItem = useDeleteMaterialUnit();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MaterialUnit | null>(null);
  const [formData, setFormData] = React.useState({ name: '', abbreviation: '', description: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', abbreviation: '', description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: MaterialUnit) => {
    setEditingItem(item);
    setFormData({ name: item.name, abbreviation: item.abbreviation || '', description: item.description || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți această unitate?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Unități de măsură</CardTitle>
            <CardDescription>Gestionare unități de măsură pentru materiale</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă unitate
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cod</TableHead>
              <TableHead>Denumire</TableHead>
              <TableHead>Abreviere</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.unitCode}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.abbreviation || '-'}</TableCell>
                <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editează unitatea' : 'Adaugă unitate nouă'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Modificați datele unității de măsură' : 'Completați datele noii unități de măsură'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Denumire *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Kilogram"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Abreviere</label>
              <Input
                value={formData.abbreviation}
                onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                placeholder="ex: kg"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descriere</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Activ</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Anulează</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingItem ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function MaterialCategoriesTab() {
  const { data: items, isLoading } = useAdminMaterialCategories();
  const createItem = useCreateMaterialCategory();
  const updateItem = useUpdateMaterialCategory();
  const deleteItem = useDeleteMaterialCategory();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MaterialCategory | null>(null);
  const [formData, setFormData] = React.useState({ name: '', description: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: MaterialCategory) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți această categorie?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categorii materiale</CardTitle>
            <CardDescription>Gestionare categorii de materiale</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă categorie
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SimpleTable
          items={items}
          columns={['Cod', 'Denumire', 'Status']}
          renderRow={(item) => (
            <>
              <TableCell className="font-mono text-sm">{item.categoryCode}</TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
            </>
          )}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>

      <SimpleFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={editingItem ? 'Editează categoria' : 'Adaugă categorie nouă'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        isEditing={!!editingItem}
      />
    </Card>
  );
}

function PositionsTab() {
  const { data: items, isLoading } = useAdminPositions();
  const createItem = useCreatePosition();
  const updateItem = useUpdatePosition();
  const deleteItem = useDeletePosition();

  const [showDialog, setShowDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Position | null>(null);
  const [formData, setFormData] = React.useState({ name: '', description: '', isActive: true });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', isActive: true });
    setShowDialog(true);
  };

  const handleEdit = (item: Position) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description || '', isActive: item.isActive });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sigur doriți să ștergeți această poziție?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createItem.mutateAsync(formData);
    }
    setShowDialog(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending;

  if (isLoading) return <TabSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Poziții</CardTitle>
            <CardDescription>Gestionare poziții angajați</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă poziție
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SimpleTable
          items={items}
          columns={['Cod', 'Denumire', 'Status']}
          renderRow={(item) => (
            <>
              <TableCell className="font-mono text-sm">{item.positionCode}</TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell><StatusBadge isActive={item.isActive} /></TableCell>
            </>
          )}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>

      <SimpleFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={editingItem ? 'Editează poziția' : 'Adaugă poziție nouă'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        isEditing={!!editingItem}
      />
    </Card>
  );
}

// ========================
// Helper Components
// ========================

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? 'default' : 'secondary'}>
      {isActive ? 'Activ' : 'Inactiv'}
    </Badge>
  );
}

function ActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Editează
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Șterge
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Generic table component for simple CRUD tables
function SimpleTable<T extends { id: number }>({
  items,
  columns,
  renderRow,
  onEdit,
  onDelete,
}: {
  items: T[] | undefined;
  columns: string[];
  renderRow: (item: T) => React.ReactNode;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col}>{col}</TableHead>
          ))}
          <TableHead className="w-[80px]">Acțiuni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map((item) => (
          <TableRow key={item.id}>
            {renderRow(item)}
            <TableCell>
              <ActionMenu
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item.id)}
              />
            </TableCell>
          </TableRow>
        ))}
        {(!items || items.length === 0) && (
          <TableRow>
            <TableCell colSpan={columns.length + 1} className="text-center text-slate-500">
              Nu există înregistrări
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

// Generic simple form dialog for name/description/isActive forms
function SimpleFormDialog({
  open,
  onOpenChange,
  title,
  description,
  formData,
  setFormData,
  onSubmit,
  isSaving,
  isEditing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  formData: { name: string; description: string; isActive: boolean };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; description: string; isActive: boolean }>>;
  onSubmit: () => void;
  isSaving: boolean;
  isEditing: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || (isEditing ? 'Modificați datele înregistrării' : 'Completați datele noii înregistrări')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Denumire *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descriere</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
            />
            <label htmlFor="isActive" className="text-sm">Activ</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={onSubmit} disabled={isSaving || !formData.name}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Salvează' : 'Creează'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
