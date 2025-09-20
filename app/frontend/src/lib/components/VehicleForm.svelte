<script>
	import { createEventDispatcher } from 'svelte';
	import { api } from '$lib/api';

	export let vehicle = null;
	export let brands = [];
	export let models = [];
	export let vehicleTypes = [];
	export let vehicleStatuses = [];
	export let fuelTypes = [];
	export let locations = [];
	export let departments = [];
	export let drivers = [];

	const dispatch = createEventDispatcher();

	let formData = {
		vehicleCode: '',
		licensePlate: '',
		brandId: '',
		modelId: '',
		year: new Date().getFullYear(),
		fuelTypeId: '',
		vehicleTypeId: '',
		statusId: '',
		locationId: '',
		departmentId: '',
		driverId: '',
		odometer: '',
		description: ''
	};

	let filteredModels = [];
	let loading = false;
	let errors = {};

	let initialized = false;
	let lastVehicleId = null;

	// Initialize form with vehicle data if editing
	$: if (vehicle && brands.length > 0 && (!initialized || vehicle?.id !== lastVehicleId)) {
		formData = {
			vehicleCode: vehicle.vehicleCode || '',
			licensePlate: vehicle.licensePlate || '',
			brandId: vehicle.brandId?.toString() || '',
			modelId: vehicle.modelId?.toString() || '',
			year: vehicle.year || new Date().getFullYear(),
			fuelTypeId: vehicle.fuelTypeId?.toString() || '',
			vehicleTypeId: vehicle.vehicleTypeId?.toString() || '',
			statusId: vehicle.statusId?.toString() || '',
			locationId: vehicle.locationId?.toString() || '',
			departmentId: vehicle.departmentId?.toString() || '',
			driverId: vehicle.driverId?.toString() || '',
			odometer: vehicle.odometer || '',
			description: vehicle.description || ''
		};
		updateFilteredModels();
		initialized = true;
		lastVehicleId = vehicle?.id;
	}

	function updateFilteredModels() {
		if (formData.brandId) {
			filteredModels = models.filter(model => model.brandId == formData.brandId);
			if (!filteredModels.find(model => model.id == formData.modelId)) {
				formData.modelId = '';
			}
		} else {
			filteredModels = [];
			formData.modelId = '';
		}
	}

	function handleBrandChange() {
		updateFilteredModels();
	}

	function validateForm() {
		errors = {};

		if (!formData.vehicleCode.trim()) {
			errors.vehicleCode = 'Vehicle code is required';
		}

		if (!formData.licensePlate.trim()) {
			errors.licensePlate = 'License plate is required';
		}

		if (!formData.brandId) {
			errors.brandId = 'Brand is required';
		}

		if (!formData.modelId) {
			errors.modelId = 'Model is required';
		}

		if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
			errors.year = 'Please enter a valid year';
		}

		if (!formData.fuelTypeId) {
			errors.fuelTypeId = 'Fuel type is required';
		}

		if (!formData.vehicleTypeId) {
			errors.vehicleTypeId = 'Vehicle type is required';
		}

		if (!formData.statusId) {
			errors.statusId = 'Status is required';
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			return;
		}

		loading = true;

		try {
			const payload = {
				...formData,
				brandId: parseInt(formData.brandId),
				modelId: parseInt(formData.modelId),
				year: parseInt(formData.year),
				fuelTypeId: parseInt(formData.fuelTypeId),
				vehicleTypeId: parseInt(formData.vehicleTypeId),
				statusId: parseInt(formData.statusId),
				locationId: formData.locationId ? parseInt(formData.locationId) : undefined,
				departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
				driverId: formData.driverId ? parseInt(formData.driverId) : undefined,
				odometer: formData.odometer ? parseInt(formData.odometer) : undefined
			};

			if (vehicle) {
				await api.updateVehicle(vehicle.id, payload);
				dispatch('success', { type: 'update', data: payload });
			} else {
				await api.createVehicle(payload);
				dispatch('success', { type: 'create', data: payload });
			}
		} catch (error) {
			console.error('Failed to save vehicle:', error);
			dispatch('error', { message: 'Failed to save vehicle. Please try again.' });
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
					Vehicle Code *
				</label>
				<input
					type="text"
					id="vehicleCode"
					bind:value={formData.vehicleCode}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.vehicleCode}
					placeholder="e.g., VEH001"
					required
				/>
				{#if errors.vehicleCode}
					<p class="mt-1 text-sm text-red-600">{errors.vehicleCode}</p>
				{/if}
			</div>

			<!-- License Plate -->
			<div>
				<label for="licensePlate" class="block text-sm font-medium text-gray-700 mb-1">
					License Plate *
				</label>
				<input
					type="text"
					id="licensePlate"
					bind:value={formData.licensePlate}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.licensePlate}
					placeholder="e.g., ABC-123"
					required
				/>
				{#if errors.licensePlate}
					<p class="mt-1 text-sm text-red-600">{errors.licensePlate}</p>
				{/if}
			</div>

			<!-- Brand -->
			<div>
				<label for="brandId" class="block text-sm font-medium text-gray-700 mb-1">
					Brand *
				</label>
				<select
					id="brandId"
					bind:value={formData.brandId}
					on:change={handleBrandChange}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.brandId}
					required
				>
					<option value="">Select a brand</option>
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
					Model *
				</label>
				<select
					id="modelId"
					bind:value={formData.modelId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.modelId}
					disabled={!formData.brandId}
					required
				>
					<option value="">Select a model</option>
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
					Year *
				</label>
				<input
					type="number"
					id="year"
					bind:value={formData.year}
					min="1900"
					max={new Date().getFullYear() + 1}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.year}
					required
				/>
				{#if errors.year}
					<p class="mt-1 text-sm text-red-600">{errors.year}</p>
				{/if}
			</div>

			<!-- Fuel Type -->
			<div>
				<label for="fuelTypeId" class="block text-sm font-medium text-gray-700 mb-1">
					Fuel Type *
				</label>
				<select
					id="fuelTypeId"
					bind:value={formData.fuelTypeId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.fuelTypeId}
					required
				>
					<option value="">Select fuel type</option>
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
					Vehicle Type *
				</label>
				<select
					id="vehicleTypeId"
					bind:value={formData.vehicleTypeId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.vehicleTypeId}
					required
				>
					<option value="">Select vehicle type</option>
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
					Status *
				</label>
				<select
					id="statusId"
					bind:value={formData.statusId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					class:border-red-500={errors.statusId}
					required
				>
					<option value="">Select status</option>
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
					Location
				</label>
				<select
					id="locationId"
					bind:value={formData.locationId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="">Select location</option>
					{#each locations as location}
						<option value={location.id}>{location.locationName}</option>
					{/each}
				</select>
			</div>

			<!-- Department (Optional) -->
			<div>
				<label for="departmentId" class="block text-sm font-medium text-gray-700 mb-1">
					Department
				</label>
				<select
					id="departmentId"
					bind:value={formData.departmentId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="">Select department</option>
					{#each departments as department}
						<option value={department.id}>{department.departmentName}</option>
					{/each}
				</select>
			</div>

			<!-- Driver (Optional) -->
			<div>
				<label for="driverId" class="block text-sm font-medium text-gray-700 mb-1">
					Assigned Driver
				</label>
				<select
					id="driverId"
					bind:value={formData.driverId}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="">Select driver</option>
					{#each drivers as driver}
						<option value={driver.id}>{driver.fullName}</option>
					{/each}
				</select>
			</div>

			<!-- Odometer (Optional) -->
			<div>
				<label for="odometer" class="block text-sm font-medium text-gray-700 mb-1">
					Odometer (km)
				</label>
				<input
					type="number"
					id="odometer"
					bind:value={formData.odometer}
					min="0"
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder="e.g., 15000"
				/>
			</div>
		</div>

		<!-- Description -->
		<div class="mt-6">
			<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
				Description
			</label>
			<textarea
				id="description"
				bind:value={formData.description}
				rows="3"
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				placeholder="Additional notes about the vehicle..."
			></textarea>
		</div>

		<!-- Form Actions -->
		<div class="mt-8 flex justify-end space-x-3">
			<button
				type="button"
				on:click={handleCancel}
				class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
				disabled={loading}
			>
				Cancel
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
					Saving...
				{:else}
					{vehicle ? 'Update' : 'Create'} Vehicle
				{/if}
			</button>
		</div>
	</form>
</div>