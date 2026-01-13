<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { api } from '$lib/api';
  import { _ } from '$lib/i18n';
  import DataTable from '$lib/components/DataTable.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { createFormTracker } from '$lib/utils/formTracking';

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
  let formTracker = null; // For tracking changed fields when editing

  // Form data for editing warehouse
  let warehouseForm = {
    warehouseCode: '',
    warehouseName: '',
    description: '',
    capacity: 0,
    locationId: 0,
    responsiblePersonId: 0
  };

  // Data table columns for materials in warehouse
  const materialColumns = [
    {
      key: 'materialCode',
      label: $_('materials.warehouseDetail.code'),
      sortable: true
    },
    {
      key: 'materialName',
      label: $_('materials.materialName'),
      sortable: true
    },
    {
      key: 'currentStock',
      label: $_('materials.currentStock'),
      sortable: true,
      render: (value, row) => {
        if (!row) return '-';
        const stockLevel = (row.currentStock || 0) <= (row.criticalLevel || 0) ? 'text-red-600 font-medium' : 'text-green-600';
        return `<span class="${stockLevel}">${row.currentStock || 0}</span>`;
      }
    },
    {
      key: 'criticalLevel',
      label: $_('materials.criticalLevel'),
      sortable: true
    },
    {
      key: 'standardPrice',
      label: $_('materials.standardPrice'),
      sortable: true,
      render: (value, row) => `${parseFloat(row?.standardPrice || 0).toFixed(2)} RON`
    },
    {
      key: 'unit',
      label: $_('materials.edit.unit'),
      sortable: false,
      render: (value, row) => row?.unit?.unitName || 'N/A'
    },
    {
      key: 'actions',
      label: $_('materials.actions'),
      sortable: false,
      render: (value, row) => {
        if (!row || !row.id) return '<div class="text-gray-500 text-sm">No actions</div>';
        return `
        <div class="flex gap-2">
          <button onclick="viewMaterial(${row.id})" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            ${$_('materials.viewDetails')}
          </button>
        </div>
        `;
      }
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
      const warehouseResponse = await api.getWarehouse(warehouseId);
      warehouse = warehouseResponse.data;

      if (warehouse) {
        warehouseForm = {
          warehouseCode: warehouse.warehouseCode || '',
          warehouseName: warehouse.warehouseName || '',
          description: warehouse.description || '',
          capacity: warehouse.capacity || 0,
          locationId: warehouse.locationId || 0,
          responsiblePersonId: warehouse.responsiblePersonId || 0
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
      alert($_('materials.messages.loadFailed') + ': ' + error.message);
    } finally {
      loading = false;
    }
  }

  async function loadWarehouseMaterials() {
    try {
      // Load materials filtered by warehouse ID
      const materialsResponse = await api.getMaterials({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        warehouseId: warehouseId
      });

      materials = materialsResponse.data || [];
      totalItems = materialsResponse.pagination?.total || materials.length;

      // Also load low stock materials for this warehouse
      const lowStockResponse = await api.getMaterials({
        warehouseId: warehouseId,
        lowStockOnly: true
      });
      lowStockMaterials = lowStockResponse.data || [];
    } catch (error) {
      console.error('Error loading warehouse materials:', error);
    }
  }

  async function updateWarehouse() {
    if (!warehouse) return;

    isSaving = true;
    try {
      // For updates, detect and send only changed fields
      const changedFields = formTracker ? formTracker.detectChanges(warehouseForm) : warehouseForm;

      // Apply type conversions to changed fields
      const payload = {};
      for (const key in changedFields) {
        if (key === 'capacity' || key === 'locationId' || key === 'responsiblePersonId') {
          payload[key] = changedFields[key] ? parseInt(changedFields[key]) : 0;
        } else {
          payload[key] = changedFields[key];
        }
      }

      // Only send PATCH if there are changes
      if (Object.keys(payload).length > 0) {
        await api.patchWarehouse(warehouseId, payload);
        warehouse = { ...warehouse, ...warehouseForm };
        alert($_('materials.messages.warehouseCreateSuccess'));
      } else {
        // No changes
        alert($_('materials.messages.noChanges') || 'No changes to save');
      }

      showEditModal = false;
    } catch (error) {
      console.error('Error updating warehouse:', error);
      alert($_('materials.messages.warehouseCreateFailed') + ': ' + error.message);
    } finally {
      isSaving = false;
    }
  }

  function openEditModal() {
    console.log('openEditModal called', warehouse);
    if (warehouse) {
      warehouseForm = {
        warehouseCode: warehouse.warehouseCode || '',
        warehouseName: warehouse.warehouseName || '',
        description: warehouse.description || '',
        capacity: warehouse.capacity || 0,
        locationId: warehouse.locationId || 0,
        responsiblePersonId: warehouse.responsiblePersonId || 0
      };

      // Create form tracker with original data for change detection
      formTracker = createFormTracker(warehouseForm);
    }
    console.log('Setting showEditModal to true');
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
        locationId: warehouse.locationId || 0,
        responsiblePersonId: warehouse.responsiblePersonId || 0
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
  <title>{warehouse ? `${warehouse.warehouseName} - ${$_('materials.warehouses')}` : $_('materials.warehouseDetail.title')} - {$_('common.appName')}</title>
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
      {$_('materials.warehouseDetail.backToMaterials')}
    </button>
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-4 text-gray-600">{$_('materials.warehouseDetail.loadingDetails')}</span>
    </div>
  {:else if warehouse}
    <!-- Warehouse Header -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{warehouse.warehouseName}</h1>
          <p class="text-lg text-gray-600 mb-4">{$_('materials.warehouseDetail.code')}: {warehouse.warehouseCode}</p>
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
          {$_('materials.warehouseDetail.editWarehouse')}
        </button>
      </div>

      <!-- Warehouse Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">{$_('materials.capacity')}</h3>
          <p class="text-2xl font-bold text-gray-900 mt-1">{warehouse.capacity || 'N/A'}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">{$_('materials.warehouseDetail.totalMaterials')}</h3>
          <p class="text-2xl font-bold text-gray-900 mt-1">{materials.length}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">{$_('materials.warehouseDetail.lowStockItems')}</h3>
          <p class="text-2xl font-bold text-red-600 mt-1">{lowStockMaterials.length}</p>
        </div>
        {#if warehouse.address}
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">{$_('materials.warehouseDetail.address')}</h3>
            <p class="text-gray-900 mt-1">{warehouse.address}</p>
          </div>
        {/if}
        {#if warehouse.contactNumber}
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">{$_('materials.warehouseDetail.contact')}</h3>
            <p class="text-gray-900 mt-1">{warehouse.contactNumber}</p>
          </div>
        {/if}
        {#if warehouse.managerName}
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">{$_('materials.warehouseDetail.manager')}</h3>
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
            <h3 class="text-red-800 font-medium">{$_('materials.warehouseDetail.lowStockAlert')}</h3>
            <p class="text-red-700 text-sm mt-1">
              {$_('materials.warehouseDetail.lowStockMessage', {
                values: {
                  count: lowStockMaterials.length,
                  plural: lowStockMaterials.length !== 1 ? 's' : '',
                  verb: lowStockMaterials.length !== 1 ? 'are' : 'is'
                }
              })}
            </p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Materials in Warehouse -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">{$_('materials.warehouseDetail.materialsInWarehouse')}</h2>
      </div>

      <div class="p-6">
        <!-- Search -->
        <div class="mb-4">
          <input
            type="text"
            placeholder={$_('materials.warehouseDetail.searchMaterials')}
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
      <h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('materials.warehouseDetail.warehouseNotFound')}</h2>
      <p class="text-gray-600 mb-6">{$_('materials.warehouseDetail.warehouseNotFoundDesc')}</p>
      <button
        on:click={() => goto('/materials')}
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        {$_('materials.warehouseDetail.returnToMaterials')}
      </button>
    </div>
  {/if}
</div>

<!-- Edit Warehouse Modal -->
<Modal bind:open={showEditModal} title={$_('materials.warehouseDetail.editWarehouse')}>
  <form on:submit|preventDefault={updateWarehouse} class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.warehouseCode')}</label>
        <input
          type="text"
          bind:value={warehouseForm.warehouseCode}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.warehouseName')}</label>
        <input
          type="text"
          bind:value={warehouseForm.warehouseName}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.description')}</label>
      <textarea
        bind:value={warehouseForm.description}
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.capacity')}</label>
        <input
          type="number"
          bind:value={warehouseForm.capacity}
          min="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.warehouseDetail.locationId')}</label>
        <input
          type="number"
          bind:value={warehouseForm.locationId}
          min="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder={$_('materials.warehouseDetail.optionalLocationReference')}
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.warehouseDetail.responsiblePersonId')}</label>
      <input
        type="number"
        bind:value={warehouseForm.responsiblePersonId}
        min="0"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder={$_('materials.warehouseDetail.optionalResponsiblePerson')}
      />
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        on:click={closeEditModal}
        class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        {$_('common.cancel')}
      </button>
      <button
        type="submit"
        disabled={isSaving}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? $_('materials.messages.saving') : $_('materials.transactions.saveChanges')}
      </button>
    </div>
  </form>
</Modal>