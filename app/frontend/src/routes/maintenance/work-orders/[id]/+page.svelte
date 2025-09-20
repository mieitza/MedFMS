<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { api } from '$lib/api';
  import Modal from '$lib/components/Modal.svelte';

  let workOrder = null;
  let loading = false;
  let error = null;
  let actionLoading = false;
  let showEditModal = false;
  let vehicles = [];
  let maintenanceTypes = [];

  // Edit form data
  let editFormData = {
    vehicleId: '',
    maintenanceTypeId: '',
    title: '',
    description: '',
    priority: 3,
    scheduledDate: '',
    estimatedCost: '',
    notes: ''
  };

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

  async function loadSupportData() {
    try {
      const [vehiclesResponse, typesResponse] = await Promise.all([
        api.getVehicles({ limit: 1000 }),
        api.getMaintenanceTypes()
      ]);
      vehicles = vehiclesResponse.data || [];
      maintenanceTypes = typesResponse.data || [];
    } catch (err) {
      console.error('Failed to load support data:', err);
    }
  }

  async function handleApprove() {
    const notes = prompt('Enter approval notes (optional):');
    if (notes === null) return; // User cancelled

    try {
      actionLoading = true;
      await api.approveWorkOrder(workOrder.id, notes);
      await loadWorkOrder(workOrder.id);
      alert('Work order approved successfully');
    } catch (err) {
      console.error('Failed to approve work order:', err);
      alert('Failed to approve work order: ' + err.message);
    } finally {
      actionLoading = false;
    }
  }

  async function handleReject() {
    const notes = prompt('Enter rejection reason:');
    if (!notes) {
      alert('Rejection reason is required');
      return;
    }

    try {
      actionLoading = true;
      await api.rejectWorkOrder(workOrder.id, notes);
      await loadWorkOrder(workOrder.id);
      alert('Work order rejected successfully');
    } catch (err) {
      console.error('Failed to reject work order:', err);
      alert('Failed to reject work order: ' + err.message);
    } finally {
      actionLoading = false;
    }
  }

  async function handleStart() {
    const notes = prompt('Enter notes for starting work (optional):');
    if (notes === null) return; // User cancelled

    try {
      actionLoading = true;
      await api.updateMaintenanceWorkOrderStatus(workOrder.id, 'in_progress', notes);
      await loadWorkOrder(workOrder.id);
      alert('Work order started successfully');
    } catch (err) {
      console.error('Failed to start work order:', err);
      alert('Failed to start work order: ' + err.message);
    } finally {
      actionLoading = false;
    }
  }

  async function handleComplete() {
    const actualCost = prompt('Enter actual cost (optional):');
    let notes = prompt('Enter completion notes (optional):');

    if (actualCost && notes) {
      notes = `Actual cost: $${actualCost}\n${notes}`;
    } else if (actualCost) {
      notes = `Actual cost: $${actualCost}`;
    }

    try {
      actionLoading = true;
      await api.updateMaintenanceWorkOrderStatus(workOrder.id, 'completed', notes || '');
      if (actualCost) {
        await api.updateWorkOrder(workOrder.id, { actualCost: parseFloat(actualCost) });
      }
      await loadWorkOrder(workOrder.id);
      alert('Work order completed successfully');
    } catch (err) {
      console.error('Failed to complete work order:', err);
      alert('Failed to complete work order: ' + err.message);
    } finally {
      actionLoading = false;
    }
  }

  async function handleCancel() {
    const notes = prompt('Enter cancellation reason:');
    if (!notes) {
      alert('Cancellation reason is required');
      return;
    }

    try {
      actionLoading = true;
      await api.updateMaintenanceWorkOrderStatus(workOrder.id, 'cancelled', notes);
      await loadWorkOrder(workOrder.id);
      alert('Work order cancelled successfully');
    } catch (err) {
      console.error('Failed to cancel work order:', err);
      alert('Failed to cancel work order: ' + err.message);
    } finally {
      actionLoading = false;
    }
  }

  async function handleEdit() {
    await loadSupportData();
    editFormData = {
      vehicleId: workOrder.vehicleId?.toString() || '',
      maintenanceTypeId: workOrder.maintenanceTypeId?.toString() || '',
      title: workOrder.title || '',
      description: workOrder.description || '',
      priority: workOrder.priority || 3,
      scheduledDate: workOrder.scheduledDate ? workOrder.scheduledDate.split('T')[0] : '',
      estimatedCost: workOrder.estimatedCost?.toString() || '',
      notes: workOrder.notes || ''
    };
    showEditModal = true;
  }

  async function handleEditSubmit() {
    try {
      actionLoading = true;
      const updateData = {
        vehicleId: parseInt(editFormData.vehicleId),
        maintenanceTypeId: parseInt(editFormData.maintenanceTypeId),
        title: editFormData.title,
        description: editFormData.description,
        priority: parseInt(editFormData.priority),
        scheduledDate: editFormData.scheduledDate ? new Date(editFormData.scheduledDate) : null,
        estimatedCost: editFormData.estimatedCost ? parseFloat(editFormData.estimatedCost) : null,
        notes: editFormData.notes
      };

      await api.updateWorkOrder(workOrder.id, updateData);
      await loadWorkOrder(workOrder.id);
      showEditModal = false;
      alert('Work order updated successfully');
    } catch (err) {
      console.error('Failed to update work order:', err);
      alert('Failed to update work order: ' + err.message);
    } finally {
      actionLoading = false;
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete work order #${workOrder.workOrderNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      actionLoading = true;
      await api.deleteWorkOrder(workOrder.id);
      alert('Work order deleted successfully');
      goto('/maintenance');
    } catch (err) {
      console.error('Failed to delete work order:', err);
      alert('Failed to delete work order: ' + err.message);
      actionLoading = false;
    }
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
            <button
              class="btn bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              disabled={actionLoading}
              on:click={handleApprove}
            >
              {#if actionLoading}
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              {/if}
              Approve Work Order
            </button>
            <button
              class="btn bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              disabled={actionLoading}
              on:click={handleReject}
            >
              {#if actionLoading}
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              {/if}
              Reject Work Order
            </button>
          {/if}

          {#if workOrder.status === 'approved'}
            <button
              class="btn bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              disabled={actionLoading}
              on:click={handleStart}
            >
              {#if actionLoading}
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              {/if}
              Start Work Order
            </button>
          {/if}

          {#if workOrder.status === 'in_progress'}
            <button
              class="btn bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              disabled={actionLoading}
              on:click={handleComplete}
            >
              {#if actionLoading}
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              {/if}
              Complete Work Order
            </button>
          {/if}

          {#if !['completed', 'cancelled'].includes(workOrder.status)}
            <button
              class="btn bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50"
              disabled={actionLoading}
              on:click={handleCancel}
            >
              {#if actionLoading}
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              {/if}
              Cancel Work Order
            </button>
            <button
              class="btn bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              disabled={actionLoading}
              on:click={handleEdit}
            >
              {#if actionLoading}
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              {/if}
              Edit Work Order
            </button>
          {/if}

          {#if ['pending', 'cancelled'].includes(workOrder.status)}
            <button
              class="btn bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              disabled={actionLoading}
              on:click={handleDelete}
            >
              {#if actionLoading}
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              {/if}
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

<!-- Edit Work Order Modal -->
<Modal bind:open={showEditModal} title="Edit Work Order" size="lg" on:close={() => showEditModal = false}>
  <form on:submit|preventDefault={handleEditSubmit} class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle *</label>
        <select
          bind:value={editFormData.vehicleId}
          required
          disabled={actionLoading}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Vehicle</option>
          {#each vehicles as vehicle}
            <option value={vehicle.id}>{vehicle.vehicleCode} ({vehicle.licensePlate})</option>
          {/each}
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Maintenance Type *</label>
        <select
          bind:value={editFormData.maintenanceTypeId}
          required
          disabled={actionLoading}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          {#each maintenanceTypes as type}
            <option value={type.id}>{type.typeName} ({type.category})</option>
          {/each}
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
      <input
        type="text"
        bind:value={editFormData.title}
        required
        disabled={actionLoading}
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Brief description of the maintenance work"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        bind:value={editFormData.description}
        rows="3"
        disabled={actionLoading}
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Detailed description of the work to be performed"
      ></textarea>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select
          bind:value={editFormData.priority}
          disabled={actionLoading}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={1}>1 - Urgent</option>
          <option value={2}>2 - High</option>
          <option value={3}>3 - Normal</option>
          <option value={4}>4 - Low</option>
          <option value={5}>5 - Optional</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
        <input
          type="date"
          bind:value={editFormData.scheduledDate}
          disabled={actionLoading}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
        <input
          type="number"
          step="0.01"
          bind:value={editFormData.estimatedCost}
          disabled={actionLoading}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
      <textarea
        bind:value={editFormData.notes}
        rows="2"
        disabled={actionLoading}
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Additional notes or special instructions"
      ></textarea>
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        on:click={() => showEditModal = false}
        disabled={actionLoading}
        class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={actionLoading}
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {#if actionLoading}
          <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Updating...
        {:else}
          Update Work Order
        {/if}
      </button>
    </div>
  </form>
</Modal>