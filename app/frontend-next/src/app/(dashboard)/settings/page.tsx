'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Building2,
  Shield,
  Settings,
  Mail,
  Phone,
  MapPin,
  Save,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const tab = searchParams.get('tab') || 'profile';

  const handleTabChange = (value: string) => {
    router.push(`/settings?tab=${value}`, { scroll: false });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Setări
        </h1>
        <p className="text-sm text-slate-500">
          Gestionează profilul și preferințele tale
        </p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="organization" className="gap-2">
            <Building2 className="h-4 w-4" />
            Organizație
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2">
            <Shield className="h-4 w-4" />
            Admin
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informații profil</CardTitle>
              <CardDescription>
                Actualizează informațiile contului tău
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xl">
                    {user?.username ? getInitials(user.username) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{user?.username || 'Utilizator'}</h3>
                  <Badge variant="secondary">{user?.role || 'operator'}</Badge>
                </div>
              </div>

              <Separator />

              {/* Profile Form */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Nume utilizator</Label>
                  <Input
                    id="username"
                    defaultValue={user?.username || ''}
                    placeholder="Nume utilizator"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue=""
                    placeholder="email@exemplu.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue=""
                    placeholder="+40 7XX XXX XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Input
                    id="role"
                    defaultValue={user?.role || 'operator'}
                    disabled
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button disabled>
                  <Save className="mr-2 h-4 w-4" />
                  Salvează modificările
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schimbă parola</CardTitle>
              <CardDescription>
                Actualizează parola contului tău
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Parola curentă</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Parola nouă</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmă parola</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button disabled>
                  Schimbă parola
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informații organizație</CardTitle>
              <CardDescription>
                Detalii despre organizația ta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Nume organizație</Label>
                  <Input
                    id="orgName"
                    defaultValue="MedFMS"
                    disabled
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgCode">Cod organizație</Label>
                  <Input
                    id="orgCode"
                    defaultValue="MEDFMS-001"
                    disabled
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Contact organizație</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span>contact@medfms.ro</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <span>+40 XXX XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:col-span-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span>Adresa organizației</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Tab */}
        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Administrare</CardTitle>
              <CardDescription>
                Setări avansate pentru administratori
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role === 'admin' ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-dashed">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Utilizatori</h4>
                            <p className="text-sm text-slate-500">Gestionează utilizatorii</p>
                          </div>
                        </div>
                        <Button variant="outline" className="mt-4 w-full" asChild>
                          <a href="/admin">Mergi la Admin</a>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-dashed">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                            <Settings className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Date de referință</h4>
                            <p className="text-sm text-slate-500">Mărci, modele, categorii</p>
                          </div>
                        </div>
                        <Button variant="outline" className="mt-4 w-full" asChild>
                          <a href="/admin?tab=reference">Configurează</a>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="mb-4 h-12 w-12 text-slate-400" />
                  <h3 className="text-lg font-semibold">Acces restricționat</h3>
                  <p className="text-sm text-slate-500">
                    Doar administratorii au acces la aceste setări.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
