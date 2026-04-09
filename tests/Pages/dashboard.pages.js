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
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
    }

    async clickQuickCheckout() {
        const btn = this.quickCheckoutButton.first();
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
    }
}

export default DashboardPage;
