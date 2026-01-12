import { redirect } from 'next/navigation';

export default function SettingsOrganizationPage() {
  redirect('/settings?tab=organization');
}
