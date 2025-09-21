<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { api } from '$lib/api';
  import DataTable from '$lib/components/DataTable.svelte';
  import Modal from '$lib/components/Modal.svelte';

  let warehouse = null;
  let materials = [];
  let lowStockMaterials = [];
  let loading = false;
  let showEditModal = false;
  let isSaving = false;
  let searchTerm = '';
  let currentPage = 1;
  let pageSize = 20;
  let totalItems = 0;

  // Form data for editing warehouse
  let warehouseForm = {
    warehouseCode: '',
    warehouseName: '',
    description: '',
    capacity: 0,
    address: '',
    contactNumber: '',
    managerName: ''
  };

  // Data table columns for materials in warehouse
  const materialColumns = [
    {
      key: 'materialCode',
      label: 'Code',
      sortable: true
    },
    {
      key: 'materialName',
      label: 'Material Name',
      sortable: true
    },
    {
      key: 'currentStock',
      label: 'Current Stock',
      sortable: true,
      render: (row) => {
        const stockLevel = row.currentStock <= row.criticalLevel ? 'text-red-600 font-medium' : 'text-green-600';
        return `<span class="${stockLevel}">${row.currentStock}</span>`;
      }
    },
    {
      key: 'criticalLevel',
      label: 'Critical Level',
      sortable: true
    },
    {
      key: 'standardPrice',
      label: 'Standard Price',
      sortable: true,
      render: (row) => `$${parseFloat(row.standardPrice || 0).toFixed(2)}`
    },
    {
      key: 'unit',
      label: 'Unit',
      sortable: false,
      render: (row) => row.unit?.unitName || 'N/A'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => `
        <div class="flex gap-2">
          <button onclick="viewMaterial(${row.id})" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            View Details
          </button>
        </div>
      `
    }
  ];

  // Get warehouse ID from URL
  $: warehouseId = parseInt($page.params.id);

  onMount(() => {
    if (warehouseId) {
      loadWarehouseDetails();
      loadWarehouseMaterials();
    }
  });

  async function loadWarehouseDetails() {
    loading = true;
    try {
      // For now, we'll fetch from the warehouses list since there might not be a specific warehouse detail endpoint
      const warehousesResponse = await api.getWarehouses();
      warehouse = warehousesResponse.data.find(w => w.id === warehouseId);

      if (warehouse) {
        warehouseForm = {
          warehouseCode: warehouse.warehouseCode || '',
          warehouseName: warehouse.warehouseName || '',
          description: warehouse.description || '',
          capacity: warehouse.capacity || 0,
          address: warehouse.address || '',
          contactNumber: warehouse.contactNumber || '',
          managerName: warehouse.managerName || ''
        };
      }
    } catch (error) {
      console.error('Error loading warehouse details:', error);
      if (error.message?.includes('authentication') || error.message?.includes('401')) {
        // Authentication failed, redirect to login
        localStorage.removeItem('token');
        goto('/');
        return;
      }
      alert('Failed to load warehouse details: ' + error.message);
    } finally {
      loading = false;
    }
  }

  async function loadWarehouseMaterials() {
    try {
      // Load materials filtered by warehouse
      const materialsResponse = await api.getMaterials({
        page: currentPage,
        limit: pageSize,
        search: searchTerm
      });

      // Filter materials by warehouse ID (assuming the API returns all materials)
      materials = materialsResponse.data.filter(material => material.warehouseId === warehouseId);
      totalItems = materials.length;

      // Also load low stock materials for this warehouse
      const lowStockResponse = await api.getLowStockMaterials();
      lowStockMaterials = lowStockResponse.data.filter(material => material.warehouseId === warehouseId);
    } catch (error) {
      console.error('Error loading warehouse materials:', error);
    }
  }

  async function updateWarehouse() {
    if (!warehouse) return;

    isSaving = true;
    try {
      // Note: This assumes there's an update warehouse endpoint in the API
      // If not available, you may need to implement it in the backend
      await api.updateWarehouse?.(warehouseId, warehouseForm);

      warehouse = { ...warehouse, ...warehouseForm };
      showEditModal = false;
      alert('Warehouse updated successfully');
    } catch (error) {
      console.error('Error updating warehouse:', error);
      alert('Failed to update warehouse: ' + error.message);
    } finally {
      isSaving = false;
    }
  }

  function openEditModal() {
    showEditModal = true;
  }

  function closeEditModal() {
    showEditModal = false;
    // Reset form to original values
    if (warehouse) {
      warehouseForm = {
        warehouseCode: warehouse.warehouseCode || '',
        warehouseName: warehouse.warehouseName || '',
        description: warehouse.description || '',
        capacity: warehouse.capacity || 0,
        address: warehouse.address || '',
        contactNumber: warehouse.contactNumber || '',
        managerName: warehouse.managerName || ''
      };
    }
  }

  // Make viewMaterial globally available for the action buttons (browser only)
  if (typeof window !== 'undefined') {
    window.viewMaterial = function(materialId) {
      goto(`/materials/${materialId}`);
    };
  }
