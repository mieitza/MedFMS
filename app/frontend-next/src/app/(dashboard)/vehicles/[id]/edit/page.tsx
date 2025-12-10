'use client';

import { useParams } from 'next/navigation';
import { VehicleForm } from '@/components/vehicles/vehicle-form';
import { useVehicle } from '@/lib/hooks';

export default function EditVehiclePage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : null;
  const { data: vehicle, isLoading } = useVehicle(id);

  return <VehicleForm vehicle={vehicle} isLoading={isLoading} />;
}
