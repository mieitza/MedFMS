<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import Modal from './Modal.svelte';

	export let entityType;
	export let entityId;
	export let title = 'Photos';

	let photos = [];
	let loading = false;
	let showUploadModal = false;
	let showViewModal = false;
	let selectedPhoto = null;
	let uploadFile = null;
	let uploadData = {
		photoName: '',
		description: '',
		isPrimary: false
	};

	onMount(async () => {
		await loadPhotos();
	});

	async function loadPhotos() {
		loading = true;
		try {
			const response = await api.getPhotos(entityType, entityId);
			photos = response.data || [];
		} catch (error) {
			console.error('Failed to load photos:', error);
			photos = [];
		} finally {
			loading = false;
		}
	}

	function handleFileSelect(event) {
		const file = event.target.files[0];
		if (file) {
			if (!file.type.startsWith('image/')) {
				alert('Please select an image file');
				return;
			}
			uploadFile = file;
			if (!uploadData.photoName) {
				uploadData.photoName = file.name.replace(/\.[^/.]+$/, '');
			}
		}
	}

	async function handleUpload() {
		if (!uploadFile) {
			alert('Please select an image file to upload');
			return;
		}

		if (!uploadData.photoName.trim()) {
			alert('Please enter a photo name');
			return;
		}

		loading = true;
		try {
			await api.uploadPhoto(uploadFile, {
				...uploadData,
				entityType,
				entityId
			});

			showUploadModal = false;
			resetUploadForm();
			await loadPhotos();
		} catch (error) {
			console.error('Failed to upload photo:', error);
			alert('Failed to upload photo. Please try again.');
		} finally {
			loading = false;
		}
	}

	async function handleDelete(photo) {
		if (confirm(`Are you sure you want to delete "${photo.photoName}"?`)) {
			try {
				await api.deletePhoto(photo.id);
				await loadPhotos();
			} catch (error) {
				console.error('Failed to delete photo:', error);
				alert('Failed to delete photo. Please try again.');
			}
		}
	}

	function handlePhotoClick(photo) {
		selectedPhoto = photo;
		showViewModal = true;
	}

	function resetUploadForm() {
		uploadFile = null;
		uploadData = {
			photoName: '',
			description: '',
			isPrimary: false
		};

		// Reset file input
		const fileInput = document.getElementById('photo-file-input');
		if (fileInput) fileInput.value = '';
	}

	function closeUploadModal() {
		showUploadModal = false;
		resetUploadForm();
	}

	function closeViewModal() {
		showViewModal = false;
		selectedPhoto = null;
	}

	function formatDate(dateString) {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString();
	}

	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
</script>

