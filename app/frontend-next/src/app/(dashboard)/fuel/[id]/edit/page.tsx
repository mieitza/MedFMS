'use client';

import { useParams } from 'next/navigation';
import { FuelForm } from '@/components/fuel/fuel-form';
import { useFuelTransaction } from '@/lib/hooks';

export default function EditFuelTransactionPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: transaction, isLoading } = useFuelTransaction(id);

  return <FuelForm transaction={transaction} isLoading={isLoading} />;
}
