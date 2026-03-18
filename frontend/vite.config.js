import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5000, // Defina aqui a porta de sua preferência
    strictPort: true, // Se a porta 5000 estiver ocupada, o Vite falha em vez de tentar a próxima
  }
})