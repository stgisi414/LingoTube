import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GOOGLE_CUSTOM_SEARCH_API_KEY': JSON.stringify(env.GOOGLE_CUSTOM_SEARCH_API_KEY),
        'process.env.YOUTUBE_CUSTOM_SEARCH_CX': JSON.stringify(env.YOUTUBE_CUSTOM_SEARCH_CX),
        'process.env.GOOGLE_CUSTOM_SEARCH_CX': JSON.stringify(env.GOOGLE_CUSTOM_SEARCH_CX),
        'process.env.YOUTUBE_DATA_API_KEY': JSON.stringify(env.YOUTUBE_DATA_API_KEY),
        'process.env.GOOGLE_TTS_API_KEY': JSON.stringify(env.GOOGLE_TTS_API_KEY),
        'process.env.IMAGE_CUSTOM_SEARCH_CX': JSON.stringify(env.IMAGE_CUSTOM_SEARCH_CX)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        host: '0.0.0.0',
        port: 5173,
        allowedHosts: true
      },
      preview: {
        host: '0.0.0.0',
        port: 5173
      }
    };
});
