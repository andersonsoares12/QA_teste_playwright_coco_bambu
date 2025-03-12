import { chromium, defineConfig, devices, firefox } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  // workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'allure-playwright',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    
    // browserName: 'webkit', // Define WebKit como o navegador padrão
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'https://app-hom.cocobambu.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    headless: true, //roda o teste com o navegador aberto
    launchOptions: {
      slowMo:500,
    },
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
    permissions: ['geolocation'],
  },

  /* Configure projects for major browsers */
  projects: [
   
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     baseURL: 'https://app-hom.cocobambu.com',
    //   },
     
    // },
  {
    name: 'firefox',
    use: { 
      ...devices['firefox'],
      baseURL: 'https://app-hom.cocobambu.com',
      
    },
    timeout: 60000, // Timeout global de 60 segundos
  },

  ],

});
