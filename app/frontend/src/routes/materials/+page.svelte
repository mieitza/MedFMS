<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import DataTable from '$lib/components/DataTable.svelte';
  import Modal from '$lib/components/Modal.svelte';

  let materials = [];
  let warehouses = [];
  let loading = false;
  let pagination = null;
  let showMaterialModal = false;
  let showWarehouseModal = false;
  let selectedMaterial = null;
  let isEditing = false;
  let isSaving = false;
  let searchTerm = '';
  let currentPage = 1;
  let pageSize = 20;
  let totalItems = 0;

  // Filter state
  let filters = {
    page: 1,
    limit: 20,
  };

  // Form data
  let materialForm = {
    materialCode: '',
    materialName: '',
    description: '',
    unitId: 1,
    currentStock: 0,
    criticalLevel: 0,
    standardPrice: 0,
    warehouseId: null,
  };

  let warehouseForm = {
    warehouseCode: '',
    warehouseName: '',
    description: '',
    capacity: 0,
  };

  // Data table columns
  const columns = [
    {
      key: 'materialCode',
      label: 'Material Code',
      sortable: true,
      render: (row) => (row && row.materialCode) || 'N/A'
    },
    {
      key: 'materialName',
      label: 'Material Name',
      sortable: true,
      render: (row) => (row && row.materialName) || 'N/A'
    },
    {
      key: 'currentStock',
      label: 'Current Stock',
      sortable: true,
      render: (row) => parseFloat((row && row.currentStock) || 0).toFixed(2)
    },
    {
      key: 'criticalLevel',
      label: 'Critical Level',
      sortable: true,
      render: (row) => parseFloat((row && row.criticalLevel) || 0).toFixed(2)
    },
    {
      key: 'standardPrice',
      label: 'Standard Price',
      sortable: true,
      render: (row) => (row && row.standardPrice) ? `$${parseFloat(row.standardPrice).toFixed(2)}` : '-'
    },
    {
      key: 'stockStatus',
      label: 'Stock Status',
      sortable: false,
      render: (row) => {
        if (!row) return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">N/A</span>';
        const stock = parseFloat(row.currentStock || 0);
        const critical = parseFloat(row.criticalLevel || 0);
        if (stock <= critical) {
          return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Low Stock</span>';
        } else if (stock <= critical * 1.5) {
          return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Warning</span>';
        } else {
          return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">In Stock</span>';
        }
      }
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (row) => (row && row.createdAt) ? new Date(row.createdAt).toLocaleDateString() : 'N/A'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => `
        <div class="flex gap-2">
          <button onclick="viewMaterial(${(row && row.id) || 0})" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            View Details
          </button>
        </div>
      `
    }
  ];

  // Warehouse table columns
  const warehouseColumns = [
    {
      key: 'warehouseCode',
      label: 'Code',
      sortable: true
    },
    {
      key: 'warehouseName',
      label: 'Warehouse Name',
      sortable: true
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (row) => (row && row.description) || '-'
    },
    {
      key: 'capacity',
      label: 'Capacity',
      sortable: true,
      render: (row) => (row && row.capacity) || '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => `
        <div class="flex gap-2">
          <button onclick="viewWarehouse(${(row && row.id) || 0})" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            View Details
          </button>
        </div>
      `
    }
  ];

  onMount(async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/');
      return;
    }

    await loadMaterials();
    await loadWarehouses();
  });

  async function loadMaterials() {
    loading = true;
    try {
      const response = await api.getMaterials({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        ...filters
      });

      materials = response.data || [];
      totalItems = response.pagination?.total || response.data?.length || 0;
      pagination = response.pagination;
    } catch (error) {
      console.error('Failed to load materials:', error);
      materials = [];
    } finally {
      loading = false;
    }
  }

  async function loadWarehouses() {
    try {
      const response = await api.getWarehouses();
      warehouses = response.data || [];
    } catch (error) {
      console.error('Failed to load warehouses:', error);
      if (error.message?.includes('Authentication required') || error.message?.includes('401')) {
        // Authentication failed, redirect to login
        localStorage.removeItem('token');
        goto('/');
        return;
      }
      warehouses = [];
    }
  }

  // Navigation functions for action buttons
  function viewMaterial(materialId) {
    goto(`/materials/${materialId}`);
  }

  function viewWarehouse(warehouseId) {
    goto(`/materials/warehouses/${warehouseId}`);
  }

  // Make functions globally available for inline onclick handlers (browser only)
  if (typeof window !== 'undefined') {
    window.viewMaterial = viewMaterial;
    window.viewWarehouse = viewWarehouse;
  }

  function handleSearch(event) {
    searchTerm = event.detail.term;
    currentPage = 1;
    loadMaterials();
  }

  function handlePageChange(event) {
    currentPage = event.detail.page;
    loadMaterials();
  }

  function handleRowClick(event) {
    const material = event.detail.row;
    goto(`/materials/${material.id}`);
  }

  function handleRowAction(event) {
    const { action, row } = event.detail;
    selectedMaterial = row;

    if (action === 'edit') {
      openMaterialModal(row);
    } else if (action === 'delete') {
      deleteMaterial(row.id);
    }
  }

  function openMaterialModal(material = null) {
    if (material) {
      isEditing = true;
      selectedMaterial = material;
      materialForm = {
        materialCode: material.materialCode,
        materialName: material.materialName,
        description: material.description || '',
        unitId: material.unitId || 1,
        currentStock: material.currentStock || 0,
        criticalLevel: material.criticalLevel || 0,
        standardPrice: material.standardPrice || 0,
        warehouseId: material.warehouseId,
      };
    } else {
      isEditing = false;
      selectedMaterial = null;
      materialForm = {
        materialCode: '',
        materialName: '',
        description: '',
        unitId: 1,
        currentStock: 0,
        criticalLevel: 0,
        standardPrice: 0,
        warehouseId: null,
      };
    }
    showMaterialModal = true;
  }

  function openWarehouseModal() {
    warehouseForm = {
      warehouseCode: '',
      warehouseName: '',
      description: '',
      capacity: 0,
    };
    showWarehouseModal = true;
  }

  async function saveMaterial() {
    try {
      isSaving = true;

      if (isEditing) {
        await api.updateMaterial(selectedMaterial.id, materialForm);
        alert('Material updated successfully');
      } else {
        await api.createMaterial(materialForm);
        alert('Material created successfully');
      }

      showMaterialModal = false;
      await loadMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      alert('Failed to save material: ' + error.message);
    } finally {
      isSaving = false;
    }
  }

  async function saveWarehouse() {
    try {
      isSaving = true;
      await api.createWarehouse(warehouseForm);
      showWarehouseModal = false;
      await loadWarehouses();
      alert('Warehouse created successfully');
    } catch (error) {
      console.error('Error saving warehouse:', error);
      alert('Failed to save warehouse: ' + error.message);
    } finally {
      isSaving = false;
    }
  }

  async function deleteMaterial(id) {
    if (!confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      await api.deleteMaterial(id);
      await loadMaterials();
      alert('Material deleted successfully');
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material: ' + error.message);
    }
  }
</script>

<svelte:head>
  <title>Materials & Inventory - MedFMS</title>
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
              <li class="text-gray-900 font-medium">Materials & Inventory</li>
            </ol>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <button
            on:click={openWarehouseModal}
            class="btn btn-secondary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Add Warehouse
          </button>
          <button
            on:click={() => openMaterialModal()}
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Material
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Warehouses Section -->
    <div class="mb-8">
      <DataTable
        data={warehouses}
        columns={warehouseColumns}
        loading={false}
        currentPage={1}
        pageSize={10}
        totalItems={warehouses.length}
        title="Warehouses"
        showSearch={false}
        showPagination={false}
        showExport={false}
      />
    </div>

    <!-- Materials Table -->
    <DataTable
      data={materials}
      {columns}
      {loading}
      {searchTerm}
      {currentPage}
      {pageSize}
      {totalItems}
      title="Materials & Inventory"
      showSearch={true}
      showPagination={true}
      showExport={true}
      actions={[
        { key: 'edit', label: 'Edit', condition: () => true, class: 'bg-blue-600 hover:bg-blue-700 text-white' },
        { key: 'delete', label: 'Delete', condition: () => true, class: 'bg-red-600 hover:bg-red-700 text-white' }
      ]}
      on:search={handleSearch}
      on:pagechange={handlePageChange}
      on:rowclick={handleRowClick}
      on:rowAction={handleRowAction}
    />
  </main>
</div>

<!-- Material Modal -->
<Modal bind:open={showMaterialModal} title={isEditing ? 'Edit Material' : 'Add New Material'} on:close={() => showMaterialModal = false}>
  <form on:submit|preventDefault={saveMaterial} class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Material Code <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={materialForm.materialCode}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter material code"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Material Name <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={materialForm.materialName}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter material name"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          bind:value={materialForm.description}
          rows="3"
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
        <input
          type="number"
          step="0.01"
          bind:value={materialForm.currentStock}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Critical Level</label>
        <input
          type="number"
          step="0.01"
          bind:value={materialForm.criticalLevel}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Standard Price</label>
        <input
          type="number"
          step="0.01"
          bind:value={materialForm.standardPrice}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
        <select
          bind:value={materialForm.warehouseId}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={null}>Select Warehouse</option>
          {#each warehouses as warehouse}
            <option value={warehouse.id}>{warehouse.warehouseName}</option>
          {/each}
        </select>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        on:click={() => showMaterialModal = false}
        class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        disabled={isSaving}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSaving}
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isSaving ? 'Saving...' : (isEditing ? 'Update Material' : 'Create Material')}
      </button>
    </div>
  </form>
</Modal>

<!-- Warehouse Modal -->
<Modal bind:open={showWarehouseModal} title="Add New Warehouse" on:close={() => showWarehouseModal = false}>
  <form on:submit|preventDefault={saveWarehouse} class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Warehouse Code <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={warehouseForm.warehouseCode}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter warehouse code"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Warehouse Name <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={warehouseForm.warehouseName}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter warehouse name"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          bind:value={warehouseForm.description}
          rows="3"
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
        <input
          type="number"
          step="0.01"
          bind:value={warehouseForm.capacity}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        on:click={() => showWarehouseModal = false}
        class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        disabled={isSaving}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSaving}
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isSaving ? 'Saving...' : 'Create Warehouse'}
      </button>
    </div>
  </form>
</Modal>