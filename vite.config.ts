import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './packages/shared/src'),
      '@core': path.resolve(__dirname, './packages/core/src'),
      '@api': path.resolve(__dirname, './packages/api/src'),
      '@ui': path.resolve(__dirname, './packages/ui/src'),
      '@web': path.resolve(__dirname, './apps/web/src'),
      '@': path.resolve(__dirname, './src'),
      'node-fetch': path.resolve(__dirname, './packages/shared/src/utils/native-fetch.ts'),
    },
  },
});
