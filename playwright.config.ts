import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against an isolated database (data/e2e.db) that is reset
 * and re-seeded before every run, so they never touch development content.
 */
export const E2E_ADMIN = { email: "e2e@idearigs.lk", password: "e2e-password-123456" };

const PORT = 3200;
const env = {
  DATABASE_URL: "file:./data/e2e.db",
  UPLOAD_DIR: "./storage/e2e-uploads",
  SESSION_SECRET: "e2e-secret-e2e-secret-e2e-secret-e2e-secret",
  ADMIN_EMAIL: E2E_ADMIN.email,
  ADMIN_PASSWORD: E2E_ADMIN.password,
  NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Uses the locally installed Chrome; run `npx playwright install chromium` on CI instead.
    channel: process.env.CI ? undefined : "chrome",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } }, testIgnore: /mobile\.spec/ },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } }, testMatch: /mobile\.spec/ },
  ],
  webServer: {
    // Prepare the database first: Playwright starts the server before any globalSetup.
    command: `npx tsx e2e/prepare-db.mts && npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
    timeout: 180_000,
    env,
  },
});

