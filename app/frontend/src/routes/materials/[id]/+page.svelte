<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { api } from '$lib/api';
  import DataTable from '$lib/components/DataTable.svelte';
  import Modal from '$lib/components/Modal.svelte';

  let material = null;
  let transactions = [];
  let loading = false;
  let showTransactionModal = false;
  let isSaving = false;
  let searchTerm = '';
  let currentPage = 1;
  let pageSize = 20;
  let totalItems = 0;

  // Form data
  let transactionForm = {
    transactionType: 'entry',
    quantity: 0,
    unitPrice: 0,
    totalAmount: 0,
    transactionDate: new Date().toISOString().split('T')[0],
    description: '',
    invoiceNumber: '',
  };

  // Data table columns for transactions
  const transactionColumns = [
    {
      key: 'transactionType',
      label: 'Type',
      sortable: true,
      render: (row) => {
        const typeMap = {
          entry: '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Entry</span>',
          exit: '<span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Exit</span>',
          transfer: '<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Transfer</span>'
        };
        return typeMap[row.transactionType] || row.transactionType;
      }
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      render: (row) => {
        const sign = row.transactionType === 'exit' ? '-' : '+';
        return `${sign}${parseFloat(row.quantity).toFixed(2)}`;
      }
    },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      sortable: true,
      render: (row) => row.unitPrice ? `$${parseFloat(row.unitPrice).toFixed(2)}` : '-'
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      sortable: true,
      render: (row) => row.totalAmount ? `$${parseFloat(row.totalAmount).toFixed(2)}` : '-'
    },
    {
      key: 'transactionDate',
      label: 'Date',
      sortable: true,
      render: (row) => new Date(row.transactionDate).toLocaleDateString()
    },
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      sortable: true,
      render: (row) => row.invoiceNumber || '-'
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (row) => row.description || '-'
    },
    {
      key: 'approved',
      label: 'Status',
      sortable: true,
      render: (row) => {
        return row.approved
          ? '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Approved</span>'
          : '<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>';
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

    const materialId = $page.params.id;
    if (materialId) {
      await loadMaterial(materialId);
      await loadTransactions(materialId);
    }
  });

  async function loadMaterial(id) {
    loading = true;
    try {
      const response = await api.getMaterialById(id);
      material = response.data;
    } catch (error) {
      console.error('Failed to load material:', error);
      alert('Failed to load material details');
      goto('/materials');
    } finally {
      loading = false;
    }
  }

  async function loadTransactions(materialId) {
    loading = true;
    try {
      const response = await api.getMaterialTransactions(materialId, {
        page: currentPage,
        limit: pageSize,
      });

      transactions = response.data || [];
      totalItems = response.pagination?.total || response.data?.length || 0;
    } catch (error) {
      console.error('Failed to load transactions:', error);
      transactions = [];
    } finally {
      loading = false;
    }
  }

  function handlePageChange(event) {
    currentPage = event.detail.page;
    loadTransactions($page.params.id);
  }

  function openTransactionModal() {
    transactionForm = {
      transactionType: 'entry',
      quantity: 0,
      unitPrice: 0,
      totalAmount: 0,
      transactionDate: new Date().toISOString().split('T')[0],
      description: '',
      invoiceNumber: '',
    };
    showTransactionModal = true;
  }

  async function saveTransaction() {
    try {
      isSaving = true;

      const transactionData = {
        ...transactionForm,
        materialId: parseInt($page.params.id),
        totalAmount: transactionForm.unitPrice * transactionForm.quantity,
      };

      await api.createMaterialTransaction(transactionData);
      showTransactionModal = false;
      await loadTransactions($page.params.id);
      await loadMaterial($page.params.id); // Refresh material to update stock
      alert('Transaction created successfully');
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction: ' + error.message);
    } finally {
      isSaving = false;
    }
  }

  function updateTotalAmount() {
    transactionForm.totalAmount = transactionForm.unitPrice * transactionForm.quantity;
  }

  function getStockStatusClass(material) {
    if (!material) return '';
    const stock = parseFloat(material.currentStock || 0);
    const critical = parseFloat(material.criticalLevel || 0);

    if (stock <= critical) {
      return 'bg-red-100 text-red-800';
    } else if (stock <= critical * 1.5) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  }

  function getStockStatusText(material) {
    if (!material) return '';
    const stock = parseFloat(material.currentStock || 0);
    const critical = parseFloat(material.criticalLevel || 0);

    if (stock <= critical) {
      return 'Low Stock';
    } else if (stock <= critical * 1.5) {
      return 'Warning';
    } else {
      return 'In Stock';
    }
  }
