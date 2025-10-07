import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Allow overriding dev port via env (e.g. FRONTEND_PORT=8082)
  const devPort = Number(process.env.FRONTEND_PORT || 8080);
  return {
    server: {
      host: 'localhost', // explicit to avoid IPv6 WS mismatch
      port: devPort,
      strictPort: true,  // fail instead of silently choosing another port so HMR stays consistent
      hmr: {
        host: 'localhost',
        port: devPort,
        protocol: 'ws',
        clientPort: devPort
      }
    },
    plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // PostCSS handled in postcss.config.js
  };
});