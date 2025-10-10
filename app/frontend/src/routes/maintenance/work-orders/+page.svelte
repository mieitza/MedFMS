<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { _ } from '$lib/i18n';
	import DataTable from '$lib/components/DataTable.svelte';
	import { api } from '$lib/api';

	let workOrders = [];
	let loading = false;
	let searchTerm = '';
	let currentPage = 1;
	let pageSize = 20;
	let totalItems = 0;

	// Get vehicleId from query params if present
	$: vehicleId = $page.url.searchParams.get('vehicleId');
	$: if (vehicleId) {
		loadWorkOrders();
	}

	// Data table columns - using reactive declarations for translations
	$: columns = [
		{
			key: 'workOrder.workOrderNumber',
			label: $_('maintenance.workOrders.table.workOrderNumber'),
			sortable: true,
			width: '150px',
			render: (value, row) => `<span class="font-semibold text-primary-600">${row.workOrder?.workOrderNumber || 'N/A'}</span>`
		},
		{
			key: 'vehicle.licensePlate',
			label: $_('maintenance.workOrders.table.vehicle'),
			sortable: true,
			width: '150px',
			render: (value, row) => row.vehicle?.licensePlate || 'N/A'
		},
		{
			key: 'maintenanceType.typeName',
			label: $_('maintenance.workOrders.table.type'),
			sortable: true,
			width: '200px',
			render: (value, row) => row.maintenanceType?.typeName || 'N/A'
		},
		{
			key: 'workOrder.title',
			label: $_('maintenance.workOrders.table.title'),
			sortable: true,
			width: '250px'
		},
		{
			key: 'workOrder.status',
			label: $_('maintenance.workOrders.table.status'),
			sortable: true,
			width: '120px',
			render: (value) => {
				const statusLabels = {
					'pending': $_('maintenance.status.pending'),
					'approved': $_('maintenance.status.approved'),
					'in_progress': $_('maintenance.status.inProgress'),
					'completed': $_('maintenance.status.completed'),
					'cancelled': $_('maintenance.status.cancelled'),
					'on_hold': $_('maintenance.status.onHold')
				};
				const colorMap = {
					'pending': 'bg-yellow-100 text-yellow-800',
					'approved': 'bg-blue-100 text-blue-800',
					'in_progress': 'bg-purple-100 text-purple-800',
					'completed': 'bg-green-100 text-green-800',
					'cancelled': 'bg-red-100 text-red-800',
					'on_hold': 'bg-gray-100 text-gray-800'
				};
				const color = colorMap[value] || 'bg-gray-100 text-gray-800';
				const label = statusLabels[value] || $_('maintenance.workOrders.unknown');
				return `<span class="px-2 py-1 text-xs font-medium rounded-full ${color}">${label}</span>`;
			}
		},
		{
			key: 'workOrder.priority',
			label: $_('maintenance.workOrders.table.priority'),
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
			key: 'workOrder.scheduledDate',
			label: $_('maintenance.workOrders.table.scheduledDate'),
			sortable: true,
			width: '150px',
			render: (value) => value ? new Date(value).toLocaleDateString() : $_('maintenance.workOrders.notScheduled')
		}
	];

	onMount(async () => {
		// Check authentication
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/');
			return;
		}

		await loadWorkOrders();
	});

	async function loadWorkOrders() {
		loading = true;
		try {
			const params = {
				page: currentPage,
				limit: pageSize,
				search: searchTerm
			};

			// Add vehicleId filter if present
			if (vehicleId) {
				params.vehicleId = parseInt(vehicleId);
			}

			const response = await api.getMaintenanceWorkOrders(params);
			workOrders = response.data || [];
			totalItems = response.pagination?.total || response.data.length;
		} catch (error) {
			console.error($_('maintenance.workOrders.messages.loadFailed'), error);
			workOrders = [];
		} finally {
			loading = false;
		}
	}

	function handleSearch(event) {
		searchTerm = event.detail.term;
		currentPage = 1;
		loadWorkOrders();
	}

	function handlePageChange(event) {
		currentPage = event.detail.page;
		loadWorkOrders();
	}

	function handleRowClick(event) {
		const workOrder = event.detail.row;
		goto(`/maintenance/work-orders/${workOrder.workOrder?.id}`);
	}

	function handleExport(event) {
		const { format, data } = event.detail;
		console.log(`Exporting ${data.length} work orders to ${format}`);
		// TODO: Implement export functionality
	}

	function getPageTitle() {
		if (vehicleId) {
			const vehicle = workOrders.length > 0 ? workOrders[0].vehicle : null;
			return vehicle ? $_('maintenance.workOrders.workOrdersFor', { values: { licensePlate: vehicle.licensePlate } }) : $_('maintenance.workOrders.title');
		}
		return $_('maintenance.workOrders.title');
	}

	function getPageTitleFull() {
		if (vehicleId) {
			const vehicle = workOrders.length > 0 ? workOrders[0].vehicle : null;
			return vehicle ? $_('maintenance.workOrders.workOrdersForTitle', { values: { licensePlate: vehicle.licensePlate } }) : $_('maintenance.workOrders.pageTitle');
		}
		return $_('maintenance.workOrders.pageTitle');
	}
</script>

<svelte:head>
	<title>{getPageTitleFull()}</title>
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
							<li><a href="/maintenance" class="text-gray-500 hover:text-gray-700">{$_('maintenance.title')}</a></li>
							<li class="text-gray-500">/</li>
							<li class="text-gray-900 font-medium">{$_('maintenance.workOrders.title')}</li>
						</ol>
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					{#if vehicleId}
						<a href="/vehicles/{vehicleId}" class="btn btn-secondary">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
							</svg>
							{$_('maintenance.workOrders.backToVehicle')}
						</a>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<DataTable
			data={workOrders}
			{columns}
			{loading}
			{searchTerm}
			{currentPage}
			{pageSize}
			{totalItems}
			title={getPageTitle()}
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
