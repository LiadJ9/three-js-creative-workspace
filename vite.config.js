import { defineConfig } from 'vite';
import { ghPages } from 'vite-plugin-gh-pages';

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [ghPages()],
  base: '/three-js-planets/',
});
