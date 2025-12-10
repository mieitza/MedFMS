'use client';

import { useParams } from 'next/navigation';
import { MaintenanceForm } from '@/components/maintenance/maintenance-form';
import { useMaintenanceWorkOrder } from '@/lib/hooks';

export default function EditMaintenanceWorkOrderPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: workOrder, isLoading } = useMaintenanceWorkOrder(id);

  return <MaintenanceForm workOrder={workOrder} isLoading={isLoading} />;
}
