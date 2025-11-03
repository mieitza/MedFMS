<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import DataTable from '$lib/components/DataTable.svelte';
  import SimpleChart from '$lib/components/SimpleChart.svelte';
  import { _ } from '$lib/i18n';

  let isLoading = true;
  let reportData = {
    overview: {},
    maintenance: {},
    fleet: {},
    costs: {}
  };
  let selectedDateRange = '30';
  let customStartDate = '';
  let customEndDate = '';
  let selectedReport = 'overview';

  // Date range options - reactive to language changes
  $: dateRangeOptions = [
    { value: '7', label: $_('maintenance.reports.dateRanges.last7Days') },
    { value: '30', label: $_('maintenance.reports.dateRanges.last30Days') },
    { value: '90', label: $_('maintenance.reports.dateRanges.last90Days') },
    { value: '365', label: $_('maintenance.reports.dateRanges.lastYear') },
    { value: 'custom', label: $_('maintenance.reports.dateRanges.customRange') }
  ];

  // Report type options - reactive to language changes
  $: reportTypes = [
    { value: 'overview', label: $_('maintenance.reports.reportTypes.overview'), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { value: 'maintenance', label: $_('maintenance.reports.reportTypes.maintenanceAnalytics'), icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { value: 'fleet', label: $_('maintenance.reports.reportTypes.fleetPerformance'), icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
    { value: 'costs', label: $_('maintenance.reports.reportTypes.costAnalysis'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' }
  ];

  onMount(async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    await loadReportData();
  });

  async function loadReportData() {
    isLoading = true;
    try {
      const dateParams = getDateParams();

      // Load different types of report data using new APIs
      const [overviewData, maintenanceData, fleetData, costsData] = await Promise.all([
        api.getFleetOverviewReport(dateParams),
        api.getMaintenanceAnalyticsReport(dateParams),
        api.getFleetOverviewReport(dateParams), // Fleet data comes from overview
        api.getCostAnalysisReport(dateParams)
      ]);

      reportData = {
        overview: overviewData.data || {},
        maintenance: maintenanceData.data || {},
        fleet: overviewData.data || {},
        costs: costsData.data || {}
      };
    } catch (error) {
      console.error('Failed to load report data:', error);
      // Fallback to existing simple data loading
      await loadFallbackData();
    } finally {
      isLoading = false;
    }
  }

  function getDateParams() {
    const params = {};

    if (selectedDateRange === 'custom' && customStartDate && customEndDate) {
      params.startDate = customStartDate;
      params.endDate = customEndDate;
    } else if (selectedDateRange !== 'custom') {
      const days = parseInt(selectedDateRange);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      params.startDate = startDate.toISOString().split('T')[0];
      params.endDate = endDate.toISOString().split('T')[0];
    }

    return params;
  }

  async function loadFallbackData() {
    // Load data sequentially to avoid rate limiting
    const overviewData = await loadOverviewDataFallback();

    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
    const maintenanceData = await loadMaintenanceDataFallback();

    await new Promise(resolve => setTimeout(resolve, 100));
    const fleetData = await loadFleetDataFallback();

    await new Promise(resolve => setTimeout(resolve, 100));
    const costsData = await loadCostsDataFallback();

    reportData = {
      overview: overviewData,
      maintenance: maintenanceData,
      fleet: fleetData,
      costs: costsData
    };
  }

  async function loadOverviewDataFallback() {
    try {
      // Use existing APIs and aggregate data (reduce limit to avoid rate limiting)
      const [vehicles, maintenanceDashboard] = await Promise.all([
        api.getVehicles({ limit: 100 }),
        api.getMaintenanceDashboard()
      ]);

      return {
        totalVehicles: vehicles.pagination?.total || vehicles.data?.length || 0,
        activeVehicles: vehicles.data?.filter(v => v.status === 'active').length || 0,
        inMaintenanceVehicles: vehicles.data?.filter(v => v.status === 'maintenance').length || 0,
        ...maintenanceDashboard.data
      };
    } catch (error) {
      console.error('Error loading overview data:', error);
      return {};
    }
  }

  async function loadMaintenanceDataFallback() {
    try {
      const [workOrders, history] = await Promise.all([
        api.getMaintenanceWorkOrders({ limit: 100 }),
        api.getMaintenanceHistory({ limit: 100 })
      ]);

      const workOrdersByStatus = workOrders.data?.reduce((acc, wo) => {
        const status = wo.workOrder?.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}) || {};

      const avgCostPerWorkOrder = workOrders.data?.reduce((sum, wo) => {
        return sum + (parseFloat(wo.workOrder?.estimatedCost || 0));
      }, 0) / (workOrders.data?.length || 1) || 0;

      return {
        totalWorkOrders: workOrders.data?.length || 0,
        workOrdersByStatus,
        avgCostPerWorkOrder,
        totalMaintenanceRecords: history.data?.length || 0,
        recentWorkOrders: workOrders.data?.slice(0, 10) || []
      };
    } catch (error) {
      console.error('Error loading maintenance data:', error);
      return {};
    }
  }

  async function loadFleetDataFallback() {
    try {
      const vehicles = await api.getVehicles({ limit: 100 });

      const vehiclesByType = vehicles.data?.reduce((acc, vehicle) => {
        const type = vehicle.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}) || {};

      const vehiclesByYear = vehicles.data?.reduce((acc, vehicle) => {
        const year = vehicle.year || 'Unknown';
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalVehicles: vehicles.data?.length || 0,
        vehiclesByType,
        vehiclesByYear,
        avgVehicleAge: calculateAvgVehicleAge(vehicles.data || []),
        newestVehicles: vehicles.data?.sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, 5) || []
      };
    } catch (error) {
      console.error('Error loading fleet data:', error);
      return {};
    }
  }

  async function loadCostsDataFallback() {
    try {
      const workOrders = await api.getMaintenanceWorkOrders({ limit: 100 });

      const totalMaintenanceCost = workOrders.data?.reduce((sum, wo) => {
        return sum + (parseFloat(wo.workOrder?.estimatedCost || 0));
      }, 0) || 0;

      const costsByMonth = {}; // This would need more sophisticated date handling
      const costsByVehicle = workOrders.data?.reduce((acc, wo) => {
        const vehicleCode = wo.vehicle?.vehicleCode || 'Unknown';
        const cost = parseFloat(wo.workOrder?.estimatedCost || 0);
        acc[vehicleCode] = (acc[vehicleCode] || 0) + cost;
        return acc;
      }, {}) || {};

      return {
        totalMaintenanceCost,
        avgCostPerVehicle: totalMaintenanceCost / Math.max(Object.keys(costsByVehicle).length, 1),
        costsByMonth,
        costsByVehicle,
        highestCostVehicles: Object.entries(costsByVehicle)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
      };
    } catch (error) {
      console.error('Error loading costs data:', error);
      return {};
    }
  }

  function calculateAvgVehicleAge(vehicles) {
    const currentYear = new Date().getFullYear();
    const totalAge = vehicles.reduce((sum, vehicle) => {
      return sum + (currentYear - (vehicle.year || currentYear));
    }, 0);
    return vehicles.length ? (totalAge / vehicles.length).toFixed(1) : 0;
  }

  function handleDateRangeChange() {
    if (selectedDateRange !== 'custom') {
      customStartDate = '';
      customEndDate = '';
    }
    loadReportData();
  }

  function exportReport() {
    // Export functionality would go here
    alert($_('maintenance.reports.messages.exportNotImplemented'));
  }

  $: currentReportData = reportData[selectedReport] || {};
</script>

<svelte:head>
  <title>{$_('maintenance.reports.pageTitle')}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="/dashboard" class="text-2xl font-bold text-primary-900">{$_('common.appName')}</a>
          <nav class="ml-8">
            <ol class="flex items-center space-x-2 text-sm">
              <li><a href="/dashboard" class="text-gray-500 hover:text-gray-700">{$_('dashboard.title')}</a></li>
              <li class="text-gray-500">/</li>
              <li class="text-gray-900 font-medium">{$_('maintenance.reports.title')}</li>
            </ol>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <button
            on:click={exportReport}
            class="btn btn-secondary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            {$_('maintenance.reports.exportReport')}
          </button>
          <a
            href="/dashboard"
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {$_('maintenance.reports.backToDashboard')}
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Controls -->
    <div class="bg-white p-6 rounded-lg shadow border mb-6">
      <h2 class="text-lg font-semibold mb-4">{$_('maintenance.reports.configuration.title')}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Report Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{$_('maintenance.reports.configuration.reportType')}</label>
          <select
            bind:value={selectedReport}
            on:change={loadReportData}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each reportTypes as type}
              <option value={type.value}>{type.label}</option>
            {/each}
          </select>
        </div>

        <!-- Date Range Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{$_('maintenance.reports.configuration.dateRange')}</label>
          <select
            bind:value={selectedDateRange}
            on:change={handleDateRangeChange}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each dateRangeOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <!-- Custom Date Range -->
        {#if selectedDateRange === 'custom'}
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{$_('maintenance.reports.configuration.startDate')}</label>
              <input
                type="date"
                bind:value={customStartDate}
                on:change={loadReportData}
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{$_('maintenance.reports.configuration.endDate')}</label>
              <input
                type="date"
                bind:value={customEndDate}
                on:change={loadReportData}
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        {/if}
      </div>
    </div>

    {#if isLoading}
      <div class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    {:else}
      <!-- Report Content -->
      {#if selectedReport === 'overview'}
        <!-- Overview Dashboard -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-900">{$_('maintenance.reports.overview.title')}</h3>

          <!-- Key Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-lg shadow border">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">{$_('maintenance.reports.overview.totalVehicles')}</p>
                  <p class="text-2xl font-bold text-gray-900">{currentReportData.totalVehicles || 0}</p>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow border">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">{$_('maintenance.reports.overview.activeVehicles')}</p>
                  <p class="text-2xl font-bold text-gray-900">{currentReportData.activeVehicles || 0}</p>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow border">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">{$_('maintenance.reports.overview.pendingWorkOrders')}</p>
                  <p class="text-2xl font-bold text-gray-900">{currentReportData.pendingWorkOrders || 0}</p>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow border">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-red-100 text-red-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">{$_('maintenance.reports.overview.overdueMaintenance')}</p>
                  <p class="text-2xl font-bold text-gray-900">{currentReportData.overdueMaintenance || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {:else if selectedReport === 'maintenance'}
        <!-- Maintenance Analytics -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-900">{$_('maintenance.reports.maintenance.title')}</h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Work Orders by Status -->
            <div class="bg-white p-6 rounded-lg shadow border">
              <h4 class="text-lg font-medium text-gray-900 mb-4">{$_('maintenance.reports.maintenance.workOrdersByStatus')}</h4>
              {#if currentReportData.workOrdersByStatus}
                <div class="space-y-2">
                  {#each Object.entries(currentReportData.workOrdersByStatus) as [status, count]}
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                      <span class="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="text-gray-500">{$_('maintenance.reports.maintenance.noDataAvailable')}</p>
              {/if}
            </div>

            <!-- Maintenance Summary -->
            <div class="bg-white p-6 rounded-lg shadow border">
              <h4 class="text-lg font-medium text-gray-900 mb-4">{$_('maintenance.reports.maintenance.maintenanceSummary')}</h4>
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{$_('maintenance.reports.maintenance.totalWorkOrders')}</span>
                  <span class="text-sm font-medium">{currentReportData.totalWorkOrders || 0}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{$_('maintenance.reports.maintenance.avgCostPerWorkOrder')}</span>
                  <span class="text-sm font-medium">{(currentReportData.avgCostPerWorkOrder || 0).toFixed(2)} RON</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{$_('maintenance.reports.maintenance.totalMaintenanceRecords')}</span>
                  <span class="text-sm font-medium">{currentReportData.totalMaintenanceRecords || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      {:else if selectedReport === 'fleet'}
        <!-- Fleet Performance -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-900">{$_('maintenance.reports.fleet.title')}</h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Vehicles by Type -->
            <div class="bg-white p-6 rounded-lg shadow border">
              <h4 class="text-lg font-medium text-gray-900 mb-4">{$_('maintenance.reports.fleet.compositionByType')}</h4>
              {#if currentReportData.vehiclesByType}
                <div class="space-y-2">
                  {#each Object.entries(currentReportData.vehiclesByType) as [type, count]}
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-600">{type}</span>
                      <span class="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="text-gray-500">{$_('maintenance.reports.maintenance.noDataAvailable')}</p>
              {/if}
            </div>

            <!-- Fleet Age Analysis -->
            <div class="bg-white p-6 rounded-lg shadow border">
              <h4 class="text-lg font-medium text-gray-900 mb-4">{$_('maintenance.reports.fleet.fleetAgeAnalysis')}</h4>
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{$_('maintenance.reports.fleet.avgVehicleAge')}</span>
                  <span class="text-sm font-medium">{currentReportData.avgVehicleAge || 0} {$_('maintenance.reports.fleet.years')}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{$_('maintenance.reports.fleet.totalFleetSize')}</span>
                  <span class="text-sm font-medium">{currentReportData.totalVehicles || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      {:else if selectedReport === 'costs'}
        <!-- Cost Analysis -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-900">{$_('maintenance.reports.costs.title')}</h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Total Costs -->
            <div class="bg-white p-6 rounded-lg shadow border">
              <h4 class="text-lg font-medium text-gray-900 mb-4">{$_('maintenance.reports.costs.maintenanceCostsOverview')}</h4>
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{$_('maintenance.reports.costs.totalMaintenanceCost')}</span>
                  <span class="text-sm font-medium">{(currentReportData.totalMaintenanceCost || 0).toFixed(2)} RON</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">{$_('maintenance.reports.costs.avgCostPerVehicle')}</span>
                  <span class="text-sm font-medium">{(currentReportData.avgCostPerVehicle || 0).toFixed(2)} RON</span>
                </div>
              </div>
            </div>

            <!-- Highest Cost Vehicles -->
            <div class="bg-white p-6 rounded-lg shadow border">
              <h4 class="text-lg font-medium text-gray-900 mb-4">{$_('maintenance.reports.costs.highestCostVehicles')}</h4>
              {#if currentReportData.highestCostVehicles}
                <div class="space-y-2">
                  {#each currentReportData.highestCostVehicles as [vehicle, cost]}
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-600">{vehicle}</span>
                      <span class="text-sm font-bold text-gray-900">{cost.toFixed(2)} RON</span>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="text-gray-500">{$_('maintenance.reports.maintenance.noDataAvailable')}</p>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </main>
</div>