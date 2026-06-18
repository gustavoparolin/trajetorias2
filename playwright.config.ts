import { defineConfig, devices } from '@playwright/test'

// Alvo do E2E. Em CI/produção, defina E2E_BASE_URL (ex.: https://trajetorias2.parolin.net).
// Local: sobe o Vite automaticamente (requer a API acessível e CORS liberando localhost).
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev --workspace packages/web',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 60_000,
      },
})
