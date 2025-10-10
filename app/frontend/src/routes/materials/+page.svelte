<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';
  import DataTable from '$lib/components/DataTable.svelte';
  import Modal from '$lib/components/Modal.svelte';

  let materials = [];
  let warehouses = [
    {
      id: 1,
      warehouseCode: 'WH001',
      warehouseName: 'Main Warehouse',
      description: 'Primary storage facility',
      capacity: 1000
    },
    {
      id: 2,
      warehouseCode: 'WH002',
      warehouseName: 'Secondary Warehouse',
      description: 'Backup storage facility',
      capacity: 500
    }
  ];
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
      label: $_('materials.materialCode'),
      sortable: true,
      render: (row) => (row && row.materialCode) || 'N/A'
    },
    {
      key: 'materialName',
      label: $_('materials.materialName'),
      sortable: true,
      render: (row) => (row && row.materialName) || 'N/A'
    },
    {
      key: 'currentStock',
      label: $_('materials.currentStock'),
      sortable: true,
      render: (row) => parseFloat((row && row.currentStock) || 0).toFixed(2)
    },
    {
      key: 'criticalLevel',
      label: $_('materials.criticalLevel'),
      sortable: true,
      render: (row) => parseFloat((row && row.criticalLevel) || 0).toFixed(2)
    },
    {
      key: 'standardPrice',
      label: $_('materials.standardPrice'),
      sortable: true,
      render: (row) => (row && row.standardPrice) ? `$${parseFloat(row.standardPrice).toFixed(2)}` : '-'
    },
    {
      key: 'stockStatus',
      label: $_('materials.stockStatus'),
      sortable: false,
      render: (row) => {
        if (!row) return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">N/A</span>';
        const stock = parseFloat(row.currentStock || 0);
        const critical = parseFloat(row.criticalLevel || 0);
        if (stock <= critical) {
          return `<span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">${$_('materials.stockStatuses.lowStock')}</span>`;
        } else if (stock <= critical * 1.5) {
          return `<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">${$_('materials.stockStatuses.warning')}</span>`;
        } else {
          return `<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">${$_('materials.stockStatuses.inStock')}</span>`;
        }
      }
    },
    {
      key: 'createdAt',
      label: $_('materials.created'),
      sortable: true,
      render: (row) => (row && row.createdAt) ? new Date(row.createdAt).toLocaleDateString() : 'N/A'
    },
    {
      key: 'actions',
      label: $_('materials.actions'),
      sortable: false,
      render: (row) => `
        <div class="flex gap-2">
          <button onclick="viewMaterial(${(row && row.id) || 0})" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            ${$_('materials.viewDetails')}
          </button>
        </div>
      `
    }
  ];

  // Warehouse table columns
  const warehouseColumns = [
    {
      key: 'warehouseCode',
      label: $_('materials.warehouseCode'),
      sortable: true
    },
    {
      key: 'warehouseName',
      label: $_('materials.warehouseName'),
      sortable: true
    },
    {
      key: 'description',
      label: $_('materials.description'),
      sortable: false,
      render: (row) => (row && row.description) || '-'
    },
    {
      key: 'capacity',
      label: $_('materials.capacity'),
      sortable: true,
      render: (row) => (row && row.capacity) || '-'
    },
    {
      key: 'actions',
      label: $_('materials.actions'),
      sortable: false,
      render: (value, row) => {
        if (!row || !row.id) {
          return '<div class="text-gray-500 text-sm">No data available</div>';
        }

        return `
          <div class="flex gap-2">
            <button onclick="viewWarehouse(${row.id})" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
              ${$_('materials.viewDetails')}
            </button>
          </div>
        `;
      }
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
      console.log('Loaded warehouses:', warehouses);

      // If no warehouses loaded, add some mock data for testing
      if (warehouses.length === 0) {
        console.log('No warehouses found, using mock data');
        warehouses = [
          {
            id: 1,
            warehouseCode: 'WH001',
            warehouseName: 'Main Warehouse',
            description: 'Primary storage facility',
            capacity: 1000
          },
          {
            id: 2,
            warehouseCode: 'WH002',
            warehouseName: 'Secondary Warehouse',
            description: 'Backup storage facility',
            capacity: 500
          }
        ];
      }
    } catch (error) {
      console.error('Failed to load warehouses:', error);
      if (error.message?.includes('Authentication required') || error.message?.includes('401')) {
        // Authentication failed, redirect to login
        localStorage.removeItem('token');
        goto('/');
        return;
      }
      // Add mock data on error as well
      console.log('Error loading warehouses, using mock data');
      warehouses = [
        {
          id: 1,
          warehouseCode: 'WH001',
          warehouseName: 'Main Warehouse',
          description: 'Primary storage facility',
          capacity: 1000
        }
      ];
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
        alert($_('materials.messages.updateSuccess'));
      } else {
        await api.createMaterial(materialForm);
        alert($_('materials.messages.createSuccess'));
      }

      showMaterialModal = false;
      await loadMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      alert($_('materials.messages.createFailed') + ': ' + error.message);
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
      alert($_('materials.messages.warehouseCreateSuccess'));
    } catch (error) {
      console.error('Error saving warehouse:', error);
      alert($_('materials.messages.warehouseCreateFailed') + ': ' + error.message);
    } finally {
      isSaving = false;
    }
  }

  async function deleteMaterial(id) {
    if (!confirm($_('materials.messages.deleteConfirm'))) {
      return;
    }

    try {
      await api.deleteMaterial(id);
      await loadMaterials();
      alert($_('materials.messages.deleteSuccess'));
    } catch (error) {
      console.error('Error deleting material:', error);
      alert($_('materials.messages.deleteFailed') + ': ' + error.message);
    }
  }
