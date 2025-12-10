<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import DataTable from '$lib/components/DataTable.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { createFormTracker } from '$lib/utils/formTracking';
  import { _ } from '$lib/i18n';

  // Helper function to get translated field label
  function getFieldLabel(key) {
    return $_(`admin.fields.${key}`) || key;
  }

  // Helper function to get translated data type label
  function getDataTypeLabel(key) {
    return $_(`admin.dataTypes.${key}`) || key;
  }

  // Helper function to render status column
  function renderStatus(val) {
    const activeText = $_('admin.fields.active');
    const inactiveText = $_('admin.fields.inactive');
    return val
      ? `<span class="text-green-600">${activeText}</span>`
      : `<span class="text-gray-400">${inactiveText}</span>`;
  }

  // Data type configurations (keys only, labels from i18n)
  const DATA_TYPES = {
    brands: {
      labelKey: 'brands',
      fields: [
        { key: 'brandName', labelKey: 'brandName', type: 'text', required: true },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'brandName', labelKey: 'brandName', sortable: true },
        { key: 'description', labelKey: 'description', sortable: false },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    models: {
      labelKey: 'models',
      fields: [
        { key: 'modelName', labelKey: 'modelName', type: 'text', required: true },
        { key: 'brandId', labelKey: 'brand', type: 'select', required: true, relatedType: 'brands' },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'modelName', labelKey: 'modelName', sortable: true },
        { key: 'brandId', labelKey: 'brandId', sortable: true },
        { key: 'description', labelKey: 'description', sortable: false },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    locations: {
      labelKey: 'locations',
      fields: [
        { key: 'locationCode', labelKey: 'locationCode', type: 'text', required: true },
        { key: 'locationName', labelKey: 'locationName', type: 'text', required: true },
        { key: 'address', labelKey: 'address', type: 'text' },
        { key: 'phoneNumber', labelKey: 'phoneNumber', type: 'text' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'locationCode', labelKey: 'code', sortable: true },
        { key: 'locationName', labelKey: 'locationName', sortable: true },
        { key: 'phoneNumber', labelKey: 'phone', sortable: false },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    departments: {
      labelKey: 'departments',
      fields: [
        { key: 'departmentName', labelKey: 'departmentName', type: 'text', required: true },
        { key: 'departmentCode', labelKey: 'departmentCode', type: 'text' },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'departmentCode', labelKey: 'code', sortable: true },
        { key: 'departmentName', labelKey: 'departmentName', sortable: true },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    cities: {
      labelKey: 'cities',
      fields: [
        { key: 'cityName', labelKey: 'cityName', type: 'text', required: true },
        { key: 'region', labelKey: 'region', type: 'text' },
        { key: 'country', labelKey: 'country', type: 'text' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'cityName', labelKey: 'cityName', sortable: true },
        { key: 'region', labelKey: 'region', sortable: true },
        { key: 'country', labelKey: 'country', sortable: true },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    suppliers: {
      labelKey: 'suppliers',
      fields: [
        { key: 'supplierName', labelKey: 'supplierName', type: 'text', required: true },
        { key: 'contactPerson', labelKey: 'contactPerson', type: 'text' },
        { key: 'contactNumber', labelKey: 'contactNumber', type: 'text' },
        { key: 'email', labelKey: 'email', type: 'email' },
        { key: 'address', labelKey: 'address', type: 'text' },
        { key: 'taxId', labelKey: 'taxId', type: 'text' },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'supplierName', labelKey: 'supplierName', sortable: true },
        { key: 'contactPerson', labelKey: 'contact', sortable: true },
        { key: 'contactNumber', labelKey: 'phone', sortable: false },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    vehicleTypes: {
      labelKey: 'vehicleTypes',
      fields: [
        { key: 'typeName', labelKey: 'typeName', type: 'text', required: true },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'typeName', labelKey: 'typeName', sortable: true },
        { key: 'description', labelKey: 'description', sortable: false },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    vehicleStatuses: {
      labelKey: 'vehicleStatuses',
      fields: [
        { key: 'statusCode', labelKey: 'statusCode', type: 'text', required: true },
        { key: 'statusName', labelKey: 'statusName', type: 'text', required: true },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'colorCode', labelKey: 'colorCode', type: 'text' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'statusCode', labelKey: 'code', sortable: true },
        { key: 'statusName', labelKey: 'statusName', sortable: true },
        { key: 'description', labelKey: 'description', sortable: false },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    fuelTypes: {
      labelKey: 'fuelTypes',
      fields: [
        { key: 'fuelCode', labelKey: 'fuelCode', type: 'text', required: true },
        { key: 'fuelName', labelKey: 'fuelName', type: 'text', required: true },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'unit', labelKey: 'unit', type: 'text' },
        { key: 'currentPrice', labelKey: 'currentPrice', type: 'number' },
        { key: 'density', labelKey: 'density', type: 'number' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'fuelCode', labelKey: 'code', sortable: true },
        { key: 'fuelName', labelKey: 'fuelType', sortable: true },
        { key: 'unit', labelKey: 'unit', sortable: false },
        { key: 'currentPrice', labelKey: 'price', sortable: true, render: (val) => val ? `${parseFloat(val).toFixed(2)} RON` : '-' },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    fuelStations: {
      labelKey: 'fuelStations',
      fields: [
        { key: 'stationName', labelKey: 'stationName', type: 'text', required: true },
        { key: 'stationCode', labelKey: 'stationCode', type: 'text', required: true },
        { key: 'address', labelKey: 'address', type: 'text' },
        { key: 'city', labelKey: 'city', type: 'text' },
        { key: 'state', labelKey: 'state', type: 'text' },
        { key: 'postalCode', labelKey: 'postalCode', type: 'text' },
        { key: 'country', labelKey: 'country', type: 'text' },
        { key: 'phone', labelKey: 'phone', type: 'text' },
        { key: 'email', labelKey: 'email', type: 'email' },
        { key: 'operatingHours', labelKey: 'operatingHours', type: 'text' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'stationCode', labelKey: 'code', sortable: true },
        { key: 'stationName', labelKey: 'stationName', sortable: true },
        { key: 'city', labelKey: 'city', sortable: true },
        { key: 'phone', labelKey: 'phone', sortable: false },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    units: {
      labelKey: 'units',
      fields: [
        { key: 'unitCode', labelKey: 'unitCode', type: 'text', required: true },
        { key: 'unitName', labelKey: 'unitName', type: 'text', required: true },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'unitCode', labelKey: 'code', sortable: true },
        { key: 'unitName', labelKey: 'unitName', sortable: true },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    materialTypes: {
      labelKey: 'materialTypes',
      fields: [
        { key: 'typeCode', labelKey: 'typeCode', type: 'text', required: true },
        { key: 'typeName', labelKey: 'typeName', type: 'text', required: true },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'typeCode', labelKey: 'code', sortable: true },
        { key: 'typeName', labelKey: 'typeName', sortable: true },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    materialCategories: {
      labelKey: 'materialCategories',
      fields: [
        { key: 'categoryCode', labelKey: 'categoryCode', type: 'text', required: true },
        { key: 'categoryName', labelKey: 'categoryName', type: 'text', required: true },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'categoryCode', labelKey: 'code', sortable: true },
        { key: 'categoryName', labelKey: 'categoryName', sortable: true },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    positions: {
      labelKey: 'positions',
      fields: [
        { key: 'positionCode', labelKey: 'positionCode', type: 'text', required: true },
        { key: 'positionName', labelKey: 'positionName', type: 'text', required: true },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'positionCode', labelKey: 'code', sortable: true },
        { key: 'positionName', labelKey: 'positionName', sortable: true },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    licenseTypes: {
      labelKey: 'licenseTypes',
      fields: [
        { key: 'typeCode', labelKey: 'typeCode', type: 'text', required: true },
        { key: 'typeName', labelKey: 'typeName', type: 'text', required: true },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'typeCode', labelKey: 'code', sortable: true },
        { key: 'typeName', labelKey: 'typeName', sortable: true },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    inspectionTypes: {
      labelKey: 'inspectionTypes',
      fields: [
        { key: 'typeName', labelKey: 'typeName', type: 'text', required: true },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'typeCode', labelKey: 'code', sortable: true },
        { key: 'typeName', labelKey: 'typeName', sortable: true },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
    maintenanceTypes: {
      labelKey: 'maintenanceTypes',
      fields: [
        { key: 'typeName', labelKey: 'typeName', type: 'text', required: true },
        { key: 'category', labelKey: 'category', type: 'select', required: true, optionsKey: 'categories' },
        { key: 'description', labelKey: 'description', type: 'textarea' },
        { key: 'estimatedDuration', labelKey: 'estimatedDuration', type: 'number' },
        { key: 'estimatedCost', labelKey: 'estimatedCost', type: 'number' },
        { key: 'priority', labelKey: 'priorityRange', type: 'number' },
        { key: 'active', labelKey: 'active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', labelKey: 'id', sortable: true },
        { key: 'typeCode', labelKey: 'code', sortable: true },
        { key: 'typeName', labelKey: 'typeName', sortable: true },
        { key: 'category', labelKey: 'category', sortable: true },
        { key: 'priority', labelKey: 'priority', sortable: true },
        { key: 'active', labelKey: 'status', sortable: true, renderStatus: true },
        { key: 'actions', labelKey: 'actions', sortable: false },
      ],
    },
  };

  // Get category options for maintenance types
  function getCategoryOptions() {
    return [
      { value: 'preventive', label: $_('admin.categories.preventive') },
      { value: 'corrective', label: $_('admin.categories.corrective') },
      { value: 'emergency', label: $_('admin.categories.emergency') },
      { value: 'inspection', label: $_('admin.categories.inspection') },
    ];
  }

  let selectedDataType = 'brands';
  let data = [];
  let relatedData = {}; // For dropdowns (e.g., brands for models)
  let loading = false;
  let showModal = false;
  let modalMode = 'create'; // 'create' or 'edit'
  let currentItem = null;
  let formData = {};
  let formTracker = null; // For tracking changed fields when editing

  // Pagination
  let currentPage = 1;
  let pageSize = 20;

  $: config = DATA_TYPES[selectedDataType];
  $: currentLabel = config ? getDataTypeLabel(config.labelKey) : '';
  $: tableColumns = config?.columns.map(col => {
    const baseCol = {
      ...col,
      label: getFieldLabel(col.labelKey),
    };

    if (col.key === 'actions') {
      return {
        ...baseCol,
        render: (value, row) => `
          <div class="flex gap-2">
            <button
              onclick="window.editItem(${row.id})"
              class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              ${$_('common.edit')}
            </button>
            <button
              onclick="window.deleteItem(${row.id})"
              class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              ${$_('common.delete')}
            </button>
          </div>
        `,
      };
    }

    if (col.renderStatus) {
      return {
        ...baseCol,
        render: renderStatus,
      };
    }

    return baseCol;
  });

  onMount(() => {
    loadData();

    // Expose functions to window for inline button handlers
    if (typeof window !== 'undefined') {
      window.editItem = editItem;
      window.deleteItem = deleteItem;
    }
  });

  async function loadData() {
    loading = true;
    try {
      const response = await api.getReferenceData(selectedDataType);
      data = response.data || [];

      // Load related data for dropdowns
      const relatedTypes = config.fields
        .filter(f => f.type === 'select' && f.relatedType)
        .map(f => f.relatedType);

      for (const type of relatedTypes) {
        if (!relatedData[type]) {
          const relResponse = await api.getReferenceData(type);
          relatedData[type] = relResponse.data || [];
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message?.includes('authentication') || error.message?.includes('401')) {
        localStorage.removeItem('token');
        goto('/');
        return;
      }
      alert($_('admin.failedToLoad') + ': ' + error.message);
    } finally {
      loading = false;
    }
  }

  function changeDataType(type) {
    selectedDataType = type;
    loadData();
  }

  function openCreateModal() {
    modalMode = 'create';
    currentItem = null;
    formData = {};
    // Set default values
    config.fields.forEach(field => {
      if (field.type === 'checkbox') {
        formData[field.key] = true;
      } else {
        formData[field.key] = '';
      }
    });
    showModal = true;
  }

  async function editItem(id) {
    try {
      const response = await api.getReferenceDataItem(selectedDataType, id);
      currentItem = response.data;
      formData = { ...currentItem };
      // Create form tracker with original data for change detection
      formTracker = createFormTracker(formData);
      modalMode = 'edit';
      showModal = true;
    } catch (error) {
      console.error('Error loading item:', error);
      alert('Failed to load item: ' + error.message);
    }
  }

  async function deleteItem(id) {
    if (!confirm($_('admin.deleteConfirm'))) {
      return;
    }

    try {
      await api.deleteReferenceData(selectedDataType, id);
      alert($_('admin.itemDeleted'));
      await loadData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert($_('admin.failedToDelete') + ': ' + error.message);
    }
  }

  async function handleSubmit() {
    try {
      // Convert string values to appropriate types
      const fullSubmitData = {};
      config.fields.forEach(field => {
        let value = formData[field.key];

        if (field.type === 'select' && field.relatedType) {
          // Select with relatedType - parse as integer ID
          value = value ? parseInt(value) : undefined;
        } else if (field.type === 'number') {
          value = value ? parseFloat(value) : undefined;
        } else if (field.type === 'checkbox') {
          value = !!value;
        }
        // Select with options - keep as string (enum value)

        fullSubmitData[field.key] = value;
      });

      if (modalMode === 'create') {
        await api.createReferenceData(selectedDataType, fullSubmitData);
        alert($_('admin.itemCreated'));
      } else {
        // For updates, detect and send only changed fields
        const changedFields = formTracker ? formTracker.detectChanges(fullSubmitData) : fullSubmitData;

        // Apply type conversions to changed fields
        const payload = {};
        config.fields.forEach(field => {
          if (changedFields.hasOwnProperty(field.key)) {
            let value = changedFields[field.key];

            if (field.type === 'select' && field.relatedType) {
              // Select with relatedType - parse as integer ID
              payload[field.key] = value ? parseInt(value) : undefined;
            } else if (field.type === 'number') {
              payload[field.key] = value ? parseFloat(value) : undefined;
            } else if (field.type === 'checkbox') {
              payload[field.key] = !!value;
            } else {
              payload[field.key] = value;
            }
          }
        });

        // Only send PATCH if there are changes
        if (Object.keys(payload).length > 0) {
          await api.patchReferenceData(selectedDataType, currentItem.id, payload);
          alert($_('admin.itemUpdated'));
        } else {
          alert($_('admin.noChanges'));
        }
      }

      showModal = false;
      await loadData();
    } catch (error) {
      console.error('Error saving item:', error);
      alert($_('admin.failedToSave') + ': ' + error.message);
    }
  }

  function closeModal() {
    showModal = false;
    formData = {};
    currentItem = null;
  }
</script>

<svelte:head>
  <title>{$_('admin.pageTitle')}</title>
</svelte:head>

<div class="container mx-auto px-6 py-8">
  <!-- Page Header -->
  <div class="mb-6">
    <div class="flex items-center gap-4 mb-4">
      <button
        on:click={() => goto('/dashboard')}
        class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title={$_('admin.backToDashboard')}
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{$_('admin.referenceData')}</h1>
        <p class="text-gray-600 mt-1">{$_('admin.manageReferenceData')}</p>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="flex gap-2 mb-6">
      <button
        on:click={() => goto('/admin/users')}
        class="btn btn-outline text-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        {$_('admin.userManagement')}
      </button>
      <button
        on:click={() => goto('/admin/material-units')}
        class="btn btn-outline text-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        {$_('admin.materialUnits.title')}
      </button>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200 overflow-x-auto">
      <nav class="flex space-x-1 min-w-max" aria-label="Reference Data Tabs">
        {#each Object.entries(DATA_TYPES) as [key, type]}
          <button
            on:click={() => changeDataType(key)}
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap {selectedDataType === key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          >
            {getDataTypeLabel(type.labelKey)}
          </button>
        {/each}
      </nav>
    </div>
  </div>

  <!-- Content Area -->
  <div class="card">
    <!-- Table Header with Add Button -->
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">{currentLabel}</h2>
        <p class="text-sm text-gray-600 mt-1">
          {data.length} {data.length === 1 ? $_('admin.record') : $_('admin.records')}
        </p>
      </div>
      <button
        on:click={openCreateModal}
        class="btn btn-primary flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {$_('admin.addNew')}
      </button>
    </div>

    <!-- Data Table -->
    {#if loading}
      <div class="p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">{$_('admin.loadingData')}</p>
      </div>
    {:else if data.length === 0}
      <div class="p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-gray-600 mb-4">{$_('admin.noDataFound', { type: currentLabel.toLowerCase() })}</p>
        <button
          on:click={openCreateModal}
          class="btn btn-primary"
        >
          {$_('admin.addFirst', { type: currentLabel })}
        </button>
      </div>
    {:else}
      <DataTable
        {data}
        columns={tableColumns}
        {currentPage}
        {pageSize}
        totalItems={data.length}
        on:pageChange={(event) => {
          currentPage = event.detail.page;
        }}
        on:sort={(event) => {
          console.log('Sort by:', event.detail);
        }}
      />
    {/if}
  </div>
</div>

<!-- Create/Edit Modal -->
<Modal bind:open={showModal} title="{modalMode === 'create' ? $_('admin.create') : $_('common.edit')} {currentLabel}">
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    {#each config?.fields || [] as field}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {getFieldLabel(field.labelKey)}
          {#if field.required}
            <span class="text-red-500">*</span>
          {/if}
        </label>

        {#if field.type === 'textarea'}
          <textarea
            bind:value={formData[field.key]}
            required={field.required}
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        {:else if field.type === 'checkbox'}
          <input
            type="checkbox"
            bind:checked={formData[field.key]}
            class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
        {:else if field.type === 'select'}
          <select
            bind:value={formData[field.key]}
            required={field.required}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{$_('admin.select', { field: getFieldLabel(field.labelKey) })}</option>
            {#if field.optionsKey === 'categories'}
              {#each getCategoryOptions() as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            {:else if field.relatedType}
              {#each relatedData[field.relatedType] || [] as option}
                <option value={option.id}>
                  {option.brandName || option.typeName || option.categoryName || option.name || `ID: ${option.id}`}
                </option>
              {/each}
            {/if}
          </select>
        {:else if field.type === 'email'}
          <input
            type="email"
            bind:value={formData[field.key]}
            required={field.required}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        {:else if field.type === 'number'}
          <input
            type="number"
            bind:value={formData[field.key]}
            required={field.required}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        {:else}
          <input
            type="text"
            bind:value={formData[field.key]}
            required={field.required}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        {/if}
      </div>
    {/each}

    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        on:click={closeModal}
        class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        {$_('common.cancel')}
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {modalMode === 'create' ? $_('admin.create') : $_('admin.saveChanges')}
      </button>
    </div>
  </form>
</Modal>
