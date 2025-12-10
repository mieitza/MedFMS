'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Package,
  TrendingUp,
  ArrowRightLeft,
  Clock,
  BarChart3,
} from 'lucide-react';

const reports = [
  {
    title: 'Raport Stocuri',
    description: 'Situația curentă a stocurilor în toate depozitele',
    href: '/warehouse/reports/stock',
    icon: Package,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
  },
  {
    title: 'Raport Prețuri',
    description: 'Evoluția prețurilor materialelor și analiza furnizorilor',
    href: '/warehouse/reports/pricing',
    icon: TrendingUp,
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600',
  },
  {
    title: 'Raport Transferuri',
    description: 'Istoricul și statisticile transferurilor între depozite',
    href: '/warehouse/reports/transfers',
    icon: ArrowRightLeft,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
  },
  {
    title: 'Raport Expirări',
    description: 'Materiale care expiră sau au expirat',
    href: '/warehouse/reports/expiration',
    icon: Clock,
    color: 'bg-red-100 dark:bg-red-900/30 text-red-600',
  },
  {
    title: 'Raport Utilizare',
    description: 'Analiza consumului de materiale pe categorii',
    href: '/warehouse/reports/usage',
    icon: BarChart3,
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
  },
];

export default function WarehouseReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/warehouse">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Înapoi la Depozit
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Rapoarte Depozit</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Rapoarte și analize pentru gestiunea depozitului
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link key={report.href} href={report.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${report.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
