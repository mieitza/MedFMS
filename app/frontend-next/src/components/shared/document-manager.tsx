'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  FileText,
  Upload,
  Download,
  Trash2,
  Plus,
  Calendar,
  AlertTriangle,
  FileSpreadsheet,
  FileImage,
  File,
  Loader2,
} from 'lucide-react';
import { format, differenceInDays, isPast, parseISO } from 'date-fns';
import { ro } from 'date-fns/locale';
import {
  useDocuments,
  useDocumentCategories,
  useUploadDocument,
  useDeleteDocument,
} from '@/lib/hooks/use-documents';
import { documentsApi, EntityType, Document } from '@/lib/api/documents';

interface DocumentManagerProps {
  entityType: EntityType;
  entityId: number;
  title?: string;
  description?: string;
  readOnly?: boolean;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return FileImage;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv') return FileSpreadsheet;
  if (mimeType.includes('pdf')) return FileText;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExpiryStatus(expiryDate: string | null): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } | null {
  if (!expiryDate) return null;

  const expiry = parseISO(expiryDate);
  const daysUntilExpiry = differenceInDays(expiry, new Date());

  if (isPast(expiry)) {
    return { label: 'Expirat', variant: 'destructive' };
  }
  if (daysUntilExpiry <= 30) {
    return { label: `Expiră în ${daysUntilExpiry} zile`, variant: 'secondary' };
  }
  return { label: format(expiry, 'dd MMM yyyy', { locale: ro }), variant: 'outline' };
}

export function DocumentManager({
  entityType,
  entityId,
  title = 'Documente',
  description = 'Gestionează documentele',
  readOnly = false,
}: DocumentManagerProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    documentName: '',
    categoryId: '',
    description: '',
    expiryDate: '',
    isPublic: false,
  });

  const { data: documents, isLoading } = useDocuments(entityType, entityId);
  const { data: categories } = useDocumentCategories();
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!formData.documentName) {
        setFormData(prev => ({ ...prev, documentName: file.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  }, [formData.documentName]);

  const handleUpload = async () => {
    if (!uploadFile || !formData.documentName) return;

    await uploadMutation.mutateAsync({
      file: uploadFile,
      data: {
        documentName: formData.documentName,
        entityType,
        entityId,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        description: formData.description || undefined,
        expiryDate: formData.expiryDate || undefined,
        isPublic: formData.isPublic,
      },
    });

    setIsUploadOpen(false);
    setUploadFile(null);
    setFormData({
      documentName: '',
      categoryId: '',
      description: '',
      expiryDate: '',
      isPublic: false,
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync({ id: deleteId, entityType, entityId });
    setDeleteId(null);
  };

  const handleDownload = (doc: Document) => {
    const url = documentsApi.getDownloadUrl(doc.id);
    window.open(url, '_blank');
  };

  const expiredDocs = documents?.filter(d => d.expiryDate && isPast(parseISO(d.expiryDate))) || [];
  const expiringSoonDocs = documents?.filter(d => {
    if (!d.expiryDate) return false;
    const daysUntil = differenceInDays(parseISO(d.expiryDate), new Date());
    return daysUntil > 0 && daysUntil <= 30;
  }) || [];

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
            <Button onClick={() => setIsUploadOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă Document
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Expiry warnings */}
        {(expiredDocs.length > 0 || expiringSoonDocs.length > 0) && (
          <div className="mb-4 space-y-2">
            {expiredDocs.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded">
                <AlertTriangle className="h-4 w-4" />
                {expiredDocs.length} document{expiredDocs.length > 1 ? 'e expirate' : ' expirat'}
              </div>
            )}
            {expiringSoonDocs.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 p-2 rounded">
                <Calendar className="h-4 w-4" />
                {expiringSoonDocs.length} document{expiringSoonDocs.length > 1 ? 'e expiră' : ' expiră'} în curând
              </div>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !documents || documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold">Nu există documente</h3>
            <p className="text-sm text-slate-500">
              {readOnly
                ? 'Nu au fost încărcate documente.'
                : 'Adaugă primul document folosind butonul de mai sus.'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Categorie</TableHead>
                  <TableHead>Dimensiune</TableHead>
                  <TableHead>Data expirării</TableHead>
                  <TableHead>Data încărcării</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => {
                  const FileIcon = getFileIcon(doc.mimeType);
                  const expiryStatus = getExpiryStatus(doc.expiryDate);

                  return (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileIcon className="h-5 w-5 text-slate-400" />
                          <div>
                            <div className="font-medium">{doc.documentName}</div>
                            <div className="text-xs text-slate-500">{doc.originalFileName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.categoryName ? (
                          <Badge variant="outline">{doc.categoryName}</Badge>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                      <TableCell>
                        {expiryStatus ? (
                          <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(doc.createdAt), 'dd MMM yyyy', { locale: ro })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {!readOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteId(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Încarcă Document</DialogTitle>
            <DialogDescription>
              Selectează un fișier și completează informațiile documentului.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Fișier</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png,.gif"
                />
              </div>
              {uploadFile && (
                <p className="text-sm text-slate-500">
                  {uploadFile.name} ({formatFileSize(uploadFile.size)})
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentName">Nume document *</Label>
              <Input
                id="documentName"
                value={formData.documentName}
                onChange={(e) => setFormData(prev => ({ ...prev, documentName: e.target.value }))}
                placeholder="Ex: Contract service"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categorie</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Data expirării</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descriere</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descriere opțională..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Anulează
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadFile || !formData.documentName || uploadMutation.isPending}
            >
              {uploadMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Upload className="mr-2 h-4 w-4" />
              Încarcă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Șterge documentul</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi acest document? Această acțiune nu poate fi anulată.
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

export default DocumentManager;
