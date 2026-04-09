import { test, expect } from "@playwright/test";
import DashboardPage from "./Pages/dashboard.pages";

test.describe("Dashboard Tests", () => {
	test("dashboard quick checkout flow", async ({ page }) => {
		const dashboardPage = new DashboardPage(page);

		await page.goto("/ecommerce/control/main");

		await dashboardPage.verifyDashboardHeading();
		await dashboardPage.clickAddToCart();
		await dashboardPage.clickQuickCheckout();

		await expect(page).toHaveURL(/\/ecommerce\/control\/quickcheckout/);
	});
});


