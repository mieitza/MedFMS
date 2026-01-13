<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import api from '$lib/api';
	import { _ } from '$lib/i18n';
	import DataTable from '$lib/components/DataTable.svelte';

	let loading = true;
	let error = '';
	let auditLogs: any[] = [];
	let totalLogs = 0;
	let currentPage = 1;
	let pageSize = 25;

	// Filter state
	let filters = {
		action: '',
		resource: '',
		userId: '',
		startDate: '',
		endDate: '',
		search: ''
	};

	// Available filter options
	let actions: string[] = [];
	let resources: string[] = [];
	let users: any[] = [];

	// Detail modal state
	let showDetailModal = false;
	let selectedLog: any = null;

	// Check if user is admin
	$: isAdmin = $auth.user?.role === 'admin';

	// Track if we've already loaded data
	let dataLoaded = false;

	// Watch for auth changes and load data when admin is confirmed
	$: if ($auth.user && !dataLoaded) {
		if ($auth.user.role !== 'admin') {
			goto('/dashboard');
		} else {
			dataLoaded = true;
			Promise.all([loadAuditLogs(), loadFilterOptions()]);
		}
	}

	async function loadFilterOptions() {
		try {
			const [actionsRes, resourcesRes, usersRes] = await Promise.all([
				api.getAuditActions(),
				api.getAuditResources(),
				api.getUsers()
			]);

			if (actionsRes.success) {
				actions = actionsRes.data || [];
			}
			if (resourcesRes.success) {
				resources = resourcesRes.data || [];
			}
			if (usersRes.success) {
				users = usersRes.data || [];
			}
		} catch (err) {
			console.error('Error loading filter options:', err);
		}
	}

	async function loadAuditLogs() {
		loading = true;
		error = '';
		try {
			const params: any = {
				page: currentPage,
				limit: pageSize
			};

			if (filters.action) params.action = filters.action;
			if (filters.resource) params.resource = filters.resource;
			if (filters.userId) params.userId = filters.userId;
			if (filters.startDate) params.startDate = filters.startDate;
			if (filters.endDate) params.endDate = filters.endDate;
			if (filters.search) params.search = filters.search;

			const response = await api.getAuditLogs(params);
			if (response.success) {
				auditLogs = response.data || [];
				totalLogs = response.pagination?.total || auditLogs.length;
			} else {
				error = $_('audit.messages.loadFailed');
			}
		} catch (err) {
			console.error('Error loading audit logs:', err);
			error = err.message || $_('audit.messages.loadFailed');
		} finally {
			loading = false;
		}
	}

	function handleApplyFilters() {
		currentPage = 1;
		loadAuditLogs();
	}

	function handleResetFilters() {
		filters = {
			action: '',
			resource: '',
			userId: '',
			startDate: '',
			endDate: '',
			search: ''
		};
		currentPage = 1;
		loadAuditLogs();
	}

	function handlePageChange(page: number) {
		currentPage = page;
		loadAuditLogs();
	}

	function openDetailModal(log: any) {
		selectedLog = log;
		showDetailModal = true;
	}

	function closeDetailModal() {
		showDetailModal = false;
		selectedLog = null;
	}

	function formatDateTime(dateValue: string | number | Date) {
		if (!dateValue) return '-';
		// Handle both ISO string, timestamp number, and Date object
		const date = typeof dateValue === 'number'
			? new Date(dateValue)
			: new Date(dateValue);
		return isNaN(date.getTime()) ? '-' : date.toLocaleString();
	}

	function formatActionBadge(action: string) {
		const colors: Record<string, string> = {
			create: 'bg-green-100 text-green-800',
			update: 'bg-blue-100 text-blue-800',
			delete: 'bg-red-100 text-red-800',
			login: 'bg-purple-100 text-purple-800',
			logout: 'bg-gray-100 text-gray-800',
			approve: 'bg-emerald-100 text-emerald-800',
			reject: 'bg-orange-100 text-orange-800'
		};
		return colors[action.toLowerCase()] || 'bg-gray-100 text-gray-800';
	}

	function formatResourceBadge(resource: string) {
		const colors: Record<string, string> = {
			user: 'bg-indigo-100 text-indigo-800',
			vehicle: 'bg-blue-100 text-blue-800',
			driver: 'bg-cyan-100 text-cyan-800',
			fuel: 'bg-amber-100 text-amber-800',
			material: 'bg-lime-100 text-lime-800',
			maintenance: 'bg-orange-100 text-orange-800',
			transfer: 'bg-pink-100 text-pink-800',
			warehouse: 'bg-teal-100 text-teal-800'
		};
		return colors[resource.toLowerCase()] || 'bg-gray-100 text-gray-800';
	}

	async function exportToCSV() {
		try {
			const params: any = { limit: 10000 };
			if (filters.action) params.action = filters.action;
			if (filters.resource) params.resource = filters.resource;
			if (filters.userId) params.userId = filters.userId;
			if (filters.startDate) params.startDate = filters.startDate;
			if (filters.endDate) params.endDate = filters.endDate;
			if (filters.search) params.search = filters.search;

			const response = await api.getAuditLogs(params);
			if (!response.success || !response.data?.length) {
				alert($_('audit.messages.noLogs'));
				return;
			}

			const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Resource ID', 'IP Address', 'Details'];
			const rows = response.data.map((log: any) => [
				formatDateTime(log.timestamp),
				log.username || log.userId || '-',
				log.action || '-',
				log.resource || '-',
				log.resourceId || '-',
				log.ipAddress || '-',
				JSON.stringify(log.details || {})
			]);

			const csvContent = [
				headers.join(','),
				...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
			].join('\n');

			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
			link.click();
		} catch (err) {
			console.error('Error exporting to CSV:', err);
			alert('Export failed');
		}
	}

	// DataTable columns - render functions receive (value, row) from DataTable
	const columns = [
		{
			key: 'timestamp',
			label: $_('audit.table.timestamp'),
			render: (value: any) => `<span class="text-sm text-gray-600">${value ? formatDateTime(value) : '-'}</span>`
		},
		{
			key: 'username',
			label: $_('audit.table.user'),
			render: (value: any, row: any) => `<span class="font-medium">${value || row?.userId || '-'}</span>`
		},
		{
			key: 'action',
			label: $_('audit.table.action'),
			render: (value: any) => value ? `<span class="px-2 py-1 text-xs font-medium rounded-full ${formatActionBadge(value)}">${$_(`audit.actions.${value}`) || value}</span>` : '-'
		},
		{
			key: 'resource',
			label: $_('audit.table.resource'),
			render: (value: any) => value ? `<span class="px-2 py-1 text-xs font-medium rounded-full ${formatResourceBadge(value)}">${$_(`audit.resources.${value}`) || value}</span>` : '-'
		},
		{
			key: 'resourceId',
			label: $_('audit.table.resourceId'),
			render: (value: any) => `<span class="text-sm text-gray-600">${value || '-'}</span>`
		},
		{
			key: 'ipAddress',
			label: $_('audit.table.ipAddress'),
			render: (value: any) => `<span class="text-sm text-gray-500 font-mono">${value || '-'}</span>`
		},
		{
			key: 'details',
			label: $_('audit.table.details'),
			render: (value: any, row: any) => row?.id ? `<button onclick="viewDetails(${row.id})" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">${$_('audit.table.viewDetails')}</button>` : '-'
		}
	];

	// Expose function to window for DataTable onclick
	if (typeof window !== 'undefined') {
		(window as any).viewDetails = (id: number) => {
			const log = auditLogs.find(l => l.id === id);
			if (log) openDetailModal(log);
		};
	}
