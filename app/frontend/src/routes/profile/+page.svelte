<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import api from '$lib/api';

	let loading = false;
	let saving = false;
	let changingPin = false;
	let error = '';
	let success = '';

	// Profile form
	let profileData = {
		fullName: '',
		email: '',
		phoneNumber: ''
	};

	// PIN change form
	let pinData = {
		currentPin: '',
		newPin: '',
		confirmPin: ''
	};

	onMount(async () => {
		await loadProfile();
	});

	async function loadProfile() {
		loading = true;
		error = '';
		try {
			const response = await api.getCurrentUser();
			if (response.success && response.data) {
				profileData = {
					fullName: response.data.fullName || '',
					email: response.data.email || '',
					phoneNumber: response.data.phoneNumber || ''
				};
			}
		} catch (err) {
			console.error('Error loading profile:', err);
			error = 'Failed to load profile';
		} finally {
			loading = false;
		}
	}

	async function handleUpdateProfile() {
		saving = true;
		error = '';
		success = '';
		try {
			const response = await api.updateCurrentUser(profileData);
			if (response.success) {
				success = 'Profile updated successfully';
				// Update auth store with new user data
				if (response.data) {
					auth.updateUser({
						...$auth.user,
						fullName: response.data.fullName,
						email: response.data.email
					});
				}
			}
		} catch (err) {
			console.error('Error updating profile:', err);
			error = err.message || 'Failed to update profile';
		} finally {
			saving = false;
		}
	}

	async function handleChangePin() {
		if (pinData.newPin !== pinData.confirmPin) {
			error = 'New PIN and confirmation do not match';
			return;
		}

		if (pinData.newPin.length < 4 || pinData.newPin.length > 8) {
			error = 'PIN must be between 4 and 8 characters';
			return;
		}

		changingPin = true;
		error = '';
		success = '';
		try {
			await api.changePin(pinData.currentPin, pinData.newPin);
			success = 'PIN changed successfully';
			pinData = {
				currentPin: '',
				newPin: '',
				confirmPin: ''
			};
		} catch (err) {
			console.error('Error changing PIN:', err);
			error = err.message || 'Failed to change PIN';
		} finally {
			changingPin = false;
		}
	}

	function formatDate(date) {
		if (!date) return 'Never';
		return new Date(date).toLocaleString();
	}

	function getRoleBadgeColor(role) {
		const colors = {
			admin: 'bg-purple-100 text-purple-800',
			manager: 'bg-blue-100 text-blue-800',
			operator: 'bg-green-100 text-green-800',
			viewer: 'bg-gray-100 text-gray-800'
		};
		return colors[role] || colors.viewer;
	}
</script>

<svelte:head>
	<title>My Profile - MedFMS</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

	{#if error}
		<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
			{error}
		</div>
	{/if}

	{#if success}
		<div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
			{success}
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			<p class="mt-4 text-gray-600">Loading profile...</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Profile Overview Card -->
			<div class="md:col-span-1">
				<div class="bg-white rounded-lg shadow p-6">
					<div class="text-center">
						<div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 text-3xl font-bold mb-4">
							{$auth.user?.fullName?.charAt(0) || 'U'}
						</div>
						<h2 class="text-xl font-semibold text-gray-900">{$auth.user?.fullName}</h2>
						<p class="text-gray-600">@{$auth.user?.username}</p>
						<span class={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${getRoleBadgeColor($auth.user?.role)}`}>
							{$auth.user?.role}
						</span>
					</div>

					<div class="mt-6 space-y-3 text-sm">
						<div>
							<span class="text-gray-600">User ID:</span>
							<span class="float-right font-medium">#{$auth.user?.id}</span>
						</div>
						<div>
							<span class="text-gray-600">Last Login:</span>
							<span class="float-right font-medium text-xs">{formatDate($auth.user?.lastLogin)}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Profile Information & Settings -->
			<div class="md:col-span-2 space-y-6">
				<!-- Edit Profile Card -->
				<div class="bg-white rounded-lg shadow">
					<div class="p-6 border-b border-gray-200">
						<h3 class="text-lg font-semibold text-gray-900">Profile Information</h3>
					</div>
					<form on:submit|preventDefault={handleUpdateProfile} class="p-6 space-y-4">
						<div>
							<label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
								Full Name
							</label>
							<input
								id="fullName"
								type="text"
								bind:value={profileData.fullName}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							/>
						</div>

						<div>
							<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<input
								id="email"
								type="email"
								bind:value={profileData.email}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							/>
						</div>

						<div>
							<label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
								Phone Number
							</label>
							<input
								id="phoneNumber"
								type="tel"
								bind:value={profileData.phoneNumber}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							/>
						</div>

						<div class="pt-4">
							<button
								type="submit"
								disabled={saving}
								class="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
							>
								{saving ? 'Saving...' : 'Update Profile'}
							</button>
						</div>
					</form>
				</div>

				<!-- Change PIN Card -->
				<div class="bg-white rounded-lg shadow">
					<div class="p-6 border-b border-gray-200">
						<h3 class="text-lg font-semibold text-gray-900">Change PIN</h3>
						<p class="text-sm text-gray-600 mt-1">Update your login PIN for security</p>
					</div>
					<form on:submit|preventDefault={handleChangePin} class="p-6 space-y-4">
						<div>
							<label for="currentPin" class="block text-sm font-medium text-gray-700 mb-1">
								Current PIN
							</label>
							<input
								id="currentPin"
								type="password"
								bind:value={pinData.currentPin}
								required
								minlength="4"
								maxlength="8"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							/>
						</div>

						<div>
							<label for="newPin" class="block text-sm font-medium text-gray-700 mb-1">
								New PIN (4-8 characters)
							</label>
							<input
								id="newPin"
								type="password"
								bind:value={pinData.newPin}
								required
								minlength="4"
								maxlength="8"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							/>
						</div>

						<div>
							<label for="confirmPin" class="block text-sm font-medium text-gray-700 mb-1">
								Confirm New PIN
							</label>
							<input
								id="confirmPin"
								type="password"
								bind:value={pinData.confirmPin}
								required
								minlength="4"
								maxlength="8"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							/>
						</div>

						<div class="pt-4">
							<button
								type="submit"
								disabled={changingPin}
								class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
							>
								{changingPin ? 'Changing PIN...' : 'Change PIN'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
