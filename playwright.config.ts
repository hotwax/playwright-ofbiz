import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";
require('dotenv').config(); // required is method of .nodejs and .dotenv is package 
//valid environments
const validEnvs = ['dev'];  // const is variable (cannot reassigneed)
// valid ENVs is variable and variable is array of string.



// Read env with default.
const ENV = process.env.ENV || 'prod';
// proocess.env is object store env variable 

// Validate the ENV variable

if (!validEnvs.includes(ENV)) {
  throw new Error(  // throw is keyword to throw error.
    // new Error is object craetion 
    // ${ENV} is template literal to print value of ENV variable.
    // join >> array method to join array elements into string with separator.['prod', 'staging'] → "prod, staging"
    `Invalid ENV value: ${ENV}. Valid values are: ${validEnvs.join(', ')}`
  );
}
 // ! = not operator, includes is method of array, join is method of array.
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const baseURL = process.env.BASE_URL_DEV;

if (!baseURL) {
  throw new Error('BASE_URL_DEV is not defined in .env');
}

 /** @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  
  use: {
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
      viewport: { width: 1280, height: 720 }


  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
