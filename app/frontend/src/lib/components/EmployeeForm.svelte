<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import { createFormTracker } from '$lib/utils/formTracking';

	export let employee = null;
	export let cities = [];
	export let departments = [];
	export let positions = [];
	export let licenseTypes = [];

	const dispatch = createEventDispatcher();

	let loading = false;
	let formTracker = null; // For tracking changed fields when editing
	let formData = {
		employeeCode: '',
		firstName: '',
		lastName: '',
		fullName: '',
		idNumber: '',
		licenseNumber: '',
		licenseType: '',
		licenseExpiryDate: '',
		phoneNumber: '',
		mobileNumber: '',
		email: '',
		address: '',
		cityId: null,
		dateOfBirth: '',
		hireDate: '',
		departmentId: null,
		positionId: null
	};

	onMount(() => {
		if (employee) {
			formData = {
				employeeCode: employee.employeeCode || '',
				firstName: employee.firstName || '',
				lastName: employee.lastName || '',
				fullName: employee.fullName || '',
				idNumber: employee.idNumber || '',
				licenseNumber: employee.licenseNumber || '',
				licenseType: employee.licenseType || '',
				licenseExpiryDate: employee.licenseExpiryDate ? employee.licenseExpiryDate.split('T')[0] : '',
				phoneNumber: employee.phoneNumber || '',
				mobileNumber: employee.mobileNumber || '',
				email: employee.email || '',
				address: employee.address || '',
				cityId: employee.cityId || null,
				dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
				hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
				departmentId: employee.departmentId || null,
				positionId: employee.positionId || null
			};

			// Create form tracker with original data for change detection
			formTracker = createFormTracker(formData);
		}
	});

	function updateFullName() {
		if (formData.firstName && formData.lastName) {
			formData.fullName = `${formData.firstName} ${formData.lastName}`;
		}
	}

	async function handleSubmit() {
		if (!formData.employeeCode || !formData.firstName || !formData.lastName || !formData.licenseNumber) {
			dispatch('error', { message: $_('employees.messages.requiredFields') });
			return;
		}

		loading = true;
		try {
			updateFullName();

			const fullPayload = {
				...formData,
				cityId: formData.cityId ? parseInt(formData.cityId) : null,
				departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
				positionId: formData.positionId ? parseInt(formData.positionId) : null
			};

			let result;
			if (employee) {
				// For updates, detect and send only changed fields
				const changedFields = formTracker ? formTracker.detectChanges(fullPayload) : fullPayload;

				// Apply same type conversions to changed fields
				const submitData = {};
				for (const key in changedFields) {
					if (key === 'cityId' || key === 'departmentId' || key === 'positionId') {
						submitData[key] = changedFields[key] ? parseInt(changedFields[key]) : null;
					} else {
						submitData[key] = changedFields[key];
					}
				}

				// Only send PATCH if there are changes
				if (Object.keys(submitData).length > 0) {
					result = await api.patchEmployee(employee.id, submitData);
					dispatch('success', { type: 'updated', data: result.data });
				} else {
					// No changes, just close the form
					dispatch('success', { type: 'updated', data: {} });
				}
			} else {
				result = await api.createEmployee(fullPayload);
				dispatch('success', { type: 'created', data: result.data });
			}
		} catch (error) {
			console.error('Failed to save employee:', error);
			dispatch('error', { message: $_('employees.messages.saveFailed') });
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		dispatch('cancel');
	}

	function getCityName(cityId) {
		const city = cities.find(c => c.id == cityId);
		return city ? city.cityName : '';
	}

	function getDepartmentName(departmentId) {
		const department = departments.find(d => d.id == departmentId);
		return department ? department.departmentName : '';
	}

	function getPositionName(positionId) {
		const position = positions.find(p => p.id == positionId);
		return position ? position.positionName : '';
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
	<!-- Basic Information -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="space-y-4">
			<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
				{$_('employees.sections.basicInfo')}
			</h3>

			<div>
				<label for="employeeCode" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.employeeCode')} *
				</label>
				<input
					id="employeeCode"
					type="text"
					bind:value={formData.employeeCode}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder={$_('employees.placeholders.employeeCode')}
					required
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('employees.firstName')} *
					</label>
					<input
						id="firstName"
						type="text"
						bind:value={formData.firstName}
						on:input={updateFullName}
						class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						placeholder={$_('employees.placeholders.firstName')}
						required
					/>
				</div>

				<div>
					<label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('employees.lastName')} *
					</label>
					<input
						id="lastName"
						type="text"
						bind:value={formData.lastName}
						on:input={updateFullName}
						class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						placeholder={$_('employees.placeholders.lastName')}
						required
					/>
				</div>
			</div>

			<div>
				<label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.fullName')}
				</label>
				<input
					id="fullName"
					type="text"
					bind:value={formData.fullName}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
					placeholder={$_('employees.placeholders.fullName')}
					readonly
				/>
			</div>

			<div>
				<label for="idNumber" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.idNumber')}
				</label>
				<input
					id="idNumber"
					type="text"
					bind:value={formData.idNumber}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder={$_('employees.placeholders.idNumber')}
				/>
			</div>

			<div>
				<label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.dateOfBirth')}
				</label>
				<input
					id="dateOfBirth"
					type="date"
					bind:value={formData.dateOfBirth}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				/>
			</div>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
				{$_('employees.sections.licenseInfo')}
			</h3>

			<div>
				<label for="licenseNumber" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.licenseNumber')} *
				</label>
				<input
					id="licenseNumber"
					type="text"
					bind:value={formData.licenseNumber}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder={$_('employees.placeholders.licenseNumber')}
					required
				/>
			</div>

			<div>
				<label for="licenseType" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.licenseType')}
				</label>
				<select
					id="licenseType"
					bind:value={formData.licenseType}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="">{$_('employees.placeholders.selectLicenseType')}</option>
					{#each licenseTypes as licenseType}
						<option value={licenseType.typeName}>{licenseType.typeName}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="licenseExpiryDate" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.licenseExpiryDate')}
				</label>
				<input
					id="licenseExpiryDate"
					type="date"
					bind:value={formData.licenseExpiryDate}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				/>
			</div>

			<div>
				<label for="hireDate" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.hireDate')}
				</label>
				<input
					id="hireDate"
					type="date"
					bind:value={formData.hireDate}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				/>
			</div>

			<div>
				<label for="departmentId" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('users.department')}
				</label>
				<select
					id="departmentId"
					bind:value={formData.departmentId}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value={null}>{$_('employees.placeholders.selectDepartment')}</option>
					{#each departments as department}
						<option value={department.id}>{department.departmentName}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Contact Information -->
	<div>
		<h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
			{$_('employees.sections.contactInfo')}
		</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('users.phoneNumber')}
				</label>
				<input
					id="phoneNumber"
					type="tel"
					bind:value={formData.phoneNumber}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder={$_('employees.placeholders.phoneNumber')}
				/>
			</div>

			<div>
				<label for="mobileNumber" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.mobileNumber')}
				</label>
				<input
					id="mobileNumber"
					type="tel"
					bind:value={formData.mobileNumber}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder={$_('employees.placeholders.mobileNumber')}
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('users.email')}
				</label>
				<input
					id="email"
					type="email"
					bind:value={formData.email}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder={$_('employees.placeholders.email')}
				/>
			</div>

			<div>
				<label for="cityId" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.city')}
				</label>
				<select
					id="cityId"
					bind:value={formData.cityId}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value={null}>{$_('employees.placeholders.selectCity')}</option>
					{#each cities as city}
						<option value={city.id}>{city.cityName}</option>
					{/each}
				</select>
			</div>

			<div class="md:col-span-2">
				<label for="address" class="block text-sm font-medium text-gray-700 mb-2">
					{$_('employees.address')}
				</label>
				<textarea
					id="address"
					bind:value={formData.address}
					rows="3"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder={$_('employees.placeholders.address')}
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
			disabled={loading}
		>
			{$_('common.cancel')}
		</button>
		<button
			type="submit"
			class="btn btn-primary"
			disabled={loading}
		>
			{#if loading}
				<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			{/if}
			{employee ? $_('employees.updateEmployee') : $_('employees.createEmployee')}
		</button>
	</div>
</form>
