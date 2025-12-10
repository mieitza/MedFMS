'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
  ArrowLeft,
  Download,
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  FileText,
} from 'lucide-react';
import { warehouseApi, type StockReportResponse } from '@/lib/api/warehouse';
import type { Warehouse } from '@/types';

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

export default function StockReportPage() {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Fetch warehouses
  const { data: warehouses = [] } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehouseApi.getWarehouses(),
  });

  // Fetch stock report
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['warehouse', 'reports', 'stock', selectedWarehouseId, lowStockOnly],
    queryFn: () =>
      warehouseApi.getStockReport({
        ...(selectedWarehouseId !== 'all' ? { warehouseId: parseInt(selectedWarehouseId) } : {}),
        lowStockOnly,
      }),
  });

  const report = reportData as StockReportResponse | undefined;

  // Export to CSV
  const exportToCSV = () => {
    if (!report?.data || report.data.length === 0) {
      alert('Nu există date pentru export');
      return;
    }

    const headers = [
      'Cod Material',
      'Denumire',
      'Depozit',
      'Unitate',
      'Stoc Curent',
      'Nivel Critic',
      'Preț Standard',
      'Valoare',
    ];

    const rows = report.data.map((item) => [
      item.material.materialCode,
      item.material.materialName,
      item.warehouse?.warehouseName || 'N/A',
      item.unit?.abbreviation || 'N/A',
      item.material.currentStock,
      item.material.criticalLevel || 'N/A',
      item.material.standardPrice || 'N/A',
      (item.material.currentStock * (item.material.standardPrice || 0)).toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raport-stocuri-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/warehouse/reports">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Înapoi la Rapoarte
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Raport Stocuri</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Situația curentă a stocurilor în depozite
          </p>
        </div>
        <Button
          variant="outline"
          onClick={exportToCSV}
          disabled={!report?.data || report.data.length === 0}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Depozit</Label>
              <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează depozitul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate depozitele</SelectItem>
                  {warehouses.map((warehouse: Warehouse) => (
                    <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="lowStock"
                checked={lowStockOnly}
                onCheckedChange={(checked) => setLowStockOnly(checked === true)}
              />
              <Label htmlFor="lowStock" className="cursor-pointer">
                Doar stocuri sub nivel critic
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Articole"
          value={report?.summary.totalItems || 0}
          icon={Package}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
          loading={isLoading}
        />
        <StatCard
          title="Stoc Scăzut"
          value={report?.summary.lowStockItems || 0}
          icon={AlertTriangle}
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600"
          loading={isLoading}
        />
        <StatCard
          title="Fără Stoc"
          value={report?.summary.outOfStockItems || 0}
          icon={XCircle}
          color="bg-red-100 dark:bg-red-900/30 text-red-600"
          loading={isLoading}
        />
        <StatCard
          title="Valoare Totală"
          value={report?.summary.totalValue || 0}
          suffix="RON"
          icon={DollarSign}
          color="bg-green-100 dark:bg-green-900/30 text-green-600"
          loading={isLoading}
        />
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Situația Stocurilor</CardTitle>
          <CardDescription>
            {report?.data?.length || 0} materiale găsite
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !report?.data || report.data.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nu există date</h3>
              <p className="text-sm text-slate-500">
                Nu au fost găsite materiale conform filtrelor selectate.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cod Material</TableHead>
                    <TableHead>Denumire</TableHead>
                    <TableHead>Depozit</TableHead>
                    <TableHead>Unitate</TableHead>
                    <TableHead className="text-right">Stoc Curent</TableHead>
                    <TableHead className="text-right">Nivel Critic</TableHead>
                    <TableHead className="text-right">Preț Standard</TableHead>
                    <TableHead className="text-right">Valoare</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.data.map((item) => {
                    const value = item.material.currentStock * (item.material.standardPrice || 0);
                    const isLowStock = item.material.criticalLevel !== null && item.material.currentStock <= item.material.criticalLevel;
                    const isOutOfStock = item.material.currentStock === 0;

                    return (
                      <TableRow key={item.material.id}>
                        <TableCell className="font-medium">{item.material.materialCode}</TableCell>
                        <TableCell>{item.material.materialName}</TableCell>
                        <TableCell>{item.warehouse?.warehouseName || 'N/A'}</TableCell>
                        <TableCell>{item.unit?.abbreviation || 'N/A'}</TableCell>
                        <TableCell className="text-right">{item.material.currentStock}</TableCell>
                        <TableCell className="text-right">{item.material.criticalLevel ?? '-'}</TableCell>
                        <TableCell className="text-right">
                          {item.material.standardPrice ? `${item.material.standardPrice.toFixed(2)} RON` : '-'}
                        </TableCell>
                        <TableCell className="text-right">{value.toFixed(2)} RON</TableCell>
                        <TableCell>
                          {isOutOfStock ? (
                            <Badge variant="destructive">Fără stoc</Badge>
                          ) : isLowStock ? (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">Stoc scăzut</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">OK</Badge>
                          )}
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
