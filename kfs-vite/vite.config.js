import { defineConfig } from 'vite';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
    }),
  ],

  build: {
    lib: {
      sourcemap: true,
      entry: {
        // Main library entry
        kfs: path.resolve(__dirname, 'src/kfs.js'),
        // Service worker registration entry
        'sw-register': path.resolve(__dirname, 'src/libs/sw-register.js'),
      },
      name: 'KFS',
      fileName: (format, entryName) => {
        return format === 'es' ? `${entryName}.js` : `${entryName}.${format}.js`;
      },
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
    esbuildOptions: { define: { global: 'globalThis' } },
  },

server: {
  headers: {
    'Service-Worker-Allowed': '/',
  },
  fs: {
    strict: false
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
      sourcemap: true,
      sourcemapPathTransform: (relativeSourcePath) => {
        // Ensure correct paths in source maps
        return path.resolve(__dirname, 'src', relativeSourcePath);
      }
    },
  },
  plugins: [nodePolyfills({ globals: { Buffer: true } })],
},

  define: { global: 'globalThis' },
});