</script>

<svelte:head>
  <title>{material ? `${material.materialName} - Materials` : 'Material Details'} - MedFMS</title>
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
              <li><a href="/materials" class="text-gray-500 hover:text-gray-700">Materials</a></li>
              <li class="text-gray-500">/</li>
              <li class="text-gray-900 font-medium">{material?.materialName || 'Loading...'}</li>
            </ol>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <button
            on:click={openTransactionModal}
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Transaction
          </button>
          <a
            href="/materials"
            class="btn btn-secondary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Materials
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if loading && !material}
      <div class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading material details...</p>
      </div>
    {:else if material}
      <!-- Material Details Card -->
      <div class="bg-white p-6 rounded-lg shadow border mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{material.materialName}</h1>
            <p class="text-gray-600">Code: {material.materialCode}</p>
          </div>
          <span class="px-3 py-1 text-sm font-medium rounded-full {getStockStatusClass(material)}">
            {getStockStatusText(material)}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">Current Stock</h3>
            <p class="text-2xl font-bold text-gray-900">{parseFloat(material.currentStock || 0).toFixed(2)}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">Critical Level</h3>
            <p class="text-2xl font-bold text-gray-900">{parseFloat(material.criticalLevel || 0).toFixed(2)}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">Standard Price</h3>
            <p class="text-2xl font-bold text-gray-900">
              {material.standardPrice ? `$${parseFloat(material.standardPrice).toFixed(2)}` : 'N/A'}
            </p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
            <p class="text-lg font-semibold text-gray-900">
              {new Date(material.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {#if material.description}
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p class="text-gray-900">{material.description}</p>
          </div>
        {/if}
      </div>

      <!-- Transactions Table -->
      <DataTable
        data={transactions}
        columns={transactionColumns}
        {loading}
        {searchTerm}
        {currentPage}
        {pageSize}
        {totalItems}
        title="Material Transactions"
        showSearch={false}
        showPagination={true}
        showExport={true}
        on:pagechange={handlePageChange}
      />
    {:else}
      <div class="text-center py-8">
        <p class="text-gray-600">Material not found</p>
      </div>
    {/if}
  </main>
</div>

<!-- Transaction Modal -->
<Modal bind:open={showTransactionModal} title="Add Material Transaction" on:close={() => showTransactionModal = false}>
  <form on:submit|preventDefault={saveTransaction} class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Transaction Type <span class="text-red-500">*</span>
        </label>
        <select
          bind:value={transactionForm.transactionType}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="entry">Stock Entry</option>
          <option value="exit">Stock Exit</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Quantity <span class="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          bind:value={transactionForm.quantity}
          on:input={updateTotalAmount}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter quantity"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
        <input
          type="number"
          step="0.01"
          bind:value={transactionForm.unitPrice}
          on:input={updateTotalAmount}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter unit price"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
        <input
          type="number"
          step="0.01"
          bind:value={transactionForm.totalAmount}
          disabled={true}
          class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600"
          placeholder="Calculated automatically"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Transaction Date <span class="text-red-500">*</span>
        </label>
        <input
          type="date"
          bind:value={transactionForm.transactionDate}
          required
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
        <input
          type="text"
          bind:value={transactionForm.invoiceNumber}
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter invoice number"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          bind:value={transactionForm.description}
          rows="3"
          disabled={isSaving}
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter transaction description"
        ></textarea>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        on:click={() => showTransactionModal = false}
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
        {isSaving ? 'Saving...' : 'Create Transaction'}
      </button>
    </div>
  </form>
</Modal>