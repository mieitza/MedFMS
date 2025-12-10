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
  User,
  Filter,
  X,
  ArrowUpDown,
  FileText,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import { useDrivers, useDeleteDriver, useExpiringLicenses } from '@/lib/hooks';
import type { Driver } from '@/types';
import { DriverFilters } from '@/lib/api';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { ro } from 'date-fns/locale';

export default function DriversPage() {
  const router = useRouter();
  const [filters, setFilters] = React.useState<DriverFilters>({
    page: 1,
    pageSize: 10,
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  // Queries
  const { data, isLoading, isError } = useDrivers(filters);
  const { data: expiringLicenses } = useExpiringLicenses(30);
  const deleteDriver = useDeleteDriver();

  // Table columns
  const columns: ColumnDef<Driver>[] = React.useMemo(
    () => [
      {
        id: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nume
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const driver = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {driver.lastName} {driver.firstName}
                </div>
                {driver.email && (
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Mail className="h-3 w-3" />
                    {driver.email}
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'licenseNumber',
        header: 'Nr. Permis',
        cell: ({ row }) => (
          <div className="font-mono text-sm">{row.getValue('licenseNumber')}</div>
        ),
      },
      {
        accessorKey: 'licenseType',
        header: 'Categorie',
        cell: ({ row }) => {
          const licenseType = row.getValue('licenseType') as string | null;
          return licenseType ? (
            <Badge variant="outline">{licenseType}</Badge>
          ) : (
            '-'
          );
        },
      },
      {
        accessorKey: 'licenseExpiryDate',
        header: 'Exp. Permis',
        cell: ({ row }) => {
          const expiryDate = row.getValue('licenseExpiryDate') as string | null;
          if (!expiryDate) return '-';

          const date = new Date(expiryDate);
          const daysUntilExpiry = differenceInDays(date, new Date());
          const isExpiring = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
          const isExpired = daysUntilExpiry < 0;

          return (
            <div className="flex items-center gap-2">
              <span className={cn(
                isExpired && 'text-red-600',
                isExpiring && 'text-amber-600',
              )}>
                {format(date, 'dd.MM.yyyy')}
              </span>
              {isExpired && (
                <Badge variant="destructive" className="text-xs">Expirat</Badge>
              )}
              {isExpiring && (
                <Badge variant="outline" className="border-amber-500 text-amber-600 text-xs">
                  {daysUntilExpiry} zile
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'mobileNumber',
        header: 'Telefon',
        cell: ({ row }) => {
          const phone = row.getValue('mobileNumber') as string | null;
          return phone ? (
            <div className="flex items-center gap-1 text-sm">
              <Phone className="h-3 w-3 text-slate-400" />
              {phone}
            </div>
          ) : (
            '-'
          );
        },
      },
      {
        accessorKey: 'department',
        header: 'Departament',
        cell: ({ row }) => {
          const driver = row.original;
          return driver.department?.name || '-';
        },
      },
      {
        accessorKey: 'city',
        header: 'Oraș',
        cell: ({ row }) => {
          const driver = row.original;
          return driver.city?.name || '-';
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
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
          const driver = row.original;
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
                <DropdownMenuItem onClick={() => router.push(`/drivers/${driver.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Vizualizare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/drivers/${driver.id}/edit`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/drivers/${driver.id}/documents`)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Documente
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteId(driver.id)}
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
  const handleFilterChange = (key: keyof DriverFilters, value: string | number | boolean | undefined) => {
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
    filters.licenseType || filters.isActive !== undefined || filters.search;

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDriver.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Șoferi
          </h1>
          <p className="text-sm text-slate-500">
            Gestionează șoferii flotei
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
                {[filters.licenseType, filters.isActive !== undefined ? '1' : null, filters.search].filter(Boolean).length}
              </Badge>
            )}
          </Button>
          <Button onClick={() => router.push('/drivers/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Șofer nou
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
                  Categorie permis
                </label>
                <Select
                  value={filters.licenseType || 'all'}
                  onValueChange={(value) => handleFilterChange('licenseType', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toate categoriile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate categoriile</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="DE">DE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
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
                    <SelectItem value="true">Activi</SelectItem>
                    <SelectItem value="false">Inactivi</SelectItem>
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
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total șoferi</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '-' : data?.pagination.totalItems || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Permise expiră în 30 zile</p>
                <p className="text-2xl font-bold">
                  {expiringLicenses?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring licenses alert */}
      {expiringLicenses && expiringLicenses.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5" />
              Atenție: Permise de conducere expiră curând
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringLicenses.slice(0, 5).map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 dark:bg-slate-900/50"
                >
                  <span className="font-medium">
                    {driver.lastName} {driver.firstName}
                  </span>
                  <span className="text-sm text-amber-700 dark:text-amber-300">
                    Expiră: {driver.licenseExpiryDate && format(new Date(driver.licenseExpiryDate), 'dd.MM.yyyy')}
                  </span>
                </div>
              ))}
              {expiringLicenses.length > 5 && (
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  ... și încă {expiringLicenses.length - 5} șoferi
                </p>
              )}
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
            searchPlaceholder="Caută după nume, permis, telefon..."
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
            <AlertDialogTitle>Ești sigur că vrei să ștergi acest șofer?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. Șoferul va fi marcat ca inactiv și nu va
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
