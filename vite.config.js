import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.test.jsx','src/**/*.spec.jsx'], 
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html', 'lcov'],
    },
  },
});
