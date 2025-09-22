<script>
  import { createEventDispatcher } from 'svelte';
  import { api } from '$lib/api';

  export let entityType = '';
  export let entityId = null;
  export let accept = '*/*';
  export let multiple = false;
  export let maxFiles = 5;
  export let maxFileSize = 10 * 1024 * 1024; // 10MB
  export let title = 'Upload Files';
  export let description = 'Click to select files or drag and drop';

  const dispatch = createEventDispatcher();

  let files = [];
  let uploading = false;
  let dragOver = false;
  let fileInput;

  const allowedTypes = {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ]
  };

  function handleFileInput(event) {
    const selectedFiles = Array.from(event.target.files || []);
    addFiles(selectedFiles);
  }

  function handleDrop(event) {
    event.preventDefault();
    dragOver = false;
    const droppedFiles = Array.from(event.dataTransfer.files);
    addFiles(droppedFiles);
  }

  function handleDragOver(event) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function addFiles(newFiles) {
    const validFiles = newFiles.filter(file => {
      // Check file size
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxFileSize)}`);
        return false;
      }

      // Check if we already have this file
      if (files.some(f => f.name === file.name && f.size === file.size)) {
        alert(`File ${file.name} is already selected`);
        return false;
      }

      return true;
    });

    const newFileList = [...files, ...validFiles];

    if (!multiple && newFileList.length > 1) {
      files = [newFileList[newFileList.length - 1]];
    } else if (newFileList.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      files = newFileList.slice(0, maxFiles);
    } else {
      files = newFileList;
    }

    // Auto-upload if entityId is provided
    if (entityId && entityType) {
      uploadFiles();
    }
  }

  function removeFile(index) {
    files = files.filter((_, i) => i !== index);
  }

  async function uploadFiles() {
    if (files.length === 0) return;

    uploading = true;

    try {
      const uploadPromises = files.map(async (file) => {
        const isImage = file.type.startsWith('image/');
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension for name

        if (isImage) {
          return await api.uploadPhoto(file, {
            photoName: fileName,
            entityType,
            entityId,
            description: fileName
          });
        } else {
          return await api.uploadDocument(file, {
            documentName: fileName,
            entityType,
            entityId,
            description: fileName
          });
        }
      });

      const results = await Promise.all(uploadPromises);

      dispatch('uploaded', {
        files: results.map(r => r.data),
        count: results.length
      });

      // Clear files after successful upload
      files = [];
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files: ' + error.message);
    } finally {
      uploading = false;
    }
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    return '📁';
  }

  function triggerFileInput() {
    fileInput.click();
  }
</script>

<div class="file-upload-container">
  <div class="mb-4">
    <h3 class="text-lg font-medium text-gray-900">{title}</h3>
    <p class="text-sm text-gray-600">{description}</p>
  </div>

  <!-- File input (hidden) -->
  <input
    bind:this={fileInput}
    type="file"
    {accept}
    {multiple}
    on:change={handleFileInput}
    class="hidden"
  />

  <!-- Drop zone -->
  <div
    class="border-2 border-dashed rounded-lg p-6 text-center transition-colors {dragOver
      ? 'border-blue-400 bg-blue-50'
      : 'border-gray-300 hover:border-gray-400'}"
    on:drop={handleDrop}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:click={triggerFileInput}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
  >
    <div class="mx-auto w-12 h-12 mb-4">
      <svg class="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    </div>
    <p class="text-gray-600">
      Click to select files or drag and drop
    </p>
    <p class="text-sm text-gray-500 mt-2">
      Max {maxFiles} files, {formatFileSize(maxFileSize)} each
    </p>
  </div>

  <!-- File list -->
  {#if files.length > 0}
    <div class="mt-4 space-y-2">
      <h4 class="font-medium text-gray-900">Selected Files:</h4>
      {#each files as file, index}
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">{getFileIcon(file.type)}</span>
            <div>
              <p class="font-medium text-gray-900">{file.name}</p>
              <p class="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            on:click={() => removeFile(index)}
            class="text-red-500 hover:text-red-700"
            disabled={uploading}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Upload button (only show if entityId is not provided for auto-upload) -->
  {#if files.length > 0 && (!entityId || !entityType)}
    <div class="mt-4">
      <button
        on:click={uploadFiles}
        disabled={uploading}
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if uploading}
          <span class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </span>
        {:else}
          Upload Files
        {/if}
      </button>
    </div>
  {/if}
</div>

<style>
  .file-upload-container {
    @apply w-full;
  }
</style>