'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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
  ArrowRightLeft,
  CheckCircle,
  Clock,
  XCircle,
  Timer,
  FileText,
} from 'lucide-react';
import { warehouseApi, type TransfersReportResponse } from '@/lib/api/warehouse';

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

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'În așteptare', variant: 'secondary' },
  approved: { label: 'Aprobat', variant: 'outline' },
  completed: { label: 'Finalizat', variant: 'default' },
  cancelled: { label: 'Anulat', variant: 'destructive' },
  rejected: { label: 'Respins', variant: 'destructive' },
};

export default function TransfersReportPage() {
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
  const [startDate, setStartDate] = useState<string>(defaultDates.start);
  const [endDate, setEndDate] = useState<string>(defaultDates.end);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Fetch transfers report
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['warehouse', 'reports', 'transfers', startDate, endDate, selectedStatus],
    queryFn: () =>
      warehouseApi.getTransfersReport({
        startDate,
        endDate,
        ...(selectedStatus !== 'all' ? { status: selectedStatus } : {}),
      }),
    enabled: !!startDate && !!endDate,
  });

  const report = reportData as TransfersReportResponse | undefined;

  // Export to CSV
  const exportToCSV = () => {
    if (!report?.data || report.data.length === 0) {
      alert('Nu există date pentru export');
      return;
    }

    const headers = [
      'Număr Transfer',
      'Tip',
      'Status',
      'Depozit Sursă',
      'Depozit Destinație',
      'Nr. Articole',
      'Valoare Totală',
      'Data Creare',
      'Data Finalizare',
    ];

    const rows = report.data.map((item) => [
      item.transfer.transferNumber,
      item.transfer.transferType,
      statusConfig[item.transfer.status]?.label || item.transfer.status,
      item.sourceWarehouse?.warehouseName || 'N/A',
      item.destinationWarehouse?.warehouseName || 'N/A',
      item.itemCount,
      item.totalValue.toFixed(2),
      new Date(item.transfer.createdAt).toLocaleDateString('ro-RO'),
      item.transfer.completedAt ? new Date(item.transfer.completedAt).toLocaleDateString('ro-RO') : 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raport-transferuri-${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1 className="text-3xl font-bold tracking-tight">Raport Transferuri</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Istoricul și statisticile transferurilor între depozite
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate</SelectItem>
                  <SelectItem value="pending">În așteptare</SelectItem>
                  <SelectItem value="approved">Aprobat</SelectItem>
                  <SelectItem value="completed">Finalizat</SelectItem>
                  <SelectItem value="cancelled">Anulat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Transferuri"
          value={report?.summary.totalTransfers || 0}
          icon={ArrowRightLeft}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
          loading={isLoading}
        />
        <StatCard
          title="Finalizate"
          value={report?.summary.completed || 0}
          icon={CheckCircle}
          color="bg-green-100 dark:bg-green-900/30 text-green-600"
          loading={isLoading}
        />
        <StatCard
          title="În Așteptare"
          value={report?.summary.pending || 0}
          icon={Clock}
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600"
          loading={isLoading}
        />
        <StatCard
          title="Anulate"
          value={report?.summary.cancelled || 0}
          icon={XCircle}
          color="bg-red-100 dark:bg-red-900/30 text-red-600"
          loading={isLoading}
        />
        <StatCard
          title="Timp Mediu Finalizare"
          value={report?.summary.averageCompletionTime || 0}
          suffix="ore"
          icon={Timer}
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600"
          loading={isLoading}
        />
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Transferuri</CardTitle>
          <CardDescription>
            {report?.data?.length || 0} transferuri găsite
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
              <h3 className="text-lg font-medium mb-2">Nu există transferuri</h3>
              <p className="text-sm text-slate-500">
                Nu au fost găsite transferuri conform filtrelor selectate.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Număr Transfer</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sursă</TableHead>
                    <TableHead>Destinație</TableHead>
                    <TableHead className="text-right">Articole</TableHead>
                    <TableHead className="text-right">Valoare</TableHead>
                    <TableHead>Data Creare</TableHead>
                    <TableHead>Data Finalizare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.data.map((item) => {
                    const statusInfo = statusConfig[item.transfer.status] || { label: item.transfer.status, variant: 'outline' as const };
                    return (
                      <TableRow key={item.transfer.id}>
                        <TableCell className="font-medium">{item.transfer.transferNumber}</TableCell>
                        <TableCell>{item.transfer.transferType}</TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </TableCell>
                        <TableCell>{item.sourceWarehouse?.warehouseName || '-'}</TableCell>
                        <TableCell>{item.destinationWarehouse?.warehouseName || '-'}</TableCell>
                        <TableCell className="text-right">{item.itemCount}</TableCell>
                        <TableCell className="text-right">{item.totalValue.toFixed(2)} RON</TableCell>
                        <TableCell>{new Date(item.transfer.createdAt).toLocaleDateString('ro-RO')}</TableCell>
                        <TableCell>
                          {item.transfer.completedAt
                            ? new Date(item.transfer.completedAt).toLocaleDateString('ro-RO')
                            : '-'}
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
