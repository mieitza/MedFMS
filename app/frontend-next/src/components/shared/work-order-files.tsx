'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Plus,
  ImageIcon,
  File,
  FileSpreadsheet,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi, EntityType, Document, Photo } from '@/lib/api/documents';

interface WorkOrderFilesProps {
  workOrderId: number | null;
  title?: string;
  description?: string;
  readOnly?: boolean;
}

type FileItem = (Document & { fileType: 'document' }) | (Photo & { fileType: 'photo' });

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv') return FileSpreadsheet;
  if (mimeType.includes('pdf')) return FileText;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function WorkOrderFiles({
  workOrderId,
  title = 'Fișiere comandă de lucru',
  description = 'Documente și fotografii atașate acestei comenzi de lucru',
  readOnly = false,
}: WorkOrderFilesProps) {
  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'document' | 'photo'>('document');
  const [deleteFile, setDeleteFile] = useState<FileItem | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const entityType: EntityType = 'maintenance_work_order';

  // Fetch documents
  const { data: documents, isLoading: isLoadingDocs } = useQuery({
    queryKey: ['documents', entityType, workOrderId],
    queryFn: () => documentsApi.getDocuments(entityType, workOrderId!),
    enabled: !!workOrderId,
  });

  // Fetch photos
  const { data: photos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ['photos', entityType, workOrderId],
    queryFn: () => documentsApi.getPhotos(entityType, workOrderId!),
    enabled: !!workOrderId,
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ file, data }: { file: File; data: { documentName: string; entityType: EntityType; entityId: number; description?: string } }) =>
      documentsApi.uploadDocument(file, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, workOrderId] });
      resetUploadForm();
    },
  });

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: ({ file, data }: { file: File; data: { photoName: string; entityType: EntityType; entityId: number; description?: string } }) =>
      documentsApi.uploadPhoto(file, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', entityType, workOrderId] });
      resetUploadForm();
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: (id: number) => documentsApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, workOrderId] });
      setDeleteFile(null);
    },
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: (id: number) => documentsApi.deletePhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', entityType, workOrderId] });
      setDeleteFile(null);
    },
  });

  const resetUploadForm = () => {
    setIsUploadOpen(false);
    setUploadFile(null);
    setUploadPreview(null);
    setFormData({ name: '', description: '' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadPreview(null);
      }

      if (!formData.name) {
        setFormData(prev => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !formData.name || !workOrderId) return;

    if (uploadType === 'document') {
      await uploadDocumentMutation.mutateAsync({
        file: uploadFile,
        data: {
          documentName: formData.name,
          entityType,
          entityId: workOrderId,
          description: formData.description || undefined,
        },
      });
    } else {
      await uploadPhotoMutation.mutateAsync({
        file: uploadFile,
        data: {
          photoName: formData.name,
          entityType,
          entityId: workOrderId,
          description: formData.description || undefined,
        },
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteFile) return;

    if (deleteFile.fileType === 'document') {
      await deleteDocumentMutation.mutateAsync(deleteFile.id);
    } else {
      await deletePhotoMutation.mutateAsync(deleteFile.id);
    }
  };

  const handleDownload = (file: FileItem) => {
    const url = file.fileType === 'document'
      ? documentsApi.getDownloadUrl(file.id)
      : documentsApi.getPhotoDownloadUrl(file.id);
    window.open(url, '_blank');
  };

  const openUploadDialog = (type: 'document' | 'photo') => {
    setUploadType(type);
    setIsUploadOpen(true);
  };

  const isLoading = isLoadingDocs || isLoadingPhotos;
  const allFiles: FileItem[] = [
    ...(documents || []).map(d => ({ ...d, fileType: 'document' as const })),
    ...(photos || []).map(p => ({ ...p, fileType: 'photo' as const })),
  ];

  const documentList = documents || [];
  const photoList = photos || [];

  if (!workOrderId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Încărcarea fișierelor va fi disponibilă după crearea comenzii de lucru
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Poți adăuga documente și fotografii după ce comanda de lucru este salvată.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {!readOnly && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => openUploadDialog('document')}>
                <Plus className="h-4 w-4 mr-2" />
                Document
              </Button>
              <Button onClick={() => openUploadDialog('photo')}>
                <Plus className="h-4 w-4 mr-2" />
                Fotografie
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : allFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold">Nu există fișiere</h3>
            <p className="text-sm text-slate-500">
              {readOnly
                ? 'Nu au fost încărcate fișiere pentru această comandă de lucru.'
                : 'Adaugă documente sau fotografii folosind butoanele de mai sus.'}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                Toate ({allFiles.length})
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-1" />
                Documente ({documentList.length})
              </TabsTrigger>
              <TabsTrigger value="photos">
                <ImageIcon className="h-4 w-4 mr-1" />
                Fotografii ({photoList.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <FileList
                files={allFiles}
                onDownload={handleDownload}
                onDelete={(file) => setDeleteFile(file)}
                readOnly={readOnly}
              />
            </TabsContent>

            <TabsContent value="documents">
              <FileList
                files={documentList.map(d => ({ ...d, fileType: 'document' as const }))}
                onDownload={handleDownload}
                onDelete={(file) => setDeleteFile(file)}
                readOnly={readOnly}
              />
            </TabsContent>

            <TabsContent value="photos">
              <FileList
                files={photoList.map(p => ({ ...p, fileType: 'photo' as const }))}
                onDownload={handleDownload}
                onDelete={(file) => setDeleteFile(file)}
                readOnly={readOnly}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Încarcă {uploadType === 'document' ? 'Document' : 'Fotografie'}
            </DialogTitle>
            <DialogDescription>
              Selectează un fișier și completează informațiile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Fișier</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept={uploadType === 'photo'
                  ? 'image/jpeg,image/png,image/gif,image/webp'
                  : '.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png,.gif'}
              />
              {uploadFile && (
                <p className="text-sm text-slate-500">
                  {uploadFile.name} ({formatFileSize(uploadFile.size)})
                </p>
              )}
              {uploadPreview && (
                <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border">
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nume *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={`Ex: ${uploadType === 'document' ? 'Deviz reparații' : 'Piesă defectă'}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upload-description">Descriere</Label>
              <Input
                id="upload-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descriere opțională..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetUploadForm}>
              Anulează
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadFile || !formData.name || uploadDocumentMutation.isPending || uploadPhotoMutation.isPending}
            >
              {(uploadDocumentMutation.isPending || uploadPhotoMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Upload className="mr-2 h-4 w-4" />
              Încarcă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteFile} onOpenChange={() => setDeleteFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Șterge fișierul</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi &quot;{deleteFile?.fileType === 'document'
                ? (deleteFile as Document).documentName
                : (deleteFile as Photo)?.photoName}&quot;? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {(deleteDocumentMutation.isPending || deletePhotoMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

// Helper component for file list
function FileList({
  files,
  onDownload,
  onDelete,
  readOnly
}: {
  files: FileItem[];
  onDownload: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  readOnly: boolean;
}) {
  if (files.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500">
        Nu există fișiere în această categorie.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => {
        const FileIcon = file.fileType === 'photo'
          ? ImageIcon
          : getFileIcon(file.mimeType);
        const fileName = file.fileType === 'document'
          ? (file as Document).documentName
          : (file as Photo).photoName;
        const originalName = file.fileType === 'document'
          ? (file as Document).originalFileName
          : (file as Photo).originalFileName;

        return (
          <div
            key={`${file.fileType}-${file.id}`}
            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700">
                <FileIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                  {fileName}
                </p>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Badge variant="outline" className="text-xs">
                    {file.fileType === 'photo' ? 'Fotografie' : 'Document'}
                  </Badge>
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span>
                    {format(new Date(file.createdAt), 'dd MMM yyyy', { locale: ro })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(file)}
                title="Descarcă"
              >
                <Download className="h-4 w-4" />
              </Button>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDelete(file)}
                  title="Șterge"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WorkOrderFiles;
