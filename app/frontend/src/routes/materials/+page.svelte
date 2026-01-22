<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';
  import DataTable from '$lib/components/DataTable.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { createFormTracker } from '$lib/utils/formTracking';

  let materials = [];
  let formTracker = null; // For tracking changed fields when editing
  let selectedMaterialIds = []; // For bulk selection
  let isDeleting = false;
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
  let units = [];
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
  $: columns = [
    {
      key: 'select',
      label: `<input type="checkbox" ${allSelected ? 'checked' : ''} onclick="document.dispatchEvent(new CustomEvent('toggleSelectAll'))" class="w-4 h-4 cursor-pointer" />`,
      sortable: false,
      render: (value, row) => `<input type="checkbox" ${selectedMaterialIds.includes(row?.id) ? 'checked' : ''} onclick="event.stopPropagation(); toggleMaterialSelection(${row?.id})" class="w-4 h-4 cursor-pointer" />`
    },
    {
      key: 'materialCode',
      label: $_('materials.materialCode'),
      sortable: true,
      render: (value, row) => value || 'N/A'
    },
    {
      key: 'materialName',
      label: $_('materials.materialName'),
      sortable: true,
      render: (value, row) => value || 'N/A'
    },
    {
      key: 'currentStock',
      label: $_('materials.currentStock'),
      sortable: true,
      render: (value, row) => parseFloat(value || 0).toFixed(2)
    },
    {
      key: 'criticalLevel',
      label: $_('materials.criticalLevel'),
      sortable: true,
      render: (value, row) => parseFloat(value || 0).toFixed(2)
    },
    {
      key: 'standardPrice',
      label: $_('materials.standardPrice'),
      sortable: true,
      render: (value, row) => value ? `${parseFloat(value).toFixed(2)} RON` : '-'
    },
    {
      key: 'stockStatus',
      label: $_('materials.stockStatus'),
      sortable: false,
      render: (value, row) => {
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
      render: (value, row) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      key: 'actions',
      label: $_('materials.actions'),
      sortable: false,
      render: (value, row) => `
        <div class="flex gap-2">
          <button onclick="viewMaterial(${row?.id || 0})" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
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
    await loadUnits();
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

  async function loadUnits() {
    try {
      const response = await api.getMaterialUnits({ active: true });
      units = response.data || [];
      console.log('Loaded units:', units);
    } catch (error) {
      console.error('Failed to load units:', error);
      units = [];
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
        unitId: material.unitId || null,
        currentStock: material.currentStock || 0,
        criticalLevel: material.criticalLevel || 0,
        standardPrice: material.standardPrice || 0,
        warehouseId: material.warehouseId || null,
      };

      // Create form tracker with original data for change detection
      formTracker = createFormTracker(materialForm);
    } else {
      isEditing = false;
      selectedMaterial = null;
      formTracker = null;
      materialForm = {
        materialCode: '',
        materialName: '',
        description: '',
        unitId: null,
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
        // For updates, detect and send only changed fields
        const changedFields = formTracker ? formTracker.detectChanges(materialForm) : materialForm;

        // Only send PATCH if there are changes
        if (Object.keys(changedFields).length > 0) {
          await api.patchMaterial(selectedMaterial.id, changedFields);
          alert($_('materials.messages.updateSuccess'));
        } else {
          alert($_('materials.messages.noChanges') || 'No changes to save');
        }
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

  // Bulk selection functions
  function toggleMaterialSelection(id) {
    if (selectedMaterialIds.includes(id)) {
      selectedMaterialIds = selectedMaterialIds.filter(i => i !== id);
    } else {
      selectedMaterialIds = [...selectedMaterialIds, id];
    }
  }

  function toggleSelectAll() {
    if (selectedMaterialIds.length === materials.length) {
      selectedMaterialIds = [];
    } else {
      selectedMaterialIds = materials.map(m => m.id);
    }
  }

  $: allSelected = materials.length > 0 && selectedMaterialIds.length === materials.length;

  async function bulkDeleteMaterials() {
    if (selectedMaterialIds.length === 0) {
      alert($_('materials.messages.noItemsSelected') || 'No items selected');
      return;
    }

    if (!confirm($_('materials.messages.bulkDeleteConfirm', { values: { count: selectedMaterialIds.length } }) || `Are you sure you want to delete ${selectedMaterialIds.length} item(s)?`)) {
      return;
    }

    try {
      isDeleting = true;
      const response = await api.bulkDeleteMaterials(selectedMaterialIds);
      selectedMaterialIds = [];
      await loadMaterials();
      alert($_('materials.messages.bulkDeleteSuccess', { values: { count: response.data?.deleted || selectedMaterialIds.length } }) || `${response.data?.deleted || selectedMaterialIds.length} item(s) deleted successfully`);
    } catch (error) {
      console.error('Error bulk deleting materials:', error);
      alert($_('materials.messages.bulkDeleteFailed') || 'Failed to delete materials: ' + error.message);
    } finally {
      isDeleting = false;
    }
  }

  // Make functions globally available for inline onclick handlers (browser only)
  if (typeof window !== 'undefined') {
    window.toggleMaterialSelection = toggleMaterialSelection;

    // Listen for custom toggleSelectAll event
    document.addEventListener('toggleSelectAll', () => {
      toggleSelectAll();
    });
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
        <div class="flex items-center gap-3">
          <!-- Bulk Delete Button (shown when items are selected) -->
          {#if selectedMaterialIds.length > 0}
            <button
              on:click={bulkDeleteMaterials}
              disabled={isDeleting}
              class="btn btn-danger"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              {isDeleting ? $_('common.deleting') : $_('materials.bulkDelete', { values: { count: selectedMaterialIds.length } }) || `Delete (${selectedMaterialIds.length})`}
            </button>
            <button
              on:click={() => selectedMaterialIds = []}
              class="btn btn-outline text-sm"
            >
              {$_('common.clearSelection') || 'Clear Selection'}
            </button>
            <div class="h-8 w-px bg-gray-300"></div>
          {/if}

          <!-- Primary Actions -->
          <button
            on:click={() => openMaterialModal()}
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {$_('materials.addMaterial')}
          </button>

          <button
            on:click={openWarehouseModal}
            class="btn btn-secondary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            {$_('materials.addWarehouse')}
          </button>

          <!-- Divider -->
          <div class="h-8 w-px bg-gray-300"></div>

          <!-- Secondary Actions -->
          <a
            href="/materials/import"
            class="btn btn-purple"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Import
          </a>

          <a
            href="/materials/transfer-requests"
            class="btn btn-outline"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
            Transfers
          </a>

          <a
            href="/materials/transfer-requests/approvals"
            class="btn btn-outline"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Approvals
          </a>

          <a
            href="/warehouse/reports"
            class="btn btn-success"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Reports
          </a>
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
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {$_('materials.edit.unit')} <span class="text-red-500">*</span>
        </label>
        <select
          bind:value={materialForm.unitId}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={null}>{$_('materials.edit.selectUnit')}</option>
          {#each units as unit}
            <option value={unit.id}>{unit.unitName} ({unit.unitCode})</option>
          {/each}
        </select>
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
        class="btn btn-outline"
        disabled={isSaving}
      >
        {$_('common.cancel')}
      </button>
      <button
        type="submit"
        disabled={isSaving}
        class="btn btn-primary disabled:opacity-50"
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
        class="btn btn-outline"
        disabled={isSaving}
      >
        {$_('common.cancel')}
      </button>
      <button
        type="submit"
        disabled={isSaving}
        class="btn btn-primary disabled:opacity-50"
      >
        {isSaving ? $_('materials.messages.saving') : $_('materials.createWarehouse')}
      </button>
    </div>
  </form>
</Modal>