</script>

<svelte:head>
	<title>{$_('audit.pageTitle')}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<div class="mb-6">
		<button
			on:click={() => goto('/admin')}
			class="flex items-center text-gray-600 hover:text-gray-900 mb-4"
		>
			<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			{$_('audit.backToAdmin')}
		</button>
		<div class="flex justify-between items-center">
			<h1 class="text-3xl font-bold text-gray-900">{$_('audit.title')}</h1>
			<button
				on:click={exportToCSV}
				class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
			>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
				</svg>
				{$_('audit.export.csv')}
			</button>
		</div>
	</div>

	<!-- Filters -->
	<div class="bg-white rounded-lg shadow mb-6 p-4">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">{$_('audit.filters.title')}</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
			<!-- Action Filter -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('audit.filters.action')}</label>
				<select
					bind:value={filters.action}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				>
					<option value="">{$_('audit.filters.allActions')}</option>
					{#each actions as action}
						<option value={action}>{$_(`audit.actions.${action}`) || action}</option>
					{/each}
				</select>
			</div>

			<!-- Resource Filter -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('audit.filters.resource')}</label>
				<select
					bind:value={filters.resource}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				>
					<option value="">{$_('audit.filters.allResources')}</option>
					{#each resources as resource}
						<option value={resource}>{$_(`audit.resources.${resource}`) || resource}</option>
					{/each}
				</select>
			</div>

			<!-- User Filter -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('audit.filters.user')}</label>
				<select
					bind:value={filters.userId}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				>
					<option value="">{$_('audit.filters.allUsers')}</option>
					{#each users as user}
						<option value={user.id}>{user.fullName}</option>
					{/each}
				</select>
			</div>

			<!-- Start Date -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('audit.filters.startDate')}</label>
				<input
					type="date"
					bind:value={filters.startDate}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				/>
			</div>

			<!-- End Date -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('audit.filters.endDate')}</label>
				<input
					type="date"
					bind:value={filters.endDate}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				/>
			</div>

			<!-- Search -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{$_('audit.filters.search')}</label>
				<input
					type="text"
					bind:value={filters.search}
					placeholder={$_('audit.filters.searchPlaceholder')}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				/>
			</div>
		</div>
		<div class="mt-4 flex justify-end gap-2">
			<button
				on:click={handleResetFilters}
				class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
			>
				{$_('audit.filters.reset')}
			</button>
			<button
				on:click={handleApplyFilters}
				class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
			>
				{$_('audit.filters.applyFilters')}
			</button>
		</div>
	</div>

	{#if error}
		<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
			{error}
		</div>
	{/if}

	<!-- Data Table -->
	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			<p class="mt-4 text-gray-600">{$_('common.loading')}</p>
		</div>
	{:else if auditLogs.length === 0}
		<div class="bg-white rounded-lg shadow p-12 text-center">
			<svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<h3 class="text-lg font-semibold text-gray-900 mb-2">{$_('audit.messages.noLogs')}</h3>
			<p class="text-gray-600">{$_('audit.messages.noLogsDesc')}</p>
		</div>
	{:else}
		<div class="bg-white rounded-lg shadow">
			<DataTable
				data={auditLogs}
				{columns}
				pagination={{
					currentPage,
					pageSize,
					totalItems: totalLogs
				}}
				onPageChange={handlePageChange}
			/>
		</div>
	{/if}
</div>

<!-- Detail Modal -->
{#if showDetailModal && selectedLog}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div class="p-6 border-b border-gray-200">
				<div class="flex justify-between items-center">
					<h3 class="text-xl font-semibold text-gray-900">{$_('audit.detail.title')}</h3>
					<button on:click={closeDetailModal} class="text-gray-400 hover:text-gray-600">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>
			<div class="p-6 space-y-4">
				<!-- Basic Info -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="text-sm text-gray-500">{$_('audit.table.timestamp')}</span>
						<p class="font-medium">{formatDateTime(selectedLog.timestamp)}</p>
					</div>
					<div>
						<span class="text-sm text-gray-500">{$_('audit.table.user')}</span>
						<p class="font-medium">{selectedLog.username || selectedLog.userId || '-'}</p>
					</div>
					<div>
						<span class="text-sm text-gray-500">{$_('audit.table.action')}</span>
						<span class={`px-2 py-1 text-xs font-medium rounded-full ${formatActionBadge(selectedLog.action)}`}>
							{$_(`audit.actions.${selectedLog.action}`) || selectedLog.action}
						</span>
					</div>
					<div>
						<span class="text-sm text-gray-500">{$_('audit.table.resource')}</span>
						<span class={`px-2 py-1 text-xs font-medium rounded-full ${formatResourceBadge(selectedLog.resource)}`}>
							{$_(`audit.resources.${selectedLog.resource}`) || selectedLog.resource}
						</span>
					</div>
					<div>
						<span class="text-sm text-gray-500">{$_('audit.table.resourceId')}</span>
						<p class="font-medium">{selectedLog.resourceId || '-'}</p>
					</div>
					<div>
						<span class="text-sm text-gray-500">{$_('audit.table.ipAddress')}</span>
						<p class="font-medium font-mono">{selectedLog.ipAddress || '-'}</p>
					</div>
				</div>

				<!-- Details JSON -->
				{#if selectedLog.details && Object.keys(selectedLog.details).length > 0}
					<div>
						<span class="text-sm text-gray-500 block mb-2">{$_('audit.detail.changedFields')}</span>
						<div class="bg-gray-50 rounded-lg p-4 overflow-x-auto">
							<pre class="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(selectedLog.details, null, 2)}</pre>
						</div>
					</div>
				{:else}
					<div class="text-center py-4 text-gray-500">
						{$_('audit.detail.noChanges')}
					</div>
				{/if}
			</div>
			<div class="p-6 border-t border-gray-200 flex justify-end">
				<button
					on:click={closeDetailModal}
					class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
				>
					{$_('common.close')}
				</button>
			</div>
		</div>
	</div>
{/if}
