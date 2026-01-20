import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load all env variables (empty prefix means load all, not just VITE_)
  const env = loadEnv(mode, process.cwd(), '');

  // Get the API key from environment (works both locally and on Vercel)
  const groqApiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY || '';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(groqApiKey),
      'process.env.GROQ_API_KEY': JSON.stringify(groqApiKey)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

