import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/kfs.js'),
      name: 'KFS',
      fileName: 'kfs',
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: '[name].js',
        format: 'es',
      }
    }
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  },
  worker: {
    format: 'es', // Bundles workers in ES module format
    rollupOptions: {
      external: [],
      input: {
        gitWorker: path.resolve(__dirname, 'src/workers/gitWorker.js'), // Ensure correct path to worker
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es',
      }
    }
  }
});
