'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Building2,
  Shield,
  Calendar,
  Key,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useAuthStore, useUser } from '@/lib/stores/auth-store';
import { authApi } from '@/lib/api/auth';

const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  operator: 'Operator',
  viewer: 'Vizualizator',
};

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  manager: 'bg-blue-100 text-blue-800 border-blue-200',
  operator: 'bg-green-100 text-green-800 border-green-200',
  viewer: 'bg-slate-100 text-slate-800 border-slate-200',
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b last:border-b-0">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <div className="text-base font-medium mt-0.5">{value || '-'}</div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useUser();
  const logout = useAuthStore((state) => state.logout);

  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleChangePin = async () => {
    // Validate
    setPinError('');

    if (!oldPin || !newPin || !confirmPin) {
      setPinError('Toate câmpurile sunt obligatorii');
      return;
    }

    if (newPin.length < 4) {
      setPinError('PIN-ul nou trebuie să aibă minim 4 caractere');
      return;
    }

    if (newPin !== confirmPin) {
      setPinError('PIN-urile nu coincid');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.changePin(oldPin, newPin);
      toast.success('PIN-ul a fost schimbat cu succes');
      setIsChangingPin(false);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'PIN-ul vechi este incorect';
      setPinError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPinForm = () => {
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setPinError('');
    setIsChangingPin(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profilul Meu</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Vizualizează și gestionează informațiile contului tău
        </p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <CardTitle className="text-xl">{user.fullName}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-0">
          <InfoRow
            icon={User}
            label="Nume utilizator"
            value={user.username}
          />
          <InfoRow
            icon={Mail}
            label="Email"
            value={user.email || 'Neset'}
          />
          <InfoRow
            icon={Shield}
            label="Rol"
            value={
              <Badge className={roleColors[user.role] || roleColors.viewer}>
                {roleLabels[user.role] || user.role}
              </Badge>
            }
          />
          <InfoRow
            icon={Building2}
            label="Departament"
            value={user.departmentId ? `ID: ${user.departmentId}` : 'Neatribuit'}
          />
          <InfoRow
            icon={Calendar}
            label="Cont creat"
            value={new Date(user.createdAt).toLocaleDateString('ro-RO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          />
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Securitate
          </CardTitle>
          <CardDescription>
            Gestionează setările de securitate ale contului
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isChangingPin ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPin">PIN actual</Label>
                <Input
                  id="oldPin"
                  type="password"
                  placeholder="Introdu PIN-ul actual"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPin">PIN nou</Label>
                <Input
                  id="newPin"
                  type="password"
                  placeholder="Introdu noul PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPin">Confirmă PIN nou</Label>
                <Input
                  id="confirmPin"
                  type="password"
                  placeholder="Confirmă noul PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {pinError && (
                <p className="text-sm text-red-600">{pinError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={handleChangePin}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvează
                </Button>
                <Button
                  variant="outline"
                  onClick={resetPinForm}
                  disabled={isSubmitting}
                >
                  Anulează
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">PIN de acces</p>
                <p className="text-sm text-slate-500">
                  Schimbă PIN-ul folosit pentru autentificare
                </p>
              </div>
              <Button variant="outline" onClick={() => setIsChangingPin(true)}>
                <Key className="mr-2 h-4 w-4" />
                Schimbă PIN
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acțiuni Cont</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Deconectare</p>
              <p className="text-sm text-slate-500">
                Ieși din contul curent pe acest dispozitiv
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Deconectare
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmare deconectare</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ești sigur că dorești să te deconectezi? Va trebui să introduci PIN-ul din nou pentru a te autentifica.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anulează</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Deconectează-mă
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Status Badge */}
      <div className="text-center">
        <Badge variant={user.isActive ? 'default' : 'destructive'} className="text-sm">
          {user.isActive ? 'Cont Activ' : 'Cont Inactiv'}
        </Badge>
      </div>
    </div>
  );
}
