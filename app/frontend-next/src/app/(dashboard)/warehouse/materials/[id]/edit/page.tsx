'use client';

import { useParams } from 'next/navigation';
import { MaterialForm } from '@/components/warehouse/material-form';
import { useMaterial } from '@/lib/hooks';

export default function EditMaterialPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : null;

  const { data: material, isLoading } = useMaterial(id);

  return <MaterialForm material={material} isLoading={isLoading} />;
}
