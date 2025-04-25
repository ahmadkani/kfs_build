import { defineConfig } from 'vite';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    // Add Node.js polyfills
    nodePolyfills({
      // Specific polyfills you need
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/kfs.js'),
      name: 'KFS',
      fileName: 'kfs',
      formats: ['es'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: ['isomorphic-git', 'isomorphic-git/http/web'],
      output: {
        globals: {
          'isomorphic-git': 'git',
          'isomorphic-git/http/web': 'http',
          '@isomorphic-git/lightning-fs': 'LightningFS',
        },
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: '[name].js',
        format: 'es',
      },
    },
  },

  optimizeDeps: {
    include: ['isomorphic-git', 'isomorphic-git/http/web'],
    // Add buffer to optimized dependencies
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },

  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  },

  worker: {
    format: 'es',
    rollupOptions: {
      input: {
        gitWorker: path.resolve(__dirname, 'src/workers/gitWorker.js'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es',
        sourcemap: true
      },
    },
    // Add plugins to workers
    plugins: [
      nodePolyfills({
        globals: {
          Buffer: true,
        },
      }),
    ],
  },

  define: {
    'global': 'globalThis',
  },
});