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
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Loader2, User, CreditCard, Phone } from 'lucide-react';
import { useCreateDriver, useUpdateDriver } from '@/lib/hooks';
import type { Driver, DriverFormData } from '@/types';

const driverFormSchema = z.object({
  firstName: z.string().min(1, 'Prenumele este obligatoriu'),
  lastName: z.string().min(1, 'Numele este obligatoriu'),
  licenseNumber: z.string().min(1, 'Numărul permisului este obligatoriu'),
  idNumber: z.string().nullish(),
  dateOfBirth: z.string().nullish(),
  licenseType: z.string().nullish(),
  licenseExpiryDate: z.string().nullish(),
  hireDate: z.string().nullish(),
  terminationDate: z.string().nullish(),
  departmentId: z.coerce.number().nullish(),
  cityId: z.coerce.number().nullish(),
  phoneNumber: z.string().nullish(),
  mobileNumber: z.string().nullish(),
  email: z.union([z.string().email('Email invalid'), z.literal('')]).nullish(),
  address: z.string().nullish(),
  emergencyContactName: z.string().nullish(),
  emergencyContactPhone: z.string().nullish(),
  notes: z.string().nullish(),
  isActive: z.boolean(),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

interface DriverFormProps {
  driver?: Driver;
  isLoading?: boolean;
}

export function DriverForm({ driver, isLoading = false }: DriverFormProps) {
  const router = useRouter();
  const isEditing = !!driver;

  // Mutations
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema) as any,
    defaultValues: {
      firstName: driver?.firstName || '',
      lastName: driver?.lastName || '',
      licenseNumber: driver?.licenseNumber || '',
      idNumber: driver?.idNumber || null,
      dateOfBirth: driver?.dateOfBirth?.split('T')[0] || null,
      licenseType: driver?.licenseType || null,
      licenseExpiryDate: driver?.licenseExpiryDate?.split('T')[0] || null,
      hireDate: driver?.hireDate?.split('T')[0] || null,
      terminationDate: driver?.terminationDate?.split('T')[0] || null,
      departmentId: driver?.departmentId || null,
      cityId: driver?.cityId || null,
      phoneNumber: driver?.phoneNumber || null,
      mobileNumber: driver?.mobileNumber || null,
      email: driver?.email || null,
      address: driver?.address || null,
      emergencyContactName: driver?.emergencyContactName || null,
      emergencyContactPhone: driver?.emergencyContactPhone || null,
      notes: driver?.notes || null,
      isActive: driver?.isActive ?? true,
    },
  });

  const onSubmit = async (data: DriverFormValues) => {
    const formData: DriverFormData = {
      firstName: data.firstName,
      lastName: data.lastName,
      licenseNumber: data.licenseNumber,
      idNumber: data.idNumber,
      dateOfBirth: data.dateOfBirth,
      licenseType: data.licenseType,
      licenseExpiryDate: data.licenseExpiryDate,
      hireDate: data.hireDate,
      departmentId: data.departmentId,
      cityId: data.cityId,
      phoneNumber: data.phoneNumber,
      mobileNumber: data.mobileNumber,
      email: data.email || null,
      address: data.address,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      notes: data.notes,
    };

    if (isEditing && driver) {
      await updateDriver.mutateAsync({ id: driver.id, data: formData });
      router.push(`/drivers/${driver.id}`);
    } else {
      const newDriver = await createDriver.mutateAsync(formData);
      router.push(`/drivers/${newDriver.id}`);
    }
  };

  const isSaving = createDriver.isPending || updateDriver.isPending;

  if (isLoading) {
    return <DriverFormSkeleton />;
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
            {isEditing ? 'Editează șofer' : 'Șofer nou'}
          </h1>
          <p className="text-sm text-slate-500">
            {isEditing
              ? `Modifică datele șoferului ${driver?.lastName} ${driver?.firstName}`
              : 'Adaugă un șofer nou în sistem'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personal">
                <User className="mr-2 h-4 w-4" />
                Date personale
              </TabsTrigger>
              <TabsTrigger value="license">
                <CreditCard className="mr-2 h-4 w-4" />
                Permis
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Phone className="mr-2 h-4 w-4" />
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Personal Tab */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informații personale</CardTitle>
                  <CardDescription>Date de identificare ale șoferului</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nume *</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: Popescu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prenume *</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: Ion" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNP</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex: 1234567890123"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data nașterii</FormLabel>
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresă</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: Str. Exemplu nr. 1, București"
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
                  <CardTitle>Date angajare</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="hireDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data angajării</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="terminationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data încetării</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormDescription>Completați doar dacă este cazul</FormDescription>
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
                          <FormLabel className="text-base">Șofer activ</FormLabel>
                          <FormDescription>
                            Șoferii inactivi nu vor apărea în listele de selecție
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
            </TabsContent>

            {/* License Tab */}
            <TabsContent value="license" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Permis de conducere</CardTitle>
                  <CardDescription>Informații despre permisul de conducere</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nr. permis *</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: AB123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licenseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categorie</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selectează categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="B+E">B+E</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="C+E">C+E</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                              <SelectItem value="D+E">D+E</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="licenseExpiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data expirării</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormDescription>
                          Veți primi notificări când permisul este aproape de expirare
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Date de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon fix</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex: 021 123 4567"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobil</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex: 0722 123 456"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="ex: nume@exemplu.ro"
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
                  <CardTitle>Contact urgență</CardTitle>
                  <CardDescription>Persoană de contact în caz de urgență</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nume contact</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex: Maria Popescu"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyContactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon contact</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex: 0722 123 456"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
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
          </Tabs>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Anulează
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Salvează modificările' : 'Creează șofer'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function DriverFormSkeleton() {
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
