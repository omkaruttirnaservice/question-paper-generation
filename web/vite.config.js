import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const mode = 'production';
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: mode == 'developement' ? 'http://localhost:3026/' : 'http://64.227.149.129:3025',
				changeOrigin: true,
			},
		},
		host: 'localhost',
		open: true,
		port: 3000,
	},
});
