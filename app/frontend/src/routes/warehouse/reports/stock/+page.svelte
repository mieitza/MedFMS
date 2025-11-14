<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';

  let loading = true;
  let error = null;
  let reportData = [];
  let summary = {};
  let warehouses = [];

  // Filters
  let filters = {
    warehouseId: '',
    materialTypeId: '',
    categoryId: '',
    lowStockOnly: false
  };

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    await loadWarehouses();
    await loadReport();
  });

  async function loadWarehouses() {
    try {
      const response = await api.getWarehouses();
      warehouses = response.data || [];
    } catch (err) {
      console.error('Failed to load warehouses:', err);
    }
  }

  async function loadReport() {
    loading = true;
    error = null;
    try {
      const params = {};
      if (filters.warehouseId) params.warehouseId = filters.warehouseId;
      if (filters.materialTypeId) params.materialTypeId = filters.materialTypeId;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.lowStockOnly) params.lowStockOnly = 'true';

      const response = await api.getWarehouseStockReport(params);
      reportData = response.data || [];
      summary = response.summary || {};
    } catch (err) {
      console.error('Failed to load stock report:', err);
      error = 'Failed to load stock report';
    } finally {
      loading = false;
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(value || 0);
  }

  function handleFilterChange() {
    loadReport();
  }
</script>

<svelte:head>
  <title>{$_('reports.warehouse.stockReport.pageTitle')}</title>
</svelte:head>

<div class="container mx-auto p-6">
  <!-- Header -->
  <div class="mb-6">
    <div class="flex items-center mb-2">
      <button on:click={() => goto('/dashboard')} class="text-gray-600 hover:text-gray-900 mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="text-3xl font-bold text-gray-900">{$_('reports.warehouse.stockReport.title')}</h1>
    </div>
    <p class="text-gray-600">{$_('reports.warehouse.stockReport.description')}</p>
  </div>

  <!-- Summary Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div class="text-sm font-medium text-gray-600">{$_('reports.warehouse.stockReport.totalItems')}</div>
      <div class="text-2xl font-bold text-gray-900 mt-1">{summary.totalItems || 0}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
      <div class="text-sm font-medium text-gray-600">{$_('reports.warehouse.stockReport.totalValue')}</div>
      <div class="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summary.totalValue)}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
      <div class="text-sm font-medium text-gray-600">{$_('reports.warehouse.stockReport.lowStockItems')}</div>
      <div class="text-2xl font-bold text-gray-900 mt-1">{summary.lowStockItems || 0}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
      <div class="text-sm font-medium text-gray-600">{$_('reports.warehouse.stockReport.outOfStockItems')}</div>
      <div class="text-2xl font-bold text-gray-900 mt-1">{summary.outOfStockItems || 0}</div>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('reports.warehouse.stockReport.filters.warehouse')}
        </label>
        <select bind:value={filters.warehouseId} on:change={handleFilterChange} class="input">
          <option value="">All Warehouses</option>
          {#each warehouses as warehouse}
            <option value={warehouse.id}>{warehouse.warehouseName}</option>
          {/each}
        </select>
      </div>
      <div class="flex items-end">
        <label class="flex items-center">
          <input type="checkbox" bind:checked={filters.lowStockOnly} on:change={handleFilterChange} class="rounded mr-2" />
          <span class="text-sm font-medium text-gray-700">{$_('reports.warehouse.stockReport.filters.lowStockOnly')}</span>
        </label>
      </div>
    </div>
  </div>

  <!-- Report Table -->
  {#if loading}
    <div class="bg-white rounded-lg shadow p-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading report...</p>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-800">{error}</p>
    </div>
  {:else if reportData.length === 0}
    <div class="bg-white rounded-lg shadow p-12 text-center">
      <p class="text-gray-600">No data available</p>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('reports.warehouse.stockReport.materialCode')}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('reports.warehouse.stockReport.materialName')}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('reports.warehouse.stockReport.warehouse')}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('reports.warehouse.stockReport.currentStock')}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('reports.warehouse.stockReport.criticalLevel')}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('reports.warehouse.stockReport.unit')}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('reports.warehouse.stockReport.value')}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each reportData as item}
            <tr class="hover:bg-gray-50 {item.material.currentStock <= (item.material.criticalLevel || 0) ? 'bg-yellow-50' : ''}">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.material.materialCode}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.material.materialName}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {item.warehouse?.warehouseName || '-'}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <span class="{item.material.currentStock === 0 ? 'text-red-600 font-semibold' : item.material.currentStock <= (item.material.criticalLevel || 0) ? 'text-yellow-600 font-semibold' : 'text-gray-900'}">
                  {item.material.currentStock}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                {item.material.criticalLevel || '-'}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {item.unit?.abbreviation || item.unit?.unitName || '-'}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                {formatCurrency(item.material.currentStock * (item.material.standardPrice || 0))}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
