import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    // maplibre-gl loads a web worker at a URL its own module resolves internally; Vite's
    // esbuild-based dependency pre-bundler mangles that resolution, causing a reload loop in
    // dev ("file does not exist ... maplibre-gl-worker.mjs"). Serving it unbundled avoids that.
    exclude: ['maplibre-gl'],
  },
});
