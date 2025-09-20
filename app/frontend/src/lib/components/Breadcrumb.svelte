<script>
  export let items = [];

  // Default MedFMS logo if none provided
  export let logo = "🏥";
  export let appName = "MedFMS";
</script>

<nav class="flex items-center space-x-2 text-sm text-gray-600 mb-6">
  <!-- Logo and App Name -->
  <div class="flex items-center space-x-2 mr-4">
    <span class="text-2xl">{logo}</span>
    <span class="text-lg font-bold text-gray-900">{appName}</span>
  </div>

  <!-- Breadcrumb Items -->
  <div class="flex items-center space-x-2">
    <!-- Home -->
    <a href="/" class="text-blue-600 hover:text-blue-800 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>
    </a>

    {#each items as item, index}
      <!-- Separator -->
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>

      <!-- Breadcrumb Item -->
      {#if item.href && index < items.length - 1}
        <a href={item.href} class="text-blue-600 hover:text-blue-800 transition-colors">
          {item.label}
        </a>
      {:else}
        <span class="text-gray-900 font-medium">
          {item.label}
        </span>
      {/if}
    {/each}
  </div>
</nav>