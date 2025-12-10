'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  ArrowRightLeft,
  Clock,
  CheckCircle,
  XCircle,
  Warehouse,
  Car,
} from 'lucide-react';
import {
  useTransferRequest,
  useUpdateTransferStatus,
} from '@/lib/hooks';
import type { TransferRequest } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  pending: { label: 'În așteptare', variant: 'secondary', icon: Clock },
  approved: { label: 'Aprobat', variant: 'outline', icon: CheckCircle },
  rejected: { label: 'Respins', variant: 'destructive', icon: XCircle },
  completed: { label: 'Finalizat', variant: 'default', icon: CheckCircle },
  cancelled: { label: 'Anulat', variant: 'destructive', icon: XCircle },
};

export default function TransferRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: transfer, isLoading, isError } = useTransferRequest(id);
  const updateStatus = useUpdateTransferStatus();

  const handleStatusChange = async (status: TransferRequest['status']) => {
    if (!id) return;
    await updateStatus.mutateAsync({ id, status });
  };

  if (isLoading) {
    return <TransferDetailSkeleton />;
  }

  if (isError || !transfer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ArrowRightLeft className="mb-4 h-12 w-12 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Cererea de transfer nu a fost găsită
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Este posibil ca cererea să fi fost ștearsă sau să nu aveți acces.
        </p>
        <Button variant="outline" onClick={() => router.push('/warehouse')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la depozit
        </Button>
      </div>
    );
  }

  const formatDateTime = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: ro });
  };

  const statusConf = statusConfig[transfer.status] || statusConfig.pending;
  const StatusIcon = statusConf.icon;

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
                {transfer.requestNumber}
              </h1>
              <Badge variant={statusConf.variant} className="gap-1">
                <StatusIcon className="h-3 w-3" />
                {statusConf.label}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">
              Cerere de transfer
            </p>
          </div>
        </div>
        {transfer.status === 'pending' && (
          <div className="flex items-center gap-2">
            <Select
              value={transfer.status}
              onValueChange={(value) => handleStatusChange(value as TransferRequest['status'])}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">În așteptare</SelectItem>
                <SelectItem value="approved">Aprobat</SelectItem>
                <SelectItem value="rejected">Respins</SelectItem>
                <SelectItem value="completed">Finalizat</SelectItem>
                <SelectItem value="cancelled">Anulat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Warehouse className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">De la</p>
                <p className="text-lg font-semibold">
                  {transfer.sourceWarehouse?.name || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                {transfer.destinationWarehouse ? (
                  <Warehouse className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Car className="h-5 w-5 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500">Către</p>
                <p className="text-lg font-semibold">
                  {transfer.destinationWarehouse?.name || transfer.destinationVehicle?.licensePlate || '-'}
                </p>
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
                <p className="text-sm text-slate-500">Data cererii</p>
                <p className="text-lg font-semibold">
                  {format(new Date(transfer.requestedAt), 'dd MMM yyyy', { locale: ro })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalii cerere</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Nr. cerere" value={transfer.requestNumber} />
            <DetailRow label="Status" value={statusConf.label} />
            <DetailRow label="Depozit sursă" value={transfer.sourceWarehouse?.name} />
            <DetailRow label="Depozit destinație" value={transfer.destinationWarehouse?.name} />
            <DetailRow label="Vehicul destinație" value={transfer.destinationVehicle?.licensePlate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timestamps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Data cererii" value={formatDateTime(transfer.requestedAt)} />
            <DetailRow label="Data aprobării" value={formatDateTime(transfer.approvedAt)} />
            <DetailRow label="Data finalizării" value={formatDateTime(transfer.completedAt)} />
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {transfer.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notițe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {transfer.notes}
            </p>
          </CardContent>
        </Card>
      )}
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
function TransferDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
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
        {Array.from({ length: 2 }).map((_, i) => (
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
