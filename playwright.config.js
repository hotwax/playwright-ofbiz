require("dotenv/config");
const { defineConfig, devices } = require("@playwright/test");

// The project runs against one shared dev page, so keep the base URL fixed here.
const BASE_URL = "https://ofbizdemotesting.hotwaxsystems.com/ecommerce/control/newcustomer";
const STORAGE_STATE = "playwright/.auth/user.json";

module.exports = defineConfig({
  testDir: "./tests",
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
    video: "retain-on-failure"
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
