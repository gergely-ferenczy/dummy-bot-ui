import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes(`"use client"`)) {
          return;
        }
        warn(warning);
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('src')
    }
  }
})
