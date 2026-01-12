'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Users,
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Loader2,
  UserCheck,
  UserX,
  KeyRound,
  Save,
  Shield,
} from 'lucide-react';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  useResetUserPin,
  useAdminDepartments,
  useAdminLocations,
} from '@/lib/hooks';
import type { User } from '@/types';
import type { UserFormData } from '@/lib/api/admin';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

const roleConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  admin: { label: 'Administrator', variant: 'destructive' },
  manager: { label: 'Manager', variant: 'default' },
  operator: { label: 'Operator', variant: 'secondary' },
  viewer: { label: 'Vizualizator', variant: 'outline' },
};

export default function UsersPage() {
  const router = useRouter();
  const { data: users, isLoading } = useUsers();
  const { data: departments } = useAdminDepartments();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const resetUserPin = useResetUserPin();

  const [showDialog, setShowDialog] = React.useState(false);
  const [showPinDialog, setShowPinDialog] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [pinResetUser, setPinResetUser] = React.useState<User | null>(null);
  const [newPin, setNewPin] = React.useState('');
  const [formData, setFormData] = React.useState<UserFormData>({
    username: '',
    fullName: '',
    email: null,
    pin: '',
    role: 'viewer',
    departmentId: null,
    locationId: null,
    phoneNumber: null,
    isActive: true,
  });

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      fullName: '',
      email: null,
      pin: '',
      role: 'viewer',
      departmentId: null,
      locationId: null,
      phoneNumber: null,
      isActive: true,
    });
    setShowDialog(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      locationId: null,
      phoneNumber: null,
      isActive: user.isActive,
    });
    setShowDialog(true);
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Sigur doriți să ștergeți utilizatorul "${user.username}"?`)) {
      await deleteUser.mutateAsync(user.id);
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (user.isActive) {
      await deactivateUser.mutateAsync(user.id);
    } else {
      await activateUser.mutateAsync(user.id);
    }
  };

  const handleResetPin = (user: User) => {
    setPinResetUser(user);
    setNewPin('');
    setShowPinDialog(true);
  };

  const handleSubmitPinReset = async () => {
    if (pinResetUser && newPin.length >= 4) {
      await resetUserPin.mutateAsync({ id: pinResetUser.id, pin: newPin });
      setShowPinDialog(false);
      setPinResetUser(null);
      setNewPin('');
    }
  };

  const handleSubmit = async () => {
    const submitData: Partial<UserFormData> = {
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      departmentId: formData.departmentId,
      isActive: formData.isActive,
    };

    if (editingUser) {
      // Don't include password for updates unless explicitly set
      await updateUser.mutateAsync({ id: editingUser.id, data: submitData });
    } else {
      // Include all data for creation
      await createUser.mutateAsync({
        ...formData,
        username: formData.username,
        pin: formData.pin,
      });
    }
    setShowDialog(false);
  };

  const isSaving = createUser.isPending || updateUser.isPending;

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Utilizatori
              </h1>
              <p className="text-sm text-slate-500">
                Gestionare conturi utilizatori
              </p>
            </div>
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Adaugă utilizator
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total utilizatori"
          value={users?.length || 0}
          icon={Users}
        />
        <StatCard
          label="Activi"
          value={users?.filter((u) => u.isActive).length || 0}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          label="Inactivi"
          value={users?.filter((u) => !u.isActive).length || 0}
          icon={UserX}
          variant="warning"
        />
        <StatCard
          label="Administratori"
          value={users?.filter((u) => u.role === 'admin').length || 0}
          icon={Shield}
          variant="info"
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista utilizatori</CardTitle>
          <CardDescription>
            {users?.length || 0} utilizatori înregistrați
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizator</TableHead>
                <TableHead>Nume complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Creat</TableHead>
                <TableHead className="w-[80px]">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => {
                const roleConf = roleConfig[user.role] || roleConfig.viewer;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell className="text-slate-500">{user.email || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={roleConf.variant}>{roleConf.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Activ' : 'Inactiv'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: ro })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editează
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPin(user)}>
                            <KeyRound className="mr-2 h-4 w-4" />
                            Resetează PIN
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                            {user.isActive ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Dezactivează
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activează
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Șterge
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {(!users || users.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500">
                    Nu există utilizatori înregistrați
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit User Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editează utilizatorul' : 'Adaugă utilizator nou'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Modificați datele utilizatorului'
                : 'Completați datele noului utilizator'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Username *</label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="ex: john.doe"
                disabled={!!editingUser}
              />
              {editingUser && (
                <p className="mt-1 text-xs text-slate-500">Username-ul nu poate fi modificat</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Nume complet *</label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="ex: John Doe"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value || null })}
                placeholder="ex: john@example.com"
              />
            </div>

            {!editingUser && (
              <div>
                <label className="text-sm font-medium">PIN *</label>
                <Input
                  type="password"
                  value={formData.pin || ''}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  placeholder="PIN (4-8 caractere)"
                  minLength={4}
                  maxLength={8}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Rol *</label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="viewer">Vizualizator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Departament</label>
              <Select
                value={formData.departmentId?.toString() || 'none'}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value === 'none' ? null : parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează departamentul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Niciun departament</SelectItem>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <label htmlFor="isActive" className="text-sm">Cont activ</label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Anulează
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving || !formData.username || !formData.fullName || (!editingUser && !formData.pin)}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {editingUser ? 'Salvează' : 'Creează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset PIN Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Resetează PIN</DialogTitle>
            <DialogDescription>
              Introduceți noul PIN pentru utilizatorul &quot;{pinResetUser?.username}&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">PIN nou *</label>
              <Input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="PIN nou (4-8 caractere)"
                minLength={4}
                maxLength={8}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPinDialog(false)}>
              Anulează
            </Button>
            <Button
              onClick={handleSubmitPinReset}
              disabled={resetUserPin.isPending || newPin.length < 4}
            >
              {resetUserPin.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <KeyRound className="mr-2 h-4 w-4" />
              Resetează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  variant = 'default',
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'warning' | 'info';
}) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={`rounded-lg p-3 ${variantStyles[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
