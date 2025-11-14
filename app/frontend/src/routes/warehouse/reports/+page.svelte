<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { _ } from '$lib/i18n';

  onMount(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
    }
  });

  function goBack() {
    goto('/materials');
  }

  const reports = [
    {
      title: $_('reports.warehouse.stockReport.title'),
      description: $_('reports.warehouse.stockReport.description'),
      href: '/warehouse/reports/stock',
      icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
      color: 'blue',
      features: [
        'Current stock levels per warehouse',
        'Low stock and out of stock alerts',
        'Stock value calculation',
        'Filter by warehouse and category'
      ]
    },
    {
      title: $_('reports.warehouse.pricingReport.title'),
      description: $_('reports.warehouse.pricingReport.description'),
      href: '/warehouse/reports/pricing',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'green',
      features: [
        'Price history and trends',
        'Min, max, and average prices',
        'Price variance analysis',
        'Filter by material and supplier'
      ]
    },
    {
      title: $_('reports.warehouse.transferReport.title'),
      description: $_('reports.warehouse.transferReport.description'),
      href: '/warehouse/reports/transfers',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      color: 'purple',
      features: [
        'Transfer statistics by status',
        'Transfer type breakdown',
        'Average completion time',
        'Filter by warehouses and dates'
      ]
    },
    {
      title: $_('reports.warehouse.expirationReport.title'),
      description: $_('reports.warehouse.expirationReport.description'),
      href: '/warehouse/reports/expiration',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'red',
      features: [
        'Expired products alerts',
        'Products expiring soon',
        'Value of expired stock',
        'Configurable alert thresholds'
      ]
    }
  ];

  function getColorClasses(color) {
    const colors = {
      blue: {
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        hover: 'hover:border-blue-300'
      },
      green: {
        bg: 'from-green-50 to-emerald-100',
        border: 'border-green-200',
        icon: 'text-green-600',
        hover: 'hover:border-green-300'
      },
      purple: {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        hover: 'hover:border-purple-300'
      },
      red: {
        bg: 'from-red-50 to-red-100',
        border: 'border-red-200',
        icon: 'text-red-600',
        hover: 'hover:border-red-300'
      }
    };
    return colors[color] || colors.blue;
  }
</script>

<svelte:head>
  <title>{$_('reports.warehouse.title')} - MedFMS</title>
</svelte:head>

<div class="container mx-auto p-6">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center mb-2">
      <button on:click={goBack} class="text-gray-600 hover:text-gray-900 mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="text-3xl font-bold text-gray-900">{$_('reports.warehouse.title')}</h1>
    </div>
    <p class="text-gray-600 ml-10">Comprehensive warehouse analytics and reporting tools</p>
  </div>

  <!-- Reports Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each reports as report}
      {@const colors = getColorClasses(report.color)}
      <a
        href={report.href}
        class="block bg-gradient-to-br {colors.bg} border-2 {colors.border} rounded-lg p-6 transition-all hover:shadow-lg {colors.hover}"
      >
        <div class="flex items-start mb-4">
          <div class="p-3 rounded-lg bg-white shadow-sm">
            <svg class="w-8 h-8 {colors.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={report.icon}/>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <h2 class="text-xl font-bold text-gray-900 mb-1">{report.title}</h2>
            <p class="text-gray-600 text-sm">{report.description}</p>
          </div>
        </div>

        <div class="bg-white bg-opacity-50 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Key Features:</h3>
          <ul class="space-y-1">
            {#each report.features as feature}
              <li class="flex items-start text-sm text-gray-600">
                <svg class="w-4 h-4 {colors.icon} mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>{feature}</span>
              </li>
            {/each}
          </ul>
        </div>

        <div class="mt-4 flex items-center text-sm font-medium {colors.icon}">
          View Report
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </a>
    {/each}
  </div>
</div>
