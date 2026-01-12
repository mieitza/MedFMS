import { api } from './client';

export type EntityType = 'vehicle' | 'driver' | 'user' | 'maintenance_work_order' | 'incident';

export interface Document {
  id: number;
  documentName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  categoryId: number | null;
  categoryName: string | null;
  description: string | null;
  expiryDate: string | null;
  isPublic: boolean;
  createdAt: string;
}

export interface Photo {
  id: number;
  photoName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  description: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface DocumentCategory {
  id: number;
  categoryName: string;
  description: string | null;
  active: boolean;
}

export interface DocumentUploadData {
  documentName: string;
  entityType: EntityType;
  entityId: number;
  categoryId?: number;
  description?: string;
  expiryDate?: string;
  isPublic?: boolean;
}

export interface PhotoUploadData {
  photoName: string;
  entityType: EntityType;
  entityId: number;
  description?: string;
  isPrimary?: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const documentsApi = {
  // Get document categories
  getCategories: async (): Promise<DocumentCategory[]> => {
    return api.get<DocumentCategory[]>('/documents/categories');
  },

  // Get documents for an entity
  getDocuments: async (entityType: EntityType, entityId: number): Promise<Document[]> => {
    return api.get<Document[]>(`/documents/${entityType}/${entityId}`);
  },

  // Upload document
  uploadDocument: async (file: File, data: DocumentUploadData): Promise<Document> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentName', data.documentName);
    formData.append('entityType', data.entityType);
    formData.append('entityId', String(data.entityId));
    if (data.categoryId) formData.append('categoryId', String(data.categoryId));
    if (data.description) formData.append('description', data.description);
    if (data.expiryDate) formData.append('expiryDate', data.expiryDate);
    if (data.isPublic !== undefined) formData.append('isPublic', String(data.isPublic));

    return api.upload<Document>('/documents/upload', formData);
  },

  // Delete document
  deleteDocument: async (id: number): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },

  // Get document download URL
  getDownloadUrl: (id: number): string => {
    const token = api.getToken();
    return `${API_BASE}/documents/download/${id}${token ? `?token=${token}` : ''}`;
  },

  // Get photos for an entity
  getPhotos: async (entityType: EntityType, entityId: number): Promise<Photo[]> => {
    return api.get<Photo[]>(`/documents/photos/${entityType}/${entityId}`);
  },

  // Upload photo
  uploadPhoto: async (file: File, data: PhotoUploadData): Promise<Photo> => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('photoName', data.photoName);
    formData.append('entityType', data.entityType);
    formData.append('entityId', String(data.entityId));
    if (data.description) formData.append('description', data.description);
    if (data.isPrimary !== undefined) formData.append('isPrimary', String(data.isPrimary));

    return api.upload<Photo>('/documents/photos/upload', formData);
  },

  // Delete photo
  deletePhoto: async (id: number): Promise<void> => {
    await api.delete(`/documents/photos/${id}`);
  },

  // Get photo view URL
  getPhotoUrl: (id: number): string => {
    return `${API_BASE}/documents/photos/view/${id}`;
  },

  // Get photo download URL
  getPhotoDownloadUrl: (id: number): string => {
    const token = api.getToken();
    return `${API_BASE}/documents/photos/download/${id}${token ? `?token=${token}` : ''}`;
  },
};

export default documentsApi;
