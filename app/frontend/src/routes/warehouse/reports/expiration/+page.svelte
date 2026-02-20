<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';
  import SearchableSelect from '$lib/components/SearchableSelect.svelte';

  let loading = true;
  let error = null;
  let reportData = [];
  let summary = {};
  let warehouses = [];

  // Filters
  let filters = {
    warehouseId: '',
    daysThreshold: 30,
    includeExpired: true
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
      const params = {
        daysThreshold: filters.daysThreshold,
        includeExpired: filters.includeExpired
      };
      if (filters.warehouseId) params.warehouseId = filters.warehouseId;

      const response = await api.getProductExpirationReport(params);
      reportData = response.data || [];
      summary = response.summary || {};
    } catch (err) {
      console.error('Failed to load expiration report:', err);
      error = 'Failed to load expiration report';
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

  function getExpirationBadgeClass(item) {
    if (item.isExpired) {
      return 'bg-red-100 text-red-800 border border-red-200';
    } else if (item.daysUntilExpiry !== null && item.daysUntilExpiry <= 7) {
      return 'bg-red-100 text-red-800 border border-red-200';
    } else if (item.daysUntilExpiry !== null && item.daysUntilExpiry <= 30) {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
    return 'bg-green-100 text-green-800 border border-green-200';
  }

  function getRowClass(item) {
    if (item.isExpired) return 'bg-red-50';
    if (item.daysUntilExpiry !== null && item.daysUntilExpiry <= 7) return 'bg-red-50';
    if (item.daysUntilExpiry !== null && item.daysUntilExpiry <= 30) return 'bg-yellow-50';
    return '';
  }

  function handleFilterChange() {
    loadReport();
  }
</script>

<svelte:head>
  <title>{$_('maintenance.reports.warehouse.expirationReport.pageTitle')}</title>
</svelte:head>

<div class="container mx-auto p-6">
  <!-- Header -->
  <div class="mb-6">
    <div class="flex items-center mb-2">
      <button on:click={() => goto('/warehouse/reports')} class="text-gray-600 hover:text-gray-900 mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="text-3xl font-bold text-gray-900">{$_('maintenance.reports.warehouse.expirationReport.title')}</h1>
    </div>
    <p class="text-gray-600">{$_('maintenance.reports.warehouse.expirationReport.description')}</p>
  </div>

  <!-- Summary Cards -->
  <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div class="text-sm font-medium text-gray-600">{$_('maintenance.reports.warehouse.expirationReport.totalItems')}</div>
      <div class="text-2xl font-bold text-gray-900 mt-1">{summary.totalItems || 0}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
      <div class="text-sm font-medium text-gray-600">{$_('maintenance.reports.warehouse.expirationReport.expiredCount')}</div>
      <div class="text-2xl font-bold text-red-600 mt-1">{summary.expiredCount || 0}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
      <div class="text-sm font-medium text-gray-600">{$_('maintenance.reports.warehouse.expirationReport.expiringSoonCount')}</div>
      <div class="text-2xl font-bold text-yellow-600 mt-1">{summary.expiringSoonCount || 0}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
      <div class="text-sm font-medium text-gray-600">{$_('maintenance.reports.warehouse.expirationReport.totalValue')}</div>
      <div class="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summary.totalValue)}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
      <div class="text-sm font-medium text-gray-600">{$_('maintenance.reports.warehouse.expirationReport.expiredValue')}</div>
      <div class="text-2xl font-bold text-red-600 mt-1">{formatCurrency(summary.expiredValue)}</div>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('maintenance.reports.warehouse.expirationReport.filters.warehouse')}
        </label>
        <SearchableSelect
          options={warehouses}
          bind:value={filters.warehouseId}
          labelField="warehouseName"
          valueField="id"
          placeholder="All Warehouses"
          on:change={handleFilterChange}
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('maintenance.reports.warehouse.expirationReport.filters.daysThreshold')}
        </label>
        <input type="number" bind:value={filters.daysThreshold} on:change={handleFilterChange} min="1" max="365" class="input" />
      </div>
      <div class="flex items-end">
        <label class="flex items-center">
          <input type="checkbox" bind:checked={filters.includeExpired} on:change={handleFilterChange} class="rounded mr-2" />
          <span class="text-sm font-medium text-gray-700">{$_('maintenance.reports.warehouse.expirationReport.filters.includeExpired')}</span>
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
      <p class="text-gray-600">No expiring products found</p>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.expirationReport.materialCode')}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.expirationReport.materialName')}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.expirationReport.warehouse')}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.expirationReport.currentStock')}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.expirationReport.expirationDate')}
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.expirationReport.daysUntilExpiry')}
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.expirationReport.status')}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.expirationReport.value')}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each reportData as item}
            <tr class="hover:bg-gray-50 {getRowClass(item)}">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.material.materialCode}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.material.materialName}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {item.warehouse?.warehouseName || '-'}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {item.material.currentStock}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(item.material.expirationDate)}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <span class="font-semibold {item.isExpired ? 'text-red-600' : item.daysUntilExpiry <= 7 ? 'text-red-600' : item.daysUntilExpiry <= 30 ? 'text-yellow-600' : 'text-green-600'}">
                  {item.daysUntilExpiry !== null ? item.daysUntilExpiry : '-'}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getExpirationBadgeClass(item)}">
                  {item.isExpired ? $_('maintenance.reports.warehouse.expirationReport.expired') : $_('maintenance.reports.warehouse.expirationReport.expiringSoon')}
                </span>
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
