<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DataTable from '$lib/components/DataTable.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import DriverForm from '$lib/components/DriverForm.svelte';
	import { api } from '$lib/api';

	let drivers = [];
	let loading = false;
	let showAddModal = false;
	let showEditModal = false;
	let selectedDriver = null;
	let searchTerm = '';
	let currentPage = 1;
	let pageSize = 20;
	let totalItems = 0;

	// Dropdown data for forms
	let cities = [];
	let departments = [];
	let positions = [];

	function renderDriverName(value, row) {
		return `<span class="font-semibold text-primary-600">${row.fullName}</span>`;
	}

	function renderStatus(value, row) {
		const isActive = row.active;
		const colorClass = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
		const statusText = isActive ? 'Active' : 'Inactive';
		return `<span class="px-2 py-1 text-xs font-medium rounded-full ${colorClass}">${statusText}</span>`;
	}

	function renderContact(value) {
		if (!value) return '-';
		return `<div class="text-sm"><div>${value}</div></div>`;
	}

	function renderLicense(value, row) {
		if (!row.licenseNumber) return '-';
		return `<div class="text-sm"><div><strong>${row.licenseNumber}</strong></div><div class="text-gray-500">Type: ${row.licenseType || 'N/A'}</div></div>`;
	}

	const columns = [
		{
			key: 'driverCode',
			label: 'Driver Code',
			sortable: true,
			width: '120px'
		},
		{
			key: 'fullName',
			label: 'Name',
			sortable: true,
			width: '200px',
			render: renderDriverName
		},
		{
			key: 'email',
			label: 'Email',
			sortable: true,
			width: '200px'
		},
		{
			key: 'phoneNumber',
			label: 'Phone',
			sortable: true,
			width: '150px',
			render: renderContact
		},
		{
			key: 'licenseNumber',
			label: 'License',
			sortable: true,
			width: '150px',
			render: renderLicense
		},
		{
			key: 'active',
			label: 'Status',
			sortable: true,
			width: '100px',
			render: renderStatus
		}
	];

	onMount(async () => {
		// Check authentication
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/');
			return;
		}

		await loadDrivers();
		await loadDropdownData();
	});

	async function loadDrivers() {
		loading = true;
		try {
			const response = await api.getDrivers({
				page: currentPage,
				limit: pageSize,
				search: searchTerm
			});

			drivers = response.data || [];
			totalItems = response.pagination?.total || response.data.length;
		} catch (error) {
			console.error('Failed to load drivers:', error);
			drivers = [];
		} finally {
			loading = false;
		}
	}

	async function loadDropdownData() {
		try {
			const [citiesResponse, departmentsResponse] = await Promise.all([
				api.getLocations(), // Cities are stored as locations in the system API
				api.getDepartments()
			]);

			cities = citiesResponse.data || [];
			departments = departmentsResponse.data || [];
			positions = []; // Positions will be a simple list for now
		} catch (error) {
			console.error('Failed to load dropdown data:', error);
		}
	}

	function handleSearch(event) {
		searchTerm = event.detail.term;
		currentPage = 1;
		loadDrivers();
	}

	function handlePageChange(event) {
		currentPage = event.detail.page;
		loadDrivers();
	}

	function handleRowClick(event) {
		const driver = event.detail.row;
		goto(`/drivers/${driver.id}`);
	}

	function handleEdit(event) {
		selectedDriver = event.detail;
		showEditModal = true;
	}

	async function handleDelete(event) {
		const driver = event.detail;
		if (confirm(`Are you sure you want to delete driver ${driver.fullName}?`)) {
			try {
				await api.deleteDriver(driver.id);
				await loadDrivers();
			} catch (error) {
				console.error('Failed to delete driver:', error);
				alert('Failed to delete driver. Please try again.');
			}
		}
	}

	function handleAddDriver() {
		selectedDriver = null;
		showAddModal = true;
	}

	function handleExport(event) {
		const { format, data } = event.detail;
		console.log(`Exporting ${data.length} drivers to ${format}`);
		// TODO: Implement export functionality
	}

	function closeModals() {
		showAddModal = false;
		showEditModal = false;
		selectedDriver = null;
	}

	async function refreshData() {
		await loadDrivers();
		closeModals();
	}

	function handleFormSuccess(event) {
		const { type, data } = event.detail;
		console.log(`Driver ${type} successfully:`, data);
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
	<title>Driver Management - MedFMS</title>
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
							<li class="text-gray-900 font-medium">Drivers</li>
						</ol>
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					<button
						on:click={handleAddDriver}
						class="btn btn-primary"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
						</svg>
						Add Driver
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<DataTable
			data={drivers}
			{columns}
			{loading}
			{searchTerm}
			{currentPage}
			{pageSize}
			{totalItems}
			title="Driver Management"
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

<!-- Add/Edit Driver Modal -->
<Modal
	open={showAddModal || showEditModal}
	title={selectedDriver ? 'Edit Driver' : 'Add New Driver'}
	size="xl"
	on:close={closeModals}
>
	<DriverForm
		driver={selectedDriver}
		{cities}
		{departments}
		{positions}
		on:success={handleFormSuccess}
		on:error={handleFormError}
		on:cancel={handleFormCancel}
	/>
</Modal>