</script>

<svelte:head>
  <title>{$_('materials.pageTitle')}</title>
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
              <li class="text-gray-900 font-medium">{$_('materials.title')}</li>
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
            {$_('materials.addWarehouse')}
          </button>
          <button
            on:click={() => openMaterialModal()}
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {$_('materials.addMaterial')}
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
        title={$_('materials.warehouses')}
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
      title={$_('materials.title')}
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
<Modal bind:open={showMaterialModal} title={isEditing ? $_('materials.editMaterial') : $_('materials.addNewMaterial')} on:close={() => showMaterialModal = false}>
  <form on:submit|preventDefault={saveMaterial} class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('materials.materialCode')} <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={materialForm.materialCode}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={$_('materials.placeholders.materialCode')}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('materials.materialName')} <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={materialForm.materialName}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={$_('materials.placeholders.materialName')}
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.description')}</label>
        <textarea
          bind:value={materialForm.description}
          rows="3"
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={$_('materials.placeholders.description')}
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.currentStock')}</label>
        <input
          type="number"
          step="0.01"
          bind:value={materialForm.currentStock}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.criticalLevel')}</label>
        <input
          type="number"
          step="0.01"
          bind:value={materialForm.criticalLevel}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.standardPrice')}</label>
        <input
          type="number"
          step="0.01"
          bind:value={materialForm.standardPrice}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.warehouse')}</label>
        <select
          bind:value={materialForm.warehouseId}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={null}>{$_('materials.placeholders.selectWarehouse')}</option>
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
        {$_('common.cancel')}
      </button>
      <button
        type="submit"
        disabled={isSaving}
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isSaving ? $_('materials.messages.saving') : (isEditing ? $_('materials.updateMaterial') : $_('materials.createMaterial'))}
      </button>
    </div>
  </form>
</Modal>

<!-- Warehouse Modal -->
<Modal bind:open={showWarehouseModal} title={$_('materials.addNewWarehouse')} on:close={() => showWarehouseModal = false}>
  <form on:submit|preventDefault={saveWarehouse} class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('materials.warehouseCode')} <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={warehouseForm.warehouseCode}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={$_('materials.placeholders.warehouseCode')}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('materials.warehouseName')} <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={warehouseForm.warehouseName}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={$_('materials.placeholders.warehouseName')}
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.description')}</label>
        <textarea
          bind:value={warehouseForm.description}
          rows="3"
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={$_('materials.placeholders.description')}
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.capacity')}</label>
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
        {$_('common.cancel')}
      </button>
      <button
        type="submit"
        disabled={isSaving}
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isSaving ? $_('materials.messages.saving') : $_('materials.createWarehouse')}
      </button>
    </div>
  </form>
</Modal>