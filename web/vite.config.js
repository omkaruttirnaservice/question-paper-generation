import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const mode = 'production';
export default defineConfig({
	plugins: [react()],
});
