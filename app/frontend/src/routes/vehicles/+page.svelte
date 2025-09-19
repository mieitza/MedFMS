<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DataTable from '$lib/components/DataTable.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { api } from '$lib/api';

	let vehicles = [];
	let loading = false;
	let showAddModal = false;
	let showEditModal = false;
	let selectedVehicle = null;
	let searchTerm = '';
	let currentPage = 1;
	let pageSize = 20;
	let totalItems = 0;

	// Dropdown data
	let brands = [];
	let models = [];
	let vehicleTypes = [];
	let vehicleStatuses = [];
	let fuelTypes = [];
	let locations = [];
	let departments = [];
	let drivers = [];

	const columns = [
		{
			key: 'vehicleCode',
			label: 'Vehicle Code',
			sortable: true,
			width: '120px'
		},
		{
			key: 'licensePlate',
			label: 'License Plate',
			sortable: true,
			width: '130px',
			render: (value: string) => `<span class="font-semibold text-primary-600">${value}</span>`
		},
		{
			key: 'brandName',
			label: 'Brand',
			sortable: true,
			width: '100px'
		},
		{
			key: 'modelName',
			label: 'Model',
			sortable: true,
			width: '120px'
		},
		{
			key: 'year',
			label: 'Year',
			sortable: true,
			width: '80px'
		},
		{
			key: 'fuelType',
			label: 'Fuel Type',
			sortable: true,
			width: '100px'
		},
		{
			key: 'vehicleType',
			label: 'Type',
			sortable: true,
			width: '100px'
		},
		{
			key: 'statusName',
			label: 'Status',
			sortable: true,
			width: '100px',
			render: (value: string, row: any) => {
				const colorMap: Record<string, string> = {
					'Active': 'bg-green-100 text-green-800',
					'Maintenance': 'bg-yellow-100 text-yellow-800',
					'Retired': 'bg-red-100 text-red-800',
					'Reserved': 'bg-purple-100 text-purple-800'
				};
				const colorClass = colorMap[value] || 'bg-gray-100 text-gray-800';
				return `<span class="px-2 py-1 text-xs font-medium rounded-full ${colorClass}">${value}</span>`;
			}
		},
		{
			key: 'odometer',
			label: 'Odometer',
			sortable: true,
			width: '100px',
			render: (value: number) => value ? `${value.toLocaleString()} km` : '-'
		},
		{
			key: 'driverName',
			label: 'Driver',
			sortable: true,
			width: '150px'
		}
	];

	onMount(async () => {
		// Check authentication
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/');
			return;
		}

		await loadVehicles();
		await loadDropdownData();
	});

	async function loadVehicles() {
		loading = true;
		try {
			const response = await api.getVehicles({
				page: currentPage,
				limit: pageSize,
				search: searchTerm
			});

			// Data already includes joined names from API
			vehicles = response.data.map((vehicle) => ({
				...vehicle,
				brandName: vehicle.brandName || 'Unknown',
				modelName: vehicle.modelName || 'Unknown',
				statusName: vehicle.statusName || 'Unknown',
				fuelType: vehicle.fuelTypeName || 'Unknown',
				vehicleType: vehicle.vehicleTypeName || 'Unknown',
				driverName: vehicle.driverName || '-'
			}));

			totalItems = response.pagination?.total || response.data.length;
		} catch (error) {
			console.error('Failed to load vehicles:', error);
			vehicles = [];
		} finally {
			loading = false;
		}
	}

	async function loadDropdownData() {
		try {
			const [
				brandsResponse,
				modelsResponse,
				typesResponse,
				statusesResponse,
				fuelTypesResponse,
				locationsResponse,
				departmentsResponse,
				driversResponse
			] = await Promise.all([
				api.getBrands(),
				api.getModels(),
				api.getVehicleTypes(),
				api.getVehicleStatuses(),
				api.getFuelTypes(),
				api.getLocations(),
				api.getDepartments(),
				api.getDrivers()
			]);

			brands = brandsResponse.data || [];
			models = modelsResponse.data || [];
			vehicleTypes = typesResponse.data || [];
			vehicleStatuses = statusesResponse.data || [];
			fuelTypes = fuelTypesResponse.data || [];
			locations = locationsResponse.data || [];
			departments = departmentsResponse.data || [];
			drivers = driversResponse.data || [];
		} catch (error) {
			console.error('Failed to load dropdown data:', error);
		}
	}

	function getBrandName(brandId: number): string {
		const brand = brands.find(b => b.id === brandId);
		return brand?.brandName || 'Unknown';
	}

	function getModelName(modelId: number): string {
		const model = models.find(m => m.id === modelId);
		return model?.modelName || 'Unknown';
	}

	function getStatusName(statusId: number): string {
		const status = vehicleStatuses.find(s => s.id === statusId);
		return status?.statusName || 'Unknown';
	}

	function getDriverName(driverId: number | null): string {
		if (!driverId) return '-';
		const driver = drivers.find(d => d.id === driverId);
		return driver?.fullName || 'Unknown';
	}

	function handleSearch(event: CustomEvent) {
		searchTerm = event.detail.term;
		currentPage = 1;
		loadVehicles();
	}

	function handlePageChange(event: CustomEvent) {
		currentPage = event.detail.page;
		loadVehicles();
	}

	function handleRowClick(event: CustomEvent) {
		const vehicle = event.detail.row;
		goto(`/vehicles/${vehicle.id}`);
	}

	function handleEdit(event: CustomEvent) {
		selectedVehicle = event.detail;
		showEditModal = true;
	}

	async function handleDelete(event: CustomEvent) {
		const vehicle = event.detail;
		if (confirm(`Are you sure you want to delete vehicle ${vehicle.licensePlate}?`)) {
			try {
				await api.deleteVehicle(vehicle.id);
				await loadVehicles();
			} catch (error) {
				console.error('Failed to delete vehicle:', error);
				alert('Failed to delete vehicle. Please try again.');
			}
		}
	}

	function handleAddVehicle() {
		selectedVehicle = null;
		showAddModal = true;
	}

	function handleExport(event: CustomEvent) {
		const { format, data } = event.detail;
		console.log(`Exporting ${data.length} vehicles to ${format}`);
		// TODO: Implement export functionality
	}

	function closeModals() {
		showAddModal = false;
		showEditModal = false;
		selectedVehicle = null;
	}

	async function refreshData() {
		await loadVehicles();
		closeModals();
	}
