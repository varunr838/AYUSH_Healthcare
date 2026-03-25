import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Bring Tailwind back!

export default defineConfig({
  plugins: [
    tailwindcss(), // <-- Add it to the plugins array
    react()
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-leaflet', 'leaflet'],
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  }
})