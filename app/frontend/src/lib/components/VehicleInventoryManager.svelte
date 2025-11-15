<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import Modal from '$lib/components/Modal.svelte';
	import { createFormTracker } from '$lib/utils/formTracking';

	export let vehicleId;
	export let title = null;

	let assignments = [];
	let items = [];
	let categories = [];
	let loading = true;
	let error = null;
	let formTracker = null; // For tracking changed fields when editing

	// Modal state
	let showAddModal = false;
	let showEditModal = false;
	let showInspectionModal = false;
	let showDispenseModal = false;
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
		manufactureDate: '',
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

	// Dispensing form data
	let dispensingData = {
		quantityDispensed: 1,
		patientName: '',
		patientId: '',
		patientAge: '',
		patientGender: '',
		incidentType: '',
		incidentLocation: '',
		incidentDescription: '',
		diagnosis: '',
		symptoms: '',
		treatmentNotes: '',
		dispatchNumber: '',
		missionId: '',
		reason: '',
		notes: ''
	};

	$: conditionOptions = [
		{ value: 'excellent', label: $_('inventory.excellent'), color: 'bg-green-100 text-green-800' },
		{ value: 'good', label: $_('inventory.good'), color: 'bg-blue-100 text-blue-800' },
		{ value: 'fair', label: $_('inventory.fair'), color: 'bg-yellow-100 text-yellow-800' },
		{ value: 'poor', label: $_('inventory.poor'), color: 'bg-orange-100 text-orange-800' },
		{ value: 'damaged', label: $_('inventory.damaged'), color: 'bg-red-100 text-red-800' }
	];

	$: statusOptions = [
		{ value: 'active', label: $_('inventory.active'), color: 'bg-green-100 text-green-800' },
		{ value: 'expired', label: $_('inventory.expired'), color: 'bg-red-100 text-red-800' },
		{ value: 'damaged', label: $_('inventory.damaged'), color: 'bg-orange-100 text-orange-800' },
		{ value: 'removed', label: $_('inventory.removed'), color: 'bg-gray-100 text-gray-800' },
		{ value: 'maintenance', label: $_('inventory.maintenance'), color: 'bg-blue-100 text-blue-800' }
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
			const response = await api.getVehicleInventoryAssignments(vehicleId);
			assignments = response.data || [];
		} catch (err) {
			console.error('Failed to load vehicle inventory:', err);
			error = $_('inventory.messages.loadFailed');
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
			manufactureDate: '',
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
			manufactureDate: assignment.assignment.manufactureDate
				? new Date(assignment.assignment.manufactureDate).toISOString().split('T')[0]
				: '',
			certificationNumber: assignment.assignment.certificationNumber || '',
			certificationExpiryDate: assignment.assignment.certificationExpiryDate
				? new Date(assignment.assignment.certificationExpiryDate).toISOString().split('T')[0]
				: '',
			notes: assignment.assignment.notes || ''
		};
		// Create form tracker with original data for change detection
		formTracker = createFormTracker(formData);
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

	function openDispenseModal(assignment) {
		selectedAssignment = assignment;
		dispensingData = {
			quantityDispensed: 1,
			patientName: '',
			patientId: '',
			patientAge: '',
			patientGender: '',
			incidentType: '',
			incidentLocation: '',
			incidentDescription: '',
			diagnosis: '',
			symptoms: '',
			treatmentNotes: '',
			dispatchNumber: '',
			missionId: '',
			reason: '',
			notes: ''
		};
		showDispenseModal = true;
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
				manufactureDate: formData.manufactureDate ? new Date(formData.manufactureDate).getTime() : null,
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
			alert($_('inventory.messages.saveFailed'));
		}
	}

	async function handleEditSubmit() {
		try {
			const fullAssignmentData = {
				itemId: parseInt(formData.itemId),
				quantity: parseInt(formData.quantity),
				serialNumber: formData.serialNumber || null,
				batchNumber: formData.batchNumber || null,
				condition: formData.condition,
				status: formData.status,
				location: formData.location || null,
				expirationDate: formData.expirationDate ? new Date(formData.expirationDate).getTime() : null,
				manufactureDate: formData.manufactureDate ? new Date(formData.manufactureDate).getTime() : null,
				certificationNumber: formData.certificationNumber || null,
				certificationExpiryDate: formData.certificationExpiryDate ? new Date(formData.certificationExpiryDate).getTime() : null,
				notes: formData.notes || null
			};

			// For updates, detect and send only changed fields
			const changedFields = formTracker ? formTracker.detectChanges(fullAssignmentData) : fullAssignmentData;

			// Apply type conversions to changed fields
			const payload = {};
			for (const key in changedFields) {
				if (key === 'itemId' || key === 'quantity') {
					payload[key] = parseInt(changedFields[key]);
				} else if (key === 'expirationDate' || key === 'manufactureDate' || key === 'certificationExpiryDate') {
					payload[key] = changedFields[key] ? new Date(changedFields[key]).getTime() : null;
				} else {
					payload[key] = changedFields[key];
				}
			}

			// Only send PATCH if there are changes
			if (Object.keys(payload).length > 0) {
				await api.patchVehicleInventoryAssignment(selectedAssignment.assignment.id, payload);
				alert($_('inventory.messages.updateSuccess') || 'Assignment updated successfully');
			} else {
				alert($_('inventory.messages.noChanges') || 'No changes to save');
			}
			showEditModal = false;
			selectedAssignment = null;
			await loadAssignments();
		} catch (err) {
			console.error('Failed to update assignment:', err);
			alert($_('inventory.messages.updateFailed'));
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
			alert($_('inventory.messages.inspectionFailed'));
		}
	}

	async function handleDispenseSubmit() {
		try {
			const dispenseData = {
				assignmentId: selectedAssignment.assignment.id,
				vehicleId: parseInt(vehicleId),
				dispensedBy: JSON.parse(localStorage.getItem('user'))?.id || 1,
				dispensedDate: Date.now(),
				quantityDispensed: parseInt(dispensingData.quantityDispensed),
				patientName: dispensingData.patientName || null,
				patientId: dispensingData.patientId || null,
				patientAge: dispensingData.patientAge ? parseInt(dispensingData.patientAge) : null,
				patientGender: dispensingData.patientGender || null,
				incidentType: dispensingData.incidentType || null,
				incidentLocation: dispensingData.incidentLocation || null,
				incidentDescription: dispensingData.incidentDescription || null,
				diagnosis: dispensingData.diagnosis || null,
				symptoms: dispensingData.symptoms || null,
				treatmentNotes: dispensingData.treatmentNotes || null,
				dispatchNumber: dispensingData.dispatchNumber || null,
				missionId: dispensingData.missionId ? parseInt(dispensingData.missionId) : null,
				reason: dispensingData.reason || null,
				notes: dispensingData.notes || null
			};

			await api.dispenseInventoryItem(dispenseData);
			showDispenseModal = false;
			selectedAssignment = null;
			await loadAssignments();
			alert($_('inventory.dispensing.success'));
		} catch (err) {
			console.error('Failed to dispense item:', err);
			alert($_('inventory.messages.dispenseFailed'));
		}
	}

	async function handleRemove(assignment) {
		if (!confirm($_('inventory.messages.removeConfirm', { values: { itemName: assignment.item?.itemName } }))) {
			return;
		}

		try {
			await api.removeVehicleInventoryAssignment(assignment.assignment.id);
			await loadAssignments();
		} catch (err) {
			console.error('Failed to remove assignment:', err);
			alert($_('inventory.messages.removeFailed'));
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

	function getExpirationStatus(expirationDate) {
		if (!expirationDate) return null;
		const daysUntilExpiry = Math.floor((expirationDate - Date.now()) / (1000 * 60 * 60 * 24));

		if (daysUntilExpiry < 0) {
			return { status: 'expired', color: 'bg-red-100 text-red-800 border-red-200', message: $_('inventory.expired') };
		} else if (daysUntilExpiry <= 30) {
			return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', message: $_('inventory.expiringSoon') };
		} else {
			return { status: 'valid', color: 'bg-green-100 text-green-800 border-green-200', message: $_('inventory.valid') };
		}
	}

	function handleRequestFromWarehouse() {
		goto(`/materials/transfer-requests/new?transferType=warehouse-to-vehicle&vehicleId=${vehicleId}`);
	}

	function handleReturnToWarehouse() {
		goto(`/materials/transfer-requests/new?transferType=vehicle-to-warehouse&vehicleId=${vehicleId}`);
	}
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-lg font-semibold text-gray-900">{title || $_('inventory.title')}</h3>
		<div class="flex space-x-2">
			<button on:click={handleRequestFromWarehouse} class="btn btn-secondary text-sm">
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
				</svg>
				{$_('vehicles.inventory.requestFromWarehouse')}
			</button>
			<button on:click={handleReturnToWarehouse} class="btn btn-secondary text-sm">
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
				</svg>
				{$_('vehicles.inventory.returnToWarehouse')}
			</button>
			<button on:click={openAddModal} class="btn btn-primary text-sm">
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
				</svg>
				{$_('inventory.addItem')}
			</button>
		</div>
	</div>

	{#if loading}
		<div class="text-center py-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
			<p class="mt-2 text-sm text-gray-500">Loading inventory...</p>
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
			<p class="mt-2">{$_('inventory.noItems')}</p>
			<button on:click={openAddModal} class="mt-4 btn btn-primary">
				{$_('inventory.addItem')}
			</button>
		</div>
	{:else}
		<div class="space-y-3">
			{#each assignments as assignment}
				{@const expStatus = getExpirationStatus(assignment.assignment.expirationDate)}
				<div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
					<div class="flex justify-between items-start">
						<div class="flex-1">
							<div class="flex items-center space-x-2 mb-2">
								<h4 class="font-medium text-gray-900">{assignment.item?.itemName || 'Unknown Item'}</h4>
								<span class="px-2 py-1 text-xs font-medium rounded-full {getConditionColor(assignment.assignment.condition)}">
									{assignment.assignment.condition}
								</span>
								<span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(assignment.assignment.status)}">
									{assignment.assignment.status}
								</span>
								{#if expStatus}
									<span class="px-2 py-1 text-xs font-medium rounded-full border {expStatus.color}">
										{expStatus.message}
									</span>
								{/if}
							</div>

							<div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-2">
								<div>
									<span class="font-medium">{$_('inventory.quantity')}:</span> {assignment.assignment.quantity}
								</div>
								{#if assignment.assignment.serialNumber}
									<div>
										<span class="font-medium">{$_('inventory.serialNumber')}:</span> {assignment.assignment.serialNumber}
									</div>
								{/if}
								{#if assignment.assignment.location}
									<div>
										<span class="font-medium">{$_('inventory.location')}:</span> {assignment.assignment.location}
									</div>
								{/if}
								{#if assignment.assignment.expirationDate}
									<div>
										<span class="font-medium">{$_('inventory.expirationDate')}:</span> {new Date(assignment.assignment.expirationDate).toLocaleDateString()}
									</div>
								{/if}
							</div>

							{#if assignment.category}
								<div class="text-sm text-gray-500">
									<span class="font-medium">Category:</span> {assignment.category.categoryName}
								</div>
							{/if}
						</div>

						<div class="flex items-center space-x-2 ml-4">
							<button
								on:click={() => openDispenseModal(assignment)}
								class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
								title="Dispense"
								disabled={assignment.assignment.quantity === 0}
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
								</svg>
							</button>
							<button
								on:click={() => openInspectionModal(assignment)}
								class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
								title="Inspect"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
								</svg>
							</button>
							<button
								on:click={() => openEditModal(assignment)}
								class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
								title="Edit"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
								</svg>
							</button>
							<button
								on:click={() => handleRemove(assignment)}
								class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
								title="Remove"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Add Item Modal -->
<Modal open={showAddModal} title={$_('inventory.addItem')} on:close={() => showAddModal = false}>
	<form on:submit|preventDefault={handleAddSubmit} class="space-y-4">
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.itemName')} *</label>
			<select bind:value={formData.itemId} required class="input">
				<option value="">Select item...</option>
				{#each items as item}
					<option value={item.item.id}>{item.item.itemName}</option>
				{/each}
			</select>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.quantity')}</label>
				<input type="number" bind:value={formData.quantity} min="1" class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.condition')}</label>
				<select bind:value={formData.condition} class="input">
					{#each conditionOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.serialNumber')}</label>
				<input type="text" bind:value={formData.serialNumber} class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.batchNumber')}</label>
				<input type="text" bind:value={formData.batchNumber} class="input" />
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.location')}</label>
			<input type="text" bind:value={formData.location} placeholder="e.g., trunk, cabin" class="input" />
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.manufactureDate')}</label>
				<input type="date" bind:value={formData.manufactureDate} class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.expirationDate')}</label>
				<input type="date" bind:value={formData.expirationDate} class="input" />
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Certification Number</label>
				<input type="text" bind:value={formData.certificationNumber} class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Certification Expiry</label>
				<input type="date" bind:value={formData.certificationExpiryDate} class="input" />
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.notes')}</label>
			<textarea bind:value={formData.notes} rows="3" class="input"></textarea>
		</div>

		<div class="flex justify-end space-x-3 pt-4">
			<button type="button" on:click={() => showAddModal = false} class="btn btn-secondary">
				Cancel
			</button>
			<button type="submit" class="btn btn-primary">
				{$_('inventory.addItem')}
			</button>
		</div>
	</form>
</Modal>

<!-- Edit Item Modal -->
<Modal open={showEditModal} title={$_('inventory.editItem')} on:close={() => { showEditModal = false; selectedAssignment = null; }}>
	<form on:submit|preventDefault={handleEditSubmit} class="space-y-4">
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.itemName')}</label>
			<input type="text" value={selectedAssignment?.item?.itemName || ''} disabled class="input bg-gray-50" />
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.quantity')}</label>
				<input type="number" bind:value={formData.quantity} min="0" class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.condition')}</label>
				<select bind:value={formData.condition} class="input">
					{#each conditionOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.status')}</label>
			<select bind:value={formData.status} class="input">
				{#each statusOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.serialNumber')}</label>
				<input type="text" bind:value={formData.serialNumber} class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.batchNumber')}</label>
				<input type="text" bind:value={formData.batchNumber} class="input" />
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.location')}</label>
			<input type="text" bind:value={formData.location} class="input" />
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.manufactureDate')}</label>
				<input type="date" bind:value={formData.manufactureDate} class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.expirationDate')}</label>
				<input type="date" bind:value={formData.expirationDate} class="input" />
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.notes')}</label>
			<textarea bind:value={formData.notes} rows="3" class="input"></textarea>
		</div>

		<div class="flex justify-end space-x-3 pt-4">
			<button type="button" on:click={() => { showEditModal = false; selectedAssignment = null; }} class="btn btn-secondary">
				Cancel
			</button>
			<button type="submit" class="btn btn-primary">
				Update
			</button>
		</div>
	</form>
</Modal>

<!-- Inspection Modal -->
<Modal open={showInspectionModal} title="Record Inspection" on:close={() => { showInspectionModal = false; selectedAssignment = null; }}>
	<form on:submit|preventDefault={handleInspectionSubmit} class="space-y-4">
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">Item</label>
			<input type="text" value={selectedAssignment?.item?.itemName || ''} disabled class="input bg-gray-50" />
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Inspection Type *</label>
				<select bind:value={inspectionData.inspectionType} required class="input">
					<option value="routine">Routine</option>
					<option value="emergency">Emergency</option>
					<option value="certification">Certification</option>
					<option value="repair">Repair</option>
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.condition')} *</label>
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
				<span class="text-sm font-medium text-gray-700">Inspection Passed</span>
			</label>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">Issues Found</label>
			<textarea bind:value={inspectionData.issuesFound} rows="2" class="input"></textarea>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">Action Taken</label>
			<textarea bind:value={inspectionData.actionTaken} rows="2" class="input"></textarea>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.notes')}</label>
			<textarea bind:value={inspectionData.notes} rows="3" class="input"></textarea>
		</div>

		<div class="flex justify-end space-x-3 pt-4">
			<button type="button" on:click={() => { showInspectionModal = false; selectedAssignment = null; }} class="btn btn-secondary">
				Cancel
			</button>
			<button type="submit" class="btn btn-primary">
				Record Inspection
			</button>
		</div>
	</form>
</Modal>

<!-- Dispense Item Modal -->
<Modal open={showDispenseModal} title={$_('inventory.dispensing.title')} on:close={() => { showDispenseModal = false; selectedAssignment = null; }}>
	<form on:submit|preventDefault={handleDispenseSubmit} class="space-y-4">
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
			<div class="flex items-center space-x-2">
				<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<div class="text-sm">
					<span class="font-medium text-gray-900">{selectedAssignment?.item?.itemName || ''}</span>
					<span class="text-gray-600 ml-2">Available: {selectedAssignment?.assignment.quantity || 0}</span>
				</div>
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.quantityDispensed')} *</label>
			<input
				type="number"
				bind:value={dispensingData.quantityDispensed}
				min="1"
				max={selectedAssignment?.assignment.quantity || 1}
				required
				class="input"
			/>
		</div>

		<!-- Patient Information -->
		<div class="border-t pt-4">
			<h4 class="font-medium text-gray-900 mb-3">{$_('inventory.dispensing.patientInfo')}</h4>

			<div class="space-y-3">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.patientName')}</label>
					<input type="text" bind:value={dispensingData.patientName} class="input" />
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.patientId')}</label>
						<input type="text" bind:value={dispensingData.patientId} class="input" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.patientAge')}</label>
						<input type="number" bind:value={dispensingData.patientAge} min="0" class="input" />
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.patientGender')}</label>
					<select bind:value={dispensingData.patientGender} class="input">
						<option value="">Select...</option>
						<option value="male">{$_('inventory.dispensing.male')}</option>
						<option value="female">{$_('inventory.dispensing.female')}</option>
						<option value="other">{$_('inventory.dispensing.other')}</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Incident Information -->
		<div class="border-t pt-4">
			<h4 class="font-medium text-gray-900 mb-3">{$_('inventory.dispensing.incidentInfo')}</h4>

			<div class="space-y-3">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.incidentType')}</label>
					<input type="text" bind:value={dispensingData.incidentType} placeholder="e.g., emergency, routine" class="input" />
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.incidentLocation')}</label>
					<input type="text" bind:value={dispensingData.incidentLocation} class="input" />
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.incidentDescription')}</label>
					<textarea bind:value={dispensingData.incidentDescription} rows="2" class="input"></textarea>
				</div>
			</div>
		</div>

		<!-- Medical Information -->
		<div class="border-t pt-4">
			<h4 class="font-medium text-gray-900 mb-3">{$_('inventory.dispensing.medicalInfo')}</h4>

			<div class="space-y-3">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.symptoms')}</label>
					<textarea bind:value={dispensingData.symptoms} rows="2" class="input"></textarea>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.diagnosis')}</label>
					<textarea bind:value={dispensingData.diagnosis} rows="2" class="input"></textarea>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.treatmentNotes')}</label>
					<textarea bind:value={dispensingData.treatmentNotes} rows="2" class="input"></textarea>
				</div>
			</div>
		</div>

		<!-- Dispatch Information -->
		<div class="border-t pt-4">
			<h4 class="font-medium text-gray-900 mb-3">{$_('inventory.dispensing.dispatchInfo')}</h4>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.dispatchNumber')}</label>
					<input type="text" bind:value={dispensingData.dispatchNumber} class="input" />
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.missionId')}</label>
					<input type="number" bind:value={dispensingData.missionId} class="input" />
				</div>
			</div>
		</div>

		<!-- Additional Notes -->
		<div class="border-t pt-4">
			<div class="space-y-3">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.dispensing.reason')}</label>
					<input type="text" bind:value={dispensingData.reason} class="input" />
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">{$_('inventory.notes')}</label>
					<textarea bind:value={dispensingData.notes} rows="2" class="input"></textarea>
				</div>
			</div>
		</div>

		<div class="flex justify-end space-x-3 pt-4 border-t">
			<button type="button" on:click={() => { showDispenseModal = false; selectedAssignment = null; }} class="btn btn-secondary">
				Cancel
			</button>
			<button type="submit" class="btn btn-primary">
				{$_('inventory.dispensing.confirmDispense')}
			</button>
		</div>
	</form>
</Modal>
