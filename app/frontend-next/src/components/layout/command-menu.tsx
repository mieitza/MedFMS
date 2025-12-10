'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useAppStore } from '@/lib/stores/app-store';
import {
  LayoutDashboard,
  Truck,
  Users,
  Fuel,
  Wrench,
  Package,
  BarChart3,
  Settings,
  Plus,
  Search,
  FileText,
  Moon,
  Sun,
  LogOut,
  User,
  Calculator,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/lib/stores/auth-store';

interface CommandItemData {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  action: () => void;
  keywords?: string[];
}

export function CommandMenu() {
  const router = useRouter();
  const { commandPaletteOpen, closeCommandPalette, toggleCommandPalette } = useAppStore();
  const { setTheme, theme } = useTheme();
  const { logout } = useAuthStore();

  // Keyboard shortcut to open command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleCommandPalette]);

  const runCommand = useCallback(
    (command: () => void) => {
      closeCommandPalette();
      command();
    },
    [closeCommandPalette]
  );

  const navigationItems: CommandItemData[] = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      action: () => router.push('/'),
      keywords: ['home', 'acasa', 'principal'],
    },
    {
      icon: Truck,
      label: 'Vehicule',
      action: () => router.push('/vehicles'),
      keywords: ['masini', 'ambulante', 'flota'],
    },
    {
      icon: Users,
      label: 'Șoferi',
      action: () => router.push('/drivers'),
      keywords: ['conducatori', 'angajati', 'personal'],
    },
    {
      icon: Fuel,
      label: 'Combustibil',
      action: () => router.push('/fuel'),
      keywords: ['benzina', 'motorina', 'alimentare', 'carburant'],
    },
    {
      icon: Wrench,
      label: 'Mentenanță',
      action: () => router.push('/maintenance'),
      keywords: ['reparatii', 'service', 'intretinere', 'lucrari'],
    },
    {
      icon: Package,
      label: 'Depozit / Materiale',
      action: () => router.push('/warehouse/materials'),
      keywords: ['stoc', 'inventar', 'piese', 'consumabile'],
    },
    {
      icon: BarChart3,
      label: 'Rapoarte',
      action: () => router.push('/reports'),
      keywords: ['statistici', 'grafice', 'analiza'],
    },
    {
      icon: Settings,
      label: 'Setări',
      action: () => router.push('/settings'),
      keywords: ['configurare', 'optiuni', 'preferinte'],
    },
  ];

  const quickActions: CommandItemData[] = [
    {
      icon: Plus,
      label: 'Adaugă vehicul nou',
      shortcut: '⌘N V',
      action: () => router.push('/vehicles/new'),
      keywords: ['creare', 'inregistrare'],
    },
    {
      icon: Plus,
      label: 'Adaugă șofer nou',
      shortcut: '⌘N D',
      action: () => router.push('/drivers/new'),
      keywords: ['creare', 'angajare'],
    },
    {
      icon: Fuel,
      label: 'Adaugă alimentare',
      shortcut: '⌘N F',
      action: () => router.push('/fuel?action=new'),
      keywords: ['inregistrare', 'consum'],
    },
    {
      icon: Wrench,
      label: 'Crează comandă de lucru',
      shortcut: '⌘N W',
      action: () => router.push('/maintenance?action=new'),
      keywords: ['reparatie', 'service'],
    },
    {
      icon: FileText,
      label: 'Import combustibil (Excel)',
      action: () => router.push('/fuel/import'),
      keywords: ['incarcare', 'fisier', 'csv'],
    },
  ];

  const themeActions: CommandItemData[] = [
    {
      icon: Sun,
      label: 'Temă luminoasă',
      action: () => setTheme('light'),
      keywords: ['light', 'alba', 'zi'],
    },
    {
      icon: Moon,
      label: 'Temă întunecată',
      action: () => setTheme('dark'),
      keywords: ['dark', 'neagra', 'noapte'],
    },
  ];

  const accountActions: CommandItemData[] = [
    {
      icon: User,
      label: 'Profil utilizator',
      action: () => router.push('/settings/profile'),
      keywords: ['cont', 'date'],
    },
    {
      icon: LogOut,
      label: 'Deconectare',
      action: () => logout(),
      keywords: ['iesire', 'logout'],
    },
  ];

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={closeCommandPalette}>
      <CommandInput placeholder="Caută comenzi, pagini, acțiuni..." />
      <CommandList>
        <CommandEmpty>Nu am găsit rezultate.</CommandEmpty>

        <CommandGroup heading="Acțiuni rapide">
          {quickActions.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => runCommand(item.action)}
              keywords={item.keywords}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigare">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => runCommand(item.action)}
              keywords={item.keywords}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Aspect">
          {themeActions.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => runCommand(item.action)}
              keywords={item.keywords}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Cont">
          {accountActions.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => runCommand(item.action)}
              keywords={item.keywords}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
