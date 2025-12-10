'use client';

import { useParams } from 'next/navigation';
import { DriverForm } from '@/components/drivers/driver-form';
import { useDriver } from '@/lib/hooks';

export default function EditDriverPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : null;
  const { data: driver, isLoading } = useDriver(id);

  return <DriverForm driver={driver} isLoading={isLoading} />;
}
