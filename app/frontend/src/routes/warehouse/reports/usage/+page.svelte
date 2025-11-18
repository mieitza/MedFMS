<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';

  let loading = true;
  let error = null;
  let reportData = null;
  let warehouses = [];

  // Filters
  let filters = {
    warehouseId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    useCustomDates: false,
    startDate: '',
    endDate: ''
  };

  // Generate month and year options
  const months = [
    { value: 1, label: 'Ianuarie' },
    { value: 2, label: 'Februarie' },
    { value: 3, label: 'Martie' },
    { value: 4, label: 'Aprilie' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Iunie' },
    { value: 7, label: 'Iulie' },
    { value: 8, label: 'August' },
    { value: 9, label: 'Septembrie' },
    { value: 10, label: 'Octombrie' },
    { value: 11, label: 'Noiembrie' },
    { value: 12, label: 'Decembrie' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Category emoji mapping
  const categoryEmojis = {
    'MEDICATIE': '💊',
    'MATERIALE SANITARE': '🏥',
    'ECHIPAMENTE': '🔧',
    'CONSUMABILE': '📦',
    'DEZINFECTANTE': '🧴',
    'INSTRUMENTE': '⚕️',
    'PROTECTIVE': '🦺'
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

      if (filters.useCustomDates) {
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
      } else {
        params.month = filters.month;
        params.year = filters.year;
      }

      const response = await api.getMaterialUsageReport(params);
      reportData = response;
    } catch (err) {
      console.error('Failed to load usage report:', err);
      error = 'Failed to load usage report';
    } finally {
      loading = false;
    }
  }

  function handleFilterChange() {
    loadReport();
  }

  function getCategoryEmoji(categoryName) {
    const upperCat = categoryName.toUpperCase();
    for (const [key, emoji] of Object.entries(categoryEmojis)) {
      if (upperCat.includes(key)) return emoji;
    }
    return '📊';
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('ro-RO').format(value || 0);
  }

  function formatPercent(value) {
    return `${(value || 0).toFixed(1)}%`;
  }
</script>

<svelte:head>
  <title>Raport Utilizare Materiale - MedFMS</title>
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
      <h1 class="text-3xl font-bold text-gray-900">Raport Utilizare Materiale</h1>
    </div>
    <p class="text-gray-600">Analiză detaliată a consumului de materiale pe categorii</p>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-lg font-semibold mb-4">Filtre</h2>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <!-- Warehouse Filter -->
      <div>
        <label for="warehouse" class="block text-sm font-medium text-gray-700 mb-1">Depozit</label>
        <select
          id="warehouse"
          bind:value={filters.warehouseId}
          on:change={handleFilterChange}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toate depozitele</option>
          {#each warehouses as warehouse}
            <option value={warehouse.id}>{warehouse.warehouseName}</option>
          {/each}
        </select>
      </div>

      <!-- Date Mode Toggle -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Mod dată</label>
        <select
          bind:value={filters.useCustomDates}
          on:change={handleFilterChange}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={false}>Lună selectată</option>
          <option value={true}>Interval personalizat</option>
        </select>
      </div>

      {#if !filters.useCustomDates}
        <!-- Month Filter -->
        <div>
          <label for="month" class="block text-sm font-medium text-gray-700 mb-1">Lună</label>
          <select
            id="month"
            bind:value={filters.month}
            on:change={handleFilterChange}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each months as month}
              <option value={month.value}>{month.label}</option>
            {/each}
          </select>
        </div>

        <!-- Year Filter -->
        <div>
          <label for="year" class="block text-sm font-medium text-gray-700 mb-1">An</label>
          <select
            id="year"
            bind:value={filters.year}
            on:change={handleFilterChange}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each years as year}
              <option value={year}>{year}</option>
            {/each}
          </select>
        </div>
      {:else}
        <!-- Start Date -->
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Data început</label>
          <input
            id="startDate"
            type="date"
            bind:value={filters.startDate}
            on:change={handleFilterChange}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- End Date -->
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">Data sfârșit</label>
          <input
            id="endDate"
            type="date"
            bind:value={filters.endDate}
            on:change={handleFilterChange}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      {/if}
    </div>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Se încarcă raportul...</p>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-600">{error}</p>
    </div>
  {:else if reportData}
    <!-- Period Info -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="text-blue-900 font-medium">Perioadă raport: {reportData.period?.description || 'N/A'}</span>
      </div>
    </div>

    <!-- Overall Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <div class="text-sm font-medium text-gray-600">Total Materiale</div>
        <div class="text-2xl font-bold text-gray-900 mt-1">{formatNumber(reportData.overallStats?.totalMaterials)}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div class="text-sm font-medium text-gray-600">Materiale Utilizate</div>
        <div class="text-2xl font-bold text-gray-900 mt-1">{formatNumber(reportData.overallStats?.totalActivelyUsed)}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
        <div class="text-sm font-medium text-gray-600">Consum Total</div>
        <div class="text-2xl font-bold text-gray-900 mt-1">{formatNumber(reportData.overallStats?.totalUsage)}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
        <div class="text-sm font-medium text-gray-600">Probleme Critice</div>
        <div class="text-2xl font-bold text-red-600 mt-1">
          {formatNumber((reportData.overallStats?.totalNegativeStock || 0) + (reportData.overallStats?.totalDepleted || 0))}
        </div>
      </div>
    </div>

    <!-- Category Reports -->
    {#if reportData.categories && reportData.categories.length > 0}
      <div class="space-y-6">
        {#each reportData.categories as category}
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <!-- Category Header -->
            <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-4xl mr-3">{getCategoryEmoji(category.categoryName)}</span>
                  <div>
                    <h2 class="text-2xl font-bold">{category.categoryName}</h2>
                    <p class="text-orange-100 text-sm mt-1">
                      {category.overview.activelyUsed} din {category.overview.totalItems} materiale utilizate
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold">{formatNumber(category.overview.totalUsage)}</div>
                  <div class="text-orange-100 text-sm">unități consumate</div>
                </div>
              </div>
            </div>

            <!-- Category Content -->
            <div class="p-6">
              <!-- Overview Stats -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="text-sm text-gray-600">Total articole</div>
                  <div class="text-xl font-bold text-gray-900">{category.overview.totalItems}</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="text-sm text-gray-600">Articole utilizate activ</div>
                  <div class="text-xl font-bold text-green-600">{category.overview.activelyUsed}</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="text-sm text-gray-600">Rată medie de utilizare</div>
                  <div class="text-xl font-bold text-blue-600">{formatPercent(category.overview.avgUsageRate)}</div>
                </div>
              </div>

              <!-- Top Used Items -->
              {#if category.topUsed && category.topUsed.length > 0}
                <div class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">🏆 Top 10 Materiale Cel Mai Utilizate</h3>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cod</th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denumire</th>
                          <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantitate</th>
                          <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rată consum</th>
                          <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stoc curent</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        {#each category.topUsed as item, index}
                          <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-sm font-bold text-gray-900">{index + 1}</td>
                            <td class="px-4 py-3 text-sm text-gray-600">{item.materialCode}</td>
                            <td class="px-4 py-3 text-sm text-gray-900">{item.materialName}</td>
                            <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                              {formatNumber(item.quantity)} {item.unit}
                            </td>
                            <td class="px-4 py-3 text-sm text-right">
                              <span class="font-semibold {item.usageRate > 100 ? 'text-red-600' : item.usageRate > 50 ? 'text-orange-600' : 'text-green-600'}">
                                {formatPercent(item.usageRate)}
                              </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-right">
                              <span class="{item.currentStock < 0 ? 'text-red-600 font-bold' : 'text-gray-900'}">
                                {formatNumber(item.currentStock)} {item.unit}
                              </span>
                            </td>
                            <td class="px-4 py-3 text-center">
                              {#if item.isNegativeStock}
                                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Negativ</span>
                              {:else if item.isOverCapacity}
                                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Supra-consum</span>
                              {:else}
                                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">OK</span>
                              {/if}
                            </td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
              {/if}

              <!-- Critical Issues -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">⚠️ Probleme Critice</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="text-sm text-red-600 font-medium">Stoc Negativ</div>
                    <div class="text-2xl font-bold text-red-700">{category.criticalIssues.negativeStockCount}</div>
                  </div>
                  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="text-sm text-yellow-700 font-medium">Stoc Scăzut</div>
                    <div class="text-2xl font-bold text-yellow-800">{category.criticalIssues.lowStockCount}</div>
                  </div>
                  <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div class="text-sm text-orange-600 font-medium">Consum Ridicat</div>
                    <div class="text-2xl font-bold text-orange-700">{category.criticalIssues.highUsageCount}</div>
                  </div>
                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div class="text-sm text-gray-600 font-medium">Epuizate</div>
                    <div class="text-2xl font-bold text-gray-700">{category.criticalIssues.depletedCount}</div>
                  </div>
                </div>

                <!-- Negative Stock Items Detail -->
                {#if category.criticalIssues.negativeStockItems && category.criticalIssues.negativeStockItems.length > 0}
                  <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 class="font-semibold text-red-900 mb-2">Articole cu Stoc Negativ:</h4>
                    <ul class="space-y-1">
                      {#each category.criticalIssues.negativeStockItems as item}
                        <li class="text-sm text-red-800">
                          <span class="font-mono">{item.materialCode}</span> - {item.materialName}:
                          <span class="font-bold">{formatNumber(item.currentStock)} {item.unit}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}

                <!-- Depleted Items Detail -->
                {#if category.criticalIssues.depletedItems && category.criticalIssues.depletedItems.length > 0}
                  <div class="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
                    <h4 class="font-semibold text-gray-900 mb-2">Articole Epuizate:</h4>
                    <ul class="space-y-1">
                      {#each category.criticalIssues.depletedItems as item}
                        <li class="text-sm text-gray-700">
                          <span class="font-mono">{item.materialCode}</span> - {item.materialName}
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}

                <!-- Over-capacity Items Detail -->
                {#if category.criticalIssues.overCapacityItems && category.criticalIssues.overCapacityItems.length > 0}
                  <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 class="font-semibold text-orange-900 mb-2">Articole cu Supra-consum (>100%):</h4>
                    <ul class="space-y-1">
                      {#each category.criticalIssues.overCapacityItems as item}
                        <li class="text-sm text-orange-800">
                          <span class="font-mono">{item.materialCode}</span> - {item.materialName}:
                          <span class="font-bold">{formatPercent(item.usageRate)}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-gray-600">Nu există date pentru perioada selectată</p>
      </div>
    {/if}
  {/if}
</div>
