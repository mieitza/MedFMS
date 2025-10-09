<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, hasRole } from '$lib/stores/auth';
	import api from '$lib/api';
	import DataTable from '$lib/components/DataTable.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { _ } from '$lib/i18n';

	let users = [];
	let loading = false;
	let error = '';
	let showModal = false;
	let modalMode = 'create';
	let selectedUser = null;
	let departments = [];
	let locations = [];

	// Reactive role check
	let isAdmin = false;
	let canEdit = false;

	$: {
		if ($auth.user) {
			isAdmin = $auth.user.role === 'admin';
			canEdit = $auth.user.role === 'admin' || $auth.user.role === 'manager';
		}
	}

	// Form data
	let formData = {
		username: '',
		email: '',
		pin: '',
		fullName: '',
		role: 'viewer',
		departmentId: null,
		locationId: null,
		phoneNumber: '',
		active: true
	};

	// Reactive role options and columns that update when locale changes
	let roleOptions = [];
	let columns = [];

	$: {
		roleOptions = [
			{ value: 'admin', label: $_('users.roles.admin') },
			{ value: 'manager', label: $_('users.roles.manager') },
			{ value: 'operator', label: $_('users.roles.operator') },
			{ value: 'viewer', label: $_('users.roles.viewer') }
		];

		columns = [
			{ key: 'id', label: 'ID', sortable: true },
			{ key: 'username', label: $_('users.username'), sortable: true },
			{ key: 'fullName', label: $_('users.fullName'), sortable: true },
			{ key: 'email', label: $_('users.email'), sortable: true },
			{ key: 'role', label: $_('users.role'), sortable: true, render: (val) => {
				const colors = {
					admin: 'bg-purple-100 text-purple-800',
					manager: 'bg-blue-100 text-blue-800',
					operator: 'bg-green-100 text-green-800',
					viewer: 'bg-gray-100 text-gray-800'
				};
				const roleLabels = {
					admin: $_('users.roles.admin'),
					manager: $_('users.roles.manager'),
					operator: $_('users.roles.operator'),
					viewer: $_('users.roles.viewer')
				};
				return `<span class="px-2 py-1 text-xs font-medium rounded-full ${colors[val] || colors.viewer}">${roleLabels[val] || val}</span>`;
			}},
			{ key: 'active', label: $_('common.status'), sortable: true, render: (val) =>
				val ? `<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">${$_('common.active')}</span>`
				    : `<span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">${$_('common.inactive')}</span>`
			},
			{ key: 'lastLogin', label: $_('users.lastLogin'), sortable: true, render: (val) =>
				val ? new Date(val).toLocaleString() : $_('users.never')
			},
			{ key: 'actions', label: $_('common.actions'), sortable: false, render: (val, row) => renderActions(val, row) }
		];
	}

	onMount(async () => {
		// Ensure auth state is loaded
		auth.checkAuth();

		// Update role checks immediately
		if ($auth.user) {
			isAdmin = $auth.user.role === 'admin';
			canEdit = $auth.user.role === 'admin' || $auth.user.role === 'manager';
		}

		await loadUsers();
		await loadDepartments();
		await loadLocations();
	});

	async function loadUsers() {
		loading = true;
		error = '';
		try {
			const response = await api.getUsers();
			users = response.data || [];
		} catch (err) {
			console.error('Error loading users:', err);
			error = $_('users.messages.failedToLoad');
		} finally {
			loading = false;
		}
	}

	async function loadDepartments() {
		try {
			const response = await api.getReferenceData('departments');
			departments = response.data || [];
		} catch (err) {
			console.error('Error loading departments:', err);
		}
	}

	async function loadLocations() {
		try {
			const response = await api.getReferenceData('locations');
			locations = response.data || [];
		} catch (err) {
			console.error('Error loading locations:', err);
		}
	}

	function openCreateModal() {
		modalMode = 'create';
		selectedUser = null;
		formData = {
			username: '',
			email: '',
			pin: '',
			fullName: '',
			role: 'viewer',
			departmentId: null,
			locationId: null,
			phoneNumber: '',
			active: true
		};
		showModal = true;
	}

	function openEditModal(user) {
		modalMode = 'edit';
		selectedUser = user;
		formData = {
			username: user.username,
			email: user.email,
			pin: '',
			fullName: user.fullName,
			role: user.role,
			departmentId: user.departmentId,
			locationId: user.locationId,
			phoneNumber: user.phoneNumber || '',
			active: user.active
		};
		showModal = true;
	}

	async function handleSubmit() {
		try {
			if (modalMode === 'create') {
				await api.createUser(formData);
				alert($_('users.messages.createSuccess'));
			} else {
				const updateData = { ...formData };
				delete updateData.username; // Can't change username
				if (!updateData.pin) delete updateData.pin; // Only update PIN if provided
				await api.updateUser(selectedUser.id, updateData);
				alert($_('users.messages.updateSuccess'));
			}
			showModal = false;
			await loadUsers();
		} catch (err) {
			console.error('Error saving user:', err);
			alert(err.message || $_('users.messages.failedToSave'));
		}
	}

	async function handleDelete(user) {
		if (!confirm($_('users.messages.deleteConfirm', { values: { username: user.username } }))) return;

		try {
			await api.deleteUser(user.id);
			await loadUsers();
		} catch (err) {
			console.error('Error deleting user:', err);
			alert(err.message || $_('users.messages.failedToDelete'));
		}
	}

	async function toggleUserStatus(user) {
		try {
			if (user.active) {
				await api.deactivateUser(user.id);
			} else {
				await api.activateUser(user.id);
			}
			await loadUsers();
		} catch (err) {
			console.error('Error toggling user status:', err);
			alert(err.message || $_('users.messages.failedToUpdateStatus'));
		}
	}

	async function resetUserPin(user) {
		const newPin = prompt(`Enter new PIN for user "${user.username}" (4-8 digits):`);
		if (!newPin) return;

		if (newPin.length < 4 || newPin.length > 8) {
			alert('PIN must be between 4 and 8 characters');
			return;
		}

		try {
			await api.resetUserPin(user.id, newPin);
			alert('PIN reset successfully');
		} catch (err) {
			console.error('Error resetting PIN:', err);
			alert('Failed to reset PIN');
		}
	}

	function renderActions(value, row) {
		// Get current auth state
		let userRole = null;
		let currentUserId = null;

		if (typeof window !== 'undefined') {
			try {
				const storedUser = localStorage.getItem('user');
				if (storedUser) {
					const user = JSON.parse(storedUser);
					userRole = user.role;
					currentUserId = user.id;
				}
			} catch (e) {
				// Ignore errors
			}
		}

		const canEditUser = userRole === 'admin' || userRole === 'manager';
		const isAdminUser = userRole === 'admin';

		if (!canEditUser) return '';

		// Get translated labels
		const editLabel = $_('users.actions.edit');
		const deactivateLabel = $_('users.actions.deactivate');
		const activateLabel = $_('users.actions.activate');
		const resetPinLabel = $_('users.actions.resetPin');
		const deleteLabel = $_('users.actions.delete');

		return `
			<div class="flex gap-2">
				<button onclick="editUser(${row.id})" class="text-blue-600 hover:text-blue-800 text-sm">${editLabel}</button>
				${row.active
					? `<button onclick="toggleStatus(${row.id})" class="text-orange-600 hover:text-orange-800 text-sm">${deactivateLabel}</button>`
					: `<button onclick="toggleStatus(${row.id})" class="text-green-600 hover:text-green-800 text-sm">${activateLabel}</button>`
				}
				${isAdminUser ? `<button onclick="resetPin(${row.id})" class="text-purple-600 hover:text-purple-800 text-sm">${resetPinLabel}</button>` : ''}
				${isAdminUser && row.id !== currentUserId ? `<button onclick="deleteUser(${row.id})" class="text-red-600 hover:text-red-800 text-sm">${deleteLabel}</button>` : ''}
			</div>
		`;
	}

	// Expose functions to window for DataTable onclick handlers
	if (typeof window !== 'undefined') {
		window.editUser = (id) => {
			const user = users.find(u => u.id === id);
			if (user) openEditModal(user);
		};
		window.deleteUser = (id) => {
			const user = users.find(u => u.id === id);
			if (user) handleDelete(user);
		};
		window.toggleStatus = (id) => {
			const user = users.find(u => u.id === id);
			if (user) toggleUserStatus(user);
		};
		window.resetPin = (id) => {
			const user = users.find(u => u.id === id);
			if (user) resetUserPin(user);
		};
	}
