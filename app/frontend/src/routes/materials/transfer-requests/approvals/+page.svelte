<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import DataTable from '$lib/components/DataTable.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let transferRequests = [];
	let loading = false;
	let pagination = null;
	let showApprovalModal = false;
	let selectedRequest = null;
	let approvalNotes = '';
	let approvedQuantity = '';
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
		sourceWarehouseId: null,
		destinationWarehouseId: null,
	};

	let warehouses = [];

	// Priority options
	const priorityOptions = [
		{ value: '', label: 'All Priorities' },
		{ value: 1, label: 'Priority 1 (Highest)' },
		{ value: 2, label: 'Priority 2' },
		{ value: 3, label: 'Priority 3' },
		{ value: 4, label: 'Priority 4' },
		{ value: 5, label: 'Priority 5 (Lowest)' }
	];

	// Data table columns
	$: columns = [
		{
			key: 'transferRequest.requestNumber',
			label: 'Request #',
			sortable: true,
			width: '140px',
			render: (value, row) => `<span class="font-semibold text-primary-600">${row?.transferRequest?.requestNumber || 'N/A'}</span>`
		},
		{
			key: 'sourceWarehouse.warehouseName',
			label: 'Source',
			sortable: true,
			width: '180px',
			render: (value, row) => row?.sourceWarehouse?.warehouseName || 'N/A'
		},
		{
			key: 'destinationWarehouse.warehouseName',
			label: 'Destination',
			sortable: true,
			width: '180px',
			render: (value, row) => row?.destinationWarehouse?.warehouseName || 'N/A'
		},
		{
			key: 'material.materialName',
			label: 'Material',
			sortable: true,
			width: '200px',
			render: (value, row) => {
				const materialName = row?.material?.materialName || 'N/A';
				const materialCode = row?.material?.materialCode || '';
				return `<div class="max-w-48"><div class="truncate font-medium">${materialName}</div><small class="text-gray-500 truncate block">${materialCode}</small></div>`;
			}
		},
		{
			key: 'transferRequest.quantity',
			label: 'Quantity',
			sortable: true,
			width: '100px',
			render: (value, row) => {
				const qty = value || 0;
				const unit = row?.material?.unit || '';
				return `${qty} ${unit}`;
			}
		},
		{
			key: 'transferRequest.priority',
			label: 'Priority',
			sortable: true,
			width: '100px',
			render: (value, row) => {
				const priority = row?.transferRequest?.priority || 3;
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
			key: 'transferRequest.requestedDate',
			label: 'Requested',
			sortable: true,
			width: '110px',
			render: (value, row) => row?.transferRequest?.requestedDate ? new Date(row?.transferRequest?.requestedDate).toLocaleDateString() : '-'
		},
		{
			key: 'transferRequest.requiredByDate',
			label: 'Required By',
			sortable: true,
			width: '110px',
			render: (value, row) => row?.transferRequest?.requiredByDate ? new Date(row?.transferRequest?.requiredByDate).toLocaleDateString() : '-'
		}
	];

	onMount(async () => {
		// Check authentication
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/');
			return;
		}

		// Load warehouses for filters
		try {
			const response = await api.getWarehouses();
			warehouses = response.data || [];
		} catch (error) {
			console.error('Failed to load warehouses:', error);
		}

		await loadTransferRequests();
	});

	async function loadTransferRequests() {
		loading = true;
		try {
			const response = await api.getTransferRequestsForApproval({
				page: currentPage,
				limit: pageSize,
				search: searchTerm,
				...filters
			});

			transferRequests = response.data || [];
			totalItems = response.pagination?.total || response.data?.length || 0;
			pagination = response.pagination;
		} catch (error) {
			console.error('Failed to load transfer requests for approval:', error);
			transferRequests = [];
		} finally {
			loading = false;
		}
	}

	function handleSearch(event) {
		searchTerm = event.detail.term;
		currentPage = 1;
		loadTransferRequests();
	}

	function handlePageChange(event) {
		currentPage = event.detail.page;
		loadTransferRequests();
	}

	function handleRowClick(event) {
		const row = event.detail.row;
		goto(`/materials/transfer-requests/${row.transferRequest?.id}`);
	}

	async function handleFilter() {
		currentPage = 1;
		await loadTransferRequests();
	}

	function resetFilters() {
		filters = {
			page: 1,
			limit: 20,
			priority: '',
			sourceWarehouseId: null,
			destinationWarehouseId: null,
		};
		searchTerm = '';
		currentPage = 1;
		loadTransferRequests();
	}

	function handleRowAction(event) {
		const { action, row } = event.detail;
		selectedRequest = row;
		approvalNotes = '';
		approvedQuantity = row?.transferRequest?.quantity || '';

		if (action === 'approve' || action === 'reject') {
			showApprovalModal = true;
		}
	}

	async function handleApprove() {
		if (!selectedRequest) return;

		// Validate approved quantity if provided
		const approvedQty = approvedQuantity ? parseFloat(approvedQuantity) : null;
		if (approvedQty !== null && (isNaN(approvedQty) || approvedQty <= 0)) {
			alert('Please enter a valid approved quantity');
			return;
		}

		if (approvedQty !== null && approvedQty > selectedRequest.transferRequest?.quantity) {
			if (!confirm('Approved quantity is higher than requested quantity. Continue?')) {
				return;
			}
		}

		try {
			isApproving = true;
			await api.approveTransferRequest(
				selectedRequest.transferRequest?.id,
				approvalNotes,
				approvedQty
			);
			showApprovalModal = false;
			await loadTransferRequests();
			alert('Transfer request approved successfully');
		} catch (error) {
			console.error('Error approving transfer request:', error);
			alert('Failed to approve transfer request: ' + error.message);
		} finally {
			isApproving = false;
		}
	}

	async function handleReject() {
		if (!selectedRequest || !approvalNotes.trim()) {
			alert('Please provide a reason for rejection');
			return;
		}

		try {
			isApproving = true;
			await api.rejectTransferRequest(selectedRequest.transferRequest?.id, approvalNotes);
			showApprovalModal = false;
			await loadTransferRequests();
			alert('Transfer request rejected');
		} catch (error) {
			console.error('Error rejecting transfer request:', error);
			alert('Failed to reject transfer request: ' + error.message);
		} finally {
			isApproving = false;
		}
	}

	function handleExport(event) {
		const { format, data } = event.detail;
		console.log(`Exporting ${data.length} transfer requests to ${format}`);
		// TODO: Implement export functionality
	}
