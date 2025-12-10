'use client';

import { useTheme } from 'next-themes';
import { useAppStore } from '@/lib/stores/app-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  Command,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/shared/language-switcher';

const pathNameMap: Record<string, string> = {
  '': 'Dashboard',
  'vehicles': 'Vehicule',
  'drivers': 'Șoferi',
  'fuel': 'Combustibil',
  'maintenance': 'Mentenanță',
  'warehouse': 'Depozit',
  'materials': 'Materiale',
  'transfers': 'Transferuri',
  'approvals': 'Aprobări',
  'reports': 'Rapoarte',
  'settings': 'Setări',
  'admin': 'Administrare',
  'profile': 'Profil',
  'import': 'Import',
  'new': 'Adăugare',
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { openCommandPalette } = useAppStore();

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    // Check if segment is a dynamic ID (number or UUID)
    const isId = /^\d+$/.test(segment) || /^[a-f0-9-]{36}$/i.test(segment);
    const label = isId ? `#${segment}` : pathNameMap[segment] || segment;

    return { href, label, isLast };
  });

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4">
      {/* Sidebar trigger */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumbs */}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={crumb.href}>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search / Command Palette trigger */}
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={openCommandPalette}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Căutare...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border border-slate-200 bg-slate-100 px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex dark:border-slate-700 dark:bg-slate-800">
          <Command className="h-3 w-3" />K
        </kbd>
      </Button>

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center"
        >
          3
        </Badge>
        <span className="sr-only">Notificări</span>
      </Button>

      {/* Theme toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Schimbă tema</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <Sun className="mr-2 h-4 w-4" />
            Luminos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <Moon className="mr-2 h-4 w-4" />
            Întunecat
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            <Monitor className="mr-2 h-4 w-4" />
            Sistem
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