<div class="bg-white rounded-lg shadow p-6">
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
		<button
			on:click={() => showUploadModal = true}
			class="btn btn-primary btn-sm"
		>
			<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
			</svg>
			Upload Photo
		</button>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
		</div>
	{:else if photos.length === 0}
		<div class="text-center py-8">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">No photos</h3>
			<p class="mt-1 text-sm text-gray-500">Get started by uploading a photo.</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each photos as photo}
				<div class="relative group cursor-pointer" on:click={() => handlePhotoClick(photo)}>
					<div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
						<img
							src={api.getPhotoUrl(photo.id)}
							alt={photo.photoName}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
							loading="lazy"
						/>
					</div>
					{#if photo.isPrimary}
						<div class="absolute top-2 left-2">
							<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
								Primary
							</span>
						</div>
					{/if}
					<div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							on:click|stopPropagation={() => handleDelete(photo)}
							class="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
							title="Delete photo"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
							</svg>
						</button>
					</div>
					<div class="mt-2">
						<p class="text-sm font-medium text-gray-900 truncate">{photo.photoName}</p>
						<p class="text-xs text-gray-500">{formatDate(photo.createdAt)}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Upload Modal -->
<Modal
	open={showUploadModal}
	title="Upload Photo"
	size="md"
	on:close={closeUploadModal}
>
	<div class="space-y-4">
		<div>
			<label for="photo-file-input" class="block text-sm font-medium text-gray-700 mb-2">
				Select Image *
			</label>
			<input
				id="photo-file-input"
				type="file"
				on:change={handleFileSelect}
				class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
				accept="image/*"
				required
			/>
			{#if uploadFile}
				<div class="mt-2">
					<div class="text-sm text-gray-600">
						Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
					</div>
					<div class="mt-2">
						<img
							src={URL.createObjectURL(uploadFile)}
							alt="Preview"
							class="h-32 w-32 object-cover rounded-lg"
						/>
					</div>
				</div>
			{/if}
		</div>

		<div>
			<label for="photo-name" class="block text-sm font-medium text-gray-700 mb-2">
				Photo Name *
			</label>
			<input
				id="photo-name"
				type="text"
				bind:value={uploadData.photoName}
				class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				placeholder="Enter photo name"
				required
			/>
		</div>

		<div>
			<label for="photo-description" class="block text-sm font-medium text-gray-700 mb-2">
				Description
			</label>
			<textarea
				id="photo-description"
				bind:value={uploadData.description}
				rows="3"
				class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				placeholder="Enter description (optional)"
			></textarea>
		</div>

		<div class="flex items-center">
			<input
				id="photo-primary"
				type="checkbox"
				bind:checked={uploadData.isPrimary}
				class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
			/>
			<label for="photo-primary" class="ml-2 block text-sm text-gray-900">
				Set as primary photo
			</label>
		</div>
	</div>

	<svelte:fragment slot="footer">
		<button type="button" class="btn btn-secondary" on:click={closeUploadModal}>
			Cancel
		</button>
		<button
			type="button"
			class="btn btn-primary"
			on:click={handleUpload}
			disabled={loading || !uploadFile}
		>
			{#if loading}
				<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			{/if}
			Upload Photo
		</button>
	</svelte:fragment>
</Modal>

<!-- Photo View Modal -->
<Modal
	open={showViewModal}
	title={selectedPhoto?.photoName || 'Photo'}
	size="lg"
	on:close={closeViewModal}
>
	{#if selectedPhoto}
		<div class="space-y-4">
			<div class="flex justify-center">
				<img
					src={api.getPhotoUrl(selectedPhoto.id)}
					alt={selectedPhoto.photoName}
					class="max-w-full max-h-96 object-contain rounded-lg"
				/>
			</div>

			<div class="space-y-2">
				<div class="flex justify-between">
					<span class="text-sm font-medium text-gray-700">Name:</span>
					<span class="text-sm text-gray-900">{selectedPhoto.photoName}</span>
				</div>

				{#if selectedPhoto.description}
					<div class="flex justify-between">
						<span class="text-sm font-medium text-gray-700">Description:</span>
						<span class="text-sm text-gray-900">{selectedPhoto.description}</span>
					</div>
				{/if}

				<div class="flex justify-between">
					<span class="text-sm font-medium text-gray-700">Uploaded:</span>
					<span class="text-sm text-gray-900">{formatDate(selectedPhoto.createdAt)}</span>
				</div>

				<div class="flex justify-between">
					<span class="text-sm font-medium text-gray-700">File Size:</span>
					<span class="text-sm text-gray-900">{formatFileSize(selectedPhoto.fileSize)}</span>
				</div>

				{#if selectedPhoto.isPrimary}
					<div class="flex justify-between">
						<span class="text-sm font-medium text-gray-700">Status:</span>
						<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
							Primary Photo
						</span>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<svelte:fragment slot="footer">
		<button type="button" class="btn btn-secondary" on:click={closeViewModal}>
			Close
		</button>
		{#if selectedPhoto}
			<button
				type="button"
				class="btn btn-danger"
				on:click={() => { handleDelete(selectedPhoto); closeViewModal(); }}
			>
				Delete Photo
			</button>
		{/if}
	</svelte:fragment>
</Modal>