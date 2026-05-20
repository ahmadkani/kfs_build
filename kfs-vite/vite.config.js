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
      exclude: ['fs', 'fs/promises', 'worker_threads'],
    }),
    dts({
      outDir: 'kfs',
      insertTypesEntry: true,
      rollupTypes: true, // Bundle all types into one file
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

  optimizeDeps: {
    include: [
      'isomorphic-git',
      'isomorphic-git/http/web',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },

  server: {
    fs: {
      strict: false,
    },
  },

  build: {
    target: 'esnext',
    sourcemap: true,
    outDir: 'kfs',
    emptyOutDir: true,
    minify: false,

    lib: {
      entry: path.resolve(__dirname, 'src/kfs.js'),
      name: 'KFS',
      formats: ['es'],
      fileName: () => 'kfs.js',
    },

    rollupOptions: {
      external: [
        'fs',
        'fs/promises',
        'path',
        'url',
        'worker_threads',
        'crypto',
        'stream',
        'util',
        'events',
        'buffer',
        'os',
      ],
      output: {
        format: 'es',
        // Ensure assets go into an 'assets' subfolder
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      },
    },
  },

  worker: {
    format: 'es',
    plugins: () => [
      nodePolyfills({
        globals: { Buffer: true, global: true, process: true },
        protocolImports: true,
        exclude: ['fs', 'fs/promises', 'worker_threads'],
      })
    ]
  },
});