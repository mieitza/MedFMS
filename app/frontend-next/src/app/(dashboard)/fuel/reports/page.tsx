'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Fuel,
  Car,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
} from 'lucide-react';
import { fuelApi, vehiclesApi } from '@/lib/api';
import type { Vehicle, FuelTransaction } from '@/types';

// Types for analytics
interface ReportData {
  totalTransactions: number;
  totalFuelVolume: number;
  totalFuelCost: number;
  averageFuelPrice: number;
  averageConsumption: number;
  totalDistance: number;
  efficiency: number;
  costPerKm: number;
  transactionsByType: Record<string, number>;
  fuelByMonth: { month: string; value: number }[];
  costByMonth: { month: string; value: number }[];
  topExpensiveTransactions: FuelTransaction[];
}

interface FleetReportData {
  uniqueVehicles: number;
  uniqueStations: number;
  avgCostPerVehicle: number;
  avgCostPerTransaction: number;
  costByProductType: {
    productType: string;
    transactions: number;
    quantity: number;
    totalCost: number;
    percentOfTotal: number;
    avgCostPerUnit: number;
  }[];
  topVehiclesByCost: {
    vehicleId: number;
    vehicleReg: string;
    transactions: number;
    totalCost: number;
    totalQuantity: number;
    primaryFuelType: string;
  }[];
  topStationsByUsage: {
    stationId: number;
    stationName: string;
    transactions: number;
    totalCost: number;
    totalQuantity: number;
  }[];
  dailyUsageSummary: {
    date: string;
    transactions: number;
    cost: number;
    quantity: number;
    avgCostPerTransaction: number;
  }[];
  vehicleEfficiency: {
    vehicleId: number;
    vehicleReg: string;
    transactions: number;
    totalCost: number;
    totalQuantity: number;
    avgCostPerLiter: number;
  }[];
  fuelProductsCost: number;
  servicesOtherCost: number;
  highestCostVehicle: { vehicleReg: string; totalCost: number } | null;
  lowestCostVehicle: { vehicleReg: string; totalCost: number } | null;
  medianCostPerVehicle: number;
  primaryFuel: string;
  primaryFuelQuantity: number;
  avgDailyTransactions: number;
  avgDailyCost: number;
}

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
  loading = false,
}: {
  title: string;
  value: string | number;
  suffix?: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{title}</p>
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString('ro-RO', { maximumFractionDigits: 2 }) : value}
          {suffix && <span className="text-sm font-normal text-slate-500 ml-1">{suffix}</span>}
        </p>
      )}
    </div>
  );
}

function BarProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default function FuelReportsPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');
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

  // Fetch vehicles
  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles', 'all'],
    queryFn: () => vehiclesApi.getAll({ pageSize: 1000 }),
  });

  const vehicles = vehiclesData?.data || [];

  // Fetch fuel transactions
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['fuel', 'transactions', 'reports', selectedVehicleId, dateParams],
    queryFn: () =>
      fuelApi.getAll({
        dateFrom: dateParams.startDate,
        dateTo: dateParams.endDate,
        ...(selectedVehicleId !== 'all' ? { vehicleId: parseInt(selectedVehicleId) } : {}),
        pageSize: 10000,
      }),
    enabled: !!dateParams.startDate && !!dateParams.endDate,
  });

  const transactions = transactionsData?.data || [];

  // Calculate analytics
  const reportData = useMemo((): ReportData => {
    if (!transactions || transactions.length === 0) {
      return {
        totalTransactions: 0,
        totalFuelVolume: 0,
        totalFuelCost: 0,
        averageFuelPrice: 0,
        averageConsumption: 0,
        totalDistance: 0,
        efficiency: 0,
        costPerKm: 0,
        transactionsByType: {},
        fuelByMonth: [],
        costByMonth: [],
        topExpensiveTransactions: [],
      };
    }

    const totalTransactions = transactions.length;
    const totalFuelVolume = transactions.reduce((sum: number, t: FuelTransaction) => sum + (parseFloat(String(t.quantity)) || 0), 0);
    const totalFuelCost = transactions.reduce((sum: number, t: FuelTransaction) => sum + (parseFloat(String(t.totalCost)) || 0), 0);

    const odometerReadings = transactions
      .map((t: FuelTransaction) => parseFloat(String(t.odometer)) || 0)
      .filter((o: number) => o > 0);
    const totalDistance = odometerReadings.length > 0
      ? Math.max(...odometerReadings) - Math.min(...odometerReadings)
      : 0;

    const averageFuelPrice = totalFuelVolume > 0 ? totalFuelCost / totalFuelVolume : 0;
    const averageConsumption = totalTransactions > 0 ? totalFuelVolume / totalTransactions : 0;

    // Calculate efficiency
    let efficiency = 0;
    let efficiencyCount = 0;
    const sortedTransactions = [...transactions].sort((a, b) =>
      new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
    );

    for (let i = 1; i < sortedTransactions.length; i++) {
      const prev = sortedTransactions[i - 1];
      const curr = sortedTransactions[i];
      const distance = (parseFloat(String(curr.odometer)) || 0) - (parseFloat(String(prev.odometer)) || 0);
      const fuel = parseFloat(String(curr.quantity)) || 0;

      if (distance > 0 && fuel > 0) {
        efficiency += (fuel / distance) * 100;
        efficiencyCount++;
      }
    }
    efficiency = efficiencyCount > 0 ? efficiency / efficiencyCount : 0;

    const costPerKm = totalDistance > 0 ? totalFuelCost / totalDistance : 0;

    // Transactions by type - use fuelType name
    const transactionsByType = transactions.reduce((acc: Record<string, number>, t: FuelTransaction) => {
      const type = t.fuelType?.name || 'necunoscut';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Aggregate by month
    const aggregateByMonth = (field: 'quantity' | 'totalCost') => {
      const monthlyData: Record<string, number> = {};
      transactions.forEach((t: FuelTransaction) => {
        const date = new Date(t.transactionDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        const value = field === 'quantity' ? t.quantity : t.totalCost;
        monthlyData[monthKey] += parseFloat(String(value)) || 0;
      });
      return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, value]) => ({ month, value }));
    };

    const fuelByMonth = aggregateByMonth('quantity');
    const costByMonth = aggregateByMonth('totalCost');

    // Top expensive transactions
    const topExpensiveTransactions = [...transactions]
      .sort((a, b) => (parseFloat(String(b.totalCost)) || 0) - (parseFloat(String(a.totalCost)) || 0))
      .slice(0, 10);

    return {
      totalTransactions,
      totalFuelVolume,
      totalFuelCost,
      averageFuelPrice,
      averageConsumption,
      totalDistance,
      efficiency,
      costPerKm,
      transactionsByType,
      fuelByMonth,
      costByMonth,
      topExpensiveTransactions,
    };
  }, [transactions]);

  // Calculate fleet analytics
  const fleetReportData = useMemo((): FleetReportData | null => {
    if (selectedVehicleId !== 'all' || !transactions || transactions.length === 0) {
      return null;
    }

    const uniqueVehicleIds = new Set(transactions.map((t: FuelTransaction) => t.vehicleId).filter(Boolean));
    const uniqueStationIds = new Set(transactions.map((t: FuelTransaction) => t.fuelStationId).filter(Boolean));
    const uniqueVehicles = uniqueVehicleIds.size;
    const uniqueStations = uniqueStationIds.size;

    const totalCost = transactions.reduce((sum: number, t: FuelTransaction) => sum + (parseFloat(String(t.totalCost)) || 0), 0);
    const totalTransactions = transactions.length;

    const avgCostPerVehicle = uniqueVehicles > 0 ? totalCost / uniqueVehicles : 0;
    const avgCostPerTransaction = totalTransactions > 0 ? totalCost / totalTransactions : 0;

    // Cost by Product Type
    const productTypeMap: Record<string, { productType: string; transactions: number; quantity: number; totalCost: number }> = {};
    transactions.forEach((t: FuelTransaction) => {
      const productType = t.fuelType?.name || 'Necunoscut';
      if (!productTypeMap[productType]) {
        productTypeMap[productType] = {
          productType,
          transactions: 0,
          quantity: 0,
          totalCost: 0,
        };
      }
      productTypeMap[productType].transactions++;
      productTypeMap[productType].quantity += parseFloat(String(t.quantity)) || 0;
      productTypeMap[productType].totalCost += parseFloat(String(t.totalCost)) || 0;
    });

    const costByProductType = Object.values(productTypeMap)
      .map(item => ({
        ...item,
        percentOfTotal: totalCost > 0 ? (item.totalCost / totalCost) * 100 : 0,
        avgCostPerUnit: item.quantity > 0 ? item.totalCost / item.quantity : 0,
      }))
      .sort((a, b) => b.totalCost - a.totalCost);

    // Top Vehicles by Cost
    const vehicleMap: Record<number, { vehicleId: number; vehicleReg: string; transactions: number; totalCost: number; totalQuantity: number; fuelTypes: Record<string, number> }> = {};
    transactions.forEach((t: FuelTransaction) => {
      if (!t.vehicleId) return;
      const vehicleId = t.vehicleId;
      const vehicleReg = t.vehicle?.licensePlate || 'Necunoscut';
      if (!vehicleMap[vehicleId]) {
        vehicleMap[vehicleId] = {
          vehicleId,
          vehicleReg,
          transactions: 0,
          totalCost: 0,
          totalQuantity: 0,
          fuelTypes: {},
        };
      }
      vehicleMap[vehicleId].transactions++;
      vehicleMap[vehicleId].totalCost += parseFloat(String(t.totalCost)) || 0;
      vehicleMap[vehicleId].totalQuantity += parseFloat(String(t.quantity)) || 0;
      const fuelType = t.fuelType?.name || 'Necunoscut';
      vehicleMap[vehicleId].fuelTypes[fuelType] = (vehicleMap[vehicleId].fuelTypes[fuelType] || 0) + 1;
    });

    const topVehiclesByCost = Object.values(vehicleMap)
      .map(v => ({
        ...v,
        primaryFuelType: Object.entries(v.fuelTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Necunoscut',
      }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 20);

    // Top Stations by Usage
    const stationMap: Record<number, { stationId: number; stationName: string; transactions: number; totalCost: number; totalQuantity: number }> = {};
    transactions.forEach((t: FuelTransaction) => {
      if (!t.fuelStationId) return;
      const stationId = t.fuelStationId;
      const stationName = t.fuelStation?.name || 'Necunoscut';
      if (!stationMap[stationId]) {
        stationMap[stationId] = {
          stationId,
          stationName,
          transactions: 0,
          totalCost: 0,
          totalQuantity: 0,
        };
      }
      stationMap[stationId].transactions++;
      stationMap[stationId].totalCost += parseFloat(String(t.totalCost)) || 0;
      stationMap[stationId].totalQuantity += parseFloat(String(t.quantity)) || 0;
    });

    const topStationsByUsage = Object.values(stationMap)
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 15);

    // Daily Usage Summary
    const dailyMap: Record<string, { date: string; transactions: number; cost: number; quantity: number }> = {};
    transactions.forEach((t: FuelTransaction) => {
      const date = t.transactionDate ? new Date(t.transactionDate).toISOString().split('T')[0] : 'Necunoscut';
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          transactions: 0,
          cost: 0,
          quantity: 0,
        };
      }
      dailyMap[date].transactions++;
      dailyMap[date].cost += parseFloat(String(t.totalCost)) || 0;
      dailyMap[date].quantity += parseFloat(String(t.quantity)) || 0;
    });

    const dailyUsageSummary = Object.values(dailyMap)
      .map(d => ({
        ...d,
        avgCostPerTransaction: d.transactions > 0 ? d.cost / d.transactions : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Vehicle Efficiency Analysis
    const vehicleEfficiency = Object.values(vehicleMap)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10)
      .map(v => ({
        ...v,
        avgCostPerLiter: v.totalQuantity > 0 ? v.totalCost / v.totalQuantity : 0,
      }));

    // Cost Distribution
    const fuelCategories = ['Diesel', 'Super, unleaded', 'Liquid Petrol Gas LPG', 'High performance diesel', 'Super-plus', 'Motorină', 'Benzină'];
    const fuelProductsCost = costByProductType
      .filter(item => fuelCategories.some(cat => item.productType.toLowerCase().includes(cat.toLowerCase())))
      .reduce((sum, item) => sum + item.totalCost, 0);
    const servicesOtherCost = totalCost - fuelProductsCost;

    // Vehicle cost statistics
    const vehicleCosts = Object.values(vehicleMap).map(v => v.totalCost).sort((a, b) => a - b);
    const highestCostVehicle = topVehiclesByCost[0] ? { vehicleReg: topVehiclesByCost[0].vehicleReg, totalCost: topVehiclesByCost[0].totalCost } : null;
    const lowestCostVehicle = vehicleCosts.length > 0
      ? Object.values(vehicleMap).find(v => v.totalCost === vehicleCosts[0])
      : null;
    const medianCostPerVehicle = vehicleCosts.length > 0
      ? vehicleCosts[Math.floor(vehicleCosts.length / 2)]
      : 0;

    const primaryFuel = costByProductType[0]?.productType || 'Necunoscut';
    const primaryFuelQuantity = costByProductType[0]?.quantity || 0;

    // Daily averages
    const uniqueDays = new Set(transactions.map((t: FuelTransaction) =>
      t.transactionDate ? new Date(t.transactionDate).toISOString().split('T')[0] : null
    ).filter(Boolean)).size;
    const avgDailyTransactions = uniqueDays > 0 ? totalTransactions / uniqueDays : 0;
    const avgDailyCost = uniqueDays > 0 ? totalCost / uniqueDays : 0;

    return {
      uniqueVehicles,
      uniqueStations,
      avgCostPerVehicle,
      avgCostPerTransaction,
      costByProductType,
      topVehiclesByCost,
      topStationsByUsage,
      dailyUsageSummary,
      vehicleEfficiency,
      fuelProductsCost,
      servicesOtherCost,
      highestCostVehicle,
      lowestCostVehicle: lowestCostVehicle ? { vehicleReg: lowestCostVehicle.vehicleReg, totalCost: lowestCostVehicle.totalCost } : null,
      medianCostPerVehicle,
      primaryFuel,
      primaryFuelQuantity,
      avgDailyTransactions,
      avgDailyCost,
    };
  }, [selectedVehicleId, transactions]);

  const getSelectedVehicleName = () => {
    if (selectedVehicleId === 'all') {
      return 'Toate vehiculele';
    }
    const vehicle = vehicles.find(v => v.id === parseInt(selectedVehicleId));
    return vehicle ? `${vehicle.vehicleCode} - ${vehicle.licensePlate}` : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/fuel">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Înapoi
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Rapoarte Combustibil</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Analiză detaliată a consumului și costurilor cu combustibilul
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">Rapoarte Adiționale</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild className="bg-white dark:bg-slate-900">
              <Link href="/fuel/reports/sunday-fueling">
                <Calendar className="mr-2 h-4 w-4" />
                Alimentări Duminică
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-white dark:bg-slate-900">
              <Link href="/fuel/reports/daily-vehicle">
                <BarChart3 className="mr-2 h-4 w-4" />
                Raport Zilnic Vehicule
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Configurare Raport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Vehicul</Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează vehiculul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate vehiculele</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                      {vehicle.vehicleCode} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Perioadă</Label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
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
              <div className="grid grid-cols-2 gap-2">
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : selectedVehicleId === 'all' && fleetReportData ? (
        /* Fleet-Wide Report */
        <div className="space-y-6">
          {/* Report Title */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-2">Raport Flotă - Analiză Completă</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Statistici agregate pentru toate vehiculele
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Perioadă: {dateParams.startDate} - {dateParams.endDate}
              </p>
            </CardContent>
          </Card>

          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Sumar Executiv</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Tranzacții" value={reportData.totalTransactions} loading={isLoading} />
                <StatCard title="Cost Total" value={reportData.totalFuelCost.toFixed(2)} suffix="RON" loading={isLoading} />
                <StatCard title="Combustibil Total" value={reportData.totalFuelVolume.toFixed(2)} suffix="L" loading={isLoading} />
                <StatCard title="Vehicule Unice" value={fleetReportData.uniqueVehicles} loading={isLoading} />
                <StatCard title="Stații Unice" value={fleetReportData.uniqueStations} loading={isLoading} />
                <StatCard title="Cost Mediu / Tranzacție" value={fleetReportData.avgCostPerTransaction.toFixed(2)} suffix="RON" loading={isLoading} />
                <StatCard title="Cost Mediu / Vehicul" value={fleetReportData.avgCostPerVehicle.toFixed(2)} suffix="RON" loading={isLoading} />
                <StatCard title="Preț Mediu / L" value={reportData.averageFuelPrice.toFixed(2)} suffix="RON" loading={isLoading} />
              </div>
            </CardContent>
          </Card>

          {/* Cost by Product Type */}
          <Card>
            <CardHeader>
              <CardTitle>Costuri pe Tip de Produs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tip Produs</TableHead>
                    <TableHead className="text-right">Tranzacții</TableHead>
                    <TableHead className="text-right">Cantitate (L)</TableHead>
                    <TableHead className="text-right">Cost Total (RON)</TableHead>
                    <TableHead className="text-right">% din Total</TableHead>
                    <TableHead className="text-right">Preț Mediu/L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fleetReportData.costByProductType.map((item) => (
                    <TableRow key={item.productType}>
                      <TableCell className="font-medium">{item.productType}</TableCell>
                      <TableCell className="text-right">{item.transactions}</TableCell>
                      <TableCell className="text-right">{item.quantity.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.totalCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.percentOfTotal.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{item.avgCostPerUnit.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top 20 Vehicles by Cost */}
          <Card>
            <CardHeader>
              <CardTitle>Top 20 Vehicule după Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Vehicul</TableHead>
                    <TableHead className="text-right">Tranzacții</TableHead>
                    <TableHead className="text-right">Cost Total (RON)</TableHead>
                    <TableHead className="text-right">Cantitate (L)</TableHead>
                    <TableHead>Combustibil Principal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fleetReportData.topVehiclesByCost.map((vehicle, index) => (
                    <TableRow key={vehicle.vehicleId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{vehicle.vehicleReg}</TableCell>
                      <TableCell className="text-right">{vehicle.transactions}</TableCell>
                      <TableCell className="text-right">{vehicle.totalCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{vehicle.totalQuantity.toFixed(2)}</TableCell>
                      <TableCell>{vehicle.primaryFuelType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Stations */}
          <Card>
            <CardHeader>
              <CardTitle>Top 15 Stații după Utilizare</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Stație</TableHead>
                    <TableHead className="text-right">Tranzacții</TableHead>
                    <TableHead className="text-right">Cost Total (RON)</TableHead>
                    <TableHead className="text-right">Cantitate (L)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fleetReportData.topStationsByUsage.map((station, index) => (
                    <TableRow key={station.stationId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{station.stationName}</TableCell>
                      <TableCell className="text-right">{station.transactions}</TableCell>
                      <TableCell className="text-right">{station.totalCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{station.totalQuantity.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Concluzii și Recomandări</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tipare de Consum</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Combustibil principal:</span> {fleetReportData.primaryFuel} ({fleetReportData.primaryFuelQuantity.toFixed(0)} L)</p>
                    <p><span className="font-medium">Media zilnică tranzacții:</span> {fleetReportData.avgDailyTransactions.toFixed(1)}</p>
                    <p><span className="font-medium">Cost zilnic mediu:</span> {fleetReportData.avgDailyCost.toFixed(2)} RON</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recomandări</h3>
                  <ul className="space-y-2 text-sm list-disc list-inside text-slate-700 dark:text-slate-300">
                    <li>Monitorizați vehiculele cu cel mai mare consum</li>
                    <li>Negociați tarife preferențiale cu stațiile frecvent utilizate</li>
                    <li>Analizați tranzacțiile în weekend pentru conformitate</li>
                    <li>Implementați limite de alimentare per vehicul</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Single Vehicle Report */
        <div className="space-y-6">
          {/* Vehicle Title */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-2">
                Analiză pentru {getSelectedVehicleName()}
              </h2>
              <p className="text-sm text-slate-500">
                Total tranzacții: {reportData.totalTransactions}
              </p>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                    <Fuel className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Combustibil Total</p>
                    <p className="text-2xl font-bold">{reportData.totalFuelVolume.toFixed(2)} L</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Cost Total</p>
                    <p className="text-2xl font-bold">{reportData.totalFuelCost.toFixed(2)} RON</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Preț Mediu</p>
                    <p className="text-2xl font-bold">{reportData.averageFuelPrice.toFixed(2)} RON/L</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Eficiență</p>
                    <p className="text-2xl font-bold">{reportData.efficiency.toFixed(2)} L/100km</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fuel by Month */}
            <Card>
              <CardHeader>
                <CardTitle>Consum Combustibil pe Lună</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.fuelByMonth.length > 0 ? (
                  <div className="space-y-3">
                    {reportData.fuelByMonth.map((item) => {
                      const maxValue = Math.max(...reportData.fuelByMonth.map(i => i.value));
                      return (
                        <div key={item.month}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{item.month}</span>
                            <span className="text-sm font-bold">{item.value.toFixed(2)} L</span>
                          </div>
                          <BarProgress value={item.value} max={maxValue} color="bg-blue-600" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-8">Nu există date</p>
                )}
              </CardContent>
            </Card>

            {/* Cost by Month */}
            <Card>
              <CardHeader>
                <CardTitle>Cost pe Lună</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.costByMonth.length > 0 ? (
                  <div className="space-y-3">
                    {reportData.costByMonth.map((item) => {
                      const maxValue = Math.max(...reportData.costByMonth.map(i => i.value));
                      return (
                        <div key={item.month}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{item.month}</span>
                            <span className="text-sm font-bold">{item.value.toFixed(2)} RON</span>
                          </div>
                          <BarProgress value={item.value} max={maxValue} color="bg-green-600" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-8">Nu există date</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Expensive Transactions */}
          {reportData.topExpensiveTransactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Tranzacții după Valoare</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Vehicul</TableHead>
                      <TableHead>Tip Combustibil</TableHead>
                      <TableHead className="text-right">Cantitate</TableHead>
                      <TableHead className="text-right">Valoare</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.topExpensiveTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.transactionDate).toLocaleDateString('ro-RO')}</TableCell>
                        <TableCell>{transaction.vehicle?.licensePlate || 'N/A'}</TableCell>
                        <TableCell>{transaction.fuelType?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right">{parseFloat(String(transaction.quantity)).toFixed(2)} L</TableCell>
                        <TableCell className="text-right font-medium">{parseFloat(String(transaction.totalCost)).toFixed(2)} RON</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* No Data */}
          {reportData.totalTransactions === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nu există tranzacții</h3>
                <p className="text-sm text-slate-500">
                  Nu au fost găsite tranzacții pentru vehiculul și perioada selectată.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
