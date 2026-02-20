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
  let showPreview = false;
  let loading = false;
  let categoryBreakdown = {};

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }
  });

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Please select an Excel file (.xlsx or .xls)');
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

        parsedData = [];
        categoryBreakdown = {};

        // Process each sheet (category)
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Skip empty rows and header rows
          const dataRows = rawData.filter(row => {
            // Check if row has product name and quantity
            return row && row.length >= 4 && row[1] && row[3] !== null && row[3] !== undefined;
          });

          let itemsInCategory = 0;

          // Common header patterns to skip
          const headerPatterns = ['IANUARIE', 'FEBRUARIE', 'MARTIE', 'APRILIE', 'MAI', 'IUNIE',
            'IULIE', 'AUGUST', 'SEPTEMBRIE', 'OCTOMBRIE', 'NOIEMBRIE', 'DECEMBRIE',
            'PRODUCT', 'PRODUS', 'DENUMIRE', 'STOC'];

          dataRows.forEach((row, idx) => {
            const productName = String(row[1] || '').trim();
            const unit = String(row[2] || '').trim();
            const rawQuantity = row[3];
            const quantity = parseFloat(rawQuantity);

            // Skip header rows - check if product name matches header patterns or quantity is not a valid number
            const isHeader = headerPatterns.some(pattern =>
              productName.toUpperCase().includes(pattern)
            ) || isNaN(quantity) || unit.toUpperCase() === 'UM';

            if (isHeader) return;

            if (productName && unit && !isNaN(quantity)) {
              parsedData.push({
                productName,
                unit,
                quantity,
                category: sheetName.trim()
              });
              itemsInCategory++;
            }
          });

          if (itemsInCategory > 0) {
            categoryBreakdown[sheetName.trim()] = itemsInCategory;
          }
        });

        previewData = parsedData.slice(0, 10); // Show first 10 items
        showPreview = true;

        console.log(`Parsed ${parsedData.length} items from ${Object.keys(categoryBreakdown).length} categories`);
        console.log('Category breakdown:', categoryBreakdown);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Failed to parse Excel file. Please check the file format.');
      }
    };

    reader.readAsArrayBuffer(file);
  }

  async function handleImport() {
    if (!parsedData || parsedData.length === 0) {
      alert('No data to import');
      return;
    }

    if (!confirm(`Import ${parsedData.length} warehouse inventory items?`)) {
      return;
    }

    try {
      importing = true;
      importResult = null;

      const result = await api.post('/materials/import/warehouse-inventory', { items: parsedData });

      if (result.success) {
        importResult = result;
        alert(result.message || 'Import completed successfully');

        // Reset form
        selectedFile = null;
        parsedData = [];
        previewData = [];
        categoryBreakdown = {};
        showPreview = false;
        if (fileInput) fileInput.value = '';
      } else {
        alert(`Import failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert(`Import failed: ${error.message}`);
    } finally {
      importing = false;
    }
  }

  function resetForm() {
    selectedFile = null;
    parsedData = [];
    previewData = [];
    categoryBreakdown = {};
    showPreview = false;
    importResult = null;
    if (fileInput) fileInput.value = '';
  }
</script>

<svelte:head>
  <title>Warehouse Inventory Import - {$_('common.appName')}</title>
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
              <li><a href="/dashboard" class="text-gray-500 hover:text-gray-700">Dashboard</a></li>
              <li class="text-gray-500">/</li>
              <li><a href="/materials" class="text-gray-500 hover:text-gray-700">Materials</a></li>
              <li class="text-gray-500">/</li>
              <li class="text-gray-900 font-medium">Warehouse Import</li>
            </ol>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <a href="/materials" class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Materials
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Upload Section -->
    <div class="bg-white p-6 rounded-lg shadow border mb-6">
      <h2 class="text-2xl font-bold mb-4">Warehouse Inventory Import</h2>
      <p class="text-gray-600 mb-6">
        Import warehouse inventory from Excel file. The file should contain multiple sheets representing different categories (MEDICATIE, MATERIALE SANITARE, ECHIPAMENTE). Each sheet should have columns: Nr. crt., Product, Unit, and STOC FINAL.
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
          Select Excel File
        </label>

        {#if selectedFile}
          <p class="mt-4 text-sm text-gray-600">
            Selected: <span class="font-medium">{selectedFile.name}</span>
            ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        {/if}
      </div>
    </div>

    <!-- Category Breakdown -->
    {#if showPreview && Object.keys(categoryBreakdown).length > 0}
      <div class="bg-white p-6 rounded-lg shadow border mb-6">
        <h3 class="text-xl font-bold mb-4">Category Breakdown</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          {#each Object.entries(categoryBreakdown) as [category, count]}
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="text-sm text-blue-600 font-medium">{category}</div>
              <div class="text-2xl font-bold text-blue-700">{count} items</div>
            </div>
          {/each}
        </div>
        <div class="mt-4 pt-4 border-t">
          <div class="text-lg font-semibold text-gray-700">
            Total Items: <span class="text-blue-600">{parsedData.length}</span>
          </div>
          <p class="text-sm text-gray-500 mt-1">
            All items will be imported to WH-MAIN warehouse
          </p>
        </div>
      </div>
    {/if}

    <!-- Preview Section -->
    {#if showPreview && parsedData.length > 0}
      <div class="bg-white p-6 rounded-lg shadow border mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-xl font-bold">Preview (First 10 items)</h3>
            <p class="text-sm text-gray-600">
              Showing first 10 of {parsedData.length} items
            </p>
          </div>
          <div class="flex gap-3">
            <button
              on:click={resetForm}
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={importing}
            >
              Cancel
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
                Importing...
              {:else}
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import {parsedData.length} Items
              {/if}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each previewData as item, idx}
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 text-xs font-medium rounded {
                      item.category === 'MEDICATIE' ? 'bg-purple-100 text-purple-800' :
                      item.category === 'MATERIALE SANITARE' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }">
                      {item.category}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm font-medium">{item.productName}</td>
                  <td class="px-4 py-3 text-sm">{item.unit}</td>
                  <td class="px-4 py-3 text-sm text-right font-medium">{item.quantity}</td>
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
        <h3 class="text-xl font-bold mb-4">Import Results</h3>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="text-sm text-green-600 font-medium">Successful</div>
            <div class="text-2xl font-bold text-green-700">{importResult.data.success}</div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="text-sm text-blue-600 font-medium">Created</div>
            <div class="text-2xl font-bold text-blue-700">{importResult.data.created}</div>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="text-sm text-yellow-600 font-medium">Updated</div>
            <div class="text-2xl font-bold text-yellow-700">{importResult.data.updated}</div>
          </div>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="text-sm text-red-600 font-medium">Failed</div>
            <div class="text-2xl font-bold text-red-700">{importResult.data.failed}</div>
          </div>
        </div>

        {#if importResult.data.errors && importResult.data.errors.length > 0}
          <div class="mt-4">
            <h4 class="font-medium text-red-600 mb-2">Errors ({importResult.data.errors.length})</h4>
            <div class="bg-red-50 border border-red-200 rounded p-4 max-h-64 overflow-y-auto">
              {#each importResult.data.errors as error}
                <div class="text-sm text-red-700 mb-1">
                  <span class="font-medium">Row {error.row} ({error.productName}):</span> {error.error}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <div class="mt-4 flex gap-3">
          <a href="/materials" class="btn btn-primary">
            View Materials
          </a>
          <button on:click={resetForm} class="btn btn-secondary">
            Import Another File
          </button>
        </div>
      </div>
    {/if}
  </main>
</div>
