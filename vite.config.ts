import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isLocal = mode === 'localdev'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
    server: {
      ...(isLocal
        ? { port: 5173 }
        : {
            https: {
              cert: fs.readFileSync('/etc/ssl/cloudflare/sunshifeng.pem'),
              key: fs.readFileSync('/etc/ssl/cloudflare/sunshifeng.key'),
            },
            host: '0.0.0.0',
            port: 443,
          }
      ),
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
  }
})
