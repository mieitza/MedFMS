<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import Modal from '$lib/components/Modal.svelte';
	import VehicleForm from '$lib/components/VehicleForm.svelte';
	import DocumentManager from '$lib/components/DocumentManager.svelte';
	import PhotoManager from '$lib/components/PhotoManager.svelte';
	import VehicleInventoryManager from '$lib/components/VehicleInventoryManager.svelte';

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
	let employees = [];
	let dropdownDataLoaded = false;

	// Maintenance history data
	let maintenanceHistory = [];
	let maintenanceLoading = false;
	let maintenanceError = null;

	$: vehicleId = $page.params.id;
	$: dataReady = vehicle && dropdownDataLoaded;

	onMount(async () => {
		// Check authentication
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/');
			return;
		}

		await Promise.all([
			loadVehicle(),
			loadDropdownData()
		]);
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
			error = $_('vehicles.messages.loadFailed');
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
			dropdownDataLoaded = true;
		} catch (error) {
			console.error('Failed to load dropdown data:', error);
			dropdownDataLoaded = true; // Set to true even on error to unblock UI
		}
	}

	async function loadMaintenanceHistory() {
		maintenanceLoading = true;
		maintenanceError = null;
		try {
			// Load work orders instead of history, since history is only created after completion
			const response = await api.getMaintenanceWorkOrders({
				vehicleId: parseInt(vehicleId),
				limit: 10,
				status: 'completed' // Only show completed work orders
			});

			// Transform work orders to match the expected structure
			maintenanceHistory = (response.data || []).map(wo => ({
				history: {
					workOrderId: wo.id,
					maintenanceDate: wo.completedDate || wo.scheduledDate,
					totalCost: wo.estimatedCost,
					odometerReading: wo.odometerReading,
					workPerformed: wo.description
				},
				maintenanceType: wo.maintenanceType,
				vehicle: wo.vehicle
			}));
		} catch (error) {
			console.error('Failed to load maintenance history:', error);
			maintenanceError = $_('vehicles.messages.loadFailed');
			maintenanceHistory = [];
		} finally {
			maintenanceLoading = false;
		}
	}

	function handleEdit() {
		showEditModal = true;
	}

	function handleDelete() {
		if (confirm($_('vehicles.messages.deleteConfirm', { values: { licensePlate: vehicle.licensePlate } }))) {
			deleteVehicle();
		}
	}

	async function deleteVehicle() {
		try {
			await api.deleteVehicle(vehicle.id);
			goto('/vehicles');
		} catch (error) {
			console.error('Failed to delete vehicle:', error);
			alert($_('vehicles.messages.deleteFailed'));
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

	function getFuelTypeName(fuelTypeId) {
		const fuelType = fuelTypes.find(f => f.id === fuelTypeId);
		return fuelType?.fuelName || $_('vehicles.unknown');
	}

	function getVehicleTypeName(vehicleTypeId) {
		const vehicleType = vehicleTypes.find(v => v.id === vehicleTypeId);
		return vehicleType?.typeName || $_('vehicles.unknown');
	}

	function getLocationName(locationId) {
		if (!locationId) return $_('vehicles.notAssigned');
		const location = locations.find(l => l.id === locationId);
		return location?.locationName || $_('vehicles.unknown');
	}

	function getDepartmentName(departmentId) {
		if (!departmentId) return $_('vehicles.notAssigned');
		const department = departments.find(d => d.id === departmentId);
		return department?.departmentName || $_('vehicles.unknown');
	}

	function getEmployeeName(employeeId) {
		if (!employeeId) return $_('vehicles.notAssigned');
		const employee = employees.find(e => e.id === employeeId);
		return employee?.fullName || $_('vehicles.unknown');
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

	function formatAnmdmDate(date) {
		if (!date) return $_('vehicles.notRecorded');
		return new Date(date).toLocaleDateString();
	}

	function getAnmdmExpiryStatus() {
		if (!vehicle?.anmdmExpiryDate) return null;

		const expiryDate = new Date(vehicle.anmdmExpiryDate);
		const now = new Date();
		const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

		if (daysUntilExpiry < 0) {
			return { status: 'expired', color: 'bg-red-100 text-red-800 border-red-200', message: $_('vehicles.anmdmExpired') };
		} else if (daysUntilExpiry <= 30) {
			return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', message: $_('vehicles.anmdmExpiringSoon') };
		} else {
			return { status: 'valid', color: 'bg-green-100 text-green-800 border-green-200', message: $_('vehicles.anmdmValid') };
		}
	}

	function getDocumentExpiryStatus(expiryDate, docType) {
		if (!expiryDate) return null;

		const expiry = new Date(expiryDate);
		const now = new Date();
		const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

		if (daysUntilExpiry < 0) {
			return { status: 'expired', color: 'bg-red-100 text-red-800 border-red-200', message: $_(`vehicles.${docType}Expired`), days: daysUntilExpiry };
		} else if (daysUntilExpiry <= 30) {
			return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', message: $_(`vehicles.${docType}ExpiringSoon`), days: daysUntilExpiry };
		} else {
			return { status: 'valid', color: 'bg-green-100 text-green-800 border-green-200', message: $_(`vehicles.${docType}Valid`), days: daysUntilExpiry };
		}
	}

	function formatExpiryDate(date) {
		if (!date) return $_('vehicles.notRecorded');
		return new Date(date).toLocaleDateString();
	}

	async function downloadAnmdmDocument() {
		if (!vehicle?.id) return;

		try {
			const blob = await api.downloadAnmdmDocument(vehicle.id);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `ANMDM_${vehicle.licensePlate || vehicle.id}.pdf`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (err) {
			console.error('Failed to download ANMDM document:', err);
			alert($_('vehicles.anmdmDocumentDownloadFailed'));
		}
	}
</script>

<svelte:head>
	<title>{vehicle ? `${vehicle.licensePlate} - ${$_('vehicles.vehicleDetails')}` : $_('vehicles.vehicleDetails')} - {$_('common.appName')}</title>
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
							<li><a href="/vehicles" class="text-gray-500 hover:text-gray-700">{$_('vehicles.title')}</a></li>
							<li class="text-gray-500">/</li>
							<li class="text-gray-900 font-medium">
								{vehicle?.licensePlate || $_('vehicles.vehicleDetails')}
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
							{$_('vehicles.editVehicle')}
						</button>
						<button
							on:click={handleDelete}
							class="btn bg-red-600 hover:bg-red-700 text-white"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
							</svg>
							{$_('vehicles.deleteVehicle')}
						</button>
					</div>
				{/if}
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if loading || !dropdownDataLoaded}
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
		{:else if dataReady}
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
								{$_('vehicles.vehicleCode')}: {vehicle.vehicleCode}
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
								{$_('vehicles.sections.basicInfo')}
							</h3>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('vehicles.vehicleType')}</label>
									<p class="mt-1 text-sm text-gray-900">{getVehicleTypeName(vehicle.vehicleTypeId)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('vehicles.fuelType')}</label>
									<p class="mt-1 text-sm text-gray-900">{getFuelTypeName(vehicle.fuelTypeId)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('vehicles.year')}</label>
									<p class="mt-1 text-sm text-gray-900">{vehicle.year}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('vehicles.odometer')}</label>
									<p class="mt-1 text-sm text-gray-900">
										{vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : $_('vehicles.notRecorded')}
									</p>
								</div>
							</div>
						</div>

						<!-- Assignment Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
								{$_('vehicles.sections.assignmentInfo')}
							</h3>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('vehicles.assignedEmployee')}</label>
									<p class="mt-1 text-sm text-gray-900">{getEmployeeName(vehicle.employeeId)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('vehicles.location')}</label>
									<p class="mt-1 text-sm text-gray-900">{getLocationName(vehicle.locationId)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('users.department')}</label>
									<p class="mt-1 text-sm text-gray-900">{getDepartmentName(vehicle.departmentId)}</p>
								</div>
							</div>
						</div>

						<!-- Additional Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
								{$_('vehicles.sections.purchaseInfo')}
							</h3>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('vehicles.created')}</label>
									<p class="mt-1 text-sm text-gray-900">
										{new Date(vehicle.createdAt).toLocaleDateString()}
									</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('vehicles.lastUpdated')}</label>
									<p class="mt-1 text-sm text-gray-900">
										{new Date(vehicle.updatedAt).toLocaleDateString()}
									</p>
								</div>
								{#if vehicle.description}
									<div>
										<label class="block text-sm font-medium text-gray-500">{$_('vehicles.description')}</label>
										<p class="mt-1 text-sm text-gray-900">{vehicle.description}</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- ANMDM Authorization Section -->
			<div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<div class="flex justify-between items-start mb-4">
					<h3 class="text-lg font-semibold text-gray-900">{$_('vehicles.sections.anmdmAuth')}</h3>
					{#if getAnmdmExpiryStatus()}
						<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border {getAnmdmExpiryStatus().color}">
							{getAnmdmExpiryStatus().message}
						</span>
					{/if}
				</div>

				{#if vehicle.anmdmAuthNumber || vehicle.anmdmAuthType || vehicle.anmdmIssueDate || vehicle.anmdmExpiryDate}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#if vehicle.anmdmAuthNumber}
							<div>
								<label class="block text-sm font-medium text-gray-500">{$_('vehicles.anmdmAuthNumber')}</label>
								<p class="mt-1 text-sm text-gray-900 font-medium">{vehicle.anmdmAuthNumber}</p>
							</div>
						{/if}

						{#if vehicle.anmdmAuthType}
							<div>
								<label class="block text-sm font-medium text-gray-500">{$_('vehicles.anmdmAuthType')}</label>
								<p class="mt-1 text-sm text-gray-900">{vehicle.anmdmAuthType}</p>
							</div>
						{/if}

						{#if vehicle.anmdmIssueDate}
							<div>
								<label class="block text-sm font-medium text-gray-500">{$_('vehicles.anmdmIssueDate')}</label>
								<p class="mt-1 text-sm text-gray-900">{formatAnmdmDate(vehicle.anmdmIssueDate)}</p>
							</div>
						{/if}

						{#if vehicle.anmdmExpiryDate}
							<div>
								<label class="block text-sm font-medium text-gray-500">{$_('vehicles.anmdmExpiryDate')}</label>
								<p class="mt-1 text-sm text-gray-900">{formatAnmdmDate(vehicle.anmdmExpiryDate)}</p>
							</div>
						{/if}

						{#if vehicle.anmdmIssuingAuthority}
							<div>
								<label class="block text-sm font-medium text-gray-500">{$_('vehicles.anmdmIssuingAuthority')}</label>
								<p class="mt-1 text-sm text-gray-900">{vehicle.anmdmIssuingAuthority}</p>
							</div>
						{/if}

						{#if vehicle.anmdmNotes}
							<div class="md:col-span-2 lg:col-span-3">
								<label class="block text-sm font-medium text-gray-500">{$_('vehicles.anmdmNotes')}</label>
								<p class="mt-1 text-sm text-gray-900">{vehicle.anmdmNotes}</p>
							</div>
						{/if}

						<!-- ANMDM Document -->
						{#if vehicle.anmdmDocumentPath}
							<div class="md:col-span-2 lg:col-span-3 pt-4 border-t border-gray-200">
								<label class="block text-sm font-medium text-gray-500 mb-2">{$_('vehicles.anmdmDocument')}</label>
								<button
									on:click={downloadAnmdmDocument}
									class="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-md text-red-700 hover:bg-red-100 transition-colors"
								>
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
									</svg>
									<span>{$_('vehicles.downloadAnmdmDocument')}</span>
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<div class="text-center py-8 text-gray-500">
						<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
						</svg>
						<p class="mt-2 text-sm">{$_('vehicles.notRecorded')}</p>
					</div>
				{/if}
			</div>

			<!-- Document Expiry Tracking Section (Rovinieta, Asigurare, ITP) -->
			<div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">{$_('vehicles.sections.documentExpiry')}</h3>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<!-- Rovinieta -->
					<div class="p-4 rounded-lg border {getDocumentExpiryStatus(vehicle.rovinietaExpiryDate, 'rovinieta')?.color || 'border-gray-200 bg-gray-50'}">
						<div class="flex items-center justify-between mb-2">
							<h4 class="font-medium text-gray-900">{$_('vehicles.rovinieta')}</h4>
							{#if getDocumentExpiryStatus(vehicle.rovinietaExpiryDate, 'rovinieta')}
								<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getDocumentExpiryStatus(vehicle.rovinietaExpiryDate, 'rovinieta').color}">
									{getDocumentExpiryStatus(vehicle.rovinietaExpiryDate, 'rovinieta').message}
								</span>
							{/if}
						</div>
						<div class="text-sm">
							<span class="text-gray-500">{$_('vehicles.expiryDate')}:</span>
							<span class="ml-1 font-medium">{formatExpiryDate(vehicle.rovinietaExpiryDate)}</span>
						</div>
						{#if getDocumentExpiryStatus(vehicle.rovinietaExpiryDate, 'rovinieta')?.days !== undefined}
							<div class="text-xs mt-1 text-gray-500">
								{#if getDocumentExpiryStatus(vehicle.rovinietaExpiryDate, 'rovinieta').days < 0}
									{$_('vehicles.expiredDaysAgo', { values: { days: Math.abs(getDocumentExpiryStatus(vehicle.rovinietaExpiryDate, 'rovinieta').days) } })}
								{:else}
									{$_('vehicles.expiresInDays', { values: { days: getDocumentExpiryStatus(vehicle.rovinietaExpiryDate, 'rovinieta').days } })}
								{/if}
							</div>
						{/if}
					</div>

					<!-- Asigurare (Insurance) -->
					<div class="p-4 rounded-lg border {getDocumentExpiryStatus(vehicle.asigurareExpiryDate, 'asigurare')?.color || 'border-gray-200 bg-gray-50'}">
						<div class="flex items-center justify-between mb-2">
							<h4 class="font-medium text-gray-900">{$_('vehicles.asigurare')}</h4>
							{#if getDocumentExpiryStatus(vehicle.asigurareExpiryDate, 'asigurare')}
								<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getDocumentExpiryStatus(vehicle.asigurareExpiryDate, 'asigurare').color}">
									{getDocumentExpiryStatus(vehicle.asigurareExpiryDate, 'asigurare').message}
								</span>
							{/if}
						</div>
						<div class="text-sm">
							<span class="text-gray-500">{$_('vehicles.expiryDate')}:</span>
							<span class="ml-1 font-medium">{formatExpiryDate(vehicle.asigurareExpiryDate)}</span>
						</div>
						{#if getDocumentExpiryStatus(vehicle.asigurareExpiryDate, 'asigurare')?.days !== undefined}
							<div class="text-xs mt-1 text-gray-500">
								{#if getDocumentExpiryStatus(vehicle.asigurareExpiryDate, 'asigurare').days < 0}
									{$_('vehicles.expiredDaysAgo', { values: { days: Math.abs(getDocumentExpiryStatus(vehicle.asigurareExpiryDate, 'asigurare').days) } })}
								{:else}
									{$_('vehicles.expiresInDays', { values: { days: getDocumentExpiryStatus(vehicle.asigurareExpiryDate, 'asigurare').days } })}
								{/if}
							</div>
						{/if}
					</div>

					<!-- ITP (Periodic Technical Inspection) -->
					<div class="p-4 rounded-lg border {getDocumentExpiryStatus(vehicle.itpExpiryDate, 'itp')?.color || 'border-gray-200 bg-gray-50'}">
						<div class="flex items-center justify-between mb-2">
							<h4 class="font-medium text-gray-900">{$_('vehicles.itp')}</h4>
							{#if getDocumentExpiryStatus(vehicle.itpExpiryDate, 'itp')}
								<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getDocumentExpiryStatus(vehicle.itpExpiryDate, 'itp').color}">
									{getDocumentExpiryStatus(vehicle.itpExpiryDate, 'itp').message}
								</span>
							{/if}
						</div>
						<div class="text-sm">
							<span class="text-gray-500">{$_('vehicles.expiryDate')}:</span>
							<span class="ml-1 font-medium">{formatExpiryDate(vehicle.itpExpiryDate)}</span>
						</div>
						{#if getDocumentExpiryStatus(vehicle.itpExpiryDate, 'itp')?.days !== undefined}
							<div class="text-xs mt-1 text-gray-500">
								{#if getDocumentExpiryStatus(vehicle.itpExpiryDate, 'itp').days < 0}
									{$_('vehicles.expiredDaysAgo', { values: { days: Math.abs(getDocumentExpiryStatus(vehicle.itpExpiryDate, 'itp').days) } })}
								{:else}
									{$_('vehicles.expiresInDays', { values: { days: getDocumentExpiryStatus(vehicle.itpExpiryDate, 'itp').days } })}
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Vehicle Inventory -->
			<div class="mt-8">
				<VehicleInventoryManager vehicleId={vehicle.id} />
			</div>

			<!-- Document and Photo Management -->
			<div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Photos -->
				<PhotoManager
					entityType="vehicle"
					entityId={vehicle.id}
					title={$_('vehicles.vehiclePhotos')}
				/>

				<!-- Documents -->
				<DocumentManager
					entityType="vehicle"
					entityId={vehicle.id}
					title={$_('vehicles.vehicleDocuments')}
				/>
			</div>

			<!-- Maintenance History -->
			<div class="mt-8">
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div class="flex justify-between items-center mb-4">
						<h3 class="text-lg font-semibold text-gray-900">{$_('vehicles.maintenanceHistory')}</h3>
						<a href="/maintenance/work-orders?vehicleId={vehicle.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
							{$_('vehicles.viewAll')}
						</a>
					</div>

					{#if maintenanceLoading}
						<div class="text-center py-8">
							<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
							<p class="mt-2 text-sm text-gray-500">{$_('vehicles.loadingMaintenanceHistory')}</p>
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
							<p class="mt-2">{$_('vehicles.noMaintenanceHistory')}</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each maintenanceHistory as record}
								<div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
									<div class="flex justify-between items-start">
										<div class="flex-1">
											<div class="flex items-center space-x-2 mb-2">
												<h4 class="font-medium text-gray-900">
													{record.history?.workPerformed || record.maintenanceType?.typeName || $_('vehicles.maintenanceWork')}
												</h4>
												<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
													{$_('vehicles.completed')}
												</span>
											</div>
											<p class="text-sm text-gray-600 mb-2">
												{record.maintenanceType?.typeName || $_('vehicles.generalMaintenance')}
											</p>
											<div class="flex items-center space-x-4 text-xs text-gray-500">
												{#if record.history?.workOrderId}
													<span>WO ID: {record.history.workOrderId}</span>
												{/if}
												{#if record.history?.maintenanceDate}
													<span>{$_('vehicles.date')}: {new Date(record.history.maintenanceDate).toLocaleDateString()}</span>
												{/if}
												{#if record.history?.totalCost}
													<span>{$_('vehicles.cost')}: {parseFloat(record.history.totalCost).toFixed(2)} RON</span>
												{/if}
												{#if record.history?.odometerReading}
													<span>{$_('vehicles.odometer')}: {record.history.odometerReading} km</span>
												{/if}
											</div>
										</div>
										<div class="ml-4">
											{#if record.history?.workOrderId}
												<a
													href="/maintenance/work-orders/{record.history.workOrderId}"
													class="text-blue-600 hover:text-blue-800 text-sm font-medium"
												>
													{$_('vehicles.viewDetails')}
												</a>
											{:else}
												<span class="text-gray-400 text-sm">{$_('vehicles.historyRecord')}</span>
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
				<h3 class="mt-2 text-sm font-medium text-gray-900">{$_('vehicles.vehicleNotFound')}</h3>
				<p class="mt-1 text-sm text-gray-500">{$_('vehicles.vehicleNotFoundDesc')}</p>
				<div class="mt-6">
					<a href="/vehicles" class="btn btn-primary">
						{$_('vehicles.backToVehicles')}
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
		title={$_('vehicles.editVehicle')}
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
				{employees}
				on:success={handleFormSuccess}
				on:error={handleFormError}
				on:cancel={handleFormCancel}
			/>
		{/if}
	</Modal>
{/if}