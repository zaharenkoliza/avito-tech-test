import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	plugins: [react()],
	server: {
		port: 5173,
		proxy: {
			"/items": "http://localhost:8080",
			"/ai": "http://localhost:8080",
		},
	},
});
