'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

type Locale = 'ro' | 'en';

const localeLabels: Record<Locale, string> = {
  ro: 'Română',
  en: 'English',
};

const localeFlags: Record<Locale, string> = {
  ro: '🇷🇴',
  en: '🇬🇧',
};

export function LanguageSwitcher() {
  // Use lazy initialization to avoid useEffect for localStorage read
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'ro';
    const saved = localStorage.getItem('locale') as Locale;
    return saved && (saved === 'ro' || saved === 'en') ? saved : 'ro';
  });

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    // In a real i18n setup, this would trigger translation changes
    // For now, we just store the preference
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <span className="mr-1">{localeFlags[locale]}</span>
          <span className="hidden sm:inline">{locale.toUpperCase()}</span>
          <Languages className="ml-1 h-4 w-4 sm:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLocale('ro')}
          className={locale === 'ro' ? 'bg-slate-100 dark:bg-slate-800' : ''}
        >
          <span className="mr-2">{localeFlags.ro}</span>
          {localeLabels.ro}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLocale('en')}
          className={locale === 'en' ? 'bg-slate-100 dark:bg-slate-800' : ''}
        >
          <span className="mr-2">{localeFlags.en}</span>
          {localeLabels.en}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
