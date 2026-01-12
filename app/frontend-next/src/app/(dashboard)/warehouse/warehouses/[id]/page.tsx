'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWarehouse, useUpdateWarehouse, useMaterials } from '@/lib/hooks/use-warehouse';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  ArrowLeft,
  Edit,
  Warehouse,
  Package,
  AlertTriangle,
  Search,
  MapPin,
  Phone,
  Mail,
  Eye,
} from 'lucide-react';

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params.id ? Number(params.id) : null;

  const { data: warehouse, isLoading: warehouseLoading, error: warehouseError } = useWarehouse(warehouseId);
  const { data: materialsData, isLoading: materialsLoading } = useMaterials({ warehouseId: warehouseId || undefined });
  const updateWarehouseMutation = useUpdateWarehouse();

  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    capacity: 0,
  });

  // Calculate materials stats
  const materials = materialsData?.data || [];
  const filteredMaterials = useMemo(() => {
    if (!searchTerm) return materials;
    const term = searchTerm.toLowerCase();
    return materials.filter(
      (m) =>
        m.materialCode.toLowerCase().includes(term) ||
        m.name.toLowerCase().includes(term)
    );
  }, [materials, searchTerm]);

  const lowStockMaterials = useMemo(() => {
    return materials.filter(
      (m) => m.criticalLevel && m.currentStock <= m.criticalLevel
    );
  }, [materials]);

  const openEditModal = () => {
    if (warehouse) {
      setEditForm({
        name: warehouse.warehouseName || warehouse.name || '',
        address: warehouse.address || '',
        phone: warehouse.phone || '',
        email: warehouse.email || '',
        description: warehouse.description || '',
        capacity: warehouse.capacity || 0,
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!warehouseId) return;

    await updateWarehouseMutation.mutateAsync({
      id: warehouseId,
      data: {
        name: editForm.name,
        address: editForm.address || null,
        phone: editForm.phone || null,
        email: editForm.email || null,
        description: editForm.description || null,
        capacity: editForm.capacity || null,
      },
    });
    setShowEditModal(false);
  };

  if (warehouseLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (warehouseError || !warehouse) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/warehouse')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la Depozit
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Depozit negăsit</CardTitle>
            <CardDescription>
              Depozitul solicitat nu a fost găsit sau a apărut o eroare.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/warehouse')}>
              Înapoi la listă
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/warehouse')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la Depozit
        </Button>
      </div>

      {/* Warehouse Header */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Warehouse className="h-6 w-6" />
              {warehouse.warehouseName || warehouse.name}
            </CardTitle>
            {warehouse.description && (
              <CardDescription className="mt-2 text-base">
                {warehouse.description}
              </CardDescription>
            )}
          </div>
          <Button onClick={openEditModal}>
            <Edit className="mr-2 h-4 w-4" />
            Editează depozit
          </Button>
        </CardHeader>
        <CardContent>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Capacitate
              </h3>
              <p className="text-2xl font-bold mt-1">
                {warehouse.capacity || 'N/A'}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total materiale
              </h3>
              <p className="text-2xl font-bold mt-1">{materials.length}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Stoc scăzut
              </h3>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {lowStockMaterials.length}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </h3>
              <Badge
                variant={warehouse.isActive ? 'default' : 'secondary'}
                className="mt-1"
              >
                {warehouse.isActive ? 'Activ' : 'Inactiv'}
              </Badge>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {warehouse.address && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{warehouse.address}</span>
              </div>
            )}
            {warehouse.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{warehouse.phone}</span>
              </div>
            )}
            {warehouse.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{warehouse.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockMaterials.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alertă stoc scăzut</AlertTitle>
          <AlertDescription>
            {lowStockMaterials.length} material(e) au stoc sub nivelul critic.
          </AlertDescription>
        </Alert>
      )}

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Materiale în depozit
          </CardTitle>
          <CardDescription>
            Lista materialelor stocate în acest depozit
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută materiale..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Materials Table */}
          {materialsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? 'Nu s-au găsit materiale care să corespundă căutării.'
                : 'Nu există materiale în acest depozit.'}
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cod</TableHead>
                    <TableHead>Nume</TableHead>
                    <TableHead className="text-right">Stoc curent</TableHead>
                    <TableHead className="text-right">Nivel critic</TableHead>
                    <TableHead className="text-right">Preț</TableHead>
                    <TableHead>Unitate</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => {
                    const isLowStock =
                      material.criticalLevel &&
                      material.currentStock <= material.criticalLevel;
                    return (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">
                          {material.materialCode}
                        </TableCell>
                        <TableCell>{material.materialName || material.name}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              isLowStock
                                ? 'text-red-600 font-medium'
                                : 'text-green-600'
                            }
                          >
                            {material.currentStock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {material.criticalLevel ?? '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {material.standardPrice
                            ? `${Number(material.standardPrice).toFixed(2)} RON`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {material.unit?.abbreviation ||
                            material.unit?.name ||
                            'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/warehouse/materials/${material.id}`}>
                              <Eye className="mr-1 h-4 w-4" />
                              Vezi
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Warehouse Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editează depozit</DialogTitle>
            <DialogDescription>
              Modifică informațiile despre acest depozit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nume depozit</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacitate</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={editForm.capacity}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      capacity: Number(e.target.value),
                    })
                  }
                  min={0}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Adresă</Label>
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Anulează
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateWarehouseMutation.isPending}
            >
              {updateWarehouseMutation.isPending
                ? 'Se salvează...'
                : 'Salvează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
