'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Warehouse,
  Package,
  MapPin,
} from 'lucide-react';
import {
  useWarehouses,
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from '@/lib/hooks/use-warehouse';
import type { Warehouse as WarehouseType } from '@/types';

export default function WarehousesPage() {
  const router = useRouter();
  const { data: warehouses, isLoading } = useWarehouses();
  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();
  const deleteWarehouse = useDeleteWarehouse();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [editWarehouse, setEditWarehouse] = React.useState<WarehouseType | null>(null);
  const [formData, setFormData] = React.useState({
    warehouseCode: '',
    warehouseName: '',
    description: '',
    address: '',
    capacity: '',
  });

  const filteredWarehouses = React.useMemo(() => {
    if (!warehouses) return [];
    if (!searchTerm) return warehouses;
    const term = searchTerm.toLowerCase();
    return warehouses.filter(
      (w) =>
        w.warehouseCode?.toLowerCase().includes(term) ||
        w.warehouseName?.toLowerCase().includes(term) ||
        w.name?.toLowerCase().includes(term)
    );
  }, [warehouses, searchTerm]);

  const resetForm = () => {
    setFormData({
      warehouseCode: '',
      warehouseName: '',
      description: '',
      address: '',
      capacity: '',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (warehouse: WarehouseType) => {
    setEditWarehouse(warehouse);
    setFormData({
      warehouseCode: warehouse.warehouseCode || '',
      warehouseName: warehouse.warehouseName || warehouse.name || '',
      description: warehouse.description || '',
      address: warehouse.address || '',
      capacity: warehouse.capacity?.toString() || '',
    });
    setShowEditModal(true);
  };

  const handleCreate = async () => {
    await createWarehouse.mutateAsync({
      warehouseCode: formData.warehouseCode,
      warehouseName: formData.warehouseName,
      name: formData.warehouseName,
      description: formData.description || null,
      address: formData.address || null,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      active: true,
    });
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!editWarehouse) return;
    await updateWarehouse.mutateAsync({
      id: editWarehouse.id,
      data: {
        warehouseCode: formData.warehouseCode,
        warehouseName: formData.warehouseName,
        name: formData.warehouseName,
        description: formData.description || null,
        address: formData.address || null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
      },
    });
    setShowEditModal(false);
    setEditWarehouse(null);
    resetForm();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteWarehouse.mutateAsync(deleteId);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Depozite
          </h1>
          <p className="text-sm text-slate-500">
            Gestionează depozitele pentru materiale și medicamente
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Depozit nou
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Warehouse className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total depozite</p>
                <p className="text-2xl font-bold">{warehouses?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Depozite active</p>
                <p className="text-2xl font-bold">
                  {warehouses?.filter((w) => w.active !== false).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Capacitate totală</p>
                <p className="text-2xl font-bold">
                  {warehouses?.reduce((sum, w) => sum + (w.capacity || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista depozite</CardTitle>
          <CardDescription>
            {filteredWarehouses.length} depozit(e) găsite
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută depozite..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cod</TableHead>
                  <TableHead>Nume</TableHead>
                  <TableHead>Descriere</TableHead>
                  <TableHead>Adresă</TableHead>
                  <TableHead className="text-right">Capacitate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm
                        ? 'Nu s-au găsit depozite care să corespundă căutării.'
                        : 'Nu există depozite înregistrate.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/warehouse/warehouses/${warehouse.id}`}
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {warehouse.warehouseCode}
                        </Link>
                      </TableCell>
                      <TableCell>{warehouse.warehouseName || warehouse.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {warehouse.description || '-'}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {warehouse.address || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {warehouse.capacity?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={warehouse.active !== false ? 'default' : 'secondary'}>
                          {warehouse.active !== false ? 'Activ' : 'Inactiv'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => router.push(`/warehouse/warehouses/${warehouse.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Vizualizează
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(warehouse)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editează
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteId(warehouse.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Șterge
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Depozit nou</DialogTitle>
            <DialogDescription>
              Adaugă un depozit nou pentru stocarea materialelor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-code">Cod depozit *</Label>
                <Input
                  id="create-code"
                  value={formData.warehouseCode}
                  onChange={(e) => setFormData({ ...formData, warehouseCode: e.target.value })}
                  placeholder="WH001"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-capacity">Capacitate</Label>
                <Input
                  id="create-capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="1000"
                  min={0}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-name">Nume depozit *</Label>
              <Input
                id="create-name"
                value={formData.warehouseName}
                onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
                placeholder="Depozit Principal"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-description">Descriere</Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrierea depozitului..."
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-address">Adresă</Label>
              <Input
                id="create-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Strada, număr, oraș"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Anulează
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.warehouseCode || !formData.warehouseName || createWarehouse.isPending}
            >
              {createWarehouse.isPending ? 'Se creează...' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editează depozit</DialogTitle>
            <DialogDescription>
              Modifică informațiile depozitului.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-code">Cod depozit *</Label>
                <Input
                  id="edit-code"
                  value={formData.warehouseCode}
                  onChange={(e) => setFormData({ ...formData, warehouseCode: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-capacity">Capacitate</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  min={0}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nume depozit *</Label>
              <Input
                id="edit-name"
                value={formData.warehouseName}
                onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descriere</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Adresă</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Anulează
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!formData.warehouseCode || !formData.warehouseName || updateWarehouse.isPending}
            >
              {updateWarehouse.isPending ? 'Se salvează...' : 'Salvează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești sigur că vrei să ștergi acest depozit?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. Depozitul va fi marcat ca inactiv.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
