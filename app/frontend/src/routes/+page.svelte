<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';

	let isAuthenticated = false;
	let isLoading = false;
	let error = '';
	let username = '';
	let pin = '';

	onMount(() => {
		// Check if user is authenticated
		const token = localStorage.getItem('token');
		if (token) {
			isAuthenticated = true;
			goto('/dashboard');
		}
	});

	async function handleLogin() {
		if (!username || !pin) {
			error = 'Please enter both username and PIN';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const response = await api.login({ username, pin });

			// Store auth data
			localStorage.setItem('token', response.data.token);
			localStorage.setItem('user', JSON.stringify(response.data.user));

			// Redirect to dashboard
			goto('/dashboard');
		} catch (err) {
			error = 'Invalid username or PIN';
			console.error('Login error:', err);
		} finally {
			isLoading = false;
		}
	}
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
			<form on:submit|preventDefault={handleLogin} class="space-y-6">
				{#if error}
					<div class="bg-red-50 text-red-700 p-3 rounded-md text-sm">
						{error}
					</div>
				{/if}

				<div>
					<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
						Username
					</label>
					<input
						type="text"
						id="username"
						bind:value={username}
						required
						disabled={isLoading}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
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
						bind:value={pin}
						required
						disabled={isLoading}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
						placeholder="Enter PIN"
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					class="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isLoading}
						Signing In...
					{:else}
						Sign In
					{/if}
				</button>
			</form>

			<div class="mt-4 text-sm text-gray-600 text-center">
				<strong>Demo Credentials:</strong><br />
				Username: admin<br />
				PIN: 1234
			</div>
		</div>

		<div class="text-center text-sm text-gray-500">
			© 2024 MedFMS. All rights reserved.
		</div>
	</div>
</div>