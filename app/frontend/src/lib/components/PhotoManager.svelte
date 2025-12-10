<script>
	import { onMount, tick } from 'svelte';
	import { api } from '$lib/api';
	import { _ } from '$lib/i18n';
	import Modal from './Modal.svelte';

	export let entityType;
	export let entityId;
	export let title = null;
	export let maxFileSize = 10 * 1024 * 1024; // 10MB default
	export let maxFiles = 10; // Maximum files per upload

	let photos = [];
	let loading = false;
	let showUploadModal = false;
	let showViewModal = false;
	let selectedPhoto = null;
	let selectedPhotoUrl = null;
	let uploadFiles = []; // Array of files for multi-upload
	let photoThumbnails = {}; // Map of photo ID to blob URL
	let dragOver = false;
	let uploadProgress = {}; // Map of file index to upload progress
	let uploadData = {
		description: '',
		isPrimary: false
	};

	onMount(async () => {
		await loadPhotos();
	});

	async function loadPhotos() {
		loading = true;
		try {
			// Clean up old thumbnail URLs
			Object.values(photoThumbnails).forEach(url => {
				if (url) URL.revokeObjectURL(url);
			});
			photoThumbnails = {};

			const response = await api.getPhotos(entityType, entityId);
			photos = response.data || [];

			// Load thumbnails for all photos
			await loadPhotoThumbnails();
		} catch (error) {
			console.error('Failed to load photos:', error);
			photos = [];
		} finally {
			loading = false;
		}
	}

	async function loadPhotoThumbnails() {
		// Load thumbnails in parallel
		await Promise.all(
			photos.map(async (photo) => {
				try {
					const blob = await api.downloadPhoto(photo.id);
					photoThumbnails[photo.id] = URL.createObjectURL(blob);
				} catch (error) {
					console.error(`Failed to load thumbnail for photo ${photo.id}:`, error);
					photoThumbnails[photo.id] = null;
				}
			})
		);
		// Trigger reactivity
		photoThumbnails = photoThumbnails;
	}

	// Drag and drop handlers
	function handleDragOver(event) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave(event) {
		event.preventDefault();
		dragOver = false;
	}

	function handleDrop(event) {
		event.preventDefault();
		dragOver = false;
		const droppedFiles = Array.from(event.dataTransfer.files);
		addFiles(droppedFiles);
	}

	function handleFileSelect(event) {
		const selectedFiles = Array.from(event.target.files);
		addFiles(selectedFiles);
	}

	function addFiles(newFiles) {
		// Validate and filter files - only images allowed
		const validFiles = newFiles.filter(file => {
			// Check if it's an image
			if (!file.type.startsWith('image/')) {
				alert(`File "${file.name}" is not an image. Only image files are allowed.`);
				return false;
			}

			// Check file size
			if (file.size > maxFileSize) {
				alert(`File "${file.name}" is too large. Maximum size is ${formatFileSize(maxFileSize)}`);
				return false;
			}

			// Check if we already have this file
			if (uploadFiles.some(f => f.name === file.name && f.size === file.size)) {
				alert(`File "${file.name}" is already selected`);
				return false;
			}

			return true;
		});

		const newFileList = [...uploadFiles, ...validFiles];

		// Check max files limit
		if (newFileList.length > maxFiles) {
			alert(`Maximum ${maxFiles} photos allowed per upload`);
			uploadFiles = newFileList.slice(0, maxFiles);
		} else {
			uploadFiles = newFileList;
		}

		// Generate previews for new files
		uploadFiles = uploadFiles.map((file) => {
			if (!file.preview) {
				// Use Object.assign to preserve File prototype
				const enrichedFile = Object.assign(file, {
					preview: URL.createObjectURL(file),
					photoName: file.name.replace(/\.[^/.]+$/, '')
				});
				return enrichedFile;
			}
			return file;
		});
	}

	function removeFile(index) {
		// Clean up preview URL if it exists
		const file = uploadFiles[index];
		if (file.preview) {
			URL.revokeObjectURL(file.preview);
		}
		uploadFiles = uploadFiles.filter((_, i) => i !== index);
		delete uploadProgress[index];
		uploadProgress = uploadProgress;
	}

	function updateFileName(file, index) {
		uploadFiles[index] = { ...file, photoName: file.photoName };
		uploadFiles = uploadFiles;
	}

	async function handleUpload() {
		if (uploadFiles.length === 0) {
			alert('Please select at least one image to upload');
			return;
		}

		loading = true;
		uploadProgress = {};

		try {
			// Upload files sequentially with progress tracking
			const results = [];
			for (let i = 0; i < uploadFiles.length; i++) {
				const file = uploadFiles[i];

				// Set initial progress
				uploadProgress[i] = { progress: 0, uploading: true };
				uploadProgress = uploadProgress;

				try {
					// Simulate progress
					uploadProgress[i] = { progress: 30, uploading: true };
					uploadProgress = uploadProgress;

					// Only set isPrimary for first photo if checkbox is checked
					const isPrimaryForThisPhoto = uploadData.isPrimary && i === 0;

					const result = await api.uploadPhoto(file, {
						photoName: file.photoName || file.name.replace(/\.[^/.]+$/, ''),
						description: uploadData.description,
						isPrimary: isPrimaryForThisPhoto,
						entityType,
						entityId
					});

					uploadProgress[i] = { progress: 100, uploading: false, success: true };
					uploadProgress = uploadProgress;
					results.push(result);
				} catch (error) {
					console.error(`Failed to upload ${file.name}:`, error);
					uploadProgress[i] = { progress: 0, uploading: false, error: error.message };
					uploadProgress = uploadProgress;
				}
			}

			// Show results
			const successCount = results.length;
			const failCount = uploadFiles.length - successCount;

			if (failCount === 0) {
				alert(`Successfully uploaded ${successCount} photo(s)`);
				showUploadModal = false;
				resetUploadForm();
			} else if (successCount === 0) {
				alert(`Failed to upload all photos. Please try again.`);
			} else {
				alert(`Uploaded ${successCount} photo(s) successfully, ${failCount} failed`);
			}

			await loadPhotos();
		} catch (error) {
			console.error('Upload error:', error);
			alert('An error occurred during upload. Please try again.');
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

	async function handlePhotoClick(photo) {
		try {
			selectedPhoto = photo;

			// First, try to use the cached thumbnail URL if available
			if (photoThumbnails[photo.id]) {
				// Clean up previous URL if it was independently created
				if (selectedPhotoUrl && selectedPhotoUrl !== photoThumbnails[photo.id]) {
					URL.revokeObjectURL(selectedPhotoUrl);
				}
				selectedPhotoUrl = photoThumbnails[photo.id];
				// Wait for DOM to update before showing modal
				await tick();
				showViewModal = true;
				return;
			}

			// Fallback: Load full resolution photo if not cached
			const blob = await api.downloadPhoto(photo.id);

			// Clean up previous URL
			if (selectedPhotoUrl) {
				URL.revokeObjectURL(selectedPhotoUrl);
			}

			selectedPhotoUrl = URL.createObjectURL(blob);
			// Wait for DOM to update before showing modal
			await tick();
			showViewModal = true;
		} catch (error) {
			console.error('Failed to load photo:', error);
			alert('Failed to load photo. Please try again.');
		}
	}

	function resetUploadForm() {
		// Clean up preview URLs
		uploadFiles.forEach(file => {
			if (file.preview) {
				URL.revokeObjectURL(file.preview);
			}
		});

		uploadFiles = [];
		uploadProgress = {};

		uploadData = {
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
		// Only revoke if it's not a shared thumbnail URL
		if (selectedPhotoUrl && selectedPhoto && selectedPhotoUrl !== photoThumbnails[selectedPhoto.id]) {
			URL.revokeObjectURL(selectedPhotoUrl);
		}
		selectedPhotoUrl = null;
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
		<h3 class="text-lg font-semibold text-gray-900">{title || $_('photos.title')}</h3>
		<button
			on:click={() => showUploadModal = true}
			class="btn btn-primary btn-sm"
		>
			<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
			</svg>
			{$_('photos.uploadPhoto')}
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
			<h3 class="mt-2 text-sm font-medium text-gray-900">{$_('photos.noPhotos')}</h3>
			<p class="mt-1 text-sm text-gray-500">{$_('photos.getStarted')}</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each photos as photo}
				<div class="relative group cursor-pointer" on:click={() => handlePhotoClick(photo)}>
					<div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
						{#if photoThumbnails[photo.id]}
							<img
								src={photoThumbnails[photo.id]}
								alt={photo.photoName}
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
								loading="lazy"
							/>
						{:else}
							<div class="w-full h-full flex items-center justify-center bg-gray-100">
								<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
							</div>
						{/if}
					</div>
					{#if photo.isPrimary}
						<div class="absolute top-2 left-2">
							<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
								{$_('common.primary')}
							</span>
						</div>
					{/if}
					<div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							on:click|stopPropagation={() => handleDelete(photo)}
							class="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
							title={$_('photos.deletePhoto')}
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
	title={$_('photos.uploadPhotos')}
	size="lg"
	on:close={closeUploadModal}
>
	<div class="space-y-4">
		<!-- Drag and drop zone -->
		<div
			class="border-2 border-dashed rounded-lg p-8 text-center transition-colors {dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}"
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			on:drop={handleDrop}
		>
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
			</svg>
			<p class="mt-2 text-sm text-gray-600">
				{$_('photos.dragAndDrop')}
				<label for="photo-file-input" class="text-primary-600 hover:text-primary-500 cursor-pointer font-medium">
					{$_('common.browse')}
				</label>
			</p>
			<input
				id="photo-file-input"
				type="file"
				multiple
				on:change={handleFileSelect}
				class="hidden"
				accept="image/*"
			/>
			<p class="mt-1 text-xs text-gray-500">
				{$_('photos.maxFiles', { values: { count: maxFiles, size: formatFileSize(maxFileSize) }})}
			</p>
		</div>

		<!-- Selected files preview -->
		{#if uploadFiles.length > 0}
			<div class="space-y-2 max-h-64 overflow-y-auto">
				<h4 class="text-sm font-medium text-gray-700">{$_('photos.selectedPhotos')} ({uploadFiles.length})</h4>
				{#each uploadFiles as file, index}
					<div class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
						<!-- Preview -->
						{#if file.preview}
							<img src={file.preview} alt={file.name} class="w-12 h-12 object-cover rounded" />
						{:else}
							<div class="w-12 h-12 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center">
								<span class="text-2xl">🖼️</span>
							</div>
						{/if}

						<!-- File info -->
						<div class="flex-1 min-w-0">
							<input
								type="text"
								bind:value={file.photoName}
								on:input={() => updateFileName(file, index)}
								class="w-full text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded px-2 py-1"
								placeholder={$_('common.name')}
							/>
							<p class="text-xs text-gray-500 mt-1">
								{file.name} • {formatFileSize(file.size)}
							</p>

							<!-- Upload progress -->
							{#if uploadProgress[index]}
								<div class="mt-1">
									{#if uploadProgress[index].uploading}
										<div class="w-full bg-gray-200 rounded-full h-1.5">
											<div
												class="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
												style="width: {uploadProgress[index].progress}%"
											></div>
										</div>
										<p class="text-xs text-gray-500 mt-0.5">{uploadProgress[index].progress}%</p>
									{:else if uploadProgress[index].success}
										<p class="text-xs text-green-600">{$_('photos.uploadedSuccessfully')}</p>
									{:else if uploadProgress[index].error}
										<p class="text-xs text-red-600">✗ {uploadProgress[index].error}</p>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Remove button -->
						<button
							type="button"
							on:click={() => removeFile(index)}
							class="text-gray-400 hover:text-red-600"
							disabled={uploadProgress[index]?.uploading}
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
							</svg>
						</button>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Shared metadata for all photos -->
		{#if uploadFiles.length > 0}
			<div class="space-y-4 pt-4 border-t border-gray-200">
				<h4 class="text-sm font-medium text-gray-700">{$_('photos.photoDetails')}</h4>

				<div>
					<label for="photo-description" class="block text-sm font-medium text-gray-700 mb-2">
						{$_('common.description')}
					</label>
					<textarea
						id="photo-description"
						bind:value={uploadData.description}
						rows="2"
						class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
						{$_('photos.setAsPrimary')}
					</label>
				</div>
			</div>
		{/if}
	</div>

	<svelte:fragment slot="footer">
		<button type="button" class="btn btn-secondary" on:click={closeUploadModal}>
			{$_('common.cancel')}
		</button>
		<button
			type="button"
			class="btn btn-primary"
			on:click={handleUpload}
			disabled={loading || uploadFiles.length === 0}
		>
			{#if loading}
				<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				{$_('common.uploading')}
			{:else}
				{uploadFiles.length === 1 ? $_('photos.uploadCount', { values: { count: uploadFiles.length }}) : $_('photos.uploadCountPlural', { values: { count: uploadFiles.length }})}
			{/if}
		</button>
	</svelte:fragment>
</Modal>

<!-- Photo View Modal -->
<Modal
	open={showViewModal}
	title={selectedPhoto?.photoName || $_('photos.title')}
	size="lg"
	on:close={closeViewModal}
>
	{#if selectedPhoto}
		<div class="space-y-4">
			<div class="flex justify-center">
				{#if selectedPhotoUrl}
					<img
						src={selectedPhotoUrl}
						alt={selectedPhoto.photoName}
						class="max-w-full max-h-96 object-contain rounded-lg"
					/>
				{:else}
					<div class="flex items-center justify-center h-64">
						<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
					</div>
				{/if}
			</div>

			<div class="space-y-2">
				<div class="flex justify-between">
					<span class="text-sm font-medium text-gray-700">{$_('common.name')}:</span>
					<span class="text-sm text-gray-900">{selectedPhoto.photoName}</span>
				</div>

				{#if selectedPhoto.description}
					<div class="flex justify-between">
						<span class="text-sm font-medium text-gray-700">{$_('common.description')}:</span>
						<span class="text-sm text-gray-900">{selectedPhoto.description}</span>
					</div>
				{/if}

				<div class="flex justify-between">
					<span class="text-sm font-medium text-gray-700">{$_('common.uploaded')}:</span>
					<span class="text-sm text-gray-900">{formatDate(selectedPhoto.createdAt)}</span>
				</div>

				<div class="flex justify-between">
					<span class="text-sm font-medium text-gray-700">{$_('common.fileSize')}:</span>
					<span class="text-sm text-gray-900">{formatFileSize(selectedPhoto.fileSize)}</span>
				</div>

				{#if selectedPhoto.isPrimary}
					<div class="flex justify-between">
						<span class="text-sm font-medium text-gray-700">{$_('common.status')}:</span>
						<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
							{$_('photos.primaryPhoto')}
						</span>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<svelte:fragment slot="footer">
		<button type="button" class="btn btn-secondary" on:click={closeViewModal}>
			{$_('common.close')}
		</button>
		{#if selectedPhoto}
			<button
				type="button"
				class="btn btn-danger"
				on:click={() => { handleDelete(selectedPhoto); closeViewModal(); }}
			>
				{$_('photos.deletePhoto')}
			</button>
		{/if}
	</svelte:fragment>
</Modal>