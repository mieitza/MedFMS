<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { auth } from '$lib/stores/auth';

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

<slot />