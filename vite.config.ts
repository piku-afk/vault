import netlifyPlugin from '@netlify/vite-plugin-react-router';
import { reactRouter } from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  css: {
    postcss: { plugins: [autoprefixer()] },
  },
  plugins: [reactRouter(), tsconfigPaths(), netlifyPlugin()],
  server: {
    port: 3000,
  },
});
