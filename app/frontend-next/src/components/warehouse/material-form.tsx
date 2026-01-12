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
import { ArrowLeft, Save, Loader2, Package, DollarSign, Barcode } from 'lucide-react';
import {
  useCreateMaterial,
  useUpdateMaterial,
  useWarehouses,
  useMaterialUnits,
  useAdminMaterialCategories,
} from '@/lib/hooks';
import type { Material } from '@/types';
import type { MaterialFormData } from '@/lib/api';

const materialFormSchema = z.object({
  materialCode: z.string().min(1, 'Codul materialului este obligatoriu'),
  name: z.string().min(1, 'Denumirea este obligatorie'),
  description: z.string().optional().nullable(),
  categoryId: z.coerce.number().optional().nullable(),
  unitId: z.coerce.number().optional().nullable(),
  standardPrice: z.coerce.number().optional().nullable(),
  currentStock: z.coerce.number().default(0),
  criticalLevel: z.coerce.number().optional().nullable(),
  expirationDate: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  warehouseId: z.coerce.number().optional().nullable(),
  locationInWarehouse: z.string().optional().nullable(),
});

type MaterialFormValues = z.infer<typeof materialFormSchema>;

interface MaterialFormProps {
  material?: Material;
  isLoading?: boolean;
}

export function MaterialForm({ material, isLoading = false }: MaterialFormProps) {
  const router = useRouter();
  const isEditing = !!material;

  // Mutations
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();

  // Reference data
  const { data: warehouses, isLoading: loadingWarehouses } = useWarehouses();
  const { data: units, isLoading: loadingUnits } = useMaterialUnits();
  const { data: categories, isLoading: loadingCategories } = useAdminMaterialCategories();

  const form = useForm<MaterialFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(materialFormSchema) as any,
    defaultValues: {
      materialCode: material?.materialCode || '',
      name: material?.name || '',
      description: material?.description || null,
      categoryId: material?.categoryId || null,
      unitId: material?.unitId || null,
      standardPrice: material?.standardPrice || null,
      currentStock: material?.currentStock || 0,
      criticalLevel: material?.criticalLevel || null,
      expirationDate: material?.expirationDate?.split('T')[0] || null,
      barcode: material?.barcode || null,
      serialNumber: material?.serialNumber || null,
      warehouseId: material?.warehouseId || null,
      locationInWarehouse: material?.locationInWarehouse || null,
    },
  });

  const onSubmit = async (data: MaterialFormValues) => {
    const formData: MaterialFormData = {
      materialCode: data.materialCode,
      name: data.name,
      description: data.description || null,
      categoryId: data.categoryId || null,
      unitId: data.unitId || null,
      standardPrice: data.standardPrice || null,
      currentStock: data.currentStock,
      criticalLevel: data.criticalLevel || null,
      expirationDate: data.expirationDate || null,
      barcode: data.barcode || null,
      serialNumber: data.serialNumber || null,
      warehouseId: data.warehouseId || null,
      locationInWarehouse: data.locationInWarehouse || null,
    };

    if (isEditing && material) {
      await updateMaterial.mutateAsync({ id: material.id, data: formData });
      router.push(`/warehouse/materials/${material.id}`);
    } else {
      const newMaterial = await createMaterial.mutateAsync(formData);
      router.push(`/warehouse/materials/${newMaterial.id}`);
    }
  };

  const isSaving = createMaterial.isPending || updateMaterial.isPending;

  if (isLoading) {
    return <MaterialFormSkeleton />;
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
            {isEditing ? 'Editează material' : 'Material nou'}
          </h1>
          <p className="text-sm text-slate-500">
            {isEditing
              ? `Modifică datele materialului ${material?.name}`
              : 'Adaugă un material nou în gestiune'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">
                <Package className="mr-2 h-4 w-4" />
                Informații generale
              </TabsTrigger>
              <TabsTrigger value="stock">
                <DollarSign className="mr-2 h-4 w-4" />
                Stoc și preț
              </TabsTrigger>
              <TabsTrigger value="identification">
                <Barcode className="mr-2 h-4 w-4" />
                Identificare
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detalii material</CardTitle>
                  <CardDescription>Informații de bază despre material</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="materialCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cod material *</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: MAT001" {...field} />
                          </FormControl>
                          <FormDescription>Cod unic de identificare</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Denumire *</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: Ulei motor 5W40" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descriere</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descrierea materialului..."
                            className="min-h-[80px]"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categorie</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}
                            value={field.value?.toString() || "none"}
                            disabled={loadingCategories}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Nicio categorie</SelectItem>
                              {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name || `Categorie #${category.id}`}
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
                      name="unitId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unitate măsură</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}
                            value={field.value?.toString() || "none"}
                            disabled={loadingUnits}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează unitatea" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Nicio unitate</SelectItem>
                              {units?.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id.toString()}>
                                  {unit.name || `Unitate #${unit.id}`} {unit.abbreviation ? `(${unit.abbreviation})` : ''}
                                </SelectItem>
                              ))}
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

            {/* Stock Tab */}
            <TabsContent value="stock" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stoc și preț</CardTitle>
                  <CardDescription>Informații despre stoc, preț și depozit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="currentStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stoc curent</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 100"
                              {...field}
                              value={field.value ?? 0}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="criticalLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nivel critic</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 10"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            />
                          </FormControl>
                          <FormDescription>Alertă la scăderea sub acest nivel</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="standardPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preț standard (RON)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 50.00"
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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="warehouseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depozit</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}
                            value={field.value?.toString() || "none"}
                            disabled={loadingWarehouses}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează depozitul" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Niciun depozit</SelectItem>
                              {warehouses?.map((warehouse) => (
                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                  {warehouse.name || `Depozit #${warehouse.id}`}
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
                      name="locationInWarehouse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Locație în depozit</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: Raft A3, Poziție 12" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Identification Tab */}
            <TabsContent value="identification" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Identificare</CardTitle>
                  <CardDescription>Coduri de bare, serii și date de expirare</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cod de bare</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: 5941234567890" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serialNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Număr serie</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: SN-2024-001" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data expirare</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ?? ''} />
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
              {isEditing ? 'Salvează modificările' : 'Creează materialul'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function MaterialFormSkeleton() {
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
            {Array.from({ length: 4 }).map((_, i) => (
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
