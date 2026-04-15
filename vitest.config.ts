/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@csstools/css-calc': path.resolve(__dirname, './src/test/empty-mock.ts'),
      '@asamuzakjp/css-color': path.resolve(__dirname, './src/test/empty-mock.ts'),
    },
    css: false,
    server: {
      deps: {
        inline: ['@asamuzakjp/css-color', '@csstools/css-calc'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    },
  },
});
