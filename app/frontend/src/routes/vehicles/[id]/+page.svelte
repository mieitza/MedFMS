<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import Modal from '$lib/components/Modal.svelte';
	import VehicleForm from '$lib/components/VehicleForm.svelte';
	import DocumentManager from '$lib/components/DocumentManager.svelte';
	import PhotoManager from '$lib/components/PhotoManager.svelte';

	let vehicle = null;
	let loading = true;
	let error = null;
	let showEditModal = false;

	// Dropdown data for edit form
	let brands = [];
	let models = [];
	let vehicleTypes = [];
	let vehicleStatuses = [];
	let fuelTypes = [];
	let locations = [];
	let departments = [];
	let drivers = [];

	// Maintenance history data
	let maintenanceHistory = [];
	let maintenanceLoading = false;
	let maintenanceError = null;

	$: vehicleId = $page.params.id;

	onMount(async () => {
		// Check authentication
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/');
			return;
		}

		await loadVehicle();
		await loadDropdownData();
		await loadMaintenanceHistory();
	});

	async function loadVehicle() {
		loading = true;
		error = null;
		try {
			const response = await api.getVehicleById(parseInt(vehicleId));
			vehicle = response.data;
		} catch (err) {
			console.error('Failed to load vehicle:', err);
			error = 'Failed to load vehicle details';
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

	async function loadMaintenanceHistory() {
		maintenanceLoading = true;
		maintenanceError = null;
		try {
			const response = await api.getMaintenanceHistory({
				vehicleId: parseInt(vehicleId),
				limit: 10
			});
			maintenanceHistory = response.data || [];
		} catch (error) {
			console.error('Failed to load maintenance history:', error);
			maintenanceError = 'Failed to load maintenance history';
			maintenanceHistory = [];
		} finally {
			maintenanceLoading = false;
		}
	}

	function handleEdit() {
		showEditModal = true;
	}

	function handleDelete() {
		if (confirm(`Are you sure you want to delete vehicle ${vehicle.licensePlate}?`)) {
			deleteVehicle();
		}
	}

	async function deleteVehicle() {
		try {
			await api.deleteVehicle(vehicle.id);
			goto('/vehicles');
		} catch (error) {
			console.error('Failed to delete vehicle:', error);
			alert('Failed to delete vehicle. Please try again.');
		}
	}

	function handleFormSuccess() {
		showEditModal = false;
		loadVehicle(); // Refresh vehicle data
	}

	function handleFormError(event) {
		const { message } = event.detail;
		alert(message);
	}

	function handleFormCancel() {
		showEditModal = false;
	}

	function getBrandName(brandId) {
		const brand = brands.find(b => b.id === brandId);
		return brand?.brandName || 'Unknown';
	}

	function getModelName(modelId) {
		const model = models.find(m => m.id === modelId);
		return model?.modelName || 'Unknown';
	}

	function getStatusName(statusId) {
		const status = vehicleStatuses.find(s => s.id === statusId);
		return status?.statusName || 'Unknown';
	}

	function getFuelTypeName(fuelTypeId) {
		const fuelType = fuelTypes.find(f => f.id === fuelTypeId);
		return fuelType?.fuelName || 'Unknown';
	}

	function getVehicleTypeName(vehicleTypeId) {
		const vehicleType = vehicleTypes.find(v => v.id === vehicleTypeId);
		return vehicleType?.typeName || 'Unknown';
	}

	function getLocationName(locationId) {
		if (!locationId) return 'Not assigned';
		const location = locations.find(l => l.id === locationId);
		return location?.locationName || 'Unknown';
	}

	function getDepartmentName(departmentId) {
		if (!departmentId) return 'Not assigned';
		const department = departments.find(d => d.id === departmentId);
		return department?.departmentName || 'Unknown';
	}

	function getDriverName(driverId) {
		if (!driverId) return 'Not assigned';
		const driver = drivers.find(d => d.id === driverId);
		return driver?.fullName || 'Unknown';
	}

	function getStatusColor(statusId) {
		const status = vehicleStatuses.find(s => s.id === statusId);
		const statusName = status?.statusName || '';

		const colorMap = {
			'Active': 'bg-green-100 text-green-800',
			'Maintenance': 'bg-yellow-100 text-yellow-800',
			'In Maintenance': 'bg-yellow-100 text-yellow-800',
			'Retired': 'bg-red-100 text-red-800',
			'Reserved': 'bg-purple-100 text-purple-800'
		};
		return colorMap[statusName] || 'bg-gray-100 text-gray-800';
	}
</script>

<svelte:head>
	<title>{vehicle ? `${vehicle.licensePlate} - Vehicle Details` : 'Vehicle Details'} - MedFMS</title>
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
							<li><a href="/vehicles" class="text-gray-500 hover:text-gray-700">Vehicles</a></li>
							<li class="text-gray-500">/</li>
							<li class="text-gray-900 font-medium">
								{vehicle?.licensePlate || 'Vehicle Details'}
							</li>
						</ol>
					</nav>
				</div>
				{#if vehicle}
					<div class="flex items-center space-x-4">
						<button
							on:click={handleEdit}
							class="btn btn-secondary"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
							</svg>
							Edit Vehicle
						</button>
						<button
							on:click={handleDelete}
							class="btn bg-red-600 hover:bg-red-700 text-white"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
							</svg>
							Delete Vehicle
						</button>
					</div>
				{/if}
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if loading}
			<div class="flex items-center justify-center h-64">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-md p-4">
				<div class="flex">
					<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
					</svg>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">Error</h3>
						<p class="mt-1 text-sm text-red-700">{error}</p>
					</div>
				</div>
			</div>
		{:else if vehicle}
			<!-- Vehicle Details -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<!-- Vehicle Header -->
				<div class="bg-gradient-to-br from-primary-50 to-primary-100 px-6 py-8">
					<div class="flex items-center justify-between">
						<div>
							<h1 class="text-3xl font-bold text-gray-900">
								{vehicle.licensePlate}
							</h1>
							<p class="text-lg text-gray-600 mt-1">
								{getBrandName(vehicle.brandId)} {getModelName(vehicle.modelId)} ({vehicle.year})
							</p>
							<p class="text-sm text-gray-500 mt-2">
								Vehicle Code: {vehicle.vehicleCode}
							</p>
						</div>
						<div class="text-right">
							<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {getStatusColor(vehicle.statusId)}">
								{getStatusName(vehicle.statusId)}
							</span>
						</div>
					</div>
				</div>

				<!-- Vehicle Information -->
				<div class="px-6 py-6">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<!-- Basic Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
								Basic Information
							</h3>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-500">Vehicle Type</label>
									<p class="mt-1 text-sm text-gray-900">{getVehicleTypeName(vehicle.vehicleTypeId)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">Fuel Type</label>
									<p class="mt-1 text-sm text-gray-900">{getFuelTypeName(vehicle.fuelTypeId)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">Year</label>
									<p class="mt-1 text-sm text-gray-900">{vehicle.year}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">Odometer</label>
									<p class="mt-1 text-sm text-gray-900">
										{vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : 'Not recorded'}
									</p>
								</div>
							</div>
						</div>

						<!-- Assignment Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
								Assignment
							</h3>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-500">Assigned Driver</label>
									<p class="mt-1 text-sm text-gray-900">{getDriverName(vehicle.driverId)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">Location</label>
									<p class="mt-1 text-sm text-gray-900">{getLocationName(vehicle.locationId)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">Department</label>
									<p class="mt-1 text-sm text-gray-900">{getDepartmentName(vehicle.departmentId)}</p>
								</div>
							</div>
						</div>

						<!-- Additional Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
								Additional Information
							</h3>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-500">Created</label>
									<p class="mt-1 text-sm text-gray-900">
										{new Date(vehicle.createdAt).toLocaleDateString()}
									</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">Last Updated</label>
									<p class="mt-1 text-sm text-gray-900">
										{new Date(vehicle.updatedAt).toLocaleDateString()}
									</p>
								</div>
								{#if vehicle.description}
									<div>
										<label class="block text-sm font-medium text-gray-500">Description</label>
										<p class="mt-1 text-sm text-gray-900">{vehicle.description}</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Document and Photo Management -->
			<div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Photos -->
				<PhotoManager
					entityType="vehicle"
					entityId={vehicle.id}
					title="Vehicle Photos"
				/>

				<!-- Documents -->
				<DocumentManager
					entityType="vehicle"
					entityId={vehicle.id}
					title="Vehicle Documents"
				/>
			</div>

			<!-- Maintenance History -->
			<div class="mt-8">
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div class="flex justify-between items-center mb-4">
						<h3 class="text-lg font-semibold text-gray-900">Maintenance History</h3>
						<a href="/maintenance/work-orders?vehicleId={vehicle.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
							View All
						</a>
					</div>

					{#if maintenanceLoading}
						<div class="text-center py-8">
							<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
							<p class="mt-2 text-sm text-gray-500">Loading maintenance history...</p>
						</div>
					{:else if maintenanceError}
						<div class="text-center py-8 text-red-500">
							<svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							<p class="mt-2">{maintenanceError}</p>
						</div>
					{:else if maintenanceHistory.length === 0}
						<div class="text-center py-8 text-gray-500">
							<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
							</svg>
							<p class="mt-2">No maintenance history found for this vehicle</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each maintenanceHistory as record}
								<div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
									<div class="flex justify-between items-start">
										<div class="flex-1">
											<div class="flex items-center space-x-2 mb-2">
												<h4 class="font-medium text-gray-900">
													{record.history?.workPerformed || record.maintenanceType?.typeName || 'Maintenance Work'}
												</h4>
												<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
													Completed
												</span>
											</div>
											<p class="text-sm text-gray-600 mb-2">
												{record.maintenanceType?.typeName || 'General Maintenance'}
											</p>
											<div class="flex items-center space-x-4 text-xs text-gray-500">
												{#if record.history?.workOrderId}
													<span>WO ID: {record.history.workOrderId}</span>
												{/if}
												{#if record.history?.maintenanceDate}
													<span>Date: {new Date(record.history.maintenanceDate).toLocaleDateString()}</span>
												{/if}
												{#if record.history?.totalCost}
													<span>Cost: ${parseFloat(record.history.totalCost).toFixed(2)}</span>
												{/if}
												{#if record.history?.odometerReading}
													<span>Odometer: {record.history.odometerReading} km</span>
												{/if}
											</div>
										</div>
										<div class="ml-4">
											{#if record.history?.workOrderId}
												<a
													href="/maintenance/work-orders/{record.history.workOrderId}"
													class="text-blue-600 hover:text-blue-800 text-sm font-medium"
												>
													View Details
												</a>
											{:else}
												<span class="text-gray-400 text-sm">History Record</span>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="text-center py-12">
				<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">Vehicle not found</h3>
				<p class="mt-1 text-sm text-gray-500">The requested vehicle could not be found.</p>
				<div class="mt-6">
					<a href="/vehicles" class="btn btn-primary">
						Back to Vehicles
					</a>
				</div>
			</div>
		{/if}
	</main>
</div>

<!-- Edit Vehicle Modal -->
{#if vehicle}
	<Modal
		open={showEditModal}
		title="Edit Vehicle"
		size="xl"
		on:close={handleFormCancel}
	>
		{#if showEditModal}
			<VehicleForm
				{vehicle}
				{brands}
				{models}
				{vehicleTypes}
				{vehicleStatuses}
				{fuelTypes}
				{locations}
				{departments}
				{drivers}
				on:success={handleFormSuccess}
				on:error={handleFormError}
				on:cancel={handleFormCancel}
			/>
		{/if}
	</Modal>
{/if}