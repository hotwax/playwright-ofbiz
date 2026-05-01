import { expect, test } from "@playwright/test";
import DashboardPage from "./Pages/dashboard.pages";
import QuickCheckoutPage from "./Pages/quickcheckout.page";

test.describe.configure({ mode: "serial" });

async function openQuickCheckout(page) {
  const dashboardPage = new DashboardPage(page);
  const quickCheckoutPage = new QuickCheckoutPage(page);

  await page.goto("/ecommerce/control/main");
  await dashboardPage.verifyDashboardHeading();
  await dashboardPage.clickAddToCart();
  await dashboardPage.clickQuickCheckout();
  await quickCheckoutPage.verifyPageLoaded();

  return { quickCheckoutPage };
}

test.describe("Quick Checkout Tests", () => {
  test("user can complete the checkout flow from dashboard to review page", async ({ page }, testInfo) => {
    test.setTimeout(60000);
    const stepDelay = testInfo.project.use.headless === false ? 2000 : 0;
    const { quickCheckoutPage } = await openQuickCheckout(page);
    if (stepDelay) await page.waitForTimeout(stepDelay);

    await quickCheckoutPage.selectFirstShippingMethod();
    if (stepDelay) await page.waitForTimeout(stepDelay);
    await quickCheckoutPage.selectCashOnDelivery();
    if (stepDelay) await page.waitForTimeout(stepDelay);

    await expect(quickCheckoutPage.firstShippingMethod).toBeChecked();
    if (stepDelay) await page.waitForTimeout(stepDelay);
    await expect(quickCheckoutPage.codRadio).toBeChecked();
    if (stepDelay) await page.waitForTimeout(stepDelay);

    await quickCheckoutPage.continueToReview();
    if (stepDelay) await page.waitForTimeout(stepDelay);
    await quickCheckoutPage.verifyReviewPageLoaded();
    if (stepDelay) await page.waitForTimeout(3000);
  });

  test("user can proceed to review page using default shipping and payment", async ({ page }) => {
    test.setTimeout(60000);
    const { quickCheckoutPage } = await openQuickCheckout(page);

    // Click continue without manual selection - app uses defaults.
    await quickCheckoutPage.clickContinueToReview();

    await quickCheckoutPage.verifyReviewPageLoaded();
  });

  test("user cannot select an invalid ship to party", async ({ page }) => {
    test.setTimeout(60000);
    const { quickCheckoutPage } = await openQuickCheckout(page);

    await expect(
      quickCheckoutPage.selectShipToParty("Invalid Party"),
    ).rejects.toThrow();
    await quickCheckoutPage.verifyPageLoaded();
  });
});
