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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Wrench,
  Calendar,
  Car,
  Gauge,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import {
  useMaintenanceWorkOrder,
  useDeleteMaintenanceWorkOrder,
  useUpdateWorkOrderStatus,
} from '@/lib/hooks';
import type { MaintenanceWorkOrder } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

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

export default function MaintenanceWorkOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: workOrder, isLoading, isError } = useMaintenanceWorkOrder(id);
  const deleteWorkOrder = useDeleteMaintenanceWorkOrder();
  const updateStatus = useUpdateWorkOrderStatus();

  const handleDelete = async () => {
    if (!id) return;
    await deleteWorkOrder.mutateAsync(id);
    router.push('/maintenance');
  };

  const handleStatusChange = async (status: MaintenanceWorkOrder['status']) => {
    if (!id) return;
    await updateStatus.mutateAsync({ id, status });
  };

  if (isLoading) {
    return <MaintenanceDetailSkeleton />;
  }

  if (isError || !workOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Wrench className="mb-4 h-12 w-12 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Comanda de lucru nu a fost găsită
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Este posibil ca comanda să fi fost ștearsă sau să nu aveți acces.
        </p>
        <Button variant="outline" onClick={() => router.push('/maintenance')}>
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

  const statusConf = statusConfig[workOrder.status] || statusConfig.pending;
  const StatusIcon = statusConf.icon;
  const priorityConf = priorityConfig[workOrder.priority] || priorityConfig[2];

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
                {workOrder.workOrderNumber}
              </h1>
              <Badge variant={statusConf.variant} className="gap-1">
                <StatusIcon className="h-3 w-3" />
                {statusConf.label}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">
              {workOrder.maintenanceType?.name} - {workOrder.vehicle?.licensePlate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={workOrder.status}
            onValueChange={(value) => handleStatusChange(value as MaintenanceWorkOrder['status'])}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">În așteptare</SelectItem>
              <SelectItem value="scheduled">Programat</SelectItem>
              <SelectItem value="in_progress">În lucru</SelectItem>
              <SelectItem value="completed">Finalizat</SelectItem>
              <SelectItem value="cancelled">Anulat</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" asChild>
            <Link href={`/maintenance/${workOrder.id}/edit`}>
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
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Vehicul</p>
                <p className="text-lg font-semibold">{workOrder.vehicle?.licensePlate}</p>
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
                <p className="text-sm text-slate-500">Prioritate</p>
                <p className={`text-lg font-semibold ${priorityConf.color}`}>
                  {priorityConf.label}
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
                <p className="text-sm text-slate-500">Cost estimat</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(workOrder.estimatedCost)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                <Gauge className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Kilometraj</p>
                <p className="text-lg font-semibold">
                  {workOrder.odometer
                    ? `${workOrder.odometer.toLocaleString('ro-RO')} km`
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Work Order Info */}
        <Card>
          <CardHeader>
            <CardTitle>Detalii comandă</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Nr. comandă" value={workOrder.workOrderNumber} />
            <DetailRow label="Tip mentenanță" value={workOrder.maintenanceType?.name} />
            <DetailRow label="Categorie" value={workOrder.maintenanceType?.category} />
            <DetailRow label="Prioritate" value={priorityConf.label} />
            <DetailRow label="Status" value={statusConf.label} />
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicul</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Vehicul</span>
              <Link
                href={`/vehicles/${workOrder.vehicleId}`}
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {workOrder.vehicle?.licensePlate} ({workOrder.vehicle?.vehicleCode})
              </Link>
            </div>
            <DetailRow
              label="Kilometraj la intervenție"
              value={
                workOrder.odometer
                  ? `${workOrder.odometer.toLocaleString('ro-RO')} km`
                  : undefined
              }
            />
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Data programată" value={formatDate(workOrder.scheduledDate)} />
            <DetailRow label="Data începerii" value={formatDate(workOrder.startDate)} />
            <DetailRow label="Data finalizării" value={formatDate(workOrder.completionDate)} />
          </CardContent>
        </Card>

        {/* Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Costuri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Cost estimat" value={formatCurrency(workOrder.estimatedCost)} />
            <DetailRow label="Cost real" value={formatCurrency(workOrder.actualCost)} />
            <DetailRow label="Cost piese" value={formatCurrency(workOrder.partsCost)} />
            <DetailRow label="Cost manoperă" value={formatCurrency(workOrder.laborCost)} />
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {workOrder.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descriere</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {workOrder.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Diagnosis */}
      {workOrder.diagnosis && (
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {workOrder.diagnosis}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Work Performed */}
      {workOrder.workPerformed && (
        <Card>
          <CardHeader>
            <CardTitle>Lucrări efectuate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {workOrder.workPerformed}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Technician Notes */}
      {workOrder.technicianNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Notițe tehnician</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {workOrder.technicianNotes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle>Informații sistem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailRow label="Creat la" value={formatDateTime(workOrder.createdAt)} />
          <DetailRow label="Ultima actualizare" value={formatDateTime(workOrder.updatedAt)} />
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
function MaintenanceDetailSkeleton() {
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
