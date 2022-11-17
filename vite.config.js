import {defineConfig} from 'vite';
import netlifyPlugin from '@netlify/hydrogen-platform/plugin';
import hydrogen from '@shopify/hydrogen/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [hydrogen(), netlifyPlugin()],
  optimizeDeps: {include: ['@headlessui/react']},
});
