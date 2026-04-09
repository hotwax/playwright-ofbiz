const { expect, test } = require("@playwright/test");

test("dev new customer page opens", async ({ page }) => {
  // Open the configured base URL.
  await page.goto("");

  // Check that the test landed on the new customer page.
  await expect(page).toHaveURL(/\/ecommerce\/control\/newcustomer/);
});
