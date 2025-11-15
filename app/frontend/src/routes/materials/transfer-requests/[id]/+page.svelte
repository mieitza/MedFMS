<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { _ } from '$lib/i18n';
	import { api } from '$lib/api';
	import { createFormTracker } from '$lib/utils/formTracking';

	let transferRequest = null;
	let warehouses = [];
	let materials = [];
	let vehicles = [];
	let vehicleInventoryItems = [];
	let employees = [];
	let loading = true;
	let saving = false;
	let error = '';
	let success = '';
	let formTracker = null; // For tracking changed fields when editing

	let formData = {
		transferType: 'warehouse-to-warehouse',
		sourceWarehouseId: null,
		sourceVehicleId: null,
		destinationWarehouseId: null,
		destinationVehicleId: null,
		destinationEmployeeId: null,
		materialId: null,
		vehicleInventoryItemId: null,
		quantity: '',
		priority: 3,
		requiredByDate: '',
		reason: '',
		notes: '',
		autoApprove: false,
		// For warehouse-to-vehicle transfers
		serialNumber: '',
		batchNumber: '',
		condition: 'good',
		location: ''
	};

	$: requestId = $page.params.id;
	$: isNewRequest = requestId === 'new';
	$: isEditable = !transferRequest || transferRequest.transferRequest?.status === 'pending';
	$: canApprove = transferRequest?.transferRequest?.status === 'pending';
	$: canComplete = transferRequest?.transferRequest?.status === 'approved' || transferRequest?.transferRequest?.status === 'in_transit';

	onMount(async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/');
			return;
		}

		await loadData();

		// If new request, check for query params to pre-populate form
		if (isNewRequest) {
			const transferType = $page.url.searchParams.get('transferType');
			const vehicleId = $page.url.searchParams.get('vehicleId');
			const materialId = $page.url.searchParams.get('materialId');
			const warehouseId = $page.url.searchParams.get('warehouseId');

			if (transferType) formData.transferType = transferType;
			if (vehicleId) formData.destinationVehicleId = parseInt(vehicleId);
			if (materialId) formData.materialId = parseInt(materialId);
			if (warehouseId) formData.sourceWarehouseId = parseInt(warehouseId);
		}
	});

	async function loadData() {
		try {
			// Load all required data for dropdowns
			const [warehousesRes, materialsRes, vehiclesRes, vehicleItemsRes, employeesRes] = await Promise.all([
				api.getWarehouses(),
				api.getMaterials({ limit: 1000 }),
				api.getVehicles({ limit: 1000 }),
				api.getVehicleInventoryItems(),
				api.getDrivers({ limit: 1000 }) // Using drivers as employees for now
			]);

			warehouses = warehousesRes.data || [];
			materials = materialsRes.data || [];
			vehicles = vehiclesRes.data || [];
			vehicleInventoryItems = vehicleItemsRes.data || [];
			employees = employeesRes.data || [];

			if (!isNewRequest) {
				// Load transfer request details
				const response = await api.getTransferRequestById(requestId);
				transferRequest = response.data;

				// Populate form with existing data
				if (transferRequest.transferRequest) {
					formData = {
						transferType: transferRequest.transferRequest.transferType || 'warehouse-to-warehouse',
						sourceWarehouseId: transferRequest.transferRequest.sourceWarehouseId,
						destinationWarehouseId: transferRequest.transferRequest.destinationWarehouseId,
						destinationVehicleId: transferRequest.transferRequest.destinationVehicleId,
						destinationEmployeeId: transferRequest.transferRequest.destinationEmployeeId,
						materialId: transferRequest.transferRequest.materialId,
						vehicleInventoryItemId: transferRequest.transferRequest.vehicleInventoryItemId,
						quantity: transferRequest.transferRequest.quantity,
						priority: transferRequest.transferRequest.priority || 3,
						requiredByDate: transferRequest.transferRequest.requiredByDate
							? new Date(transferRequest.transferRequest.requiredByDate).toISOString().split('T')[0]
							: '',
						reason: transferRequest.transferRequest.reason || '',
						notes: transferRequest.transferRequest.notes || '',
						autoApprove: transferRequest.transferRequest.autoApprove || false,
						serialNumber: '',
						batchNumber: '',
						condition: 'good',
						location: ''
					};

					// Create form tracker with original data for change detection
					formTracker = createFormTracker(formData);
				}
			}
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function handleSave() {
		error = '';
		success = '';
		saving = true;

		try {
			const fullRequestData = {
				transferType: formData.transferType,
				sourceWarehouseId: (formData.transferType === 'vehicle-to-warehouse') ? null : formData.sourceWarehouseId,
				sourceVehicleId: (formData.transferType === 'vehicle-to-warehouse') ? formData.sourceVehicleId : null,
				destinationWarehouseId: (formData.transferType === 'warehouse-to-warehouse' || formData.transferType === 'vehicle-to-warehouse') ? formData.destinationWarehouseId : null,
				destinationVehicleId: (formData.transferType === 'warehouse-to-vehicle') ? formData.destinationVehicleId : null,
				destinationEmployeeId: formData.transferType === 'warehouse-to-employee' ? formData.destinationEmployeeId : null,
				materialId: formData.materialId,
				vehicleInventoryItemId: (formData.transferType === 'warehouse-to-vehicle' || formData.transferType === 'vehicle-to-warehouse') ? formData.vehicleInventoryItemId : null,
				quantity: parseFloat(formData.quantity),
				priority: formData.priority,
				requiredByDate: formData.requiredByDate || null,
				reason: formData.reason,
				notes: formData.notes,
				autoApprove: formData.autoApprove
			};

			if (isNewRequest) {
				await api.createTransferRequest(fullRequestData);
				success = $_('materials.transferRequests.messages.createSuccess');
				setTimeout(() => goto('/materials/transfer-requests'), 1500);
			} else {
				// For updates, detect and send only changed fields
				const changedFields = formTracker ? formTracker.detectChanges(fullRequestData) : fullRequestData;

				// Apply type conversions to changed fields
				const payload = {};
				for (const key in changedFields) {
					if (key === 'materialId' || key === 'sourceWarehouseId' || key === 'destinationWarehouseId' ||
						key === 'sourceVehicleId' || key === 'destinationVehicleId' || key === 'destinationEmployeeId' ||
						key === 'vehicleInventoryItemId' || key === 'priority') {
						payload[key] = changedFields[key] ? parseInt(changedFields[key]) : null;
					} else if (key === 'quantity') {
						payload[key] = parseFloat(changedFields[key]);
					} else if (key === 'autoApprove') {
						payload[key] = Boolean(changedFields[key]);
					} else {
						payload[key] = changedFields[key];
					}
				}

				// Only send PATCH if there are changes
				if (Object.keys(payload).length > 0) {
					await api.patchTransferRequest(requestId, payload);
					success = $_('materials.transferRequests.messages.updateSuccess');
				} else {
					// No changes
					success = $_('materials.messages.noChanges') || 'No changes to save';
				}

				await loadData();
			}
		} catch (err) {
			error = err.message;
		} finally {
			saving = false;
		}
	}

	async function handleApprove() {
		if (!confirm($_('materials.transferRequests.confirmations.approve'))) return;

		try {
			await api.approveTransferRequest(requestId);
			success = $_('materials.transferRequests.messages.approveSuccess');
			await loadData();
		} catch (err) {
			error = err.message;
		}
	}

	async function handleReject() {
		const reason = prompt($_('materials.transferRequests.confirmations.reject'));
		if (!reason) return;

		try {
			await api.rejectTransferRequest(requestId, reason);
			success = $_('materials.transferRequests.messages.rejectSuccess');
			await loadData();
		} catch (err) {
			error = err.message;
		}
	}

	async function handleMarkInTransit() {
		if (!confirm($_('materials.transferRequests.confirmations.markInTransit'))) return;

		try {
			await api.updateTransferRequestStatus(requestId, 'in_transit');
			success = $_('materials.transferRequests.messages.markInTransitSuccess');
			await loadData();
		} catch (err) {
			error = err.message;
		}
	}

	async function handleComplete() {
		const qualityCheck = confirm($_('materials.transferRequests.confirmations.qualityCheckPass'));
		const qualityNotes = qualityCheck ? prompt($_('materials.transferRequests.confirmations.qualityCheckNotes')) : null;

		// For warehouse-to-vehicle transfers, prompt for additional fields
		let additionalData = {};
		if (transferRequest.transferRequest.transferType === 'warehouse-to-vehicle') {
			const serialNumber = prompt($_('materials.transferRequests.serialNumber') + ':') || '';
			const batchNumber = prompt($_('materials.transferRequests.batchNumber') + ':') || '';
			const location = prompt($_('materials.transferRequests.location') + ':') || '';
			additionalData = { serialNumber, batchNumber, location, condition: 'good' };
		}

		try {
			await api.completeTransferRequest(requestId, qualityNotes, null, additionalData);
			success = $_('materials.transferRequests.messages.completeSuccess');
			await loadData();
		} catch (err) {
			error = err.message;
		}
	}

	async function handleDelete() {
		if (!confirm($_('materials.transferRequests.confirmations.delete'))) return;

		try {
			await api.deleteTransferRequest(requestId);
			success = $_('materials.transferRequests.messages.deleteSuccess');
			setTimeout(() => goto('/materials/transfer-requests'), 1500);
		} catch (err) {
			error = err.message;
		}
	}

	function getStatusBadge(status) {
		const statusLabels = {
			'pending': $_('materials.transferRequests.statuses.pending'),
			'approved': $_('materials.transferRequests.statuses.approved'),
			'rejected': $_('materials.transferRequests.statuses.rejected'),
			'in_transit': $_('materials.transferRequests.statuses.inTransit'),
			'completed': $_('materials.transferRequests.statuses.completed'),
			'cancelled': $_('materials.transferRequests.statuses.cancelled')
		};
		const colorMap = {
			'pending': 'bg-yellow-100 text-yellow-800',
			'approved': 'bg-blue-100 text-blue-800',
			'rejected': 'bg-red-100 text-red-800',
			'in_transit': 'bg-purple-100 text-purple-800',
			'completed': 'bg-green-100 text-green-800',
			'cancelled': 'bg-gray-100 text-gray-800'
		};
		return { label: statusLabels[status] || 'Unknown', color: colorMap[status] || 'bg-gray-100 text-gray-800' };
	}
</script>

<svelte:head>
	<title>{isNewRequest ? $_('materials.transferRequests.new') : $_('materials.transferRequests.view')} {$_('materials.transferRequests.title')} - {$_('common.appName')}</title>
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
							<li><a href="/materials" class="text-gray-500 hover:text-gray-700">{$_('materials.title')}</a></li>
							<li class="text-gray-500">/</li>
							<li><a href="/materials/transfer-requests" class="text-gray-500 hover:text-gray-700">{$_('materials.transferRequests.title')}</a></li>
							<li class="text-gray-500">/</li>
							<li class="text-gray-900 font-medium">{isNewRequest ? $_('materials.transferRequests.new') : transferRequest?.transferRequest?.requestNumber || $_('materials.transferRequests.loading')}</li>
						</ol>
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					<a href="/materials/transfer-requests" class="btn btn-secondary">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
						</svg>
						{$_('materials.transferRequests.backToList')}
					</a>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if loading}
			<div class="flex justify-center items-center h-64">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		{:else}
			<div class="bg-white shadow rounded-lg">
				<!-- Header Section -->
				{#if !isNewRequest && transferRequest}
					{@const statusInfo = getStatusBadge(transferRequest.transferRequest.status)}
					<div class="px-6 py-4 border-b border-gray-200">
						<div class="flex items-center justify-between">
							<div>
								<h2 class="text-2xl font-bold text-gray-900">
									{transferRequest.transferRequest.requestNumber}
								</h2>
								<p class="mt-1 text-sm text-gray-500">
									{$_('materials.transferRequests.created')} {new Date(transferRequest.transferRequest.createdAt).toLocaleString()}
								</p>
							</div>
							<div class="flex items-center space-x-2">
								<span class="px-3 py-1 text-sm font-medium rounded-full {statusInfo.color}">
									{statusInfo.label}
								</span>
							</div>
						</div>
					</div>
				{/if}

				<!-- Alerts -->
				{#if error}
					<div class="mx-6 mt-4 bg-red-50 border-l-4 border-red-400 p-4">
						<p class="text-sm text-red-700">{error}</p>
					</div>
				{/if}
				{#if success}
					<div class="mx-6 mt-4 bg-green-50 border-l-4 border-green-400 p-4">
						<p class="text-sm text-green-700">{success}</p>
					</div>
				{/if}

				<!-- Form -->
				<div class="px-6 py-6">
					<form on:submit|preventDefault={handleSave} class="space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<!-- Transfer Type -->
							<div>
								<label for="transferType" class="block text-sm font-medium text-gray-700">
									{$_('materials.transferRequests.transferType')} *
								</label>
								<select
									id="transferType"
									bind:value={formData.transferType}
									disabled={!isEditable}
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
								>
									<option value="warehouse-to-warehouse">{$_('materials.transferRequests.types.warehouse-to-warehouse')}</option>
									<option value="warehouse-to-vehicle">{$_('materials.transferRequests.types.warehouse-to-vehicle')}</option>
									<option value="vehicle-to-warehouse">{$_('materials.transferRequests.types.vehicle-to-warehouse')}</option>
									<option value="warehouse-to-employee">{$_('materials.transferRequests.types.warehouse-to-employee')}</option>
								</select>
							</div>

							<!-- Auto-Approve -->
							<div class="flex items-center h-full">
								<label class="flex items-center space-x-2 cursor-pointer">
									<input
										type="checkbox"
										bind:checked={formData.autoApprove}
										disabled={!isEditable}
										class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
									/>
									<div>
										<div class="text-sm font-medium text-gray-700">{$_('materials.transferRequests.autoApprove')}</div>
										<div class="text-xs text-gray-500">{$_('materials.transferRequests.autoApproveHelp')}</div>
									</div>
								</label>
							</div>

							<!-- Source Warehouse (for warehouse-to-* transfers) -->
							{#if formData.transferType === 'warehouse-to-warehouse' || formData.transferType === 'warehouse-to-vehicle' || formData.transferType === 'warehouse-to-employee'}
								<div>
									<label for="sourceWarehouseId" class="block text-sm font-medium text-gray-700">
										{$_('materials.transferRequests.sourceWarehouse')} *
									</label>
									<select
										id="sourceWarehouseId"
										bind:value={formData.sourceWarehouseId}
										disabled={!isEditable}
										required
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
									>
										<option value={null}>{$_('materials.transferRequests.selectWarehouse')}</option>
										{#each warehouses as warehouse}
											<option value={warehouse.id}>{warehouse.warehouseName} ({warehouse.warehouseCode})</option>
										{/each}
									</select>
								</div>
							{/if}

							<!-- Source Vehicle (for vehicle-to-warehouse transfers) -->
							{#if formData.transferType === 'vehicle-to-warehouse'}
								<div>
									<label for="sourceVehicleId" class="block text-sm font-medium text-gray-700">
										{$_('materials.transferRequests.sourceVehicle')} *
									</label>
									<select
										id="sourceVehicleId"
										bind:value={formData.sourceVehicleId}
										disabled={!isEditable}
										required
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
									>
										<option value={null}>{$_('materials.transferRequests.selectVehicle')}</option>
										{#each vehicles as vehicle}
											<option value={vehicle.id}>{vehicle.licensePlate} - {vehicle.make} {vehicle.model}</option>
										{/each}
									</select>
								</div>
							{/if}

							<!-- Destination Warehouse (for warehouse-to-warehouse and vehicle-to-warehouse) -->
							{#if formData.transferType === 'warehouse-to-warehouse' || formData.transferType === 'vehicle-to-warehouse'}
								<div>
									<label for="destinationWarehouseId" class="block text-sm font-medium text-gray-700">
										{$_('materials.transferRequests.destinationWarehouse')} *
									</label>
									<select
										id="destinationWarehouseId"
										bind:value={formData.destinationWarehouseId}
										disabled={!isEditable}
										required
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
									>
										<option value={null}>{$_('materials.transferRequests.selectWarehouse')}</option>
										{#each warehouses as warehouse}
											<option value={warehouse.id}>{warehouse.warehouseName} ({warehouse.warehouseCode})</option>
										{/each}
									</select>
								</div>
							{/if}

							<!-- Destination Vehicle (for warehouse-to-vehicle only) -->
							{#if formData.transferType === 'warehouse-to-vehicle'}
								<div>
									<label for="destinationVehicleId" class="block text-sm font-medium text-gray-700">
										{$_('materials.transferRequests.destinationVehicle')} *
									</label>
									<select
										id="destinationVehicleId"
										bind:value={formData.destinationVehicleId}
										disabled={!isEditable}
										required
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
									>
										<option value={null}>{$_('materials.transferRequests.selectVehicle')}</option>
										{#each vehicles as vehicle}
											<option value={vehicle.id}>{vehicle.licensePlate} - {vehicle.make} {vehicle.model}</option>
										{/each}
									</select>
								</div>
							{/if}

							<!-- Destination Employee (for employee transfers) -->
							{#if formData.transferType === 'warehouse-to-employee'}
								<div>
									<label for="destinationEmployeeId" class="block text-sm font-medium text-gray-700">
										{$_('materials.transferRequests.destinationEmployee')} *
									</label>
									<select
										id="destinationEmployeeId"
										bind:value={formData.destinationEmployeeId}
										disabled={!isEditable}
										required
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
									>
										<option value={null}>{$_('materials.transferRequests.selectEmployee')}</option>
										{#each employees as employee}
											<option value={employee.id}>{employee.fullName} ({employee.employeeNumber})</option>
										{/each}
									</select>
								</div>
							{/if}

							<!-- Material -->
							<div>
								<label for="materialId" class="block text-sm font-medium text-gray-700">
									{$_('materials.transferRequests.material')} *
								</label>
								<select
									id="materialId"
									bind:value={formData.materialId}
									disabled={!isEditable}
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
								>
									<option value={null}>{$_('materials.transferRequests.selectMaterial')}</option>
									{#each materials as material}
										<option value={material.id}>{material.materialName} ({material.materialCode})</option>
									{/each}
								</select>
							</div>

							<!-- Vehicle Inventory Item (only for vehicle-to-warehouse returns) -->
							{#if formData.transferType === 'vehicle-to-warehouse'}
								<div>
									<label for="vehicleInventoryItemId" class="block text-sm font-medium text-gray-700">
										{$_('materials.transferRequests.vehicleInventoryItem')} *
									</label>
									<select
										id="vehicleInventoryItemId"
										bind:value={formData.vehicleInventoryItemId}
										disabled={!isEditable}
										required
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
									>
										<option value={null}>{$_('materials.transferRequests.selectVehicleItem')}</option>
										{#each vehicleInventoryItems as item}
											<option value={item.id}>{item.itemName || 'Unknown'} {item.itemCode ? `(${item.itemCode})` : ''}</option>
										{/each}
									</select>
								</div>
							{/if}

							<!-- Quantity -->
							<div>
								<label for="quantity" class="block text-sm font-medium text-gray-700">
									{$_('materials.transferRequests.quantity')} *
								</label>
								<input
									type="number"
									id="quantity"
									bind:value={formData.quantity}
									disabled={!isEditable}
									required
									step="0.01"
									min="0.01"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
								/>
							</div>

							<!-- Priority -->
							<div>
								<label for="priority" class="block text-sm font-medium text-gray-700">
									{$_('materials.transferRequests.priority')} *
								</label>
								<select
									id="priority"
									bind:value={formData.priority}
									disabled={!isEditable}
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
								>
									<option value={1}>1 - {$_('materials.transferRequests.priorities.urgent')}</option>
									<option value={2}>2 - {$_('materials.transferRequests.priorities.high')}</option>
									<option value={3}>3 - {$_('materials.transferRequests.priorities.normal')}</option>
									<option value={4}>4 - {$_('materials.transferRequests.priorities.low')}</option>
									<option value={5}>5 - {$_('materials.transferRequests.priorities.optional')}</option>
								</select>
							</div>

							<!-- Required By Date -->
							<div>
								<label for="requiredByDate" class="block text-sm font-medium text-gray-700">
									{$_('materials.transferRequests.requiredByDate')}
								</label>
								<input
									type="date"
									id="requiredByDate"
									bind:value={formData.requiredByDate}
									disabled={!isEditable}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
								/>
							</div>
						</div>

						<!-- Reason -->
						<div>
							<label for="reason" class="block text-sm font-medium text-gray-700">
								{$_('materials.transferRequests.reason')}
							</label>
							<textarea
								id="reason"
								bind:value={formData.reason}
								disabled={!isEditable}
								rows="2"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
							></textarea>
						</div>

						<!-- Notes -->
						<div>
							<label for="notes" class="block text-sm font-medium text-gray-700">
								{$_('materials.transferRequests.notes')}
							</label>
							<textarea
								id="notes"
								bind:value={formData.notes}
								disabled={!isEditable}
								rows="3"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
							></textarea>
						</div>

						<!-- Action Buttons -->
						<div class="flex justify-between items-center pt-4 border-t">
							<div class="space-x-2">
								{#if isEditable}
									<button type="submit" disabled={saving} class="btn btn-primary">
										{#if saving}
											<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
												<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										{/if}
										{isNewRequest ? $_('materials.transferRequests.createRequest') : $_('materials.transferRequests.saveChanges')}
									</button>
								{/if}

								{#if !isNewRequest}
									{#if canApprove}
										<button type="button" on:click={handleApprove} class="btn btn-success">
											{$_('materials.transferRequests.approve')}
										</button>
										<button type="button" on:click={handleReject} class="btn btn-danger">
											{$_('materials.transferRequests.reject')}
										</button>
									{/if}
									{#if canApprove}
										<button type="button" on:click={handleMarkInTransit} class="btn btn-info">
											{$_('materials.transferRequests.markInTransit')}
										</button>
									{/if}
									{#if canComplete}
										<button type="button" on:click={handleComplete} class="btn btn-success">
											{$_('materials.transferRequests.completeTransfer')}
										</button>
									{/if}
								{/if}
							</div>

							{#if !isNewRequest && transferRequest?.transferRequest?.status === 'pending'}
								<button type="button" on:click={handleDelete} class="btn btn-danger">
									{$_('materials.transferRequests.delete')}
								</button>
							{/if}
						</div>
					</form>

					<!-- Audit Trail -->
					{#if !isNewRequest && transferRequest}
						<div class="mt-8 pt-8 border-t">
							<h3 class="text-lg font-medium text-gray-900 mb-4">{$_('materials.transferRequests.transferHistory')}</h3>
							<div class="space-y-4">
								{#if transferRequest.transferRequest.requestedDate}
									<div class="flex items-start">
										<div class="flex-shrink-0 bg-yellow-100 rounded-full p-2">
											<svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
											</svg>
										</div>
										<div class="ml-3">
											<p class="text-sm font-medium text-gray-900">{$_('materials.transferRequests.requestCreated')}</p>
											<p class="text-sm text-gray-500">{new Date(transferRequest.transferRequest.requestedDate).toLocaleString()}</p>
										</div>
									</div>
								{/if}
								{#if transferRequest.transferRequest.approvedDate}
									<div class="flex items-start">
										<div class="flex-shrink-0 bg-blue-100 rounded-full p-2">
											<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
											</svg>
										</div>
										<div class="ml-3">
											<p class="text-sm font-medium text-gray-900">{$_('materials.transferRequests.approved')}</p>
											<p class="text-sm text-gray-500">{new Date(transferRequest.transferRequest.approvedDate).toLocaleString()}</p>
										</div>
									</div>
								{/if}
								{#if transferRequest.transferRequest.transferDate}
									<div class="flex items-start">
										<div class="flex-shrink-0 bg-purple-100 rounded-full p-2">
											<svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
												<path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
												<path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
											</svg>
										</div>
										<div class="ml-3">
											<p class="text-sm font-medium text-gray-900">{$_('materials.transferRequests.transferStarted')}</p>
											<p class="text-sm text-gray-500">{new Date(transferRequest.transferRequest.transferDate).toLocaleString()}</p>
										</div>
									</div>
								{/if}
								{#if transferRequest.transferRequest.completedDate}
									<div class="flex items-start">
										<div class="flex-shrink-0 bg-green-100 rounded-full p-2">
											<svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
											</svg>
										</div>
										<div class="ml-3">
											<p class="text-sm font-medium text-gray-900">{$_('materials.transferRequests.transferCompleted')}</p>
											<p class="text-sm text-gray-500">{new Date(transferRequest.transferRequest.completedDate).toLocaleString()}</p>
											{#if transferRequest.transferRequest.qualityCheckNotes}
												<p class="text-sm text-gray-600 mt-1">{$_('materials.transferRequests.qualityCheck')}: {transferRequest.transferRequest.qualityCheckNotes}</p>
											{/if}
										</div>
									</div>
								{/if}
								{#if transferRequest.transferRequest.rejectionReason}
									<div class="flex items-start">
										<div class="flex-shrink-0 bg-red-100 rounded-full p-2">
											<svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
											</svg>
										</div>
										<div class="ml-3">
											<p class="text-sm font-medium text-gray-900">{$_('materials.transferRequests.rejected')}</p>
											<p class="text-sm text-gray-600 mt-1">{$_('materials.transferRequests.reason')}: {transferRequest.transferRequest.rejectionReason}</p>
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>
