/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [react()],
	server: {
		port: 5173,
		proxy: {
			'/items': 'http://localhost:8080',
			'/ai': 'http://localhost:8080',
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
		},
	},
})
