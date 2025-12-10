'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Download,
  Calendar,
  Car,
  Fuel,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Gauge,
  Info,
} from 'lucide-react';
import { fuelApi, vehiclesApi } from '@/lib/api';
import type { FuelTransaction, Vehicle } from '@/types';

interface DailyStats {
  date: string;
  distance: number;
  fuelUsed: number;
  consumption: number | null;
  cost: number;
  costPerKm: number | null;
  transactions: number;
}

interface TotalStats {
  totalDistance: number;
  totalFuel: number;
  totalCost: number;
  avgConsumption: number;
  totalDays: number;
}

function StatCard({
  title,
  value,
  suffix = '',
  icon: Icon,
  color,
  change,
  changeLabel,
  loading = false,
}: {
  title: string;
  value: string | number;
  suffix?: string;
  icon: React.ElementType;
  color: string;
  change?: number;
  changeLabel?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {typeof value === 'number' ? value.toLocaleString('ro-RO', { maximumFractionDigits: 2 }) : value}
                  {suffix && <span className="text-sm font-normal text-slate-500 ml-1">{suffix}</span>}
                </p>
                {change !== undefined && changeLabel && (
                  <div className="flex items-center gap-1 text-sm mt-1">
                    {change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : change < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : null}
                    <span className={change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-slate-500'}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)}%
                    </span>
                    <span className="text-slate-500 text-xs ml-1">vs {changeLabel}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DailyVehicleReportPage() {
  // Get default dates - last 30 days
  const getDefaultDates = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return {
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [customStartDate, setCustomStartDate] = useState<string>(defaultDates.start);
  const [customEndDate, setCustomEndDate] = useState<string>(defaultDates.end);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [comparisonPeriod, setComparisonPeriod] = useState<string>('week');

  // Fetch vehicles
  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles', 'all'],
    queryFn: () => vehiclesApi.getAll({ pageSize: 1000 }),
  });

  const vehicles = vehiclesData?.data || [];

  // Fetch fuel transactions
  const { data: transactionsData, isLoading, refetch } = useQuery({
    queryKey: ['fuel', 'transactions', 'daily', selectedVehicleId, customStartDate, customEndDate],
    queryFn: () =>
      fuelApi.getAll({
        vehicleId: parseInt(selectedVehicleId),
        dateFrom: customStartDate,
        dateTo: customEndDate,
        pageSize: 10000,
      }),
    enabled: !!selectedVehicleId && !!customStartDate && !!customEndDate,
  });

  const transactions = transactionsData?.data || [];

  // Calculate daily statistics
  const { dailyStats, totalStats } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        dailyStats: [] as DailyStats[],
        totalStats: {
          totalDistance: 0,
          totalFuel: 0,
          totalCost: 0,
          avgConsumption: 0,
          totalDays: 0,
        } as TotalStats,
      };
    }

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) =>
      new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
    );

    // Group transactions by day
    const dailyMap: Record<string, {
      date: string;
      transactions: FuelTransaction[];
      fuelUsed: number;
      cost: number;
      minOdometer: number | null;
      maxOdometer: number | null;
    }> = {};

    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.transactionDate).toISOString().split('T')[0];

      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          transactions: [],
          fuelUsed: 0,
          cost: 0,
          minOdometer: null,
          maxOdometer: null,
        };
      }

      dailyMap[date].transactions.push(transaction);
      dailyMap[date].fuelUsed += parseFloat(String(transaction.quantity)) || 0;
      dailyMap[date].cost += parseFloat(String(transaction.totalCost)) || 0;

      const odometer = parseFloat(String(transaction.odometer)) || 0;
      if (odometer > 0) {
        if (dailyMap[date].minOdometer === null || odometer < dailyMap[date].minOdometer) {
          dailyMap[date].minOdometer = odometer;
        }
        if (dailyMap[date].maxOdometer === null || odometer > dailyMap[date].maxOdometer) {
          dailyMap[date].maxOdometer = odometer;
        }
      }
    });

    // Calculate daily statistics
    const dailyData: DailyStats[] = Object.values(dailyMap).map(day => {
      // Distance traveled on this day
      let distance = 0;
      if (day.maxOdometer !== null && day.minOdometer !== null) {
        distance = day.maxOdometer - day.minOdometer;
      }

      // Consumption (L/100km)
      const consumption = distance > 0 ? (day.fuelUsed / distance) * 100 : null;

      // Cost per km
      const costPerKm = distance > 0 ? day.cost / distance : null;

      return {
        date: day.date,
        distance,
        fuelUsed: day.fuelUsed,
        consumption,
        cost: day.cost,
        costPerKm,
        transactions: day.transactions.length,
      };
    });

    const sortedDailyData = dailyData.sort((a, b) => b.date.localeCompare(a.date));

    // Calculate total statistics
    const validConsumptions = sortedDailyData
      .filter(d => d.consumption !== null && d.consumption > 0)
      .map(d => d.consumption!);

    const totalStats: TotalStats = {
      totalDistance: sortedDailyData.reduce((sum, d) => sum + d.distance, 0),
      totalFuel: sortedDailyData.reduce((sum, d) => sum + d.fuelUsed, 0),
      totalCost: sortedDailyData.reduce((sum, d) => sum + d.cost, 0),
      avgConsumption: validConsumptions.length > 0
        ? validConsumptions.reduce((sum, c) => sum + c, 0) / validConsumptions.length
        : 0,
      totalDays: sortedDailyData.length,
    };

    return { dailyStats: sortedDailyData, totalStats };
  }, [transactions]);

  // Fetch comparison data
  const comparisonDates = useMemo(() => {
    if (!showComparison || !customStartDate || !customEndDate) {
      return null;
    }

    const startDate = new Date(customStartDate);
    const endDate = new Date(customEndDate);

    let previousStartDate: Date;
    let previousEndDate: Date;

    if (comparisonPeriod === 'day') {
      previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - 1);
      previousEndDate = new Date(endDate);
      previousEndDate.setDate(previousEndDate.getDate() - 1);
    } else if (comparisonPeriod === 'week') {
      previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - 7);
      previousEndDate = new Date(endDate);
      previousEndDate.setDate(previousEndDate.getDate() - 7);
    } else {
      previousStartDate = new Date(startDate);
      previousStartDate.setMonth(previousStartDate.getMonth() - 1);
      previousEndDate = new Date(endDate);
      previousEndDate.setMonth(previousEndDate.getMonth() - 1);
    }

    return {
      startDate: previousStartDate.toISOString().split('T')[0],
      endDate: previousEndDate.toISOString().split('T')[0],
    };
  }, [showComparison, customStartDate, customEndDate, comparisonPeriod]);

  const { data: comparisonData } = useQuery({
    queryKey: ['fuel', 'transactions', 'daily-comparison', selectedVehicleId, comparisonDates],
    queryFn: () =>
      fuelApi.getAll({
        vehicleId: parseInt(selectedVehicleId),
        dateFrom: comparisonDates!.startDate,
        dateTo: comparisonDates!.endDate,
        pageSize: 10000,
      }),
    enabled: !!selectedVehicleId && !!comparisonDates && showComparison,
  });

  // Calculate comparison statistics
  const comparisonStats = useMemo(() => {
    if (!comparisonData?.data || comparisonData.data.length === 0) {
      return null;
    }

    const transactions = comparisonData.data;
    const sortedTransactions = [...transactions].sort((a, b) =>
      new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
    );

    // Group transactions by day
    const dailyMap: Record<string, {
      fuelUsed: number;
      cost: number;
      minOdometer: number | null;
      maxOdometer: number | null;
    }> = {};

    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.transactionDate).toISOString().split('T')[0];

      if (!dailyMap[date]) {
        dailyMap[date] = {
          fuelUsed: 0,
          cost: 0,
          minOdometer: null,
          maxOdometer: null,
        };
      }

      dailyMap[date].fuelUsed += parseFloat(String(transaction.quantity)) || 0;
      dailyMap[date].cost += parseFloat(String(transaction.totalCost)) || 0;

      const odometer = parseFloat(String(transaction.odometer)) || 0;
      if (odometer > 0) {
        if (dailyMap[date].minOdometer === null || odometer < dailyMap[date].minOdometer) {
          dailyMap[date].minOdometer = odometer;
        }
        if (dailyMap[date].maxOdometer === null || odometer > dailyMap[date].maxOdometer) {
          dailyMap[date].maxOdometer = odometer;
        }
      }
    });

    // Calculate daily statistics
    const dailyData = Object.values(dailyMap).map((day: { fuelUsed: number; cost: number; minOdometer: number | null; maxOdometer: number | null }) => {
      let distance = 0;
      if (day.maxOdometer !== null && day.minOdometer !== null) {
        distance = day.maxOdometer - day.minOdometer;
      }
      const consumption = distance > 0 ? (day.fuelUsed / distance) * 100 : null;
      return { distance, fuelUsed: day.fuelUsed, consumption, cost: day.cost };
    });

    const validConsumptions = dailyData
      .filter(d => d.consumption !== null && d.consumption > 0)
      .map(d => d.consumption!);

    const previousStats = {
      totalDistance: dailyData.reduce((sum, d) => sum + d.distance, 0),
      totalFuel: dailyData.reduce((sum, d) => sum + d.fuelUsed, 0),
      totalCost: dailyData.reduce((sum, d) => sum + d.cost, 0),
      avgConsumption: validConsumptions.length > 0
        ? validConsumptions.reduce((sum, c) => sum + c, 0) / validConsumptions.length
        : 0,
    };

    return {
      distanceChange: previousStats.totalDistance > 0
        ? ((totalStats.totalDistance - previousStats.totalDistance) / previousStats.totalDistance) * 100
        : 0,
      fuelChange: previousStats.totalFuel > 0
        ? ((totalStats.totalFuel - previousStats.totalFuel) / previousStats.totalFuel) * 100
        : 0,
      costChange: previousStats.totalCost > 0
        ? ((totalStats.totalCost - previousStats.totalCost) / previousStats.totalCost) * 100
        : 0,
      consumptionChange: previousStats.avgConsumption > 0
        ? ((totalStats.avgConsumption - previousStats.avgConsumption) / previousStats.avgConsumption) * 100
        : 0,
    };
  }, [comparisonData, totalStats]);

  const getComparisonLabel = () => {
    if (comparisonPeriod === 'day') return 'Ziua Anterioară';
    if (comparisonPeriod === 'week') return 'Săptămâna Anterioară';
    return 'Luna Anterioară';
  };

  const getVehicleName = () => {
    const vehicle = vehicles.find((v: Vehicle) => v.id === parseInt(selectedVehicleId));
    return vehicle ? `${vehicle.vehicleCode} - ${vehicle.licensePlate}` : '';
  };

  // Export to CSV
  const exportToCSV = () => {
    if (dailyStats.length === 0) {
      alert('Nu există date pentru export');
      return;
    }

    const headers = [
      'Data',
      'Km Parcurși',
      'Combustibil Folosit (L)',
      'Consum (L/100km)',
      'Cost Total (RON)',
      'Cost/km (RON)',
      'Număr Alimentări',
    ];

    const rows = dailyStats.map(d => {
      const date = new Date(d.date);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      return [
        formattedDate,
        d.distance ? d.distance.toFixed(2) : 'N/A',
        d.fuelUsed ? d.fuelUsed.toFixed(2) : 'N/A',
        d.consumption ? d.consumption.toFixed(2) : 'N/A',
        d.cost ? d.cost.toFixed(2) : 'N/A',
        d.costPerKm ? d.costPerKm.toFixed(2) : 'N/A',
        d.transactions,
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    const vehicleName = getVehicleName().replace(/\s/g, '-') || 'vehicle';
    link.download = `raport-zilnic-${vehicleName}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/fuel/reports">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Înapoi la Rapoarte
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Raport Zilnic Vehicule</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Statistici zilnice: km parcurși, combustibil consumat și consum mediu per 100km
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Vehicul *</Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează vehiculul" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle: Vehicle) => (
                    <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                      {vehicle.vehicleCode} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data început</Label>
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Data sfârșit</Label>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={() => refetch()}
                disabled={!selectedVehicleId}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Generează Raport
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedVehicleId ? (
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="py-12 text-center">
            <Info className="h-12 w-12 mx-auto text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Selectează un vehicul
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              Alege un vehicul din lista de mai sus și apasă &quot;Generează Raport&quot; pentru a vedea statisticile zilnice
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[100px] w-full" />
          <div className="grid grid-cols-5 gap-4">
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : dailyStats.length > 0 ? (
        <>
          {/* Vehicle Name and Comparison Toggle */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{getVehicleName()}</h2>

            <div className="flex items-center gap-4">
              {showComparison && (
                <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">vs Ziua Anterioară</SelectItem>
                    <SelectItem value="week">vs Săptămâna Anterioară</SelectItem>
                    <SelectItem value="month">vs Luna Anterioară</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button
                variant={showComparison ? 'default' : 'outline'}
                onClick={() => setShowComparison(!showComparison)}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {showComparison ? 'Ascunde Comparație' : 'Arată Comparație'}
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatCard
              title="Zile cu Date"
              value={totalStats.totalDays}
              icon={Calendar}
              color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
              loading={isLoading}
            />
            <StatCard
              title="Total Km"
              value={totalStats.totalDistance.toFixed(2)}
              icon={Gauge}
              color="bg-green-100 dark:bg-green-900/30 text-green-600"
              change={showComparison && comparisonStats ? comparisonStats.distanceChange : undefined}
              changeLabel={showComparison ? getComparisonLabel() : undefined}
              loading={isLoading}
            />
            <StatCard
              title="Total Combustibil"
              value={totalStats.totalFuel.toFixed(2)}
              suffix="L"
              icon={Fuel}
              color="bg-purple-100 dark:bg-purple-900/30 text-purple-600"
              change={showComparison && comparisonStats ? comparisonStats.fuelChange : undefined}
              changeLabel={showComparison ? getComparisonLabel() : undefined}
              loading={isLoading}
            />
            <StatCard
              title="Consum Mediu"
              value={totalStats.avgConsumption.toFixed(2)}
              suffix="L/100km"
              icon={TrendingUp}
              color="bg-orange-100 dark:bg-orange-900/30 text-orange-600"
              change={showComparison && comparisonStats ? comparisonStats.consumptionChange : undefined}
              changeLabel={showComparison ? getComparisonLabel() : undefined}
              loading={isLoading}
            />
            <StatCard
              title="Cost Total"
              value={totalStats.totalCost.toFixed(2)}
              suffix="RON"
              icon={DollarSign}
              color="bg-red-100 dark:bg-red-900/30 text-red-600"
              change={showComparison && comparisonStats ? comparisonStats.costChange : undefined}
              changeLabel={showComparison ? getComparisonLabel() : undefined}
              loading={isLoading}
            />
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Daily Statistics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Statistici Zilnice</CardTitle>
              <CardDescription>
                {dailyStats.length} zile cu date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Km</TableHead>
                      <TableHead className="text-right">Combustibil (L)</TableHead>
                      <TableHead className="text-right">Consum (L/100km)</TableHead>
                      <TableHead className="text-right">Cost (RON)</TableHead>
                      <TableHead className="text-right">Cost/km</TableHead>
                      <TableHead className="text-right">Alimentări</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyStats.map((day) => {
                      const date = new Date(day.date);
                      const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

                      return (
                        <TableRow key={day.date}>
                          <TableCell className="font-medium">{formattedDate}</TableCell>
                          <TableCell className="text-right">
                            {day.distance > 0 ? `${day.distance.toFixed(2)} km` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {day.fuelUsed > 0 ? `${day.fuelUsed.toFixed(2)} L` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {day.consumption !== null ? `${day.consumption.toFixed(2)} L/100km` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {day.cost > 0 ? `${day.cost.toFixed(2)} RON` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {day.costPerKm !== null ? `${day.costPerKm.toFixed(2)} RON/km` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">{day.transactions}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Car className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nu există date</h3>
            <p className="text-sm text-slate-500">
              Nu există date pentru vehiculul și perioada selectată
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
