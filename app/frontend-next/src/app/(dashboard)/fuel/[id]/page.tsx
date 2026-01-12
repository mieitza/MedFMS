'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
  Fuel,
  Gauge,
  CreditCard,
  Receipt,
} from 'lucide-react';
import { useFuelTransaction, useDeleteFuelTransaction } from '@/lib/hooks';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

export default function FuelTransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: transaction, isLoading, isError } = useFuelTransaction(id);
  const deleteTransaction = useDeleteFuelTransaction();

  const handleDelete = async () => {
    if (!id) return;
    await deleteTransaction.mutateAsync(id);
    router.push('/fuel');
  };

  if (isLoading) {
    return <FuelDetailSkeleton />;
  }

  if (isError || !transaction) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Fuel className="mb-4 h-12 w-12 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Tranzacția nu a fost găsită
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Este posibil ca tranzacția să fi fost ștearsă sau să nu aveți acces.
        </p>
        <Button variant="outline" onClick={() => router.push('/fuel')}>
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
                Alimentare #{transaction.id}
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              {formatDate(transaction.transactionDate)} - {transaction.vehicle?.licensePlate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/fuel/${transaction.id}/edit`}>
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
                <AlertDialogTitle>Ești sigur că vrei să ștergi această tranzacție?</AlertDialogTitle>
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
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                <Fuel className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cantitate</p>
                <p className="text-lg font-semibold">
                  {transaction.quantity.toLocaleString('ro-RO')} L
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                <Receipt className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cost total</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(transaction.totalCost)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Preț/litru</p>
                <p className="text-lg font-semibold">
                  {transaction.pricePerUnit
                    ? `${transaction.pricePerUnit.toFixed(2)} RON`
                    : '-'}
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
                  {transaction.odometer
                    ? `${transaction.odometer.toLocaleString('ro-RO')} km`
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Transaction Info */}
        <Card>
          <CardHeader>
            <CardTitle>Detalii tranzacție</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="ID tranzacție" value={`#${transaction.id}`} />
            <DetailRow label="Data tranzacției" value={formatDate(transaction.transactionDate)} />
            <DetailRow label="Data livrării" value={formatDate(transaction.deliveryDate)} />
            <DetailRow label="Tip combustibil" value={transaction.fuelType?.name} />
            <DetailRow label="Cantitate" value={`${transaction.quantity.toLocaleString('ro-RO')} L`} />
            <DetailRow
              label="Preț per unitate"
              value={transaction.pricePerUnit ? `${transaction.pricePerUnit.toFixed(2)} RON/L` : undefined}
            />
            <DetailRow label="Cost total" value={formatCurrency(transaction.totalCost)} />
          </CardContent>
        </Card>

        {/* Vehicle & Driver Info */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicul și șofer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Vehicul</span>
              <Link
                href={`/vehicles/${transaction.vehicleId}`}
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {transaction.vehicle?.licensePlate} ({transaction.vehicle?.vehicleCode})
              </Link>
            </div>
            {transaction.driver && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Șofer</span>
                <Link
                  href={`/drivers/${transaction.driverId}`}
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {transaction.driver.firstName} {transaction.driver.lastName}
                </Link>
              </div>
            )}
            <DetailRow
              label="Kilometraj la alimentare"
              value={
                transaction.odometer
                  ? `${transaction.odometer.toLocaleString('ro-RO')} km`
                  : undefined
              }
            />
          </CardContent>
        </Card>

        {/* Station & Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Stație și plată</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Stație alimentare" value={transaction.fuelStation?.name} />
            <DetailRow label="Nr. card" value={transaction.cardNumber} />
            <DetailRow label="Centru cost" value={transaction.costCenter} />
          </CardContent>
        </Card>

        {/* Invoice Info */}
        <Card>
          <CardHeader>
            <CardTitle>Facturare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Nr. factură" value={transaction.invoiceNumber} />
            <DetailRow label="Data facturii" value={formatDate(transaction.invoiceDate)} />
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {transaction.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notițe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {transaction.notes}
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
          <DetailRow label="Creat la" value={formatDateTime(transaction.createdAt)} />
          <DetailRow label="Ultima actualizare" value={formatDateTime(transaction.updatedAt)} />
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
function FuelDetailSkeleton() {
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
