import { redirect } from 'next/navigation';

export default function SettingsAdminPage() {
  redirect('/settings?tab=admin');
}
