'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { DataTable } from '@/components/shared/data-table';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  DollarSign,
} from 'lucide-react';
import {
  useMaintenanceWorkOrders,
  useMaintenanceStats,
  useDeleteMaintenanceWorkOrder,
  useVehicles,
  useMaintenanceTypes,
} from '@/lib/hooks';
import type { MaintenanceWorkOrderFilters } from '@/lib/api';
import type { MaintenanceWorkOrder } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import type { ColumnDef } from '@tanstack/react-table';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  pending: { label: 'În așteptare', variant: 'secondary', icon: Clock },
  scheduled: { label: 'Programat', variant: 'outline', icon: Calendar },
  in_progress: { label: 'În lucru', variant: 'default', icon: Wrench },
  completed: { label: 'Finalizat', variant: 'default', icon: CheckCircle },
  cancelled: { label: 'Anulat', variant: 'destructive', icon: XCircle },
};

const priorityConfig: Record<number, { label: string; color: string }> = {
  1: { label: 'Scăzută', color: 'text-slate-500' },
  2: { label: 'Normală', color: 'text-blue-500' },
  3: { label: 'Ridicată', color: 'text-amber-500' },
  4: { label: 'Urgentă', color: 'text-red-500' },
};

export default function MaintenancePage() {
  const router = useRouter();
  const [filters, setFilters] = React.useState<MaintenanceWorkOrderFilters>({
    page: 1,
    pageSize: 10,
    sortBy: 'scheduledDate',
    sortOrder: 'desc',
  });
  const [searchInput, setSearchInput] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const { data: workOrdersData, isLoading } = useMaintenanceWorkOrders(filters);
  const { data: stats } = useMaintenanceStats();
  const { data: vehiclesData } = useVehicles({ pageSize: 1000 });
  const { data: maintenanceTypes } = useMaintenanceTypes();
  const deleteWorkOrder = useDeleteMaintenanceWorkOrder();

  const vehicles = vehiclesData?.data || [];

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  const handleFilterChange = (key: keyof MaintenanceWorkOrderFilters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteWorkOrder.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const columns: ColumnDef<MaintenanceWorkOrder>[] = [
    {
      accessorKey: 'workOrderNumber',
      header: 'Nr. comandă',
      cell: ({ row }) => (
        <Link
          href={`/maintenance/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {row.original.workOrderNumber}
        </Link>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicul',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.vehicle?.licensePlate}</span>
          <span className="text-xs text-slate-500">{row.original.vehicle?.vehicleCode}</span>
        </div>
      ),
    },
    {
      accessorKey: 'maintenanceType',
      header: 'Tip mentenanță',
      cell: ({ row }) => row.original.maintenanceType?.name || '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const config = statusConfig[row.original.status] || statusConfig.pending;
        const Icon = config.icon;
        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: 'Prioritate',
      cell: ({ row }) => {
        const config = priorityConfig[row.original.priority] || priorityConfig[2];
        return (
          <span className={`font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      accessorKey: 'scheduledDate',
      header: 'Data programată',
      cell: ({ row }) =>
        row.original.scheduledDate
          ? format(new Date(row.original.scheduledDate), 'dd MMM yyyy', { locale: ro })
          : '-',
    },
    {
      accessorKey: 'estimatedCost',
      header: 'Cost estimat',
      cell: ({ row }) => formatCurrency(row.original.estimatedCost),
    },
    {
      accessorKey: 'actualCost',
      header: 'Cost real',
      cell: ({ row }) => formatCurrency(row.original.actualCost),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/maintenance/${row.original.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              Vizualizează
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/maintenance/${row.original.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editează
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Șterge
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Mentenanță
          </h1>
          <p className="text-sm text-slate-500">
            Gestionează comenzile de lucru și istoricul mentenanței
          </p>
        </div>
        <Button asChild>
          <Link href="/maintenance/new">
            <Plus className="mr-2 h-4 w-4" />
            Comandă nouă
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total comenzi</p>
                <p className="text-2xl font-bold">{stats?.totalWorkOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">În așteptare</p>
                <p className="text-2xl font-bold">{stats?.pendingWorkOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Finalizate</p>
                <p className="text-2xl font-bold">{stats?.completedWorkOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cost total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.totalCost || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Caută după nr. comandă, vehicul..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="mr-2 h-4 w-4" />
                Filtre
              </Button>
              <Button onClick={handleSearch}>Caută</Button>
            </div>

            {showFilters && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Select
                  value={filters.vehicleId?.toString() || ''}
                  onValueChange={(value) => handleFilterChange('vehicleId', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate vehiculele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toate vehiculele</SelectItem>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.licensePlate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.maintenanceTypeId?.toString() || ''}
                  onValueChange={(value) => handleFilterChange('maintenanceTypeId', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate tipurile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toate tipurile</SelectItem>
                    {maintenanceTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => handleFilterChange('status', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate statusurile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toate statusurile</SelectItem>
                    <SelectItem value="pending">În așteptare</SelectItem>
                    <SelectItem value="scheduled">Programat</SelectItem>
                    <SelectItem value="in_progress">În lucru</SelectItem>
                    <SelectItem value="completed">Finalizat</SelectItem>
                    <SelectItem value="cancelled">Anulat</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.priority?.toString() || ''}
                  onValueChange={(value) => handleFilterChange('priority', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate prioritățile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toate prioritățile</SelectItem>
                    <SelectItem value="1">Scăzută</SelectItem>
                    <SelectItem value="2">Normală</SelectItem>
                    <SelectItem value="3">Ridicată</SelectItem>
                    <SelectItem value="4">Urgentă</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista comenzilor de lucru</CardTitle>
          <CardDescription>
            {workOrdersData?.pagination.totalItems || 0} comenzi înregistrate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={workOrdersData?.data || []}
            loading={isLoading}
            searchPlaceholder="Caută după nr. comandă, vehicul..."
            serverSide
            totalItems={workOrdersData?.pagination.totalItems}
            currentPage={filters.page || 1}
            pageSize={filters.pageSize || 10}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) => setFilters((prev) => ({ ...prev, pageSize, page: 1 }))}
            onSearchChange={(search) => setFilters((prev) => ({ ...prev, search, page: 1 }))}
            onSortChange={(sortBy, sortOrder) => setFilters((prev) => ({ ...prev, sortBy, sortOrder }))}
          />
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești sigur că vrei să ștergi această comandă?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. Comanda de lucru va fi ștearsă definitiv.
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
