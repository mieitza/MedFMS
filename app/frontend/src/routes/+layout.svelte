<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';

	// Public routes that don't require authentication
	const publicRoutes = ['/login'];

	onMount(() => {
		// Check authentication on mount
		const isPublicRoute = publicRoutes.some(route => $page.url.pathname.startsWith(route));

		if (!isPublicRoute) {
			const isAuthenticated = auth.checkAuth();
			if (!isAuthenticated) {
				goto('/login');
			}
		}
	});

	// Subscribe to page changes to check auth on route changes
	$: {
		if (typeof window !== 'undefined') {
			const isPublicRoute = publicRoutes.some(route => $page.url.pathname.startsWith(route));

			if (!isPublicRoute && !$auth.isAuthenticated) {
				goto('/login');
			} else if ($page.url.pathname === '/' || $page.url.pathname === '') {
				// Redirect root to dashboard if authenticated
				if ($auth.isAuthenticated) {
					goto('/dashboard');
				} else {
					goto('/login');
				}
			}
		}
	}
</script>

<slot />