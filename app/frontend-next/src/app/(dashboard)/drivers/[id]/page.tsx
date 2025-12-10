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
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  FileText,
  Car,
  Fuel,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import { useDriver, useDeleteDriver } from '@/lib/hooks';
import { format, differenceInDays } from 'date-fns';
import { ro } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: driver, isLoading, isError } = useDriver(id);
  const deleteDriver = useDeleteDriver();

  const handleDelete = async () => {
    if (!id) return;
    await deleteDriver.mutateAsync(id);
    router.push('/drivers');
  };

  if (isLoading) {
    return <DriverDetailSkeleton />;
  }

  if (isError || !driver) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <User className="mb-4 h-12 w-12 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Șoferul nu a fost găsit
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Este posibil ca șoferul să fi fost șters sau să nu aveți acces.
        </p>
        <Button variant="outline" onClick={() => router.push('/drivers')}>
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

  const licenseExpiryDays = driver.licenseExpiryDate
    ? differenceInDays(new Date(driver.licenseExpiryDate), new Date())
    : null;

  const isLicenseExpiring = licenseExpiryDays !== null && licenseExpiryDays <= 30 && licenseExpiryDays > 0;
  const isLicenseExpired = licenseExpiryDays !== null && licenseExpiryDays < 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <User className="h-8 w-8 text-slate-500" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {driver.lastName} {driver.firstName}
                </h1>
                <Badge variant={driver.isActive ? 'default' : 'secondary'}>
                  {driver.isActive ? 'Activ' : 'Inactiv'}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">
                Permis: {driver.licenseNumber} {driver.licenseType && `(${driver.licenseType})`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/drivers/${driver.id}/edit`}>
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
                <AlertDialogTitle>Ești sigur că vrei să ștergi acest șofer?</AlertDialogTitle>
                <AlertDialogDescription>
                  Această acțiune nu poate fi anulată. Șoferul va fi marcat ca inactiv.
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

      {/* License expiry alert */}
      {(isLicenseExpiring || isLicenseExpired) && (
        <Card className={cn(
          'border-2',
          isLicenseExpired
            ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20'
            : 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20'
        )}>
          <CardContent className="flex items-center gap-4 pt-6">
            <AlertTriangle className={cn(
              'h-8 w-8',
              isLicenseExpired ? 'text-red-600' : 'text-amber-600'
            )} />
            <div>
              <p className={cn(
                'font-semibold',
                isLicenseExpired
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-amber-800 dark:text-amber-200'
              )}>
                {isLicenseExpired
                  ? 'Permisul de conducere a expirat!'
                  : `Permisul de conducere expiră în ${licenseExpiryDays} zile`}
              </p>
              <p className={cn(
                'text-sm',
                isLicenseExpired
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-amber-700 dark:text-amber-300'
              )}>
                Data expirării: {formatDate(driver.licenseExpiryDate)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Nr. permis</p>
                <p className="text-lg font-semibold font-mono">{driver.licenseNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Angajat din</p>
                <p className="text-lg font-semibold">{formatDate(driver.hireDate)}</p>
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
                <p className="text-lg font-semibold">{driver.department?.name || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Oraș</p>
                <p className="text-lg font-semibold">{driver.city?.name || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">
            <User className="mr-2 h-4 w-4" />
            Detalii
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documente
          </TabsTrigger>
          <TabsTrigger value="vehicles">
            <Car className="mr-2 h-4 w-4" />
            Vehicule
          </TabsTrigger>
          <TabsTrigger value="fuel">
            <Fuel className="mr-2 h-4 w-4" />
            Alimentări
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informații personale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRow label="Nume" value={driver.lastName} />
                <DetailRow label="Prenume" value={driver.firstName} />
                <DetailRow label="CNP" value={driver.idNumber} />
                <DetailRow label="Data nașterii" value={formatDate(driver.dateOfBirth)} />
                <DetailRow label="Oraș" value={driver.city?.name} />
                <DetailRow label="Adresă" value={driver.address} />
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRow label="Telefon fix" value={driver.phoneNumber} icon={<Phone className="h-4 w-4" />} />
                <DetailRow label="Mobil" value={driver.mobileNumber} icon={<Phone className="h-4 w-4" />} />
                <DetailRow label="Email" value={driver.email} icon={<Mail className="h-4 w-4" />} />
                <DetailRow label="Contact urgență" value={driver.emergencyContactName} />
                <DetailRow label="Tel. urgență" value={driver.emergencyContactPhone} />
              </CardContent>
            </Card>

            {/* License Info */}
            <Card>
              <CardHeader>
                <CardTitle>Permis de conducere</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRow label="Nr. permis" value={driver.licenseNumber} />
                <DetailRow label="Categorie" value={driver.licenseType} />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Data expirării</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm font-medium',
                      isLicenseExpired && 'text-red-600',
                      isLicenseExpiring && 'text-amber-600',
                    )}>
                      {formatDate(driver.licenseExpiryDate)}
                    </span>
                    {isLicenseExpired && (
                      <Badge variant="destructive" className="text-xs">Expirat</Badge>
                    )}
                    {isLicenseExpiring && (
                      <Badge variant="outline" className="border-amber-500 text-amber-600 text-xs">
                        {licenseExpiryDays} zile
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informații angajare</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRow label="Data angajării" value={formatDate(driver.hireDate)} />
                <DetailRow label="Data încetării" value={formatDate(driver.terminationDate)} />
                <DetailRow label="Departament" value={driver.department?.name} />
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {driver.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notițe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {driver.notes}
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
                    Documente asociate șoferului
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

        {/* Vehicles Tab */}
        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>Vehicule alocate</CardTitle>
              <CardDescription>
                Vehicule pe care acest șofer le poate conduce
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Car className="mb-2 h-8 w-8" />
                <p>Nu există vehicule alocate</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fuel Tab */}
        <TabsContent value="fuel">
          <Card>
            <CardHeader>
              <CardTitle>Istoric alimentări</CardTitle>
              <CardDescription>
                Tranzacții de alimentare efectuate de acest șofer
              </CardDescription>
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
function DetailRow({ label, value, icon }: { label: string; value?: string | null; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {value || '-'}
      </span>
    </div>
  );
}

// Loading skeleton
function DriverDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
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