</script>

<svelte:head>
	<title>Transfer Request Approvals - {$_('common.appName')}</title>
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
							<li><a href="/materials" class="text-gray-500 hover:text-gray-700">Materials</a></li>
							<li class="text-gray-500">/</li>
							<li><a href="/materials/transfer-requests" class="text-gray-500 hover:text-gray-700">Transfer Requests</a></li>
							<li class="text-gray-500">/</li>
							<li class="text-gray-900 font-medium">Approvals</li>
						</ol>
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					<a
						href="/materials/transfer-requests"
						class="btn btn-secondary"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
						</svg>
						Back to Transfer Requests
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
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
					<label class="block text-sm font-medium text-gray-700 mb-1">Source Warehouse</label>
					<select
						bind:value={filters.sourceWarehouseId}
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value={null}>All Warehouses</option>
						{#each warehouses as warehouse}
							<option value={warehouse.id}>{warehouse.warehouseName}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Destination Warehouse</label>
					<select
						bind:value={filters.destinationWarehouseId}
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value={null}>All Warehouses</option>
						{#each warehouses as warehouse}
							<option value={warehouse.id}>{warehouse.warehouseName}</option>
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

		<!-- Transfer Requests Table -->
		<DataTable
			data={transferRequests}
			{columns}
			{loading}
			{searchTerm}
			{currentPage}
			{pageSize}
			{totalItems}
			title="Pending Transfer Request Approvals"
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
			on:export={handleExport}
		/>
	</main>
</div>

<!-- Approval Modal -->
<Modal bind:open={showApprovalModal} title="Review Transfer Request" on:close={() => showApprovalModal = false}>
	{#if selectedRequest}
		<div class="space-y-4">
			<!-- Transfer Request Details -->
			<div class="bg-gray-50 p-4 rounded-lg">
				<h4 class="font-medium text-gray-900 mb-2">Transfer Request Details</h4>
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span class="font-medium">Request Number: </span>
						{selectedRequest.transferRequest?.requestNumber || 'N/A'}
					</div>
					<div>
						<span class="font-medium">Status: </span>
						<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
							{selectedRequest.transferRequest?.status || 'N/A'}
						</span>
					</div>
					<div>
						<span class="font-medium">Source Warehouse: </span>
						{selectedRequest.sourceWarehouse?.warehouseName}
					</div>
					<div>
						<span class="font-medium">Destination Warehouse: </span>
						{selectedRequest.destinationWarehouse?.warehouseName}
					</div>
					<div class="col-span-2">
						<span class="font-medium">Material: </span>
						{selectedRequest.material?.materialName} ({selectedRequest.material?.materialCode})
					</div>
					<div>
						<span class="font-medium">Requested Quantity: </span>
						{selectedRequest.transferRequest?.quantity} {selectedRequest.material?.unit || ''}
					</div>
					<div>
						<span class="font-medium">Priority: </span>
						{['', 'Urgent', 'High', 'Normal', 'Low', 'Optional'][selectedRequest.transferRequest?.priority || 3]}
					</div>
					<div>
						<span class="font-medium">Requested Date: </span>
						{selectedRequest.transferRequest?.requestedDate ? new Date(selectedRequest.transferRequest?.requestedDate).toLocaleDateString() : 'N/A'}
					</div>
					{#if selectedRequest.transferRequest?.requiredByDate}
						<div>
							<span class="font-medium">Required By: </span>
							{new Date(selectedRequest.transferRequest?.requiredByDate).toLocaleDateString()}
						</div>
					{/if}
					{#if selectedRequest.transferRequest?.reason}
						<div class="col-span-2">
							<span class="font-medium">Reason: </span>
							{selectedRequest.transferRequest?.reason}
						</div>
					{/if}
					{#if selectedRequest.transferRequest?.notes}
						<div class="col-span-2">
							<span class="font-medium">Notes: </span>
							{selectedRequest.transferRequest?.notes}
						</div>
					{/if}
				</div>
			</div>

			<!-- Current Stock Information -->
			<div class="bg-blue-50 p-4 rounded-lg">
				<h4 class="font-medium text-gray-900 mb-2">Stock Information</h4>
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span class="font-medium">Source Warehouse Stock: </span>
						{selectedRequest.material?.quantity || 0} {selectedRequest.material?.unit || ''}
					</div>
					<div>
						<span class="font-medium">Min Stock Level: </span>
						{selectedRequest.material?.minStock || 'N/A'}
					</div>
				</div>
			</div>

			<!-- Approval Section -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">
					Approved Quantity (optional)
					<span class="text-gray-500 font-normal"> - Leave empty to approve full requested quantity</span>
				</label>
				<input
					type="number"
					bind:value={approvedQuantity}
					step="0.01"
					min="0"
					class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder={`Default: ${selectedRequest.transferRequest?.quantity || ''}`}
				/>
			</div>

			<!-- Notes Section -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">
					Approval/Rejection Notes
					<span class="text-red-500">* (Required for rejection)</span>
				</label>
				<textarea
					bind:value={approvalNotes}
					rows="4"
					class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Add notes about your decision (required for rejection, optional for approval)"
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
