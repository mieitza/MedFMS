'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Download,
  FileText,
  Package,
} from 'lucide-react';
import { warehouseApi } from '@/lib/api/warehouse';

interface ImportResult {
  imported: number;
  errors: string[];
}

interface ParsedRow {
  rowNumber: number;
  materialCode?: string;
  name?: string;
  description?: string;
  category?: string;
  unit?: string;
  currentStock?: number;
  criticalLevel?: number;
  standardPrice?: number;
  warehouse?: string;
  isValid: boolean;
  errors: string[];
}

export default function MaterialsImportPage() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ParsedRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Import mutation
  const importMutation = useMutation({
    mutationFn: (file: File) => warehouseApi.importMaterials(file),
    onSuccess: (result) => {
      setImportResult(result);
      if (result.imported > 0) {
        toast.success(`${result.imported} materiale importate cu succes`);
        queryClient.invalidateQueries({ queryKey: ['warehouse'] });
        queryClient.invalidateQueries({ queryKey: ['materials'] });
      }
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} erori la import`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Eroare la import');
    },
  });

  // Handle file selection
  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      toast.error('Format de fișier invalid. Acceptăm doar fișiere Excel (.xlsx, .xls) sau CSV.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Fișierul este prea mare. Dimensiunea maximă este 10MB.');
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
    setPreviewData([]);

    // Parse preview (for CSV files)
    if (file.name.toLowerCase().endsWith('.csv')) {
      parseCSVPreview(file);
    }
  }, []);

  // Parse CSV preview
  const parseCSVPreview = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      toast.error('Fișierul nu conține date');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const preview: ParsedRow[] = [];

    for (let i = 1; i < Math.min(lines.length, 11); i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: ParsedRow = {
        rowNumber: i + 1,
        isValid: true,
        errors: [],
      };

      headers.forEach((header, index) => {
        const value = values[index];
        if (header.includes('cod') || header.includes('code')) {
          row.materialCode = value;
        } else if (header.includes('denumire') || header.includes('name') || header.includes('nume')) {
          row.name = value;
        } else if (header.includes('descriere') || header.includes('description')) {
          row.description = value;
        } else if (header.includes('categorie') || header.includes('category')) {
          row.category = value;
        } else if (header.includes('unitate') || header.includes('unit')) {
          row.unit = value;
        } else if (header.includes('stoc') || header.includes('stock') || header.includes('cantitate')) {
          row.currentStock = parseFloat(value) || 0;
        } else if (header.includes('critic') || header.includes('critical') || header.includes('minim')) {
          row.criticalLevel = parseFloat(value) || 0;
        } else if (header.includes('pret') || header.includes('price')) {
          row.standardPrice = parseFloat(value) || 0;
        } else if (header.includes('depozit') || header.includes('warehouse')) {
          row.warehouse = value;
        }
      });

      // Validate row
      if (!row.materialCode) {
        row.isValid = false;
        row.errors.push('Lipsește codul materialului');
      }
      if (!row.name) {
        row.isValid = false;
        row.errors.push('Lipsește denumirea');
      }

      preview.push(row);
    }

    setPreviewData(preview);
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }, [handleFileSelect]);

  // Handle import
  const handleImport = () => {
    if (!selectedFile) return;
    importMutation.mutate(selectedFile);
  };

  // Reset form
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setImportResult(null);
  };

  // Download template
  const downloadTemplate = () => {
    const headers = ['cod_material', 'denumire', 'descriere', 'categorie', 'unitate', 'stoc_curent', 'nivel_critic', 'pret_standard', 'depozit'];
    const sampleRow = ['MAT001', 'Ulei motor 5W40', 'Ulei sintetic premium', 'Lubrifianți', 'litru', '50', '10', '75.50', 'Depozit Principal'];
    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template-import-materiale.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/warehouse">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Înapoi la Depozit
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Import Materiale</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Importă materiale din fișiere Excel sau CSV
          </p>
        </div>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Descarcă Template
        </Button>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Instrucțiuni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>Fișierul de import trebuie să conțină următoarele coloane:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li><strong>cod_material</strong> - Codul unic al materialului (obligatoriu)</li>
              <li><strong>denumire</strong> - Denumirea materialului (obligatoriu)</li>
              <li><strong>descriere</strong> - Descrierea materialului</li>
              <li><strong>categorie</strong> - Categoria materialului</li>
              <li><strong>unitate</strong> - Unitatea de măsură</li>
              <li><strong>stoc_curent</strong> - Stocul curent</li>
              <li><strong>nivel_critic</strong> - Nivelul critic de stoc</li>
              <li><strong>pret_standard</strong> - Prețul standard în RON</li>
              <li><strong>depozit</strong> - Numele depozitului</li>
            </ul>
            <p className="mt-4 text-slate-500">
              Formate acceptate: .xlsx, .xls, .csv | Dimensiune maximă: 10MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Încarcă Fișier</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <FileSpreadsheet className="h-12 w-12 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={handleReset}>
                    Schimbă Fișierul
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={importMutation.isPending}
                  >
                    {importMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Upload className="mr-2 h-4 w-4" />
                    Importă
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Package className="h-12 w-12 mx-auto text-slate-400" />
                <div>
                  <p className="font-medium">Trage fișierul aici sau click pentru a selecta</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Acceptă fișiere Excel (.xlsx, .xls) sau CSV
                  </p>
                </div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  />
                  <Button variant="outline" asChild>
                    <span>Selectează Fișier</span>
                  </Button>
                </Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Table */}
      {previewData.length > 0 && !importResult && (
        <Card>
          <CardHeader>
            <CardTitle>Previzualizare Date</CardTitle>
            <CardDescription>
              Primele {previewData.length} rânduri din fișier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Cod</TableHead>
                    <TableHead>Denumire</TableHead>
                    <TableHead>Categorie</TableHead>
                    <TableHead>Unitate</TableHead>
                    <TableHead className="text-right">Stoc</TableHead>
                    <TableHead className="text-right">Critic</TableHead>
                    <TableHead className="text-right">Preț</TableHead>
                    <TableHead>Depozit</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row) => (
                    <TableRow key={row.rowNumber} className={!row.isValid ? 'bg-red-50 dark:bg-red-950/20' : ''}>
                      <TableCell>{row.rowNumber}</TableCell>
                      <TableCell className="font-medium">{row.materialCode || '-'}</TableCell>
                      <TableCell>{row.name || '-'}</TableCell>
                      <TableCell>{row.category || '-'}</TableCell>
                      <TableCell>{row.unit || '-'}</TableCell>
                      <TableCell className="text-right">{row.currentStock ?? '-'}</TableCell>
                      <TableCell className="text-right">{row.criticalLevel ?? '-'}</TableCell>
                      <TableCell className="text-right">{row.standardPrice?.toFixed(2) || '-'}</TableCell>
                      <TableCell>{row.warehouse || '-'}</TableCell>
                      <TableCell>
                        {row.isValid ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Invalid
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Result */}
      {importResult && (
        <div className="space-y-4">
          {importResult.imported > 0 && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200">Import Reușit</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                {importResult.imported} materiale au fost importate cu succes.
              </AlertDescription>
            </Alert>
          )}

          {importResult.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erori la Import</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {importResult.errors.slice(0, 10).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {importResult.errors.length > 10 && (
                    <li className="text-slate-500">
                      ... și încă {importResult.errors.length - 10} erori
                    </li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Import Nou
            </Button>
            <Button asChild>
              <Link href="/warehouse">Vezi Materialele</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
