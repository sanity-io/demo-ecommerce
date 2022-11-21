import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  /**
   * @see https://github.com/vitejs/vite/issues/5885
   */
  mode: 'production',
  plugins: [hydrogen()],
  optimizeDeps: {
    include: ['@headlessui/react', 'sanity', '@sanity/ui'],
  },
});
