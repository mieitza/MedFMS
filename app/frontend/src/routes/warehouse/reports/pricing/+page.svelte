<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';

  let loading = true;
  let error = null;
  let reportData = [];
  let analysisData = [];

  // Filters
  let filters = {
    materialId: '',
    supplierId: '',
    startDate: '',
    endDate: ''
  };

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    // Set default date range (last 90 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
    filters.startDate = startDate.toISOString().split('T')[0];
    filters.endDate = endDate.toISOString().split('T')[0];

    await loadReport();
  });

  async function loadReport() {
    loading = true;
    error = null;
    try {
      const params = {};
      if (filters.materialId) params.materialId = filters.materialId;
      if (filters.supplierId) params.supplierId = filters.supplierId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await api.getWarehousePricingReport(params);
      reportData = response.data || [];
      analysisData = response.analysis || [];
    } catch (err) {
      console.error('Failed to load pricing report:', err);
      error = 'Failed to load pricing report';
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

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO');
  }

  function handleFilterChange() {
    loadReport();
  }
</script>

<svelte:head>
  <title>{$_('reports.warehouse.pricingReport.pageTitle')}</title>
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
      <h1 class="text-3xl font-bold text-gray-900">{$_('reports.warehouse.pricingReport.title')}</h1>
    </div>
    <p class="text-gray-600">{$_('reports.warehouse.pricingReport.description')}</p>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('reports.warehouse.pricingReport.filters.dateRange')}
        </label>
        <div class="grid grid-cols-2 gap-2">
          <input type="date" bind:value={filters.startDate} on:change={handleFilterChange} class="input text-sm" />
          <input type="date" bind:value={filters.endDate} on:change={handleFilterChange} class="input text-sm" />
        </div>
      </div>
    </div>
  </div>

  <!-- Price Analysis Summary -->
  {#if !loading && analysisData.length > 0}
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Price Analysis Summary</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {$_('reports.warehouse.pricingReport.material')}
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                {$_('reports.warehouse.pricingReport.minPrice')}
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                {$_('reports.warehouse.pricingReport.avgPrice')}
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                {$_('reports.warehouse.pricingReport.maxPrice')}
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                {$_('reports.warehouse.pricingReport.priceVariance')}
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                {$_('reports.warehouse.pricingReport.totalQuantity')}
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                {$_('reports.warehouse.pricingReport.transactionCount')}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each analysisData as item}
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-4 text-sm">
                  <div class="font-medium text-gray-900">{item.materialName}</div>
                  <div class="text-gray-500 text-xs">{item.materialCode}</div>
                </td>
                <td class="px-4 py-4 text-sm text-right text-gray-900">
                  {formatCurrency(item.minPrice)}
                </td>
                <td class="px-4 py-4 text-sm text-right font-medium text-gray-900">
                  {formatCurrency(item.avgPrice)}
                </td>
                <td class="px-4 py-4 text-sm text-right text-gray-900">
                  {formatCurrency(item.maxPrice)}
                </td>
                <td class="px-4 py-4 text-sm text-right">
                  <span class="{item.priceVariance > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}">
                    {formatCurrency(item.priceVariance)}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm text-right text-gray-900">
                  {item.totalQuantity} {item.unitName || ''}
                </td>
                <td class="px-4 py-4 text-sm text-right text-gray-600">
                  {item.transactionCount}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  <!-- Transaction History -->
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
      <p class="text-gray-600">No pricing data available</p>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Transaction History</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warehouse
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each reportData as item}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(item.transaction.transactionDate)}
                </td>
                <td class="px-6 py-4 text-sm">
                  <div class="font-medium text-gray-900">{item.material?.materialName || '-'}</div>
                  <div class="text-gray-500 text-xs">{item.material?.materialCode || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.warehouse?.warehouseName || '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {item.transaction.quantity} {item.unit?.abbreviation || item.unit?.unitName || ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatCurrency(item.transaction.unitPrice)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                  {formatCurrency(item.transaction.totalAmount || (item.transaction.unitPrice * item.transaction.quantity))}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
