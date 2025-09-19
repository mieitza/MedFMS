<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let open = false;
	export let title = '';
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let showCloseButton = true;
	export let closable = true;

	const dispatch = createEventDispatcher();

	const sizes = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};

	function closeModal() {
		if (closable) {
			open = false;
			dispatch('close');
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && closable) {
			closeModal();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget && closable) {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
		>
			<!-- Background overlay -->
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				on:click={handleBackdropClick}
				on:keydown={() => {}}
			></div>

			<!-- This element is to trick the browser into centering the modal contents. -->
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

			<!-- Modal panel -->
			<div
				class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle {sizes[size]} sm:w-full sm:p-6"
			>
				{#if title || showCloseButton}
					<div class="flex items-center justify-between mb-4">
						{#if title}
							<h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
								{title}
							</h3>
						{/if}
						{#if showCloseButton && closable}
							<button
								type="button"
								class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
								on:click={closeModal}
							>
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						{/if}
					</div>
				{/if}

				<div class="mt-3">
					<slot />
				</div>

				{#if $$slots.footer}
					<div class="mt-6 flex justify-end space-x-3">
						<slot name="footer" />
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}