</script>

<svelte:head>
	<title>{$_('users.title')} - {$_('common.appName')}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Back Button -->
	<div class="mb-4">
		<button
			on:click={() => goto('/admin')}
			class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
		>
			<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			{$_('users.backToAdmin')}
		</button>
	</div>

	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold text-gray-900">{$_('users.title')}</h1>
		{#if isAdmin}
			<button
				on:click={openCreateModal}
				class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
			>
				{$_('users.addUser')}
			</button>
		{/if}
	</div>

	{#if error}
		<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
			{error}
		</div>
	{/if}

	<div class="bg-white rounded-lg shadow">
		<DataTable
			data={users}
			{columns}
			{loading}
		/>
	</div>
</div>

{#if showModal}
	<Modal open={true} on:close={() => showModal = false} title={modalMode === 'create' ? $_('users.createUser') : $_('users.editUser')}>
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div>
				<label for="username" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('users.username')} {modalMode === 'create' ? '*' : `(${$_('users.cannotChange')})`}
				</label>
				<input
					id="username"
					type="text"
					bind:value={formData.username}
					disabled={modalMode === 'edit'}
					required={modalMode === 'create'}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
				/>
			</div>

			<div>
				<label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('users.fullName')} *
				</label>
				<input
					id="fullName"
					type="text"
					bind:value={formData.fullName}
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('users.email')} *
				</label>
				<input
					id="email"
					type="email"
					bind:value={formData.email}
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				/>
			</div>

			<div>
				<label for="pin" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('users.pin')} {modalMode === 'create' ? '*' : `(${$_('users.leaveBlank')})`}
				</label>
				<input
					id="pin"
					type="password"
					bind:value={formData.pin}
					required={modalMode === 'create'}
					minlength="4"
					maxlength="8"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					placeholder={modalMode === 'edit' ? $_('users.leaveBlank') : ''}
				/>
			</div>

			<div>
				<label for="role" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('users.role')} *
				</label>
				<select
					id="role"
					bind:value={formData.role}
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				>
					{#each roleOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="department" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('users.department')}
				</label>
				<select
					id="department"
					bind:value={formData.departmentId}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				>
					<option value={null}>None</option>
					{#each departments as dept}
						<option value={dept.id}>{dept.departmentName}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="location" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('users.location')}
				</label>
				<select
					id="location"
					bind:value={formData.locationId}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				>
					<option value={null}>None</option>
					{#each locations as loc}
						<option value={loc.id}>{loc.locationName}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
					{$_('users.phoneNumber')}
				</label>
				<input
					id="phone"
					type="tel"
					bind:value={formData.phoneNumber}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				/>
			</div>

			<div class="flex items-center">
				<input
					id="active"
					type="checkbox"
					bind:checked={formData.active}
					class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
				/>
				<label for="active" class="ml-2 text-sm text-gray-700">
					{$_('common.active')}
				</label>
			</div>

			<div class="flex justify-end gap-2 pt-4">
				<button
					type="button"
					on:click={() => showModal = false}
					class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
				>
					{$_('common.cancel')}
				</button>
				<button
					type="submit"
					class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
				>
					{modalMode === 'create' ? $_('common.create') : $_('common.update')}
				</button>
			</div>
		</form>
	</Modal>
{/if}
