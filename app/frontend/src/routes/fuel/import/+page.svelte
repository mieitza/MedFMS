<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';
  import * as XLSX from 'xlsx';

  let fileInput;
  let selectedFile = null;
  let parsedData = [];
  let previewData = [];
  let importing = false;
  let importResult = null;
  let importHistory = [];
  let showPreview = false;
  let loading = false;

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }
    await loadImportHistory();
  });

  async function loadImportHistory() {
    try {
      loading = true;
      const response = await api.get('/fuel/import/batches');
      if (response.success) {
        importHistory = response.data;
      }
    } catch (error) {
      console.error('Failed to load import history:', error);
    } finally {
      loading = false;
    }
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert($_('dataImport.upload.invalidFileType'));
      return;
    }

    selectedFile = file;
    parseExcelFile(file);
  }

  function parseExcelFile(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to array of arrays
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip title row, get headers from second row
        const headers = rawData[1];
        const dataRows = rawData.slice(2);

        // Map data to object format
        parsedData = dataRows
          .filter(row => row[3]) // Has vehicle registration
          .map(row => ({
            invoiceDate: row[0],
            deliveryDate: row[1],
            deliveryTime: row[2],
            vehicleReg: row[3],
            cardNumber: row[4],
            kmReading: row[5] || 0,
            costCenter1: row[6] || '',
            costCenter2: row[7] || '',
            country: row[8],
            stationId: row[9],
            stationName: row[10],
            motorway: row[11] || '',
            postalCode: row[12] || '',
            productType: row[13],
            quantity: parseFloat(row[14]) || 0,
            vatRate: parseFloat(row[15]) || 0,
            currency: row[16],
            amountExclVat: parseFloat(row[17]) || 0,
            vat: parseFloat(row[18]) || 0,
            amountInclVat: parseFloat(row[19]) || 0,
            voucherNumber: row[20] || ''
          }));

        previewData = parsedData.slice(0, 10); // Show first 10 rows
        showPreview = true;

        console.log(`Parsed ${parsedData.length} transactions`);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert($_('dataImport.upload.parseError'));
      }
    };

    reader.readAsArrayBuffer(file);
  }

  async function handleImport() {
    if (!parsedData || parsedData.length === 0) {
      alert($_('dataImport.messages.noData'));
      return;
    }

    if (!confirm($_('dataImport.messages.confirmImport', { values: { count: parsedData.length } }))) {
      return;
    }

    try {
      importing = true;
      importResult = null;

      const result = await api.post('/fuel/import/uta', { transactions: parsedData });

      if (result.success) {
        importResult = result;
        alert(result.message || $_('dataImport.messages.importSuccess'));

        // Reload import history
        await loadImportHistory();

        // Reset form
        selectedFile = null;
        parsedData = [];
        previewData = [];
        showPreview = false;
        if (fileInput) fileInput.value = '';
      } else {
        alert($_('dataImport.messages.importFailed', { values: { error: result.message || $_('dataImport.messages.unknownError') } }));
      }
    } catch (error) {
      console.error('Import error:', error);
      alert($_('dataImport.messages.importFailed', { values: { error: error.message } }));
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

  function formatDate(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString();
  }

  function formatCurrency(amount) {
    if (!amount) return '0.00';
    return parseFloat(amount).toFixed(2);
  }
</script>

<svelte:head>
  <title>{$_('dataImport.pageTitle')}</title>
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
              <li><a href="/dashboard" class="text-gray-500 hover:text-gray-700">{$_('dataImport.breadcrumbs.dashboard')}</a></li>
              <li class="text-gray-500">/</li>
              <li><a href="/fuel" class="text-gray-500 hover:text-gray-700">{$_('dataImport.breadcrumbs.fuel')}</a></li>
              <li class="text-gray-500">/</li>
              <li class="text-gray-900 font-medium">{$_('dataImport.breadcrumbs.utaImport')}</li>
            </ol>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <a href="/fuel" class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {$_('dataImport.backToFuel')}
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Upload Section -->
    <div class="bg-white p-6 rounded-lg shadow border mb-6">
      <h2 class="text-2xl font-bold mb-4">{$_('dataImport.utaImportTitle')}</h2>
      <p class="text-gray-600 mb-6">
        {$_('dataImport.upload.description')}
      </p>

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
          {$_('dataImport.upload.selectFile')}
        </label>

        {#if selectedFile}
          <p class="mt-4 text-sm text-gray-600">
            {$_('dataImport.upload.selectedFile')} <span class="font-medium">{selectedFile.name}</span>
            ({(selectedFile.size / 1024).toFixed(2)} {$_('dataImport.upload.fileSize')})
          </p>
        {/if}
      </div>
    </div>

    <!-- Preview Section -->
    {#if showPreview && parsedData.length > 0}
      <div class="bg-white p-6 rounded-lg shadow border mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-xl font-bold">{$_('dataImport.preview.title')}</h3>
            <p class="text-sm text-gray-600">
              {$_('dataImport.preview.showingCount', { values: { count: parsedData.length } })}
            </p>
          </div>
          <div class="flex gap-3">
            <button
              on:click={resetForm}
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={importing}
            >
              {$_('dataImport.buttons.cancel')}
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
                {$_('dataImport.buttons.importing')}
              {:else}
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {$_('dataImport.buttons.importTransactions', { values: { count: parsedData.length } })}
              {/if}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('dataImport.preview.table.date')}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('dataImport.preview.table.vehicle')}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('dataImport.preview.table.station')}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('dataImport.preview.table.product')}</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{$_('dataImport.preview.table.quantity')}</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{$_('dataImport.preview.table.amount')}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each previewData as row, idx}
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm">{row.deliveryDate}</td>
                  <td class="px-4 py-3 text-sm font-medium">{row.vehicleReg}</td>
                  <td class="px-4 py-3 text-sm">{row.stationName}</td>
                  <td class="px-4 py-3 text-sm">{row.productType}</td>
                  <td class="px-4 py-3 text-sm text-right">{row.quantity.toFixed(2)} L</td>
                  <td class="px-4 py-3 text-sm text-right font-medium">{formatCurrency(row.amountInclVat)} {row.currency}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}

    <!-- Import Result -->
    {#if importResult}
      <div class="bg-white p-6 rounded-lg shadow border mb-6">
        <h3 class="text-xl font-bold mb-4">{$_('dataImport.results.title')}</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="text-sm text-green-600 font-medium">{$_('dataImport.results.successful')}</div>
            <div class="text-2xl font-bold text-green-700">{importResult.data.success}</div>
          </div>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="text-sm text-red-600 font-medium">{$_('dataImport.results.failed')}</div>
            <div class="text-2xl font-bold text-red-700">{importResult.data.failed}</div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="text-sm text-blue-600 font-medium">{$_('dataImport.results.batchId')}</div>
            <div class="text-sm font-mono text-blue-700 truncate">{importResult.data.batchId}</div>
          </div>
        </div>

        {#if importResult.data.errors && importResult.data.errors.length > 0}
          <div class="mt-4">
            <h4 class="font-medium text-red-600 mb-2">{$_('dataImport.results.errors', { values: { count: importResult.data.errors.length } })}</h4>
            <div class="bg-red-50 border border-red-200 rounded p-4 max-h-64 overflow-y-auto">
              {#each importResult.data.errors as error}
                <div class="text-sm text-red-700 mb-1">
                  <span class="font-medium">{error.row}:</span> {error.error}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Import History -->
    <div class="bg-white p-6 rounded-lg shadow border">
      <h3 class="text-xl font-bold mb-4">{$_('dataImport.history.title')}</h3>

      {#if loading}
        <div class="text-center py-8">
          <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">{$_('dataImport.history.loading')}</p>
        </div>
      {:else if importHistory.length === 0}
        <p class="text-gray-500 text-center py-8">{$_('dataImport.history.noHistory')}</p>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('dataImport.history.table.batchId')}</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('dataImport.history.table.importDate')}</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{$_('dataImport.history.table.transactions')}</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{$_('dataImport.history.table.totalAmount')}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each importHistory as batch}
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-mono">{batch.batchId}</td>
                  <td class="px-4 py-3 text-sm">{formatDate(batch.importDate)}</td>
                  <td class="px-4 py-3 text-sm text-right">{batch.count}</td>
                  <td class="px-4 py-3 text-sm text-right font-medium">{formatCurrency(batch.totalAmount)} RON</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </main>
</div>
