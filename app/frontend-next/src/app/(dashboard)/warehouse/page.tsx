'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Package,
  AlertTriangle,
  DollarSign,
  ArrowRightLeft,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  useMaterials,
  useLowStockMaterials,
  useDeleteMaterial,
  useWarehouses,
  useTransferRequests,
  useUpdateTransferStatus,
} from '@/lib/hooks';
import type { MaterialFilters, TransferRequestFilters } from '@/lib/api';
import type { Material, TransferRequest, Warehouse, Vehicle } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import type { ColumnDef } from '@tanstack/react-table';

// Backend returns nested structure for transfer requests
interface TransferRequestApiResponse {
  transferRequest: TransferRequest;
  sourceWarehouse: Warehouse | null;
  destinationWarehouse: Warehouse | null;
  destinationVehicle: Vehicle | null;
  material?: Material | null;
}

// Flatten the nested structure for display
// Omit the optional relations from TransferRequest and redefine them as always present (but nullable)
type FlattenedTransferRequest = Omit<TransferRequest, 'sourceWarehouse' | 'destinationWarehouse' | 'destinationVehicle'> & {
  sourceWarehouse: Warehouse | null | undefined;
  destinationWarehouse: Warehouse | null | undefined;
  destinationVehicle: Vehicle | null | undefined;
};

const transferStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  pending: { label: 'În așteptare', variant: 'secondary', icon: Clock },
  approved: { label: 'Aprobat', variant: 'outline', icon: CheckCircle },
  rejected: { label: 'Respins', variant: 'destructive', icon: XCircle },
  completed: { label: 'Finalizat', variant: 'default', icon: CheckCircle },
  cancelled: { label: 'Anulat', variant: 'destructive', icon: XCircle },
};

