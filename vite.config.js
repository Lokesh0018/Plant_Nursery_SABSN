import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const BACKSLASH = String.fromCharCode(92)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020', // no legacy transforms; every supported browser handles this natively
    rollupOptions: {
      output: {
        // vendor code in its own hashed chunks so it stays cached across app deploys
        manualChunks(id) {
          const path = id.split(BACKSLASH).join('/')
          if (!path.includes('/node_modules/')) return undefined
          if (
            path.includes('/node_modules/react/') ||
            path.includes('/node_modules/react-dom/') ||
            path.includes('/node_modules/scheduler/')
          ) return 'react'
          if (path.includes('/node_modules/gsap/')) return 'gsap'
          if (path.includes('/node_modules/lenis/')) return 'lenis'
          return 'vendor'
        },
      },
    },
  },
})
