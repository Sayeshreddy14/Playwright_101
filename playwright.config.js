import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const LT_USERNAME   = process.env.LT_USERNAME;
const LT_ACCESS_KEY = process.env.LT_ACCESS_KEY;

function buildWsEndpoint(capabilities) {
  return `wss://cdp.lambdatest.com/playwright?capabilities=${
    encodeURIComponent(JSON.stringify(capabilities))
  }`;
}

const SHARED_LT_OPTIONS = {
  build:              'Playwright 101',
  user:               LT_USERNAME,
  accessKey:          LT_ACCESS_KEY,
  video:              true,
  network:            true,
  console:            true,
  geoLocation:        'IN',
  timezone:           'Kolkata',
  tunnel:             false,
  accessibility:      true,
  smartUIProjectName: 'Playwright_101',
};

function buildCapabilities(browserName, browserVersion, platform, sessionName) {
  return {
    browserName,
    browserVersion,
    'LT:Options': {
      ...SHARED_LT_OPTIONS,
      platform,
      name: sessionName,
    },
  };
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 3,
  timeout: 60000,
  reporter: [['html'], ['list']],

  use: {
    actionTimeout:     30000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'Win10-Chrome',
      use: {
        connectOptions: {
          wsEndpoint: buildWsEndpoint(
            buildCapabilities('Chrome', '153.0', 'Windows 10', 'Playwright 101 | Win10 | Chrome 153')
          ),
          timeout: 60000,
        },
      },
    },
    {
      name: 'macOS-Firefox',
      use: {
        connectOptions: {
          wsEndpoint: buildWsEndpoint(
            buildCapabilities('pw-firefox', 'latest', 'MacOS Sonoma', 'Playwright 101 | macOS Sonoma | Firefox')
          ),
          timeout: 60000,
        },
      },
    },
  ],
});
