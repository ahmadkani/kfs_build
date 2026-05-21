// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import dts from 'vite-plugin-dts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
      // Exclude Node-only system modules from polyfilling
      exclude: ['fs', 'fs/promises', 'worker_threads'],
    }),
    dts({
      outDir: 'kfs',
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],

  define: {
    global: 'globalThis',
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    target: 'esnext',
    sourcemap: true,
    outDir: 'kfs',
    emptyOutDir: true,
    minify: false,

    lib: {
      entry: {
        kfs: path.resolve(__dirname, 'src/kfs.js'),
        gitWorker: path.resolve(__dirname, 'src/workers/gitWorker.js'), 
      },
      name: 'KFS',
      formats: ['es'],
    },

    rollupOptions: {
      external: [
        'fs',
        'fs/promises',
        'worker_threads',
        'module', // ✅ Add this to allow createRequire in Node.js
        // 'url', 'path', 'buffer', etc. should be REMOVED from here so they are polyfilled for the browser
      ],
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      },
    },
  },

  worker: { format: 'es' },
});