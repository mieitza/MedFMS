'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  ClipboardCheck,
  Pill,
  ArrowRightLeft,
  Loader2,
  AlertTriangle,
  Calendar,
  MapPin,
} from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';
import { ro } from 'date-fns/locale';
import { api } from '@/lib/api/client';

interface VehicleInventoryManagerProps {
  vehicleId: number;
  title?: string;
  readOnly?: boolean;
}

interface InventoryItem {
  id: number;
  itemCode: string;
  itemName: string;
  description: string | null;
  categoryId: number;
  unitId: number;
  isActive: boolean;
}

interface InventoryCategory {
  id: number;
  categoryCode: string;
  categoryName: string;
}

interface InventoryAssignment {
  assignment: {
    id: number;
    vehicleId: number;
    itemId: number;
    quantity: number;
    serialNumber: string | null;
    batchNumber: string | null;
    condition: string;
    status: string;
    location: string | null;
    expirationDate: number | null;
    manufactureDate: number | null;
    certificationNumber: string | null;
    certificationExpiryDate: number | null;
    notes: string | null;
    assignmentDate: number;
  };
  item: InventoryItem | null;
  category: InventoryCategory | null;
}

interface InspectionType {
  id: number;
  typeName: string;
}

const conditionOptions = [
  { value: 'excellent', label: 'Excelent', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'good', label: 'Bun', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'fair', label: 'Acceptabil', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'poor', label: 'Slab', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  { value: 'damaged', label: 'Deteriorat', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
];

const statusOptions = [
  { value: 'active', label: 'Activ', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'expired', label: 'Expirat', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'damaged', label: 'Deteriorat', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  { value: 'removed', label: 'Eliminat', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
  { value: 'maintenance', label: 'În mentenanță', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
];

function getConditionColor(condition: string) {
  const option = conditionOptions.find(o => o.value === condition);
  return option?.color || 'bg-gray-100 text-gray-800';
}

function getStatusColor(status: string) {
  const option = statusOptions.find(o => o.value === status);
  return option?.color || 'bg-gray-100 text-gray-800';
}

function getExpirationStatus(expirationDate: number | null) {
  if (!expirationDate) return null;
  const daysUntilExpiry = differenceInDays(expirationDate, Date.now());

  if (daysUntilExpiry < 0) {
    return { status: 'expired', color: 'bg-red-100 text-red-800 border-red-200', message: 'Expirat' };
  } else if (daysUntilExpiry <= 30) {
    return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', message: 'Expiră în curând' };
  }
  return { status: 'valid', color: 'bg-green-100 text-green-800 border-green-200', message: 'Valid' };
}

export function VehicleInventoryManager({
  vehicleId,
  title = 'Inventar vehicul',
  readOnly = false,
}: VehicleInventoryManagerProps) {
  const queryClient = useQueryClient();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [deleteAssignment, setDeleteAssignment] = useState<InventoryAssignment | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<InventoryAssignment | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 1,
    serialNumber: '',
    batchNumber: '',
    condition: 'good',
    status: 'active',
    location: '',
    expirationDate: '',
    manufactureDate: '',
    certificationNumber: '',
    certificationExpiryDate: '',
    notes: '',
  });

  const [inspectionData, setInspectionData] = useState({
    inspectionType: '',
    condition: 'good',
    notes: '',
    issuesFound: '',
    actionTaken: '',
    passed: true,
  });

  const [dispensingData, setDispensingData] = useState({
    quantityDispensed: 1,
    patientName: '',
    patientId: '',
    patientAge: '',
    patientGender: '',
    incidentType: '',
    incidentLocation: '',
    incidentDescription: '',
    diagnosis: '',
    symptoms: '',
    treatmentNotes: '',
    dispatchNumber: '',
    missionId: '',
    reason: '',
    notes: '',
  });

  // Queries
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['vehicle-inventory', vehicleId],
    queryFn: () => api.get<InventoryAssignment[]>(`/vehicle-inventory/vehicles/${vehicleId}/assignments`),
  });

  const { data: items = [] } = useQuery({
    queryKey: ['vehicle-inventory-items'],
    queryFn: () => api.get<{ item: InventoryItem }[]>('/vehicle-inventory/items'),
  });

  const { data: inspectionTypes = [] } = useQuery({
    queryKey: ['inspection-types'],
    queryFn: () => api.get<InspectionType[]>('/system/inspection-types'),
  });

  // Mutations
  const createAssignment = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post('/vehicle-inventory/assignments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-inventory', vehicleId] });
      setShowAddModal(false);
      resetFormData();
    },
  });

  const updateAssignment = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      api.patch(`/vehicle-inventory/assignments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-inventory', vehicleId] });
      setShowEditModal(false);
      setSelectedAssignment(null);
      resetFormData();
    },
  });

  const removeAssignment = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/vehicle-inventory/assignments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-inventory', vehicleId] });
      setDeleteAssignment(null);
    },
  });

  const createInspection = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post('/vehicle-inventory/inspections', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-inventory', vehicleId] });
      setShowInspectionModal(false);
      setSelectedAssignment(null);
      resetInspectionData();
    },
  });

  const dispenseItem = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post('/vehicle-inventory/dispensing', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-inventory', vehicleId] });
      setShowDispenseModal(false);
      setSelectedAssignment(null);
      resetDispensingData();
    },
  });

  const resetFormData = () => {
    setFormData({
      itemId: '',
      quantity: 1,
      serialNumber: '',
      batchNumber: '',
      condition: 'good',
      status: 'active',
      location: '',
      expirationDate: '',
      manufactureDate: '',
      certificationNumber: '',
      certificationExpiryDate: '',
      notes: '',
    });
  };

  const resetInspectionData = () => {
    setInspectionData({
      inspectionType: '',
      condition: 'good',
      notes: '',
      issuesFound: '',
      actionTaken: '',
      passed: true,
    });
  };

  const resetDispensingData = () => {
    setDispensingData({
      quantityDispensed: 1,
      patientName: '',
      patientId: '',
      patientAge: '',
      patientGender: '',
      incidentType: '',
      incidentLocation: '',
      incidentDescription: '',
      diagnosis: '',
      symptoms: '',
      treatmentNotes: '',
      dispatchNumber: '',
      missionId: '',
      reason: '',
      notes: '',
    });
  };

  const openEditModal = (assignment: InventoryAssignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      itemId: String(assignment.assignment.itemId),
      quantity: assignment.assignment.quantity,
      serialNumber: assignment.assignment.serialNumber || '',
      batchNumber: assignment.assignment.batchNumber || '',
      condition: assignment.assignment.condition,
      status: assignment.assignment.status,
      location: assignment.assignment.location || '',
      expirationDate: assignment.assignment.expirationDate
        ? new Date(assignment.assignment.expirationDate).toISOString().split('T')[0]
        : '',
      manufactureDate: assignment.assignment.manufactureDate
        ? new Date(assignment.assignment.manufactureDate).toISOString().split('T')[0]
        : '',
      certificationNumber: assignment.assignment.certificationNumber || '',
      certificationExpiryDate: assignment.assignment.certificationExpiryDate
        ? new Date(assignment.assignment.certificationExpiryDate).toISOString().split('T')[0]
        : '',
      notes: assignment.assignment.notes || '',
    });
    setShowEditModal(true);
  };

  const openInspectionModal = (assignment: InventoryAssignment) => {
    setSelectedAssignment(assignment);
    setInspectionData({
      inspectionType: '',
      condition: assignment.assignment.condition,
      notes: '',
      issuesFound: '',
      actionTaken: '',
      passed: true,
    });
    setShowInspectionModal(true);
  };

  const openDispenseModal = (assignment: InventoryAssignment) => {
    setSelectedAssignment(assignment);
    resetDispensingData();
    setShowDispenseModal(true);
  };

  const handleAddSubmit = async () => {
    await createAssignment.mutateAsync({
      vehicleId,
      itemId: parseInt(formData.itemId),
      quantity: formData.quantity,
      serialNumber: formData.serialNumber || null,
      batchNumber: formData.batchNumber || null,
      condition: formData.condition,
      status: formData.status,
      location: formData.location || null,
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate).getTime() : null,
      manufactureDate: formData.manufactureDate ? new Date(formData.manufactureDate).getTime() : null,
      certificationNumber: formData.certificationNumber || null,
      certificationExpiryDate: formData.certificationExpiryDate ? new Date(formData.certificationExpiryDate).getTime() : null,
      notes: formData.notes || null,
      assignmentDate: Date.now(),
    });
  };

  const handleEditSubmit = async () => {
    if (!selectedAssignment) return;
    await updateAssignment.mutateAsync({
      id: selectedAssignment.assignment.id,
      data: {
        quantity: formData.quantity,
        serialNumber: formData.serialNumber || null,
        batchNumber: formData.batchNumber || null,
        condition: formData.condition,
        status: formData.status,
        location: formData.location || null,
        expirationDate: formData.expirationDate ? new Date(formData.expirationDate).getTime() : null,
        manufactureDate: formData.manufactureDate ? new Date(formData.manufactureDate).getTime() : null,
        certificationNumber: formData.certificationNumber || null,
        certificationExpiryDate: formData.certificationExpiryDate ? new Date(formData.certificationExpiryDate).getTime() : null,
        notes: formData.notes || null,
      },
    });
  };

  const handleInspectionSubmit = async () => {
    if (!selectedAssignment) return;
    await createInspection.mutateAsync({
      assignmentId: selectedAssignment.assignment.id,
      inspectionDate: Date.now(),
      inspectionType: inspectionData.inspectionType,
      condition: inspectionData.condition,
      notes: inspectionData.notes || null,
      issuesFound: inspectionData.issuesFound || null,
      actionTaken: inspectionData.actionTaken || null,
      passed: inspectionData.passed,
    });
  };

  const handleDispenseSubmit = async () => {
    if (!selectedAssignment) return;
    await dispenseItem.mutateAsync({
      assignmentId: selectedAssignment.assignment.id,
      vehicleId,
      dispensedDate: Date.now(),
      quantityDispensed: dispensingData.quantityDispensed,
      patientName: dispensingData.patientName || null,
      patientId: dispensingData.patientId || null,
      patientAge: dispensingData.patientAge ? parseInt(dispensingData.patientAge) : null,
      patientGender: dispensingData.patientGender || null,
      incidentType: dispensingData.incidentType || null,
      incidentLocation: dispensingData.incidentLocation || null,
      incidentDescription: dispensingData.incidentDescription || null,
      diagnosis: dispensingData.diagnosis || null,
      symptoms: dispensingData.symptoms || null,
      treatmentNotes: dispensingData.treatmentNotes || null,
      dispatchNumber: dispensingData.dispatchNumber || null,
      missionId: dispensingData.missionId ? parseInt(dispensingData.missionId) : null,
      reason: dispensingData.reason || null,
      notes: dispensingData.notes || null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              Echipamente și consumabile medicale din vehicul
            </CardDescription>
          </div>
          {!readOnly && (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/warehouse/transfers/new?transferType=warehouse-to-vehicle&vehicleId=${vehicleId}`}>
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Solicită din depozit
                </Link>
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adaugă articol
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold">Nu există articole în inventar</h3>
            <p className="text-sm text-slate-500 mb-4">
              Adaugă primul articol folosind butonul de mai sus.
            </p>
            {!readOnly && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adaugă articol
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((assignment) => {
              const expStatus = getExpirationStatus(assignment.assignment.expirationDate);

              return (
                <div
                  key={assignment.assignment.id}
                  className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          {assignment.item?.itemName || 'Necunoscut'}
                        </h4>
                        <Badge className={getConditionColor(assignment.assignment.condition)}>
                          {conditionOptions.find(o => o.value === assignment.assignment.condition)?.label || assignment.assignment.condition}
                        </Badge>
                        <Badge className={getStatusColor(assignment.assignment.status)}>
                          {statusOptions.find(o => o.value === assignment.assignment.status)?.label || assignment.assignment.status}
                        </Badge>
                        {expStatus && (
                          <Badge variant="outline" className={expStatus.color}>
                            {expStatus.message}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Cantitate:</span>
                          <span>{assignment.assignment.quantity}</span>
                        </div>
                        {assignment.assignment.serialNumber && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Serial:</span>
                            <span>{assignment.assignment.serialNumber}</span>
                          </div>
                        )}
                        {assignment.assignment.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{assignment.assignment.location}</span>
                          </div>
                        )}
                        {assignment.assignment.expirationDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(assignment.assignment.expirationDate, 'dd MMM yyyy', { locale: ro })}
                            </span>
                          </div>
                        )}
                      </div>

                      {assignment.category && (
                        <div className="text-sm text-slate-500">
                          <span className="font-medium">Categorie:</span> {assignment.category.categoryName}
                        </div>
                      )}
                    </div>

                    {!readOnly && (
                      <div className="flex items-center gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDispenseModal(assignment)}
                          disabled={assignment.assignment.quantity === 0}
                          title="Eliberează"
                          className="text-green-600 hover:text-green-700"
                        >
                          <Pill className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openInspectionModal(assignment)}
                          title="Înregistrează inspecție"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ClipboardCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(assignment)}
                          title="Editează"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteAssignment(assignment)}
                          title="Elimină"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Add Item Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adaugă articol în inventar</DialogTitle>
            <DialogDescription>
              Selectează un articol și completează informațiile.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-4 px-1">
              <div className="space-y-2">
                <Label>Articol *</Label>
                <Select value={formData.itemId} onValueChange={(v) => setFormData(p => ({ ...p, itemId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează articolul" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((i) => (
                      <SelectItem key={i.item.id} value={String(i.item.id)}>
                        {i.item.itemName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cantitate</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stare</Label>
                  <Select value={formData.condition} onValueChange={(v) => setFormData(p => ({ ...p, condition: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Număr serial</Label>
                  <Input
                    value={formData.serialNumber}
                    onChange={(e) => setFormData(p => ({ ...p, serialNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Număr lot</Label>
                  <Input
                    value={formData.batchNumber}
                    onChange={(e) => setFormData(p => ({ ...p, batchNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Locație în vehicul</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                  placeholder="Ex: Compartiment 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data fabricării</Label>
                  <Input
                    type="date"
                    value={formData.manufactureDate}
                    onChange={(e) => setFormData(p => ({ ...p, manufactureDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data expirării</Label>
                  <Input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData(p => ({ ...p, expirationDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notițe</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Anulează
            </Button>
            <Button onClick={handleAddSubmit} disabled={!formData.itemId || createAssignment.isPending}>
              {createAssignment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adaugă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog open={showEditModal} onOpenChange={(open) => { setShowEditModal(open); if (!open) setSelectedAssignment(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editează articol</DialogTitle>
            <DialogDescription>
              Modifică informațiile articolului.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-4 px-1">
              <div className="space-y-2">
                <Label>Articol</Label>
                <Input value={selectedAssignment?.item?.itemName || ''} disabled className="bg-slate-50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cantitate</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.quantity}
                    onChange={(e) => setFormData(p => ({ ...p, quantity: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stare</Label>
                  <Select value={formData.condition} onValueChange={(v) => setFormData(p => ({ ...p, condition: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData(p => ({ ...p, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Număr serial</Label>
                  <Input
                    value={formData.serialNumber}
                    onChange={(e) => setFormData(p => ({ ...p, serialNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Număr lot</Label>
                  <Input
                    value={formData.batchNumber}
                    onChange={(e) => setFormData(p => ({ ...p, batchNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Locație în vehicul</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data fabricării</Label>
                  <Input
                    type="date"
                    value={formData.manufactureDate}
                    onChange={(e) => setFormData(p => ({ ...p, manufactureDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data expirării</Label>
                  <Input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData(p => ({ ...p, expirationDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notițe</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditModal(false); setSelectedAssignment(null); }}>
              Anulează
            </Button>
            <Button onClick={handleEditSubmit} disabled={updateAssignment.isPending}>
              {updateAssignment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspection Modal */}
      <Dialog open={showInspectionModal} onOpenChange={(open) => { setShowInspectionModal(open); if (!open) setSelectedAssignment(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Înregistrează inspecție</DialogTitle>
            <DialogDescription>
              Completează rezultatele inspecției pentru {selectedAssignment?.item?.itemName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tip inspecție *</Label>
                <Select value={inspectionData.inspectionType} onValueChange={(v) => setInspectionData(p => ({ ...p, inspectionType: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează..." />
                  </SelectTrigger>
                  <SelectContent>
                    {inspectionTypes.map((t) => (
                      <SelectItem key={t.id} value={t.typeName}>{t.typeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stare constatată *</Label>
                <Select value={inspectionData.condition} onValueChange={(v) => setInspectionData(p => ({ ...p, condition: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="passed"
                checked={inspectionData.passed}
                onCheckedChange={(checked) => setInspectionData(p => ({ ...p, passed: checked === true }))}
              />
              <Label htmlFor="passed" className="font-normal">Inspecție trecută</Label>
            </div>

            <div className="space-y-2">
              <Label>Probleme găsite</Label>
              <Textarea
                value={inspectionData.issuesFound}
                onChange={(e) => setInspectionData(p => ({ ...p, issuesFound: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Acțiuni întreprinse</Label>
              <Textarea
                value={inspectionData.actionTaken}
                onChange={(e) => setInspectionData(p => ({ ...p, actionTaken: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Notițe</Label>
              <Textarea
                value={inspectionData.notes}
                onChange={(e) => setInspectionData(p => ({ ...p, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowInspectionModal(false); setSelectedAssignment(null); }}>
              Anulează
            </Button>
            <Button onClick={handleInspectionSubmit} disabled={!inspectionData.inspectionType || createInspection.isPending}>
              {createInspection.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvează inspecția
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispense Modal */}
      <Dialog open={showDispenseModal} onOpenChange={(open) => { setShowDispenseModal(open); if (!open) setSelectedAssignment(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Eliberare articol</DialogTitle>
            <DialogDescription>
              Înregistrează eliberarea articolului {selectedAssignment?.item?.itemName}.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-4 px-1">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedAssignment?.item?.itemName}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    Disponibil: {selectedAssignment?.assignment.quantity || 0}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cantitate eliberată *</Label>
                <Input
                  type="number"
                  min={1}
                  max={selectedAssignment?.assignment.quantity || 1}
                  value={dispensingData.quantityDispensed}
                  onChange={(e) => setDispensingData(p => ({ ...p, quantityDispensed: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <Separator />
              <h4 className="font-medium">Informații pacient</h4>

              <div className="space-y-2">
                <Label>Nume pacient</Label>
                <Input
                  value={dispensingData.patientName}
                  onChange={(e) => setDispensingData(p => ({ ...p, patientName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>CNP/ID</Label>
                  <Input
                    value={dispensingData.patientId}
                    onChange={(e) => setDispensingData(p => ({ ...p, patientId: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vârstă</Label>
                  <Input
                    type="number"
                    min={0}
                    value={dispensingData.patientAge}
                    onChange={(e) => setDispensingData(p => ({ ...p, patientAge: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gen</Label>
                  <Select value={dispensingData.patientGender} onValueChange={(v) => setDispensingData(p => ({ ...p, patientGender: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculin</SelectItem>
                      <SelectItem value="female">Feminin</SelectItem>
                      <SelectItem value="other">Altul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              <h4 className="font-medium">Informații incident</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tip incident</Label>
                  <Input
                    value={dispensingData.incidentType}
                    onChange={(e) => setDispensingData(p => ({ ...p, incidentType: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Locație incident</Label>
                  <Input
                    value={dispensingData.incidentLocation}
                    onChange={(e) => setDispensingData(p => ({ ...p, incidentLocation: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descriere incident</Label>
                <Textarea
                  value={dispensingData.incidentDescription}
                  onChange={(e) => setDispensingData(p => ({ ...p, incidentDescription: e.target.value }))}
                  rows={2}
                />
              </div>

              <Separator />
              <h4 className="font-medium">Informații medicale</h4>

              <div className="space-y-2">
                <Label>Simptome</Label>
                <Textarea
                  value={dispensingData.symptoms}
                  onChange={(e) => setDispensingData(p => ({ ...p, symptoms: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Diagnostic</Label>
                <Textarea
                  value={dispensingData.diagnosis}
                  onChange={(e) => setDispensingData(p => ({ ...p, diagnosis: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Note tratament</Label>
                <Textarea
                  value={dispensingData.treatmentNotes}
                  onChange={(e) => setDispensingData(p => ({ ...p, treatmentNotes: e.target.value }))}
                  rows={2}
                />
              </div>

              <Separator />
              <h4 className="font-medium">Informații dispecerat</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Număr dispecerat</Label>
                  <Input
                    value={dispensingData.dispatchNumber}
                    onChange={(e) => setDispensingData(p => ({ ...p, dispatchNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID misiune</Label>
                  <Input
                    type="number"
                    value={dispensingData.missionId}
                    onChange={(e) => setDispensingData(p => ({ ...p, missionId: e.target.value }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Motiv eliberare</Label>
                <Input
                  value={dispensingData.reason}
                  onChange={(e) => setDispensingData(p => ({ ...p, reason: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Notițe</Label>
                <Textarea
                  value={dispensingData.notes}
                  onChange={(e) => setDispensingData(p => ({ ...p, notes: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDispenseModal(false); setSelectedAssignment(null); }}>
              Anulează
            </Button>
            <Button onClick={handleDispenseSubmit} disabled={dispenseItem.isPending}>
              {dispenseItem.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmă eliberarea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteAssignment} onOpenChange={() => setDeleteAssignment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimină articolul</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să elimini &quot;{deleteAssignment?.item?.itemName}&quot; din inventarul vehiculului?
              Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAssignment && removeAssignment.mutate(deleteAssignment.assignment.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {removeAssignment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Elimină
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default VehicleInventoryManager;
