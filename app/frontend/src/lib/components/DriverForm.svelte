<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { api } from '$lib/api';

	export let driver = null;
	export let cities = [];
	export let departments = [];
	export let positions = [];

	const dispatch = createEventDispatcher();

	let loading = false;
	let formData = {
		driverCode: '',
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
		cityId: '',
		dateOfBirth: '',
		hireDate: '',
		departmentId: '',
		positionId: ''
	};

	onMount(() => {
		if (driver) {
			formData = {
				driverCode: driver.driverCode || '',
				firstName: driver.firstName || '',
				lastName: driver.lastName || '',
				fullName: driver.fullName || '',
				idNumber: driver.idNumber || '',
				licenseNumber: driver.licenseNumber || '',
				licenseType: driver.licenseType || '',
				licenseExpiryDate: driver.licenseExpiryDate ? driver.licenseExpiryDate.split('T')[0] : '',
				phoneNumber: driver.phoneNumber || '',
				mobileNumber: driver.mobileNumber || '',
				email: driver.email || '',
				address: driver.address || '',
				cityId: driver.cityId || '',
				dateOfBirth: driver.dateOfBirth ? driver.dateOfBirth.split('T')[0] : '',
				hireDate: driver.hireDate ? driver.hireDate.split('T')[0] : '',
				departmentId: driver.departmentId || '',
				positionId: driver.positionId || ''
			};
		}
	});

	function updateFullName() {
		if (formData.firstName && formData.lastName) {
			formData.fullName = `${formData.firstName} ${formData.lastName}`;
		}
	}

	async function handleSubmit() {
		if (!formData.driverCode || !formData.firstName || !formData.lastName || !formData.licenseNumber) {
			dispatch('error', { message: 'Please fill in all required fields' });
			return;
		}

		loading = true;
		try {
			updateFullName();

			const submitData = {
				...formData,
				cityId: formData.cityId ? parseInt(formData.cityId) : null,
				departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
				positionId: formData.positionId ? parseInt(formData.positionId) : null
			};

			let result;
			if (driver) {
				result = await api.updateDriver(driver.id, submitData);
				dispatch('success', { type: 'updated', data: result.data });
			} else {
				result = await api.createDriver(submitData);
				dispatch('success', { type: 'created', data: result.data });
			}
		} catch (error) {
			console.error('Failed to save driver:', error);
			dispatch('error', { message: 'Failed to save driver. Please try again.' });
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
				Basic Information
			</h3>

			<div>
				<label for="driverCode" class="block text-sm font-medium text-gray-700 mb-2">
					Driver Code *
				</label>
				<input
					id="driverCode"
					type="text"
					bind:value={formData.driverCode}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder="Enter driver code"
					required
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
						First Name *
					</label>
					<input
						id="firstName"
						type="text"
						bind:value={formData.firstName}
						on:input={updateFullName}
						class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						placeholder="First name"
						required
					/>
				</div>

				<div>
					<label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
						Last Name *
					</label>
					<input
						id="lastName"
						type="text"
						bind:value={formData.lastName}
						on:input={updateFullName}
						class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						placeholder="Last name"
						required
					/>
				</div>
			</div>

			<div>
				<label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
					Full Name
				</label>
				<input
					id="fullName"
					type="text"
					bind:value={formData.fullName}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
					placeholder="Auto-generated from first and last name"
					readonly
				/>
			</div>

			<div>
				<label for="idNumber" class="block text-sm font-medium text-gray-700 mb-2">
					ID Number
				</label>
				<input
					id="idNumber"
					type="text"
					bind:value={formData.idNumber}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder="Enter ID number"
				/>
			</div>

			<div>
				<label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-2">
					Date of Birth
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
				License Information
			</h3>

			<div>
				<label for="licenseNumber" class="block text-sm font-medium text-gray-700 mb-2">
					License Number *
				</label>
				<input
					id="licenseNumber"
					type="text"
					bind:value={formData.licenseNumber}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder="Enter license number"
					required
				/>
			</div>

			<div>
				<label for="licenseType" class="block text-sm font-medium text-gray-700 mb-2">
					License Type
				</label>
				<select
					id="licenseType"
					bind:value={formData.licenseType}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="">Select license type</option>
					<option value="Class A">Class A</option>
					<option value="Class B">Class B</option>
					<option value="Class C">Class C</option>
					<option value="CDL A">CDL A</option>
					<option value="CDL B">CDL B</option>
					<option value="CDL C">CDL C</option>
					<option value="Motorcycle">Motorcycle</option>
				</select>
			</div>

			<div>
				<label for="licenseExpiryDate" class="block text-sm font-medium text-gray-700 mb-2">
					License Expiry Date
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
					Hire Date
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
					Department
				</label>
				<select
					id="departmentId"
					bind:value={formData.departmentId}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="">Select department</option>
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
			Contact Information
		</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-2">
					Phone Number
				</label>
				<input
					id="phoneNumber"
					type="tel"
					bind:value={formData.phoneNumber}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder="Enter phone number"
				/>
			</div>

			<div>
				<label for="mobileNumber" class="block text-sm font-medium text-gray-700 mb-2">
					Mobile Number
				</label>
				<input
					id="mobileNumber"
					type="tel"
					bind:value={formData.mobileNumber}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder="Enter mobile number"
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
					Email
				</label>
				<input
					id="email"
					type="email"
					bind:value={formData.email}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder="Enter email address"
				/>
			</div>

			<div>
				<label for="cityId" class="block text-sm font-medium text-gray-700 mb-2">
					City
				</label>
				<select
					id="cityId"
					bind:value={formData.cityId}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="">Select city</option>
					{#each cities as city}
						<option value={city.id}>{city.cityName}</option>
					{/each}
				</select>
			</div>

			<div class="md:col-span-2">
				<label for="address" class="block text-sm font-medium text-gray-700 mb-2">
					Address
				</label>
				<textarea
					id="address"
					bind:value={formData.address}
					rows="3"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
					placeholder="Enter address"
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
			Cancel
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
			{driver ? 'Update' : 'Create'} Driver
		</button>
	</div>
</form>