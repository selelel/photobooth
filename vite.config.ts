import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
    target: 'react',
    autoCodeSplitting: true,
  }), 
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Photobooth',
      short_name: 'JJ',
      description: 'JJ photobooth',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/vite.svg',
          sizes: 'any',
          type: 'image/svg+xml',
        },
        // {
        //   src: '/pwa-512x512.png',
        //   sizes: '512x512',
        //   type: 'image/png',
        // },
        // {
        //   src: '/pwa-512x512.png',
        //   sizes: '512x512',
        //   type: 'image/png',
        //   purpose: 'any maskable',
        // },
      ],
    },
  }),
  react(), 
  tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})