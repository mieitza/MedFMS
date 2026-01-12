'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
  BarChart3,
  Package,
  DollarSign,
  Layers,
  FileText,
} from 'lucide-react';
import { warehouseApi, type UsageReportResponse } from '@/lib/api/warehouse';
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

// Generate month options for select
const getMonthOptions = () => {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      value: `${date.getFullYear()}-${date.getMonth() + 1}`,
      label: date.toLocaleDateString('ro-RO', { year: 'numeric', month: 'long' }),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
  }
  return options;
};

export default function UsageReportPage() {
  const monthOptions = getMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState<string>(monthOptions[0].value);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('all');

  // Get month and year from selected value
  const getMonthYear = () => {
    const option = monthOptions.find(o => o.value === selectedMonth);
    return option ? { month: option.month, year: option.year } : { month: new Date().getMonth() + 1, year: new Date().getFullYear() };
  };

  // Fetch warehouses
  const { data: warehouses = [] } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehouseApi.getWarehouses(),
  });

  // Fetch usage report
  const { month, year } = getMonthYear();
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['warehouse', 'reports', 'usage', selectedWarehouseId, month, year],
    queryFn: () =>
      warehouseApi.getUsageReport({
        ...(selectedWarehouseId !== 'all' ? { warehouseId: parseInt(selectedWarehouseId) } : {}),
        month,
        year,
      }),
  });

  const report = reportData as UsageReportResponse | undefined;

  // Export to CSV
  const exportToCSV = () => {
    if (!report?.data?.topUsedMaterials || report.data.topUsedMaterials.length === 0) {
      alert('Nu există date pentru export');
      return;
    }

    const headers = [
      'Cod Material',
      'Denumire',
      'Categorie',
      'Consum Total',
      'Valoare Totală',
      'Consum Mediu',
    ];

    const rows = report.data.topUsedMaterials.map((item) => [
      item.materialCode,
      item.materialName,
      item.category,
      item.totalConsumption.toFixed(2),
      item.totalValue.toFixed(2),
      item.averageConsumption.toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raport-utilizare-${year}-${month.toString().padStart(2, '0')}.csv`;
    link.click();
  };

  // Find max values for bar charts
  const maxCategoryConsumption = report?.data?.categoryBreakdown
    ? Math.max(...report.data.categoryBreakdown.map(c => c.totalConsumption))
    : 0;
  const maxMaterialConsumption = report?.data?.topUsedMaterials
    ? Math.max(...report.data.topUsedMaterials.map(m => m.totalConsumption))
    : 0;

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
          <h1 className="text-3xl font-bold tracking-tight">Raport Utilizare</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Analiza consumului de materiale pe categorii
          </p>
        </div>
        <Button
          variant="outline"
          onClick={exportToCSV}
          disabled={!report?.data?.topUsedMaterials || report.data.topUsedMaterials.length === 0}
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
              <Label>Luna</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează luna" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                      {warehouse.warehouseName || warehouse.name}
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
          title="Categorii Active"
          value={report?.summary?.totalCategories || 0}
          icon={Layers}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
          loading={isLoading}
        />
        <StatCard
          title="Materiale Utilizate"
          value={report?.summary?.totalMaterialsUsed || 0}
          icon={Package}
          color="bg-green-100 dark:bg-green-900/30 text-green-600"
          loading={isLoading}
        />
        <StatCard
          title="Consum Total"
          value={report?.summary?.totalConsumption || 0}
          suffix="unit."
          icon={BarChart3}
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600"
          loading={isLoading}
        />
        <StatCard
          title="Valoare Totală"
          value={report?.summary?.totalValue || 0}
          suffix="RON"
          icon={DollarSign}
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600"
          loading={isLoading}
        />
      </div>

      {/* Period Info */}
      {report?.summary?.period && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">
              Perioadă analizată: {new Date(report.summary.period.start).toLocaleDateString('ro-RO')} - {new Date(report.summary.period.end).toLocaleDateString('ro-RO')}
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : !report?.data ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nu există date</h3>
            <p className="text-sm text-slate-500">
              Nu au fost găsite date de utilizare pentru perioada selectată.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Consum pe Categorii</CardTitle>
              <CardDescription>
                Distribuția consumului pe categorii de materiale
              </CardDescription>
            </CardHeader>
            <CardContent>
              {report.data.categoryBreakdown && report.data.categoryBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {report.data.categoryBreakdown.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{category.category}</span>
                          <span className="text-sm text-slate-500 ml-2">
                            ({category.itemCount} articole)
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{category.totalConsumption.toFixed(2)}</span>
                          <span className="text-sm text-slate-500 ml-2">
                            ({category.percentOfTotal.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <BarProgress
                        value={category.totalConsumption}
                        max={maxCategoryConsumption}
                        color="bg-blue-600"
                      />
                      <div className="text-sm text-slate-500">
                        Valoare: {category.totalValue.toFixed(2)} RON
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">Nu există date pe categorii</p>
              )}
            </CardContent>
          </Card>

          {/* Top Used Materials */}
          <Card>
            <CardHeader>
              <CardTitle>Top Materiale Utilizate</CardTitle>
              <CardDescription>
                Materialele cu cel mai mare consum
              </CardDescription>
            </CardHeader>
            <CardContent>
              {report.data.topUsedMaterials && report.data.topUsedMaterials.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Cod Material</TableHead>
                        <TableHead>Denumire</TableHead>
                        <TableHead>Categorie</TableHead>
                        <TableHead className="text-right">Consum Total</TableHead>
                        <TableHead className="text-right">Valoare</TableHead>
                        <TableHead className="text-right">Consum Mediu</TableHead>
                        <TableHead className="w-32">Grafic</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.data.topUsedMaterials.map((item, index) => (
                        <TableRow key={item.materialCode}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.materialCode}</TableCell>
                          <TableCell>{item.materialName}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">{item.totalConsumption.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.totalValue.toFixed(2)} RON</TableCell>
                          <TableCell className="text-right">{item.averageConsumption.toFixed(2)}</TableCell>
                          <TableCell>
                            <BarProgress
                              value={item.totalConsumption}
                              max={maxMaterialConsumption}
                              color="bg-green-600"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">Nu există date de utilizare</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
