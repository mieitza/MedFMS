'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Truck,
  Users,
  Fuel,
  Wrench,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  Clock,
  FileWarning,
  Package,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';
import { cn } from '@/lib/utils';

// Stat card component
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  href,
  variant = 'default',
  loading = false,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  href?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}) {
  const variantStyles = {
    default: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    danger: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
  };

  const content = (
    <Card className={cn('relative overflow-hidden transition-all hover:shadow-md', href && 'cursor-pointer')}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            )}
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1 text-xs">
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                ) : null}
                <span
                  className={cn(
                    trend === 'up' && 'text-emerald-600',
                    trend === 'down' && 'text-red-600',
                    trend === 'neutral' && 'text-slate-500'
                  )}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={cn('rounded-xl p-3', variantStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// Alert item component
function AlertItem({
  icon: Icon,
  title,
  description,
  variant = 'warning',
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  variant?: 'warning' | 'danger' | 'info';
}) {
  const variantStyles = {
    warning: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
    danger: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:border-red-800',
    info: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
  };

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border p-3', variantStyles[variant])}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs opacity-80 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// Activity item component
function ActivityItem({
  icon: Icon,
  title,
  time,
  user,
}: {
  icon: React.ElementType;
  title: string;
  time: string;
  user: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
        <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{user}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats(),
    // Return mock data on error for now
    placeholderData: {
      totalVehicles: 47,
      activeVehicles: 42,
      totalDrivers: 35,
      activeDrivers: 32,
      pendingWorkOrders: 8,
      overdueMaintenances: 3,
      fuelCostMTD: 12450,
      fuelCostChange: -5.2,
      expiringDocuments: 5,
      expiredDocuments: 0,
      lowStockMaterials: 7,
    },
  });

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Bine ați venit! Iată o privire de ansamblu asupra flotei dumneavoastră.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/reports">
              <Activity className="mr-2 h-4 w-4" />
              Rapoarte
            </Link>
          </Button>
          <Button asChild>
            <Link href="/vehicles/new">
              <Plus className="mr-2 h-4 w-4" />
              Vehicul nou
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Vehicule Active"
          value={stats?.activeVehicles || 0}
          description={`din ${stats?.totalVehicles || 0} total`}
          icon={Truck}
          href="/vehicles"
          variant="default"
          loading={statsLoading}
        />
        <StatCard
          title="Șoferi Activi"
          value={stats?.activeDrivers || 0}
          description={`din ${stats?.totalDrivers || 0} total`}
          icon={Users}
          href="/drivers"
          variant="success"
          loading={statsLoading}
        />
        <StatCard
          title="Cost Combustibil (MTD)"
          value={`${(stats?.fuelCostMTD || 0).toLocaleString()} RON`}
          icon={Fuel}
          trend={stats?.fuelCostChange && stats.fuelCostChange < 0 ? 'down' : 'up'}
          trendValue={`${Math.abs(stats?.fuelCostChange || 0)}% față de luna trecută`}
          href="/fuel"
          variant="warning"
          loading={statsLoading}
        />
        <StatCard
          title="Lucrări în Așteptare"
          value={stats?.pendingWorkOrders || 0}
          description={`${stats?.overdueMaintenances || 0} întârziate`}
          icon={Wrench}
          href="/maintenance"
          variant={stats?.overdueMaintenances && stats.overdueMaintenances > 0 ? 'danger' : 'default'}
          loading={statsLoading}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alerts section */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Alerte</CardTitle>
              <CardDescription>Necesită atenție</CardDescription>
            </div>
            <Badge variant="destructive" className="h-6">
              {(stats?.expiringDocuments || 0) + (stats?.overdueMaintenances || 0) + (stats?.lowStockMaterials || 0)}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.overdueMaintenances && stats.overdueMaintenances > 0 && (
              <AlertItem
                icon={Wrench}
                title={`${stats.overdueMaintenances} mentenanțe întârziate`}
                description="Verificați programul de service"
                variant="danger"
              />
            )}
            {stats?.expiringDocuments && stats.expiringDocuments > 0 && (
              <AlertItem
                icon={FileWarning}
                title={`${stats.expiringDocuments} documente expiră curând`}
                description="În următoarele 30 de zile"
                variant="warning"
              />
            )}
            {stats?.lowStockMaterials && stats.lowStockMaterials > 0 && (
              <AlertItem
                icon={Package}
                title={`${stats.lowStockMaterials} materiale stoc critic`}
                description="Necesită reaprovizionare"
                variant="warning"
              />
            )}
            {(!stats?.overdueMaintenances && !stats?.expiringDocuments && !stats?.lowStockMaterials) && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                  <Activity className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="mt-3 text-sm font-medium">Totul este în regulă!</p>
                <p className="text-xs text-slate-500">Nu există alerte active</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Acțiuni Rapide</CardTitle>
            <CardDescription>Cele mai folosite funcții</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start h-auto py-3">
              <Link href="/vehicles/new">
                <Truck className="mr-3 h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">Adaugă vehicul</p>
                  <p className="text-xs text-slate-500">Înregistrează un vehicul nou</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-auto py-3">
              <Link href="/fuel?action=new">
                <Fuel className="mr-3 h-5 w-5 text-amber-500" />
                <div className="text-left">
                  <p className="font-medium">Alimentare nouă</p>
                  <p className="text-xs text-slate-500">Înregistrează consum combustibil</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-auto py-3">
              <Link href="/maintenance?action=new">
                <Wrench className="mr-3 h-5 w-5 text-emerald-500" />
                <div className="text-left">
                  <p className="font-medium">Comandă de lucru</p>
                  <p className="text-xs text-slate-500">Crează o lucrare nouă</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-auto py-3">
              <Link href="/warehouse/transfers?action=new">
                <Package className="mr-3 h-5 w-5 text-purple-500" />
                <div className="text-left">
                  <p className="font-medium">Transfer materiale</p>
                  <p className="text-xs text-slate-500">Inițiază un transfer</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Activitate Recentă</CardTitle>
              <CardDescription>Ultimele acțiuni</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/reports">
                Vezi toate
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 dark:divide-slate-800">
            <ActivityItem
              icon={Truck}
              title="Vehicul B-123-ABC actualizat"
              time="acum 5 min"
              user="Ion Popescu"
            />
            <ActivityItem
              icon={Fuel}
              title="Alimentare: 45L motorină"
              time="acum 15 min"
              user="Maria Ionescu"
            />
            <ActivityItem
              icon={Wrench}
              title="Comandă lucru #WO-2024-089"
              time="acum 1 oră"
              user="Admin"
            />
            <ActivityItem
              icon={Users}
              title="Șofer nou adăugat"
              time="acum 2 ore"
              user="Admin"
            />
            <ActivityItem
              icon={Package}
              title="Transfer materiale aprobat"
              time="acum 3 ore"
              user="Manager"
            />
          </CardContent>
        </Card>
      </div>

      {/* Additional info row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Vehicle status distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Vehicule</CardTitle>
            <CardDescription>Distribuția după status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Active', count: 42, color: 'bg-emerald-500', percentage: 89 },
                { label: 'În service', count: 3, color: 'bg-amber-500', percentage: 6 },
                { label: 'Inactive', count: 2, color: 'bg-slate-400', percentage: 5 },
              ].map((status) => (
                <div key={status.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{status.label}</span>
                    <span className="text-slate-500">{status.count} vehicule ({status.percentage}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={cn('h-full rounded-full transition-all', status.color)}
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming maintenance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Mentenanță Programată</CardTitle>
              <CardDescription>Următoarele 7 zile</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/maintenance">
                Toate
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { vehicle: 'B-123-ABC', type: 'Revizie tehnică', date: 'Mâine', priority: 'high' },
                { vehicle: 'B-456-DEF', type: 'Schimb ulei', date: 'În 3 zile', priority: 'medium' },
                { vehicle: 'B-789-GHI', type: 'Verificare frâne', date: 'În 5 zile', priority: 'low' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        item.priority === 'high' && 'bg-red-500',
                        item.priority === 'medium' && 'bg-amber-500',
                        item.priority === 'low' && 'bg-emerald-500'
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium">{item.vehicle}</p>
                      <p className="text-xs text-slate-500">{item.type}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    {item.date}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
