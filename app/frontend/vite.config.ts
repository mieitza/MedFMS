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
		// Exclude pdfjs-dist from pre-bundling to avoid worker issues
		exclude: ['pdfjs-dist']
	},
	build: {
		// Ensure pdfjs-dist worker files are handled correctly
		rollupOptions: {
			output: {
				manualChunks: {
					pdfjs: ['pdfjs-dist']
				}
			}
		}
	}
});