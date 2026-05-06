import { expect } from "@playwright/test";

class DashboardPage {
    constructor(page) {
        this.page = page;
        this.dashboardHeading = page.getByRole("heading", { name: "Open For Commerce" });
        this.addToCartButton = page.getByRole("link", { name: "Add To Cart" });
        this.quickCheckoutButton = page.getByRole("link", { name: "Quick Checkout" });
    }

    async verifyDashboardHeading() {
        await expect(this.dashboardHeading).toBeVisible();
    }

    async clickAddToCart() {
        const btn = this.addToCartButton.first();

        // Add the first available product to the cart.
        // The site may refresh after this click, so wait for the page to settle.
        await expect(btn).toBeVisible();
        await btn.click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async clickQuickCheckout() {
        const btn = this.quickCheckoutButton.first();

        // Open quick checkout from the cart summary.
        // Playwright scrolls before clicking, so no manual scroll is needed here.
        await expect(btn).toBeVisible();
        await btn.click();
        await expect(this.page).toHaveURL(/\/ecommerce\/control\/quickcheckout/);
    }
}

export default DashboardPage;