</script>

<svelte:head>
	<title>Vehicle Management - MedFMS</title>
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
							<li class="text-gray-900 font-medium">Vehicles</li>
						</ol>
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					<button
						on:click={handleAddVehicle}
						class="btn btn-primary"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
						</svg>
						Add Vehicle
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<DataTable
			{data}={vehicles}
			{columns}
			{loading}
			{searchTerm}
			{currentPage}
			{pageSize}
			{totalItems}
			title="Vehicle Fleet"
			showSearch={true}
			showPagination={true}
			showExport={true}
			on:search={handleSearch}
			on:pagechange={handlePageChange}
			on:rowclick={handleRowClick}
			on:edit={handleEdit}
			on:delete={handleDelete}
			on:export={handleExport}
		/>
	</main>
</div>

<!-- Add/Edit Vehicle Modal -->
<Modal
	open={showAddModal || showEditModal}
	title={selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
	size="xl"
	on:close={closeModals}
>
	<div class="text-center py-8">
		<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
		</svg>
		<h3 class="mt-2 text-sm font-medium text-gray-900">Vehicle Form</h3>
		<p class="mt-1 text-sm text-gray-500">The vehicle form will be implemented in the next step.</p>
	</div>

	<svelte:fragment slot="footer">
		<button type="button" class="btn btn-secondary" on:click={closeModals}>
			Cancel
		</button>
		<button type="button" class="btn btn-primary">
			{selectedVehicle ? 'Update' : 'Create'} Vehicle
		</button>
	</svelte:fragment>
</Modal>