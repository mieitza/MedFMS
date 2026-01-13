<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';
  import DataTable from '$lib/components/DataTable.svelte';

  let isLoading = true;
  let transactions = [];
  let filteredTransactions = [];
  let selectedVehicleId = 'all';
  let selectedMonth = '';
  let customStartDate = '';
  let customEndDate = '';
  let vehicles = [];
  let totalFuelCost = 0;
  let totalFuelVolume = 0;
  let totalTransactions = 0;
  let uniqueVehicles = 0;

  // Data table columns
  const columns = [
    {
      key: 'transactionDate',
      label: $_('fuel.transactionDate'),
      sortable: true,
      render: (value) => {
        const date = new Date(value);
        // Format as dd/mm/yyyy HH:MM
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      }
    },
    {
      key: 'vehicle',
      label: $_('fuel.vehicle'),
      sortable: true,
      render: (value, row) => {
        return row.vehicle?.licensePlate || 'N/A';
      }
    },
    {
      key: 'vehicleCode',
      label: $_('vehicles.vehicleCode'),
      sortable: true,
      render: (value, row) => {
        return row.vehicle?.vehicleCode || 'N/A';
      }
    },
    {
      key: 'employee',
      label: $_('fuel.employee'),
      sortable: true,
      render: (value, row) => {
        return row.employee?.fullName || 'N/A';
      }
    },
    {
      key: 'fuelStation',
      label: $_('fuel.fuelStation'),
      sortable: true,
      render: (value, row) => {
        return row.fuelStation?.stationName || 'N/A';
      }
    },
    {
      key: 'fuelType',
      label: $_('fuel.fuelType'),
      sortable: true,
      render: (value, row) => {
        return row.fuelType?.fuelName || 'N/A';
      }
    },
    {
      key: 'quantity',
      label: $_('fuel.quantity'),
      sortable: true,
      render: (value) => `${parseFloat(value || 0).toFixed(2)} L`
    },
    {
      key: 'totalAmount',
      label: $_('fuel.totalAmount'),
      sortable: true,
      render: (value, row) => `${parseFloat(value || 0).toFixed(2)} ${row.currency || 'RON'}`
    },
    {
      key: 'odometerReading',
      label: $_('fuel.odometerReading'),
      sortable: true,
      render: (value) => value ? `${parseInt(value).toLocaleString()} km` : 'N/A'
    }
  ];

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    // Set default dates - last 3 months
    const today = new Date();
    customEndDate = today.toISOString().split('T')[0];
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    customStartDate = threeMonthsAgo.toISOString().split('T')[0];

    await loadVehicles();
    await loadSundayTransactions();
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

  async function loadSundayTransactions() {
    isLoading = true;
    try {
      const params = {
        limit: 10000
      };

      if (customStartDate) {
        params.startDate = customStartDate;
      }
      if (customEndDate) {
        params.endDate = customEndDate;
      }

      const response = await api.getFuelTransactions(params);
      const allTransactions = response.data || [];

      // Filter for Sunday transactions
      transactions = allTransactions.filter(transaction => {
        const date = new Date(transaction.transactionDate);
        return date.getDay() === 0; // 0 = Sunday
      });

      applyFilters();
    } catch (error) {
      console.error('Failed to load Sunday fuel transactions:', error);
      transactions = [];
      filteredTransactions = [];
    } finally {
      isLoading = false;
    }
  }

  function applyFilters() {
    filteredTransactions = transactions.filter(transaction => {
      // Vehicle filter
      if (selectedVehicleId !== 'all' && transaction.vehicleId !== parseInt(selectedVehicleId)) {
        return false;
      }

      // Month filter
      if (selectedMonth) {
        const transactionMonth = new Date(transaction.transactionDate).toISOString().substring(0, 7);
        if (transactionMonth !== selectedMonth) {
          return false;
        }
      }

      return true;
    });

    calculateStatistics();
  }

  function calculateStatistics() {
    totalFuelCost = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.totalAmount || 0), 0);
    totalFuelVolume = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.quantity || 0), 0);
    totalTransactions = filteredTransactions.length;
    uniqueVehicles = new Set(filteredTransactions.map(t => t.vehicleId)).size;
  }

  function handleVehicleChange() {
    applyFilters();
  }

  function handleMonthChange() {
    applyFilters();
  }

  function handleDateRangeChange() {
    loadSundayTransactions();
  }

  function exportToCSV() {
    if (filteredTransactions.length === 0) {
      alert($_('fuel.reports.noDataToExport'));
      return;
    }

    // Create CSV content
    const headers = [
      'Data',
      'Vehicul',
      'Cod Vehicul',
      'Sofer',
      'Statie',
      'Tip Combustibil',
      'Cantitate (L)',
      'Pret Total (RON)',
      'KM'
    ];

    const rows = filteredTransactions.map(t => {
      const date = new Date(t.transactionDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

      return [
        formattedDate,
        t.vehicle?.licensePlate || 'N/A',
        t.vehicle?.vehicleCode || 'N/A',
        t.employee?.fullName || 'N/A',
        t.fuelStation?.stationName || 'N/A',
        t.fuelType?.fuelName || 'N/A',
        parseFloat(t.quantity || 0).toFixed(2),
        parseFloat(t.totalAmount || 0).toFixed(2),
        t.odometerReading || 'N/A'
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
    link.download = `alimentari-duminica-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  // Get unique months from transactions for month filter
  $: uniqueMonths = [...new Set(
    transactions.map(t => new Date(t.transactionDate).toISOString().substring(0, 7))
  )].sort().reverse();
</script>

<div class="container mx-auto px-4 py-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">
      {$_('fuel.reports.sundayFueling.title')}
    </h1>
    <p class="text-gray-600">
      {$_('fuel.reports.sundayFueling.description')}
    </p>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">{$_('common.filters')}</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Date Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {$_('fuel.reports.startDate')}
        </label>
        <input
          type="date"
          bind:value={customStartDate}
          on:change={handleDateRangeChange}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {$_('fuel.reports.endDate')}
        </label>
        <input
          type="date"
          bind:value={customEndDate}
          on:change={handleDateRangeChange}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Vehicle Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {$_('fuel.vehicle')}
        </label>
        <select
          bind:value={selectedVehicleId}
          on:change={handleVehicleChange}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{$_('fuel.reports.allVehicles')}</option>
          {#each vehicles as vehicle}
            <option value={vehicle.id}>
              {vehicle.licensePlate} - {vehicle.vehicleCode}
            </option>
          {/each}
        </select>
      </div>

      <!-- Month Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {$_('fuel.reports.month')}
        </label>
        <select
          bind:value={selectedMonth}
          on:change={handleMonthChange}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{$_('fuel.reports.allMonths')}</option>
          {#each uniqueMonths as month}
            <option value={month}>
              {new Date(month + '-01').toLocaleDateString('ro-RO', { year: 'numeric', month: 'long' })}
            </option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="text-sm text-gray-600 mb-1">{$_('fuel.reports.totalTransactions')}</div>
      <div class="text-2xl font-bold text-blue-600">{totalTransactions}</div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="text-sm text-gray-600 mb-1">{$_('fuel.reports.uniqueVehicles')}</div>
      <div class="text-2xl font-bold text-green-600">{uniqueVehicles}</div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="text-sm text-gray-600 mb-1">{$_('fuel.reports.totalFuelVolume')}</div>
      <div class="text-2xl font-bold text-purple-600">{totalFuelVolume.toFixed(2)} L</div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="text-sm text-gray-600 mb-1">{$_('fuel.reports.totalCost')}</div>
      <div class="text-2xl font-bold text-red-600">{totalFuelCost.toFixed(2)} RON</div>
    </div>
  </div>

  <!-- Export Button -->
  <div class="mb-4 flex justify-end">
    <button
      on:click={exportToCSV}
      disabled={filteredTransactions.length === 0}
      class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {$_('fuel.reports.exportToCSV')}
    </button>
  </div>

  <!-- Transactions Table -->
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    {#if isLoading}
      <div class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">{$_('common.loading')}</p>
      </div>
    {:else if filteredTransactions.length === 0}
      <div class="p-8 text-center text-gray-600">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>{$_('fuel.reports.sundayFueling.noTransactions')}</p>
      </div>
    {:else}
      <DataTable
        {columns}
        data={filteredTransactions}
        itemsPerPage={20}
      />
    {/if}
  </div>
</div>
