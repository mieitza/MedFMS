'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Truck,
  Users,
  Fuel,
  Wrench,
  Package,
  BarChart3,
  Settings,
  ChevronRight,
  LogOut,
  User,
  FileText,
  ClipboardList,
  CheckSquare,
  Warehouse,
  ArrowLeftRight,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ChevronsUpDown,
  Bot,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  items?: {
    title: string;
    href: string;
  }[];
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Vehicule',
    href: '/vehicles',
    icon: Truck,
  },
  {
    title: 'Șoferi',
    href: '/drivers',
    icon: Users,
  },
  {
    title: 'Combustibil',
    href: '/fuel',
    icon: Fuel,
    items: [
      { title: 'Tranzacții', href: '/fuel' },
      { title: 'Import', href: '/fuel/import' },
      { title: 'Rapoarte', href: '/fuel/reports' },
    ],
  },
  {
    title: 'Mentenanță',
    href: '/maintenance',
    icon: Wrench,
    items: [
      { title: 'Lucrări', href: '/maintenance' },
      { title: 'Aprobări', href: '/maintenance/approvals' },
    ],
  },
  {
    title: 'Depozit',
    href: '/warehouse',
    icon: Package,
    items: [
      { title: 'Prezentare generală', href: '/warehouse' },
      { title: 'Depozite', href: '/warehouse/warehouses' },
      { title: 'Materiale', href: '/warehouse/materials' },
      { title: 'Transferuri', href: '/warehouse/transfers' },
      { title: 'Aprobări transferuri', href: '/warehouse/transfers/approvals' },
      { title: 'Rapoarte', href: '/warehouse/reports' },
    ],
  },
  {
    title: 'Rapoarte',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'Asistent AI',
    href: '/assistant',
    icon: Bot,
  },
];

const settingsNavItems: NavItem[] = [
  {
    title: 'Setări',
    href: '/settings',
    icon: Settings,
    items: [
      { title: 'Profil', href: '/settings/profile' },
      { title: 'Organizație', href: '/settings/organization' },
      { title: 'Administrare', href: '/settings/admin' },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800">
      {/* Header */}
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800"
              asChild
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Truck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MedFMS</span>
                  <span className="truncate text-xs text-slate-500">Fleet Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigare</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <NavMenuItem key={item.href} item={item} isActive={isActive} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistem</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <NavMenuItem key={item.href} item={item} isActive={isActive} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user menu */}
      <SidebarFooter className="border-t border-slate-200 dark:border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {user?.fullName ? getInitials(user.fullName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.fullName || 'Utilizator'}</span>
                    <span className="truncate text-xs text-slate-500">{user?.role || 'user'}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {user?.fullName ? getInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.fullName}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Setări
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Deconectare
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function NavMenuItem({
  item,
  isActive,
  pathname,
}: {
  item: NavItem;
  isActive: (href: string) => boolean;
  pathname: string;
}) {
  const hasSubItems = item.items && item.items.length > 0;

  if (!hasSubItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible asChild defaultOpen={isActive(item.href)} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive(item.href)}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.href}>
                <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                  <Link href={subItem.href}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
