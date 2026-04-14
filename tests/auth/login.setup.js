const fs = require("fs");
const { expect, test: setup } = require("@playwright/test");

// This folder stores the saved login session file.
// Other tests can reuse the same session instead of logging in every time.
const AUTH_FOLDER = "playwright/.auth";

// This is the full path of the saved login session file.
// Final path: playwright/.auth/user.json
const AUTH_FILE = `${AUTH_FOLDER}/user.json`;

// Read login credentials from the .env file through process.env.
// We keep username and password outside the test code for safety and reuse.
const { USERNAME, PASSWORD } = process.env;

setup("login and save the state", async ({ page }) => {
  if (!USERNAME || !PASSWORD) {
    throw new Error("USERNAME and PASSWORD must be set in .env before running auth setup.");
  }

  // Open the login page.
  await page.goto("/ecommerce/control/checkLogin/main");

  // Handle GDPR Cookies Modal
  try {
    const gdprModal = page.locator('#bs-gdpr-cookies-modal');
    await gdprModal.waitFor({ state: 'visible', timeout: 3000 });
    
    const agreeBtn = gdprModal.locator('button', { hasText: /Agree|Accept|Ok|Allow/i }).first();
    if (await agreeBtn.isVisible()) {
      await agreeBtn.click();
    } else {
      await gdprModal.locator('.modal-footer button').first().click();
    }
    
    // Ensure the modal overlay disappears entirely before proceeding
    await gdprModal.waitFor({ state: 'hidden', timeout: 3000 });
  } catch (e) {
    // Ignore if modal doesn't appear
    console.log("No GDPR modal appeared");
  }

  // Enter the login credentials from .env.
  await page.fill("#userName", USERNAME);
  await page.fill("#password", PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();

  // Confirm that login completed before saving the browser state.
  await expect(page).toHaveURL(/\/ecommerce\/control\/login$/);

  // Save the logged-in session so other tests can reuse it.
  fs.mkdirSync(AUTH_FOLDER, { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
