<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { _ } from '$lib/i18n';
	import DataTable from '$lib/components/DataTable.svelte';
	import { api } from '$lib/api';

	let transferRequests = [];
	let loading = false;
	let searchTerm = '';
	let currentPage = 1;
	let pageSize = 20;
	let totalItems = 0;

	// Data table columns - using reactive declarations for translations
	$: columns = [
		{
			key: 'transferRequest.requestNumber',
			label: 'Request Number',
			sortable: true,
			width: '150px',
			render: (value, row) => `<span class="font-semibold text-primary-600">${row.transferRequest?.requestNumber || 'N/A'}</span>`
		},
		{
			key: 'sourceWarehouse.warehouseName',
			label: 'Source Warehouse',
			sortable: true,
			width: '180px',
			render: (value, row) => row.sourceWarehouse?.warehouseName || 'N/A'
		},
		{
			key: 'destinationWarehouse.warehouseName',
			label: 'Destination Warehouse',
			sortable: true,
			width: '180px',
			render: (value, row) => row.destinationWarehouse?.warehouseName || 'N/A'
		},
		{
			key: 'material.materialName',
			label: 'Material',
			sortable: true,
			width: '200px',
			render: (value, row) => row.material?.materialName || 'N/A'
		},
		{
			key: 'transferRequest.quantity',
			label: 'Quantity',
			sortable: true,
			width: '100px',
			render: (value) => value || 'N/A'
		},
		{
			key: 'transferRequest.status',
			label: 'Status',
			sortable: true,
			width: '120px',
			render: (value) => {
				const statusLabels = {
					'pending': 'Pending',
					'approved': 'Approved',
					'rejected': 'Rejected',
					'in_transit': 'In Transit',
					'completed': 'Completed',
					'cancelled': 'Cancelled'
				};
				const colorMap = {
					'pending': 'bg-yellow-100 text-yellow-800',
					'approved': 'bg-blue-100 text-blue-800',
					'rejected': 'bg-red-100 text-red-800',
					'in_transit': 'bg-purple-100 text-purple-800',
					'completed': 'bg-green-100 text-green-800',
					'cancelled': 'bg-gray-100 text-gray-800'
				};
				const color = colorMap[value] || 'bg-gray-100 text-gray-800';
				const label = statusLabels[value] || 'Unknown';
				return `<span class="px-2 py-1 text-xs font-medium rounded-full ${color}">${label}</span>`;
			}
		},
		{
			key: 'transferRequest.priority',
			label: 'Priority',
			sortable: true,
			width: '100px',
			render: (value) => {
				const colorMap = {
					1: 'text-red-600',
					2: 'text-orange-600',
					3: 'text-yellow-600',
					4: 'text-blue-600',
					5: 'text-gray-600'
				};
				const color = colorMap[value] || 'text-gray-600';
				return `<span class="font-medium ${color}">${value || 'N/A'}</span>`;
			}
		},
		{
			key: 'transferRequest.requestedDate',
			label: 'Requested Date',
			sortable: true,
			width: '150px',
			render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
		}
	];

	onMount(async () => {
		// Check authentication
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/');
			return;
		}

		await loadTransferRequests();
	});

	async function loadTransferRequests() {
		loading = true;
		try {
			const params = {
				page: currentPage,
				limit: pageSize,
				search: searchTerm
			};

			const response = await api.getTransferRequests(params);
			transferRequests = response.data || [];
			totalItems = response.pagination?.total || response.data.length;
		} catch (error) {
			console.error('Failed to load transfer requests:', error);
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
		const request = event.detail.row;
		goto(`/materials/transfer-requests/${request.transferRequest?.id}`);
	}

	function handleExport(event) {
		const { format, data } = event.detail;
		console.log(`Exporting ${data.length} transfer requests to ${format}`);
		// TODO: Implement export functionality
	}

	function handleNewRequest() {
		goto('/materials/transfer-requests/new');
	}
</script>

<svelte:head>
	<title>Warehouse Transfer Requests - {$_('common.appName')}</title>
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
							<li class="text-gray-900 font-medium">Transfer Requests</li>
						</ol>
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					<button on:click={handleNewRequest} class="btn btn-primary">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
						</svg>
						New Transfer Request
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<DataTable
			data={transferRequests}
			{columns}
			{loading}
			{searchTerm}
			{currentPage}
			{pageSize}
			{totalItems}
			title="Transfer Requests"
			showSearch={true}
			showPagination={true}
			showExport={true}
			on:search={handleSearch}
			on:pagechange={handlePageChange}
			on:rowclick={handleRowClick}
			on:export={handleExport}
		/>
	</main>
</div>
