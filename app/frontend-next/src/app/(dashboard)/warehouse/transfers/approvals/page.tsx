'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRightLeft,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Warehouse,
  Car,
  Eye,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  useTransferRequests,
  useUpdateTransferStatus,
  useWarehouses,
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

export default function TransferApprovalsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const { data: transfersData, isLoading } = useTransferRequests({
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sourceWarehouseId: warehouseFilter !== 'all' ? parseInt(warehouseFilter) : undefined,
    sortBy: 'requestedAt',
    sortOrder: 'desc',
    pageSize: 50,
  });
  const { data: warehouses } = useWarehouses();
  const updateStatus = useUpdateTransferStatus();

  const transfers = transfersData?.data || [];
  const pendingCount = transfers.filter(t => t.status === 'pending').length;

  const handleApprove = async () => {
    if (!selectedTransfer) return;
    try {
      await updateStatus.mutateAsync({ id: selectedTransfer.id, status: 'approved' });
      toast.success('Cererea a fost aprobată');
    } catch {
      toast.error('Eroare la aprobarea cererii');
    }
    setSelectedTransfer(null);
    setActionType(null);
  };

  const handleReject = async () => {
    if (!selectedTransfer) return;
    try {
      await updateStatus.mutateAsync({ id: selectedTransfer.id, status: 'rejected' });
      toast.success('Cererea a fost respinsă');
    } catch {
      toast.error('Eroare la respingerea cererii');
    }
    setSelectedTransfer(null);
    setActionType(null);
  };

  const handleComplete = async (transfer: TransferRequest) => {
    try {
      await updateStatus.mutateAsync({ id: transfer.id, status: 'completed' });
      toast.success('Transferul a fost finalizat');
    } catch {
      toast.error('Eroare la finalizarea transferului');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/warehouse">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Înapoi la Depozit
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Aprobări Transfer</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Gestionează și aprobă cererile de transfer de materiale
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            {pendingCount} în așteptare
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">În așteptare</p>
                <p className="text-2xl font-bold">
                  {transfers.filter(t => t.status === 'pending').length}
                </p>
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
                <p className="text-sm text-slate-500">Aprobate</p>
                <p className="text-2xl font-bold">
                  {transfers.filter(t => t.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <ArrowRightLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Finalizate</p>
                <p className="text-2xl font-bold">
                  {transfers.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Respinse</p>
                <p className="text-2xl font-bold">
                  {transfers.filter(t => t.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Cereri de Transfer</CardTitle>
          <CardDescription>
            Lista cererilor de transfer pentru aprobare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Caută după număr cerere..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate statusurile</SelectItem>
                <SelectItem value="pending">În așteptare</SelectItem>
                <SelectItem value="approved">Aprobate</SelectItem>
                <SelectItem value="rejected">Respinse</SelectItem>
                <SelectItem value="completed">Finalizate</SelectItem>
                <SelectItem value="cancelled">Anulate</SelectItem>
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Depozit sursă" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate depozitele</SelectItem>
                {warehouses?.map((wh) => (
                  <SelectItem key={wh.id} value={String(wh.id)}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : transfers.length === 0 ? (
            <div className="text-center py-12">
              <ArrowRightLeft className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold">Nu există cereri</h3>
              <p className="text-sm text-slate-500">
                Nu au fost găsite cereri de transfer cu filtrele selectate.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr. Cerere</TableHead>
                    <TableHead>De la</TableHead>
                    <TableHead>Către</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => {
                    const statusConf = statusConfig[transfer.status] || statusConfig.pending;
                    const StatusIcon = statusConf.icon;

                    return (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">
                          {transfer.requestNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4 text-slate-400" />
                            {transfer.sourceWarehouse?.name || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {transfer.destinationWarehouse ? (
                              <>
                                <Warehouse className="h-4 w-4 text-slate-400" />
                                {transfer.destinationWarehouse.name}
                              </>
                            ) : transfer.destinationVehicle ? (
                              <>
                                <Car className="h-4 w-4 text-slate-400" />
                                {transfer.destinationVehicle.licensePlate}
                              </>
                            ) : '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(transfer.requestedAt), 'dd MMM yyyy', { locale: ro })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConf.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {statusConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/warehouse/transfers/${transfer.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {transfer.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => {
                                    setSelectedTransfer(transfer);
                                    setActionType('approve');
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setSelectedTransfer(transfer);
                                    setActionType('reject');
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {transfer.status === 'approved' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleComplete(transfer)}
                                disabled={updateStatus.isPending}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <AlertDialog open={actionType === 'approve'} onOpenChange={() => setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprobă cererea de transfer</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că dorești să aprobi cererea {selectedTransfer?.requestNumber}?
              Materialele vor putea fi transferate după aprobare.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Aprobă
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={actionType === 'reject'} onOpenChange={() => setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Respinge cererea de transfer</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că dorești să respingi cererea {selectedTransfer?.requestNumber}?
              Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Respinge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
