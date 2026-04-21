import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias:
      mode === 'mock'
        ? [
            {
              find: /^.*\/services\/mealdb$/,
              replacement: path.resolve(__dirname, 'src/services/mealdb.mock.ts'),
            },
          ]
        : [],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
}))
