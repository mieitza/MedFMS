<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import Modal from './Modal.svelte';

	export let entityType;
	export let entityId;
	export let title = 'Documents';

	let documents = [];
	let categories = [];
	let loading = false;
	let showUploadModal = false;
	let uploadFile = null;
	let uploadData = {
		documentName: '',
		categoryId: '',
		description: '',
		expiryDate: '',
		isPublic: false
	};

	onMount(async () => {
		await loadDocuments();
		await loadCategories();
	});

	async function loadDocuments() {
		loading = true;
		try {
			const response = await api.getDocuments(entityType, entityId);
			documents = response.data || [];
		} catch (error) {
			console.error('Failed to load documents:', error);
			documents = [];
		} finally {
			loading = false;
		}
	}

	async function loadCategories() {
		try {
			const response = await api.getDocumentCategories();
			categories = response.data || [];
		} catch (error) {
			console.error('Failed to load categories:', error);
			categories = [];
		}
	}

	function handleFileSelect(event) {
		const file = event.target.files[0];
		if (file) {
			uploadFile = file;
			if (!uploadData.documentName) {
				uploadData.documentName = file.name.replace(/\.[^/.]+$/, '');
			}
		}
	}

	async function handleUpload() {
		if (!uploadFile) {
			alert('Please select a file to upload');
			return;
		}

		if (!uploadData.documentName.trim()) {
			alert('Please enter a document name');
			return;
		}

		loading = true;
		try {
			await api.uploadDocument(uploadFile, {
				...uploadData,
				entityType,
				entityId
			});

			showUploadModal = false;
			resetUploadForm();
			await loadDocuments();
		} catch (error) {
			console.error('Failed to upload document:', error);
			alert('Failed to upload document. Please try again.');
		} finally {
			loading = false;
		}
	}

	async function handleDownload(document) {
		try {
			const blob = await api.downloadDocument(document.id);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = document.originalFileName;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error('Failed to download document:', error);
			alert('Failed to download document. Please try again.');
		}
	}

	async function handleDelete(document) {
		if (confirm(`Are you sure you want to delete "${document.documentName}"?`)) {
			try {
				await api.deleteDocument(document.id);
				await loadDocuments();
			} catch (error) {
				console.error('Failed to delete document:', error);
				alert('Failed to delete document. Please try again.');
			}
		}
	}

	function resetUploadForm() {
		uploadFile = null;
		uploadData = {
			documentName: '',
			categoryId: '',
			description: '',
			expiryDate: '',
			isPublic: false
		};

		// Reset file input
		const fileInput = document.getElementById('document-file-input');
		if (fileInput) fileInput.value = '';
	}

	function closeUploadModal() {
		showUploadModal = false;
		resetUploadForm();
	}

	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function formatDate(dateString) {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString();
	}

	function getFileIcon(mimeType) {
		if (mimeType.startsWith('image/')) return '🖼️';
		if (mimeType.includes('pdf')) return '📄';
		if (mimeType.includes('word')) return '📝';
		if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
		return '📁';
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
			Upload Document
		</button>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
		</div>
	{:else if documents.length === 0}
		<div class="text-center py-8">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">No documents</h3>
			<p class="mt-1 text-sm text-gray-500">Get started by uploading a document.</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each documents as document}
				<div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
					<div class="flex items-center space-x-3">
						<span class="text-2xl">{getFileIcon(document.mimeType)}</span>
						<div>
							<div class="font-medium text-gray-900">{document.documentName}</div>
							<div class="text-sm text-gray-500">
								{document.categoryName || 'Uncategorized'} •
								{formatFileSize(document.fileSize)} •
								{formatDate(document.createdAt)}
							</div>
							{#if document.description}
								<div class="text-sm text-gray-600 mt-1">{document.description}</div>
							{/if}
							{#if document.expiryDate}
								<div class="text-sm text-orange-600 mt-1">
									Expires: {formatDate(document.expiryDate)}
								</div>
							{/if}
						</div>
					</div>
					<div class="flex items-center space-x-2">
						<button
							on:click={() => handleDownload(document)}
							class="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded"
							title="Download"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
							</svg>
						</button>
						<button
							on:click={() => handleDelete(document)}
							class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
							title="Delete"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
							</svg>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Upload Modal -->
<Modal
	open={showUploadModal}
	title="Upload Document"
	size="md"
	on:close={closeUploadModal}
>
	<div class="space-y-4">
		<div>
			<label for="document-file-input" class="block text-sm font-medium text-gray-700 mb-2">
				Select File
			</label>
			<input
				id="document-file-input"
				type="file"
				on:change={handleFileSelect}
				class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
				accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp"
			/>
			{#if uploadFile}
				<div class="mt-2 text-sm text-gray-600">
					Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
				</div>
			{/if}
		</div>

		<div>
			<label for="document-name" class="block text-sm font-medium text-gray-700 mb-2">
				Document Name *
			</label>
			<input
				id="document-name"
				type="text"
				bind:value={uploadData.documentName}
				class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				placeholder="Enter document name"
				required
			/>
		</div>

		<div>
			<label for="document-category" class="block text-sm font-medium text-gray-700 mb-2">
				Category
			</label>
			<select
				id="document-category"
				bind:value={uploadData.categoryId}
				class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
			>
				<option value="">Select a category</option>
				{#each categories as category}
					<option value={category.id}>{category.categoryName}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="document-description" class="block text-sm font-medium text-gray-700 mb-2">
				Description
			</label>
			<textarea
				id="document-description"
				bind:value={uploadData.description}
				rows="3"
				class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
				placeholder="Enter description (optional)"
			></textarea>
		</div>

		<div>
			<label for="document-expiry" class="block text-sm font-medium text-gray-700 mb-2">
				Expiry Date
			</label>
			<input
				id="document-expiry"
				type="date"
				bind:value={uploadData.expiryDate}
				class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
			/>
		</div>

		<div class="flex items-center">
			<input
				id="document-public"
				type="checkbox"
				bind:checked={uploadData.isPublic}
				class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
			/>
			<label for="document-public" class="ml-2 block text-sm text-gray-900">
				Make this document public
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
			Upload Document
		</button>
	</svelte:fragment>
</Modal>