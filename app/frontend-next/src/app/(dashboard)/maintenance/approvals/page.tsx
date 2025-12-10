'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  ArrowLeft,
  CheckCircle,
  XCircle,
  Car,
  Wrench,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
  Clock,
  Eye,
  Search,
} from 'lucide-react';
import { maintenanceApi } from '@/lib/api';
import type { MaintenanceWorkOrder } from '@/types';
import { toast } from 'sonner';

const priorityLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Urgent', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  2: { label: 'Ridicată', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  3: { label: 'Normal', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  4: { label: 'Scăzută', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  5: { label: 'Opțional', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400' },
};

const priorityOptions = [
  { value: 'all', label: 'Toate prioritățile' },
  { value: '1', label: 'Urgent' },
  { value: '2', label: 'Ridicată' },
  { value: '3', label: 'Normal' },
  { value: '4', label: 'Scăzută' },
  { value: '5', label: 'Opțional' },
];

interface ApprovalWorkOrder {
  workOrder: MaintenanceWorkOrder;
  vehicle: {
    id: number;
    vehicleCode: string;
    licensePlate: string;
  };
  maintenanceType: {
    id: number;
    typeCode: string;
    typeName: string;
    category: string;
  };
}

export default function MaintenanceApprovalsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<ApprovalWorkOrder | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Fetch pending approvals
  const { data: approvalsData, isLoading, refetch } = useQuery({
    queryKey: ['maintenance', 'pending-approval', priorityFilter, currentPage],
    queryFn: () =>
      maintenanceApi.getPendingApproval({
        page: currentPage,
        pageSize,
        ...(priorityFilter !== 'all' ? { priority: parseInt(priorityFilter) } : {}),
      }),
  });

  const workOrders: ApprovalWorkOrder[] = (approvalsData?.data as unknown as ApprovalWorkOrder[]) || [];

  // Filter by search term
  const filteredWorkOrders = useMemo(() => {
    if (!searchTerm) return workOrders;
    const term = searchTerm.toLowerCase();
    return workOrders.filter((wo) =>
      wo.workOrder.workOrderNumber?.toLowerCase().includes(term) ||
      wo.vehicle.vehicleCode?.toLowerCase().includes(term) ||
      wo.vehicle.licensePlate?.toLowerCase().includes(term) ||
      wo.workOrder.title?.toLowerCase().includes(term)
    );
  }, [workOrders, searchTerm]);

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
      maintenanceApi.approve(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast.success('Comandă de lucru aprobată cu succes');
      setShowApprovalDialog(false);
      setSelectedWorkOrder(null);
      setApprovalNotes('');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la aprobare: ${error.message}`);
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      maintenanceApi.reject(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast.success('Comandă de lucru respinsă');
      setShowRejectDialog(false);
      setSelectedWorkOrder(null);
      setApprovalNotes('');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la respingere: ${error.message}`);
    },
  });

  const handleApprove = (wo: ApprovalWorkOrder) => {
    setSelectedWorkOrder(wo);
    setApprovalNotes('');
    setShowApprovalDialog(true);
  };

  const handleReject = (wo: ApprovalWorkOrder) => {
    setSelectedWorkOrder(wo);
    setApprovalNotes('');
    setShowRejectDialog(true);
  };

  const confirmApprove = () => {
    if (selectedWorkOrder) {
      approveMutation.mutate({
        id: selectedWorkOrder.workOrder.id,
        notes: approvalNotes || undefined,
      });
    }
  };

  const confirmReject = () => {
    if (!approvalNotes.trim()) {
      toast.error('Motivul respingerii este obligatoriu');
      return;
    }
    if (selectedWorkOrder) {
      rejectMutation.mutate({
        id: selectedWorkOrder.workOrder.id,
        notes: approvalNotes,
      });
    }
  };

  const getPriorityBadge = (priority: number) => {
    const config = priorityLabels[priority] || priorityLabels[3];
    return (
      <Badge className={config.color} variant="secondary">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/maintenance">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Înapoi
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Aprobări Mentenanță</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Comenzi de lucru în așteptarea aprobării
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Căutare</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Caută după nr. comandă, vehicul..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Prioritate</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează prioritatea" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setPriorityFilter('all');
                  setCurrentPage(1);
                }}
              >
                Resetează filtrele
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">În așteptare</p>
                <p className="text-2xl font-bold">{filteredWorkOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Urgente</p>
                <p className="text-2xl font-bold">
                  {filteredWorkOrders.filter((wo) => wo.workOrder.priority === 1).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Vehicule Afectate</p>
                <p className="text-2xl font-bold">
                  {new Set(filteredWorkOrders.map((wo) => wo.vehicle.id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cost Estimat Total</p>
                <p className="text-2xl font-bold">
                  {filteredWorkOrders
                    .reduce((sum, wo) => sum + (parseFloat(String(wo.workOrder.estimatedCost)) || 0), 0)
                    .toFixed(0)} RON
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comenzi în Așteptare</CardTitle>
          <CardDescription>
            {filteredWorkOrders.length} comenzi de lucru necesită aprobare
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredWorkOrders.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Toate comenzile au fost procesate</h3>
              <p className="text-sm text-slate-500">
                Nu există comenzi de lucru în așteptarea aprobării.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr. Comandă</TableHead>
                    <TableHead>Vehicul</TableHead>
                    <TableHead>Titlu</TableHead>
                    <TableHead>Prioritate</TableHead>
                    <TableHead>Data Programată</TableHead>
                    <TableHead className="text-right">Cost Estimat</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkOrders.map((wo) => (
                    <TableRow key={wo.workOrder.id}>
                      <TableCell className="font-medium">
                        {wo.workOrder.workOrderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{wo.vehicle.vehicleCode}</div>
                          <div className="text-sm text-slate-500">{wo.vehicle.licensePlate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="truncate font-medium">{wo.workOrder.title}</div>
                          <div className="text-sm text-slate-500 truncate">
                            {wo.maintenanceType.typeName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(wo.workOrder.priority || 3)}
                      </TableCell>
                      <TableCell>
                        {wo.workOrder.scheduledDate
                          ? new Date(wo.workOrder.scheduledDate).toLocaleDateString('ro-RO')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {wo.workOrder.estimatedCost
                          ? `${parseFloat(String(wo.workOrder.estimatedCost)).toFixed(0)} RON`
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/maintenance/${wo.workOrder.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApprove(wo)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReject(wo)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Aprobă Comanda de Lucru</DialogTitle>
            <DialogDescription>
              Confirmați aprobarea comenzii de lucru pentru execuție.
            </DialogDescription>
          </DialogHeader>

          {selectedWorkOrder && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Nr. Comandă:</span>
                  <span>{selectedWorkOrder.workOrder.workOrderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Vehicul:</span>
                  <span>
                    {selectedWorkOrder.vehicle.vehicleCode} ({selectedWorkOrder.vehicle.licensePlate})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tip:</span>
                  <span>{selectedWorkOrder.maintenanceType.typeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Cost Estimat:</span>
                  <span>
                    {selectedWorkOrder.workOrder.estimatedCost
                      ? `${parseFloat(String(selectedWorkOrder.workOrder.estimatedCost)).toFixed(2)} RON`
                      : '-'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Note de Aprobare (opțional)</Label>
                <Textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Adăugați note sau comentarii..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApprovalDialog(false)}
              disabled={approveMutation.isPending}
            >
              Anulează
            </Button>
            <Button
              onClick={confirmApprove}
              disabled={approveMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveMutation.isPending ? 'Se procesează...' : 'Aprobă'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Respinge Comanda de Lucru</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune va respinge comanda de lucru. Motivul respingerii este obligatoriu.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedWorkOrder && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Nr. Comandă:</span>
                  <span>{selectedWorkOrder.workOrder.workOrderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Titlu:</span>
                  <span>{selectedWorkOrder.workOrder.title}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Motivul Respingerii <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Introduceți motivul respingerii..."
                  rows={3}
                  required
                />
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejectMutation.isPending}>
              Anulează
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmReject();
              }}
              disabled={rejectMutation.isPending || !approvalNotes.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejectMutation.isPending ? 'Se procesează...' : 'Respinge'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
