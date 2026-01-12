'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart3,
  Car,
  Users,
  Fuel,
  Wrench,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Calendar,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { vehiclesApi, driversApi, fuelApi, maintenanceApi } from '@/lib/api';
import { useLowStockMaterials } from '@/lib/hooks';

const dateRangeOptions = [
  { value: '7', label: 'Ultimele 7 zile' },
  { value: '30', label: 'Ultimele 30 zile' },
  { value: '90', label: 'Ultimele 90 zile' },
  { value: '365', label: 'Ultimul an' },
  { value: 'custom', label: 'Perioadă personalizată' },
];

function StatCard({
  title,
  value,
  suffix = '',
  icon: Icon,
  color,
  loading = false,
  trend,
  trendLabel,
}: {
  title: string;
  value: string | number;
  suffix?: string;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
  trend?: number;
  trendLabel?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{title}</p>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold">
                  {typeof value === 'number' ? value.toLocaleString('ro-RO', { maximumFractionDigits: 2 }) : value}
                  {suffix && <span className="text-sm font-normal text-slate-500 ml-1">{suffix}</span>}
                </p>
              )}
            </div>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(trend).toFixed(1)}%</span>
              {trendLabel && <span className="text-slate-500 text-xs">{trendLabel}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BarProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

function ReportLink({ title, description, href, icon: Icon }: { title: string; description: string; href: string; icon: React.ElementType }) {
  return (
    <Link href={href} className="block group">
      <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
          <div>
            <p className="font-medium group-hover:text-primary transition-colors">{title}</p>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

export default function ReportsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState<string>('30');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Get date params
  const dateParams = useMemo(() => {
    if (selectedDateRange === 'custom' && customStartDate && customEndDate) {
      return { startDate: customStartDate, endDate: customEndDate };
    } else if (selectedDateRange !== 'custom') {
      const days = parseInt(selectedDateRange);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    }
    return {};
  }, [selectedDateRange, customStartDate, customEndDate]);

  // Fetch overview data
  const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicles', 'overview'],
    queryFn: () => vehiclesApi.getAll({ pageSize: 1 }),
  });

  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ['drivers', 'overview'],
    queryFn: () => driversApi.getAll({ pageSize: 1 }),
  });

  const { data: fuelData, isLoading: fuelLoading } = useQuery({
    queryKey: ['fuel', 'overview', dateParams],
    queryFn: () => fuelApi.getAll({
      dateFrom: dateParams.startDate,
      dateTo: dateParams.endDate,
      pageSize: 10000
    }),
    enabled: !!dateParams.startDate && !!dateParams.endDate,
  });

  const { data: maintenanceData, isLoading: maintenanceLoading } = useQuery({
    queryKey: ['maintenance', 'overview', dateParams],
    queryFn: () => maintenanceApi.getAll({
      dateFrom: dateParams.startDate,
      dateTo: dateParams.endDate,
      pageSize: 1000
    }),
    enabled: !!dateParams.startDate && !!dateParams.endDate,
  });

  const { data: lowStockMaterials, isLoading: warehouseLoading } = useLowStockMaterials();

  // Calculate fuel metrics
  const fuelMetrics = useMemo(() => {
    const transactions = fuelData?.data || [];
    const totalCost = transactions.reduce((sum, t) => sum + (parseFloat(String(t.totalCost)) || 0), 0);
    const totalQuantity = transactions.reduce((sum, t) => sum + (parseFloat(String(t.quantity)) || 0), 0);
    const avgPricePerLiter = totalQuantity > 0 ? totalCost / totalQuantity : 0;
    return { totalCost, totalQuantity, avgPricePerLiter, count: transactions.length };
  }, [fuelData]);

  // Calculate maintenance metrics
  const maintenanceMetrics = useMemo(() => {
    const workOrders = maintenanceData?.data || [];
    const pending = workOrders.filter(w => w.status === 'pending').length;
    const inProgress = workOrders.filter(w => w.status === 'in_progress').length;
    const completed = workOrders.filter(w => w.status === 'completed').length;
    const totalCost = workOrders.reduce((sum, w) => sum + (parseFloat(String(w.actualCost)) || 0), 0);
    return { total: workOrders.length, pending, inProgress, completed, totalCost };
  }, [maintenanceData]);

  // Top vehicles by fuel cost
  const topVehiclesByFuel = useMemo(() => {
    const transactions = fuelData?.data || [];
    const vehicleMap: Record<string, { licensePlate: string; totalCost: number; quantity: number }> = {};

    transactions.forEach(t => {
      const key = t.vehicle?.licensePlate || 'Unknown';
      if (!vehicleMap[key]) {
        vehicleMap[key] = { licensePlate: key, totalCost: 0, quantity: 0 };
      }
      vehicleMap[key].totalCost += parseFloat(String(t.totalCost)) || 0;
      vehicleMap[key].quantity += parseFloat(String(t.quantity)) || 0;
    });

    return Object.values(vehicleMap).sort((a, b) => b.totalCost - a.totalCost).slice(0, 5);
  }, [fuelData]);

  const isLoading = vehiclesLoading || driversLoading || fuelLoading || maintenanceLoading || warehouseLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapoarte și Analize</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Prezentare generală a performanței flotei
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perioada de Analiză</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>Perioadă</Label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selectează perioada" />
                </SelectTrigger>
                <SelectContent>
                  {dateRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDateRange === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label>De la</Label>
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Până la</Label>
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicule"
          value={vehiclesData?.pagination.totalItems || 0}
          icon={Car}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
          loading={vehiclesLoading}
        />
        <StatCard
          title="Total Șoferi"
          value={driversData?.pagination.totalItems || 0}
          icon={Users}
          color="bg-green-100 dark:bg-green-900/30 text-green-600"
          loading={driversLoading}
        />
        <StatCard
          title="Cost Combustibil"
          value={fuelMetrics.totalCost}
          suffix="RON"
          icon={Fuel}
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600"
          loading={fuelLoading}
        />
        <StatCard
          title="Comenzi Mentenanță"
          value={maintenanceMetrics.total}
          icon={Wrench}
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600"
          loading={maintenanceLoading}
        />
      </div>

      {/* Detailed Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Combustibil Consumat"
          value={fuelMetrics.totalQuantity}
          suffix="L"
          icon={Fuel}
          color="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600"
          loading={fuelLoading}
        />
        <StatCard
          title="Preț Mediu/L"
          value={fuelMetrics.avgPricePerLiter}
          suffix="RON"
          icon={DollarSign}
          color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
          loading={fuelLoading}
        />
        <StatCard
          title="Mentenanță În Așteptare"
          value={maintenanceMetrics.pending}
          icon={AlertTriangle}
          color="bg-orange-100 dark:bg-orange-900/30 text-orange-600"
          loading={maintenanceLoading}
        />
        <StatCard
          title="Stoc Critic"
          value={lowStockMaterials?.length || 0}
          icon={Package}
          color="bg-red-100 dark:bg-red-900/30 text-red-600"
          loading={warehouseLoading}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vehicles by Fuel Cost */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vehicule după Cost Combustibil</CardTitle>
            <CardDescription>
              Vehiculele cu cel mai mare consum în perioada selectată
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fuelLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : topVehiclesByFuel.length > 0 ? (
              <div className="space-y-4">
                {topVehiclesByFuel.map((vehicle, index) => (
                  <div key={vehicle.licensePlate} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 h-6 p-0 justify-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{vehicle.licensePlate}</span>
                      </div>
                      <span className="text-sm font-medium">{vehicle.totalCost.toFixed(2)} RON</span>
                    </div>
                    <BarProgress
                      value={vehicle.totalCost}
                      max={topVehiclesByFuel[0]?.totalCost || 1}
                      color="bg-blue-600"
                    />
                    <p className="text-xs text-slate-500">{vehicle.quantity.toFixed(2)} L</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Nu există date pentru perioada selectată</p>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status Mentenanță</CardTitle>
            <CardDescription>
              Distribuția comenzilor de lucru
            </CardDescription>
          </CardHeader>
          <CardContent>
            {maintenanceLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>În Așteptare</span>
                  </div>
                  <span className="font-bold">{maintenanceMetrics.pending}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>În Progres</span>
                  </div>
                  <span className="font-bold">{maintenanceMetrics.inProgress}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Finalizate</span>
                  </div>
                  <span className="font-bold">{maintenanceMetrics.completed}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Cost Total Mentenanță</span>
                    <span className="font-bold">{maintenanceMetrics.totalCost.toFixed(2)} RON</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card>
          <CardHeader>
            <CardTitle>Materiale Stoc Critic</CardTitle>
            <CardDescription>
              Materialele care necesită reaprovizionare
            </CardDescription>
          </CardHeader>
          <CardContent>
            {warehouseLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : lowStockMaterials && lowStockMaterials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Stoc</TableHead>
                    <TableHead className="text-right">Critic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockMaterials.slice(0, 5).map((material) => (
                    <TableRow key={material.materialCode}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{material.name}</p>
                          <p className="text-xs text-slate-500">{material.materialCode}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={material.currentStock === 0 ? 'destructive' : 'secondary'}>
                          {material.currentStock}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-slate-500">{material.criticalLevel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-slate-500 py-8">Nu există materiale sub nivel critic</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Links to Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Rapoarte Detaliate</CardTitle>
            <CardDescription>
              Accesează rapoarte specifice pentru analize aprofundate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ReportLink
              title="Rapoarte Combustibil"
              description="Analiză detaliată a consumului și costurilor"
              href="/fuel/reports"
              icon={Fuel}
            />
            <ReportLink
              title="Rapoarte Depozit"
              description="Stocuri, prețuri, transferuri și expirări"
              href="/warehouse/reports"
              icon={Package}
            />
            <ReportLink
              title="Alimentări Duminică"
              description="Raport alimentări efectuate duminica"
              href="/fuel/reports/sunday-fueling"
              icon={Calendar}
            />
            <ReportLink
              title="Raport Zilnic Vehicule"
              description="Consum zilnic pe fiecare vehicul"
              href="/fuel/reports/daily-vehicle"
              icon={Car}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
