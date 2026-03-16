import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tagger from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/shorttermmemorytest/',  // Add this line for correct asset paths
  plugins: [react(), mode === 'development' && tagger()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    host: '::',
    port: 8080,
    hmr: {
      overlay: false
    }
  }
}));
