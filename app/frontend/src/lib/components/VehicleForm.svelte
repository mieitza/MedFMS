<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import { createFormTracker } from '$lib/utils/formTracking';

	export let vehicle = null;
	export let brands = [];
	export let models = [];
	export let vehicleTypes = [];
	export let vehicleStatuses = [];
	export let fuelTypes = [];
	export let locations = [];
	export let departments = [];
	export let employees = [];

	const dispatch = createEventDispatcher();

	let formData = {
		vehicleCode: '',
		licensePlate: '',
		brandId: null,
		modelId: null,
		year: new Date().getFullYear(),
		fuelTypeId: null,
		vehicleTypeId: null,
		statusId: null,
		locationId: null,
		departmentId: null,
		employeeId: null,
		odometer: '',
		description: '',
		// ANMDM Authorization fields
		anmdmAuthNumber: '',
		anmdmAuthType: '',
		anmdmIssueDate: '',
		anmdmExpiryDate: '',
		anmdmIssuingAuthority: '',
		anmdmNotes: '',
		// Document expiry dates
		rovinietaExpiryDate: '',
		asigurareExpiryDate: '',
		itpExpiryDate: ''
	};

	let filteredModels = [];
	let loading = false;
	let errors = {};
	let formTracker = null; // For tracking changed fields when editing

	// ANMDM Document state
	let anmdmDocumentFile = null;
	let anmdmDocumentUploading = false;
	let anmdmDocumentError = '';
	let hasAnmdmDocument = false;
	let anmdmFileInput;

	// Initialize form with vehicle data if editing
	onMount(() => {
		if (vehicle) {
			formData = {
				vehicleCode: vehicle.vehicleCode || '',
				licensePlate: vehicle.licensePlate || '',
				brandId: vehicle.brandId || null,
				modelId: vehicle.modelId || null,
				year: vehicle.year || new Date().getFullYear(),
				fuelTypeId: vehicle.fuelTypeId || null,
				vehicleTypeId: vehicle.vehicleTypeId || null,
				statusId: vehicle.statusId || null,
				locationId: vehicle.locationId || null,
				departmentId: vehicle.departmentId || null,
				employeeId: vehicle.employeeId || null,
				odometer: vehicle.odometer || '',
				description: vehicle.description || '',
				// ANMDM Authorization fields
				anmdmAuthNumber: vehicle.anmdmAuthNumber || '',
				anmdmAuthType: vehicle.anmdmAuthType || '',
				anmdmIssueDate: vehicle.anmdmIssueDate ? new Date(vehicle.anmdmIssueDate).toISOString().split('T')[0] : '',
				anmdmExpiryDate: vehicle.anmdmExpiryDate ? new Date(vehicle.anmdmExpiryDate).toISOString().split('T')[0] : '',
				anmdmIssuingAuthority: vehicle.anmdmIssuingAuthority || '',
				anmdmNotes: vehicle.anmdmNotes || '',
				// Document expiry dates
				rovinietaExpiryDate: vehicle.rovinietaExpiryDate ? new Date(vehicle.rovinietaExpiryDate).toISOString().split('T')[0] : '',
				asigurareExpiryDate: vehicle.asigurareExpiryDate ? new Date(vehicle.asigurareExpiryDate).toISOString().split('T')[0] : '',
				itpExpiryDate: vehicle.itpExpiryDate ? new Date(vehicle.itpExpiryDate).toISOString().split('T')[0] : ''
			};
			updateFilteredModels();

			// Check if vehicle has ANMDM document
			hasAnmdmDocument = !!vehicle.anmdmDocumentPath;

			// Create form tracker with original data for change detection
			formTracker = createFormTracker(formData);
		}
	});

	function updateFilteredModels() {
		if (formData.brandId) {
			filteredModels = models.filter(model => model.brandId == formData.brandId);
			if (!filteredModels.find(model => model.id == formData.modelId)) {
				formData.modelId = null;
			}
		} else {
			filteredModels = [];
			formData.modelId = null;
		}
	}

	function handleBrandChange() {
		updateFilteredModels();
	}

	// ANMDM Document handling functions
	function handleAnmdmFileSelect(event) {
		const file = event.target.files?.[0];
		if (file) {
			if (file.type !== 'application/pdf') {
				anmdmDocumentError = $_('vehicles.anmdmDocumentPdfOnly');
				return;
			}
			if (file.size > 10 * 1024 * 1024) {
				anmdmDocumentError = $_('vehicles.anmdmDocumentTooLarge');
				return;
			}
			anmdmDocumentFile = file;
			anmdmDocumentError = '';
		}
	}

	async function uploadAnmdmDocument() {
		if (!anmdmDocumentFile || !vehicle?.id) return;

		anmdmDocumentUploading = true;
		anmdmDocumentError = '';

		try {
			await api.uploadAnmdmDocument(vehicle.id, anmdmDocumentFile);
			hasAnmdmDocument = true;
			anmdmDocumentFile = null;
			if (anmdmFileInput) anmdmFileInput.value = '';
			dispatch('documentUploaded');
		} catch (err) {
			anmdmDocumentError = err.message || $_('vehicles.anmdmDocumentUploadFailed');
		} finally {
			anmdmDocumentUploading = false;
		}
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
			anmdmDocumentError = err.message || $_('vehicles.anmdmDocumentDownloadFailed');
		}
	}

	async function deleteAnmdmDocument() {
		if (!vehicle?.id || !confirm($_('vehicles.confirmDeleteAnmdmDocument'))) return;

		try {
			await api.deleteAnmdmDocument(vehicle.id);
			hasAnmdmDocument = false;
			dispatch('documentDeleted');
		} catch (err) {
			anmdmDocumentError = err.message || $_('vehicles.anmdmDocumentDeleteFailed');
		}
	}

	function clearAnmdmFileSelection() {
		anmdmDocumentFile = null;
		if (anmdmFileInput) anmdmFileInput.value = '';
	}

	function validateForm() {
		errors = {};

		if (!formData.vehicleCode.trim()) {
			errors.vehicleCode = $_('validation.required');
		}

		if (!formData.licensePlate.trim()) {
			errors.licensePlate = $_('validation.required');
		}

		if (!formData.brandId) {
			errors.brandId = $_('validation.required');
		}

		if (!formData.modelId) {
			errors.modelId = $_('validation.required');
		}

		if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
			errors.year = $_('validation.required');
		}

		if (!formData.fuelTypeId) {
			errors.fuelTypeId = $_('validation.required');
		}

		if (!formData.vehicleTypeId) {
			errors.vehicleTypeId = $_('validation.required');
		}

		if (!formData.statusId) {
			errors.statusId = $_('validation.required');
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			return;
		}

		loading = true;

		try {
			// Prepare payload with proper type conversions
			const fullPayload = {
				...formData,
				brandId: parseInt(formData.brandId),
				modelId: parseInt(formData.modelId),
				year: parseInt(formData.year),
				fuelTypeId: parseInt(formData.fuelTypeId),
				vehicleTypeId: parseInt(formData.vehicleTypeId),
				statusId: parseInt(formData.statusId),
				locationId: formData.locationId ? parseInt(formData.locationId) : undefined,
				departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
				employeeId: formData.employeeId ? parseInt(formData.employeeId) : undefined,
				odometer: formData.odometer ? parseInt(formData.odometer) : undefined
			};

			if (vehicle) {
				// For updates, detect and send only changed fields
				const changedFields = formTracker ? formTracker.detectChanges(fullPayload) : fullPayload;

				// Apply same type conversions to changed fields
				const payload = {};
				for (const key in changedFields) {
					if (key === 'brandId' || key === 'modelId' || key === 'year' ||
					    key === 'fuelTypeId' || key === 'vehicleTypeId' || key === 'statusId') {
						payload[key] = parseInt(changedFields[key]);
					} else if (key === 'locationId' || key === 'departmentId' || key === 'employeeId') {
						payload[key] = changedFields[key] ? parseInt(changedFields[key]) : undefined;
					} else if (key === 'odometer') {
						payload[key] = changedFields[key] ? parseInt(changedFields[key]) : undefined;
					} else {
						payload[key] = changedFields[key];
					}
				}

				// Only send PATCH if there are changes
				if (Object.keys(payload).length > 0) {
					await api.patchVehicle(vehicle.id, payload);
					dispatch('success', { type: 'update', data: payload });
				} else {
					// No changes, just close the form
					dispatch('success', { type: 'update', data: {} });
				}
			} else {
				await api.createVehicle(fullPayload);
				dispatch('success', { type: 'create', data: fullPayload });
			}
		} catch (error) {
			console.error('Failed to save vehicle:', error);
			dispatch('error', { message: $_('vehicles.messages.saveFailed') });
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		dispatch('cancel');
	}