export default function WarehousePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = React.useState(tabFromUrl === 'transfers' ? 'transfers' : 'materials');

  // Sync tab state with URL
  React.useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'transfers' || tab === 'materials') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/warehouse?tab=${value}`, { scroll: false });
  };

  // Materials state
  const [materialFilters, setMaterialFilters] = React.useState<MaterialFilters>({
    page: 1,
    pageSize: 10,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [materialSearchInput, setMaterialSearchInput] = React.useState('');
  const [showMaterialFilters, setShowMaterialFilters] = React.useState(false);
  const [deleteMaterialId, setDeleteMaterialId] = React.useState<number | null>(null);

  // Transfers state
  const [transferFilters, setTransferFilters] = React.useState<TransferRequestFilters>({
    page: 1,
    pageSize: 10,
    sortBy: 'requestedAt',
    sortOrder: 'desc',
  });

  // Data fetching
  const { data: materialsData, isLoading: loadingMaterials } = useMaterials(materialFilters);
  const { data: transfersData, isLoading: loadingTransfers } = useTransferRequests(transferFilters);
  const { data: lowStockMaterials } = useLowStockMaterials();
  const { data: warehouses } = useWarehouses();
  const deleteMaterial = useDeleteMaterial();
  const updateTransferStatus = useUpdateTransferStatus();

  // Flatten transfer data from nested API response
  const flattenedTransfers = React.useMemo((): FlattenedTransferRequest[] => {
    if (!transfersData?.data) return [];
    return transfersData.data.map((item: TransferRequest | TransferRequestApiResponse) => {
      // Check if data is already flat (has id directly) or nested (has transferRequest)
      if ('transferRequest' in item) {
        const nested = item as TransferRequestApiResponse;
        return {
          ...nested.transferRequest,
          sourceWarehouse: nested.sourceWarehouse,
          destinationWarehouse: nested.destinationWarehouse,
          destinationVehicle: nested.destinationVehicle,
        };
      }
      // Data is already flat
      return item as FlattenedTransferRequest;
    });
  }, [transfersData]);

  const handleMaterialSearch = () => {
    setMaterialFilters((prev) => ({ ...prev, search: materialSearchInput, page: 1 }));
  };

  const handleMaterialFilterChange = (key: keyof MaterialFilters, value: string | number | boolean | undefined) => {
    setMaterialFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDeleteMaterial = async () => {
    if (!deleteMaterialId) return;
    await deleteMaterial.mutateAsync(deleteMaterialId);
    setDeleteMaterialId(null);
  };

  const handleTransferStatusChange = async (id: number, status: TransferRequest['status']) => {
    await updateTransferStatus.mutateAsync({ id, status });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const materialColumns: ColumnDef<Material>[] = [
    {
      accessorKey: 'materialCode',
      header: 'Cod',
      cell: ({ row }) => (
        <Link
          href={`/warehouse/materials/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {row.original.materialCode}
        </Link>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Denumire',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          {row.original.description && (
            <span className="text-xs text-slate-500 truncate max-w-[200px]">
              {row.original.description}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'warehouse',
      header: 'Depozit',
      cell: ({ row }) => row.original.warehouse?.name || '-',
    },
    {
      accessorKey: 'currentStock',
      header: 'Stoc',
      cell: ({ row }) => {
        const isLow = row.original.criticalLevel && row.original.currentStock <= row.original.criticalLevel;
        return (
          <div className="flex items-center gap-2">
            <span className={isLow ? 'text-red-600 font-medium' : ''}>
              {row.original.currentStock} {row.original.unit?.abbreviation || 'buc'}
            </span>
            {isLow && <AlertTriangle className="h-4 w-4 text-red-600" />}
          </div>
        );
      },
    },
    {
      accessorKey: 'standardPrice',
      header: 'Preț',
      cell: ({ row }) => formatCurrency(row.original.standardPrice),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Activ' : 'Inactiv'}
        </Badge>
      ),
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
            <DropdownMenuItem onClick={() => router.push(`/warehouse/materials/${row.original.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              Vizualizează
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/warehouse/materials/${row.original.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editează
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setDeleteMaterialId(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Șterge
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const transferColumns: ColumnDef<FlattenedTransferRequest>[] = [
    {
      accessorKey: 'requestNumber',
      header: 'Nr. cerere',
      cell: ({ row }) => (
        <Link
          href={`/warehouse/transfers/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {row.original.requestNumber}
        </Link>
      ),
    },
    {
      accessorKey: 'sourceWarehouse',
      header: 'De la',
      cell: ({ row }) => row.original.sourceWarehouse?.name || '-',
    },
    {
      accessorKey: 'destination',
      header: 'Către',
      cell: ({ row }) =>
        row.original.destinationWarehouse?.name ||
        row.original.destinationVehicle?.licensePlate ||
        '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const config = transferStatusConfig[row.original.status] || transferStatusConfig.pending;
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
      accessorKey: 'requestedAt',
      header: 'Data cererii',
      cell: ({ row }) => {
        return row.original.requestedAt
          ? format(new Date(row.original.requestedAt), 'dd MMM yyyy', { locale: ro })
          : '-';
      },
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
            <DropdownMenuItem onClick={() => router.push(`/warehouse/transfers/${row.original.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              Vizualizează
            </DropdownMenuItem>
            {row.original.status === 'pending' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleTransferStatusChange(row.original.id, 'approved')}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Aprobă
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleTransferStatusChange(row.original.id, 'rejected')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Respinge
                </DropdownMenuItem>
              </>
            )}
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
            Gestiune depozit
          </h1>
          <p className="text-sm text-slate-500">
            Gestionează materialele și cererile de transfer
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/warehouse/transfers/new">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Cerere transfer
            </Link>
          </Button>
          <Button asChild>
            <Link href="/warehouse/materials/new">
              <Plus className="mr-2 h-4 w-4" />
              Material nou
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total materiale</p>
                <p className="text-2xl font-bold">{materialsData?.pagination?.totalItems || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Stoc critic</p>
                <p className="text-2xl font-bold">{lowStockMaterials?.length || 0}</p>
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
                <p className="text-sm text-slate-500">Valoare totală</p>
                <p className="text-2xl font-bold">{formatCurrency(materialsData?.data?.reduce((sum, m) => sum + ((m.currentStock || 0) * (m.standardPrice || 0)), 0) || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <ArrowRightLeft className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Transferuri în așteptare</p>
                <p className="text-2xl font-bold">{flattenedTransfers.filter((t) => t.status === 'pending').length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="materials">
            <Package className="mr-2 h-4 w-4" />
            Materiale
          </TabsTrigger>
          <TabsTrigger value="transfers">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transferuri
          </TabsTrigger>
        </TabsList>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Caută după cod, denumire..."
                      value={materialSearchInput}
                      onChange={(e) => setMaterialSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleMaterialSearch()}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" onClick={() => setShowMaterialFilters(!showMaterialFilters)}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filtre
                  </Button>
                  <Button onClick={handleMaterialSearch}>Caută</Button>
                </div>

                {showMaterialFilters && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Select
                      value={materialFilters.warehouseId?.toString() || '_all'}
                      onValueChange={(value) => handleMaterialFilterChange('warehouseId', value !== '_all' ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toate depozitele" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_all">Toate depozitele</SelectItem>
                        {warehouses?.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                            {warehouse.warehouseName || warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={materialFilters.lowStock?.toString() || '_all'}
                      onValueChange={(value) => handleMaterialFilterChange('lowStock', value === 'true' ? true : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toate stocurile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_all">Toate stocurile</SelectItem>
                        <SelectItem value="true">Doar stoc critic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Materials Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista materiale</CardTitle>
              <CardDescription>
                {materialsData?.pagination.totalItems || 0} materiale înregistrate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={materialColumns}
                data={materialsData?.data || []}
                loading={loadingMaterials}
                searchPlaceholder="Caută după cod, denumire..."
                serverSide
                totalItems={materialsData?.pagination.totalItems}
                currentPage={materialFilters.page || 1}
                pageSize={materialFilters.pageSize || 10}
                onPageChange={(page) => setMaterialFilters((prev) => ({ ...prev, page }))}
                onPageSizeChange={(pageSize) => setMaterialFilters((prev) => ({ ...prev, pageSize, page: 1 }))}
                onSearchChange={(search) => setMaterialFilters((prev) => ({ ...prev, search, page: 1 }))}
                onSortChange={(sortBy, sortOrder) => setMaterialFilters((prev) => ({ ...prev, sortBy, sortOrder }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfers Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cereri de transfer</CardTitle>
              <CardDescription>
                {transfersData?.pagination.totalItems || 0} cereri înregistrate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={transferColumns}
                data={flattenedTransfers}
                loading={loadingTransfers}
                searchPlaceholder="Caută după nr. cerere..."
                serverSide
                totalItems={transfersData?.pagination.totalItems}
                currentPage={transferFilters.page || 1}
                pageSize={transferFilters.pageSize || 10}
                onPageChange={(page) => setTransferFilters((prev) => ({ ...prev, page }))}
                onPageSizeChange={(pageSize) => setTransferFilters((prev) => ({ ...prev, pageSize, page: 1 }))}
                onSearchChange={(search) => setTransferFilters((prev) => ({ ...prev, search, page: 1 }))}
                onSortChange={(sortBy, sortOrder) => setTransferFilters((prev) => ({ ...prev, sortBy, sortOrder }))}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Material Dialog */}
      <AlertDialog open={!!deleteMaterialId} onOpenChange={() => setDeleteMaterialId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești sigur că vrei să ștergi acest material?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. Materialul va fi marcat ca inactiv.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMaterial}
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
