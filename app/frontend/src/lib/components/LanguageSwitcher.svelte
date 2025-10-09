<script lang="ts">
	import { locale, changeLocale } from '$lib/i18n';

	function handleLanguageChange(newLocale) {
		changeLocale(newLocale);
	}
</script>

<div class="flex items-center space-x-2">
	<button
		on:click={() => handleLanguageChange('en')}
		class="px-3 py-1 text-sm rounded transition-colors {$locale === 'en'
			? 'bg-indigo-600 text-white'
			: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
	>
		EN
	</button>
	<button
		on:click={() => handleLanguageChange('ro')}
		class="px-3 py-1 text-sm rounded transition-colors {$locale === 'ro'
			? 'bg-indigo-600 text-white'
			: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
	>
		RO
	</button>
</div>
