<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';
  import * as XLSX from 'xlsx';

  let fileInput: HTMLInputElement;
  let selectedFile: File | null = null;
  let parsedData: any[] = [];
  let previewData: any[] = [];
  let importing = false;
  let importResult: any = null;
  let showPreview = false;
  let loading = false;
  let templateInfo: any = null;

  // Expected columns based on backend schema
  const expectedColumns = [
    'vehicleCode',
    'licensePlate',
    'brandName',
    'modelName',
    'year',
    'fuelTypeName',
    'vehicleTypeName',
    'statusName',
    'locationName',
    'departmentName',
    'odometer',
    'engineNumber',
    'chassisNumber',
    'description',
    'registrationDate',
    'acquisitionDate',
    'purchasePrice',
    'currentValue'
  ];

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }
    await loadTemplateInfo();
  });

  async function loadTemplateInfo() {
    try {
      loading = true;
      const response = await api.get('/vehicles/import/template-info');
      if (response.success) {
        templateInfo = response.data;
      }
    } catch (error) {
      console.error('Failed to load template info:', error);
    } finally {
      loading = false;
    }
  }

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert($_('vehicleImport.upload.invalidFileType') || 'Please select an Excel file (.xlsx or .xls)');
      return;
    }

    selectedFile = file;
    parseExcelFile(file);
  }

  function parseExcelFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON with header
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (rawData.length < 2) {
          alert($_('vehicleImport.upload.noData') || 'No data found in the Excel file');
          return;
        }

        // First row is headers
        const headers = rawData[0] as string[];
        const dataRows = rawData.slice(1);

        // Map data to object format based on headers
        parsedData = dataRows
          .filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''))
          .map(row => {
            const obj: Record<string, any> = {};
            headers.forEach((header, index) => {
              if (header && expectedColumns.includes(header.trim())) {
                obj[header.trim()] = row[index];
              }
            });
            return obj;
          })
          .filter(obj => obj.vehicleCode && obj.licensePlate); // Must have at least code and plate

        previewData = parsedData.slice(0, 10); // Show first 10 rows
        showPreview = true;

        console.log(`Parsed ${parsedData.length} vehicles`);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert($_('vehicleImport.upload.parseError') || 'Error parsing the Excel file');
      }
    };

    reader.readAsArrayBuffer(file);
  }

  async function handleImport() {
    if (!parsedData || parsedData.length === 0) {
      alert($_('vehicleImport.messages.noData') || 'No data to import');
      return;
    }

    const confirmMsg = $_('vehicleImport.messages.confirmImport')?.replace('{count}', String(parsedData.length))
      || `Are you sure you want to import ${parsedData.length} vehicles?`;
    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      importing = true;
      importResult = null;

      const result = await api.post('/vehicles/import', { vehicles: parsedData });

      if (result.success) {
        importResult = result;
        const successMsg = result.message || $_('vehicleImport.messages.importSuccess') || 'Import completed successfully';
        alert(successMsg);

        // Reset form
        selectedFile = null;
        parsedData = [];
        previewData = [];
        showPreview = false;
        if (fileInput) fileInput.value = '';
      } else {
        const errorMsg = $_('vehicleImport.messages.importFailed')?.replace('{error}', result.message || 'Unknown error')
          || `Import failed: ${result.message || 'Unknown error'}`;
        alert(errorMsg);
      }
    } catch (error: any) {
      console.error('Import error:', error);
      const errorMsg = $_('vehicleImport.messages.importFailed')?.replace('{error}', error.message)
        || `Import failed: ${error.message}`;
      alert(errorMsg);
    } finally {
      importing = false;
    }
  }

  function resetForm() {
    selectedFile = null;
    parsedData = [];
    previewData = [];
    showPreview = false;
    importResult = null;
    if (fileInput) fileInput.value = '';
  }

  function downloadTemplate() {
    // Create a template workbook
    const templateData = [
      expectedColumns, // Headers
      ['VH001', 'B-123-ABC', 'Toyota', 'Corolla', 2022, 'Diesel', 'Car', 'Active', '', '', 50000, '', '', '', '', '', '', ''] // Example row
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicles');

    // Add reference data sheet if available
    if (templateInfo?.referenceData) {
      const refData = [
        ['Brands', 'Fuel Types', 'Vehicle Types', 'Statuses', 'Locations', 'Departments'],
        ...Array.from({ length: Math.max(
          templateInfo.referenceData.brands?.length || 0,
          templateInfo.referenceData.fuelTypes?.length || 0,
          templateInfo.referenceData.vehicleTypes?.length || 0,
          templateInfo.referenceData.statuses?.length || 0,
          templateInfo.referenceData.locations?.length || 0,
          templateInfo.referenceData.departments?.length || 0
        ) }, (_, i) => [
          templateInfo.referenceData.brands?.[i] || '',
          templateInfo.referenceData.fuelTypes?.[i] || '',
          templateInfo.referenceData.vehicleTypes?.[i] || '',
          templateInfo.referenceData.statuses?.[i] || '',
          templateInfo.referenceData.locations?.[i] || '',
          templateInfo.referenceData.departments?.[i] || ''
        ])
      ];
      const refWs = XLSX.utils.aoa_to_sheet(refData);
      XLSX.utils.book_append_sheet(wb, refWs, 'Reference Data');
    }

    XLSX.writeFile(wb, 'vehicle_import_template.xlsx');
  }
</script>

<svelte:head>
  <title>{$_('vehicleImport.pageTitle') || 'Vehicle Import'}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="/dashboard" class="text-2xl font-bold text-primary-900">MedFMS</a>
          <nav class="ml-8">
            <ol class="flex items-center space-x-2 text-sm">
              <li><a href="/dashboard" class="text-gray-500 hover:text-gray-700">{$_('nav.dashboard') || 'Dashboard'}</a></li>
              <li class="text-gray-500">/</li>
              <li><a href="/vehicles" class="text-gray-500 hover:text-gray-700">{$_('nav.vehicles') || 'Vehicles'}</a></li>
              <li class="text-gray-500">/</li>
              <li class="text-gray-900 font-medium">{$_('vehicleImport.breadcrumb') || 'Import'}</li>
            </ol>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <a href="/vehicles" class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {$_('vehicleImport.backToVehicles') || 'Back to Vehicles'}
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Upload Section -->
    <div class="bg-white p-6 rounded-lg shadow border mb-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-2xl font-bold">{$_('vehicleImport.title') || 'Import Vehicles from Excel'}</h2>
          <p class="text-gray-600 mt-2">
            {$_('vehicleImport.description') || 'Upload an Excel file (.xlsx or .xls) containing vehicle data. The file should have headers in the first row.'}
          </p>
        </div>
        <button
          on:click={downloadTemplate}
          class="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium rounded-md transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {$_('vehicleImport.downloadTemplate') || 'Download Template'}
        </button>
      </div>

      <!-- Required columns info -->
      <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="font-medium text-blue-800 mb-2">{$_('vehicleImport.requiredColumns') || 'Required Columns'}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <span class="text-blue-700"><strong>vehicleCode</strong> *</span>
          <span class="text-blue-700"><strong>licensePlate</strong> *</span>
          <span class="text-blue-700"><strong>brandName</strong> *</span>
          <span class="text-blue-700"><strong>modelName</strong> *</span>
          <span class="text-blue-700"><strong>fuelTypeName</strong> *</span>
          <span class="text-blue-700"><strong>vehicleTypeName</strong> *</span>
          <span class="text-gray-600">year</span>
          <span class="text-gray-600">statusName</span>
          <span class="text-gray-600">locationName</span>
          <span class="text-gray-600">departmentName</span>
          <span class="text-gray-600">odometer</span>
          <span class="text-gray-600">engineNumber</span>
          <span class="text-gray-600">chassisNumber</span>
          <span class="text-gray-600">description</span>
        </div>
        <p class="mt-2 text-xs text-blue-600">* {$_('vehicleImport.requiredNote') || 'Required fields. Names are case-insensitive and matched against existing reference data.'}</p>
      </div>

      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <input
          type="file"
          bind:this={fileInput}
          on:change={handleFileSelect}
          accept=".xlsx,.xls"
          class="hidden"
          id="file-upload"
        />

        <label
          for="file-upload"
          class="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {$_('vehicleImport.selectFile') || 'Select Excel File'}
        </label>

        {#if selectedFile}
          <p class="mt-4 text-sm text-gray-600">
            {$_('vehicleImport.selectedFile') || 'Selected file:'} <span class="font-medium">{selectedFile.name}</span>
            ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        {/if}
      </div>
    </div>

    <!-- Preview Section -->
    {#if showPreview && parsedData.length > 0}
      <div class="bg-white p-6 rounded-lg shadow border mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-xl font-bold">{$_('vehicleImport.preview.title') || 'Data Preview'}</h3>
            <p class="text-sm text-gray-600">
              {$_('vehicleImport.preview.count')?.replace('{count}', String(parsedData.length)) || `Found ${parsedData.length} vehicles to import`}
            </p>
          </div>
          <div class="flex gap-3">
            <button
              on:click={resetForm}
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={importing}
            >
              {$_('common.cancel') || 'Cancel'}
            </button>
            <button
              on:click={handleImport}
              disabled={importing}
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {#if importing}
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {$_('vehicleImport.importing') || 'Importing...'}
              {:else}
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {$_('vehicleImport.importButton')?.replace('{count}', String(parsedData.length)) || `Import ${parsedData.length} Vehicles`}
              {/if}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('vehicles.vehicleCode') || 'Code'}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('vehicles.licensePlate') || 'Plate'}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('vehicles.brand') || 'Brand'}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('vehicles.model') || 'Model'}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('vehicles.year') || 'Year'}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('vehicles.fuelType') || 'Fuel'}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('vehicles.type') || 'Type'}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each previewData as row, idx}
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                  <td class="px-4 py-3 text-sm font-medium">{row.vehicleCode}</td>
                  <td class="px-4 py-3 text-sm">{row.licensePlate}</td>
                  <td class="px-4 py-3 text-sm">{row.brandName}</td>
                  <td class="px-4 py-3 text-sm">{row.modelName}</td>
                  <td class="px-4 py-3 text-sm">{row.year || '-'}</td>
                  <td class="px-4 py-3 text-sm">{row.fuelTypeName}</td>
                  <td class="px-4 py-3 text-sm">{row.vehicleTypeName}</td>
                </tr>
              {/each}
            </tbody>
          </table>
          {#if parsedData.length > 10}
            <p class="text-sm text-gray-500 mt-2 text-center">
              {$_('vehicleImport.preview.moreRows')?.replace('{count}', String(parsedData.length - 10)) || `... and ${parsedData.length - 10} more rows`}
            </p>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Import Result -->
    {#if importResult}
      <div class="bg-white p-6 rounded-lg shadow border mb-6">
        <h3 class="text-xl font-bold mb-4">{$_('vehicleImport.results.title') || 'Import Results'}</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="text-sm text-green-600 font-medium">{$_('vehicleImport.results.successful') || 'Successfully Imported'}</div>
            <div class="text-2xl font-bold text-green-700">{importResult.data?.success || 0}</div>
          </div>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="text-sm text-red-600 font-medium">{$_('vehicleImport.results.failed') || 'Failed'}</div>
            <div class="text-2xl font-bold text-red-700">{importResult.data?.failed || 0}</div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="text-sm text-blue-600 font-medium">{$_('vehicleImport.results.batchId') || 'Batch ID'}</div>
            <div class="text-sm font-mono text-blue-700 truncate">{importResult.data?.batchId || '-'}</div>
          </div>
        </div>

        {#if importResult.data?.errors && importResult.data.errors.length > 0}
          <div class="mt-4">
            <h4 class="font-medium text-red-600 mb-2">
              {$_('vehicleImport.results.errorsTitle')?.replace('{count}', String(importResult.data.errors.length)) || `${importResult.data.errors.length} Errors`}
            </h4>
            <div class="bg-red-50 border border-red-200 rounded p-4 max-h-64 overflow-y-auto">
              {#each importResult.data.errors as error}
                <div class="text-sm text-red-700 mb-1">
                  <span class="font-medium">{$_('vehicleImport.results.row') || 'Row'} {error.row}:</span> {error.error}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <div class="mt-4">
          <a href="/vehicles" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            {$_('vehicleImport.viewVehicles') || 'View Vehicles'}
          </a>
        </div>
      </div>
    {/if}

    <!-- Reference Data Section -->
    {#if templateInfo?.referenceData}
      <div class="bg-white p-6 rounded-lg shadow border">
        <h3 class="text-xl font-bold mb-4">{$_('vehicleImport.referenceData.title') || 'Available Reference Data'}</h3>
        <p class="text-gray-600 mb-4">
          {$_('vehicleImport.referenceData.description') || 'Use these exact values in your Excel file. Names are case-insensitive.'}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#if templateInfo.referenceData.brands?.length > 0}
            <div class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">{$_('vehicles.brand') || 'Brands'}</h4>
              <div class="flex flex-wrap gap-1">
                {#each templateInfo.referenceData.brands as brand}
                  <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{brand}</span>
                {/each}
              </div>
            </div>
          {/if}

          {#if templateInfo.referenceData.fuelTypes?.length > 0}
            <div class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">{$_('vehicles.fuelType') || 'Fuel Types'}</h4>
              <div class="flex flex-wrap gap-1">
                {#each templateInfo.referenceData.fuelTypes as fuelType}
                  <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{fuelType}</span>
                {/each}
              </div>
            </div>
          {/if}

          {#if templateInfo.referenceData.vehicleTypes?.length > 0}
            <div class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">{$_('vehicles.type') || 'Vehicle Types'}</h4>
              <div class="flex flex-wrap gap-1">
                {#each templateInfo.referenceData.vehicleTypes as vehicleType}
                  <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{vehicleType}</span>
                {/each}
              </div>
            </div>
          {/if}

          {#if templateInfo.referenceData.statuses?.length > 0}
            <div class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">{$_('vehicles.status') || 'Statuses'}</h4>
              <div class="flex flex-wrap gap-1">
                {#each templateInfo.referenceData.statuses as status}
                  <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{status}</span>
                {/each}
              </div>
            </div>
          {/if}

          {#if templateInfo.referenceData.locations?.length > 0}
            <div class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">{$_('vehicles.location') || 'Locations'}</h4>
              <div class="flex flex-wrap gap-1">
                {#each templateInfo.referenceData.locations as location}
                  <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{location}</span>
                {/each}
              </div>
            </div>
          {/if}

          {#if templateInfo.referenceData.departments?.length > 0}
            <div class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">{$_('vehicles.department') || 'Departments'}</h4>
              <div class="flex flex-wrap gap-1">
                {#each templateInfo.referenceData.departments as department}
                  <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{department}</span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </main>
</div>
