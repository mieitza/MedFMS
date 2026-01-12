import { redirect } from 'next/navigation';

export default function WarehouseTransfersPage() {
  redirect('/warehouse?tab=transfers');
}
