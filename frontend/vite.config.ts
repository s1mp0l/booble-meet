import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения в зависимости от режима (development/production)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
      mkcert()
    ],
    server: {
      proxy: {
        '/socket.io': {
          target: env.VITE_API_URL || 'https://localhost:3001',
          ws: true,
          secure: false,
          changeOrigin: true
        },
        '/api': {
          target: env.VITE_API_URL || 'https://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
  }
})
