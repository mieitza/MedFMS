<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import api from '$lib/api';

	let username = '';
	let pin = '';
	let error = '';
	let loading = false;

	async function handleLogin() {
		if (!username || !pin) {
			error = 'Please enter username and PIN';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await api.login({ username, pin });

			if (response.success && response.data) {
				auth.login(response.data.user, response.data.token);
				goto('/dashboard');
			} else {
				error = 'Invalid credentials';
			}
		} catch (err) {
			console.error('Login error:', err);
			error = err.message || 'Login failed. Please check your credentials.';
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<svelte:head>
	<title>Login - MedFMS</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
	<div class="max-w-md w-full">
		<!-- Logo/Header -->
		<div class="text-center mb-8">
			<div class="inline-block p-4 bg-indigo-600 rounded-full mb-4">
				<svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">MedFMS</h1>
			<p class="text-gray-600">Medical Fleet Management System</p>
		</div>

		<!-- Login Card -->
		<div class="bg-white rounded-lg shadow-xl p-8">
			<h2 class="text-2xl font-semibold text-gray-900 mb-6">Sign In</h2>

			{#if error}
				<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
					<div class="flex items-center">
						<svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
						</svg>
						<span class="text-red-800 text-sm">{error}</span>
					</div>
				</div>
			{/if}

			<form on:submit|preventDefault={handleLogin}>
				<div class="mb-4">
					<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
						Username
					</label>
					<input
						id="username"
						type="text"
						bind:value={username}
						on:keypress={handleKeyPress}
						disabled={loading}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
						placeholder="Enter your username"
						autocomplete="username"
					/>
				</div>

				<div class="mb-6">
					<label for="pin" class="block text-sm font-medium text-gray-700 mb-2">
						PIN
					</label>
					<input
						id="pin"
						type="password"
						bind:value={pin}
						on:keypress={handleKeyPress}
						disabled={loading}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
						placeholder="Enter your PIN"
						autocomplete="current-password"
						inputmode="numeric"
						maxlength="8"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
				>
					{#if loading}
						<svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Signing in...
					{:else}
						Sign In
					{/if}
				</button>
			</form>
		</div>

		<!-- Footer -->
		<div class="mt-6 text-center text-sm text-gray-600">
			<p>© 2024 MedFMS. All rights reserved.</p>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
