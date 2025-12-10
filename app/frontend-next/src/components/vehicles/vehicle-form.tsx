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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Loader2, Car, Settings, FileText } from 'lucide-react';
import { useCreateVehicle, useUpdateVehicle, useBrands, useModels, useVehicleTypes, useVehicleStatuses } from '@/lib/hooks';
import type { Vehicle, VehicleFormData } from '@/types';

const vehicleFormSchema = z.object({
  vehicleCode: z.string().min(1, 'Codul vehiculului este obligatoriu'),
  licensePlate: z.string().min(1, 'Numărul de înmatriculare este obligatoriu'),
  brandId: z.coerce.number().min(1, 'Marca este obligatorie'),
  modelId: z.coerce.number().min(1, 'Modelul este obligatoriu'),
  year: z.coerce.number().optional().nullable(),
  vehicleTypeId: z.coerce.number().optional().nullable(),
  fuelTypeId: z.coerce.number().optional().nullable(),
  statusId: z.coerce.number().optional().nullable(),
  departmentId: z.coerce.number().optional().nullable(),
  locationId: z.coerce.number().optional().nullable(),
  odometer: z.coerce.number().optional().nullable(),
  registrationDate: z.string().optional().nullable(),
  acquisitionDate: z.string().optional().nullable(),
  vin: z.string().optional().nullable(),
  engineNumber: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  anmdmAuthNumber: z.string().optional().nullable(),
  anmdmAuthType: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  vehicle?: Vehicle;
  isLoading?: boolean;
}

export function VehicleForm({ vehicle, isLoading = false }: VehicleFormProps) {
  const router = useRouter();
  const isEditing = !!vehicle;

  // Mutations
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();

  // Reference data
  const { data: brands, isLoading: loadingBrands } = useBrands();
  const { data: vehicleTypes, isLoading: loadingTypes } = useVehicleTypes();
  const { data: statuses, isLoading: loadingStatuses } = useVehicleStatuses();

  // Watch brandId to filter models
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema) as any,
    defaultValues: {
      vehicleCode: vehicle?.vehicleCode || '',
      licensePlate: vehicle?.licensePlate || '',
      brandId: vehicle?.brandId || 0,
      modelId: vehicle?.modelId || 0,
      year: vehicle?.year || null,
      vehicleTypeId: vehicle?.vehicleTypeId || null,
      fuelTypeId: vehicle?.fuelTypeId || null,
      statusId: vehicle?.statusId || null,
      departmentId: vehicle?.departmentId || null,
      locationId: vehicle?.locationId || null,
      odometer: vehicle?.odometer || null,
      registrationDate: vehicle?.registrationDate?.split('T')[0] || null,
      acquisitionDate: vehicle?.acquisitionDate?.split('T')[0] || null,
      vin: vehicle?.vin || null,
      engineNumber: vehicle?.engineNumber || null,
      color: vehicle?.color || null,
      notes: vehicle?.notes || null,
      anmdmAuthNumber: vehicle?.anmdmAuthNumber || null,
      anmdmAuthType: vehicle?.anmdmAuthType || null,
      isActive: vehicle?.isActive ?? true,
    },
  });

  const watchBrandId = form.watch('brandId');
  const { data: models, isLoading: loadingModels } = useModels(watchBrandId || undefined);

  // Reset modelId when brandId changes
  React.useEffect(() => {
    if (watchBrandId && vehicle?.brandId !== watchBrandId) {
      form.setValue('modelId', 0);
    }
  }, [watchBrandId, vehicle?.brandId, form]);

  const onSubmit = async (data: VehicleFormValues) => {
    const formData: VehicleFormData = {
      vehicleCode: data.vehicleCode,
      licensePlate: data.licensePlate,
      brandId: data.brandId,
      modelId: data.modelId,
      year: data.year,
      vehicleTypeId: data.vehicleTypeId,
      fuelTypeId: data.fuelTypeId,
      statusId: data.statusId,
      departmentId: data.departmentId,
      locationId: data.locationId,
      odometer: data.odometer,
      registrationDate: data.registrationDate,
      acquisitionDate: data.acquisitionDate,
      vin: data.vin,
      engineNumber: data.engineNumber,
      color: data.color,
      notes: data.notes,
    };

    if (isEditing && vehicle) {
      await updateVehicle.mutateAsync({ id: vehicle.id, data: formData });
      router.push(`/vehicles/${vehicle.id}`);
    } else {
      const newVehicle = await createVehicle.mutateAsync(formData);
      router.push(`/vehicles/${newVehicle.id}`);
    }
  };

  const isSaving = createVehicle.isPending || updateVehicle.isPending;

  if (isLoading) {
    return <VehicleFormSkeleton />;
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
            {isEditing ? 'Editează vehicul' : 'Vehicul nou'}
          </h1>
          <p className="text-sm text-slate-500">
            {isEditing
              ? `Modifică datele vehiculului ${vehicle?.licensePlate}`
              : 'Adaugă un vehicul nou în flotă'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">
                <Car className="mr-2 h-4 w-4" />
                Informații generale
              </TabsTrigger>
              <TabsTrigger value="technical">
                <Settings className="mr-2 h-4 w-4" />
                Date tehnice
              </TabsTrigger>
              <TabsTrigger value="anmdm">
                <FileText className="mr-2 h-4 w-4" />
                ANMDM
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Identificare</CardTitle>
                  <CardDescription>Informații de bază pentru identificarea vehiculului</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="vehicleCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cod vehicul *</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: VH001" {...field} />
                          </FormControl>
                          <FormDescription>Cod unic de identificare internă</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licensePlate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nr. înmatriculare *</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: B 123 ABC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString() || ''}
                            disabled={loadingBrands}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează marca" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands?.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id.toString()}>
                                  {brand.name}
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
                      name="modelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString() || ''}
                            disabled={!watchBrandId || loadingModels}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează modelul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {models?.map((model) => (
                                <SelectItem key={model.id} value={model.id.toString()}>
                                  {model.name}
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
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>An fabricație</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="ex: 2023"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="vehicleTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tip vehicul</FormLabel>
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
                              {vehicleTypes?.map((type) => (
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

                    <FormField
                      control={form.control}
                      name="statusId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString() || ''}
                            disabled={loadingStatuses}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează statusul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statuses?.map((status) => (
                                <SelectItem key={status.id} value={status.id.toString()}>
                                  {status.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Culoare</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: Alb" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Date administrative</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="registrationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data înmatriculării</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="acquisitionDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data achiziției</FormLabel>
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
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Vehicul activ</FormLabel>
                          <FormDescription>
                            Vehiculele inactive nu vor apărea în listele de selecție
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notițe</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Adaugă notițe sau observații..."
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

            {/* Technical Tab */}
            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Date tehnice</CardTitle>
                  <CardDescription>Informații tehnice despre vehicul</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="vin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VIN (Serie șasiu)</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: WVWZZZ3CZWE123456" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormDescription>Vehicle Identification Number</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="engineNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nr. motor</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: ABC123456" {...field} value={field.value ?? ''} />
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
                        <FormLabel>Kilometraj actual</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="ex: 50000"
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormDescription>Kilometri parcurși</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* ANMDM Tab */}
            <TabsContent value="anmdm" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Autorizație ANMDM</CardTitle>
                  <CardDescription>
                    Informații privind autorizația pentru transportul medicamentelor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="anmdmAuthNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nr. autorizație</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: AUTH-2024-001" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="anmdmAuthType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tip autorizație</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează tipul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="temperatura_controlata">Temperatură controlată</SelectItem>
                              <SelectItem value="stupefiante">Stupefiante</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
              {isEditing ? 'Salvează modificările' : 'Creează vehicul'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function VehicleFormSkeleton() {
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
