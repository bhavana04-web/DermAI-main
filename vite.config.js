import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Skin-Lesion-Detection/', // 👈 MUST match repo name exactly (case-sensitive)
  plugins: [
    tailwindcss(),
    react()
  ],
})
