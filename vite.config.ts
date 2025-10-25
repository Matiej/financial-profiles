import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8100',
        changeOrigin: true
      }
    },
    allowedHosts: ['58c67fea4d5c.ngrok-free.app']
  }
})
