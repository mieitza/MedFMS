<script>
	import { createEventDispatcher } from 'svelte';

	export let options = [];
	export let value = null;
	export let labelField = 'label';
	export let valueField = 'id';
	export let placeholder = 'Select...';
	export let disabled = false;
	export let required = false;
	export let id = undefined;

	const dispatch = createEventDispatcher();

	let open = false;
	let search = '';
	let inputEl;
	let containerEl;

	$: selectedOption = options.find(o => String(o[valueField]) === String(value));
	$: displayValue = open ? search : (selectedOption ? getLabel(selectedOption) : '');
	$: filtered = search
		? options.filter(o => getLabel(o).toLowerCase().includes(search.toLowerCase()))
		: options;

	function getLabel(option) {
		if (typeof labelField === 'function') return labelField(option);
		return option[labelField] || '';
	}

	function handleFocus() {
		if (disabled) return;
		open = true;
		search = '';
	}

	function handleInput(e) {
		search = e.target.value;
		open = true;
	}

	function select(option) {
		value = option[valueField];
		open = false;
		search = '';
		dispatch('change', { value });
	}

	function clear() {
		value = null;
		open = false;
		search = '';
		dispatch('change', { value: null });
	}

	function handleKeydown(e) {
		if (e.key === 'Escape') {
			open = false;
			search = '';
			inputEl?.blur();
		}
	}

	function handleClickOutside(e) {
		if (containerEl && !containerEl.contains(e.target)) {
			open = false;
			search = '';
		}
	}
</script>

<svelte:window on:mousedown={handleClickOutside} />

<div class="searchable-select" bind:this={containerEl}>
	<div class="relative">
		<input
			{id}
			type="text"
			class="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white"
			class:bg-gray-100={disabled}
			class:cursor-not-allowed={disabled}
			{placeholder}
			{disabled}
			{required}
			value={displayValue}
			on:focus={handleFocus}
			on:input={handleInput}
			on:keydown={handleKeydown}
			bind:this={inputEl}
			autocomplete="off"
		/>
		{#if value && !disabled}
			<button
				type="button"
				class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
				on:click|stopPropagation={clear}
				tabindex="-1"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{:else}
			<div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		{/if}
	</div>

	{#if open}
		<div class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
			{#if filtered.length === 0}
				<div class="px-3 py-2 text-sm text-gray-500">No results</div>
			{:else}
				{#each filtered as option}
					<button
						type="button"
						class="w-full text-left px-3 py-2 text-sm hover:bg-primary-50 hover:text-primary-900 transition-colors"
						class:bg-primary-100={String(option[valueField]) === String(value)}
						class:font-medium={String(option[valueField]) === String(value)}
						on:mousedown|preventDefault={() => select(option)}
					>
						{getLabel(option)}
					</button>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.searchable-select {
		position: relative;
	}
</style>
