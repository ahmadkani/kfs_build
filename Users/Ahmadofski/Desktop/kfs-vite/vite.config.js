import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/libs', dest: '.' },
        { src: 'src/require.js', dest: '.' },
        { src: 'src/gitWorker.js', dest: 'assets' },
        { src: 'src/service-worker.js', dest: '.' },
      ]
    })
  ],
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
    assetsInlineLimit: 0, // Prevent inlining of worker file
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]' // Consistent asset naming
      }
    }
  }
})