import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import htmlConfig from 'vite-plugin-html-config'

import htmlConfigOptions from './config/html-config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [htmlConfig(htmlConfigOptions), react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
}))
