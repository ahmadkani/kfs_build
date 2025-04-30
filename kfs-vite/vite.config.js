import { defineConfig } from 'vite';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ command, mode }) => {
  return {
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
          // Service worker itself
          sw: path.resolve(__dirname, 'src/service-worker.js'),
        },
        name: 'KFS',
        fileName: (format, entryName) => {
          return entryName === 'sw'
            ? 'service-worker.js'
            : (format === 'es' ? `${entryName}.js` : `${entryName}.${format}.js`);
        },
        formats: ['es'],
      },
      outDir: 'kfs',
      emptyOutDir: true,
      sourcemap: true,
      target: 'esnext',
      rollupOptions: {
        input: {
          kfs: path.resolve(__dirname, 'src/kfs.js'),
          'sw-register': path.resolve(__dirname, 'src/libs/sw-register.js'),
          sw: path.resolve(__dirname, 'src/service-worker.js'),
        },
        external: (id) => {
          if (id.includes('service-worker.js')) {
            return false; // Always bundle service-worker
          }
          return ['isomorphic-git', 'isomorphic-git/http/web'].includes(id);
        },        
        output: {
          globals: {
            'isomorphic-git': 'git',
            'isomorphic-git/http/web': 'http',
            '@isomorphic-git/lightning-fs': 'LightningFS',
          },
          entryFileNames: (chunkInfo) => {
            return chunkInfo.name === 'sw'
              ? 'service-worker.js'
              : '[name].js';
          },
          format: 'es',
          sourcemapPathTransform: (relativeSourcePath) => {
            return path.resolve(__dirname, 'src', relativeSourcePath);
          },
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
        strict: false,
      },
    },

    worker: {
      format: 'es',
      rollupOptions: {
        input: {
          gitWorker: path.resolve(__dirname, 'src/workers/gitWorker.js'),
        },
        output: {
          entryFileNames: 'workers/[name].js',
          format: 'es',
          sourcemap: false,
          sourcemapPathTransform: (relativeSourcePath) => {
            return path.resolve(__dirname, 'src', relativeSourcePath);
          },
        },
      },
      plugins: () => [nodePolyfills({ globals: { Buffer: true } })],
    },

    define: { global: 'globalThis' },
  };
});
