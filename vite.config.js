import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_DEPLOY_TARGET === 'gh-pages'
  ? 'https://Zavala05.github.io/Kikis_HN/'
  : '/',
})
