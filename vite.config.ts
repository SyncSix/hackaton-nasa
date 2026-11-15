import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // O PDS não envia cabeçalhos CORS; o proxy resolve isso em desenvolvimento.
      '/pds': {
        target: 'https://pds.mcp.nasa.gov',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/pds/, '/api/search/1'),
        headers: {
          'User-Agent': 'mars-survival-guide/0.1',
          Accept: 'application/json',
        },
      },
    },
  },
})
