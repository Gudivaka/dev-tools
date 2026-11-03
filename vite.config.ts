import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Absolute base is required for path routing (deep links like /jwt-decoder).
  // Firebase/custom domain: '/'. GitHub Pages sets VITE_BASE=/dev-tools/ in CI.
  base: process.env.VITE_BASE || '/',
});
