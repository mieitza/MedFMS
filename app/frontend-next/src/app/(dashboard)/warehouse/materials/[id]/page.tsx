'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Package,
  Warehouse,
  DollarSign,
  AlertTriangle,
  Barcode,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useMaterial, useDeleteMaterial } from '@/lib/hooks';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: material, isLoading, isError } = useMaterial(id);
  const deleteMaterial = useDeleteMaterial();

  const handleDelete = async () => {
    if (!id) return;
    await deleteMaterial.mutateAsync(id);
    router.push('/warehouse');
  };

  if (isLoading) {
    return <MaterialDetailSkeleton />;
  }

  if (isError || !material) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="mb-4 h-12 w-12 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Materialul nu a fost găsit
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Este posibil ca materialul să fi fost șters sau să nu aveți acces.
        </p>
        <Button variant="outline" onClick={() => router.push('/warehouse')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la depozit
        </Button>
      </div>
    );
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'dd MMMM yyyy', { locale: ro });
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: ro });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
    }).format(value);
  };

  const isLowStock = material.criticalLevel && material.currentStock <= material.criticalLevel;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {material.name}
              </h1>
              <Badge variant={material.isActive ? 'default' : 'secondary'}>
                {material.isActive ? 'Activ' : 'Inactiv'}
              </Badge>
              {isLowStock && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Stoc critic
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500">{material.materialCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/warehouse/materials/${material.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editează
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Șterge
              </Button>
            </AlertDialogTrigger>
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
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Șterge
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${isLowStock ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                <Package className={`h-5 w-5 ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Stoc curent</p>
                <p className={`text-lg font-semibold ${isLowStock ? 'text-red-600' : ''}`}>
                  {material.currentStock} {material.unit?.abbreviation || 'buc'}
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
                <p className="text-sm text-slate-500">Nivel critic</p>
                <p className="text-lg font-semibold">
                  {material.criticalLevel ?? '-'} {material.unit?.abbreviation || 'buc'}
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
                <p className="text-sm text-slate-500">Preț standard</p>
                <p className="text-lg font-semibold">{formatCurrency(material.standardPrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                <Warehouse className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Depozit</p>
                <p className="text-lg font-semibold">{material.warehouse?.name || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* General Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informații generale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Cod material" value={material.materialCode} />
            <DetailRow label="Denumire" value={material.name} />
            <DetailRow label="Descriere" value={material.description} />
            <DetailRow label="Unitate măsură" value={material.unit?.name} />
          </CardContent>
        </Card>

        {/* Stock Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informații stoc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Stoc curent" value={`${material.currentStock} ${material.unit?.abbreviation || 'buc'}`} />
            <DetailRow label="Nivel critic" value={material.criticalLevel?.toString()} />
            <DetailRow label="Depozit" value={material.warehouse?.name} />
            <DetailRow label="Locație în depozit" value={material.locationInWarehouse} />
          </CardContent>
        </Card>

        {/* Price Info */}
        <Card>
          <CardHeader>
            <CardTitle>Prețuri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Preț standard" value={formatCurrency(material.standardPrice)} />
            <DetailRow label="Ultimul preț achiziție" value={formatCurrency(material.lastPurchasePrice)} />
            <DetailRow label="Ultimul preț vânzare" value={formatCurrency(material.lastSalePrice)} />
          </CardContent>
        </Card>

        {/* Identification */}
        <Card>
          <CardHeader>
            <CardTitle>Identificare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Cod de bare" value={material.barcode} />
            <DetailRow label="Serie" value={material.serialNumber} />
            <DetailRow label="Data expirare" value={formatDate(material.expirationDate)} />
          </CardContent>
        </Card>
      </div>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle>Informații sistem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailRow label="Creat la" value={formatDateTime(material.createdAt)} />
          <DetailRow label="Ultima actualizare" value={formatDateTime(material.updatedAt)} />
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for detail rows
function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {value || '-'}
      </span>
    </div>
  );
}

// Loading skeleton
function MaterialDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