</script>

<div class="space-y-6">
	<form on:submit|preventDefault={handleSubmit}>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Vehicle Code -->
			<div>
				<label for="vehicleCode" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('vehicles.vehicleCode')} *
				</label>
				<input
					type="text"
					id="vehicleCode"
					bind:value={formData.vehicleCode}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.vehicleCode}
					placeholder={$_('vehicles.placeholders.vehicleCode')}
					required
				/>
				{#if errors.vehicleCode}
					<p class="mt-1 text-sm text-red-600">{errors.vehicleCode}</p>
				{/if}
			</div>

			<!-- License Plate -->
			<div>
				<label for="licensePlate" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('vehicles.licensePlate')} *
				</label>
				<input
					type="text"
					id="licensePlate"
					bind:value={formData.licensePlate}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.licensePlate}
					placeholder={$_('vehicles.placeholders.licensePlate')}
					required
				/>
				{#if errors.licensePlate}
					<p class="mt-1 text-sm text-red-600">{errors.licensePlate}</p>
				{/if}
			</div>

			<!-- Brand -->
			<div>
				<label for="brandId" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('vehicles.brand')} *
				</label>
				<select
					id="brandId"
					bind:value={formData.brandId}
					on:change={handleBrandChange}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.brandId}
					required
				>
					<option value={null}>{$_('vehicles.placeholders.selectBrand')}</option>
					{#each brands as brand}
						<option value={brand.id}>{brand.brandName}</option>
					{/each}
				</select>
				{#if errors.brandId}
					<p class="mt-1 text-sm text-red-600">{errors.brandId}</p>
				{/if}
			</div>

			<!-- Model -->
			<div>
				<label for="modelId" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('vehicles.model')} *
				</label>
				<select
					id="modelId"
					bind:value={formData.modelId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.modelId}
					disabled={!formData.brandId}
					required
				>
					<option value={null}>{$_('vehicles.placeholders.selectModel')}</option>
					{#each filteredModels as model}
						<option value={model.id}>{model.modelName}</option>
					{/each}
				</select>
				{#if errors.modelId}
					<p class="mt-1 text-sm text-red-600">{errors.modelId}</p>
				{/if}
			</div>

			<!-- Year -->
			<div>
				<label for="year" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('vehicles.year')} *
				</label>
				<input
					type="number"
					id="year"
					bind:value={formData.year}
					min="1900"
					max={new Date().getFullYear() + 1}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.year}
					placeholder={$_('vehicles.placeholders.year')}
					required
				/>
				{#if errors.year}
					<p class="mt-1 text-sm text-red-600">{errors.year}</p>
				{/if}
			</div>

			<!-- Fuel Type -->
			<div>
				<label for="fuelTypeId" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('vehicles.fuelType')} *
				</label>
				<select
					id="fuelTypeId"
					bind:value={formData.fuelTypeId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.fuelTypeId}
					required
				>
					<option value={null}>{$_('vehicles.placeholders.selectFuelType')}</option>
					{#each fuelTypes as fuelType}
						<option value={fuelType.id}>{fuelType.fuelName}</option>
					{/each}
				</select>
				{#if errors.fuelTypeId}
					<p class="mt-1 text-sm text-red-600">{errors.fuelTypeId}</p>
				{/if}
			</div>

			<!-- Vehicle Type -->
			<div>
				<label for="vehicleTypeId" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('vehicles.vehicleType')} *
				</label>
				<select
					id="vehicleTypeId"
					bind:value={formData.vehicleTypeId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.vehicleTypeId}
					required
				>
					<option value={null}>{$_('vehicles.placeholders.selectVehicleType')}</option>
					{#each vehicleTypes as vehicleType}
						<option value={vehicleType.id}>{vehicleType.typeName}</option>
					{/each}
				</select>
				{#if errors.vehicleTypeId}
					<p class="mt-1 text-sm text-red-600">{errors.vehicleTypeId}</p>
				{/if}
			</div>

			<!-- Status -->
			<div>
				<label for="statusId" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('common.status')} *
				</label>
				<select
					id="statusId"
					bind:value={formData.statusId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.statusId}
					required
				>
					<option value={null}>{$_('vehicles.placeholders.selectStatus')}</option>
					{#each vehicleStatuses as status}
						<option value={status.id}>{status.statusName}</option>
					{/each}
				</select>
				{#if errors.statusId}
					<p class="mt-1 text-sm text-red-600">{errors.statusId}</p>
				{/if}
			</div>

			<!-- Location (Optional) -->
			<div>
				<label for="locationId" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('vehicles.location')}
				</label>
				<select
					id="locationId"
					bind:value={formData.locationId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value={null}>{$_('vehicles.placeholders.selectLocation')}</option>
					{#each locations as location}
						<option value={location.id}>{location.locationName}</option>
					{/each}
				</select>
			</div>

			<!-- Department (Optional) -->
			<div>
				<label for="departmentId" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('users.department')}
				</label>
				<select
					id="departmentId"
					bind:value={formData.departmentId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value={null}>{$_('vehicles.placeholders.selectDepartment')}</option>
					{#each departments as department}
						<option value={department.id}>{department.departmentName}</option>
					{/each}
				</select>
			</div>

			<!-- Employee (Optional) -->
			<div>
				<label for="employeeId" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('vehicles.assignedEmployee')}
				</label>
				<select
					id="employeeId"
					bind:value={formData.employeeId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value={null}>{$_('vehicles.placeholders.selectEmployee')}</option>
					{#each employees as employee}
						<option value={employee.id}>{employee.fullName}</option>
					{/each}
				</select>
			</div>

			<!-- Odometer (Optional) -->
			<div>
				<label for="odometer" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('vehicles.odometer')}
				</label>
				<input
					type="number"
					id="odometer"
					bind:value={formData.odometer}
					min="0"
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				/>
			</div>
		</div>

		<!-- Description -->
		<div class="mt-6">
			<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
				{$_('vehicles.description')}
			</label>
			<textarea
				id="description"
				bind:value={formData.description}
				rows="3"
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				placeholder={$_('vehicles.placeholders.description')}
			></textarea>
		</div>

		<!-- ANMDM Authorization Section -->
		<div class="mt-8">
			<h4 class="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
				{$_('vehicles.sections.anmdmAuth')}
			</h4>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Authorization Number -->
				<div>
					<label for="anmdmAuthNumber" class="block text-sm font-medium text-gray-700 mb-1">
						{$_('vehicles.anmdmAuthNumber')}
					</label>
					<input
						id="anmdmAuthNumber"
						type="text"
						bind:value={formData.anmdmAuthNumber}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						placeholder={$_('vehicles.placeholders.anmdmAuthNumber')}
					/>
				</div>

				<!-- Authorization Type -->
				<div>
					<label for="anmdmAuthType" class="block text-sm font-medium text-gray-700 mb-1">
						{$_('vehicles.anmdmAuthType')}
					</label>
					<input
						id="anmdmAuthType"
						type="text"
						bind:value={formData.anmdmAuthType}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						placeholder={$_('vehicles.placeholders.anmdmAuthType')}
					/>
				</div>

				<!-- Issue Date -->
				<div>
					<label for="anmdmIssueDate" class="block text-sm font-medium text-gray-700 mb-1">
						{$_('vehicles.anmdmIssueDate')}
					</label>
					<input
						id="anmdmIssueDate"
						type="date"
						bind:value={formData.anmdmIssueDate}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>

				<!-- Expiry Date -->
				<div>
					<label for="anmdmExpiryDate" class="block text-sm font-medium text-gray-700 mb-1">
						{$_('vehicles.anmdmExpiryDate')}
					</label>
					<input
						id="anmdmExpiryDate"
						type="date"
						bind:value={formData.anmdmExpiryDate}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>

				<!-- Issuing Authority -->
				<div class="md:col-span-2">
					<label for="anmdmIssuingAuthority" class="block text-sm font-medium text-gray-700 mb-1">
						{$_('vehicles.anmdmIssuingAuthority')}
					</label>
					<input
						id="anmdmIssuingAuthority"
						type="text"
						bind:value={formData.anmdmIssuingAuthority}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						placeholder={$_('vehicles.placeholders.anmdmIssuingAuthority')}
					/>
				</div>

				<!-- Notes -->
				<div class="md:col-span-2">
					<label for="anmdmNotes" class="block text-sm font-medium text-gray-700 mb-1">
						{$_('vehicles.anmdmNotes')}
					</label>
					<textarea
						id="anmdmNotes"
						bind:value={formData.anmdmNotes}
						rows="3"
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						placeholder={$_('vehicles.placeholders.anmdmNotes')}
					></textarea>
				</div>

				<!-- ANMDM Document Upload (only shown when editing existing vehicle) -->
				{#if vehicle?.id}
					<div class="md:col-span-2 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
						<label class="block text-sm font-medium text-gray-700 mb-3">
							{$_('vehicles.anmdmDocument')}
						</label>

						{#if anmdmDocumentError}
							<div class="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
								{anmdmDocumentError}
							</div>
						{/if}

						{#if hasAnmdmDocument}
							<!-- Document exists - show download/delete options -->
							<div class="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-200">
								<svg class="w-8 h-8 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
								</svg>
								<div class="flex-1">
									<p class="text-sm font-medium text-gray-900">{$_('vehicles.anmdmDocumentUploaded')}</p>
									<p class="text-xs text-gray-500">{$_('vehicles.anmdmDocumentClickToDownload')}</p>
								</div>
								<button
									type="button"
									on:click={downloadAnmdmDocument}
									class="px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors"
								>
									{$_('common.download')}
								</button>
								<button
									type="button"
									on:click={deleteAnmdmDocument}
									class="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
								>
									{$_('common.delete')}
								</button>
							</div>
						{:else}
							<!-- No document - show upload interface -->
							<div class="flex items-center gap-3">
								<input
									bind:this={anmdmFileInput}
									type="file"
									accept="application/pdf"
									on:change={handleAnmdmFileSelect}
									class="hidden"
									id="anmdmDocumentInput"
								/>

								{#if anmdmDocumentFile}
									<!-- File selected - show file info and upload button -->
									<div class="flex-1 flex items-center gap-3 p-3 bg-white rounded-md border border-gray-200">
										<svg class="w-8 h-8 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
										</svg>
										<div class="flex-1 min-w-0">
											<p class="text-sm font-medium text-gray-900 truncate">{anmdmDocumentFile.name}</p>
											<p class="text-xs text-gray-500">{(anmdmDocumentFile.size / 1024).toFixed(1)} KB</p>
										</div>
										<button
											type="button"
											on:click={clearAnmdmFileSelection}
											class="p-1 text-gray-400 hover:text-gray-600"
											title={$_('common.remove')}
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									</div>
									<button
										type="button"
										on:click={uploadAnmdmDocument}
										disabled={anmdmDocumentUploading}
										class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										{#if anmdmDocumentUploading}
											<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											{$_('common.uploading')}
										{:else}
											{$_('common.upload')}
										{/if}
									</button>
								{:else}
									<!-- No file selected - show select button -->
									<label
										for="anmdmDocumentInput"
										class="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary-400 hover:bg-gray-50 transition-colors"
									>
										<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
										</svg>
										<span class="text-sm text-gray-600">{$_('vehicles.anmdmDocumentSelectPdf')}</span>
									</label>
								{/if}
							</div>
							<p class="mt-2 text-xs text-gray-500">{$_('vehicles.anmdmDocumentHint')}</p>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Document Expiry Dates Section -->
		<div class="mt-8">
			<h4 class="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
				{$_('vehicles.sections.documentExpiry')}
			</h4>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<!-- Rovinieta Expiry Date -->
				<div>
					<label for="rovinietaExpiryDate" class="block text-sm font-medium text-gray-700 mb-1">
						{$_('vehicles.rovinietaExpiryDate')}
					</label>
					<input
						id="rovinietaExpiryDate"
						type="date"
						bind:value={formData.rovinietaExpiryDate}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>

				<!-- Asigurare Expiry Date -->
				<div>
					<label for="asigurareExpiryDate" class="block text-sm font-medium text-gray-700 mb-1">
						{$_('vehicles.asigurareExpiryDate')}
					</label>
					<input
						id="asigurareExpiryDate"
						type="date"
						bind:value={formData.asigurareExpiryDate}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>

				<!-- ITP Expiry Date -->
				<div>
					<label for="itpExpiryDate" class="block text-sm font-medium text-gray-700 mb-1">
						{$_('vehicles.itpExpiryDate')}
					</label>
					<input
						id="itpExpiryDate"
						type="date"
						bind:value={formData.itpExpiryDate}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>
			</div>
		</div>

		<!-- Form Actions -->
		<div class="mt-8 flex justify-end space-x-3">
			<button
				type="button"
				on:click={handleCancel}
				class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
				disabled={loading}
			>
				{$_('common.cancel')}
			</button>
			<button
				type="submit"
				class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={loading}
			>
				{#if loading}
					<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					{$_('common.loading')}
				{:else}
					{vehicle ? $_('vehicles.updateVehicle') : $_('vehicles.createVehicle')}
				{/if}
			</button>
		</div>
	</form>
</div>