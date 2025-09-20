<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import DataTable from '$lib/components/DataTable.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let fuelTransactions = [];
	let loading = false;
	let showAddModal = false;
	let currentPage = 1;
	let pageSize = 20;
	let totalItems = 0;
	let searchTerm = '';

	// Filter options
	let selectedVehicle = '';
	let selectedDriver = '';
	let selectedStation = '';
	let selectedType = '';
	let startDate = '';
	let endDate = '';

	// Dropdown data
	let vehicles = [];
	let drivers = [];
	let stations = [];
	let fuelTypes = [];

	// Form data for new transaction
	let formData = {
		transactionType: 'purchase',
		vehicleId: '',
		driverId: '',
		fuelTypeId: '',
		fuelStationId: '',
		transactionDate: new Date().toISOString().slice(0, 16),
		quantity: '',
		pricePerLiter: '',
		totalAmount: '',
		currency: 'USD',
		odometerReading: '',
		paymentMethod: 'cash',
		receiptNumber: '',
		notes: ''
	};

	function renderTransactionType(value) {
		const types = {
			'purchase': '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Purchase</span>',
			'consumption': '<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Consumption</span>'
		};
		return types[value] || value;
	}

	function renderAmount(value, row) {
		if (!value) return '-';
		return `${value.toFixed(2)} ${row.transaction.currency || 'USD'}`;
	}

	function renderQuantity(value) {
		if (!value) return '-';
		return `${value.toFixed(2)} L`;
	}

	function renderVehicle(value, row) {
		if (!row.vehicle) return '-';
		return `<div class="text-sm"><div class="font-medium">${row.vehicle.vehicleCode}</div><div class="text-gray-500">${row.vehicle.licensePlate}</div></div>`;
	}

	function renderDriver(value, row) {
		if (!row.driver) return '-';
		return `<div class="text-sm"><div class="font-medium">${row.driver.fullName}</div><div class="text-gray-500">${row.driver.driverCode}</div></div>`;
	}

	function renderDate(value) {
		if (!value) return '-';
		return new Date(value).toLocaleDateString();
	}

	function renderApproval(value, row) {
		const approved = row.transaction.approved;
		if (approved) {
			return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Approved</span>';
		} else {
			return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>';
		}
	}

	const columns = [
		{
			key: 'transaction.transactionNumber',
			label: 'Transaction #',
			sortable: true,
			width: '130px'
		},
		{
			key: 'transaction.transactionType',
			label: 'Type',
			sortable: true,
			width: '100px',
			render: renderTransactionType
		},
		{
			key: 'transaction.transactionDate',
			label: 'Date',
			sortable: true,
			width: '100px',
			render: renderDate
		},
		{
			key: 'vehicle',
			label: 'Vehicle',
			sortable: true,
			width: '150px',
			render: renderVehicle
		},
		{
			key: 'driver',
			label: 'Driver',
			sortable: true,
			width: '150px',
			render: renderDriver
		},
		{
			key: 'transaction.quantity',
			label: 'Quantity',
			sortable: true,
			width: '100px',
			render: renderQuantity
		},
		{
			key: 'transaction.totalAmount',
			label: 'Amount',
			sortable: true,
			width: '100px',
			render: renderAmount
		},
		{
			key: 'transaction.approved',
			label: 'Status',
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
	});

	async function loadTransactions() {
		loading = true;
		try {
			const filters = {
				page: currentPage,
				limit: pageSize
			};

			if (selectedVehicle) filters.vehicleId = selectedVehicle;
			if (selectedDriver) filters.driverId = selectedDriver;
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
			const [vehiclesResponse, driversResponse, stationsResponse, typesResponse] = await Promise.all([
				api.getVehicles(),
				api.getDrivers(),
				api.getFuelStations(),
				api.getFuelTypes()
			]);

			vehicles = vehiclesResponse.data || [];
			drivers = driversResponse.data || [];
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

	function handleAddTransaction() {
		showAddModal = true;
	}

	async function handleSubmit() {
		try {
			// Convert string values to numbers where needed
			const submitData = {
				...formData,
				vehicleId: parseInt(formData.vehicleId),
				driverId: formData.driverId ? parseInt(formData.driverId) : undefined,
				fuelTypeId: parseInt(formData.fuelTypeId),
				fuelStationId: formData.fuelStationId ? parseInt(formData.fuelStationId) : undefined,
				quantity: parseFloat(formData.quantity),
				pricePerLiter: formData.pricePerLiter ? parseFloat(formData.pricePerLiter) : undefined,
				totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined,
				odometerReading: formData.odometerReading ? parseInt(formData.odometerReading) : undefined,
				transactionDate: new Date(formData.transactionDate)
			};

			await api.createFuelTransaction(submitData);
			showAddModal = false;
			resetForm();
			await loadTransactions();
		} catch (error) {
			console.error('Failed to create fuel transaction:', error);
			alert('Failed to create fuel transaction. Please try again.');
		}
	}

	function resetForm() {
		formData = {
			transactionType: 'purchase',
			vehicleId: '',
			driverId: '',
			fuelTypeId: '',
			fuelStationId: '',
			transactionDate: new Date().toISOString().slice(0, 16),
			quantity: '',
			pricePerLiter: '',
			totalAmount: '',
			currency: 'USD',
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
	<title>Fuel Management - MedFMS</title>
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
							<li class="text-gray-900 font-medium">Fuel Management</li>
						</ol>
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					<button
						on:click={handleAddTransaction}
						class="btn btn-primary"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
						</svg>
						Add Transaction
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Filters -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
			<h3 class="text-lg font-medium text-gray-900 mb-4">Filters</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
					<select bind:value={selectedVehicle} on:change={handleSearch} class="form-select">
						<option value="">All Vehicles</option>
						{#each vehicles as vehicle}
							<option value={vehicle.id}>{vehicle.vehicleCode} - {vehicle.licensePlate}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Driver</label>
					<select bind:value={selectedDriver} on:change={handleSearch} class="form-select">
						<option value="">All Drivers</option>
						{#each drivers as driver}
							<option value={driver.id}>{driver.fullName}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Station</label>
					<select bind:value={selectedStation} on:change={handleSearch} class="form-select">
						<option value="">All Stations</option>
						{#each stations as station}
							<option value={station.id}>{station.stationName}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
					<select bind:value={selectedType} on:change={handleSearch} class="form-select">
						<option value="">All Types</option>
						<option value="purchase">Purchase</option>
						<option value="consumption">Consumption</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
					<input type="date" bind:value={startDate} on:change={handleSearch} class="form-input">
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
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
			title="Fuel Transactions"
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
	title="Add Fuel Transaction"
	size="xl"
	on:close={handleCancel}
>
	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Basic Information -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
					Basic Information
				</h3>

				<div>
					<label for="transactionType" class="block text-sm font-medium text-gray-700 mb-2">
						Transaction Type *
					</label>
					<select
						id="transactionType"
						bind:value={formData.transactionType}
						class="form-select"
						required
					>
						<option value="purchase">Purchase</option>
						<option value="consumption">Consumption</option>
					</select>
				</div>

				<div>
					<label for="vehicleId" class="block text-sm font-medium text-gray-700 mb-2">
						Vehicle *
					</label>
					<select
						id="vehicleId"
						bind:value={formData.vehicleId}
						class="form-select"
						required
					>
						<option value="">Select vehicle</option>
						{#each vehicles as vehicle}
							<option value={vehicle.id}>{vehicle.vehicleCode} - {vehicle.licensePlate}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="driverId" class="block text-sm font-medium text-gray-700 mb-2">
						Driver
					</label>
					<select
						id="driverId"
						bind:value={formData.driverId}
						class="form-select"
					>
						<option value="">Select driver</option>
						{#each drivers as driver}
							<option value={driver.id}>{driver.fullName}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="fuelTypeId" class="block text-sm font-medium text-gray-700 mb-2">
						Fuel Type *
					</label>
					<select
						id="fuelTypeId"
						bind:value={formData.fuelTypeId}
						class="form-select"
						required
					>
						<option value="">Select fuel type</option>
						{#each fuelTypes as fuelType}
							<option value={fuelType.id}>{fuelType.fuelName}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="fuelStationId" class="block text-sm font-medium text-gray-700 mb-2">
						Fuel Station
					</label>
					<select
						id="fuelStationId"
						bind:value={formData.fuelStationId}
						class="form-select"
					>
						<option value="">Select station</option>
						{#each stations as station}
							<option value={station.id}>{station.stationName}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="transactionDate" class="block text-sm font-medium text-gray-700 mb-2">
						Transaction Date *
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
					Transaction Details
				</h3>

				<div>
					<label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
						Quantity (Liters) *
					</label>
					<input
						id="quantity"
						type="number"
						step="0.01"
						min="0"
						bind:value={formData.quantity}
						class="form-input"
						placeholder="0.00"
						required
					>
				</div>

				<div>
					<label for="pricePerLiter" class="block text-sm font-medium text-gray-700 mb-2">
						Price per Liter
					</label>
					<input
						id="pricePerLiter"
						type="number"
						step="0.001"
						min="0"
						bind:value={formData.pricePerLiter}
						class="form-input"
						placeholder="0.000"
					>
				</div>

				<div>
					<label for="totalAmount" class="block text-sm font-medium text-gray-700 mb-2">
						Total Amount
					</label>
					<input
						id="totalAmount"
						type="number"
						step="0.01"
						min="0"
						bind:value={formData.totalAmount}
						class="form-input"
						placeholder="0.00"
					>
				</div>

				<div>
					<label for="odometerReading" class="block text-sm font-medium text-gray-700 mb-2">
						Odometer Reading (km)
					</label>
					<input
						id="odometerReading"
						type="number"
						min="0"
						bind:value={formData.odometerReading}
						class="form-input"
						placeholder="0"
					>
				</div>

				<div>
					<label for="paymentMethod" class="block text-sm font-medium text-gray-700 mb-2">
						Payment Method
					</label>
					<select
						id="paymentMethod"
						bind:value={formData.paymentMethod}
						class="form-select"
					>
						<option value="cash">Cash</option>
						<option value="card">Card</option>
						<option value="credit">Credit</option>
						<option value="voucher">Voucher</option>
					</select>
				</div>

				<div>
					<label for="receiptNumber" class="block text-sm font-medium text-gray-700 mb-2">
						Receipt Number
					</label>
					<input
						id="receiptNumber"
						type="text"
						bind:value={formData.receiptNumber}
						class="form-input"
						placeholder="Enter receipt number"
					>
				</div>

				<div>
					<label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
						Notes
					</label>
					<textarea
						id="notes"
						bind:value={formData.notes}
						rows="3"
						class="form-textarea"
						placeholder="Additional notes..."
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
				Cancel
			</button>
			<button
				type="submit"
				class="btn btn-primary"
			>
				Create Transaction
			</button>
		</div>
	</form>
</Modal>