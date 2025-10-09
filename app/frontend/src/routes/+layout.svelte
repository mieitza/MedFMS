<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { auth } from '$lib/stores/auth';
	import { initializeI18n } from '$lib/i18n';
	import { isLoading } from 'svelte-i18n';

	// Initialize i18n
	initializeI18n();

	// Public routes that don't require authentication
	const publicRoutes = ['/login'];

	onMount(() => {
		if (browser) {
			const currentPath = window.location.pathname;
			const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

			if (!isPublicRoute) {
				const isAuthenticated = auth.checkAuth();
				if (!isAuthenticated) {
					goto('/login');
				}
			} else if (currentPath === '/' || currentPath === '') {
				// Redirect root to dashboard if authenticated
				const isAuthenticated = auth.checkAuth();
				if (isAuthenticated) {
					goto('/dashboard');
				} else {
					goto('/login');
				}
			}
		}
	});
</script>

{#if $isLoading}
	<div class="flex items-center justify-center min-h-screen">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
	</div>
{:else}
	<slot />
{/if}