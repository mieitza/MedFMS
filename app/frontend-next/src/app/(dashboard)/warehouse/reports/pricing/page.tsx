'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
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
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  FileText,
} from 'lucide-react';
import { warehouseApi, type PricingReportResponse } from '@/lib/api/warehouse';

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

export default function PricingReportPage() {
  // Get default dates - last 6 months
  const getDefaultDates = () => {
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return {
      start: sixMonthsAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState<string>(defaultDates.start);
  const [endDate, setEndDate] = useState<string>(defaultDates.end);

  // Fetch pricing report
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['warehouse', 'reports', 'pricing', startDate, endDate],
    queryFn: () =>
      warehouseApi.getPricingReport({
        startDate,
        endDate,
      }),
    enabled: !!startDate && !!endDate,
  });

  const report = reportData as PricingReportResponse | undefined;

  // Export to CSV
  const exportToCSV = () => {
    if (!report?.data || report.data.length === 0) {
      alert('Nu există date pentru export');
      return;
    }

    const headers = [
      'Cod Material',
      'Denumire',
      'Preț Minim',
      'Preț Maxim',
      'Preț Mediu',
      'Variație',
    ];

    const rows = report.data.map((item) => [
      item.material.materialCode,
      item.material.materialName,
      item.statistics.min.toFixed(2),
      item.statistics.max.toFixed(2),
      item.statistics.avg.toFixed(2),
      item.statistics.variance.toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raport-preturi-${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1 className="text-3xl font-bold tracking-tight">Raport Prețuri</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Evoluția prețurilor materialelor și statistici
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
              <Label>Data început</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Data sfârșit</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Materiale Analizate"
          value={report?.summary.totalMaterials || 0}
          icon={Package}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
          loading={isLoading}
        />
        <StatCard
          title="Variație Medie Prețuri"
          value={report?.summary.averagePriceChange || 0}
          suffix="%"
          icon={report?.summary.averagePriceChange && report.summary.averagePriceChange > 0 ? TrendingUp : TrendingDown}
          color={report?.summary.averagePriceChange && report.summary.averagePriceChange > 0
            ? "bg-red-100 dark:bg-red-900/30 text-red-600"
            : "bg-green-100 dark:bg-green-900/30 text-green-600"}
          loading={isLoading}
        />
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Evoluția Prețurilor</CardTitle>
          <CardDescription>
            {report?.data?.length || 0} materiale cu istoric de prețuri
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
                Nu au fost găsite date de prețuri pentru perioada selectată.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cod Material</TableHead>
                    <TableHead>Denumire</TableHead>
                    <TableHead className="text-right">Preț Minim</TableHead>
                    <TableHead className="text-right">Preț Maxim</TableHead>
                    <TableHead className="text-right">Preț Mediu</TableHead>
                    <TableHead className="text-right">Variație</TableHead>
                    <TableHead className="text-right">Nr. Intrări</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.data.map((item) => (
                    <TableRow key={item.material.id}>
                      <TableCell className="font-medium">{item.material.materialCode}</TableCell>
                      <TableCell>{item.material.materialName}</TableCell>
                      <TableCell className="text-right">{item.statistics.min.toFixed(2)} RON</TableCell>
                      <TableCell className="text-right">{item.statistics.max.toFixed(2)} RON</TableCell>
                      <TableCell className="text-right font-medium">{item.statistics.avg.toFixed(2)} RON</TableCell>
                      <TableCell className="text-right">
                        <span className={item.statistics.variance > 10 ? 'text-red-600' : item.statistics.variance > 5 ? 'text-amber-600' : 'text-green-600'}>
                          {item.statistics.variance.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{item.priceHistory.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price History Details */}
      {report?.data && report.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalii Istoric Prețuri</CardTitle>
            <CardDescription>
              Ultimele modificări de prețuri pentru fiecare material
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {report.data.slice(0, 5).map((item) => (
                <div key={item.material.id} className="border-b pb-4 last:border-b-0">
                  <h4 className="font-medium mb-2">
                    {item.material.materialCode} - {item.material.materialName}
                  </h4>
                  {item.priceHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-slate-500">
                            <th className="text-left py-1">Data</th>
                            <th className="text-right py-1">Preț</th>
                            <th className="text-left py-1 pl-4">Furnizor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.priceHistory.slice(0, 5).map((entry, index) => (
                            <tr key={index}>
                              <td className="py-1">{new Date(entry.date).toLocaleDateString('ro-RO')}</td>
                              <td className="text-right py-1">{entry.price.toFixed(2)} RON</td>
                              <td className="py-1 pl-4">{entry.supplier}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Nu există istoric de prețuri</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
