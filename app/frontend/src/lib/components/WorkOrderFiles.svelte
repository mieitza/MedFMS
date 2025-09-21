<script>
  import { createEventDispatcher } from 'svelte';
  import { api } from '$lib/api';
  import FileUpload from './FileUpload.svelte';

  export let workOrderId = null;
  export let showUpload = true;
  export let title = 'Work Order Files';

  const dispatch = createEventDispatcher();

  let existingFiles = [];
  let loading = false;

  // Load existing files when workOrderId changes
  $: if (workOrderId) {
    loadExistingFiles();
  }

  async function loadExistingFiles() {
    if (!workOrderId) return;

    loading = true;
    try {
      // Load both documents and photos
      const [documentsResponse, photosResponse] = await Promise.all([
        api.getDocuments('maintenance_work_order', workOrderId),
        api.getPhotos('maintenance_work_order', workOrderId)
      ]);

      existingFiles = [
        ...(documentsResponse.data || []).map(doc => ({ ...doc, type: 'document' })),
        ...(photosResponse.data || []).map(photo => ({ ...photo, type: 'photo' }))
      ];
    } catch (error) {
      console.error('Error loading existing files:', error);
      existingFiles = [];
    } finally {
      loading = false;
    }
  }

  async function handleFileUploaded(event) {
    // Refresh the file list when new files are uploaded
    await loadExistingFiles();
    dispatch('fileUploaded', event.detail);
  }

  async function deleteFile(file) {
    const fileName = file.originalFileName || file.documentName || file.photoName || file.fileName || file.caption || 'this file';
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }

    try {
      if (file.type === 'document') {
        await api.deleteDocument(file.id);
      } else {
        await api.deletePhoto(file.id);
      }

      // Refresh the file list
      await loadExistingFiles();
      dispatch('fileDeleted', { file });
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file: ' + error.message);
    }
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getFileIcon(file) {
    if (file.type === 'photo') return '🖼️';
    if (file.mimeType) {
      if (file.mimeType === 'application/pdf') return '📄';
      if (file.mimeType.includes('word')) return '📝';
      if (file.mimeType.includes('excel') || file.mimeType.includes('spreadsheet')) return '📊';
    }
    return '📁';
  }

  async function downloadFile(file) {
    try {
      const filename = file.originalFileName || file.documentName || file.photoName || file.fileName || 'download';

      // Use the API client for consistent handling
      const blob = file.type === 'photo'
        ? await api.downloadPhoto(file.id)
        : await api.downloadDocument(file.id);

      console.log('Downloaded blob size:', blob.size);
      console.log('Downloaded blob type:', blob.type);
      console.log('Expected file size:', file.fileSize);

      // Create download link
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Cleanup after a delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }, 100);

    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file: ' + error.message);
    }
  }
</script>

<div class="work-order-files">
  <h3 class="text-lg font-medium text-gray-900 mb-4">{title}</h3>

  <!-- Existing Files -->
  {#if loading}
    <div class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600">Loading files...</span>
    </div>
  {:else if existingFiles.length > 0}
    <div class="mb-6">
      <h4 class="font-medium text-gray-900 mb-3">Existing Files ({existingFiles.length})</h4>
      <div class="grid grid-cols-1 gap-3">
        {#each existingFiles as file}
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{getFileIcon(file)}</span>
              <div class="flex-1">
                <p class="font-medium text-gray-900">
                  {file.originalFileName || file.documentName || file.photoName || file.fileName || file.caption || 'Untitled'}
                </p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{file.type === 'photo' ? 'Photo' : 'Document'}</span>
                  {#if file.fileSize}
                    <span>{formatFileSize(file.fileSize)}</span>
                  {/if}
                  {#if file.createdAt}
                    <span>Uploaded {new Date(file.createdAt).toLocaleDateString()}</span>
                  {/if}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                on:click={() => downloadFile(file)}
                class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Download"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button
                on:click={() => deleteFile(file)}
                class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if workOrderId}
    <div class="text-center py-6 mb-6">
      <p class="text-gray-500">No files attached to this work order yet.</p>
    </div>
  {/if}

  <!-- File Upload Section -->
  {#if showUpload && workOrderId}
    <div class="border-t pt-6">
      <FileUpload
        entityType="maintenance_work_order"
        entityId={workOrderId}
        title="Upload New Files"
        description="Add photos and documents to this work order"
        multiple={true}
        maxFiles={10}
        maxFileSize={20 * 1024 * 1024}
        on:uploaded={handleFileUploaded}
      />
    </div>
  {:else if showUpload && !workOrderId}
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex">
        <svg class="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <p class="text-yellow-800 font-medium">File uploads will be available after creating the work order</p>
          <p class="text-yellow-700 text-sm mt-1">You can add photos and documents once the work order is saved.</p>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .work-order-files {
    @apply w-full;
  }
</style>