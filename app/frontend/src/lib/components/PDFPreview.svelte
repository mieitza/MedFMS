<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let file = null; // File object or Blob
  export let url = null; // URL to PDF
  export let pageNumber = 1; // Which page to render (default first page)
  export let scale = 1.0; // Scale factor for rendering
  export let width = 200; // Preview width in pixels
  export let height = 200; // Preview height in pixels
  export let className = ''; // Additional CSS classes

  let canvas;
  let loading = true;
  let error = null;
  let pdfDoc = null;
  let renderTask = null;
  let isMounted = true;
  let pdfjsLib = null;

  // Configure PDF.js worker
  onMount(async () => {
    // Only run in browser environment
    if (!browser) return;

    // Dynamically import pdfjs-dist only in the browser
    try {
      // Import pdfjs-dist v5.x
      const pdfjs = await import('pdfjs-dist');
      pdfjsLib = pdfjs;

      // For pdfjs-dist v5.x with Vite, use the worker from CDN or bundled asset
      // Using unpkg CDN for reliable worker loading
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs';
    } catch (err) {
      console.error('Failed to load PDF.js:', err);
      error = 'Failed to load PDF library';
      loading = false;
      return;
    }

    if (file || url) {
      loadPDF();
    }
  });

  onDestroy(() => {
    // Mark as unmounted to prevent further operations
    isMounted = false;

    // Clean up resources
    if (renderTask) {
      try {
        renderTask.cancel();
      } catch (e) {
        // Ignore cancellation errors
      }
    }
    if (pdfDoc) {
      try {
        pdfDoc.destroy();
      } catch (e) {
        // Ignore destruction errors
      }
    }
  });

  async function loadPDF() {
    if (!isMounted) return;

    loading = true;
    error = null;

    try {
      let pdfData;

      if (file) {
        // Load from File/Blob using FileReader (more compatible)
        pdfData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(new Uint8Array(e.target.result));
          reader.onerror = reject;

          // Handle both File objects and extended file objects
          if (file instanceof Blob || file instanceof File) {
            reader.readAsArrayBuffer(file);
          } else if (file.arrayBuffer) {
            // If it has arrayBuffer method, use it
            file.arrayBuffer().then(buffer => {
              resolve(new Uint8Array(buffer));
            }).catch(reject);
          } else {
            reject(new Error('Invalid file object'));
          }
        });
      } else if (url) {
        // Load from URL
        pdfData = url;
      } else {
        throw new Error('No PDF source provided');
      }

      // Load PDF document
      const loadingTask = pdfjsLib.getDocument(pdfData);
      pdfDoc = await loadingTask.promise;

      // Check if still mounted before rendering
      if (!isMounted) {
        if (pdfDoc) pdfDoc.destroy();
        return;
      }

      // Render first page
      await renderPage();
    } catch (err) {
      console.error('Error loading PDF:', err);
      error = err.message || 'Failed to load PDF';
    } finally {
      loading = false;
    }
  }

  async function renderPage() {
    if (!pdfDoc || !canvas || !isMounted) return;

    try {
      // Get the page
      const page = await pdfDoc.getPage(pageNumber);

      // Check again after async operation
      if (!isMounted) return;

      // Calculate scale to fit preview dimensions
      const viewport = page.getViewport({ scale: 1.0 });
      const scaleX = width / viewport.width;
      const scaleY = height / viewport.height;
      const calculatedScale = Math.min(scaleX, scaleY) * scale;

      const scaledViewport = page.getViewport({ scale: calculatedScale });

      // Prepare canvas
      const context = canvas.getContext('2d');
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      // Render PDF page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };

      renderTask = page.render(renderContext);
      await renderTask.promise;
      renderTask = null;
    } catch (err) {
      if (err.name !== 'RenderingCancelledException' && isMounted) {
        console.error('Error rendering PDF page:', err);
        error = 'Failed to render PDF preview';
      }
    }
  }

  // Note: We don't use reactive statements here to avoid
  // destroying the PDF while it's being rendered.
  // The PDF is loaded once in onMount().
</script>

<div class="pdf-preview {className}">
  {#if loading}
    <div class="flex items-center justify-center bg-gray-100 rounded" style="width: {width}px; height: {height}px;">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-xs text-gray-600 mt-2">Loading PDF...</p>
      </div>
    </div>
  {:else if error}
    <div class="flex items-center justify-center bg-red-50 border border-red-200 rounded" style="width: {width}px; height: {height}px;">
      <div class="text-center p-4">
        <svg class="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xs text-red-600">PDF Error</p>
      </div>
    </div>
  {:else}
    <canvas
      bind:this={canvas}
      class="border border-gray-300 rounded shadow-sm"
      style="max-width: {width}px; max-height: {height}px;"
    />
  {/if}
</div>

<style>
  .pdf-preview {
    display: inline-block;
  }

  canvas {
    display: block;
    background: white;
  }
</style>
