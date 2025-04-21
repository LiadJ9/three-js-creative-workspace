import { defineConfig } from 'vite';
import { ghPages } from 'vite-plugin-gh-pages';

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [ghPages()],
  base: '/LiadJ9/three-js-creative-workspace',
});
