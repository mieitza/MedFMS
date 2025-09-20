<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { api } from '$lib/api';

  let workOrder = null;
  let loading = false;
  let error = null;

  onMount(async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    const workOrderId = $page.params.id;
    if (workOrderId) {
      await loadWorkOrder(workOrderId);
    }
  });

  async function loadWorkOrder(id) {
    loading = true;
    error = null;
    try {
      const response = await api.getMaintenanceWorkOrderById(id);

      workOrder = {
        ...response.data.workOrder,
        vehicle: response.data.vehicle,
        maintenanceType: response.data.maintenanceType
      };

    } catch (err) {
      console.error('Failed to load work order:', err);
      error = err.message || 'Failed to load work order details';
    } finally {
      loading = false;
    }
  }

  function getStatusClass(status) {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'on_hold': 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  function getPriorityLabel(priority) {
    const labels = {
      1: 'Urgent',
      2: 'High',
      3: 'Normal',
      4: 'Low',
      5: 'Optional'
    };
    return labels[priority] || 'Normal';
  }

  function getPriorityClass(priority) {
    const classes = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-blue-100 text-blue-800',
      4: 'bg-green-100 text-green-800',
      5: 'bg-gray-100 text-gray-800'
    };
    return classes[priority] || 'bg-blue-100 text-blue-800';
  }
</script>

<svelte:head>
  <title>{workOrder ? `Work Order #${workOrder.workOrderNumber}` : 'Work Order Details'} - MedFMS</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="/dashboard" class="text-2xl font-bold text-primary-900">MedFMS</a>
          <nav class="ml-8">
            <ol class="flex items-center space-x-2 text-sm">
              <li><a href="/dashboard" class="text-gray-500 hover:text-gray-700">Dashboard</a></li>
              <li class="text-gray-500">/</li>
              <li><a href="/maintenance" class="text-gray-500 hover:text-gray-700">Maintenance</a></li>
              <li class="text-gray-500">/</li>
              <li class="text-gray-900 font-medium">
                {workOrder ? `Work Order #${workOrder.workOrderNumber}` : 'Loading...'}
              </li>
            </ol>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <a
            href="/maintenance"
            class="btn btn-secondary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Maintenance
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if loading}
      <div class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading work order details...</p>
      </div>
    {:else if error}
      <div class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 class="text-lg font-medium text-red-800">Error</h3>
          <p class="text-red-600">{error}</p>
        </div>
      </div>
    {:else if workOrder}
      <!-- Work Order Details Card -->
      <div class="bg-white p-6 rounded-lg shadow border mb-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Work Order #{workOrder.workOrderNumber}</h1>
            <p class="text-lg text-gray-600 mt-1">{workOrder.title}</p>
          </div>
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 text-sm font-medium rounded-full {getPriorityClass(workOrder.priority)}">
              Priority: {getPriorityLabel(workOrder.priority)}
            </span>
            <span class="px-3 py-1 text-sm font-medium rounded-full {getStatusClass(workOrder.status)}">
              {workOrder.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Vehicle Information -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Vehicle</h3>
            <p class="text-lg font-semibold text-gray-900">
              {workOrder.vehicle?.vehicleCode || 'N/A'}
            </p>
            <p class="text-sm text-gray-600">
              {workOrder.vehicle?.licensePlate || 'N/A'}
            </p>
          </div>

          <!-- Maintenance Type -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Maintenance Type</h3>
            <p class="text-lg font-semibold text-gray-900">
              {workOrder.maintenanceType?.typeName || 'N/A'}
            </p>
            <p class="text-sm text-gray-600 capitalize">
              {workOrder.maintenanceType?.category || 'N/A'}
            </p>
          </div>

          <!-- Scheduled Date -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Scheduled Date</h3>
            <p class="text-lg font-semibold text-gray-900">
              {workOrder.scheduledDate ? new Date(workOrder.scheduledDate).toLocaleDateString() : 'Not scheduled'}
            </p>
          </div>

          <!-- Estimated Cost -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Estimated Cost</h3>
            <p class="text-lg font-semibold text-gray-900">
              {workOrder.estimatedCost ? `$${parseFloat(workOrder.estimatedCost).toFixed(2)}` : 'N/A'}
            </p>
          </div>

          <!-- Actual Cost -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Actual Cost</h3>
            <p class="text-lg font-semibold text-gray-900">
              {workOrder.actualCost ? `$${parseFloat(workOrder.actualCost).toFixed(2)}` : 'N/A'}
            </p>
          </div>

          <!-- Created Date -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Created</h3>
            <p class="text-lg font-semibold text-gray-900">
              {new Date(workOrder.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <!-- Description -->
        {#if workOrder.description}
          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p class="text-gray-900">{workOrder.description}</p>
          </div>
        {/if}

        <!-- Notes -->
        {#if workOrder.notes}
          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Notes</h3>
            <p class="text-gray-900">{workOrder.notes}</p>
          </div>
        {/if}
      </div>

      <!-- Actions Section -->
      <div class="bg-white p-6 rounded-lg shadow border">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
        <div class="flex flex-wrap gap-3">
          {#if workOrder.status === 'pending'}
            <button class="btn bg-green-600 hover:bg-green-700 text-white">
              Approve Work Order
            </button>
            <button class="btn bg-red-600 hover:bg-red-700 text-white">
              Reject Work Order
            </button>
          {/if}

          {#if workOrder.status === 'approved'}
            <button class="btn bg-blue-600 hover:bg-blue-700 text-white">
              Start Work Order
            </button>
          {/if}

          {#if workOrder.status === 'in_progress'}
            <button class="btn bg-purple-600 hover:bg-purple-700 text-white">
              Complete Work Order
            </button>
          {/if}

          {#if !['completed', 'cancelled'].includes(workOrder.status)}
            <button class="btn bg-gray-600 hover:bg-gray-700 text-white">
              Cancel Work Order
            </button>
            <button class="btn bg-blue-600 hover:bg-blue-700 text-white">
              Edit Work Order
            </button>
          {/if}

          {#if ['pending', 'cancelled'].includes(workOrder.status)}
            <button class="btn bg-red-600 hover:bg-red-700 text-white">
              Delete Work Order
            </button>
          {/if}
        </div>
      </div>
    {:else}
      <div class="text-center py-8">
        <p class="text-gray-600">Work order not found</p>
      </div>
    {/if}
  </main>
</div>