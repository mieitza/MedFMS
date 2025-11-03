<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import Modal from '$lib/components/Modal.svelte';
	import DriverForm from '$lib/components/DriverForm.svelte';
	import DocumentManager from '$lib/components/DocumentManager.svelte';
	import PhotoManager from '$lib/components/PhotoManager.svelte';

	let driver = null;
	let loading = true;
	let error = null;
	let showEditModal = false;

	// Dropdown data for edit form
	let cities = [];
	let departments = [];
	let positions = [];

	$: driverId = $page.params.id;

	onMount(async () => {
		// Check authentication
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/');
			return;
		}

		await loadDriver();
		await loadDropdownData();
	});

	async function loadDriver() {
		loading = true;
		error = null;
		try {
			const response = await api.getDriverById(parseInt(driverId));
			driver = response.data;
		} catch (err) {
			console.error('Failed to load driver:', err);
			error = $_('drivers.messages.saveFailed');
		} finally {
			loading = false;
		}
	}

	async function loadDropdownData() {
		try {
			const [citiesResponse, departmentsResponse] = await Promise.all([
				api.getLocations(),
				api.getDepartments()
			]);

			cities = citiesResponse.data || [];
			departments = departmentsResponse.data || [];
			positions = [];
		} catch (error) {
			console.error('Failed to load dropdown data:', error);
		}
	}

	function handleEdit() {
		showEditModal = true;
	}

	async function handleDelete() {
		if (confirm($_('drivers.messages.deleteConfirm', { values: { name: driver.fullName } }))) {
			try {
				await api.deleteDriver(driver.id);
				goto('/drivers');
			} catch (error) {
				console.error('Failed to delete driver:', error);
				alert($_('drivers.messages.deleteFailed'));
			}
		}
	}

	function handleFormSuccess(event) {
		const { type, data } = event.detail;
		console.log(`Driver ${type} successfully:`, data);
		driver = data;
		showEditModal = false;
	}

	function handleFormError(event) {
		const { message } = event.detail;
		alert(message);
	}

	function handleFormCancel() {
		showEditModal = false;
	}

	function formatDate(dateString) {
		if (!dateString) return $_('vehicles.notRecorded');
		return new Date(dateString).toLocaleDateString();
	}

	function calculateAge(dateOfBirth) {
		if (!dateOfBirth) return $_('vehicles.notRecorded');
		const birthDate = new Date(dateOfBirth);
		const today = new Date();
		const age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			return age - 1;
		}
		return age;
	}

	function getDepartmentName(departmentId) {
		const department = departments.find(d => d.id === departmentId);
		return department ? department.departmentName : $_('vehicles.notAssigned');
	}

	function getCityName(cityId) {
		const city = cities.find(c => c.id === cityId);
		return city ? city.cityName : $_('vehicles.notRecorded');
	}

	function getStatusColor(active) {
		return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
	}

	function getStatusText(active) {
		return active ? $_('common.active') : $_('common.inactive');
	}
</script>

