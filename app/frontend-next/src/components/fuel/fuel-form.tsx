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
import { ArrowLeft, Save, Loader2, Fuel, Receipt, FileText } from 'lucide-react';
import {
  useCreateFuelTransaction,
  useUpdateFuelTransaction,
  useVehicles,
  useDrivers,
  useFuelTypes,
  useFuelStations,
} from '@/lib/hooks';
import type { FuelTransaction, FuelTransactionFormData } from '@/types';

const fuelFormSchema = z.object({
  vehicleId: z.coerce.number().min(1, 'Vehiculul este obligatoriu'),
  driverId: z.coerce.number().optional().nullable(),
  fuelTypeId: z.coerce.number().min(1, 'Tipul de combustibil este obligatoriu'),
  fuelStationId: z.coerce.number().optional().nullable(),
  quantity: z.coerce.number().min(0.01, 'Cantitatea trebuie să fie mai mare decât 0'),
  pricePerUnit: z.coerce.number().optional().nullable(),
  totalCost: z.coerce.number().optional().nullable(),
  odometer: z.coerce.number().optional().nullable(),
  transactionDate: z.string().min(1, 'Data tranzacției este obligatorie'),
  deliveryDate: z.string().optional().nullable(),
  invoiceDate: z.string().optional().nullable(),
  invoiceNumber: z.string().optional().nullable(),
  cardNumber: z.string().optional().nullable(),
  costCenter: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type FuelFormValues = z.infer<typeof fuelFormSchema>;

interface FuelFormProps {
  transaction?: FuelTransaction;
  isLoading?: boolean;
}

export function FuelForm({ transaction, isLoading = false }: FuelFormProps) {
  const router = useRouter();
  const isEditing = !!transaction;

  // Mutations
  const createTransaction = useCreateFuelTransaction();
  const updateTransaction = useUpdateFuelTransaction();

  // Reference data
  const { data: vehiclesData, isLoading: loadingVehicles } = useVehicles({ pageSize: 1000 });
  const { data: driversData, isLoading: loadingDrivers } = useDrivers({ pageSize: 1000 });
  const { data: fuelTypes, isLoading: loadingFuelTypes } = useFuelTypes();
  const { data: fuelStations, isLoading: loadingFuelStations } = useFuelStations();

  const vehicles = vehiclesData?.data || [];
  const drivers = driversData?.data || [];

  const form = useForm<FuelFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(fuelFormSchema) as any,
    defaultValues: {
      vehicleId: transaction?.vehicleId || 0,
      driverId: transaction?.driverId || null,
      fuelTypeId: transaction?.fuelTypeId || 0,
      fuelStationId: transaction?.fuelStationId || null,
      quantity: transaction?.quantity || 0,
      pricePerUnit: transaction?.pricePerUnit || null,
      totalCost: transaction?.totalCost || null,
      odometer: transaction?.odometer || null,
      transactionDate: transaction?.transactionDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      deliveryDate: transaction?.deliveryDate?.split('T')[0] || null,
      invoiceDate: transaction?.invoiceDate?.split('T')[0] || null,
      invoiceNumber: transaction?.invoiceNumber || null,
      cardNumber: transaction?.cardNumber || null,
      costCenter: transaction?.costCenter || null,
      notes: transaction?.notes || null,
    },
  });

  // Auto-calculate total cost when quantity or price changes
  const watchQuantity = form.watch('quantity');
  const watchPrice = form.watch('pricePerUnit');

  React.useEffect(() => {
    if (watchQuantity && watchPrice) {
      const total = watchQuantity * watchPrice;
      form.setValue('totalCost', Math.round(total * 100) / 100);
    }
  }, [watchQuantity, watchPrice, form]);

  const onSubmit = async (data: FuelFormValues) => {
    const formData: FuelTransactionFormData = {
      vehicleId: data.vehicleId,
      driverId: data.driverId || null,
      fuelTypeId: data.fuelTypeId,
      fuelStationId: data.fuelStationId || null,
      quantity: data.quantity,
      pricePerUnit: data.pricePerUnit || null,
      totalCost: data.totalCost || null,
      odometer: data.odometer || null,
      transactionDate: data.transactionDate,
      deliveryDate: data.deliveryDate || null,
      invoiceDate: data.invoiceDate || null,
      invoiceNumber: data.invoiceNumber || null,
      cardNumber: data.cardNumber || null,
      costCenter: data.costCenter || null,
      notes: data.notes || null,
    };

    if (isEditing && transaction) {
      await updateTransaction.mutateAsync({ id: transaction.id, data: formData });
      router.push(`/fuel/${transaction.id}`);
    } else {
      const newTransaction = await createTransaction.mutateAsync(formData);
      router.push(`/fuel/${newTransaction.id}`);
    }
  };

  const isSaving = createTransaction.isPending || updateTransaction.isPending;

  if (isLoading) {
    return <FuelFormSkeleton />;
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
            {isEditing ? 'Editează alimentare' : 'Alimentare nouă'}
          </h1>
          <p className="text-sm text-slate-500">
            {isEditing
              ? `Modifică datele alimentării #${transaction?.id}`
              : 'Înregistrează o alimentare nouă'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">
                <Fuel className="mr-2 h-4 w-4" />
                Informații generale
              </TabsTrigger>
              <TabsTrigger value="cost">
                <Receipt className="mr-2 h-4 w-4" />
                Cost și plată
              </TabsTrigger>
              <TabsTrigger value="invoice">
                <FileText className="mr-2 h-4 w-4" />
                Facturare
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detalii alimentare</CardTitle>
                  <CardDescription>Informații de bază despre alimentare</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="transactionDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data tranzacției *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data livrării</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                                  {vehicle.licensePlate || 'N/A'} - {vehicle.vehicleCode || `Vehicul #${vehicle.id}`}
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
                      name="driverId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Șofer</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value === '__none__' ? null : parseInt(value))}
                            value={field.value?.toString() || '__none__'}
                            disabled={loadingDrivers}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează șoferul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="__none__">Niciun șofer</SelectItem>
                              {drivers.map((driver) => (
                                <SelectItem key={driver.id} value={driver.id.toString()}>
                                  {driver.firstName || ''} {driver.lastName || `Șofer #${driver.id}`}
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
                      name="fuelTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tip combustibil *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString() || ''}
                            disabled={loadingFuelTypes}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează tipul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fuelTypes?.map((fuelType) => (
                                <SelectItem key={fuelType.id} value={fuelType.id.toString()}>
                                  {fuelType.name || `Tip combustibil #${fuelType.id}`}
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
                      name="fuelStationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stație alimentare</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value === '__none__' ? null : parseInt(value))}
                            value={field.value?.toString() || '__none__'}
                            disabled={loadingFuelStations}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează stația" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="__none__">Nicio stație</SelectItem>
                              {fuelStations?.map((station) => (
                                <SelectItem key={station.id} value={station.id.toString()}>
                                  {station.name || `Stație #${station.id}`}
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
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantitate (litri) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 50.00"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                          <FormDescription>Kilometrajul vehiculului la alimentare</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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

            {/* Cost Tab */}
            <TabsContent value="cost" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cost și plată</CardTitle>
                  <CardDescription>Informații despre cost și modalitatea de plată</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="pricePerUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preț per litru (RON)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 7.50"
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
                      name="totalCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost total (RON)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 375.00"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            />
                          </FormControl>
                          <FormDescription>Se calculează automat</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nr. card</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: 1234-5678" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormDescription>Numărul cardului de alimentare</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="costCenter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centru de cost</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: CC-001" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoice Tab */}
            <TabsContent value="invoice" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informații facturare</CardTitle>
                  <CardDescription>Detalii despre factura asociată</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="invoiceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nr. factură</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: FV-2024-001" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="invoiceDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data facturii</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
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
              {isEditing ? 'Salvează modificările' : 'Înregistrează alimentarea'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function FuelFormSkeleton() {
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
