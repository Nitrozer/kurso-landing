import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    // Une page unique : un seul fichier JS evite une cascade de requetes.
    rollupOptions: { output: { manualChunks: undefined } },
    reportCompressedSize: true,
  },
})