<svelte:head>
	<title>{driver ? `${driver.fullName} - ${$_('drivers.title')}` : $_('drivers.title')} - {$_('common.appName')}</title>
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
							<li><a href="/drivers" class="text-gray-500 hover:text-gray-700">{$_('drivers.title')}</a></li>
							<li class="text-gray-500">/</li>
							<li class="text-gray-900 font-medium">
								{driver ? driver.fullName : $_('common.loading')}
							</li>
						</ol>
					</nav>
				</div>
				{#if driver}
					<div class="flex items-center space-x-4">
						<button
							on:click={handleEdit}
							class="btn btn-secondary"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
							</svg>
							{$_('drivers.editDriver')}
						</button>
						<button
							on:click={handleDelete}
							class="btn bg-red-600 hover:bg-red-700 text-white"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
							</svg>
							{$_('common.delete')}
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
		{:else if driver}
			<!-- Driver Details -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<!-- Driver Header -->
				<div class="bg-gradient-to-br from-primary-50 to-primary-100 px-6 py-8">
					<div class="flex items-center justify-between">
						<div>
							<h1 class="text-3xl font-bold text-gray-900">
								{driver.fullName}
							</h1>
							<p class="text-lg text-gray-600 mt-1">
								{driver.licenseType} {$_('drivers.license')} • {driver.driverCode}
							</p>
							<p class="text-sm text-gray-500 mt-2">
								{$_('drivers.licenseNumber')}: {driver.licenseNumber}
							</p>
						</div>
						<div class="text-right">
							<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {getStatusColor(driver.active)}">
								{getStatusText(driver.active)}
							</span>
						</div>
					</div>
				</div>

				<!-- Driver Information -->
				<div class="px-6 py-6">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<!-- Personal Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
								{$_('drivers.sections.basicInfo')}
							</h3>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('drivers.firstName')}</label>
									<p class="mt-1 text-sm text-gray-900">{driver.firstName || $_('vehicles.notRecorded')}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('drivers.lastName')}</label>
									<p class="mt-1 text-sm text-gray-900">{driver.lastName || $_('vehicles.notRecorded')}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('drivers.idNumber')}</label>
									<p class="mt-1 text-sm text-gray-900">{driver.idNumber || $_('vehicles.notRecorded')}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('drivers.dateOfBirth')}</label>
									<p class="mt-1 text-sm text-gray-900">{formatDate(driver.dateOfBirth)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">Age</label>
									<p class="mt-1 text-sm text-gray-900">{calculateAge(driver.dateOfBirth)} years old</p>
								</div>
							</div>
						</div>

						<!-- License Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
								{$_('drivers.sections.licenseInfo')}
							</h3>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('drivers.licenseNumber')}</label>
									<p class="mt-1 text-sm text-gray-900">{driver.licenseNumber}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('drivers.licenseType')}</label>
									<p class="mt-1 text-sm text-gray-900">{driver.licenseType || $_('vehicles.notRecorded')}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('drivers.licenseExpiryDate')}</label>
									<p class="mt-1 text-sm text-gray-900">{formatDate(driver.licenseExpiryDate)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('drivers.hireDate')}</label>
									<p class="mt-1 text-sm text-gray-900">{formatDate(driver.hireDate)}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('users.department')}</label>
									<p class="mt-1 text-sm text-gray-900">{getDepartmentName(driver.departmentId)}</p>
								</div>
							</div>
						</div>

						<!-- Contact Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
								{$_('drivers.sections.contactInfo')}
							</h3>
							<div class="space-y-3">
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('users.phoneNumber')}</label>
									<p class="mt-1 text-sm text-gray-900">{driver.phoneNumber || $_('vehicles.notRecorded')}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('drivers.mobileNumber')}</label>
									<p class="mt-1 text-sm text-gray-900">{driver.mobileNumber || $_('vehicles.notRecorded')}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('users.email')}</label>
									<p class="mt-1 text-sm text-gray-900">{driver.email || $_('vehicles.notRecorded')}</p>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-500">{$_('drivers.city')}</label>
									<p class="mt-1 text-sm text-gray-900">{getCityName(driver.cityId)}</p>
								</div>
								{#if driver.address}
									<div>
										<label class="block text-sm font-medium text-gray-500">{$_('drivers.address')}</label>
										<p class="mt-1 text-sm text-gray-900">{driver.address}</p>
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
					entityType="driver"
					entityId={driver.id}
					title={$_('vehicles.vehiclePhotos')}
				/>

				<!-- Documents -->
				<DocumentManager
					entityType="driver"
					entityId={driver.id}
					title={$_('vehicles.vehicleDocuments')}
				/>
			</div>
		{:else}
			<div class="text-center py-12">
				<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">{$_('vehicles.vehicleNotFound')}</h3>
				<p class="mt-1 text-sm text-gray-500">{$_('vehicles.vehicleNotFoundDesc')}</p>
				<div class="mt-6">
					<a href="/drivers" class="btn btn-primary">
						{$_('common.back')}
					</a>
				</div>
			</div>
		{/if}
	</main>
</div>

<!-- Edit Driver Modal -->
{#if driver}
	<Modal
		open={showEditModal}
		title={$_('drivers.editDriver')}
		size="xl"
		on:close={handleFormCancel}
	>
		<DriverForm
			{driver}
			{cities}
			{departments}
			{positions}
			on:success={handleFormSuccess}
			on:error={handleFormError}
			on:cancel={handleFormCancel}
		/>
	</Modal>
{/if}