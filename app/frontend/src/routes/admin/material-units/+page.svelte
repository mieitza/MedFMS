<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import Modal from '$lib/components/Modal.svelte';

	let units = [];
	let loading = true;
	let error = null;

	// Modal state
	let showAddModal = false;
	let showEditModal = false;
	let selectedUnit = null;

	// Form data
	let formData = {
		unitCode: '',
		unitName: '',
		abbreviation: '',
		description: '',
		active: true
	};

	onMount(async () => {
		// Check authentication and admin role
		const token = localStorage.getItem('token');
		const user = JSON.parse(localStorage.getItem('user') || '{}');

		if (!token || user.role !== 'admin') {
			goto('/');
			return;
		}

		await loadUnits();
	});

	async function loadUnits() {
		loading = true;
		error = null;
		try {
			const response = await api.getMaterialUnits();
			units = response.data || [];
		} catch (err) {
			console.error('Failed to load material units:', err);
			error = $_('admin.materialUnits.messages.loadFailed');
		} finally {
			loading = false;
		}
	}

	function openAddModal() {
		formData = {
			unitCode: '',
			unitName: '',
			abbreviation: '',
			description: '',
			active: true
		};
		showAddModal = true;
	}

	function openEditModal(unit) {
		selectedUnit = unit;
		formData = {
			unitCode: unit.unitCode,
			unitName: unit.unitName,
			abbreviation: unit.abbreviation || '',
			description: unit.description || '',
			active: unit.active
		};
		showEditModal = true;
	}

	async function handleAddSubmit() {
		try {
			await api.createMaterialUnit(formData);
			showAddModal = false;
			await loadUnits();
			alert($_('admin.materialUnits.messages.createSuccess'));
		} catch (err) {
			console.error('Failed to create unit:', err);
			alert($_('admin.materialUnits.messages.createFailed'));
		}
	}

	async function handleEditSubmit() {
		try {
			await api.updateMaterialUnit(selectedUnit.id, formData);
			showEditModal = false;
			selectedUnit = null;
			await loadUnits();
			alert($_('admin.materialUnits.messages.updateSuccess'));
		} catch (err) {
			console.error('Failed to update unit:', err);
			alert($_('admin.materialUnits.messages.updateFailed'));
		}
	}

	async function handleDelete(unit) {
		if (!confirm($_('admin.materialUnits.deleteConfirm'))) {
			return;
		}

		try {
			// Soft delete by setting active to false
			await api.updateMaterialUnit(unit.id, { ...unit, active: false });
			await loadUnits();
			alert($_('admin.materialUnits.messages.deleteSuccess'));
		} catch (err) {
			console.error('Failed to delete unit:', err);
			alert($_('admin.materialUnits.messages.deleteFailed'));
		}
	}

	function toggleActive(unit) {
		return api.updateMaterialUnit(unit.id, { ...unit, active: !unit.active })
			.then(() => loadUnits())
			.catch(err => {
				console.error('Failed to toggle unit status:', err);
				alert($_('admin.materialUnits.messages.updateFailed'));
			});
	}
</script>

<div class="container mx-auto p-6">
	<!-- Header -->
	<div class="flex justify-between items-center mb-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">{$_('admin.materialUnits.title')}</h1>
			<p class="text-gray-600 mt-1">Manage units of measure for warehouse materials</p>
		</div>
		<button on:click={openAddModal} class="btn btn-primary">
			<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
			</svg>
			{$_('admin.materialUnits.add')}
		</button>
	</div>

	<!-- Content -->
	{#if loading}
		<div class="text-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
			<p class="mt-4 text-gray-600">Loading units...</p>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
			<svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
			</svg>
			<p class="mt-2 text-red-800">{error}</p>
		</div>
	{:else if units.length === 0}
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
			<svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
			</svg>
			<p class="mt-4 text-lg text-gray-600">{$_('admin.materialUnits.noUnits')}</p>
			<button on:click={openAddModal} class="mt-6 btn btn-primary">
				{$_('admin.materialUnits.addFirst')}
			</button>
		</div>
	{:else}
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{$_('admin.materialUnits.unitCode')}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{$_('admin.materialUnits.unitName')}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{$_('admin.materialUnits.abbreviation')}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{$_('admin.materialUnits.description')}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{$_('admin.materialUnits.status')}
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							{$_('admin.materialUnits.actions')}
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each units as unit}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="text-sm font-medium text-gray-900">{unit.unitCode}</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="text-sm text-gray-900">{unit.unitName}</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="text-sm text-gray-600">{unit.abbreviation || '-'}</span>
							</td>
							<td class="px-6 py-4">
								<span class="text-sm text-gray-600">{unit.description || '-'}</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<button
									on:click={() => toggleActive(unit)}
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {unit.active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} transition-colors"
								>
									{unit.active ? $_('admin.materialUnits.active') : $_('admin.materialUnits.inactive')}
								</button>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									on:click={() => openEditModal(unit)}
									class="text-blue-600 hover:text-blue-900 mr-4"
									title={$_('admin.materialUnits.edit')}
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
									</svg>
								</button>
								<button
									on:click={() => handleDelete(unit)}
									class="text-red-600 hover:text-red-900"
									title={$_('admin.materialUnits.delete')}
									disabled={!unit.active}
									class:opacity-50={!unit.active}
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
									</svg>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Add Unit Modal -->
