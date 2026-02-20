<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import DataTable from '$lib/components/DataTable.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SearchableSelect from '$lib/components/SearchableSelect.svelte';

	let fuelTransactions = [];
	let loading = false;
	let showAddModal = false;
	let currentPage = 1;
	let pageSize = 20;
	let totalItems = 0;
	let searchTerm = '';

	// Filter options
	let selectedVehicle = '';
	let selectedEmployee = '';
	let selectedStation = '';
	let selectedType = '';
	let startDate = '';
	let endDate = '';

	// Dropdown data
	let vehicles = [];
	let employees = [];
	let stations = [];
	let fuelTypes = [];

	// Form data for new transaction
	let formData = {
		transactionType: 'purchase',
		vehicleId: '',
		employeeId: '',
		fuelTypeId: '',
		fuelStationId: '',
		transactionDate: new Date().toISOString().slice(0, 16),
		quantity: '',
		pricePerLiter: '',
		totalAmount: '',
		currency: 'RON',
		odometerReading: '',
		paymentMethod: 'cash',
		receiptNumber: '',
		notes: ''
	};

	function renderTransactionType(value) {
		const types = {
			'purchase': `<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">${$_('fuel.types.purchase')}</span>`,
			'consumption': `<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">${$_('fuel.types.consumption')}</span>`
		};
		return types[value] || value;
	}

	function renderAmount(value, row) {
		if (!value) return '-';
		return `${value.toFixed(2)} RON`;
	}

	function renderQuantity(value) {
		if (!value) return '-';
		return `${value.toFixed(2)} L`;
	}

	function renderVehicle(value, row) {
		if (!row.vehicle) return '-';
		return `<div class="text-sm"><div class="font-medium">${row.vehicle.vehicleCode}</div><div class="text-gray-500">${row.vehicle.licensePlate}</div></div>`;
	}

	function renderEmployee(value, row) {
		if (!row.employee) return '-';
		return `<div class="text-sm"><div class="font-medium">${row.employee.fullName}</div><div class="text-gray-500">${row.employee.employeeCode}</div></div>`;
	}

	function renderDate(value) {
		if (!value) return '-';
		return new Date(value).toLocaleDateString();
	}

	function renderApproval(value, row) {
		const approved = row.approved;
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		const canApprove = user.role === 'admin' || user.role === 'manager';

		if (approved) {
			if (canApprove) {
				return `
					<div class="flex items-center gap-2">
						<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">${$_('fuel.approved')}</span>
						<button onclick="rejectTransaction(${row.id})" class="text-xs text-red-600 hover:text-red-800 underline">${$_('fuel.revoke')}</button>
					</div>
				`;
			}
			return `<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">${$_('fuel.approved')}</span>`;
		} else {
			if (canApprove) {
				return `
					<div class="flex items-center gap-2">
						<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">${$_('fuel.pending')}</span>
						<button onclick="approveTransaction(${row.id})" class="text-xs text-green-600 hover:text-green-800 underline">${$_('fuel.approve')}</button>
					</div>
				`;
			}
			return `<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">${$_('fuel.pending')}</span>`;
		}
	}

	const columns = [
		{
			key: 'id',
			label: 'ID',
			sortable: true,
			width: '80px'
		},
		{
			key: 'transactionType',
			label: $_('fuel.type'),
			sortable: true,
			width: '100px',
			render: renderTransactionType
		},
		{
			key: 'transactionDate',
			label: $_('fuel.date'),
			sortable: true,
			width: '100px',
			render: renderDate
		},
		{
			key: 'vehicle',
			label: $_('fuel.vehicle'),
			sortable: true,
			width: '150px',
			render: renderVehicle
		},
		{
			key: 'employee',
			label: $_('fuel.employee'),
			sortable: true,
			width: '150px',
			render: renderEmployee
		},
		{
			key: 'quantity',
			label: $_('fuel.quantity'),
			sortable: true,
			width: '100px',
			render: renderQuantity
		},
		{
			key: 'totalAmount',
			label: $_('fuel.amount'),
			sortable: true,
			width: '100px',
			render: renderAmount
		},
		{
			key: 'approved',
			label: $_('common.status'),
			sortable: true,
			width: '100px',
			render: renderApproval
		}
	];

	onMount(async () => {
		// Check authentication
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/');
			return;
		}

		await loadTransactions();
		await loadDropdownData();
		await loadTotalPendingCount();
	});

	async function loadTransactions() {
		loading = true;
		try {
			const filters = {
				page: currentPage,
				limit: pageSize
			};

			if (selectedVehicle) filters.vehicleId = selectedVehicle;
			if (selectedEmployee) filters.employeeId = selectedEmployee;
			if (selectedStation) filters.stationId = selectedStation;
			if (selectedType) filters.transactionType = selectedType;
			if (startDate) filters.startDate = startDate;
			if (endDate) filters.endDate = endDate;

			const response = await api.getFuelTransactions(filters);
			fuelTransactions = response.data || [];
			totalItems = response.pagination?.total || 0;
		} catch (error) {
			console.error('Failed to load fuel transactions:', error);
			fuelTransactions = [];
		} finally {
			loading = false;
		}
	}

	async function loadDropdownData() {
		try {
			const [vehiclesResponse, employeesResponse, stationsResponse, typesResponse] = await Promise.all([
				api.getVehicles(),
				api.getEmployees(),
				api.getFuelStations(),
				api.getFuelTypes()
			]);

			vehicles = vehiclesResponse.data || [];
			employees = employeesResponse.data || [];
			stations = stationsResponse.data || [];
			fuelTypes = typesResponse.data || [];
		} catch (error) {
			console.error('Failed to load dropdown data:', error);
		}
	}

	function handleSearch() {
		currentPage = 1;
		loadTransactions();
	}

	function handlePageChange(event) {
		currentPage = event.detail.page;
		loadTransactions();
	}

	function handleRowClick(event) {
		const transaction = event.detail.row;
		// TODO: Navigate to transaction details page
		console.log('Transaction clicked:', transaction);
	}

	async function approveTransaction(id) {
		// Find the transaction to check if it's already approved
		const transaction = fuelTransactions.find(t => t.id === id);
		if (transaction?.approved) {
			alert('This transaction is already approved. Please refresh the page to see the latest status.');
			await loadTransactions();
			await loadTotalPendingCount();
			return;
		}

		if (!confirm($_('fuel.messages.approveConfirm'))) return;

		try {
			const response = await api.approveFuelTransaction(id);
			if (response.success) {
				alert(response.message || $_('fuel.messages.approveSuccess'));
				await loadTransactions();
				await loadTotalPendingCount();
			}
		} catch (error) {
			console.error('Error approving transaction:', error);
			// Show the actual error message from the backend
			const errorMessage = error.message || $_('fuel.messages.approveFailed');
			if (errorMessage.includes('already approved')) {
				alert('This transaction is already approved. Refreshing the list...');
				await loadTransactions();
				await loadTotalPendingCount();
			} else {
				alert(errorMessage);
			}
		}
	}

	async function rejectTransaction(id) {
		if (!confirm($_('fuel.messages.revokeConfirm'))) return;

		try {
			const response = await api.rejectFuelTransaction(id);
			if (response.success) {
				alert(response.message || $_('fuel.messages.revokeSuccess'));
				await loadTransactions();
				await loadTotalPendingCount();
			}
		} catch (error) {
			console.error('Error rejecting transaction:', error);
			alert($_('fuel.messages.revokeFailed'));
		}
	}

	async function approveAllPending() {
		// Fetch ALL pending transactions from the database
		try {
			const response = await api.getFuelTransactions({
				limit: 10000, // Large limit to get all transactions
				approved: false // Filter for only unapproved transactions
			});

			const pendingTransactions = (response.data || []).filter(t => !t.approved);

			if (pendingTransactions.length === 0) {
				alert($_('fuel.messages.noPendingTransactions'));
				return;
			}

			const confirmMessage = $_('fuel.messages.approveAllConfirm').replace('{count}', pendingTransactions.length);
			if (!confirm(confirmMessage)) return;

			let successCount = 0;
			let failCount = 0;

			// Show progress
			alert($_('fuel.messages.approvingInProgress').replace('{count}', pendingTransactions.length));

			for (const transaction of pendingTransactions) {
				try {
					const response = await api.approveFuelTransaction(transaction.id);
					if (response.success) {
						successCount++;
					} else {
						failCount++;
					}
				} catch (error) {
					console.error(`Error approving transaction ${transaction.id}:`, error);
					failCount++;
				}
			}

			const resultMessage = $_('fuel.messages.approveAllResult')
				.replace('{success}', successCount)
				.replace('{fail}', failCount);
			alert(resultMessage);

			await loadTransactions();
			await loadTotalPendingCount();
		} catch (error) {
			console.error('Error fetching pending transactions:', error);
			alert($_('fuel.messages.loadFailed'));
		}
	}

	// Computed properties
	$: user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
	$: canApprove = user.role === 'admin' || user.role === 'manager';

	// Track total pending count across all pages
	let totalPendingCount = 0;

	// Load total pending count when page loads
	async function loadTotalPendingCount() {
		try {
			const response = await api.getFuelTransactions({
				limit: 1,
				approved: false
			});
			totalPendingCount = response.pagination?.total || 0;
		} catch (error) {
			console.error('Failed to load pending count:', error);
			totalPendingCount = 0;
		}
	}

	$: pendingCount = totalPendingCount;

	// Expose functions to window for onclick handlers
	if (typeof window !== 'undefined') {
		window.approveTransaction = approveTransaction;
		window.rejectTransaction = rejectTransaction;
	}

	function handleAddTransaction() {
		showAddModal = true;
	}

	async function handleSubmit() {
		try {
			// Convert string values to numbers where needed
			const submitData = {
				...formData,
				vehicleId: parseInt(formData.vehicleId),
				employeeId: formData.employeeId ? parseInt(formData.employeeId) : undefined,
				fuelTypeId: parseInt(formData.fuelTypeId),
				locationId: formData.fuelStationId ? parseInt(formData.fuelStationId) : undefined,
				quantity: parseFloat(formData.quantity),
				pricePerUnit: formData.pricePerLiter ? parseFloat(formData.pricePerLiter) : undefined,
				totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined,
				odometer: formData.odometerReading ? parseInt(formData.odometerReading) : undefined,
				transactionDate: new Date(formData.transactionDate)
			};

			await api.createFuelTransaction(submitData);
			showAddModal = false;
			resetForm();
			await loadTransactions();
		} catch (error) {
			console.error('Failed to create fuel transaction:', error);
			alert($_('fuel.messages.createFailed'));
		}
	}

	function resetForm() {
		formData = {
			transactionType: 'purchase',
			vehicleId: '',
			employeeId: '',
			fuelTypeId: '',
			fuelStationId: '',
			transactionDate: new Date().toISOString().slice(0, 16),
			quantity: '',
			pricePerLiter: '',
			totalAmount: '',
			currency: 'RON',
			odometerReading: '',
			paymentMethod: 'cash',
			receiptNumber: '',
			notes: ''
		};
	}

	function handleCancel() {
		showAddModal = false;
		resetForm();
	}

	// Auto-calculate total amount when quantity and price change
	$: if (formData.quantity && formData.pricePerLiter) {
		formData.totalAmount = (parseFloat(formData.quantity) * parseFloat(formData.pricePerLiter)).toFixed(2);
	}
