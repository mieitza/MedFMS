<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let data: any[] = [];
	export let columns: Array<{
		key: string;
		label: string;
		sortable?: boolean;
		searchable?: boolean;
		width?: string;
		render?: (value: any, row: any) => string;
	}> = [];
	export let loading = false;
	export let searchTerm = '';
	export let currentPage = 1;
	export let pageSize = 20;
	export let totalItems = 0;
	export let sortField = '';
	export let sortDirection: 'asc' | 'desc' = 'asc';
	export let showSearch = true;
	export let showPagination = true;
	export let showExport = true;
	export let title = '';

	const dispatch = createEventDispatcher();

	let filteredData: any[] = [];
	let displayedData: any[] = [];

	$: {
		// Filter data based on search term
		if (searchTerm && data.length > 0) {
			filteredData = data.filter((item) => {
				return columns.some((column) => {
					if (column.searchable === false) return false;
					const value = item[column.key];
					return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
				});
			});
		} else {
			filteredData = data;
		}

		// Sort data
		if (sortField) {
			filteredData = [...filteredData].sort((a, b) => {
				const aVal = a[sortField];
				const bVal = b[sortField];

				if (aVal == null) return 1;
				if (bVal == null) return -1;

				const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
				return sortDirection === 'desc' ? -comparison : comparison;
			});
		}

		// Paginate data
		const startIndex = (currentPage - 1) * pageSize;
		displayedData = filteredData.slice(startIndex, startIndex + pageSize);
		totalItems = filteredData.length;
	}

	function handleSort(columnKey: string) {
		if (sortField === columnKey) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = columnKey;
			sortDirection = 'asc';
		}
		dispatch('sort', { field: sortField, direction: sortDirection });
	}

	function handlePageChange(page: number) {
		currentPage = page;
		dispatch('pagechange', { page: currentPage });
	}

	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
		currentPage = 1; // Reset to first page
		dispatch('search', { term: searchTerm });
	}

	function handleRowClick(row: any, index: number) {
		dispatch('rowclick', { row, index });
	}

	function handleExport(format: string) {
		dispatch('export', { format, data: filteredData });
	}

	$: totalPages = Math.ceil(totalItems / pageSize);
	$: startItem = (currentPage - 1) * pageSize + 1;
	$: endItem = Math.min(currentPage * pageSize, totalItems);
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200">
	<!-- Header -->
	<div class="px-6 py-4 border-b border-gray-200">
		<div class="flex items-center justify-between">
			<div>
				{#if title}
					<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
				{/if}
				<p class="text-sm text-gray-600 mt-1">
					{totalItems} {totalItems === 1 ? 'item' : 'items'} total
				</p>
			</div>

			<div class="flex items-center space-x-4">
				{#if showSearch}
					<div class="relative">
						<svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
						</svg>
						<input
							type="text"
							placeholder="Search..."
							value={searchTerm}
							on:input={handleSearch}
							class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						/>
					</div>
				{/if}

				{#if showExport}
					<div class="relative">
						<button
							class="btn btn-secondary text-sm"
							on:click={() => handleExport('excel')}
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
							</svg>
							Export
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Table -->
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					{#each columns as column}
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							class:cursor-pointer={column.sortable !== false}
							style={column.width ? `width: ${column.width}` : ''}
							on:click={() => column.sortable !== false && handleSort(column.key)}
						>
							<div class="flex items-center space-x-1">
								<span>{column.label}</span>
								{#if column.sortable !== false}
									<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										{#if sortField === column.key}
											{#if sortDirection === 'asc'}
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
											{:else}
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15l-4 4-4-4m0-6l4-4 4 4"/>
											{/if}
										{:else}
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
										{/if}
									</svg>
								{/if}
							</div>
						</th>
					{/each}
					<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Actions
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#if loading}
					<tr>
						<td colspan={columns.length + 1} class="px-6 py-12 text-center">
							<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
							<p class="mt-2 text-gray-500">Loading...</p>
						</td>
					</tr>
				{:else if displayedData.length === 0}
					<tr>
						<td colspan={columns.length + 1} class="px-6 py-12 text-center">
							<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
							</svg>
							<p class="mt-2 text-gray-500">No data available</p>
						</td>
					</tr>
				{:else}
					{#each displayedData as row, index}
						<tr
							class="hover:bg-gray-50 cursor-pointer"
							on:click={() => handleRowClick(row, index)}
						>
							{#each columns as column}
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{#if column.render}
										{@html column.render(row[column.key], row)}
									{:else}
										{row[column.key] || '-'}
									{/if}
								</td>
							{/each}
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									class="text-primary-600 hover:text-primary-900 mr-4"
									on:click|stopPropagation={() => dispatch('edit', row)}
								>
									Edit
								</button>
								<button
									class="text-red-600 hover:text-red-900"
									on:click|stopPropagation={() => dispatch('delete', row)}
								>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	{#if showPagination && totalPages > 1}
		<div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
			<div class="flex items-center justify-between">
				<div class="text-sm text-gray-700">
					Showing {startItem} to {endItem} of {totalItems} results
				</div>
				<div class="flex items-center space-x-2">
					<button
						class="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
						disabled={currentPage === 1}
						on:click={() => handlePageChange(currentPage - 1)}
					>
						Previous
					</button>

					{#each Array(Math.min(5, totalPages)) as _, i}
						{@const pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 2}
						{#if pageNum <= totalPages && pageNum > 0}
							<button
								class="px-3 py-1 rounded-md border text-sm font-medium"
								class:bg-primary-600={pageNum === currentPage}
								class:text-white={pageNum === currentPage}
								class:border-primary-600={pageNum === currentPage}
								class:bg-white={pageNum !== currentPage}
								class:text-gray-700={pageNum !== currentPage}
								class:border-gray-300={pageNum !== currentPage}
								class:hover:bg-gray-50={pageNum !== currentPage}
								on:click={() => handlePageChange(pageNum)}
							>
								{pageNum}
							</button>
						{/if}
					{/each}

					<button
						class="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
						disabled={currentPage === totalPages}
						on:click={() => handlePageChange(currentPage + 1)}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>