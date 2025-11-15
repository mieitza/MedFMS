<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';
  import DataTable from '$lib/components/DataTable.svelte';

  let isLoading = true;
  let vehicles = [];
  let selectedVehicleId = '';
  let customStartDate = '';
  let customEndDate = '';
  let dailyStats = [];
  let totalStats = {
    totalDistance: 0,
    totalFuel: 0,
    totalCost: 0,
    avgConsumption: 0,
    totalDays: 0
  };

  // Data table columns
  const columns = [
    {
      key: 'date',
      label: $_('fuel.date'),
      sortable: true,
      render: (value) => {
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    },
    {
      key: 'distance',
      label: 'Km',
      sortable: true,
      render: (value) => value ? `${parseFloat(value).toFixed(2)} km` : 'N/A'
    },
    {
      key: 'fuelUsed',
      label: $_('fuel.quantity') + ' (L)',
      sortable: true,
      render: (value) => value ? `${parseFloat(value).toFixed(2)} L` : 'N/A'
    },
    {
      key: 'consumption',
      label: 'Consum (L/100km)',
      sortable: true,
      render: (value) => value ? `${parseFloat(value).toFixed(2)} L/100km` : 'N/A'
    },
    {
      key: 'cost',
      label: $_('fuel.totalAmount'),
      sortable: true,
      render: (value) => value ? `${parseFloat(value).toFixed(2)} RON` : 'N/A'
    },
    {
      key: 'costPerKm',
      label: 'Cost/km',
      sortable: true,
      render: (value) => value ? `${parseFloat(value).toFixed(2)} RON/km` : 'N/A'
    },
    {
      key: 'transactions',
      label: 'Alimentări',
      sortable: true,
      render: (value) => value || '0'
    }
  ];

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    // Set default dates - last 30 days
    const today = new Date();
    customEndDate = today.toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    customStartDate = thirtyDaysAgo.toISOString().split('T')[0];

    await loadVehicles();
  });

  async function loadVehicles() {
    try {
      const response = await api.getVehicles({ limit: 1000 });
      vehicles = response.data || [];
    } catch (error) {
      console.error('Failed to load vehicles:', error);
      vehicles = [];
    }
  }

  async function loadDailyStats() {
    if (!selectedVehicleId) {
      alert($_('fuel.placeholders.selectVehicle'));
      return;
    }

    isLoading = true;
    try {
      const params = {
        vehicleId: parseInt(selectedVehicleId),
        limit: 10000
      };

      if (customStartDate) {
        params.startDate = customStartDate;
      }
      if (customEndDate) {
        params.endDate = customEndDate;
      }

      const response = await api.getFuelTransactions(params);
      const transactions = response.data || [];

      // Sort transactions by date
      const sortedTransactions = [...transactions].sort((a, b) =>
        new Date(a.transactionDate) - new Date(b.transactionDate)
      );

      // Group transactions by day and calculate daily statistics
      const dailyMap = {};

      sortedTransactions.forEach((transaction, index) => {
        const date = new Date(transaction.transactionDate).toISOString().split('T')[0];

        if (!dailyMap[date]) {
          dailyMap[date] = {
            date,
            transactions: [],
            fuelUsed: 0,
            cost: 0,
            minOdometer: null,
            maxOdometer: null
          };
        }

        dailyMap[date].transactions.push(transaction);
        dailyMap[date].fuelUsed += parseFloat(transaction.quantity || 0);
        dailyMap[date].cost += parseFloat(transaction.totalAmount || 0);

        const odometer = parseFloat(transaction.odometerReading || 0);
        if (odometer > 0) {
          if (dailyMap[date].minOdometer === null || odometer < dailyMap[date].minOdometer) {
            dailyMap[date].minOdometer = odometer;
          }
          if (dailyMap[date].maxOdometer === null || odometer > dailyMap[date].maxOdometer) {
            dailyMap[date].maxOdometer = odometer;
          }
        }
      });

      // Calculate daily statistics
      const dailyData = Object.values(dailyMap).map(day => {
        // Distance traveled on this day
        let distance = 0;
        if (day.maxOdometer !== null && day.minOdometer !== null) {
          distance = day.maxOdometer - day.minOdometer;
        }

        // Consumption (L/100km)
        const consumption = distance > 0 ? (day.fuelUsed / distance) * 100 : null;

        // Cost per km
        const costPerKm = distance > 0 ? day.cost / distance : null;

        return {
          date: day.date,
          distance,
          fuelUsed: day.fuelUsed,
          consumption,
          cost: day.cost,
          costPerKm,
          transactions: day.transactions.length
        };
      });

      dailyStats = dailyData.sort((a, b) => b.date.localeCompare(a.date));

      // Calculate total statistics
      const validConsumptions = dailyStats
        .filter(d => d.consumption !== null && d.consumption > 0)
        .map(d => d.consumption);

      totalStats = {
        totalDistance: dailyStats.reduce((sum, d) => sum + d.distance, 0),
        totalFuel: dailyStats.reduce((sum, d) => sum + d.fuelUsed, 0),
        totalCost: dailyStats.reduce((sum, d) => sum + d.cost, 0),
        avgConsumption: validConsumptions.length > 0
          ? validConsumptions.reduce((sum, c) => sum + c, 0) / validConsumptions.length
          : 0,
        totalDays: dailyStats.length
      };

    } catch (error) {
      console.error('Failed to load daily statistics:', error);
      dailyStats = [];
      totalStats = {
        totalDistance: 0,
        totalFuel: 0,
        totalCost: 0,
        avgConsumption: 0,
        totalDays: 0
      };
    } finally {
      isLoading = false;
    }
  }

  function exportToCSV() {
    if (dailyStats.length === 0) {
      alert($_('fuel.reports.messages.noDataToExport'));
      return;
    }

    // Create CSV content
    const headers = [
      'Data',
      'Km Parcurși',
      'Combustibil Folosit (L)',
      'Consum (L/100km)',
      'Cost Total (RON)',
      'Cost/km (RON)',
      'Număr Alimentări'
    ];

    const rows = dailyStats.map(d => {
      const date = new Date(d.date);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      return [
        formattedDate,
        d.distance ? d.distance.toFixed(2) : 'N/A',
        d.fuelUsed ? d.fuelUsed.toFixed(2) : 'N/A',
        d.consumption ? d.consumption.toFixed(2) : 'N/A',
        d.cost ? d.cost.toFixed(2) : 'N/A',
        d.costPerKm ? d.costPerKm.toFixed(2) : 'N/A',
        d.transactions
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    const vehicle = vehicles.find(v => v.id === parseInt(selectedVehicleId));
    const vehicleName = vehicle ? vehicle.vehicleCode : 'vehicle';
    link.download = `raport-zilnic-${vehicleName}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  function getVehicleName() {
    const vehicle = vehicles.find(v => v.id === parseInt(selectedVehicleId));
    return vehicle ? `${vehicle.vehicleCode} - ${vehicle.licensePlate}` : '';
  }
</script>

<svelte:head>
  <title>Raport Zilnic Vehicule - MedFMS</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">
      Raport Zilnic Vehicule
    </h1>
    <p class="text-gray-600">
      Statistici zilnice: km parcurși, combustibil consumat și consum mediu per 100km
    </p>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">{$_('common.filters')}</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Vehicle Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {$_('fuel.vehicle')} *
        </label>
        <select
          bind:value={selectedVehicleId}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{$_('fuel.placeholders.selectVehicle')}</option>
          {#each vehicles as vehicle}
            <option value={vehicle.id}>
              {vehicle.vehicleCode} - {vehicle.licensePlate}
            </option>
          {/each}
        </select>
      </div>

      <!-- Start Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {$_('fuel.reports.startDate')}
        </label>
        <input
          type="date"
          bind:value={customStartDate}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- End Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {$_('fuel.reports.endDate')}
        </label>
        <input
          type="date"
          bind:value={customEndDate}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Generate Button -->
      <div class="flex items-end">
        <button
          on:click={loadDailyStats}
          disabled={!selectedVehicleId}
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Generează Raport
        </button>
      </div>
    </div>
  </div>

  {#if selectedVehicleId && dailyStats.length > 0}
    <!-- Vehicle Name -->
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-gray-900">
        {getVehicleName()}
      </h2>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">Zile cu Date</div>
        <div class="text-2xl font-bold text-blue-600">{totalStats.totalDays}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">Total Km</div>
        <div class="text-2xl font-bold text-green-600">{totalStats.totalDistance.toFixed(2)}</div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">Total Combustibil</div>
        <div class="text-2xl font-bold text-purple-600">{totalStats.totalFuel.toFixed(2)} L</div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">Consum Mediu</div>
        <div class="text-2xl font-bold text-orange-600">{totalStats.avgConsumption.toFixed(2)} L/100km</div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-sm text-gray-600 mb-1">{$_('fuel.reports.totalCost')}</div>
        <div class="text-2xl font-bold text-red-600">{totalStats.totalCost.toFixed(2)} RON</div>
      </div>
    </div>

    <!-- Export Button -->
    <div class="mb-4 flex justify-end">
      <button
        on:click={exportToCSV}
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {$_('fuel.reports.exportToCSV')}
      </button>
    </div>

    <!-- Daily Statistics Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <DataTable
        {columns}
        data={dailyStats}
        itemsPerPage={31}
      />
    </div>
  {:else if !isLoading && selectedVehicleId && dailyStats.length === 0}
    <div class="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p>Nu există date pentru vehiculul și perioada selectată</p>
    </div>
  {:else if !selectedVehicleId}
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
      <svg class="w-16 h-16 mx-auto mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-blue-900 mb-2">Selectează un vehicul</h3>
      <p class="text-blue-700">Alege un vehicul din lista de mai sus și apasă "Generează Raport" pentru a vedea statisticile zilnice</p>
    </div>
  {/if}

  {#if isLoading}
    <div class="bg-white rounded-lg shadow-md p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">{$_('common.loading')}</p>
    </div>
  {/if}
</div>
