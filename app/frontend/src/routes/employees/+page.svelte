<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DataTable from '$lib/components/DataTable.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import EmployeeForm from '$lib/components/EmployeeForm.svelte';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';

	let employees = [];
	let loading = false;
	let showAddModal = false;
	let showEditModal = false;
	let selectedEmployee = null;
	let searchTerm = '';
	let currentPage = 1;
	let pageSize = 20;
	let totalItems = 0;

	// Dropdown data for forms
	let cities = [];
	let departments = [];
	let positions = [];
	let licenseTypes = [];

	let columns = [];

	// Make columns reactive to locale changes
	$: {
		const renderEmployeeName = (value, row) => {
			return `<span class="font-semibold text-primary-600">${row.fullName}</span>`;
		};

		const renderStatus = (value, row) => {
			const isActive = row.active;
			const colorClass = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
			const statusText = isActive ? $_('common.active') : $_('common.inactive');
			return `<span class="px-2 py-1 text-xs font-medium rounded-full ${colorClass}">${statusText}</span>`;
		};

		const renderContact = (value) => {
			if (!value) return '-';
			return `<div class="text-sm"><div>${value}</div></div>`;
		};

		const renderLicense = (value, row) => {
			if (!row.licenseNumber) return '-';
			return `<div class="text-sm"><div><strong>${row.licenseNumber}</strong></div><div class="text-gray-500">${$_('employees.licenseType')}: ${row.licenseType || 'N/A'}</div></div>`;
		};

		columns = [
			{
				key: 'employeeCode',
				label: $_('employees.employeeCode'),
				sortable: true,
				width: '120px'
			},
			{
				key: 'fullName',
				label: $_('employees.name'),
				sortable: true,
				width: '200px',
				render: renderEmployeeName
			},
			{
				key: 'email',
				label: $_('users.email'),
				sortable: true,
				width: '200px'
			},
			{
				key: 'phoneNumber',
				label: $_('employees.phone'),
				sortable: true,
				width: '150px',
				render: renderContact
			},
			{
				key: 'licenseNumber',
				label: $_('employees.license'),
				sortable: true,
				width: '150px',
				render: renderLicense
			},
			{
				key: 'active',
				label: $_('common.status'),
				sortable: true,
				width: '100px',
				render: renderStatus
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

		await loadEmployees();
		await loadDropdownData();
	});

	async function loadEmployees() {
		loading = true;
		try {
			const response = await api.getEmployees({
				page: currentPage,
				limit: pageSize,
				search: searchTerm
			});

			employees = response.data || [];
			totalItems = response.pagination?.total || response.data.length;
		} catch (error) {
			console.error('Failed to load employees:', error);
			employees = [];
		} finally {
			loading = false;
		}
	}

	async function loadDropdownData() {
		try {
			const [citiesResponse, departmentsResponse, licenseTypesResponse] = await Promise.all([
				api.getLocations(), // Cities are stored as locations in the system API
				api.getDepartments(),
				api.getLicenseTypes()
			]);

			cities = citiesResponse.data || [];
			departments = departmentsResponse.data || [];
			licenseTypes = licenseTypesResponse.data || [];
			positions = []; // Positions will be a simple list for now
		} catch (error) {
			console.error('Failed to load dropdown data:', error);
		}
	}

	function handleSearch(event) {
		searchTerm = event.detail.term;
		currentPage = 1;
		loadEmployees();
	}

	function handlePageChange(event) {
		currentPage = event.detail.page;
		loadEmployees();
	}

	function handleRowClick(event) {
		const employee = event.detail.row;
		goto(`/employees/${employee.id}`);
	}

	function handleEdit(event) {
		selectedEmployee = event.detail;
		showEditModal = true;
	}

	async function handleDelete(event) {
		const employee = event.detail;
		if (confirm($_('employees.messages.deleteConfirm', { values: { name: employee.fullName } }))) {
			try {
				await api.deleteEmployee(employee.id);
				await loadEmployees();
			} catch (error) {
				console.error('Failed to delete employee:', error);
				alert($_('employees.messages.deleteFailed'));
			}
		}
	}

	function handleAddEmployee() {
		selectedEmployee = null;
		showAddModal = true;
	}

	function handleExport(event) {
		const { format, data } = event.detail;
		console.log(`Exporting ${data.length} employees to ${format}`);
		// TODO: Implement export functionality
	}

	function closeModals() {
		showAddModal = false;
		showEditModal = false;
		selectedEmployee = null;
	}

	async function refreshData() {
		await loadEmployees();
		closeModals();
	}

	function handleFormSuccess(event) {
		const { type, data } = event.detail;
		console.log(`Employee ${type} successfully:`, data);
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
	<title>{$_('employees.title')} - {$_('common.appName')}</title>
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
							<li class="text-gray-900 font-medium">{$_('employees.title')}</li>
						</ol>
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					<button
						on:click={handleAddEmployee}
						class="btn btn-primary"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
						</svg>
						{$_('employees.addEmployee')}
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<DataTable
			data={employees}
			{columns}
			{loading}
			{searchTerm}
			{currentPage}
			{pageSize}
			{totalItems}
			title={$_('employees.title')}
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

<!-- Add/Edit Employee Modal -->
<Modal
	open={showAddModal || showEditModal}
	title={selectedEmployee ? $_('employees.editEmployee') : $_('employees.addNewEmployee')}
	size="xl"
	on:close={closeModals}
>
	<EmployeeForm
		employee={selectedEmployee}
		{cities}
		{departments}
		{positions}
		{licenseTypes}
		on:success={handleFormSuccess}
		on:error={handleFormError}
		on:cancel={handleFormCancel}
	/>
</Modal>
