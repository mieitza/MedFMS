<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';

  let isLoading = true;
  let vehicles = [];
  let selectedVehicleId = 'all';
  let selectedDateRange = '30';
  let customStartDate = '';
  let customEndDate = '';

  let reportData = {
    totalTransactions: 0,
    totalFuelVolume: 0,
    totalFuelCost: 0,
    averageFuelPrice: 0,
    averageConsumption: 0,
    totalDistance: 0,
    efficiency: 0,
    costPerKm: 0,
    transactionsByType: {},
    fuelByMonth: [],
    costByMonth: [],
    topExpensiveTransactions: [],
    efficiencyTrend: []
  };

  let fleetReportData = {
    uniqueVehicles: 0,
    uniqueStations: 0,
    avgCostPerVehicle: 0,
    avgCostPerTransaction: 0,
    costByProductType: [],
    topVehiclesByCost: [],
    topStationsByUsage: [],
    dailyUsageSummary: [],
    vehicleEfficiency: [],
    fuelProductsCost: 0,
    servicesOtherCost: 0,
    highestCostVehicle: null,
    lowestCostVehicle: null,
    medianCostPerVehicle: 0,
    primaryFuel: '',
    avgDailyTransactions: 0,
    avgDailyCost: 0
  };

  // Date range options
  $: dateRangeOptions = [
    { value: '7', label: $_('fuel.reports.dateRanges.last7Days') },
    { value: '30', label: $_('fuel.reports.dateRanges.last30Days') },
    { value: '90', label: $_('fuel.reports.dateRanges.last90Days') },
    { value: '365', label: $_('fuel.reports.dateRanges.lastYear') },
    { value: 'custom', label: $_('fuel.reports.dateRanges.customRange') }
  ];

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    await loadVehicles();
    await loadReportData();
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

  async function loadReportData() {
    isLoading = true;
    try {
      const dateParams = getDateParams();
      const vehicleParam = selectedVehicleId !== 'all' ? { vehicleId: parseInt(selectedVehicleId) } : {};

      const params = { ...dateParams, ...vehicleParam };

      // Load fuel transactions
      const response = await api.getFuelTransactions({
        ...params,
        limit: 10000 // Increased limit for comprehensive fleet analysis
        // Include all transactions for analysis
      });

      const transactions = response.data || [];

      // Calculate analytics
      reportData = calculateFuelAnalytics(transactions);

      // Calculate fleet analytics if all vehicles selected
      if (selectedVehicleId === 'all') {
        fleetReportData = calculateFleetAnalytics(transactions);
      }
    } catch (error) {
      console.error('Failed to load report data:', error);
      reportData = getEmptyReportData();
      fleetReportData = getEmptyFleetReportData();
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

  function calculateFuelAnalytics(transactions) {
    if (!transactions || transactions.length === 0) {
      return getEmptyReportData();
    }

    // Basic totals
    const totalTransactions = transactions.length;
    const totalFuelVolume = transactions.reduce((sum, t) => sum + (parseFloat(t.quantity) || 0), 0);
    const totalFuelCost = transactions.reduce((sum, t) => sum + (parseFloat(t.totalAmount) || 0), 0);

    // Calculate total distance from odometer readings (max - min)
    const odometerReadings = transactions
      .map(t => parseFloat(t.odometer) || 0)
      .filter(o => o > 0);
    const totalDistance = odometerReadings.length > 0
      ? Math.max(...odometerReadings) - Math.min(...odometerReadings)
      : 0;

    // Averages
    const averageFuelPrice = totalFuelVolume > 0 ? totalFuelCost / totalFuelVolume : 0;
    const averageConsumption = totalTransactions > 0 ? totalFuelVolume / totalTransactions : 0;

    // Efficiency (L/100km) - calculate from consecutive transactions
    let efficiency = 0;
    let efficiencyCount = 0;
    const sortedTransactions = [...transactions].sort((a, b) =>
      new Date(a.transactionDate) - new Date(b.transactionDate)
    );

    for (let i = 1; i < sortedTransactions.length; i++) {
      const prev = sortedTransactions[i - 1];
      const curr = sortedTransactions[i];
      const distance = (parseFloat(curr.odometer) || 0) - (parseFloat(prev.odometer) || 0);
      const fuel = parseFloat(curr.quantity) || 0;

      if (distance > 0 && fuel > 0) {
        efficiency += (fuel / distance) * 100;
        efficiencyCount++;
      }
    }
    efficiency = efficiencyCount > 0 ? efficiency / efficiencyCount : 0;

    const costPerKm = totalDistance > 0 ? totalFuelCost / totalDistance : 0;

    // Transactions by type
    const transactionsByType = transactions.reduce((acc, t) => {
      const type = t.transactionType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Fuel by month
    const fuelByMonth = aggregateByMonth(transactions, 'quantity');
    const costByMonth = aggregateByMonth(transactions, 'totalAmount');

    // Top expensive transactions
    const topExpensiveTransactions = [...transactions]
      .sort((a, b) => (parseFloat(b.totalAmount) || 0) - (parseFloat(a.totalAmount) || 0))
      .slice(0, 10);

    // Efficiency trend
    const efficiencyTrend = calculateEfficiencyTrend(sortedTransactions);

    return {
      totalTransactions,
      totalFuelVolume,
      totalFuelCost,
      averageFuelPrice,
      averageConsumption,
      totalDistance,
      efficiency,
      costPerKm,
      transactionsByType,
      fuelByMonth,
      costByMonth,
      topExpensiveTransactions,
      efficiencyTrend
    };
  }

  function aggregateByMonth(transactions, field) {
    const monthlyData = {};

    transactions.forEach(t => {
      const date = new Date(t.transactionDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += parseFloat(t[field]) || 0;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, value]) => ({ month, value }));
  }

  function calculateEfficiencyTrend(sortedTransactions) {
    const trend = [];

    for (let i = 1; i < sortedTransactions.length; i++) {
      const prev = sortedTransactions[i - 1];
      const curr = sortedTransactions[i];
      const distance = (parseFloat(curr.odometer) || 0) - (parseFloat(prev.odometer) || 0);
      const fuel = parseFloat(curr.quantity) || 0;

      if (distance > 0 && fuel > 0) {
        const efficiency = (fuel / distance) * 100;
        trend.push({
          date: curr.transactionDate,
          efficiency: efficiency,
          distance: distance,
          fuel: fuel
        });
      }
    }

    return trend;
  }

  function getEmptyReportData() {
    return {
      totalTransactions: 0,
      totalFuelVolume: 0,
      totalFuelCost: 0,
      averageFuelPrice: 0,
      averageConsumption: 0,
      totalDistance: 0,
      efficiency: 0,
      costPerKm: 0,
      transactionsByType: {},
      fuelByMonth: [],
      costByMonth: [],
      topExpensiveTransactions: [],
      efficiencyTrend: []
    };
  }

  function calculateFleetAnalytics(transactions) {
    if (!transactions || transactions.length === 0) {
      return getEmptyFleetReportData();
    }

    // Count unique vehicles and stations
    const uniqueVehicleIds = new Set(transactions.map(t => t.vehicleId).filter(Boolean));
    const uniqueStationIds = new Set(transactions.map(t => t.locationId).filter(Boolean));
    const uniqueVehicles = uniqueVehicleIds.size;
    const uniqueStations = uniqueStationIds.size;

    const totalCost = transactions.reduce((sum, t) => sum + (parseFloat(t.totalAmount) || 0), 0);
    const totalTransactions = transactions.length;

    const avgCostPerVehicle = uniqueVehicles > 0 ? totalCost / uniqueVehicles : 0;
    const avgCostPerTransaction = totalTransactions > 0 ? totalCost / totalTransactions : 0;

    // Cost by Product Type
    const productTypeMap = {};
    transactions.forEach(t => {
      const productType = t.fuelType?.fuelName || 'Unknown';
      if (!productTypeMap[productType]) {
        productTypeMap[productType] = {
          productType,
          transactions: 0,
          quantity: 0,
          totalCost: 0
        };
      }
      productTypeMap[productType].transactions++;
      productTypeMap[productType].quantity += parseFloat(t.quantity) || 0;
      productTypeMap[productType].totalCost += parseFloat(t.totalAmount) || 0;
    });

    const costByProductType = Object.values(productTypeMap)
      .map(item => ({
        ...item,
        percentOfTotal: totalCost > 0 ? (item.totalCost / totalCost) * 100 : 0,
        avgCostPerUnit: item.quantity > 0 ? item.totalCost / item.quantity : 0
      }))
      .sort((a, b) => b.totalCost - a.totalCost);

    // Top 20 Vehicles by Cost
    const vehicleMap = {};
    transactions.forEach(t => {
      if (!t.vehicleId) return;
      const vehicleId = t.vehicleId;
      const vehicleReg = t.vehicle?.licensePlate || 'Unknown';
      if (!vehicleMap[vehicleId]) {
        vehicleMap[vehicleId] = {
          vehicleId,
          vehicleReg,
          transactions: 0,
          totalCost: 0,
          totalQuantity: 0,
          fuelTypes: {}
        };
      }
      vehicleMap[vehicleId].transactions++;
      vehicleMap[vehicleId].totalCost += parseFloat(t.totalAmount) || 0;
      vehicleMap[vehicleId].totalQuantity += parseFloat(t.quantity) || 0;
      const fuelType = t.fuelType?.fuelName || 'Unknown';
      vehicleMap[vehicleId].fuelTypes[fuelType] = (vehicleMap[vehicleId].fuelTypes[fuelType] || 0) + 1;
    });

    const topVehiclesByCost = Object.values(vehicleMap)
      .map(v => ({
        ...v,
        primaryFuelType: Object.entries(v.fuelTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown'
      }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 20);

    // Top 15 Fuel Stations by Usage
    const stationMap = {};
    transactions.forEach(t => {
      if (!t.locationId) return;
      const stationId = t.locationId;
      const stationName = t.station?.stationName || 'Unknown';
      if (!stationMap[stationId]) {
        stationMap[stationId] = {
          stationId,
          stationName,
          transactions: 0,
          totalCost: 0,
          totalQuantity: 0
        };
      }
      stationMap[stationId].transactions++;
      stationMap[stationId].totalCost += parseFloat(t.totalAmount) || 0;
      stationMap[stationId].totalQuantity += parseFloat(t.quantity) || 0;
    });

    const topStationsByUsage = Object.values(stationMap)
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 15);

    // Daily Usage Summary
    const dailyMap = {};
    transactions.forEach(t => {
      const date = t.transactionDate ? new Date(t.transactionDate).toISOString().split('T')[0] : 'Unknown';
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          transactions: 0,
          cost: 0,
          quantity: 0
        };
      }
      dailyMap[date].transactions++;
      dailyMap[date].cost += parseFloat(t.totalAmount) || 0;
      dailyMap[date].quantity += parseFloat(t.quantity) || 0;
    });

    const dailyUsageSummary = Object.values(dailyMap)
      .map(d => ({
        ...d,
        avgCostPerTransaction: d.transactions > 0 ? d.cost / d.transactions : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Vehicle Efficiency Analysis (Top 10 by Quantity)
    const vehicleEfficiency = Object.values(vehicleMap)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10)
      .map(v => ({
        ...v,
        avgCostPerLiter: v.totalQuantity > 0 ? v.totalCost / v.totalQuantity : 0
      }));

    // Cost Distribution
    const fuelCategories = ['Diesel', 'Super, unleaded', 'Liquid Petrol Gas LPG', 'High performance diesel', 'Super-plus'];
    const fuelProductsCost = costByProductType
      .filter(item => fuelCategories.includes(item.productType))
      .reduce((sum, item) => sum + item.totalCost, 0);
    const servicesOtherCost = totalCost - fuelProductsCost;

    // Vehicle cost statistics
    const vehicleCosts = Object.values(vehicleMap).map(v => v.totalCost).sort((a, b) => a - b);
    const highestCostVehicle = topVehiclesByCost[0] || null;
    const lowestCostVehicle = vehicleCosts.length > 0
      ? Object.values(vehicleMap).find(v => v.totalCost === vehicleCosts[0])
      : null;
    const medianCostPerVehicle = vehicleCosts.length > 0
      ? vehicleCosts[Math.floor(vehicleCosts.length / 2)]
      : 0;

    // Primary fuel type
    const primaryFuel = costByProductType[0]?.productType || 'Unknown';
    const primaryFuelQuantity = costByProductType[0]?.quantity || 0;

    // Daily averages
    const uniqueDays = new Set(transactions.map(t =>
      t.transactionDate ? new Date(t.transactionDate).toISOString().split('T')[0] : null
    ).filter(Boolean)).size;
    const avgDailyTransactions = uniqueDays > 0 ? totalTransactions / uniqueDays : 0;
    const avgDailyCost = uniqueDays > 0 ? totalCost / uniqueDays : 0;

    return {
      uniqueVehicles,
      uniqueStations,
      avgCostPerVehicle,
      avgCostPerTransaction,
      costByProductType,
      topVehiclesByCost,
      topStationsByUsage,
      dailyUsageSummary,
      vehicleEfficiency,
      fuelProductsCost,
      servicesOtherCost,
      highestCostVehicle,
      lowestCostVehicle,
      medianCostPerVehicle,
      primaryFuel,
      primaryFuelQuantity,
      avgDailyTransactions,
      avgDailyCost
    };
  }

  function getEmptyFleetReportData() {
    return {
      uniqueVehicles: 0,
      uniqueStations: 0,
      avgCostPerVehicle: 0,
      avgCostPerTransaction: 0,
      costByProductType: [],
      topVehiclesByCost: [],
      topStationsByUsage: [],
      dailyUsageSummary: [],
      vehicleEfficiency: [],
      fuelProductsCost: 0,
      servicesOtherCost: 0,
      highestCostVehicle: null,
      lowestCostVehicle: null,
      medianCostPerVehicle: 0,
      primaryFuel: '',
      primaryFuelQuantity: 0,
      avgDailyTransactions: 0,
      avgDailyCost: 0
    };
  }

  function handleDateRangeChange() {
    if (selectedDateRange !== 'custom') {
      customStartDate = '';
      customEndDate = '';
    }
    loadReportData();
  }

  function handleVehicleChange() {
    loadReportData();
  }

  function exportReport() {
    alert($_('fuel.reports.messages.exportNotImplemented'));
  }

  function getSelectedVehicleName() {
    if (selectedVehicleId === 'all') {
      return $_('fuel.reports.allVehicles');
    }
    const vehicle = vehicles.find(v => v.id === parseInt(selectedVehicleId));
    return vehicle ? `${vehicle.vehicleCode} - ${vehicle.licensePlate}` : '';
  }
</script>

<svelte:head>
  <title>{$_('fuel.reports.pageTitle')}</title>
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
              <li><a href="/fuel" class="text-gray-500 hover:text-gray-700">{$_('fuel.title')}</a></li>
              <li class="text-gray-500">/</li>
              <li class="text-gray-900 font-medium">{$_('fuel.reports.title')}</li>
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
            {$_('fuel.reports.exportReport')}
          </button>
          <a
            href="/fuel"
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            {$_('fuel.reports.backToFuel')}
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow border mb-6">
      <h2 class="text-lg font-semibold mb-4">{$_('fuel.reports.configuration.title')}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Vehicle Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{$_('fuel.reports.configuration.vehicle')}</label>
          <select
            bind:value={selectedVehicleId}
            on:change={handleVehicleChange}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{$_('fuel.reports.allVehicles')}</option>
            {#each vehicles as vehicle}
              <option value={vehicle.id}>{vehicle.vehicleCode} - {vehicle.licensePlate}</option>
            {/each}
          </select>
        </div>

        <!-- Date Range Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{$_('fuel.reports.configuration.dateRange')}</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">{$_('fuel.reports.configuration.startDate')}</label>
              <input
                type="date"
                bind:value={customStartDate}
                on:change={loadReportData}
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{$_('fuel.reports.configuration.endDate')}</label>
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
    {:else if selectedVehicleId === 'all'}
      <!-- Fleet-Wide Report -->
      <div class="space-y-6">
        <!-- Report Title -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            FUEL USAGE ANALYSIS REPORT
          </h1>
          <p class="text-lg text-gray-700">UTA Fuel Card Export</p>
          <p class="text-sm text-gray-500 mt-2">
            Report Generated: {new Date().toLocaleString()} | Data Period: {getDateParams().startDate} - {getDateParams().endDate}
          </p>
        </div>

        <!-- Executive Summary -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">EXECUTIVE SUMMARY</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p class="text-2xl font-bold text-gray-900">{reportData.totalTransactions.toLocaleString()}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Cost</p>
              <p class="text-2xl font-bold text-gray-900">{reportData.totalFuelCost.toFixed(2)} RON</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Fuel/Products</p>
              <p class="text-2xl font-bold text-gray-900">{reportData.totalFuelVolume.toFixed(2)} units</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Unique Vehicles</p>
              <p class="text-2xl font-bold text-gray-900">{fleetReportData.uniqueVehicles}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Unique Fuel Stations</p>
              <p class="text-2xl font-bold text-gray-900">{fleetReportData.uniqueStations}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Avg Cost per Transaction</p>
              <p class="text-2xl font-bold text-gray-900">{fleetReportData.avgCostPerTransaction.toFixed(2)} RON</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Avg Cost per Vehicle</p>
              <p class="text-2xl font-bold text-gray-900">{fleetReportData.avgCostPerVehicle.toFixed(2)} RON</p>
            </div>
          </div>
        </div>

        <!-- Cost Breakdown by Product Type -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">COST BREAKDOWN BY PRODUCT TYPE</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Type</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Transactions</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Cost (RON)</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Total</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Cost/Unit</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each fleetReportData.costByProductType as item}
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{item.productType}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{item.transactions}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{item.totalCost.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{item.percentOfTotal.toFixed(1)}%</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{item.avgCostPerUnit.toFixed(2)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top 20 Vehicles by Cost -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">TOP 20 VEHICLES BY COST</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Reg</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Transactions</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Cost (RON)</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Quantity</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary Fuel Type</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each fleetReportData.topVehiclesByCost as vehicle, index}
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{vehicle.vehicleReg}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{vehicle.transactions}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{vehicle.totalCost.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{vehicle.totalQuantity.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{vehicle.primaryFuelType}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top 15 Fuel Stations by Usage -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">TOP 15 FUEL STATIONS BY USAGE</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station Name</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Transactions</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Cost (RON)</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Quantity</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each fleetReportData.topStationsByUsage as station, index}
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{station.stationName}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{station.transactions}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{station.totalCost.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{station.totalQuantity.toFixed(2)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Daily Usage Summary -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">DAILY USAGE SUMMARY</h2>
          <div class="overflow-x-auto max-h-96">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Transactions</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost (RON)</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Cost/Transaction</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each fleetReportData.dailyUsageSummary as day}
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{new Date(day.date).toLocaleDateString()}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{day.transactions}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{day.cost.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{day.quantity.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{day.avgCostPerTransaction.toFixed(2)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Vehicle Efficiency Analysis -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">VEHICLE EFFICIENCY ANALYSIS (Top 10 by Quantity)</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Fuel (L)</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Cost (RON)</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Cost/Liter</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Transactions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each fleetReportData.vehicleEfficiency as vehicle, index}
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{vehicle.vehicleReg}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{vehicle.totalQuantity.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{vehicle.totalCost.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{vehicle.avgCostPerLiter.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{vehicle.transactions}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cost Distribution Statistics -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">COST DISTRIBUTION STATISTICS</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">By Product Category</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span class="text-sm font-medium text-gray-700">Fuel Products</span>
                  <span class="text-lg font-bold text-gray-900">{fleetReportData.fuelProductsCost.toFixed(2)} RON ({((fleetReportData.fuelProductsCost / reportData.totalFuelCost) * 100).toFixed(1)}%)</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span class="text-sm font-medium text-gray-700">Services & Other</span>
                  <span class="text-lg font-bold text-gray-900">{fleetReportData.servicesOtherCost.toFixed(2)} RON ({((fleetReportData.servicesOtherCost / reportData.totalFuelCost) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Cost Per Vehicle Statistics</h3>
              <div class="space-y-3">
                {#if fleetReportData.highestCostVehicle}
                  <div class="p-3 bg-gray-50 rounded">
                    <p class="text-sm text-gray-600">Highest Cost Vehicle</p>
                    <p class="text-lg font-bold text-gray-900">{fleetReportData.highestCostVehicle.vehicleReg} - {fleetReportData.highestCostVehicle.totalCost.toFixed(2)} RON</p>
                  </div>
                {/if}
                {#if fleetReportData.lowestCostVehicle}
                  <div class="p-3 bg-gray-50 rounded">
                    <p class="text-sm text-gray-600">Lowest Cost Vehicle</p>
                    <p class="text-lg font-bold text-gray-900">{fleetReportData.lowestCostVehicle.vehicleReg} - {fleetReportData.lowestCostVehicle.totalCost.toFixed(2)} RON</p>
                  </div>
                {/if}
                <div class="p-3 bg-gray-50 rounded">
                  <p class="text-sm text-gray-600">Median Cost per Vehicle</p>
                  <p class="text-lg font-bold text-gray-900">{fleetReportData.medianCostPerVehicle.toFixed(2)} RON</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Insights & Recommendations -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">KEY INSIGHTS & RECOMMENDATIONS</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Fuel Consumption Patterns</h3>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Primary Fuel:</span> {fleetReportData.primaryFuel} ({fleetReportData.primaryFuelQuantity?.toFixed(0) || 0} L)</p>
                <p><span class="font-medium">Average Daily Transactions:</span> {fleetReportData.avgDailyTransactions.toFixed(1)}</p>
                <p><span class="font-medium">Average Daily Cost:</span> {fleetReportData.avgDailyCost.toFixed(2)} RON</p>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <ul class="space-y-2 text-sm list-disc list-inside text-gray-700">
                <li>Monitor high-cost vehicles for maintenance or efficiency issues</li>
                <li>Consider fuel cards with better rates at frequently used stations</li>
                <li>Implement fuel consumption tracking per vehicle</li>
                <li>Review vignette and service expenses for optimization</li>
                <li>{fleetReportData.uniqueStations} unique stations used - consider negotiating volume discounts</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="text-center py-6 text-gray-500 text-sm">
          End of Report
        </div>
      </div>
    {:else}
      <!-- Single Vehicle Report -->
      <!-- Report Title -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          {$_('fuel.reports.analysisFor')} {getSelectedVehicleName()}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {$_('fuel.reports.totalTransactions')}: {reportData.totalTransactions}
        </p>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Total Fuel Volume -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{$_('fuel.reports.metrics.totalFuel')}</p>
              <p class="text-2xl font-bold text-gray-900">{reportData.totalFuelVolume.toFixed(2)} L</p>
            </div>
          </div>
        </div>

        <!-- Total Cost -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{$_('fuel.reports.metrics.totalCost')}</p>
              <p class="text-2xl font-bold text-gray-900">{reportData.totalFuelCost.toFixed(2)} RON</p>
            </div>
          </div>
        </div>

        <!-- Average Fuel Price -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{$_('fuel.reports.metrics.avgPrice')}</p>
              <p class="text-2xl font-bold text-gray-900">{reportData.averageFuelPrice.toFixed(2)} RON/L</p>
            </div>
          </div>
        </div>

        <!-- Fuel Efficiency -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{$_('fuel.reports.metrics.efficiency')}</p>
              <p class="text-2xl font-bold text-gray-900">{reportData.efficiency.toFixed(2)} L/100km</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow border">
          <h3 class="text-sm font-medium text-gray-600 mb-2">{$_('fuel.reports.metrics.avgConsumption')}</h3>
          <p class="text-xl font-bold text-gray-900">{reportData.averageConsumption.toFixed(2)} L</p>
          <p class="text-xs text-gray-500 mt-1">{$_('fuel.reports.metrics.perTransaction')}</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border">
          <h3 class="text-sm font-medium text-gray-600 mb-2">{$_('fuel.reports.metrics.costPerKm')}</h3>
          <p class="text-xl font-bold text-gray-900">{reportData.costPerKm.toFixed(4)} RON/km</p>
          <p class="text-xs text-gray-500 mt-1">{$_('fuel.reports.metrics.avgCostDistance')}</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border">
          <h3 class="text-sm font-medium text-gray-600 mb-2">{$_('fuel.reports.metrics.transactions')}</h3>
          <p class="text-xl font-bold text-gray-900">{reportData.totalTransactions}</p>
          <p class="text-xs text-gray-500 mt-1">{$_('fuel.reports.metrics.approvedOnly')}</p>
        </div>
      </div>

      <!-- Charts and Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Fuel Consumption by Month -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{$_('fuel.reports.charts.fuelByMonth')}</h3>
          {#if reportData.fuelByMonth.length > 0}
            <div class="space-y-3">
              {#each reportData.fuelByMonth as item}
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-gray-700">{item.month}</span>
                    <span class="text-sm font-bold text-gray-900">{item.value.toFixed(2)} L</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      style="width: {(item.value / Math.max(...reportData.fuelByMonth.map(i => i.value))) * 100}%"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-gray-500 text-center py-8">{$_('fuel.reports.noData')}</p>
          {/if}
        </div>

        <!-- Cost by Month -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{$_('fuel.reports.charts.costByMonth')}</h3>
          {#if reportData.costByMonth.length > 0}
            <div class="space-y-3">
              {#each reportData.costByMonth as item}
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-gray-700">{item.month}</span>
                    <span class="text-sm font-bold text-gray-900">{item.value.toFixed(2)} RON</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-green-600 h-2 rounded-full"
                      style="width: {(item.value / Math.max(...reportData.costByMonth.map(i => i.value))) * 100}%"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-gray-500 text-center py-8">{$_('fuel.reports.noData')}</p>
          {/if}
        </div>
      </div>

      <!-- Transaction Type Breakdown -->
      {#if Object.keys(reportData.transactionsByType).length > 0}
        <div class="bg-white p-6 rounded-lg shadow border mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{$_('fuel.reports.charts.transactionsByType')}</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {#each Object.entries(reportData.transactionsByType) as [type, count]}
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600 capitalize">{type}</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{count}</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Top Expensive Transactions -->
      {#if reportData.topExpensiveTransactions.length > 0}
        <div class="bg-white p-6 rounded-lg shadow border mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{$_('fuel.reports.charts.topExpensive')}</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('fuel.date')}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('fuel.vehicle')}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{$_('fuel.fuelType')}</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{$_('fuel.quantity')}</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{$_('fuel.totalAmount')}</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each reportData.topExpensiveTransactions as transaction}
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{transaction.vehicle?.vehicleCode || 'N/A'}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{transaction.fuelType?.fuelName || 'N/A'}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-right">{parseFloat(transaction.quantity || 0).toFixed(2)} L</td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">{parseFloat(transaction.totalAmount || 0).toFixed(2)} RON</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}

      <!-- Efficiency Trend -->
      {#if reportData.efficiencyTrend.length > 0}
        <div class="bg-white p-6 rounded-lg shadow border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{$_('fuel.reports.charts.efficiencyTrend')}</h3>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            {#each reportData.efficiencyTrend as item}
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p class="text-sm font-medium text-gray-900">{new Date(item.date).toLocaleDateString()}</p>
                  <p class="text-xs text-gray-500">{item.fuel.toFixed(2)} L / {item.distance.toFixed(0)} km</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900">{item.efficiency.toFixed(2)}</p>
                  <p class="text-xs text-gray-500">L/100km</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- No Data Message -->
      {#if reportData.totalTransactions === 0}
        <div class="bg-white p-12 rounded-lg shadow border text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">{$_('fuel.reports.noTransactions')}</h3>
          <p class="mt-1 text-sm text-gray-500">{$_('fuel.reports.noTransactionsDesc')}</p>
        </div>
      {/if}
    {/if}
  </main>
</div>
