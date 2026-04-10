import { test } from "@playwright/test";
import DashboardPage from "./Pages/dashboard.pages";
import QuickCheckoutPage from "./Pages/quickcheckout.page";

test.describe("Dashboard Tests", () => {
	test("dashboard quick checkout flow", async ({ page }) => {
		const dashboardPage = new DashboardPage(page);
		const quickCheckoutPage = new QuickCheckoutPage(page);

		await page.goto("/ecommerce/control/main");

		await dashboardPage.verifyDashboardHeading();
		await dashboardPage.clickAddToCart();
		await dashboardPage.clickQuickCheckout();

		await quickCheckoutPage.verifyPageLoaded();
	});
});
