import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-oxc'

export default defineConfig({
  base: '/Flip-Terminal/',
  plugins: [react()],
})
