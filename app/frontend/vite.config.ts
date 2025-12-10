import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true
			}
		}
	},
	optimizeDeps: {
		// Include pdfjs-dist in pre-bundling for proper build handling
		include: ['pdfjs-dist']
	}
});