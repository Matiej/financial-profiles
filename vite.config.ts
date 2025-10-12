import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
