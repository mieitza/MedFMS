<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';
  import SearchableSelect from '$lib/components/SearchableSelect.svelte';

  let loading = true;
  let error = null;
  let reportData = [];
  let statistics = {};
  let warehouses = [];

  // Filters
  let filters = {
    status: '',
    transferType: '',
    sourceWarehouseId: '',
    destinationWarehouseId: '',
    startDate: '',
    endDate: ''
  };

  const statuses = ['pending', 'approved', 'in_transit', 'completed', 'rejected', 'cancelled'];
  const transferTypes = ['warehouse-to-warehouse', 'warehouse-to-vehicle', 'warehouse-to-employee', 'vehicle-to-warehouse'];

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    // Set default date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    filters.startDate = startDate.toISOString().split('T')[0];
    filters.endDate = endDate.toISOString().split('T')[0];

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
      if (filters.status) params.status = filters.status;
      if (filters.transferType) params.transferType = filters.transferType;
      if (filters.sourceWarehouseId) params.sourceWarehouseId = filters.sourceWarehouseId;
      if (filters.destinationWarehouseId) params.destinationWarehouseId = filters.destinationWarehouseId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await api.getWarehouseTransferReport(params);
      reportData = response.data || [];
      statistics = response.statistics || {};
    } catch (err) {
      console.error('Failed to load transfer report:', err);
      error = 'Failed to load transfer report';
    } finally {
      loading = false;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO');
  }

  function getStatusBadgeClass(status) {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      in_transit: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return `inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${classes[status] || ''}`;
  }

  function formatTransferType(type) {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' → ');
  }

  function handleFilterChange() {
    loadReport();
  }
</script>

<svelte:head>
  <title>{$_('maintenance.reports.warehouse.transferReport.pageTitle')}</title>
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
      <h1 class="text-3xl font-bold text-gray-900">{$_('maintenance.reports.warehouse.transferReport.title')}</h1>
    </div>
    <p class="text-gray-600">{$_('maintenance.reports.warehouse.transferReport.description')}</p>
  </div>

  <!-- Summary Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div class="text-sm font-medium text-gray-600">{$_('maintenance.reports.warehouse.transferReport.totalTransfers')}</div>
      <div class="text-2xl font-bold text-gray-900 mt-1">{statistics.totalTransfers || 0}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
      <div class="text-sm font-medium text-gray-600">Completed</div>
      <div class="text-2xl font-bold text-green-600 mt-1">{statistics.byStatus?.completed || 0}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
      <div class="text-sm font-medium text-gray-600">Pending</div>
      <div class="text-2xl font-bold text-yellow-600 mt-1">{statistics.byStatus?.pending || 0}</div>
    </div>
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
      <div class="text-sm font-medium text-gray-600">{$_('maintenance.reports.warehouse.transferReport.avgCompletionTime')}</div>
      <div class="text-2xl font-bold text-gray-900 mt-1">
        {statistics.avgCompletionTime ? statistics.avgCompletionTime.toFixed(1) : '0'} {$_('maintenance.reports.warehouse.transferReport.days')}
      </div>
    </div>
  </div>

  <!-- Statistics by Status and Type -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{$_('maintenance.reports.warehouse.transferReport.byStatus')}</h3>
      <div class="space-y-2">
        {#each Object.entries(statistics.byStatus || {}) as [status, count]}
          <div class="flex justify-between items-center">
            <span class={getStatusBadgeClass(status)}>{status}</span>
            <span class="text-lg font-semibold text-gray-900">{count}</span>
          </div>
        {/each}
      </div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{$_('maintenance.reports.warehouse.transferReport.byType')}</h3>
      <div class="space-y-2">
        {#each Object.entries(statistics.byType || {}) as [type, count]}
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-700">{formatTransferType(type)}</span>
            <span class="text-lg font-semibold text-gray-900">{count}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('maintenance.reports.warehouse.transferReport.filters.status')}
        </label>
        <select bind:value={filters.status} on:change={handleFilterChange} class="input">
          <option value="">All Statuses</option>
          {#each statuses as status}
            <option value={status}>{status}</option>
          {/each}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('maintenance.reports.warehouse.transferReport.filters.transferType')}
        </label>
        <select bind:value={filters.transferType} on:change={handleFilterChange} class="input">
          <option value="">All Types</option>
          {#each transferTypes as type}
            <option value={type}>{formatTransferType(type)}</option>
          {/each}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('maintenance.reports.warehouse.transferReport.filters.sourceWarehouse')}
        </label>
        <SearchableSelect
          options={warehouses}
          bind:value={filters.sourceWarehouseId}
          labelField="warehouseName"
          valueField="id"
          placeholder="All Sources"
          on:change={handleFilterChange}
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('maintenance.reports.warehouse.transferReport.filters.destinationWarehouse')}
        </label>
        <SearchableSelect
          options={warehouses}
          bind:value={filters.destinationWarehouseId}
          labelField="warehouseName"
          valueField="id"
          placeholder="All Destinations"
          on:change={handleFilterChange}
        />
      </div>
      <div class="col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('maintenance.reports.warehouse.transferReport.filters.dateRange')}
        </label>
        <div class="grid grid-cols-2 gap-2">
          <input type="date" bind:value={filters.startDate} on:change={handleFilterChange} class="input text-sm" />
          <input type="date" bind:value={filters.endDate} on:change={handleFilterChange} class="input text-sm" />
        </div>
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
      <p class="text-gray-600">No transfer data available</p>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.transferReport.requestNumber')}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.transferReport.transferType')}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.transferReport.material')}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destination
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.transferReport.quantity')}
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {$_('maintenance.reports.warehouse.transferReport.requestedDate')}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each reportData as item}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                {item.transferRequest.requestNumber}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatTransferType(item.transferRequest.transferType)}
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="font-medium text-gray-900">{item.material?.materialName || '-'}</div>
                <div class="text-gray-500 text-xs">{item.material?.materialCode || '-'}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {item.sourceWarehouse?.warehouseName || '-'}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {item.destinationWarehouse?.warehouseName || item.destinationVehicle?.plateNumber || '-'}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {item.transferRequest.quantity} {item.unit?.abbreviation || ''}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <span class={getStatusBadgeClass(item.transferRequest.status)}>
                  {item.transferRequest.status}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(item.transferRequest.requestedDate)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
