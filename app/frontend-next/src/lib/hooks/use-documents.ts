'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi, EntityType, DocumentUploadData, PhotoUploadData } from '@/lib/api/documents';
import { toast } from 'sonner';

// Query keys
export const documentKeys = {
  all: ['documents'] as const,
  categories: () => [...documentKeys.all, 'categories'] as const,
  documents: (entityType: EntityType, entityId: number) =>
    [...documentKeys.all, entityType, entityId] as const,
  photos: (entityType: EntityType, entityId: number) =>
    ['photos', entityType, entityId] as const,
};

// Document Categories
export function useDocumentCategories() {
  return useQuery({
    queryKey: documentKeys.categories(),
    queryFn: () => documentsApi.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Documents for an entity
export function useDocuments(entityType: EntityType, entityId: number | null) {
  return useQuery({
    queryKey: documentKeys.documents(entityType, entityId!),
    queryFn: () => documentsApi.getDocuments(entityType, entityId!),
    enabled: !!entityId,
  });
}

// Upload document
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, data }: { file: File; data: DocumentUploadData }) =>
      documentsApi.uploadDocument(file, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.documents(variables.data.entityType, variables.data.entityId)
      });
      toast.success('Documentul a fost încărcat cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la încărcarea documentului: ${error.message}`);
    },
  });
}

// Delete document
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, entityType, entityId }: { id: number; entityType: EntityType; entityId: number }) =>
      documentsApi.deleteDocument(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.documents(variables.entityType, variables.entityId)
      });
      toast.success('Documentul a fost șters');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea documentului: ${error.message}`);
    },
  });
}

// Photos for an entity
export function usePhotos(entityType: EntityType, entityId: number | null) {
  return useQuery({
    queryKey: documentKeys.photos(entityType, entityId!),
    queryFn: () => documentsApi.getPhotos(entityType, entityId!),
    enabled: !!entityId,
  });
}

// Upload photo
export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, data }: { file: File; data: PhotoUploadData }) =>
      documentsApi.uploadPhoto(file, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.photos(variables.data.entityType, variables.data.entityId)
      });
      toast.success('Fotografia a fost încărcată cu succes');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la încărcarea fotografiei: ${error.message}`);
    },
  });
}

// Delete photo
export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, entityType, entityId }: { id: number; entityType: EntityType; entityId: number }) =>
      documentsApi.deletePhoto(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.photos(variables.entityType, variables.entityId)
      });
      toast.success('Fotografia a fost ștearsă');
    },
    onError: (error: Error) => {
      toast.error(`Eroare la ștergerea fotografiei: ${error.message}`);
    },
  });
}
