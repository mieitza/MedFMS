'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { ArrowLeft, Save, Loader2, Plus, Trash2, ArrowRightLeft } from 'lucide-react';
import {
  useCreateTransferRequest,
  useWarehouses,
  useMaterials,
  useVehicles,
} from '@/lib/hooks';

const transferFormSchema = z.object({
  sourceWarehouseId: z.coerce.number().optional().nullable(),
  destinationWarehouseId: z.coerce.number().optional().nullable(),
  destinationVehicleId: z.coerce.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(z.object({
    materialId: z.coerce.number().min(1, 'Materialul este obligatoriu'),
    quantity: z.coerce.number().min(0.01, 'Cantitatea trebuie să fie mai mare decât 0'),
  })).min(1, 'Trebuie să adăugați cel puțin un material'),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

export default function NewTransferRequestPage() {
  const router = useRouter();

  const createTransfer = useCreateTransferRequest();
  const { data: warehouses, isLoading: loadingWarehouses } = useWarehouses();
  const { data: materialsData, isLoading: loadingMaterials } = useMaterials({ pageSize: 1000 });
  const { data: vehiclesData, isLoading: loadingVehicles } = useVehicles({ pageSize: 1000 });

  const materials = materialsData?.data || [];
  const vehicles = vehiclesData?.data || [];

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema) as any,
    defaultValues: {
      sourceWarehouseId: null,
      destinationWarehouseId: null,
      destinationVehicleId: null,
      notes: null,
      items: [{ materialId: 0, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const onSubmit = async (data: TransferFormValues) => {
    await createTransfer.mutateAsync({
      sourceWarehouseId: data.sourceWarehouseId || null,
      destinationWarehouseId: data.destinationWarehouseId || null,
      destinationVehicleId: data.destinationVehicleId || null,
      notes: data.notes || null,
      items: data.items,
    });
    router.push('/warehouse?tab=transfers');
  };

  const isSaving = createTransfer.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Cerere de transfer nouă
          </h1>
          <p className="text-sm text-slate-500">
            Creează o cerere pentru transferul materialelor
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalii transfer</CardTitle>
              <CardDescription>Specificați sursa și destinația transferului</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="sourceWarehouseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depozit sursă</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                        value={field.value?.toString() || ''}
                        disabled={loadingWarehouses}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează depozitul sursă" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Niciun depozit</SelectItem>
                          {warehouses?.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                              {warehouse.name}
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
                  name="destinationWarehouseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depozit destinație</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                        value={field.value?.toString() || ''}
                        disabled={loadingWarehouses}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează depozitul destinație" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Niciun depozit</SelectItem>
                          {warehouses?.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Sau selectați un vehicul mai jos</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="destinationVehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicul destinație (alternativ)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                      value={field.value?.toString() || ''}
                      disabled={loadingVehicles}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează vehiculul" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Niciun vehicul</SelectItem>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                            {vehicle.licensePlate} - {vehicle.vehicleCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Transfer către vehicul în loc de depozit</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notițe</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observații despre transfer..."
                        className="min-h-[80px]"
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Materiale de transferat</CardTitle>
                  <CardDescription>Adăugați materialele și cantitățile dorite</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ materialId: 0, quantity: 1 })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adaugă material
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`items.${index}.materialId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Material</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString() || ''}
                          disabled={loadingMaterials}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selectează materialul" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {materials.map((material) => (
                              <SelectItem key={material.id} value={material.id.toString()}>
                                {material.materialCode} - {material.name}
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
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormLabel>Cantitate</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {form.formState.errors.items?.root && (
                <p className="text-sm text-red-600">{form.formState.errors.items.root.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Anulează
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Creează cererea
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
