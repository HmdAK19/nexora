import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@app': '/src/app',
      '@features': '/src/features',
      '@shared': '/src/shared',
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['e2e/**', 'server/**', 'node_modules/**', 'dist/**'],
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/**/lib/**/*.ts',
        'src/shared/api/react-query/optimistic/index.ts',
        'src/features/cards/api/cardsApi.ts',
        'src/app/providers/language/LanguageProvider.tsx',
        'src/features/cards/components/AddBankCardDialog.tsx',
      ],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/index.ts', 'src/test/**', '**/*.d.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70,
      },
    },
  },
});
