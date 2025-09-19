<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isAuthenticated = false;

	onMount(() => {
		// Check if user is authenticated
		const token = localStorage.getItem('token');
		if (token) {
			isAuthenticated = true;
			goto('/dashboard');
		}
	});
</script>

<svelte:head>
	<title>MedFMS - Fleet Management System</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
	<div class="max-w-md w-full space-y-8 p-8">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-primary-900 mb-2">MedFMS</h1>
			<p class="text-primary-700">Fleet Management System</p>
		</div>

		<div class="card">
			<form class="space-y-6">
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
						Username
					</label>
					<input
						type="text"
						id="username"
						name="username"
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						placeholder="Enter username"
					/>
				</div>

				<div>
					<label for="pin" class="block text-sm font-medium text-gray-700 mb-2">
						PIN
					</label>
					<input
						type="password"
						id="pin"
						name="pin"
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						placeholder="Enter PIN"
					/>
				</div>

				<button
					type="submit"
					class="w-full btn btn-primary"
				>
					Sign In
				</button>
			</form>
		</div>

		<div class="text-center text-sm text-gray-500">
			© 2024 MedFMS. All rights reserved.
		</div>
	</div>
</div>