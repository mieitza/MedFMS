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

	// Priority options - using reactive declarations for translations
	$: priorityOptions = [
		{ value: '', label: $_('materials.transferRequests.approvals.allPriorities') },
		{ value: 1, label: $_('materials.transferRequests.priorities.highest') },
		{ value: 2, label: $_('materials.transferRequests.priorities.priority2') },
		{ value: 3, label: $_('materials.transferRequests.priorities.priority3') },
		{ value: 4, label: $_('materials.transferRequests.priorities.priority4') },
		{ value: 5, label: $_('materials.transferRequests.priorities.lowest') }
	];

	// Data table columns
	$: columns = [
		{
			key: 'transferRequest.requestNumber',
			label: $_('materials.transferRequests.requestNumber'),
			sortable: true,
			width: '140px',
			render: (value, row) => `<span class="font-semibold text-primary-600">${row?.transferRequest?.requestNumber || 'N/A'}</span>`
		},
		{
			key: 'transferRequest.transferType',
			label: $_('materials.transferRequests.transferType'),
			sortable: true,
			width: '180px',
			render: (value, row) => {
				const type = row?.transferRequest?.transferType || 'warehouse-to-warehouse';
				const typeLabels = {
					'warehouse-to-warehouse': $_('materials.transferRequests.types.warehouse-to-warehouse'),
					'warehouse-to-vehicle': $_('materials.transferRequests.types.warehouse-to-vehicle'),
					'vehicle-to-warehouse': $_('materials.transferRequests.types.vehicle-to-warehouse'),
					'warehouse-to-employee': $_('materials.transferRequests.types.warehouse-to-employee')
				};
				return typeLabels[type] || type;
			}
		},
		{
			key: 'sourceWarehouse.warehouseName',
			label: $_('materials.transferRequests.source'),
			sortable: true,
			width: '180px',
			render: (value, row) => row?.sourceWarehouse?.warehouseName || 'N/A'
		},
		{
			key: 'destination',
			label: $_('materials.transferRequests.destination'),
			sortable: false,
			width: '180px',
			render: (value, row) => {
				const type = row?.transferRequest?.transferType || 'warehouse-to-warehouse';
				if (type === 'warehouse-to-warehouse') {
					return row?.destinationWarehouse?.warehouseName || 'N/A';
				} else if (type === 'warehouse-to-vehicle' || type === 'vehicle-to-warehouse') {
					const vehicleData = row?.destinationVehicle;
					if (vehicleData) {
						return `${vehicleData.licensePlate} - ${vehicleData.make} ${vehicleData.model}`;
					}
					return 'N/A';
				} else if (type === 'warehouse-to-employee') {
					const employeeData = row?.destinationEmployee;
					if (employeeData) {
						return employeeData.fullName || employeeData.username || 'N/A';
					}
					return 'N/A';
				}
				return 'N/A';
			}
		},
		{
			key: 'material.materialName',
			label: $_('materials.transferRequests.material'),
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
			label: $_('materials.transferRequests.quantity'),
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
			label: $_('materials.transferRequests.priority'),
			sortable: true,
			width: '100px',
			render: (value, row) => {
				const priority = row?.transferRequest?.priority || 3;
				const priorityLabels = {
					1: { label: $_('materials.transferRequests.priorities.urgent'), class: 'bg-red-100 text-red-800' },
					2: { label: $_('materials.transferRequests.priorities.high'), class: 'bg-orange-100 text-orange-800' },
					3: { label: $_('materials.transferRequests.priorities.normal'), class: 'bg-blue-100 text-blue-800' },
					4: { label: $_('materials.transferRequests.priorities.low'), class: 'bg-green-100 text-green-800' },
					5: { label: $_('materials.transferRequests.priorities.optional'), class: 'bg-gray-100 text-gray-800' }
				};
				const p = priorityLabels[priority] || priorityLabels[3];
				return `<span class="px-2 py-1 text-xs font-medium rounded-full ${p.class}">${p.label}</span>`;
			}
		},
		{
			key: 'transferRequest.requestedDate',
			label: $_('materials.transferRequests.requested'),
			sortable: true,
			width: '110px',
			render: (value, row) => row?.transferRequest?.requestedDate ? new Date(row?.transferRequest?.requestedDate).toLocaleDateString() : '-'
		},
		{
			key: 'transferRequest.requiredByDate',
			label: $_('materials.transferRequests.requiredBy'),
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
			alert($_('materials.transferRequests.approvals.invalidQuantity'));
			return;
		}

		if (approvedQty !== null && approvedQty > selectedRequest.transferRequest?.quantity) {
			if (!confirm($_('materials.transferRequests.approvals.quantityHigherConfirm'))) {
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
			alert($_('materials.transferRequests.approvals.approveSuccess'));
		} catch (error) {
			console.error('Error approving transfer request:', error);
			alert($_('materials.transferRequests.approvals.approveFailed') + ': ' + error.message);
		} finally {
			isApproving = false;
		}
	}

	async function handleReject() {
		if (!selectedRequest || !approvalNotes.trim()) {
			alert($_('materials.transferRequests.approvals.provideRejectionReason'));
			return;
		}

		try {
			isApproving = true;
			await api.rejectTransferRequest(selectedRequest.transferRequest?.id, approvalNotes);
			showApprovalModal = false;
			await loadTransferRequests();
			alert($_('materials.transferRequests.approvals.rejectSuccess'));
		} catch (error) {
			console.error('Error rejecting transfer request:', error);
			alert($_('materials.transferRequests.approvals.rejectFailed') + ': ' + error.message);
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
	<title>{$_('materials.transferRequests.approvals.pageTitle')} - {$_('common.appName')}</title>
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
							<li><a href="/materials" class="text-gray-500 hover:text-gray-700">{$_('materials.title')}</a></li>
							<li class="text-gray-500">/</li>
							<li><a href="/materials/transfer-requests" class="text-gray-500 hover:text-gray-700">{$_('materials.transferRequests.title')}</a></li>
							<li class="text-gray-500">/</li>
							<li class="text-gray-900 font-medium">{$_('materials.transferRequests.approvals.title')}</li>
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
						{$_('materials.transferRequests.approvals.backToTransferRequests')}
					</a>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

		<!-- Filters -->
		<div class="bg-white p-6 rounded-lg shadow border mb-6">
			<h3 class="text-lg font-semibold mb-4">{$_('materials.transferRequests.approvals.filters')}</h3>
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.transferRequests.priority')}</label>
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
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.transferRequests.sourceWarehouse')}</label>
					<select
						bind:value={filters.sourceWarehouseId}
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value={null}>{$_('materials.transferRequests.approvals.allWarehouses')}</option>
						{#each warehouses as warehouse}
							<option value={warehouse.id}>{warehouse.warehouseName}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('materials.transferRequests.destinationWarehouse')}</label>
					<select
						bind:value={filters.destinationWarehouseId}
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value={null}>{$_('materials.transferRequests.approvals.allWarehouses')}</option>
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
						{$_('materials.transferRequests.approvals.applyFilters')}
					</button>
					<button
						on:click={resetFilters}
						class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
					>
						{$_('materials.transferRequests.approvals.reset')}
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
			title={$_('materials.transferRequests.approvals.pendingApprovals')}
			showSearch={true}
			showPagination={true}
			showExport={true}
			actions={[
				{ key: 'approve', label: $_('materials.transferRequests.approvals.approve'), condition: () => true, class: 'bg-green-600 hover:bg-green-700 text-white' },
				{ key: 'reject', label: $_('materials.transferRequests.approvals.reject'), condition: () => true, class: 'bg-red-600 hover:bg-red-700 text-white' }
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
<Modal bind:open={showApprovalModal} title={$_('materials.transferRequests.approvals.reviewRequest')} on:close={() => showApprovalModal = false}>
	{#if selectedRequest}
		<div class="space-y-4">
			<!-- Transfer Request Details -->
			<div class="bg-gray-50 p-4 rounded-lg">
				<h4 class="font-medium text-gray-900 mb-2">{$_('materials.transferRequests.approvals.requestDetails')}</h4>
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span class="font-medium">{$_('materials.transferRequests.requestNumber')}: </span>
						{selectedRequest.transferRequest?.requestNumber || 'N/A'}
					</div>
					<div>
						<span class="font-medium">{$_('materials.transferRequests.status')}: </span>
						<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
							{selectedRequest.transferRequest?.status || 'N/A'}
						</span>
					</div>
					<div>
						<span class="font-medium">{$_('materials.transferRequests.sourceWarehouse')}: </span>
						{selectedRequest.sourceWarehouse?.warehouseName}
					</div>
					<div>
						<span class="font-medium">{$_('materials.transferRequests.destinationWarehouse')}: </span>
						{selectedRequest.destinationWarehouse?.warehouseName}
					</div>
					<div class="col-span-2">
						<span class="font-medium">{$_('materials.transferRequests.material')}: </span>
						{selectedRequest.material?.materialName} ({selectedRequest.material?.materialCode})
					</div>
					<div>
						<span class="font-medium">{$_('materials.transferRequests.approvals.requestedQuantity')}: </span>
						{selectedRequest.transferRequest?.quantity} {selectedRequest.material?.unit || ''}
					</div>
					<div>
						<span class="font-medium">{$_('materials.transferRequests.priority')}: </span>
						{['', $_('materials.transferRequests.priorities.urgent'), $_('materials.transferRequests.priorities.high'), $_('materials.transferRequests.priorities.normal'), $_('materials.transferRequests.priorities.low'), $_('materials.transferRequests.priorities.optional')][selectedRequest.transferRequest?.priority || 3]}
					</div>
					<div>
						<span class="font-medium">{$_('materials.transferRequests.requestedDate')}: </span>
						{selectedRequest.transferRequest?.requestedDate ? new Date(selectedRequest.transferRequest?.requestedDate).toLocaleDateString() : 'N/A'}
					</div>
					{#if selectedRequest.transferRequest?.requiredByDate}
						<div>
							<span class="font-medium">{$_('materials.transferRequests.requiredBy')}: </span>
							{new Date(selectedRequest.transferRequest?.requiredByDate).toLocaleDateString()}
						</div>
					{/if}
					{#if selectedRequest.transferRequest?.reason}
						<div class="col-span-2">
							<span class="font-medium">{$_('materials.transferRequests.approvals.reason')}: </span>
							{selectedRequest.transferRequest?.reason}
						</div>
					{/if}
					{#if selectedRequest.transferRequest?.notes}
						<div class="col-span-2">
							<span class="font-medium">{$_('materials.transferRequests.approvals.notes')}: </span>
							{selectedRequest.transferRequest?.notes}
						</div>
					{/if}
				</div>
			</div>

			<!-- Current Stock Information -->
			<div class="bg-blue-50 p-4 rounded-lg">
				<h4 class="font-medium text-gray-900 mb-2">{$_('materials.transferRequests.approvals.stockInformation')}</h4>
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span class="font-medium">{$_('materials.transferRequests.approvals.sourceWarehouseStock')}: </span>
						{selectedRequest.material?.quantity || 0} {selectedRequest.material?.unit || ''}
					</div>
					<div>
						<span class="font-medium">{$_('materials.transferRequests.approvals.minStockLevel')}: </span>
						{selectedRequest.material?.minStock || 'N/A'}
					</div>
				</div>
			</div>

			<!-- Approval Section -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">
					{$_('materials.transferRequests.approvals.approvedQuantity')}
					<span class="text-gray-500 font-normal"> - {$_('materials.transferRequests.approvals.approvedQuantityHint')}</span>
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
					{$_('materials.transferRequests.approvals.approvalNotes')}
					<span class="text-red-500">{$_('materials.transferRequests.approvals.approvalNotesRequired')}</span>
				</label>
				<textarea
					bind:value={approvalNotes}
					rows="4"
					class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder={$_('materials.transferRequests.approvals.approvalNotesPlaceholder')}
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
					{$_('materials.transferRequests.approvals.cancel')}
				</button>
				<button
					type="button"
					on:click={handleReject}
					disabled={isApproving || !approvalNotes.trim()}
					class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
				>
					{isApproving ? $_('materials.transferRequests.approvals.processing') : $_('materials.transferRequests.approvals.reject')}
				</button>
				<button
					type="button"
					on:click={handleApprove}
					disabled={isApproving}
					class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
				>
					{isApproving ? $_('materials.transferRequests.approvals.processing') : $_('materials.transferRequests.approvals.approve')}
				</button>
			</div>
		</div>
	{/if}
</Modal>
