import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';
import { browser } from '$app/environment';

const defaultLocale = 'en';

// Register locales
register('en', () => import('./locales/en.json'));
register('ro', () => import('./locales/ro.json'));

// Initialize i18n
export function initializeI18n() {
  // Get stored locale or browser locale or default
  let initialLocale = defaultLocale;

  if (browser) {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale && ['en', 'ro'].includes(storedLocale)) {
      initialLocale = storedLocale;
    } else {
      const browserLocale = getLocaleFromNavigator();
      if (browserLocale?.startsWith('ro')) {
        initialLocale = 'ro';
      }
    }
  }

  init({
    fallbackLocale: defaultLocale,
    initialLocale,
  });
}

// Function to change locale
export function changeLocale(newLocale: string) {
  if (browser) {
    localStorage.setItem('locale', newLocale);
  }
  locale.set(newLocale);
}

// Export locale store for reactive use
export { locale, _ } from 'svelte-i18n';
