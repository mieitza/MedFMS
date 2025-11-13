<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import Modal from '$lib/components/Modal.svelte';

	export let vehicleId;
	export let title = null;

	let assignments = [];
	let items = [];
	let categories = [];
	let loading = true;
	let error = null;

	// Modal state
	let showAddModal = false;
	let showEditModal = false;
	let showInspectionModal = false;
	let selectedAssignment = null;

	// Form data
	let formData = {
		itemId: '',
		quantity: 1,
		serialNumber: '',
		batchNumber: '',
		condition: 'good',
		status: 'active',
		location: '',
		expirationDate: '',
		certificationNumber: '',
		certificationExpiryDate: '',
		notes: ''
	};

	// Inspection form data
	let inspectionData = {
		inspectionType: 'routine',
		condition: 'good',
		notes: '',
		issuesFound: '',
		actionTaken: '',
		passed: true
	};

	$: conditionOptions = [
		{ value: 'excellent', label: $_('vehicles.inventory.conditions.excellent'), color: 'bg-green-100 text-green-800' },
		{ value: 'good', label: $_('vehicles.inventory.conditions.good'), color: 'bg-blue-100 text-blue-800' },
		{ value: 'fair', label: $_('vehicles.inventory.conditions.fair'), color: 'bg-yellow-100 text-yellow-800' },
		{ value: 'poor', label: $_('vehicles.inventory.conditions.poor'), color: 'bg-orange-100 text-orange-800' },
		{ value: 'damaged', label: $_('vehicles.inventory.conditions.damaged'), color: 'bg-red-100 text-red-800' }
	];

	$: statusOptions = [
		{ value: 'active', label: $_('vehicles.inventory.statuses.active'), color: 'bg-green-100 text-green-800' },
		{ value: 'expired', label: $_('vehicles.inventory.statuses.expired'), color: 'bg-red-100 text-red-800' },
		{ value: 'damaged', label: $_('vehicles.inventory.statuses.damaged'), color: 'bg-orange-100 text-orange-800' },
		{ value: 'removed', label: $_('vehicles.inventory.statuses.removed'), color: 'bg-gray-100 text-gray-800' },
		{ value: 'maintenance', label: $_('vehicles.inventory.statuses.maintenance'), color: 'bg-blue-100 text-blue-800' }
	];

	onMount(async () => {
		await Promise.all([
			loadAssignments(),
			loadItems(),
			loadCategories()
		]);
	});

	async function loadAssignments() {
		loading = true;
		error = null;
		try {
			const response = await api.getVehicleMaterials(vehicleId);
			assignments = response.data || [];
		} catch (err) {
			console.error('Failed to load vehicle inventory:', err);
			error = $_('vehicles.inventory.messages.loadFailed');
		} finally {
			loading = false;
		}
	}

	async function loadItems() {
		try {
			const response = await api.getVehicleInventoryItems();
			items = response.data || [];
		} catch (err) {
			console.error('Failed to load inventory items:', err);
		}
	}

	async function loadCategories() {
		try {
			const response = await api.getVehicleInventoryCategories();
			categories = response.data || [];
		} catch (err) {
			console.error('Failed to load categories:', err);
		}
	}

	function openAddModal() {
		formData = {
			itemId: '',
			quantity: 1,
			serialNumber: '',
			batchNumber: '',
			condition: 'good',
			status: 'active',
			location: '',
			expirationDate: '',
			certificationNumber: '',
			certificationExpiryDate: '',
			notes: ''
		};
		showAddModal = true;
	}

	function openEditModal(assignment) {
		selectedAssignment = assignment;
		formData = {
			itemId: assignment.assignment.itemId,
			quantity: assignment.assignment.quantity || 1,
			serialNumber: assignment.assignment.serialNumber || '',
			batchNumber: assignment.assignment.batchNumber || '',
			condition: assignment.assignment.condition || 'good',
			status: assignment.assignment.status || 'active',
			location: assignment.assignment.location || '',
			expirationDate: assignment.assignment.expirationDate
				? new Date(assignment.assignment.expirationDate).toISOString().split('T')[0]
				: '',
			certificationNumber: assignment.assignment.certificationNumber || '',
			certificationExpiryDate: assignment.assignment.certificationExpiryDate
				? new Date(assignment.assignment.certificationExpiryDate).toISOString().split('T')[0]
				: '',
			notes: assignment.assignment.notes || ''
		};
		showEditModal = true;
	}

	function openInspectionModal(assignment) {
		selectedAssignment = assignment;
		inspectionData = {
			inspectionType: 'routine',
			condition: assignment.assignment.condition || 'good',
			notes: '',
			issuesFound: '',
			actionTaken: '',
			passed: true
		};
		showInspectionModal = true;
	}

	async function handleAddSubmit() {
		try {
			const assignmentData = {
				vehicleId: parseInt(vehicleId),
				itemId: parseInt(formData.itemId),
				quantity: parseInt(formData.quantity),
				serialNumber: formData.serialNumber || null,
				batchNumber: formData.batchNumber || null,
				condition: formData.condition,
				status: formData.status,
				location: formData.location || null,
				expirationDate: formData.expirationDate ? new Date(formData.expirationDate).getTime() : null,
				certificationNumber: formData.certificationNumber || null,
				certificationExpiryDate: formData.certificationExpiryDate ? new Date(formData.certificationExpiryDate).getTime() : null,
				notes: formData.notes || null,
				assignmentDate: Date.now()
			};

			await api.createVehicleInventoryAssignment(assignmentData);
			showAddModal = false;
			await loadAssignments();
		} catch (err) {
			console.error('Failed to create assignment:', err);
			alert($_('vehicles.inventory.messages.saveFailed'));
		}
	}

	async function handleEditSubmit() {
		try {
			const assignmentData = {
				itemId: parseInt(formData.itemId),
				quantity: parseInt(formData.quantity),
				serialNumber: formData.serialNumber || null,
				batchNumber: formData.batchNumber || null,
				condition: formData.condition,
				status: formData.status,
				location: formData.location || null,
				expirationDate: formData.expirationDate ? new Date(formData.expirationDate).getTime() : null,
				certificationNumber: formData.certificationNumber || null,
				certificationExpiryDate: formData.certificationExpiryDate ? new Date(formData.certificationExpiryDate).getTime() : null,
				notes: formData.notes || null
			};

			await api.updateVehicleInventoryAssignment(selectedAssignment.assignment.id, assignmentData);
			showEditModal = false;
			selectedAssignment = null;
			await loadAssignments();
		} catch (err) {
			console.error('Failed to update assignment:', err);
			alert($_('vehicles.inventory.messages.updateFailed'));
		}
	}

	async function handleInspectionSubmit() {
		try {
			const inspection = {
				assignmentId: selectedAssignment.assignment.id,
				inspectionDate: Date.now(),
				inspectionType: inspectionData.inspectionType,
				condition: inspectionData.condition,
				notes: inspectionData.notes || null,
				issuesFound: inspectionData.issuesFound || null,
				actionTaken: inspectionData.actionTaken || null,
				passed: inspectionData.passed
			};

			await api.createVehicleInventoryInspection(inspection);
			showInspectionModal = false;
			selectedAssignment = null;
			await loadAssignments();
		} catch (err) {
			console.error('Failed to create inspection:', err);
			alert($_('vehicles.inventory.messages.inspectionFailed'));
		}
	}

	async function handleRemove(assignment) {
		if (!confirm($_('vehicles.inventory.messages.removeConfirm', { values: { itemName: assignment.item?.itemName } }))) {
			return;
		}

		try {
			await api.removeVehicleInventoryAssignment(assignment.assignment.id);
			await loadAssignments();
		} catch (err) {
			console.error('Failed to remove assignment:', err);
			alert($_('vehicles.inventory.messages.removeFailed'));
		}
	}

	function getConditionColor(condition) {
		const option = conditionOptions.find(o => o.value === condition);
		return option?.color || 'bg-gray-100 text-gray-800';
	}

	function getStatusColor(status) {
		const option = statusOptions.find(o => o.value === status);
		return option?.color || 'bg-gray-100 text-gray-800';
	}

	function isExpiringSoon(expirationDate) {
		if (!expirationDate) return false;
		const daysUntilExpiry = Math.floor((expirationDate - Date.now()) / (1000 * 60 * 60 * 24));
		return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
	}

	function isExpired(expirationDate) {
		if (!expirationDate) return false;
		return expirationDate < Date.now();
	}

	function handleRequestFromWarehouse() {
		// Navigate to create transfer request with warehouse-to-vehicle type
		goto(`/materials/transfer-requests/new?transferType=warehouse-to-vehicle&vehicleId=${vehicleId}`);
	}

	function handleReturnToWarehouse() {
		// Navigate to create transfer request with vehicle-to-warehouse type
		goto(`/materials/transfer-requests/new?transferType=vehicle-to-warehouse&vehicleId=${vehicleId}`);
	}
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-lg font-semibold text-gray-900">{title || $_('vehicles.inventory.title')}</h3>
		<div class="flex space-x-2">
			<button on:click={handleRequestFromWarehouse} class="btn btn-secondary">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
				</svg>
				{$_('vehicles.inventory.requestFromWarehouse')}
			</button>
			<button on:click={handleReturnToWarehouse} class="btn btn-secondary">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
				</svg>
				{$_('vehicles.inventory.returnToWarehouse')}
			</button>
			<button on:click={openAddModal} class="btn btn-primary">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
				</svg>
				{$_('vehicles.inventory.addItem')}
			</button>
		</div>
	</div>

	{#if loading}
		<div class="text-center py-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
			<p class="mt-2 text-sm text-gray-500">{$_('vehicles.inventory.loadingInventory')}</p>
		</div>
	{:else if error}
		<div class="text-center py-8 text-red-500">
			<svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
			</svg>
			<p class="mt-2">{error}</p>
		</div>
	{:else if assignments.length === 0}
		<div class="text-center py-8 text-gray-500">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
			</svg>
			<p class="mt-2">{$_('vehicles.inventory.noItems')}</p>
			<button on:click={openAddModal} class="mt-4 btn btn-primary">
				{$_('vehicles.inventory.addFirstItem')}
			</button>
		</div>
	{:else}
		<div class="space-y-3">
			{#each assignments as material}
				<div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
					<div class="flex justify-between items-start">
						<div class="flex-1">
							<div class="flex items-center space-x-2 mb-2">
								<h4 class="font-medium text-gray-900">{material.materialName}</h4>
								<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
									{material.materialCode}
								</span>
							</div>

							<div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600">
								<div>
									<span class="font-medium">{$_('vehicles.inventory.quantity')}:</span> {material.quantity}
								</div>
								{#if material.lastTransferDate}
									<div>
										<span class="font-medium">Last Transfer:</span> {new Date(material.lastTransferDate).toLocaleDateString()}
									</div>
								{/if}
								{#if material.requestNumber}
									<div>
										<span class="font-medium">Request:</span> {material.requestNumber}
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Add Item Modal -->
<Modal open={showAddModal} title={$_('vehicles.inventory.addItem')} on:close={() => showAddModal = false}>
	<form on:submit|preventDefault={handleAddSubmit} class="space-y-4">
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.item')} *</label>
			<select bind:value={formData.itemId} required class="input">
				<option value="">{$_('vehicles.inventory.placeholders.selectItem')}</option>
				{#each items as item}
					<option value={item.item.id}>{item.item.itemName}</option>
				{/each}
			</select>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.quantity')}</label>
				<input type="number" bind:value={formData.quantity} min="1" class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.condition')}</label>
				<select bind:value={formData.condition} class="input">
					{#each conditionOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.serialNumber')}</label>
				<input type="text" bind:value={formData.serialNumber} class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.batchNumber')}</label>
				<input type="text" bind:value={formData.batchNumber} class="input" />
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.location')}</label>
			<input type="text" bind:value={formData.location} placeholder={$_('vehicles.inventory.placeholders.location')} class="input" />
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.expirationDate')}</label>
				<input type="date" bind:value={formData.expirationDate} class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.certificationExpiry')}</label>
				<input type="date" bind:value={formData.certificationExpiryDate} class="input" />
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.certificationNumber')}</label>
			<input type="text" bind:value={formData.certificationNumber} class="input" />
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.notes')}</label>
			<textarea bind:value={formData.notes} rows="3" class="input"></textarea>
		</div>

		<div class="flex justify-end space-x-3 pt-4">
			<button type="button" on:click={() => showAddModal = false} class="btn btn-secondary">
				{$_('common.cancel')}
			</button>
			<button type="submit" class="btn btn-primary">
				{$_('vehicles.inventory.addItem')}
			</button>
		</div>
	</form>
</Modal>

<!-- Edit Item Modal -->
<Modal open={showEditModal} title={$_('vehicles.inventory.editItem')} on:close={() => { showEditModal = false; selectedAssignment = null; }}>
	<form on:submit|preventDefault={handleEditSubmit} class="space-y-4">
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.item')}</label>
			<input type="text" value={selectedAssignment?.item?.itemName || ''} disabled class="input bg-gray-50" />
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.quantity')}</label>
				<input type="number" bind:value={formData.quantity} min="1" class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.condition')}</label>
				<select bind:value={formData.condition} class="input">
					{#each conditionOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.status')}</label>
			<select bind:value={formData.status} class="input">
				{#each statusOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.serialNumber')}</label>
				<input type="text" bind:value={formData.serialNumber} class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.batchNumber')}</label>
				<input type="text" bind:value={formData.batchNumber} class="input" />
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.location')}</label>
			<input type="text" bind:value={formData.location} placeholder={$_('vehicles.inventory.placeholders.location')} class="input" />
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.expirationDate')}</label>
				<input type="date" bind:value={formData.expirationDate} class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.certificationExpiry')}</label>
				<input type="date" bind:value={formData.certificationExpiryDate} class="input" />
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.certificationNumber')}</label>
			<input type="text" bind:value={formData.certificationNumber} class="input" />
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.notes')}</label>
			<textarea bind:value={formData.notes} rows="3" class="input"></textarea>
		</div>

		<div class="flex justify-end space-x-3 pt-4">
			<button type="button" on:click={() => { showEditModal = false; selectedAssignment = null; }} class="btn btn-secondary">
				{$_('common.cancel')}
			</button>
			<button type="submit" class="btn btn-primary">
				{$_('vehicles.inventory.updateItem')}
			</button>
		</div>
	</form>
</Modal>

<!-- Inspection Modal -->
<Modal open={showInspectionModal} title={$_('vehicles.inventory.inspection.title')} on:close={() => { showInspectionModal = false; selectedAssignment = null; }}>
	<form on:submit|preventDefault={handleInspectionSubmit} class="space-y-4">
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.item')}</label>
			<input type="text" value={selectedAssignment?.item?.itemName || ''} disabled class="input bg-gray-50" />
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.inspection.inspectionType')} *</label>
				<select bind:value={inspectionData.inspectionType} required class="input">
					<option value="routine">{$_('vehicles.inventory.inspection.types.routine')}</option>
					<option value="emergency">{$_('vehicles.inventory.inspection.types.emergency')}</option>
					<option value="certification">{$_('vehicles.inventory.inspection.types.certification')}</option>
					<option value="repair">{$_('vehicles.inventory.inspection.types.repair')}</option>
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.condition')} *</label>
				<select bind:value={inspectionData.condition} required class="input">
					{#each conditionOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div>
			<label class="flex items-center space-x-2">
				<input type="checkbox" bind:checked={inspectionData.passed} class="rounded" />
				<span class="text-sm font-medium text-gray-700">{$_('vehicles.inventory.inspection.passed')}</span>
			</label>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.inspection.issuesFound')}</label>
			<textarea bind:value={inspectionData.issuesFound} rows="2" class="input"></textarea>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.inspection.actionTaken')}</label>
			<textarea bind:value={inspectionData.actionTaken} rows="2" class="input"></textarea>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('vehicles.inventory.notes')}</label>
			<textarea bind:value={inspectionData.notes} rows="3" class="input"></textarea>
		</div>

		<div class="flex justify-end space-x-3 pt-4">
			<button type="button" on:click={() => { showInspectionModal = false; selectedAssignment = null; }} class="btn btn-secondary">
				{$_('common.cancel')}
			</button>
			<button type="submit" class="btn btn-primary">
				{$_('vehicles.inventory.recordInspection')}
			</button>
		</div>
	</form>
</Modal>
