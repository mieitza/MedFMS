'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Car,
  Filter,
  X,
  ArrowUpDown,
  FileText,
} from 'lucide-react';
import { useVehicles, useDeleteVehicle, useBrands, useVehicleTypes, useVehicleStatuses } from '@/lib/hooks';
import type { Vehicle } from '@/types';
import { VehicleFilters } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function VehiclesPage() {
  const router = useRouter();
  const [filters, setFilters] = React.useState<VehicleFilters>({
    page: 1,
    pageSize: 10,
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  // Queries
  const { data, isLoading, isError } = useVehicles(filters);
  const { data: brands } = useBrands();
  const { data: vehicleTypes } = useVehicleTypes();
  const { data: statuses } = useVehicleStatuses();
  const deleteVehicle = useDeleteVehicle();

  // Table columns
  const columns: ColumnDef<Vehicle>[] = React.useMemo(
    () => [
      {
        accessorKey: 'vehicleCode',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cod
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-slate-900 dark:text-slate-100">
            {row.getValue('vehicleCode')}
          </div>
        ),
      },
      {
        accessorKey: 'licensePlate',
        header: 'Nr. Inmatriculare',
        cell: ({ row }) => (
          <div className="font-mono text-sm">{row.getValue('licensePlate')}</div>
        ),
      },
      {
        id: 'brandModel',
        header: 'Marca / Model',
        cell: ({ row }) => {
          const vehicle = row.original;
          return (
            <div>
              <div className="font-medium">{vehicle.brand?.name || '-'}</div>
              <div className="text-sm text-slate-500">{vehicle.model?.name || '-'}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'year',
        header: 'An',
        cell: ({ row }) => row.getValue('year') || '-',
      },
      {
        accessorKey: 'vehicleType',
        header: 'Tip',
        cell: ({ row }) => {
          const vehicle = row.original;
          return vehicle.vehicleType?.name || '-';
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const vehicle = row.original;
          const status = vehicle.status;
          if (!status) return '-';
          return (
            <Badge
              variant="outline"
              className={cn('border-transparent', status.color && `bg-[${status.color}]/10 text-[${status.color}]`)}
              style={{
                backgroundColor: status.color ? `${status.color}20` : undefined,
                color: status.color || undefined,
                borderColor: status.color || undefined,
              }}
            >
              {status.name}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'department',
        header: 'Departament',
        cell: ({ row }) => {
          const vehicle = row.original;
          return vehicle.department?.name || '-';
        },
      },
      {
        accessorKey: 'odometer',
        header: 'Kilometraj',
        cell: ({ row }) => {
          const odometer = row.getValue('odometer') as number | null;
          return odometer ? `${odometer.toLocaleString('ro-RO')} km` : '-';
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Activ',
        cell: ({ row }) => {
          const isActive = row.getValue('isActive') as boolean;
          return (
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Activ' : 'Inactiv'}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const vehicle = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Deschide meniu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/vehicles/${vehicle.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Vizualizare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/vehicles/${vehicle.id}/edit`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/vehicles/${vehicle.id}/documents`)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Documente
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteId(vehicle.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Șterge
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [router]
  );

  // Filter handlers
  const handleFilterChange = (key: keyof VehicleFilters, value: string | number | boolean | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, pageSize: filters.pageSize });
  };

  const hasActiveFilters =
    filters.brandId || filters.vehicleTypeId || filters.statusId || filters.search;

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteVehicle.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Vehicule
          </h1>
          <p className="text-sm text-slate-500">
            Gestionează flota de vehicule a companiei
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(hasActiveFilters && 'border-blue-500 text-blue-600')}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtre
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {[filters.brandId, filters.vehicleTypeId, filters.statusId, filters.search].filter(Boolean).length}
              </Badge>
            )}
          </Button>
          <Button onClick={() => router.push('/vehicles/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Vehicul nou
          </Button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Filtre</CardTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Resetează
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Marca
                </label>
                <Select
                  value={filters.brandId?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('brandId', value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate mărcile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate mărcile</SelectItem>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tip vehicul
                </label>
                <Select
                  value={filters.vehicleTypeId?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('vehicleTypeId', value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate tipurile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate tipurile</SelectItem>
                    {vehicleTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <Select
                  value={filters.statusId?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('statusId', value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate statusurile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate statusurile</SelectItem>
                    {statuses?.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Stare
                </label>
                <Select
                  value={filters.isActive?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('isActive', value === 'all' ? undefined : value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total vehicule</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '-' : data?.pagination.totalItems || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data table */}
      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={data?.data || []}
            loading={isLoading}
            searchPlaceholder="Caută după cod, nr. înmatriculare..."
            serverSide
            totalItems={data?.pagination.totalItems}
            currentPage={filters.page || 1}
            pageSize={filters.pageSize || 10}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) => setFilters((prev) => ({ ...prev, pageSize, page: 1 }))}
            onSearchChange={(search) => setFilters((prev) => ({ ...prev, search, page: 1 }))}
            onSortChange={(sortBy, sortOrder) => setFilters((prev) => ({ ...prev, sortBy, sortOrder }))}
          />
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești sigur că vrei să ștergi acest vehicul?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. Vehiculul va fi marcat ca inactiv și nu va
              mai apărea în listele active.
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
