<script>
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import DataTable from '$lib/components/DataTable.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { createFormTracker } from '$lib/utils/formTracking';

  // Data type configurations
  const DATA_TYPES = {
    brands: {
      label: 'Brands',
      fields: [
        { key: 'brandName', label: 'Brand Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'brandName', label: 'Brand Name', sortable: true },
        { key: 'description', label: 'Description', sortable: false },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    models: {
      label: 'Models',
      fields: [
        { key: 'modelName', label: 'Model Name', type: 'text', required: true },
        { key: 'brandId', label: 'Brand', type: 'select', required: true, relatedType: 'brands' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'modelName', label: 'Model Name', sortable: true },
        { key: 'brandId', label: 'Brand ID', sortable: true },
        { key: 'description', label: 'Description', sortable: false },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    locations: {
      label: 'Locations',
      fields: [
        { key: 'locationCode', label: 'Location Code', type: 'text', required: true },
        { key: 'locationName', label: 'Location Name', type: 'text', required: true },
        { key: 'address', label: 'Address', type: 'text' },
        { key: 'phoneNumber', label: 'Phone Number', type: 'text' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'locationCode', label: 'Code', sortable: true },
        { key: 'locationName', label: 'Location Name', sortable: true },
        { key: 'phoneNumber', label: 'Phone', sortable: false },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    departments: {
      label: 'Departments',
      fields: [
        { key: 'departmentName', label: 'Department Name', type: 'text', required: true },
        { key: 'departmentCode', label: 'Department Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'departmentCode', label: 'Code', sortable: true },
        { key: 'departmentName', label: 'Department Name', sortable: true },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    cities: {
      label: 'Cities',
      fields: [
        { key: 'cityName', label: 'City Name', type: 'text', required: true },
        { key: 'region', label: 'Region', type: 'text' },
        { key: 'country', label: 'Country', type: 'text' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'cityName', label: 'City Name', sortable: true },
        { key: 'region', label: 'Region', sortable: true },
        { key: 'country', label: 'Country', sortable: true },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    suppliers: {
      label: 'Suppliers',
      fields: [
        { key: 'supplierName', label: 'Supplier Name', type: 'text', required: true },
        { key: 'contactPerson', label: 'Contact Person', type: 'text' },
        { key: 'contactNumber', label: 'Contact Number', type: 'text' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'address', label: 'Address', type: 'text' },
        { key: 'taxId', label: 'Tax ID', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'supplierName', label: 'Supplier Name', sortable: true },
        { key: 'contactPerson', label: 'Contact', sortable: true },
        { key: 'contactNumber', label: 'Phone', sortable: false },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    vehicleTypes: {
      label: 'Vehicle Types',
      fields: [
        { key: 'typeName', label: 'Type Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'typeName', label: 'Type Name', sortable: true },
        { key: 'description', label: 'Description', sortable: false },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    vehicleStatuses: {
      label: 'Vehicle Statuses',
      fields: [
        { key: 'statusCode', label: 'Status Code', type: 'text', required: true },
        { key: 'statusName', label: 'Status Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'colorCode', label: 'Color Code', type: 'text' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'statusCode', label: 'Code', sortable: true },
        { key: 'statusName', label: 'Status Name', sortable: true },
        { key: 'description', label: 'Description', sortable: false },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    fuelTypes: {
      label: 'Fuel Types',
      fields: [
        { key: 'fuelCode', label: 'Fuel Code', type: 'text', required: true },
        { key: 'fuelName', label: 'Fuel Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'unit', label: 'Unit', type: 'text' },
        { key: 'currentPrice', label: 'Current Price', type: 'number' },
        { key: 'density', label: 'Density (kg/L)', type: 'number' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'fuelCode', label: 'Code', sortable: true },
        { key: 'fuelName', label: 'Fuel Type', sortable: true },
        { key: 'unit', label: 'Unit', sortable: false },
        { key: 'currentPrice', label: 'Price', sortable: true, render: (val) => val ? `${parseFloat(val).toFixed(2)} RON` : '-' },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    fuelStations: {
      label: 'Fuel Stations',
      fields: [
        { key: 'stationName', label: 'Station Name', type: 'text', required: true },
        { key: 'stationCode', label: 'Station Code', type: 'text', required: true },
        { key: 'address', label: 'Address', type: 'text' },
        { key: 'city', label: 'City', type: 'text' },
        { key: 'state', label: 'State/Province', type: 'text' },
        { key: 'postalCode', label: 'Postal Code', type: 'text' },
        { key: 'country', label: 'Country', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'operatingHours', label: 'Operating Hours', type: 'text' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'stationCode', label: 'Code', sortable: true },
        { key: 'stationName', label: 'Station Name', sortable: true },
        { key: 'city', label: 'City', sortable: true },
        { key: 'phone', label: 'Phone', sortable: false },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    units: {
      label: 'Units',
      fields: [
        { key: 'unitCode', label: 'Unit Code', type: 'text', required: true },
        { key: 'unitName', label: 'Unit Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'unitCode', label: 'Code', sortable: true },
        { key: 'unitName', label: 'Unit Name', sortable: true },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    materialTypes: {
      label: 'Material Types',
      fields: [
        { key: 'typeCode', label: 'Type Code', type: 'text', required: true },
        { key: 'typeName', label: 'Type Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'typeCode', label: 'Code', sortable: true },
        { key: 'typeName', label: 'Type Name', sortable: true },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    materialCategories: {
      label: 'Material Categories',
      fields: [
        { key: 'categoryCode', label: 'Category Code', type: 'text', required: true },
        { key: 'categoryName', label: 'Category Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'categoryCode', label: 'Code', sortable: true },
        { key: 'categoryName', label: 'Category Name', sortable: true },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    positions: {
      label: 'Positions',
      fields: [
        { key: 'positionCode', label: 'Position Code', type: 'text', required: true },
        { key: 'positionName', label: 'Position Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'positionCode', label: 'Code', sortable: true },
        { key: 'positionName', label: 'Position Name', sortable: true },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
    licenseTypes: {
      label: 'License Types',
      fields: [
        { key: 'typeCode', label: 'Type Code', type: 'text', required: true },
        { key: 'typeName', label: 'Type Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'active', label: 'Active', type: 'checkbox' },
      ],
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'typeCode', label: 'Code', sortable: true },
        { key: 'typeName', label: 'Type Name', sortable: true },
        { key: 'active', label: 'Status', sortable: true, render: (val) => val ? '<span class="text-green-600">Active</span>' : '<span class="text-gray-400">Inactive</span>' },
        { key: 'actions', label: 'Actions', sortable: false },
      ],
    },
  };

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
  $: tableColumns = config?.columns.map(col => {
    if (col.key === 'actions') {
      return {
        ...col,
        render: (value, row) => `
          <div class="flex gap-2">
            <button
              onclick="window.editItem(${row.id})"
              class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Edit
            </button>
            <button
              onclick="window.deleteItem(${row.id})"
              class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        `,
      };
    }
    return col;
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
      alert('Failed to load data: ' + error.message);
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
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await api.deleteReferenceData(selectedDataType, id);
      alert('Item deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item: ' + error.message);
    }
  }

  async function handleSubmit() {
    try {
      // Convert string values to appropriate types
      const fullSubmitData = {};
      config.fields.forEach(field => {
        let value = formData[field.key];

        if (field.type === 'select' || field.type === 'number') {
          value = value ? parseInt(value) : undefined;
        } else if (field.type === 'checkbox') {
          value = !!value;
        }

        fullSubmitData[field.key] = value;
      });

      if (modalMode === 'create') {
        await api.createReferenceData(selectedDataType, fullSubmitData);
        alert('Item created successfully');
      } else {
        // For updates, detect and send only changed fields
        const changedFields = formTracker ? formTracker.detectChanges(fullSubmitData) : fullSubmitData;

        // Apply type conversions to changed fields
        const payload = {};
        config.fields.forEach(field => {
          if (changedFields.hasOwnProperty(field.key)) {
            let value = changedFields[field.key];

            if (field.type === 'select' || field.type === 'number') {
              payload[field.key] = value ? parseInt(value) : undefined;
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
          alert('Item updated successfully');
        } else {
          alert('No changes to save');
        }
      }

      showModal = false;
      await loadData();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item: ' + error.message);
    }
  }

  function closeModal() {
    showModal = false;
    formData = {};
    currentItem = null;
  }
</script>

<svelte:head>
  <title>Admin Settings - MedFMS</title>
</svelte:head>

<div class="flex h-screen bg-gray-100">
  <!-- Sidebar -->
  <div class="w-64 bg-white shadow-lg">
    <div class="p-6 border-b">
      <h1 class="text-2xl font-bold text-gray-900">Admin Settings</h1>
      <p class="text-sm text-gray-600 mt-1">Reference Data Management</p>
    </div>

    <!-- Back to Dashboard Button -->
    <div class="p-4 border-b">
      <button
        on:click={() => goto('/dashboard')}
        class="w-full flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>
    </div>

    <!-- System Management Links -->
    <div class="p-4 border-b">
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">System</p>
      <div class="space-y-1">
        <button
          on:click={() => goto('/admin/users')}
          class="w-full flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          User Management
        </button>
        <button
          on:click={() => goto('/admin/material-units')}
          class="w-full flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          Material Units
        </button>
        <button
          on:click={() => goto('/profile')}
          class="w-full flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          My Profile
        </button>
      </div>
    </div>

    <!-- Reference Data Navigation -->
    <div class="px-4 pt-4 pb-2">
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference Data</p>
    </div>
    <nav class="p-4 pt-2">
      <ul class="space-y-1">
        {#each Object.entries(DATA_TYPES) as [key, type]}
          <li>
            <button
              on:click={() => changeDataType(key)}
              class="w-full text-left px-4 py-2 rounded-lg transition-colors {selectedDataType === key
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'}"
            >
              {type.label}
            </button>
          </li>
        {/each}
      </ul>
    </nav>
  </div>

  <!-- Main Content -->
  <div class="flex-1 overflow-auto">
    <div class="container mx-auto px-6 py-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{config?.label}</h2>
            <p class="text-sm text-gray-600 mt-1">
              Manage {config?.label.toLowerCase()} in the system
            </p>
          </div>
          <button
            on:click={openCreateModal}
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </button>
        </div>
      </div>

      <!-- Data Table -->
      {#if loading}
        <div class="bg-white rounded-lg shadow-md p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-600 mt-4">Loading data...</p>
        </div>
      {:else}
        <div class="bg-white rounded-lg shadow-md">
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
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Create/Edit Modal -->
<Modal bind:open={showModal} title="{modalMode === 'create' ? 'Create' : 'Edit'} {config?.label}">
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    {#each config?.fields || [] as field}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
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
            <option value="">Select {field.label}</option>
            {#each relatedData[field.relatedType] || [] as option}
              <option value={option.id}>
                {option.brandName || option.typeName || option.categoryName || option.name || `ID: ${option.id}`}
              </option>
            {/each}
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
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {modalMode === 'create' ? 'Create' : 'Save Changes'}
      </button>
    </div>
  </form>
</Modal>
