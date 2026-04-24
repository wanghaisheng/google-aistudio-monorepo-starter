import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../../'), '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, '../../packages/shared/src'),
        '@core': path.resolve(__dirname, '../../packages/core/src'),
        '@api': path.resolve(__dirname, '../../packages/api/src'),
        '@ui': path.resolve(__dirname, '../../packages/ui/src'),
        '@web': path.resolve(__dirname, './src'),
        'node-fetch': path.resolve(__dirname, '../../packages/shared/src/utils/native-fetch.ts'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