</script>

<svelte:head>
	<title>{$_('fuel.pageTitle')}</title>
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
							<li class="text-gray-900 font-medium">{$_('fuel.title')}</li>
						</ol>
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					<a
						href="/fuel/reports"
						class="btn btn-secondary"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
						</svg>
						{$_('fuel.reports.title')}
					</a>
					{#if canApprove && pendingCount > 0}
						<button
							on:click={approveAllPending}
							class="btn btn-success"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							{$_('fuel.approveAll')} ({pendingCount})
						</button>
					{/if}
					<button
						on:click={handleAddTransaction}
						class="btn btn-primary"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
						</svg>
						{$_('fuel.addTransaction')}
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Filters -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
			<h3 class="text-lg font-medium text-gray-900 mb-4">{$_('fuel.filters')}</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">{$_('fuel.vehicle')}</label>
					<SearchableSelect
						options={vehicles}
						bind:value={selectedVehicle}
						labelField={v => v.vehicleCode + ' - ' + v.licensePlate}
						valueField="id"
						placeholder={$_('fuel.allVehicles')}
						on:change={handleSearch}
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">{$_('fuel.employee')}</label>
					<SearchableSelect
						options={employees}
						bind:value={selectedEmployee}
						labelField="fullName"
						valueField="id"
						placeholder={$_('fuel.allEmployees')}
						on:change={handleSearch}
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">{$_('fuel.station')}</label>
					<SearchableSelect
						options={stations}
						bind:value={selectedStation}
						labelField="stationName"
						valueField="id"
						placeholder={$_('fuel.allStations')}
						on:change={handleSearch}
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">{$_('fuel.type')}</label>
					<select bind:value={selectedType} on:change={handleSearch} class="form-select">
						<option value="">{$_('fuel.allTypes')}</option>
						<option value="purchase">{$_('fuel.types.purchase')}</option>
						<option value="consumption">{$_('fuel.types.consumption')}</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">{$_('fuel.startDate')}</label>
					<input type="date" bind:value={startDate} on:change={handleSearch} class="form-input">
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">{$_('fuel.endDate')}</label>
					<input type="date" bind:value={endDate} on:change={handleSearch} class="form-input">
				</div>
			</div>
		</div>

		<!-- Data Table -->
		<DataTable
			data={fuelTransactions}
			{columns}
			{loading}
			{currentPage}
			{pageSize}
			{totalItems}
			title={$_('fuel.fuelTransactions')}
			showSearch={false}
			showPagination={true}
			showExport={true}
			on:pagechange={handlePageChange}
			on:rowclick={handleRowClick}
		/>
	</main>
</div>

<!-- Add Transaction Modal -->
<Modal
	open={showAddModal}
	title={$_('fuel.addTransaction')}
	size="xl"
	on:close={handleCancel}
>
	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Basic Information -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
					{$_('fuel.sections.basicInfo')}
				</h3>

				<div>
					<label for="transactionType" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.transactionType')} *
					</label>
					<select
						id="transactionType"
						bind:value={formData.transactionType}
						class="form-select"
						required
					>
						<option value="purchase">{$_('fuel.types.purchase')}</option>
						<option value="consumption">{$_('fuel.types.consumption')}</option>
					</select>
				</div>

				<div>
					<label for="vehicleId" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.vehicle')} *
					</label>
					<SearchableSelect
						id="vehicleId"
						options={vehicles}
						bind:value={formData.vehicleId}
						labelField={v => v.vehicleCode + ' - ' + v.licensePlate}
						valueField="id"
						placeholder={$_('fuel.placeholders.selectVehicle')}
						required
					/>
				</div>

				<div>
					<label for="employeeId" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.employee')}
					</label>
					<SearchableSelect
						id="employeeId"
						options={employees}
						bind:value={formData.employeeId}
						labelField="fullName"
						valueField="id"
						placeholder={$_('fuel.placeholders.selectEmployee')}
					/>
				</div>

				<div>
					<label for="fuelTypeId" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.fuelType')} *
					</label>
					<select
						id="fuelTypeId"
						bind:value={formData.fuelTypeId}
						class="form-select"
						required
					>
						<option value="">{$_('fuel.placeholders.selectFuelType')}</option>
						{#each fuelTypes as fuelType}
							<option value={fuelType.id}>{fuelType.fuelName}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="fuelStationId" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.fuelStation')}
					</label>
					<SearchableSelect
						id="fuelStationId"
						options={stations}
						bind:value={formData.fuelStationId}
						labelField="stationName"
						valueField="id"
						placeholder={$_('fuel.placeholders.selectStation')}
					/>
				</div>

				<div>
					<label for="transactionDate" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.transactionDate')} *
					</label>
					<input
						id="transactionDate"
						type="datetime-local"
						bind:value={formData.transactionDate}
						class="form-input"
						required
					>
				</div>
			</div>

			<!-- Transaction Details -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
					{$_('fuel.sections.transactionDetails')}
				</h3>

				<div>
					<label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.quantityLiters')} *
					</label>
					<input
						id="quantity"
						type="number"
						step="0.01"
						min="0"
						bind:value={formData.quantity}
						class="form-input"
						placeholder={$_('fuel.placeholders.quantity')}
						required
					>
				</div>

				<div>
					<label for="pricePerLiter" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.pricePerLiter')}
					</label>
					<input
						id="pricePerLiter"
						type="number"
						step="0.001"
						min="0"
						bind:value={formData.pricePerLiter}
						class="form-input"
						placeholder={$_('fuel.placeholders.pricePerLiter')}
					>
				</div>

				<div>
					<label for="totalAmount" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.totalAmount')}
					</label>
					<input
						id="totalAmount"
						type="number"
						step="0.01"
						min="0"
						bind:value={formData.totalAmount}
						class="form-input"
						placeholder={$_('fuel.placeholders.totalAmount')}
					>
				</div>

				<div>
					<label for="odometerReading" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.odometerReading')}
					</label>
					<input
						id="odometerReading"
						type="number"
						min="0"
						bind:value={formData.odometerReading}
						class="form-input"
						placeholder={$_('fuel.placeholders.odometerReading')}
					>
				</div>

				<div>
					<label for="paymentMethod" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.paymentMethod')}
					</label>
					<select
						id="paymentMethod"
						bind:value={formData.paymentMethod}
						class="form-select"
					>
						<option value="cash">{$_('fuel.paymentMethods.cash')}</option>
						<option value="card">{$_('fuel.paymentMethods.card')}</option>
						<option value="credit">{$_('fuel.paymentMethods.credit')}</option>
						<option value="voucher">{$_('fuel.paymentMethods.voucher')}</option>
					</select>
				</div>

				<div>
					<label for="receiptNumber" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.receiptNumber')}
					</label>
					<input
						id="receiptNumber"
						type="text"
						bind:value={formData.receiptNumber}
						class="form-input"
						placeholder={$_('fuel.placeholders.receiptNumber')}
					>
				</div>

				<div>
					<label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('fuel.notes')}
					</label>
					<textarea
						id="notes"
						bind:value={formData.notes}
						rows="3"
						class="form-textarea"
						placeholder={$_('fuel.placeholders.notes')}
					></textarea>
				</div>
			</div>
		</div>

		<!-- Form Actions -->
		<div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
			<button
				type="button"
				on:click={handleCancel}
				class="btn btn-secondary"
			>
				{$_('common.cancel')}
			</button>
			<button
				type="submit"
				class="btn btn-primary"
			>
				{$_('fuel.createTransaction')}
			</button>
		</div>
	</form>
</Modal>