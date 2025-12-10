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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
  Car,
  Calendar,
  Gauge,
  Fuel,
  FileText,
  Image,
  Wrench,
  MapPin,
  Building,
  Hash,
} from 'lucide-react';
import { useVehicle, useDeleteVehicle } from '@/lib/hooks';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: vehicle, isLoading, isError } = useVehicle(id);
  const deleteVehicle = useDeleteVehicle();

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
            <Image className="mr-2 h-4 w-4" />
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documente</CardTitle>
                  <CardDescription>
                    Documente asociate vehiculului
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Încarcă document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <FileText className="mb-2 h-8 w-8" />
                <p>Nu există documente încărcate</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Fotografii</CardTitle>
                  <CardDescription>
                    Imagini ale vehiculului
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Image className="mr-2 h-4 w-4" />
                  Încarcă fotografii
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Image className="mb-2 h-8 w-8" />
                <p>Nu există fotografii încărcate</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Istoric mentenanță</CardTitle>
                  <CardDescription>
                    Lucrări de mentenanță efectuate
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Wrench className="mr-2 h-4 w-4" />
                  Comandă nouă
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Wrench className="mb-2 h-8 w-8" />
                <p>Nu există înregistrări de mentenanță</p>
              </div>
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
                    Tranzacții de alimentare cu combustibil
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Fuel className="mr-2 h-4 w-4" />
                  Alimentare nouă
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Fuel className="mb-2 h-8 w-8" />
                <p>Nu există înregistrări de alimentări</p>
              </div>
            </CardContent>
          </Card>
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
