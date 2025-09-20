<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import DataTable from '$lib/components/DataTable.svelte';
  import Modal from '$lib/components/Modal.svelte';

  let workOrders = [];
  let loading = false;
  let pagination = null;
  let showApprovalModal = false;
  let selectedWorkOrder = null;
  let approvalNotes = '';
  let isApproving = false;
  let searchTerm = '';
  let currentPage = 1;
  let pageSize = 20;
  let totalItems = 0;

  // Filter state
  let filters = {
    page: 1,
    limit: 20,
    priority: '',
  };

  // Priority options
  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 1, label: '1 - Urgent' },
    { value: 2, label: '2 - High' },
    { value: 3, label: '3 - Normal' },
    { value: 4, label: '4 - Low' },
    { value: 5, label: '5 - Optional' }
  ];

  // Data table columns
  const columns = [
    {
      key: 'workOrder.workOrderNumber',
      label: 'Work Order #',
      sortable: true,
      render: (row) => row?.workOrder?.workOrderNumber || 'N/A'
    },
    {
      key: 'vehicle.vehicleCode',
      label: 'Vehicle',
      sortable: true,
      render: (row) => `${row?.vehicle?.vehicleCode || ''} (${row?.vehicle?.licensePlate || ''})`
    },
    {
      key: 'maintenanceType.typeName',
      label: 'Maintenance Type',
      sortable: true,
      render: (row) => row?.maintenanceType?.typeName || ''
    },
    {
      key: 'workOrder.title',
      label: 'Title',
      sortable: true,
      render: (row) => row?.workOrder?.title || 'N/A'
    },
    {
      key: 'workOrder.priority',
      label: 'Priority',
      sortable: true,
      render: (row) => {
        const priority = row?.workOrder?.priority || 3;
        const priorityLabels = {
          1: { label: 'Urgent', class: 'bg-red-100 text-red-800' },
          2: { label: 'High', class: 'bg-orange-100 text-orange-800' },
          3: { label: 'Normal', class: 'bg-blue-100 text-blue-800' },
          4: { label: 'Low', class: 'bg-green-100 text-green-800' },
          5: { label: 'Optional', class: 'bg-gray-100 text-gray-800' }
        };
        const p = priorityLabels[priority] || priorityLabels[3];
        return `<span class="px-2 py-1 text-xs font-medium rounded-full ${p.class}">${p.label}</span>`;
      }
    },
    {
      key: 'workOrder.scheduledDate',
      label: 'Scheduled Date',
      sortable: true,
      render: (row) => row?.workOrder?.scheduledDate ? new Date(row?.workOrder?.scheduledDate).toLocaleDateString() : '-'
    },
    {
      key: 'workOrder.estimatedCost',
      label: 'Est. Cost',
      sortable: true,
      render: (row) => row?.workOrder?.estimatedCost ? `$${parseFloat(row?.workOrder?.estimatedCost).toFixed(2)}` : '-'
    },
    {
      key: 'workOrder.createdAt',
      label: 'Created',
      sortable: true,
      render: (row) => row?.workOrder?.createdAt ? new Date(row?.workOrder?.createdAt).toLocaleDateString() : 'N/A'
    }
  ];

  onMount(async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    await loadWorkOrders();
  });

  async function loadWorkOrders() {
    loading = true;
    try {
      const response = await api.getWorkOrdersForApproval({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        ...filters
      });

      workOrders = response.data || [];
      totalItems = response.pagination?.total || response.data?.length || 0;
      pagination = response.pagination;
    } catch (error) {
      console.error('Failed to load work orders for approval:', error);
      workOrders = [];
    } finally {
      loading = false;
    }
  }

  function handleSearch(event) {
    searchTerm = event.detail.term;
    currentPage = 1;
    loadWorkOrders();
  }

  function handlePageChange(event) {
    currentPage = event.detail.page;
    loadWorkOrders();
  }

  function handleRowClick(event) {
    const row = event.detail.row;
    goto(`/maintenance/work-orders/${row.workOrder?.id}`);
  }

  async function handleFilter() {
    currentPage = 1;
    await loadWorkOrders();
  }

  function resetFilters() {
    filters = {
      page: 1,
      limit: 20,
      priority: '',
    };
    searchTerm = '';
    currentPage = 1;
    loadWorkOrders();
  }

  function handleRowAction(event) {
    const { action, row } = event.detail;
    selectedWorkOrder = row;
    approvalNotes = '';

    if (action === 'approve' || action === 'reject') {
      showApprovalModal = true;
    }
  }

  async function handleApprove() {
    if (!selectedWorkOrder) return;

    try {
      isApproving = true;
      await api.approveWorkOrder(selectedWorkOrder.workOrder?.id, approvalNotes);
      showApprovalModal = false;
      await loadWorkOrders();
      alert('Work order approved successfully');
    } catch (error) {
      console.error('Error approving work order:', error);
      alert('Failed to approve work order: ' + error.message);
    } finally {
      isApproving = false;
    }
  }

  async function handleReject() {
    if (!selectedWorkOrder || !approvalNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      isApproving = true;
      await api.rejectWorkOrder(selectedWorkOrder.workOrder?.id, approvalNotes);
      showApprovalModal = false;
      await loadWorkOrders();
      alert('Work order rejected successfully');
    } catch (error) {
      console.error('Error rejecting work order:', error);
      alert('Failed to reject work order: ' + error.message);
    } finally {
      isApproving = false;
    }
  }
