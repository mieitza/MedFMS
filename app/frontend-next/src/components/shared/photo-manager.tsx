'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  ImageIcon,
  Upload,
  Download,
  Trash2,
  Plus,
  Star,
  Loader2,
  X,
  ZoomIn,
} from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import {
  usePhotos,
  useUploadPhoto,
  useDeletePhoto,
} from '@/lib/hooks/use-documents';
import { documentsApi, EntityType, Photo } from '@/lib/api/documents';

interface PhotoManagerProps {
  entityType: EntityType;
  entityId: number;
  title?: string;
  description?: string;
  readOnly?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PhotoManager({
  entityType,
  entityId,
  title = 'Fotografii',
  description = 'Gestionează fotografiile',
  readOnly = false,
}: PhotoManagerProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    photoName: '',
    description: '',
    isPrimary: false,
  });

  const { data: photos, isLoading } = usePhotos(entityType, entityId);
  const uploadMutation = useUploadPhoto();
  const deleteMutation = useDeletePhoto();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate it's an image
      if (!file.type.startsWith('image/')) {
        return;
      }
      setUploadFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      if (!formData.photoName) {
        setFormData(prev => ({ ...prev, photoName: file.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  }, [formData.photoName]);

  const handleUpload = async () => {
    if (!uploadFile || !formData.photoName) return;

    await uploadMutation.mutateAsync({
      file: uploadFile,
      data: {
        photoName: formData.photoName,
        entityType,
        entityId,
        description: formData.description || undefined,
        isPrimary: formData.isPrimary,
      },
    });

    setIsUploadOpen(false);
    setUploadFile(null);
    setUploadPreview(null);
    setFormData({
      photoName: '',
      description: '',
      isPrimary: false,
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync({ id: deleteId, entityType, entityId });
    setDeleteId(null);
  };

  const handleDownload = (photo: Photo) => {
    const url = documentsApi.getPhotoDownloadUrl(photo.id);
    window.open(url, '_blank');
  };

  const primaryPhoto = photos?.find(p => p.isPrimary);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {!readOnly && (
            <Button onClick={() => setIsUploadOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă Fotografie
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : !photos || photos.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold">Nu există fotografii</h3>
            <p className="text-sm text-slate-500">
              {readOnly
                ? 'Nu au fost încărcate fotografii.'
                : 'Adaugă prima fotografie folosind butonul de mai sus.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-lg overflow-hidden border bg-slate-100 dark:bg-slate-800"
              >
                {/* Photo thumbnail */}
                <Image
                  src={documentsApi.getPhotoUrl(photo.id)}
                  alt={photo.photoName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Primary badge */}
                {photo.isPrimary && (
                  <Badge className="absolute top-2 left-2 gap-1 bg-yellow-500">
                    <Star className="h-3 w-3" />
                    Principal
                  </Badge>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPreviewPhoto(photo)}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(photo)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {!readOnly && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Photo info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-xs text-white font-medium truncate">{photo.photoName}</p>
                  <p className="text-xs text-white/70">{formatFileSize(photo.fileSize)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photo count and primary info */}
        {photos && photos.length > 0 && (
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <span>{photos.length} fotografi{photos.length === 1 ? 'e' : 'i'}</span>
            {primaryPhoto && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                {primaryPhoto.photoName}
              </span>
            )}
          </div>
        )}
      </CardContent>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Încarcă Fotografie</DialogTitle>
            <DialogDescription>
              Selectează o imagine și completează informațiile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="photo-file">Imagine</Label>
              <Input
                id="photo-file"
                type="file"
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/gif,image/webp"
              />
              {uploadPreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border mt-2">
                  <Image
                    src={uploadPreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setUploadFile(null);
                      setUploadPreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoName">Nume fotografie *</Label>
              <Input
                id="photoName"
                value={formData.photoName}
                onChange={(e) => setFormData(prev => ({ ...prev, photoName: e.target.value }))}
                placeholder="Ex: Față vehicul"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo-description">Descriere</Label>
              <Input
                id="photo-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descriere opțională..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrimary"
                checked={formData.isPrimary}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, isPrimary: checked === true }))
                }
              />
              <Label htmlFor="isPrimary" className="text-sm font-normal">
                Setează ca fotografie principală
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Anulează
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadFile || !formData.photoName || uploadMutation.isPending}
            >
              {uploadMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Upload className="mr-2 h-4 w-4" />
              Încarcă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewPhoto?.photoName}</DialogTitle>
            {previewPhoto?.description && (
              <DialogDescription>{previewPhoto.description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            {previewPhoto && (
              <Image
                src={documentsApi.getPhotoUrl(previewPhoto.id)}
                alt={previewPhoto.photoName}
                fill
                className="object-contain"
              />
            )}
          </div>
          {previewPhoto && (
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>
                {format(new Date(previewPhoto.createdAt), 'dd MMMM yyyy, HH:mm', { locale: ro })}
              </span>
              <span>{formatFileSize(previewPhoto.fileSize)}</span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Șterge fotografia</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi această fotografie? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default PhotoManager;
