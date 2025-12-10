'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Car,
  Gauge,
  Fuel,
  FileText,
  ImageIcon,
  Wrench,
  Building,
  Hash,
  Plus,
  ExternalLink,
  Package,
} from 'lucide-react';
import { useVehicle, useDeleteVehicle } from '@/lib/hooks';
import { fuelApi, maintenanceApi } from '@/lib/api';
import { DocumentManager } from '@/components/shared/document-manager';
import { PhotoManager } from '@/components/shared/photo-manager';
import { VehicleInventoryManager } from '@/components/shared/vehicle-inventory-manager';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

const workOrderStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'În așteptare', variant: 'secondary' },
  in_progress: { label: 'În lucru', variant: 'default' },
  completed: { label: 'Finalizat', variant: 'outline' },
  cancelled: { label: 'Anulat', variant: 'destructive' },
};

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: vehicle, isLoading, isError } = useVehicle(id);
  const deleteVehicle = useDeleteVehicle();

  // Fetch fuel transactions for this vehicle
  const { data: fuelData } = useQuery({
    queryKey: ['fuel', 'vehicle', id],
    queryFn: () => fuelApi.getAll({ vehicleId: id!, pageSize: 10 }),
    enabled: !!id,
  });

  // Fetch maintenance work orders for this vehicle
  const { data: maintenanceData } = useQuery({
    queryKey: ['maintenance', 'vehicle', id],
    queryFn: () => maintenanceApi.getAll({ vehicleId: id!, pageSize: 10 }),
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (!id) return;
    await deleteVehicle.mutateAsync(id);
    router.push('/vehicles');
  };

  if (isLoading) {
    return <VehicleDetailSkeleton />;
  }

  if (isError || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Car className="mb-4 h-12 w-12 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Vehiculul nu a fost găsit
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Este posibil ca vehiculul să fi fost șters sau să nu aveți acces.
        </p>
        <Button variant="outline" onClick={() => router.push('/vehicles')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la listă
        </Button>
      </div>
    );
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'dd MMMM yyyy', { locale: ro });
  };

  const fuelTransactions = fuelData?.data || [];
  const workOrders = maintenanceData?.data || [];

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
                {vehicle.licensePlate}
              </h1>
              <Badge variant={vehicle.isActive ? 'default' : 'secondary'}>
                {vehicle.isActive ? 'Activ' : 'Inactiv'}
              </Badge>
              {vehicle.status && (
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: vehicle.status.color ? `${vehicle.status.color}20` : undefined,
                    color: vehicle.status.color || undefined,
                    borderColor: vehicle.status.color || undefined,
                  }}
                >
                  {vehicle.status.name}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500">
              {vehicle.brand?.name} {vehicle.model?.name} {vehicle.year && `(${vehicle.year})`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/vehicles/${vehicle.id}/edit`}>
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
                <AlertDialogTitle>Ești sigur că vrei să ștergi acest vehicul?</AlertDialogTitle>
                <AlertDialogDescription>
                  Această acțiune nu poate fi anulată. Vehiculul va fi marcat ca inactiv.
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
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Hash className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cod vehicul</p>
                <p className="text-lg font-semibold">{vehicle.vehicleCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                <Gauge className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Kilometraj</p>
                <p className="text-lg font-semibold">
                  {vehicle.odometer ? `${vehicle.odometer.toLocaleString('ro-RO')} km` : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <Fuel className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Combustibil</p>
                <p className="text-lg font-semibold">{vehicle.fuelType?.name || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Departament</p>
                <p className="text-lg font-semibold">{vehicle.department?.name || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">
            <Car className="mr-2 h-4 w-4" />
            Detalii
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documente
          </TabsTrigger>
          <TabsTrigger value="photos">
            <ImageIcon className="mr-2 h-4 w-4" />
            Fotografii
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="mr-2 h-4 w-4" />
            Mentenanță
          </TabsTrigger>
          <TabsTrigger value="fuel">
            <Fuel className="mr-2 h-4 w-4" />
            Combustibil
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="mr-2 h-4 w-4" />
            Inventar
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* General Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informații generale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRow label="Cod vehicul" value={vehicle.vehicleCode} />
                <DetailRow label="Nr. înmatriculare" value={vehicle.licensePlate} />
                <DetailRow label="Marca" value={vehicle.brand?.name} />
                <DetailRow label="Model" value={vehicle.model?.name} />
                <DetailRow label="An fabricație" value={vehicle.year?.toString()} />
                <DetailRow label="Tip vehicul" value={vehicle.vehicleType?.name} />
                <DetailRow label="Culoare" value={vehicle.color} />
              </CardContent>
            </Card>

            {/* Technical Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informații tehnice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRow label="VIN" value={vehicle.vin} />
                <DetailRow label="Nr. motor" value={vehicle.engineNumber} />
                <DetailRow label="Tip combustibil" value={vehicle.fuelType?.name} />
                <DetailRow label="Kilometraj actual" value={vehicle.odometer ? `${vehicle.odometer.toLocaleString('ro-RO')} km` : undefined} />
              </CardContent>
            </Card>

            {/* Administrative Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informații administrative</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRow label="Departament" value={vehicle.department?.name} />
                <DetailRow label="Locație" value={vehicle.location?.name} />
                <DetailRow label="Data înmatriculării" value={formatDate(vehicle.registrationDate)} />
                <DetailRow label="Data achiziției" value={formatDate(vehicle.acquisitionDate)} />
              </CardContent>
            </Card>

            {/* ANMDM Info */}
            <Card>
              <CardHeader>
                <CardTitle>ANMDM</CardTitle>
                <CardDescription>Autorizație transport medicamente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRow label="Nr. autorizație" value={vehicle.anmdmAuthNumber} />
                <DetailRow label="Tip autorizație" value={vehicle.anmdmAuthType} />
                {vehicle.anmdmDocumentPath && (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">Document ANMDM</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={vehicle.anmdmDocumentPath} target="_blank" rel="noopener noreferrer">
                        Vizualizează
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {vehicle.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notițe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {vehicle.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <DocumentManager
            entityType="vehicle"
            entityId={vehicle.id}
            title="Documente vehicul"
            description="Documente asociate acestui vehicul (ITP, RCA, Carte identitate, etc.)"
          />
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos">
          <PhotoManager
            entityType="vehicle"
            entityId={vehicle.id}
            title="Fotografii vehicul"
            description="Imagini ale vehiculului din diferite unghiuri"
          />
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Istoric mentenanță</CardTitle>
                  <CardDescription>
                    Lucrări de mentenanță efectuate pentru acest vehicul
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href={`/maintenance/new?vehicleId=${vehicle.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Comandă nouă
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {workOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Wrench className="mb-2 h-8 w-8" />
                  <p>Nu există înregistrări de mentenanță</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nr. comandă</TableHead>
                        <TableHead>Tip</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workOrders.map((wo) => {
                        const statusConf = workOrderStatusConfig[wo.status] || workOrderStatusConfig.pending;
                        return (
                          <TableRow key={wo.id}>
                            <TableCell className="font-medium">{wo.workOrderNumber}</TableCell>
                            <TableCell>{wo.maintenanceType?.name || '-'}</TableCell>
                            <TableCell>
                              {format(new Date(wo.startDate || wo.createdAt), 'dd MMM yyyy', { locale: ro })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusConf.variant}>{statusConf.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/maintenance/${wo.id}`}>
                                  <ExternalLink className="h-4 w-4" />
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
              {workOrders.length > 0 && (
                <div className="mt-4 text-center">
                  <Button variant="link" asChild>
                    <Link href={`/maintenance?vehicleId=${vehicle.id}`}>
                      Vezi toate comenzile de mentenanță
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fuel Tab */}
        <TabsContent value="fuel">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Istoric alimentări</CardTitle>
                  <CardDescription>
                    Tranzacții de alimentare cu combustibil pentru acest vehicul
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href={`/fuel/new?vehicleId=${vehicle.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Alimentare nouă
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {fuelTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Fuel className="mb-2 h-8 w-8" />
                  <p>Nu există înregistrări de alimentări</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tip combustibil</TableHead>
                        <TableHead className="text-right">Cantitate (L)</TableHead>
                        <TableHead className="text-right">Cost (RON)</TableHead>
                        <TableHead className="text-right">KM</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fuelTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            {format(new Date(tx.transactionDate), 'dd MMM yyyy', { locale: ro })}
                          </TableCell>
                          <TableCell>{tx.fuelType?.name || '-'}</TableCell>
                          <TableCell className="text-right">
                            {tx.quantity.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {tx.totalCost?.toFixed(2) || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {tx.odometer?.toLocaleString('ro-RO') || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {fuelTransactions.length > 0 && (
                <div className="mt-4 text-center">
                  <Button variant="link" asChild>
                    <Link href={`/fuel?vehicleId=${vehicle.id}`}>
                      Vezi toate tranzacțiile
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <VehicleInventoryManager vehicleId={vehicle.id} />
        </TabsContent>
      </Tabs>
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
function VehicleDetailSkeleton() {
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
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, j) => (
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
