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
import { Input } from '@/components/ui/input';
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Fuel,
  Filter,
  X,
  ArrowUpDown,
  Upload,
  Download,
  TrendingUp,
  DollarSign,
  Droplets,
  Calendar,
} from 'lucide-react';
import { useFuelTransactions, useDeleteFuelTransaction, useFuelTypes, useFuelStations, useFuelStats, useVehicles } from '@/lib/hooks';
import type { FuelTransaction } from '@/types';
import { FuelTransactionFilters } from '@/lib/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

export default function FuelPage() {
  const router = useRouter();
  const [filters, setFilters] = React.useState<FuelTransactionFilters>({
    page: 1,
    pageSize: 10,
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  // Queries
  const { data, isLoading } = useFuelTransactions(filters);
  const { data: stats, isLoading: loadingStats } = useFuelStats();
  const { data: fuelTypes } = useFuelTypes();
  const { data: fuelStations } = useFuelStations();
  const { data: vehiclesData } = useVehicles({ pageSize: 1000 });
  const deleteFuelTransaction = useDeleteFuelTransaction();

  // Table columns
  const columns: ColumnDef<FuelTransaction>[] = React.useMemo(
    () => [
      {
        accessorKey: 'transactionDate',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.getValue('transactionDate') as string;
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{format(new Date(date), 'dd.MM.yyyy', { locale: ro })}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'vehicle',
        header: 'Vehicul',
        cell: ({ row }) => {
          const transaction = row.original;
          return transaction.vehicle ? (
            <div>
              <div className="font-medium">{transaction.vehicle.licensePlate}</div>
              <div className="text-sm text-slate-500">{transaction.vehicle.vehicleCode}</div>
            </div>
          ) : (
            '-'
          );
        },
      },
      {
        accessorKey: 'driver',
        header: 'Șofer',
        cell: ({ row }) => {
          const transaction = row.original;
          return transaction.driver
            ? `${transaction.driver.lastName} ${transaction.driver.firstName}`
            : '-';
        },
      },
      {
        accessorKey: 'fuelType',
        header: 'Combustibil',
        cell: ({ row }) => {
          const transaction = row.original;
          return transaction.fuelType ? (
            <Badge variant="outline">{transaction.fuelType.name}</Badge>
          ) : (
            '-'
          );
        },
      },
      {
        accessorKey: 'quantity',
        header: 'Cantitate',
        cell: ({ row }) => {
          const quantity = row.getValue('quantity') as number;
          return (
            <div className="flex items-center gap-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{quantity.toFixed(2)} L</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'pricePerUnit',
        header: 'Preț/L',
        cell: ({ row }) => {
          const price = row.getValue('pricePerUnit') as number | null;
          return price ? `${price.toFixed(2)} RON` : '-';
        },
      },
      {
        accessorKey: 'totalCost',
        header: 'Total',
        cell: ({ row }) => {
          const cost = row.getValue('totalCost') as number | null;
          return cost ? (
            <div className="flex items-center gap-1 font-medium">
              <DollarSign className="h-4 w-4 text-green-500" />
              {cost.toFixed(2)} RON
            </div>
          ) : (
            '-'
          );
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
        accessorKey: 'fuelStation',
        header: 'Stație',
        cell: ({ row }) => {
          const transaction = row.original;
          return transaction.fuelStation?.name || '-';
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const transaction = row.original;
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
                <DropdownMenuItem onClick={() => router.push(`/fuel/${transaction.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Vizualizare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/fuel/${transaction.id}/edit`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editare
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteId(transaction.id)}
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
  const handleFilterChange = (key: keyof FuelTransactionFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, pageSize: filters.pageSize });
  };

  const hasActiveFilters =
    filters.vehicleId || filters.fuelTypeId || filters.fuelStationId || filters.dateFrom || filters.dateTo;

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteFuelTransaction.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Alimentări
          </h1>
          <p className="text-sm text-slate-500">
            Gestionează tranzacțiile de combustibil
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(hasActiveFilters && 'border-blue-500 text-blue-600')}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtre
          </Button>
          <Button onClick={() => router.push('/fuel/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Alimentare nouă
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Fuel className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total tranzacții</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? '-' : stats?.totalTransactions || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-cyan-100 p-3 dark:bg-cyan-900/30">
                <Droplets className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cantitate totală</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? '-' : `${(stats?.totalQuantity || 0).toLocaleString('ro-RO')} L`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cost total</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? '-' : `${(stats?.totalCost || 0).toLocaleString('ro-RO')} RON`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Preț mediu/L</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? '-' : `${(stats?.averagePricePerLiter || 0).toFixed(2)} RON`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Vehicul
                </label>
                <Select
                  value={filters.vehicleId?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('vehicleId', value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate vehiculele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate vehiculele</SelectItem>
                    {vehiclesData?.data.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.licensePlate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tip combustibil
                </label>
                <Select
                  value={filters.fuelTypeId?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('fuelTypeId', value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate tipurile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate tipurile</SelectItem>
                    {fuelTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Stație
                </label>
                <Select
                  value={filters.fuelStationId?.toString() || 'all'}
                  onValueChange={(value) => handleFilterChange('fuelStationId', value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate stațiile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate stațiile</SelectItem>
                    {fuelStations?.map((station) => (
                      <SelectItem key={station.id} value={station.id.toString()}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  De la
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Până la
                </label>
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data table */}
      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={data?.data || []}
            loading={isLoading}
            searchPlaceholder="Caută după vehicul, șofer, factură..."
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
            <AlertDialogTitle>Ești sigur că vrei să ștergi această alimentare?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. Tranzacția va fi ștearsă definitiv.
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
