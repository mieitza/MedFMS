<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import DataTable from '$lib/components/DataTable.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import FileUpload from '$lib/components/FileUpload.svelte';
  import WorkOrderFiles from '$lib/components/WorkOrderFiles.svelte';

  let workOrders = [];
  let vehicles = [];
  let maintenanceTypes = [];
  let loading = false;
  let pagination = null;
  let showCreateModal = false;
  let showEditModal = false;
  let editingWorkOrder = null;
  let dashboardData = null;
  let createdWorkOrderId = null;
  let uploadedFiles = [];
  let searchTerm = '';
  let currentPage = 1;
  let pageSize = 20;
  let totalItems = 0;

  // Filter state - removed page and limit to avoid conflicts with pagination
  let filters = {
    vehicleId: '',
    status: '',
    priority: '',
    startDate: '',
    endDate: ''
  };

  // Form state for creating work orders
  let formData = {
    vehicleId: '',
    maintenanceTypeId: '',
    title: '',
    description: '',
    priority: 3,
    scheduledDate: '',
    assignedTechnicianId: '',
    estimatedCost: '',
    notes: ''
  };

  // Status options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'on_hold', label: 'On Hold' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 1, label: '1 - Urgent' },
    { value: 2, label: '2 - High' },
    { value: 3, label: '3 - Normal' },
    { value: 4, label: '4 - Low' },
    { value: 5, label: '5 - Optional' }
  ];

  // Data table columns - optimized for better visibility
  const columns = [
    {
      key: 'workOrder.workOrderNumber',
      label: 'WO#',
      sortable: true,
      width: '120px',
      render: (value, row) => row?.workOrder?.workOrderNumber || 'N/A'
    },
    {
      key: 'vehicle.vehicleCode',
      label: 'Vehicle',
      sortable: true,
      width: '140px',
      render: (value, row) => `${row?.vehicle?.vehicleCode || ''}<br><small class="text-gray-500">${row?.vehicle?.licensePlate || ''}</small>`
    },
    {
      key: 'workOrder.title',
      label: 'Title',
      sortable: true,
      width: '200px',
      render: (value, row) => {
        const title = row?.workOrder?.title || 'N/A';
        const type = row?.maintenanceType?.typeName || '';
        return `<div class="max-w-48"><div class="truncate font-medium">${title}</div><small class="text-gray-500 truncate block">${type}</small></div>`;
      }
    },
    {
      key: 'workOrder.priority',
      label: 'Priority',
      sortable: true,
      width: '100px',
      render: (value, row) => {
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
      key: 'workOrder.status',
      label: 'Status',
      sortable: true,
      width: '110px',
      render: (value, row) => {
        const status = row?.workOrder?.status || 'unknown';
        const statusClasses = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-blue-100 text-blue-800',
          in_progress: 'bg-purple-100 text-purple-800',
          completed: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800',
          on_hold: 'bg-gray-100 text-gray-800'
        };
        const statusClass = statusClasses[status] || statusClasses.pending;
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
        return `<span class="px-2 py-1 text-xs font-medium rounded-full ${statusClass}">${statusLabel}</span>`;
      }
    },
    {
      key: 'workOrder.scheduledDate',
      label: 'Scheduled',
      sortable: true,
      width: '110px',
      render: (value, row) => row?.workOrder?.scheduledDate ? new Date(row?.workOrder?.scheduledDate).toLocaleDateString() : '-'
    },
    {
      key: 'workOrder.estimatedCost',
      label: 'Cost',
      sortable: true,
      width: '90px',
      render: (value, row) => row?.workOrder?.estimatedCost ? `$${parseFloat(row?.workOrder?.estimatedCost).toFixed(0)}` : '-'
    }
  ];

  onMount(async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    await Promise.all([
      loadWorkOrders(),
      loadVehicles(),
      loadMaintenanceTypes()
    ]);

    // Load dashboard data separately with error handling
    // Don't block page load if dashboard fails
    setTimeout(() => {
      loadDashboardData();
    }, 500);
  });

  async function loadWorkOrders() {
    loading = true;
    try {
      // Extract filter values, excluding page and limit to avoid conflicts
      const { page: _, limit: __, ...filterParams } = filters;

      const response = await api.getMaintenanceWorkOrders({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        ...filterParams
      });

      console.log('API Request params:', {
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        ...filterParams
      });
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response data length:', response.data?.length);

      workOrders = (response.data || []).filter(item => item != null);
      totalItems = response.pagination?.total || response.data?.length || 0;
      pagination = response.pagination;
    } catch (error) {
      console.error('Failed to load work orders:', error);
      workOrders = [];
    } finally {
      loading = false;
    }
  }

  async function loadVehicles() {
    try {
      const response = await api.getVehicles({ limit: 1000 });
      vehicles = response.data || [];
    } catch (error) {
      console.error('Error loading vehicles:', error);
      vehicles = [];
    }
  }

  async function loadMaintenanceTypes() {
    try {
      const response = await api.getMaintenanceTypes();
      maintenanceTypes = response.data || [];
    } catch (error) {
      console.error('Error loading maintenance types:', error);
      maintenanceTypes = [];
    }
  }

  let dashboardLoadTimeout = null;

  async function loadDashboardData() {
    try {
      const response = await api.getMaintenanceDashboard();
      dashboardData = response.data;
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      dashboardData = null;
    }
  }

  // Debounced version to prevent excessive API calls
  function debouncedLoadDashboardData() {
    if (dashboardLoadTimeout) {
      clearTimeout(dashboardLoadTimeout);
    }
    dashboardLoadTimeout = setTimeout(loadDashboardData, 1000); // 1 second delay
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
    goto(`/maintenance/work-orders/${row.workOrder.id}`);
  }

  async function handleFilter() {
    currentPage = 1;
    await loadWorkOrders();
  }

  function resetFilters() {
    filters = {
      vehicleId: '',
      status: '',
      priority: '',
      startDate: '',
      endDate: ''
    };
    searchTerm = '';
    currentPage = 1;
    loadWorkOrders();
  }

  function openCreateModal() {
    formData = {
      vehicleId: '',
      maintenanceTypeId: '',
      title: '',
      description: '',
      priority: 3,
      scheduledDate: '',
      assignedTechnicianId: '',
      estimatedCost: '',
      notes: ''
    };
    createdWorkOrderId = null;
    uploadedFiles = [];
    showCreateModal = true;
  }

  async function handleSubmit() {
    try {
      loading = true;

      const submitData = {
        ...formData,
        vehicleId: parseInt(formData.vehicleId),
        maintenanceTypeId: parseInt(formData.maintenanceTypeId),
        priority: parseInt(formData.priority),
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
        assignedTechnicianId: formData.assignedTechnicianId ? parseInt(formData.assignedTechnicianId) : undefined,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined
      };

      const result = await api.createMaintenanceWorkOrder(submitData);
      createdWorkOrderId = result.data.id;

      showCreateModal = false;
      await loadWorkOrders();
      debouncedLoadDashboardData(); // Refresh dashboard with debouncing
    } catch (error) {
      console.error('Error creating work order:', error);
      alert('Failed to create work order: ' + error.message);
    } finally {
      loading = false;
    }
  }

  function handleFileUploaded(event) {
    uploadedFiles = [...uploadedFiles, ...event.detail.files];
    console.log('Files uploaded:', event.detail);
  }

  async function updateWorkOrderStatus(workOrderId, newStatus) {
    try {
      const notes = prompt(`Enter notes for status change to "${newStatus}":`);
      if (notes === null) return; // User cancelled

      await api.updateMaintenanceWorkOrderStatus(workOrderId, newStatus, notes);
      await loadWorkOrders();
      debouncedLoadDashboardData(); // Refresh dashboard with debouncing
    } catch (error) {
      console.error('Error updating work order status:', error);
      alert('Failed to update status: ' + error.message);
    }
  }

  function handleRowAction(event) {
    const { action, row } = event.detail;
    const workOrderId = row?.workOrder?.id;

    if (action === 'edit') {
      openEditModal(row);
    } else if (action === 'delete') {
      handleDeleteWorkOrder(workOrderId);
    } else if (action === 'approve') {
      updateWorkOrderStatus(workOrderId, 'approved');
    } else if (action === 'start') {
      updateWorkOrderStatus(workOrderId, 'in_progress');
    } else if (action === 'complete') {
      updateWorkOrderStatus(workOrderId, 'completed');
    } else if (action === 'cancel') {
      updateWorkOrderStatus(workOrderId, 'cancelled');
    }
  }

  function openEditModal(row) {
    editingWorkOrder = row.workOrder;
    // Pre-populate the form with existing data
    formData = {
      vehicleId: editingWorkOrder.vehicleId?.toString() || '',
      maintenanceTypeId: editingWorkOrder.maintenanceTypeId?.toString() || '',
      title: editingWorkOrder.title || '',
      description: editingWorkOrder.description || '',
      priority: editingWorkOrder.priority || 3,
      scheduledDate: editingWorkOrder.scheduledDate ? editingWorkOrder.scheduledDate.split('T')[0] : '',
      assignedTechnicianId: editingWorkOrder.assignedTechnicianId?.toString() || '',
      estimatedCost: editingWorkOrder.estimatedCost?.toString() || '',
      notes: editingWorkOrder.notes || ''
    };
    showEditModal = true;
  }

  async function handleDeleteWorkOrder(workOrderId) {
    if (!workOrderId) return;

    if (confirm('Are you sure you want to delete this work order? This action cannot be undone.')) {
      try {
        loading = true;
        await api.deleteWorkOrder(workOrderId);
        await loadWorkOrders();
        alert('Work order deleted successfully');
      } catch (error) {
        console.error('Error deleting work order:', error);
        alert('Failed to delete work order: ' + error.message);
      } finally {
        loading = false;
      }
    }
  }

  async function handleEditSubmit() {
    if (!editingWorkOrder) return;

    try {
      loading = true;
      const submitData = {
        ...formData,
        vehicleId: parseInt(formData.vehicleId),
        maintenanceTypeId: parseInt(formData.maintenanceTypeId),
        priority: parseInt(formData.priority),
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
        assignedTechnicianId: formData.assignedTechnicianId ? parseInt(formData.assignedTechnicianId) : undefined,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined
      };

      await api.updateWorkOrder(editingWorkOrder.id, submitData);
      showEditModal = false;
      await loadWorkOrders();
      alert('Work order updated successfully');
    } catch (error) {
      console.error('Error updating work order:', error);
      alert('Failed to update work order: ' + error.message);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Maintenance Management - MedFMS</title>
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
              <li class="text-gray-900 font-medium">Maintenance</li>
            </ol>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <a
            href="/maintenance/approvals"
            class="btn btn-secondary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Work Order Approvals
          </a>
          <button
            on:click={openCreateModal}
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Work Order
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Dashboard Cards -->
    {#if dashboardData}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Pending Work Orders</p>
              <p class="text-2xl font-bold text-gray-900">{dashboardData.pendingWorkOrders}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Overdue Maintenance</p>
              <p class="text-2xl font-bold text-gray-900">{dashboardData.overdueMaintenance}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Upcoming (7 days)</p>
              <p class="text-2xl font-bold text-gray-900">{dashboardData.upcomingMaintenance}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Monthly Cost</p>
              <p class="text-2xl font-bold text-gray-900">${dashboardData.monthlyMaintenanceCost.toFixed(2)}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow border mb-6">
      <h3 class="text-lg font-semibold mb-4">Filters</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
          <select
            bind:value={filters.vehicleId}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Vehicles</option>
            {#each vehicles as vehicle}
              <option value={vehicle.id}>{vehicle.vehicleCode} ({vehicle.licensePlate})</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            bind:value={filters.status}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each statusOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

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

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            bind:value={filters.startDate}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            bind:value={filters.endDate}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
      title="Maintenance Work Orders"
      showSearch={true}
      showPagination={true}
      showExport={true}
      actions={[
        { key: 'edit', label: 'Edit', condition: (row) => row?.workOrder?.status && !['completed', 'cancelled'].includes(row?.workOrder?.status), class: 'bg-blue-600 hover:bg-blue-700 text-white' },
        { key: 'approve', label: 'Approve', condition: (row) => row?.workOrder?.status === 'pending', class: 'bg-green-600 hover:bg-green-700 text-white' },
        { key: 'start', label: 'Start', condition: (row) => row?.workOrder?.status === 'approved', class: 'bg-yellow-600 hover:bg-yellow-700 text-white' },
        { key: 'complete', label: 'Complete', condition: (row) => row?.workOrder?.status === 'in_progress', class: 'bg-purple-600 hover:bg-purple-700 text-white' },
        { key: 'cancel', label: 'Cancel', condition: (row) => row?.workOrder?.status && !['completed', 'cancelled'].includes(row?.workOrder?.status), class: 'bg-gray-600 hover:bg-gray-700 text-white' },
        { key: 'delete', label: 'Delete', condition: (row) => row?.workOrder?.status && ['pending', 'cancelled'].includes(row?.workOrder?.status), class: 'bg-red-600 hover:bg-red-700 text-white' }
      ]}
      on:search={handleSearch}
      on:pagechange={handlePageChange}
      on:rowclick={handleRowClick}
      on:rowAction={handleRowAction}
    />
  </main>
</div>

<!-- Create Work Order Modal -->
<Modal bind:open={showCreateModal} title="Create Work Order" on:close={() => showCreateModal = false}>
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle *</label>
          <select
            bind:value={formData.vehicleId}
            required
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
            bind:value={formData.maintenanceTypeId}
            required
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
          bind:value={formData.title}
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of the maintenance work"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          bind:value={formData.description}
          rows="3"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Detailed description of the work to be performed"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            bind:value={formData.priority}
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
            bind:value={formData.scheduledDate}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
          <input
            type="number"
            step="0.01"
            bind:value={formData.estimatedCost}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          bind:value={formData.notes}
          rows="2"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Additional notes or special instructions"
        ></textarea>
      </div>

      <!-- File Upload Section -->
      <div>
        <WorkOrderFiles
          workOrderId={createdWorkOrderId}
          showUpload={true}
          title="Attach Photos and Documents"
          on:fileUploaded={handleFileUploaded}
        />
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          on:click={() => showCreateModal = false}
          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating...' : 'Create Work Order'}
        </button>
      </div>
    </form>
</Modal>

<!-- Edit Work Order Modal -->
<Modal bind:open={showEditModal} title="Edit Work Order" on:close={() => showEditModal = false}>
  {#if editingWorkOrder}
    <form on:submit|preventDefault={handleEditSubmit} class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Vehicle <span class="text-red-500">*</span>
          </label>
          <select
            bind:value={formData.vehicleId}
            required
            disabled={loading}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a vehicle</option>
            {#each vehicles as vehicle}
              <option value={vehicle.id}>{vehicle.vehicleCode} - {vehicle.licensePlate}</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Maintenance Type <span class="text-red-500">*</span>
          </label>
          <select
            bind:value={formData.maintenanceTypeId}
            required
            disabled={loading}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select maintenance type</option>
            {#each maintenanceTypes as type}
              <option value={type.id}>{type.typeName} ({type.category})</option>
            {/each}
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            bind:value={formData.title}
            required
            disabled={loading}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter work order title"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            bind:value={formData.priority}
            disabled={loading}
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
            bind:value={formData.scheduledDate}
            disabled={loading}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
          <input
            type="number"
            step="0.01"
            bind:value={formData.estimatedCost}
            disabled={loading}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            bind:value={formData.description}
            rows="3"
            disabled={loading}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter detailed description"
          ></textarea>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            bind:value={formData.notes}
            rows="2"
            disabled={loading}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes"
          ></textarea>
        </div>
      </div>

      <!-- File Management Section -->
      <div class="border-t pt-6">
        <WorkOrderFiles
          workOrderId={editingWorkOrder?.id}
          showUpload={true}
          title="Work Order Files"
          on:fileUploaded={() => {
            // File uploaded successfully
            console.log('File uploaded to work order');
          }}
          on:fileDeleted={() => {
            // File deleted successfully
            console.log('File deleted from work order');
          }}
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          on:click={() => showEditModal = false}
          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Updating...' : 'Update Work Order'}
        </button>
      </div>
    </form>
  {/if}
</Modal>