<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';

  let isLoading = false;
  let hasLoaded = false;
  let warehouses = [];
  let selectedWarehouseId = '';
  let customStartDate = '';
  let customEndDate = '';
  let dailyData = [];
  let summary = { totalConsumed: 0, totalQuantity: 0, uniqueMaterials: 0, daysWithData: 0, topConsumed: null };
  let expandedDays = {};
  let expandedItems = {};

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

      const response = await api.get(`/materials/reports/daily-consumption?${params}`);
      dailyData = response.data || [];
      summary = response.summary || summary;
      expandedDays = {};
      expandedItems = {};
    } catch (error) {
      console.error('Failed to load report:', error);
      dailyData = [];
    } finally {
      isLoading = false;
    }
  }

  function toggleDay(date) {
    expandedDays[date] = !expandedDays[date];
    expandedDays = expandedDays;
  }

  function toggleItem(date, materialId) {
    const key = `${date}-${materialId}`;
    expandedItems[key] = !expandedItems[key];
    expandedItems = expandedItems;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  function formatDateTime(dateStr) {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function exportToCSV() {
    if (dailyData.length === 0) return;

    const headers = ['Data', 'Material', 'Cod Material', 'Unitate', 'Cantitate', 'Depozit'];
    const rows = [];

    dailyData.forEach(day => {
      day.items.forEach(item => {
        rows.push([
          formatDate(day.date),
          item.materialName,
          item.materialCode,
          item.unitName,
          item.totalQuantity.toFixed(2),
          item.warehouseName
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
    link.download = `consum-zilnic-${customStartDate}-${customEndDate}.csv`;
    link.click();
  }
</script>

<svelte:head>
  <title>Consum Zilnic - MedFMS</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Raport Consum Zilnic</h1>
    <p class="text-gray-600">Materiale consumate (ieșiri) pe zile din depozite</p>
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

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div class="text-sm text-gray-600 mb-1">Total Tranzacții Ieșire</div>
        <div class="text-2xl font-bold text-red-600">{summary.totalConsumed}</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">Materiale Unice Afectate</div>
        <div class="text-2xl font-bold text-blue-600">{summary.uniqueMaterials}</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">Cantitate Totală</div>
        <div class="text-2xl font-bold text-purple-600">{summary.totalQuantity.toFixed(2)}</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">Top Material Consumat</div>
        <div class="text-lg font-bold text-orange-600 truncate">
          {#if summary.topConsumed}
            {summary.topConsumed.name}
            <span class="text-sm font-normal text-gray-500">({summary.topConsumed.total.toFixed(2)} {summary.topConsumed.unit})</span>
          {:else}
            -
          {/if}
        </div>
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

    <!-- Daily Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materiale</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tranzacții</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantitate Totală</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each dailyData as day}
            <tr class="hover:bg-gray-50 cursor-pointer" on:click={() => toggleDay(day.date)}>
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{formatDate(day.date)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">{day.totalItems}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">{day.totalTransactions}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">{day.totalQuantity.toFixed(2)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <svg class="w-5 h-5 inline-block transform transition-transform {expandedDays[day.date] ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </td>
            </tr>

            {#if expandedDays[day.date]}
              {#each day.items as item}
                <tr class="bg-gray-50 hover:bg-gray-100 cursor-pointer" on:click|stopPropagation={() => toggleItem(day.date, item.materialId)}>
                  <td class="px-6 py-3 pl-12 whitespace-nowrap text-sm text-gray-600">{item.materialCode}</td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.materialName}</td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{item.warehouseName}</td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{item.totalQuantity.toFixed(2)} {item.unitName}</td>
                  <td class="px-6 py-3 whitespace-nowrap text-right">
                    {#if item.transactions.length > 1}
                      <svg class="w-4 h-4 inline-block transform transition-transform {expandedItems[`${day.date}-${item.materialId}`] ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    {/if}
                  </td>
                </tr>

                {#if expandedItems[`${day.date}-${item.materialId}`]}
                  {#each item.transactions as tx}
                    <tr class="bg-blue-50">
                      <td class="px-6 py-2 pl-16 whitespace-nowrap text-xs text-gray-500">#{tx.id}</td>
                      <td class="px-6 py-2 whitespace-nowrap text-xs text-gray-600">{tx.description || '-'}</td>
                      <td class="px-6 py-2 whitespace-nowrap text-xs text-gray-500">
                        {#if tx.vehicleId}Vehicul #{tx.vehicleId}{:else}-{/if}
                      </td>
                      <td class="px-6 py-2 whitespace-nowrap text-xs text-gray-600">{tx.quantity.toFixed(2)}</td>
                      <td class="px-6 py-2 whitespace-nowrap text-xs text-gray-500">{formatDateTime(tx.transactionDate)}</td>
                    </tr>
                  {/each}
                {/if}
              {/each}
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  {:else if hasLoaded && dailyData.length === 0}
    <div class="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p>Nu există date de consum pentru perioada selectată</p>
    </div>
  {:else}
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
      <svg class="w-16 h-16 mx-auto mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-blue-900 mb-2">Selectează perioada</h3>
      <p class="text-blue-700">Alege o perioadă și apasă "Generează Raport" pentru a vedea consumul zilnic</p>
    </div>
  {/if}
</div>