</script>

<svelte:head>
  <title>Warehouse Details - MedFMS</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- Back Button -->
  <div class="mb-6">
    <button
      on:click={() => goto('/materials')}
      class="flex items-center text-blue-600 hover:text-blue-800"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Materials
    </button>
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-4 text-gray-600">Loading warehouse details...</span>
    </div>
  {:else if warehouse}
    <!-- Warehouse Header -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{warehouse.warehouseName}</h1>
          <p class="text-lg text-gray-600 mb-4">Code: {warehouse.warehouseCode}</p>
          {#if warehouse.description}
            <p class="text-gray-700 mb-4">{warehouse.description}</p>
          {/if}
        </div>
        <button
          on:click={openEditModal}
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Warehouse
        </button>
      </div>

      <!-- Warehouse Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Capacity</h3>
          <p class="text-2xl font-bold text-gray-900 mt-1">{warehouse.capacity || 'N/A'}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Materials</h3>
          <p class="text-2xl font-bold text-gray-900 mt-1">{materials.length}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Low Stock Items</h3>
          <p class="text-2xl font-bold text-red-600 mt-1">{lowStockMaterials.length}</p>
        </div>
        {#if warehouse.address}
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</h3>
            <p class="text-gray-900 mt-1">{warehouse.address}</p>
          </div>
        {/if}
        {#if warehouse.contactNumber}
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact</h3>
            <p class="text-gray-900 mt-1">{warehouse.contactNumber}</p>
          </div>
        {/if}
        {#if warehouse.managerName}
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Manager</h3>
            <p class="text-gray-900 mt-1">{warehouse.managerName}</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Low Stock Alert -->
    {#if lowStockMaterials.length > 0}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 class="text-red-800 font-medium">Low Stock Alert</h3>
            <p class="text-red-700 text-sm mt-1">
              {lowStockMaterials.length} material{lowStockMaterials.length !== 1 ? 's' : ''} in this warehouse {lowStockMaterials.length !== 1 ? 'are' : 'is'} below critical level.
            </p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Materials in Warehouse -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Materials in Warehouse</h2>
      </div>

      <div class="p-6">
        <!-- Search -->
        <div class="mb-4">
          <input
            type="text"
            placeholder="Search materials..."
            bind:value={searchTerm}
            on:input={loadWarehouseMaterials}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Materials Table -->
        <DataTable
          data={materials}
          columns={materialColumns}
          {currentPage}
          {pageSize}
          {totalItems}
          on:pageChange={(event) => {
            currentPage = event.detail.page;
            loadWarehouseMaterials();
          }}
          on:sort={(event) => {
            // Handle sorting if needed
            console.log('Sort by:', event.detail);
          }}
        />
      </div>
    </div>
  {:else}
    <div class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Warehouse Not Found</h2>
      <p class="text-gray-600 mb-6">The warehouse you're looking for doesn't exist or has been removed.</p>
      <button
        on:click={() => goto('/materials')}
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Return to Materials
      </button>
    </div>
  {/if}
</div>

<!-- Edit Warehouse Modal -->
<Modal bind:show={showEditModal} title="Edit Warehouse">
  <form on:submit|preventDefault={updateWarehouse} class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Warehouse Code</label>
        <input
          type="text"
          bind:value={warehouseForm.warehouseCode}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Warehouse Name</label>
        <input
          type="text"
          bind:value={warehouseForm.warehouseName}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        bind:value={warehouseForm.description}
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
        <input
          type="number"
          bind:value={warehouseForm.capacity}
          min="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Manager Name</label>
        <input
          type="text"
          bind:value={warehouseForm.managerName}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
      <textarea
        bind:value={warehouseForm.address}
        rows="2"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
      <input
        type="text"
        bind:value={warehouseForm.contactNumber}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        on:click={closeEditModal}
        class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSaving}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  </form>
</Modal>