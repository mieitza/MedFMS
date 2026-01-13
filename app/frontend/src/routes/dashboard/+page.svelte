<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	let isLoading = true;
	let vehicleCount = 0;
	let fuelTransactions = 0;
	let materialItems = 0;
	let activeEmployees = 0;
	let user = { fullName: 'User', role: 'user' };

	onMount(async () => {
		// Check authentication
		const token = localStorage.getItem('token');
		const userData = localStorage.getItem('user');

		if (!token) {
			goto('/');
			return;
		}

		if (userData) {
			user = JSON.parse(userData);
		}

		// Load dashboard data from API
		try {
			const response = await api.getDashboardStats();
			if (response.success) {
				vehicleCount = response.data.vehicleCount;
				fuelTransactions = response.data.fuelTransactions;
				materialItems = response.data.materialItems;
				activeEmployees = response.data.activeEmployees;
			}
		} catch (error) {
			console.error('Failed to load dashboard data:', error);
		} finally {
			isLoading = false;
		}
	});

	async function handleLogout() {
		try {
			await api.logout();
			goto('/');
		} catch (error) {
			console.error('Logout error:', error);
			// Force logout even if API call fails
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>{$_('dashboard.title')} - {$_('common.appName')}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<h1 class="text-2xl font-bold text-primary-900">{$_('common.appName')}</h1>
				</div>
				<div class="flex items-center space-x-4">
					<LanguageSwitcher />
					<span class="text-sm text-gray-700">{$_('common.welcomeBack')}, {user.fullName}!</span>
					<span class="text-xs text-gray-500 capitalize">{user.role}</span>
					<button on:click={handleLogout} class="btn btn-secondary text-sm">
						{$_('common.logout')}
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if isLoading}
			<div class="flex items-center justify-center h-64">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		{:else}
			<!-- Stats Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div class="card">
					<div class="flex items-center">
						<div class="p-3 rounded-full bg-primary-100 text-primary-600">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
							</svg>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">{$_('dashboard.totalVehicles')}</p>
							<p class="text-2xl font-bold text-gray-900">{vehicleCount}</p>
						</div>
					</div>
				</div>

				<div class="card">
					<div class="flex items-center">
						<div class="p-3 rounded-full bg-green-100 text-green-600">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
							</svg>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">{$_('dashboard.fuelTransactions')}</p>
							<p class="text-2xl font-bold text-gray-900">{fuelTransactions}</p>
						</div>
					</div>
				</div>

				<div class="card">
					<div class="flex items-center">
						<div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
							</svg>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">{$_('dashboard.materialItems')}</p>
							<p class="text-2xl font-bold text-gray-900">{materialItems}</p>
						</div>
					</div>
				</div>

				<div class="card">
					<div class="flex items-center">
						<div class="p-3 rounded-full bg-purple-100 text-purple-600">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
							</svg>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">{$_('dashboard.activeEmployees')}</p>
							<p class="text-2xl font-bold text-gray-900">{activeEmployees}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Navigation Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<a href="/vehicles" class="card hover:shadow-md transition-shadow cursor-pointer">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">{$_('dashboard.vehicleManagement')}</h3>
					<p class="text-gray-600">{$_('dashboard.vehicleManagementDesc')}</p>
				</a>

				<a href="/employees" class="card hover:shadow-md transition-shadow cursor-pointer">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">{$_('dashboard.employeeManagement')}</h3>
					<p class="text-gray-600">{$_('dashboard.employeeManagementDesc')}</p>
				</a>

				<a href="/fuel" class="card hover:shadow-md transition-shadow cursor-pointer">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">{$_('dashboard.fuelManagement')}</h3>
					<p class="text-gray-600">{$_('dashboard.fuelManagementDesc')}</p>
				</a>

				<a href="/materials" class="card hover:shadow-md transition-shadow cursor-pointer">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">{$_('dashboard.materialManagement')}</h3>
					<p class="text-gray-600">{$_('dashboard.materialManagementDesc')}</p>
				</a>

				<a href="/maintenance" class="card hover:shadow-md transition-shadow cursor-pointer">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">{$_('dashboard.maintenance')}</h3>
					<p class="text-gray-600">{$_('dashboard.maintenanceDesc')}</p>
				</a>

				<a href="/reports" class="card hover:shadow-md transition-shadow cursor-pointer">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">{$_('dashboard.reportsAnalytics')}</h3>
					<p class="text-gray-600">{$_('dashboard.reportsAnalyticsDesc')}</p>
				</a>

				<a href="/fuel/import" class="card hover:shadow-md transition-shadow cursor-pointer">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">{$_('dashboard.dataImport')}</h3>
					<p class="text-gray-600">{$_('dashboard.dataImportDesc')}</p>
				</a>

				{#if user.role === 'admin' || user.role === 'manager'}
					<a href="/admin" class="card hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
						<div class="flex items-center mb-2">
							<svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
							<h3 class="text-lg font-semibold text-gray-900">{$_('dashboard.adminSettings')}</h3>
						</div>
						<p class="text-gray-600">{$_('dashboard.adminSettingsDesc')}</p>
					</a>
				{/if}
			</div>
		{/if}
	</main>
</div>