<Modal open={showAddModal} title={$_('admin.materialUnits.add')} on:close={() => showAddModal = false}>
	<form on:submit|preventDefault={handleAddSubmit} class="space-y-4">
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">
				{$_('admin.materialUnits.unitCode')} *
			</label>
			<input
				type="text"
				bind:value={formData.unitCode}
				required
				maxlength="20"
				placeholder={$_('admin.materialUnits.placeholders.unitCode')}
				class="input"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">
				{$_('admin.materialUnits.unitName')} *
			</label>
			<input
				type="text"
				bind:value={formData.unitName}
				required
				maxlength="100"
				placeholder={$_('admin.materialUnits.placeholders.unitName')}
				class="input"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">
				{$_('admin.materialUnits.abbreviation')}
			</label>
			<input
				type="text"
				bind:value={formData.abbreviation}
				maxlength="10"
				placeholder={$_('admin.materialUnits.placeholders.abbreviation')}
				class="input"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">
				{$_('admin.materialUnits.description')}
			</label>
			<textarea
				bind:value={formData.description}
				rows="3"
				placeholder={$_('admin.materialUnits.placeholders.description')}
				class="input"
			></textarea>
		</div>

		<div>
			<label class="flex items-center space-x-2">
				<input type="checkbox" bind:checked={formData.active} class="rounded" />
				<span class="text-sm font-medium text-gray-700">{$_('admin.materialUnits.active')}</span>
			</label>
		</div>

		<div class="flex justify-end space-x-3 pt-4 border-t">
			<button type="button" on:click={() => showAddModal = false} class="btn btn-secondary">
				Cancel
			</button>
			<button type="submit" class="btn btn-primary">
				{$_('admin.materialUnits.add')}
			</button>
		</div>
	</form>
</Modal>

<!-- Edit Unit Modal -->
<Modal open={showEditModal} title={$_('admin.materialUnits.edit')} on:close={() => { showEditModal = false; selectedUnit = null; }}>
	<form on:submit|preventDefault={handleEditSubmit} class="space-y-4">
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">
				{$_('admin.materialUnits.unitCode')} *
			</label>
			<input
				type="text"
				bind:value={formData.unitCode}
				required
				maxlength="20"
				placeholder={$_('admin.materialUnits.placeholders.unitCode')}
				class="input"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">
				{$_('admin.materialUnits.unitName')} *
			</label>
			<input
				type="text"
				bind:value={formData.unitName}
				required
				maxlength="100"
				placeholder={$_('admin.materialUnits.placeholders.unitName')}
				class="input"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">
				{$_('admin.materialUnits.abbreviation')}
			</label>
			<input
				type="text"
				bind:value={formData.abbreviation}
				maxlength="10"
				placeholder={$_('admin.materialUnits.placeholders.abbreviation')}
				class="input"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">
				{$_('admin.materialUnits.description')}
			</label>
			<textarea
				bind:value={formData.description}
				rows="3"
				placeholder={$_('admin.materialUnits.placeholders.description')}
				class="input"
			></textarea>
		</div>

		<div>
			<label class="flex items-center space-x-2">
				<input type="checkbox" bind:checked={formData.active} class="rounded" />
				<span class="text-sm font-medium text-gray-700">{$_('admin.materialUnits.active')}</span>
			</label>
		</div>

		<div class="flex justify-end space-x-3 pt-4 border-t">
			<button type="button" on:click={() => { showEditModal = false; selectedUnit = null; }} class="btn btn-secondary">
				Cancel
			</button>
			<button type="submit" class="btn btn-primary">
				{$_('admin.materialUnits.edit')}
			</button>
		</div>
	</form>
</Modal>
