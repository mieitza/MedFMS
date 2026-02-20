<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';

  let isLoading = false;
  let hasLoaded = false;
  let warehouses = [];
  let selectedWarehouseId = '';
  let selectedTransferType = '';
  let customStartDate = '';
  let customEndDate = '';
  let dailyData = [];
  let statistics = {
    totalTransfers: 0, daysWithData: 0,
    byStatus: { pending: 0, approved: 0, in_transit: 0, completed: 0, rejected: 0, cancelled: 0 },
    byType: { 'warehouse-to-warehouse': 0, 'warehouse-to-vehicle': 0, 'warehouse-to-employee': 0, 'vehicle-to-warehouse': 0 }
  };

  const transferTypes = [
    { value: '', label: 'Toate tipurile' },
    { value: 'warehouse-to-warehouse', label: 'Depozit → Depozit' },
    { value: 'warehouse-to-vehicle', label: 'Depozit → Vehicul' },
    { value: 'warehouse-to-employee', label: 'Depozit → Angajat' },
    { value: 'vehicle-to-warehouse', label: 'Vehicul → Depozit' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    pending: 'În așteptare',
    approved: 'Aprobat',
    in_transit: 'În tranzit',
    completed: 'Finalizat',
    rejected: 'Respins',
    cancelled: 'Anulat'
  };

  const priorityLabels = { 1: 'Urgent', 2: 'Ridicat', 3: 'Normal', 4: 'Scăzut' };
  const priorityColors = { 1: 'text-red-600', 2: 'text-orange-600', 3: 'text-gray-600', 4: 'text-gray-400' };

  const transferTypeLabels = {
    'warehouse-to-warehouse': 'Depozit → Depozit',
    'warehouse-to-vehicle': 'Depozit → Vehicul',
    'warehouse-to-employee': 'Depozit → Angajat',
    'vehicle-to-warehouse': 'Vehicul → Depozit'
  };

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) { goto('/'); return; }

    const today = new Date();
    customEndDate = today.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    customStartDate = sevenDaysAgo.toISOString().split('T')[0];

    await loadWarehouses();
  });

  async function loadWarehouses() {
    try {
      const response = await api.getWarehouses();
      warehouses = response.data || [];
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    }
  }

  function setPreset(preset) {
    const today = new Date();
    customEndDate = today.toISOString().split('T')[0];

    if (preset === 'today') {
      customStartDate = customEndDate;
    } else if (preset === '7days') {
      const d = new Date(today);
      d.setDate(d.getDate() - 7);
      customStartDate = d.toISOString().split('T')[0];
    } else if (preset === '30days') {
      const d = new Date(today);
      d.setDate(d.getDate() - 30);
      customStartDate = d.toISOString().split('T')[0];
    }
  }

  async function loadReport() {
    if (!customStartDate || !customEndDate) return;

    isLoading = true;
    hasLoaded = true;
    try {
      const params = new URLSearchParams({
        startDate: customStartDate,
        endDate: customEndDate
      });
      if (selectedWarehouseId) params.append('warehouseId', selectedWarehouseId);
      if (selectedTransferType) params.append('transferType', selectedTransferType);

      const response = await api.get(`/materials/reports/daily-transfers?${params}`);
      dailyData = response.data || [];
      statistics = response.statistics || statistics;
    } catch (error) {
      console.error('Failed to load report:', error);
      dailyData = [];
    } finally {
      isLoading = false;
    }
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  function getSourceDest(t) {
    if (t.transferType === 'warehouse-to-warehouse') return `${t.sourceWarehouse} → ${t.destinationWarehouse}`;
    if (t.transferType === 'warehouse-to-vehicle') return `${t.sourceWarehouse} → Vehicul`;
    if (t.transferType === 'warehouse-to-employee') return `${t.sourceWarehouse} → Angajat`;
    if (t.transferType === 'vehicle-to-warehouse') return `Vehicul → ${t.destinationWarehouse}`;
    return '-';
  }

  function exportToCSV() {
    if (dailyData.length === 0) return;

    const headers = ['Data', 'Nr. Transfer', 'Tip', 'Sursă → Destinație', 'Material', 'Cantitate', 'Unitate', 'Status', 'Prioritate'];
    const rows = [];

    dailyData.forEach(day => {
      day.transfers.forEach(t => {
        rows.push([
          formatDate(day.date),
          t.requestNumber,
          transferTypeLabels[t.transferType] || t.transferType,
          getSourceDest(t),
          t.materialName,
          t.quantity,
          t.unitName,
          statusLabels[t.status] || t.status,
          priorityLabels[t.priority] || t.priority
        ]);
      });
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transferuri-zilnice-${customStartDate}-${customEndDate}.csv`;
    link.click();
  }
</script>

<svelte:head>
  <title>Transferuri Zilnice - MedFMS</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Raport Transferuri Zilnice</h1>
    <p class="text-gray-600">Transferuri de materiale între depozite, vehicule și angajați pe zile</p>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">{$_('common.filters')}</h2>

    <!-- Presets -->
    <div class="flex gap-2 mb-4">
      <button on:click={() => setPreset('today')} class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">Azi</button>
      <button on:click={() => setPreset('7days')} class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">Ultimele 7 zile</button>
      <button on:click={() => setPreset('30days')} class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">Ultimele 30 zile</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Data început</label>
        <input type="date" bind:value={customStartDate}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Data sfârșit</label>
        <input type="date" bind:value={customEndDate}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Depozit (opțional)</label>
        <select bind:value={selectedWarehouseId}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Toate depozitele</option>
          {#each warehouses as wh}
            <option value={wh.id}>{wh.warehouseName}</option>
          {/each}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Tip transfer</label>
        <select bind:value={selectedTransferType}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          {#each transferTypes as tt}
            <option value={tt.value}>{tt.label}</option>
          {/each}
        </select>
      </div>
      <div class="flex items-end">
        <button on:click={loadReport}
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Generează Raport
        </button>
      </div>
    </div>
  </div>

  {#if isLoading}
    <div class="bg-white rounded-lg shadow-md p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">{$_('common.loading')}</p>
    </div>
  {:else if hasLoaded && dailyData.length > 0}
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">Total Transferuri</div>
        <div class="text-2xl font-bold text-blue-600">{statistics.totalTransfers}</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">Finalizate</div>
        <div class="text-2xl font-bold text-green-600">{statistics.byStatus.completed}</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">În așteptare</div>
        <div class="text-2xl font-bold text-yellow-600">{statistics.byStatus.pending}</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">În tranzit</div>
        <div class="text-2xl font-bold text-indigo-600">{statistics.byStatus.in_transit}</div>
      </div>
    </div>

    <!-- Export Button -->
    <div class="mb-4 flex justify-end">
      <button on:click={exportToCSV}
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export CSV
      </button>
    </div>

    <!-- Daily Grouped Table -->
    {#each dailyData as day}
      <div class="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-3 flex justify-between items-center border-b">
          <h3 class="font-semibold text-gray-900">{formatDate(day.date)}</h3>
          <span class="text-sm text-gray-500">{day.totalTransfers} transfer{day.totalTransfers !== 1 ? 'uri' : ''}</span>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nr.</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sursă → Destinație</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantitate</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Prioritate</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each day.transfers as t}
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600">{t.requestNumber}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{transferTypeLabels[t.transferType] || t.transferType}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{getSourceDest(t)}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{t.materialName}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{t.quantity} {t.unitName}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 text-xs font-medium rounded-full {statusColors[t.status] || 'bg-gray-100 text-gray-800'}">
                    {statusLabels[t.status] || t.status}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm {priorityColors[t.priority] || 'text-gray-600'}">{priorityLabels[t.priority] || t.priority}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/each}
  {:else if hasLoaded && dailyData.length === 0}
    <div class="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p>Nu există transferuri pentru perioada selectată</p>
    </div>
  {:else}
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
      <svg class="w-16 h-16 mx-auto mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-blue-900 mb-2">Selectează perioada</h3>
      <p class="text-blue-700">Alege o perioadă și apasă "Generează Raport" pentru a vedea transferurile zilnice</p>
    </div>
  {/if}
</div>
