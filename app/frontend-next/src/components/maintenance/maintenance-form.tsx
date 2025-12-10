'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Loader2, Wrench, DollarSign, FileText } from 'lucide-react';
import {
  useCreateMaintenanceWorkOrder,
  useUpdateMaintenanceWorkOrder,
  useVehicles,
  useMaintenanceTypes,
} from '@/lib/hooks';
import type { MaintenanceWorkOrder } from '@/types';
import type { MaintenanceWorkOrderFormData } from '@/lib/api';

const maintenanceFormSchema = z.object({
  vehicleId: z.coerce.number().min(1, 'Vehiculul este obligatoriu'),
  maintenanceTypeId: z.coerce.number().min(1, 'Tipul de mentenanță este obligatoriu'),
  status: z.enum(['pending', 'scheduled', 'in_progress', 'completed', 'cancelled']).default('pending'),
  priority: z.coerce.number().min(1).max(4).default(2),
  scheduledDate: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  completionDate: z.string().optional().nullable(),
  odometer: z.coerce.number().optional().nullable(),
  description: z.string().optional().nullable(),
  diagnosis: z.string().optional().nullable(),
  workPerformed: z.string().optional().nullable(),
  technicianNotes: z.string().optional().nullable(),
  estimatedCost: z.coerce.number().optional().nullable(),
  actualCost: z.coerce.number().optional().nullable(),
  partsCost: z.coerce.number().optional().nullable(),
  laborCost: z.coerce.number().optional().nullable(),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

interface MaintenanceFormProps {
  workOrder?: MaintenanceWorkOrder;
  isLoading?: boolean;
}

export function MaintenanceForm({ workOrder, isLoading = false }: MaintenanceFormProps) {
  const router = useRouter();
  const isEditing = !!workOrder;

  // Mutations
  const createWorkOrder = useCreateMaintenanceWorkOrder();
  const updateWorkOrder = useUpdateMaintenanceWorkOrder();

  // Reference data
  const { data: vehiclesData, isLoading: loadingVehicles } = useVehicles({ pageSize: 1000 });
  const { data: maintenanceTypes, isLoading: loadingTypes } = useMaintenanceTypes();

  const vehicles = vehiclesData?.data || [];

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema) as any,
    defaultValues: {
      vehicleId: workOrder?.vehicleId || 0,
      maintenanceTypeId: workOrder?.maintenanceTypeId || 0,
      status: workOrder?.status || 'pending',
      priority: workOrder?.priority || 2,
      scheduledDate: workOrder?.scheduledDate?.split('T')[0] || null,
      startDate: workOrder?.startDate?.split('T')[0] || null,
      completionDate: workOrder?.completionDate?.split('T')[0] || null,
      odometer: workOrder?.odometer || null,
      description: workOrder?.description || null,
      diagnosis: workOrder?.diagnosis || null,
      workPerformed: workOrder?.workPerformed || null,
      technicianNotes: workOrder?.technicianNotes || null,
      estimatedCost: workOrder?.estimatedCost || null,
      actualCost: workOrder?.actualCost || null,
      partsCost: workOrder?.partsCost || null,
      laborCost: workOrder?.laborCost || null,
    },
  });

  // Auto-calculate actual cost from parts and labor
  const watchParts = form.watch('partsCost');
  const watchLabor = form.watch('laborCost');

  React.useEffect(() => {
    if (watchParts !== null || watchLabor !== null) {
      const total = (watchParts || 0) + (watchLabor || 0);
      if (total > 0) {
        form.setValue('actualCost', total);
      }
    }
  }, [watchParts, watchLabor, form]);

  const onSubmit = async (data: MaintenanceFormValues) => {
    const formData: MaintenanceWorkOrderFormData = {
      vehicleId: data.vehicleId,
      maintenanceTypeId: data.maintenanceTypeId,
      status: data.status,
      priority: data.priority,
      scheduledDate: data.scheduledDate || null,
      startDate: data.startDate || null,
      completionDate: data.completionDate || null,
      odometer: data.odometer || null,
      description: data.description || null,
      diagnosis: data.diagnosis || null,
      workPerformed: data.workPerformed || null,
      technicianNotes: data.technicianNotes || null,
      estimatedCost: data.estimatedCost || null,
      actualCost: data.actualCost || null,
      partsCost: data.partsCost || null,
      laborCost: data.laborCost || null,
    };

    if (isEditing && workOrder) {
      await updateWorkOrder.mutateAsync({ id: workOrder.id, data: formData });
      router.push(`/maintenance/${workOrder.id}`);
    } else {
      const newWorkOrder = await createWorkOrder.mutateAsync(formData);
      router.push(`/maintenance/${newWorkOrder.id}`);
    }
  };

  const isSaving = createWorkOrder.isPending || updateWorkOrder.isPending;

  if (isLoading) {
    return <MaintenanceFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {isEditing ? 'Editează comandă de lucru' : 'Comandă nouă'}
          </h1>
          <p className="text-sm text-slate-500">
            {isEditing
              ? `Modifică datele comenzii ${workOrder?.workOrderNumber}`
              : 'Creează o comandă de lucru nouă'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">
                <Wrench className="mr-2 h-4 w-4" />
                Informații generale
              </TabsTrigger>
              <TabsTrigger value="cost">
                <DollarSign className="mr-2 h-4 w-4" />
                Costuri
              </TabsTrigger>
              <TabsTrigger value="details">
                <FileText className="mr-2 h-4 w-4" />
                Detalii lucrare
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detalii comandă</CardTitle>
                  <CardDescription>Informații de bază despre comanda de lucru</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="vehicleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicul *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString() || ''}
                            disabled={loadingVehicles}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează vehiculul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                  {vehicle.licensePlate} - {vehicle.vehicleCode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maintenanceTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tip mentenanță *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString() || ''}
                            disabled={loadingTypes}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează tipul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {maintenanceTypes?.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează statusul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">În așteptare</SelectItem>
                              <SelectItem value="scheduled">Programat</SelectItem>
                              <SelectItem value="in_progress">În lucru</SelectItem>
                              <SelectItem value="completed">Finalizat</SelectItem>
                              <SelectItem value="cancelled">Anulat</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prioritate</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează prioritatea" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Scăzută</SelectItem>
                              <SelectItem value="2">Normală</SelectItem>
                              <SelectItem value="3">Ridicată</SelectItem>
                              <SelectItem value="4">Urgentă</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data programată</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data începerii</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="completionDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data finalizării</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="odometer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kilometraj</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="ex: 50000"
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormDescription>Kilometrajul vehiculului la intervenție</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Descriere</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Descrierea problemei sau a lucrării..."
                            className="min-h-[100px]"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cost Tab */}
            <TabsContent value="cost" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Costuri</CardTitle>
                  <CardDescription>Informații despre costurile comenzii</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="estimatedCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost estimat (RON)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 500.00"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="actualCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost real (RON)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 450.00"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            />
                          </FormControl>
                          <FormDescription>Se calculează automat din piese + manoperă</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="partsCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost piese (RON)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 300.00"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="laborCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost manoperă (RON)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 150.00"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Diagnostic</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="diagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Diagnosticul problemei..."
                            className="min-h-[100px]"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lucrări efectuate</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="workPerformed"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Descrierea lucrărilor efectuate..."
                            className="min-h-[100px]"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notițe tehnician</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="technicianNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Observații sau recomandări..."
                            className="min-h-[100px]"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Anulează
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Salvează modificările' : 'Creează comanda'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function MaintenanceFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-10 w-full max-w-md" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
