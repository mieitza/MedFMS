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
  Users,
  Fuel,
  DollarSign,
  FileText,
} from 'lucide-react';
import { fuelApi, vehiclesApi } from '@/lib/api';
import type { FuelTransaction, Vehicle } from '@/types';

function StatCard({
  title,
  value,
  suffix = '',
  icon: Icon,
  color,
  loading = false,
}: {
  title: string;
  value: string | number;
  suffix?: string;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
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
      </CardContent>
    </Card>
  );
}

export default function SundayFuelingReportPage() {
  // Get default dates - last 3 months
  const getDefaultDates = () => {
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return {
      start: threeMonthsAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('_all');
  const [customStartDate, setCustomStartDate] = useState<string>(defaultDates.start);
  const [customEndDate, setCustomEndDate] = useState<string>(defaultDates.end);

  // Fetch vehicles
  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles', 'all'],
    queryFn: () => vehiclesApi.getAll({ pageSize: 1000 }),
  });

  const vehicles = vehiclesData?.data || [];

  // Fetch fuel transactions
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['fuel', 'transactions', 'sunday', customStartDate, customEndDate],
    queryFn: () =>
      fuelApi.getAll({
        dateFrom: customStartDate,
        dateTo: customEndDate,
        pageSize: 10000,
      }),
    enabled: !!customStartDate && !!customEndDate,
  });

  // Filter for Sunday transactions
  const sundayTransactions = useMemo(() => {
    const allTransactions = transactionsData?.data || [];
    return allTransactions.filter((transaction: FuelTransaction) => {
      const date = new Date(transaction.transactionDate);
      return date.getDay() === 0; // 0 = Sunday
    });
  }, [transactionsData]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    return sundayTransactions.filter((transaction: FuelTransaction) => {
      // Vehicle filter
      if (selectedVehicleId !== 'all' && transaction.vehicleId !== parseInt(selectedVehicleId)) {
        return false;
      }

      // Month filter
      if (selectedMonth && selectedMonth !== '_all') {
        const transactionMonth = new Date(transaction.transactionDate).toISOString().substring(0, 7);
        if (transactionMonth !== selectedMonth) {
          return false;
        }
      }

      return true;
    });
  }, [sundayTransactions, selectedVehicleId, selectedMonth]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      totalTransactions: filteredTransactions.length,
      uniqueVehicles: new Set(filteredTransactions.map((t: FuelTransaction) => t.vehicleId)).size,
      totalFuelVolume: filteredTransactions.reduce((sum: number, t: FuelTransaction) => sum + (parseFloat(String(t.quantity)) || 0), 0),
      totalFuelCost: filteredTransactions.reduce((sum: number, t: FuelTransaction) => sum + (parseFloat(String(t.totalCost)) || 0), 0),
    };
  }, [filteredTransactions]);

  // Get unique months for filter
  const uniqueMonths = useMemo(() => {
    return [...new Set(
      sundayTransactions.map((t: FuelTransaction) => new Date(t.transactionDate).toISOString().substring(0, 7))
    )].sort().reverse();
  }, [sundayTransactions]);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      alert('Nu există date pentru export');
      return;
    }

    const headers = [
      'Data',
      'Vehicul',
      'Cod Vehicul',
      'Șofer',
      'Stație',
      'Tip Combustibil',
      'Cantitate (L)',
      'Preț Total (RON)',
      'KM',
    ];

    const rows = filteredTransactions.map((t: FuelTransaction) => {
      const date = new Date(t.transactionDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

      return [
        formattedDate,
        t.vehicle?.licensePlate || 'N/A',
        t.vehicle?.vehicleCode || 'N/A',
        t.driver ? `${t.driver.firstName} ${t.driver.lastName}` : 'N/A',
        t.fuelStation?.name || 'N/A',
        t.fuelType?.name || 'N/A',
        parseFloat(String(t.quantity) || '0').toFixed(2),
        parseFloat(String(t.totalCost) || '0').toFixed(2),
        t.odometer || 'N/A',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row: (string | number)[]) => row.map((cell: string | number) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `alimentari-duminica-${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1 className="text-3xl font-bold tracking-tight">Alimentări Duminică</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Raport cu toate alimentările efectuate în zilele de duminică
          </p>
        </div>
        <Button
          variant="outline"
          onClick={exportToCSV}
          disabled={filteredTransactions.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <div className="space-y-2">
              <Label>Vehicul</Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează vehiculul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate vehiculele</SelectItem>
                  {vehicles.map((vehicle: Vehicle) => (
                    <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                      {vehicle.licensePlate} - {vehicle.vehicleCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Luna</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Toate lunile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Toate lunile</SelectItem>
                  {uniqueMonths.map((month: string) => (
                    <SelectItem key={month} value={month}>
                      {new Date(month + '-01').toLocaleDateString('ro-RO', { year: 'numeric', month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Tranzacții"
          value={stats.totalTransactions}
          icon={Calendar}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
          loading={isLoading}
        />
        <StatCard
          title="Vehicule Unice"
          value={stats.uniqueVehicles}
          icon={Car}
          color="bg-green-100 dark:bg-green-900/30 text-green-600"
          loading={isLoading}
        />
        <StatCard
          title="Combustibil Total"
          value={stats.totalFuelVolume.toFixed(2)}
          suffix="L"
          icon={Fuel}
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600"
          loading={isLoading}
        />
        <StatCard
          title="Cost Total"
          value={stats.totalFuelCost.toFixed(2)}
          suffix="RON"
          icon={DollarSign}
          color="bg-red-100 dark:bg-red-900/30 text-red-600"
          loading={isLoading}
        />
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tranzacții Duminică</CardTitle>
          <CardDescription>
            {filteredTransactions.length} alimentări găsite
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nu există alimentări duminică</h3>
              <p className="text-sm text-slate-500">
                Nu au fost găsite tranzacții pentru zilele de duminică în perioada selectată.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Vehicul</TableHead>
                    <TableHead>Cod Vehicul</TableHead>
                    <TableHead>Șofer</TableHead>
                    <TableHead>Stație</TableHead>
                    <TableHead>Tip Combustibil</TableHead>
                    <TableHead className="text-right">Cantitate</TableHead>
                    <TableHead className="text-right">Valoare</TableHead>
                    <TableHead className="text-right">KM</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction: FuelTransaction) => {
                    const date = new Date(transaction.transactionDate);
                    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{formattedDate}</TableCell>
                        <TableCell>{transaction.vehicle?.licensePlate || 'N/A'}</TableCell>
                        <TableCell>{transaction.vehicle?.vehicleCode || 'N/A'}</TableCell>
                        <TableCell>{transaction.driver ? `${transaction.driver.firstName} ${transaction.driver.lastName}` : 'N/A'}</TableCell>
                        <TableCell>{transaction.fuelStation?.name || 'N/A'}</TableCell>
                        <TableCell>{transaction.fuelType?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right">{parseFloat(String(transaction.quantity) || '0').toFixed(2)} L</TableCell>
                        <TableCell className="text-right">{parseFloat(String(transaction.totalCost) || '0').toFixed(2)} RON</TableCell>
                        <TableCell className="text-right">
                          {transaction.odometer ? `${parseInt(String(transaction.odometer)).toLocaleString()} km` : 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
