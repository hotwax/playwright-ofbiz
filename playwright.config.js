require("dotenv").config();
const { defineConfig, devices } = require("@playwright/test");

/**
 * Read environment variables from .env file.
 * https://github.com/motdotla/dotenv
 */

// Priority order for BASE_URL:
// 1. process.env.BASE_URL (if provided explicitly)
// 2. process.env.BASE_URL_DEV (if ENV=dev is set)
// 3. Default fallback to the production URL
const BASE_URL = process.env.BASE_URL || 
                 (process.env.ENV === "dev" ? process.env.BASE_URL_DEV : "https://ofbizdemotesting.hotwaxsystems.com/ecommerce/control/main");

const STORAGE_STATE = "playwright/.auth/user.json";

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 90000,
  // These tests use the same OFBiz user and cart, so run them one at a time.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["allure-playwright", { outputFolder: "allure-results" }],
    ["monocart-reporter", { 
        name: "OFBiz Test Report", 
        outputFile: "monocart-report/index.html",
        globalMetadata: {
            "Release": "v1.0.0-beta",
            "Environment": "UAT",
            "Execution Date": new Date().toLocaleString()
        }
    }],
    ["junit", { outputFile: "junit-results/results.xml" }],
    ["./reporters/custom-summary-reporter.js"]
  ],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      slowMo: 500 // Slows down execution by 500ms per action
    }
  },
  projects: [
    // Run the login setup first and save the authenticated browser state.
    {
      name: "setup",
      testMatch: /auth\/.*\.setup\.js/
    },
    // Use the saved login state for the actual browser tests.
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE
      },
      dependencies: ["setup"]
    }
  ]
});
