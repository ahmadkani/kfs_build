import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import dts from 'vite-plugin-dts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',

  plugins: [
    dts({
      outDir: 'kfs',
      insertTypesEntry: true,
      rollupTypes: true,
    }),
    nodePolyfills({
      include: ['buffer', 'process', 'events', 'stream', 'util'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],

  define: {
    global: 'globalThis',
    'globalThis.Buffer': 'Buffer',
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
      // SMART EXTERNALS:
      // 1. 'module', 'fs', etc. -> External (Node only).
      // 2. 'buffer', 'stream', etc. -> NOT External (Bundle them for Browser).
      external: (id, parentId, isResolved) => {
        const nodeOnlyModules = [
          'fs', 'fs/promises', 'path', 'os', 'crypto', 'worker_threads',
          'http', 'https', 'net', 'tty', 'zlib', 'child_process', 'readline',
          'module', 'v8', 'vm'
        ];
        
        // If the module is a Node-only core module, keep it external.
        if (nodeOnlyModules.includes(id)) {
          return true;
        }
        
        // Do NOT externalize buffer, stream, process, util.
        // We want Vite to bundle the polyfills for these.
        return false;
      },

      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },

  worker: { format: 'es' },
});