</script>

<svelte:head>
  <title>Work Order Approvals - MedFMS</title>
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
              <li class="text-gray-900 font-medium">Approvals</li>
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

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow border mb-6">
      <h3 class="text-lg font-semibold mb-4">Filters</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            bind:value={filters.priority}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each priorityOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <div class="flex items-end gap-2">
          <button
            on:click={handleFilter}
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            on:click={resetFilters}
            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Work Orders Table -->
    <DataTable
      data={workOrders}
      {columns}
      {loading}
      {searchTerm}
      {currentPage}
      {pageSize}
      {totalItems}
      title="Work Orders Pending Approval"
      showSearch={true}
      showPagination={true}
      showExport={true}
      actions={[
        { key: 'approve', label: 'Approve', condition: () => true, class: 'bg-green-600 hover:bg-green-700 text-white' },
        { key: 'reject', label: 'Reject', condition: () => true, class: 'bg-red-600 hover:bg-red-700 text-white' }
      ]}
      on:search={handleSearch}
      on:pagechange={handlePageChange}
      on:rowclick={handleRowClick}
      on:rowAction={handleRowAction}
    />
  </main>
</div>

<!-- Approval Modal -->
<Modal bind:open={showApprovalModal} title="Work Order Approval" on:close={() => showApprovalModal = false}>
  {#if selectedWorkOrder}
    <div class="space-y-4">
      <!-- Work Order Details -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="font-medium text-gray-900 mb-2">Work Order Details</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium">Work Order #:</span>
            {selectedWorkOrder.workOrder?.workOrderNumber || 'N/A'}
          </div>
          <div>
            <span class="font-medium">Vehicle:</span>
            {selectedWorkOrder.vehicle?.vehicleCode} ({selectedWorkOrder.vehicle?.licensePlate})
          </div>
          <div>
            <span class="font-medium">Maintenance Type:</span>
            {selectedWorkOrder.maintenanceType?.typeName}
          </div>
          <div>
            <span class="font-medium">Priority:</span>
            {['', 'Urgent', 'High', 'Normal', 'Low', 'Optional'][selectedWorkOrder.workOrder?.priority || 3]}
          </div>
          <div class="col-span-2">
            <span class="font-medium">Title:</span>
            {selectedWorkOrder.workOrder?.title || 'N/A'}
          </div>
          {#if selectedWorkOrder.workOrder?.description}
            <div class="col-span-2">
              <span class="font-medium">Description:</span>
              {selectedWorkOrder.workOrder?.description}
            </div>
          {/if}
          {#if selectedWorkOrder.workOrder?.estimatedCost}
            <div>
              <span class="font-medium">Estimated Cost:</span>
              ${parseFloat(selectedWorkOrder.workOrder?.estimatedCost || 0).toFixed(2)}
            </div>
          {/if}
          {#if selectedWorkOrder.workOrder?.scheduledDate}
            <div>
              <span class="font-medium">Scheduled Date:</span>
              {new Date(selectedWorkOrder.workOrder?.scheduledDate).toLocaleDateString()}
            </div>
          {/if}
        </div>
      </div>

      <!-- Notes Section -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Approval Notes
          <span class="text-red-500">*</span>
        </label>
        <textarea
          bind:value={approvalNotes}
          rows="4"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter notes about the approval or rejection (required for rejection)"
        ></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          on:click={() => showApprovalModal = false}
          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          disabled={isApproving}
        >
          Cancel
        </button>
        <button
          type="button"
          on:click={handleReject}
          disabled={isApproving || !approvalNotes.trim()}
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isApproving ? 'Processing...' : 'Reject'}
        </button>
        <button
          type="button"
          on:click={handleApprove}
          disabled={isApproving}
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isApproving ? 'Processing...' : 'Approve'}
        </button>
      </div>
    </div>
  {/if}
</Modal>