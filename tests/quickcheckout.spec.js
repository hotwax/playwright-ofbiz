import { expect, test } from "@playwright/test";
import DashboardPage from "./Pages/dashboard.pages";
import QuickCheckoutPage from "./Pages/quickcheckout.page";

test.use({
  launchOptions: {
    slowMo: 1000,
  },
});

test.describe("Quick Checkout Tests", () => {
  test("user can complete the checkout flow from dashboard to review page", async ({ page }) => {
    test.setTimeout(60000);
    const stepDelay = 2000;
    const dashboardPage = new DashboardPage(page);
    const quickCheckoutPage = new QuickCheckoutPage(page);

    await page.goto("/ecommerce/control/main");
    await page.waitForTimeout(stepDelay);

    await dashboardPage.verifyDashboardHeading();
    await page.waitForTimeout(stepDelay);
    await dashboardPage.clickAddToCart();
    await page.waitForTimeout(stepDelay);
    await dashboardPage.clickQuickCheckout();
    await page.waitForTimeout(stepDelay);

    await quickCheckoutPage.verifyPageLoaded();
    await page.waitForTimeout(stepDelay);
    await quickCheckoutPage.selectFirstShippingMethod();
    await page.waitForTimeout(stepDelay);
    await quickCheckoutPage.selectCashOnDelivery();
    await page.waitForTimeout(stepDelay);

    await expect(quickCheckoutPage.firstShippingMethod).toBeChecked();
    await page.waitForTimeout(stepDelay);
    await expect(quickCheckoutPage.codRadio).toBeChecked();
    await page.waitForTimeout(stepDelay);

    await quickCheckoutPage.continueToReview();
    await page.waitForTimeout(stepDelay);
    await quickCheckoutPage.verifyReviewPageLoaded();
    await page.waitForTimeout(3000);
  });
});
