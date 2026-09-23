import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './config/env.config';

export default defineConfig({
  testDir: './tests',
  timeout: envConfig.timeouts.test,
  expect: {
    timeout: envConfig.timeouts.expect,
  },
  fullyParallel: false, // one at a time, the demo site shares cart state
  // fail the build on CI if you accidentally left test.only in the test
  forbidOnly: !!process.env.CI,
  retries: 3, 
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: envConfig.timeouts.action,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'demoblaze-web',
      testDir: './tests/web',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: envConfig.webBaseUrl,
        viewport: { width: 1400, height: 900 },
      },
    },
    {
      name: 'restful-booker-api',
      testDir: './tests/api',
      use: {
        baseURL: envConfig.apiBaseUrl,
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
  ],
});
