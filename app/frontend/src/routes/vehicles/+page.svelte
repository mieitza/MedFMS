<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DataTable from '$lib/components/DataTable.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import VehicleForm from '$lib/components/VehicleForm.svelte';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';

	let vehicles = [];
	let loading = false;
	let showAddModal = false;
	let showEditModal = false;
	let selectedVehicle = null;
	let searchTerm = '';
	let currentPage = 1;
	let pageSize = 20;
	let totalItems = 0;
	let sortField = '';
	let sortDirection = 'asc';

	// Dropdown data
	let brands = [];
	let models = [];
	let vehicleTypes = [];
	let vehicleStatuses = [];
	let fuelTypes = [];
	let locations = [];
	let departments = [];
	let employees = [];

	let columns = [];

	// Make columns reactive to locale changes
	$: {
		const renderLicensePlate = (value) => {
			return `<span class="font-semibold text-primary-600">${value}</span>`;
		};

		const renderStatus = (value, row) => {
			const colorMap = {
				'Active': 'bg-green-100 text-green-800',
				'Maintenance': 'bg-yellow-100 text-yellow-800',
				'In Maintenance': 'bg-yellow-100 text-yellow-800',
				'Retired': 'bg-red-100 text-red-800',
				'Reserved': 'bg-purple-100 text-purple-800'
			};
			const colorClass = colorMap[value] || 'bg-gray-100 text-gray-800';
			return `<span class="px-2 py-1 text-xs font-medium rounded-full ${colorClass}">${value}</span>`;
		};

		const renderOdometer = (value) => {
			return value ? `${value.toLocaleString()} km` : '-';
		};

		columns = [
			{
				key: 'vehicleCode',
				label: $_('vehicles.vehicleCode'),
				sortable: true,
				width: '120px'
			},
			{
				key: 'licensePlate',
				label: $_('vehicles.licensePlate'),
				sortable: true,
				width: '130px',
				render: renderLicensePlate
			},
			{
				key: 'brandName',
				label: $_('vehicles.brand'),
				sortable: true,
				width: '100px'
			},
			{
				key: 'modelName',
				label: $_('vehicles.model'),
				sortable: true,
				width: '120px'
			},
			{
				key: 'year',
				label: $_('vehicles.year'),
				sortable: true,
				width: '80px'
			},
			{
				key: 'fuelTypeName',
				label: $_('vehicles.fuelType'),
				sortable: true,
				width: '100px'
			},
			{
				key: 'vehicleTypeName',
				label: $_('vehicles.type'),
				sortable: true,
				width: '100px'
			},
			{
				key: 'statusName',
				label: $_('common.status'),
				sortable: true,
				width: '100px',
				render: renderStatus
			},
			{
				key: 'odometer',
				label: $_('vehicles.odometer'),
				sortable: true,
				width: '100px',
				render: renderOdometer
			},
			{
				key: 'employeeName',
				label: $_('vehicles.employee'),
				sortable: true,
				width: '150px'
			}
		];
	}

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

	let isLoadingVehicles = false;

	async function loadVehicles() {
		if (isLoadingVehicles) {
			return; // Prevent multiple simultaneous calls
		}

		isLoadingVehicles = true;
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
				brandName: vehicle.brandName || $_('vehicles.unknown'),
				modelName: vehicle.modelName || $_('vehicles.unknown'),
				statusName: vehicle.statusName || $_('vehicles.unknown'),
				fuelType: vehicle.fuelTypeName || $_('vehicles.unknown'),
				vehicleType: vehicle.vehicleTypeName || $_('vehicles.unknown'),
				employeeName: vehicle.employeeName || $_('vehicles.notAssigned')
			}));

			totalItems = response.pagination?.total || response.data.length;
		} catch (error) {
			console.error('Failed to load vehicles:', error);
			vehicles = [];
		} finally {
			loading = false;
			isLoadingVehicles = false;
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
				employeesResponse
			] = await Promise.all([
				api.getBrands(),
				api.getModels(),
				api.getVehicleTypes(),
				api.getVehicleStatuses(),
				api.getFuelTypes(),
				api.getLocations(),
				api.getDepartments(),
				api.getEmployees()
			]);

			brands = brandsResponse.data || [];
			models = modelsResponse.data || [];
			vehicleTypes = typesResponse.data || [];
			vehicleStatuses = statusesResponse.data || [];
			fuelTypes = fuelTypesResponse.data || [];
			locations = locationsResponse.data || [];
			departments = departmentsResponse.data || [];
			employees = employeesResponse.data || [];
		} catch (error) {
			console.error('Failed to load dropdown data:', error);
		}
	}

	function getBrandName(brandId) {
		const brand = brands.find(b => b.id === brandId);
		return brand?.brandName || $_('vehicles.unknown');
	}

	function getModelName(modelId) {
		const model = models.find(m => m.id === modelId);
		return model?.modelName || $_('vehicles.unknown');
	}

	function getStatusName(statusId) {
		const status = vehicleStatuses.find(s => s.id === statusId);
		return status?.statusName || $_('vehicles.unknown');
	}

	function getEmployeeName(employeeId) {
		if (!employeeId) return $_('vehicles.notAssigned');
		const employee = employees.find(e => e.id === employeeId);
		return employee?.fullName || $_('vehicles.unknown');
	}

	function handleSearch(event) {
		searchTerm = event.detail.term;
		currentPage = 1;
		loadVehicles();
	}

	function handlePageChange(event) {
		currentPage = event.detail.page;
		loadVehicles();
	}

	function handleSort(event) {
		sortField = event.detail.field;
		sortDirection = event.detail.direction;
		loadVehicles();
	}

	function handleRowClick(event) {
		const vehicle = event.detail.row;
		goto(`/vehicles/${vehicle.id}`);
	}

	function handleEdit(event) {
		selectedVehicle = event.detail;
		showEditModal = true;
	}

	async function handleDelete(event) {
		const vehicle = event.detail;
		if (confirm($_('vehicles.messages.deleteConfirm', { values: { licensePlate: vehicle.licensePlate } }))) {
			try {
				await api.deleteVehicle(vehicle.id);
				await loadVehicles();
			} catch (error) {
				console.error('Failed to delete vehicle:', error);
				alert($_('vehicles.messages.deleteFailed'));
			}
		}
	}

	function handleAddVehicle() {
		selectedVehicle = null;
		showAddModal = true;
	}

	function handleExport(event) {
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

	function handleFormSuccess(event) {
		const { type, data } = event.detail;
		refreshData();
	}

	function handleFormError(event) {
		const { message } = event.detail;
		alert(message);
	}

	function handleFormCancel() {
		closeModals();
	}
</script>

<svelte:head>
	<title>{$_('vehicles.pageTitle')}</title>
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
							<li class="text-gray-900 font-medium">{$_('vehicles.title')}</li>
						</ol>
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					<a
						href="/vehicles/import"
						class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium rounded-md transition-colors"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
						</svg>
						{$_('vehicles.import') || 'Import'}
					</a>
					<button
						on:click={handleAddVehicle}
						class="btn btn-primary"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
						</svg>
						{$_('vehicles.addVehicle')}
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<DataTable
			data={vehicles}
			{columns}
			{loading}
			{searchTerm}
			{currentPage}
			{pageSize}
			{totalItems}
			{sortField}
			{sortDirection}
			title={$_('vehicles.vehicleFleet')}
			showSearch={true}
			showPagination={true}
			showExport={true}
			on:search={handleSearch}
			on:pagechange={handlePageChange}
			on:sort={handleSort}
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
	title={selectedVehicle ? $_('vehicles.editVehicle') : $_('vehicles.addNewVehicle')}
	size="xl"
	on:close={closeModals}
>
	{#if showAddModal || showEditModal}
		<VehicleForm
			vehicle={selectedVehicle}
			{brands}
			{models}
			{vehicleTypes}
			{vehicleStatuses}
			{fuelTypes}
			{locations}
			{departments}
			{employees}
			on:success={handleFormSuccess}
			on:error={handleFormError}
			on:cancel={handleFormCancel}
		/>
	{/if}
</Modal>