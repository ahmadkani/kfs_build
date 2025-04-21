// vite.config.js
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      srcDir: 'src',
      filename: 'service-worker.js',
      strategies: 'generateSW', // Changed from injectManifest to generateSW
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        globIgnores: ['**/node_modules/**/*'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /\.(js|css|html)$/,
            handler: 'StaleWhileRevalidate'
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})