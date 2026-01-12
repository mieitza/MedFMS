<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import api from '$lib/api';
	import { _ } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let error = '';
	let success = '';
	let loading = false;

	// Password validation state
	let passwordErrors: string[] = [];

	function validatePassword(password: string): string[] {
		const errors: string[] = [];
		if (!password || password.length < 8) {
			errors.push($_('auth.passwordRules.minLength'));
		}
		if (!/[a-z]/.test(password)) {
			errors.push($_('auth.passwordRules.lowercase'));
		}
		if (!/[A-Z]/.test(password)) {
			errors.push($_('auth.passwordRules.uppercase'));
		}
		if (!/[0-9]/.test(password)) {
			errors.push($_('auth.passwordRules.number'));
		}
		return errors;
	}

	$: passwordErrors = validatePassword(newPassword);
	$: isPasswordValid = passwordErrors.length === 0 && newPassword.length > 0;
	$: passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

	async function handleResetPassword() {
		error = '';
		success = '';

		// Validate form
		if (!currentPassword) {
			error = $_('auth.currentPasswordRequired');
			return;
		}

		if (!isPasswordValid) {
			error = passwordErrors.join('. ');
			return;
		}

		if (!passwordsMatch) {
			error = $_('auth.passwordMismatch');
			return;
		}

		loading = true;

		try {
			await api.resetPassword(currentPassword, newPassword);
			success = $_('auth.passwordResetSuccess');

			// After successful reset, redirect to dashboard after a short delay
			setTimeout(() => {
				goto('/dashboard');
			}, 2000);
		} catch (err) {
			console.error('Password reset error:', err);
			error = err.message || $_('auth.passwordResetFailed');
		} finally {
			loading = false;
		}
	}

	function handleLogout() {
		auth.logout();
		goto('/login');
	}
</script>

<svelte:head>
	<title>{$_('auth.resetPassword')} - {$_('common.appName')}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
	<div class="max-w-md w-full">
		<!-- Language Switcher -->
		<div class="flex justify-end mb-4">
			<LanguageSwitcher />
		</div>

		<!-- Logo/Header -->
		<div class="text-center mb-8">
			<div class="inline-block p-4 bg-indigo-600 rounded-full mb-4">
				<svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">{$_('auth.resetPassword')}</h1>
			<p class="text-gray-600">{$_('auth.resetPasswordDesc')}</p>
		</div>

		<!-- Reset Password Card -->
		<div class="bg-white rounded-lg shadow-xl p-8">
			{#if success}
				<div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
					<div class="flex items-center">
						<svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
						</svg>
						<span class="text-green-800 text-sm">{success}</span>
					</div>
				</div>
			{:else}
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

				<form on:submit|preventDefault={handleResetPassword} class="space-y-4">
					<div>
						<label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
							{$_('auth.currentPassword')}
						</label>
						<input
							id="currentPassword"
							type="password"
							bind:value={currentPassword}
							disabled={loading}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
							placeholder={$_('auth.enterCurrentPassword')}
							autocomplete="current-password"
						/>
					</div>

					<div>
						<label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
							{$_('auth.newPassword')}
						</label>
						<input
							id="newPassword"
							type="password"
							bind:value={newPassword}
							disabled={loading}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
							placeholder={$_('auth.enterNewPassword')}
							autocomplete="new-password"
						/>

						<!-- Password strength indicators -->
						{#if newPassword}
							<div class="mt-2 space-y-1">
								<div class="flex items-center text-xs">
									<span class={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
										{#if newPassword.length >= 8}
											<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
											</svg>
										{:else}
											<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
											</svg>
										{/if}
										{$_('auth.passwordRules.minLength')}
									</span>
								</div>
								<div class="flex items-center text-xs">
									<span class={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>
										{#if /[a-z]/.test(newPassword)}
											<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
											</svg>
										{:else}
											<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
											</svg>
										{/if}
										{$_('auth.passwordRules.lowercase')}
									</span>
								</div>
								<div class="flex items-center text-xs">
									<span class={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>
										{#if /[A-Z]/.test(newPassword)}
											<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
											</svg>
										{:else}
											<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
											</svg>
										{/if}
										{$_('auth.passwordRules.uppercase')}
									</span>
								</div>
								<div class="flex items-center text-xs">
									<span class={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>
										{#if /[0-9]/.test(newPassword)}
											<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
											</svg>
										{:else}
											<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
											</svg>
										{/if}
										{$_('auth.passwordRules.number')}
									</span>
								</div>
							</div>
						{/if}
					</div>

					<div>
						<label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
							{$_('auth.confirmPassword')}
						</label>
						<input
							id="confirmPassword"
							type="password"
							bind:value={confirmPassword}
							disabled={loading}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed {confirmPassword && !passwordsMatch ? 'border-red-300' : ''}"
							placeholder={$_('auth.enterConfirmPassword')}
							autocomplete="new-password"
						/>
						{#if confirmPassword && !passwordsMatch}
							<p class="mt-1 text-xs text-red-500">{$_('auth.passwordMismatch')}</p>
						{/if}
					</div>

					<button
						type="submit"
						disabled={loading || !isPasswordValid || !passwordsMatch}
						class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
					>
						{#if loading}
							<svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							{$_('auth.resettingPassword')}
						{:else}
							{$_('auth.resetPasswordButton')}
						{/if}
					</button>
				</form>

				<div class="mt-4 text-center">
					<button
						on:click={handleLogout}
						class="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
					>
						{$_('auth.logoutAndCancel')}
					</button>
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="mt-6 text-center text-sm text-gray-600">
			<p>{$_('auth.copyright')}</p>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
