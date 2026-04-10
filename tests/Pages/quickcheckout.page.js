import { expect } from "@playwright/test";

class QuickCheckoutPage {
  constructor(page) {
    this.page = page;
    this.shippingHeading = page.getByRole("heading", { name: "1. Where shall we ship it?" });
    this.shipToPartyDropdown = page.getByRole("combobox", { name: "Ship to Party:" });
    this.firstShippingMethod = page.locator("#shipping_method_0");
    this.codRadio = page.getByRole("radio", { name: "COD" });
    this.continueToReviewLink = page.getByRole("link", {
      name: "Continue to Final Order Review",
    });
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/\/ecommerce\/control\/quickcheckout/);
    await expect(this.shippingHeading).toBeVisible();
    await expect(this.shipToPartyDropdown).toBeVisible();
  }

  async selectShipToParty(partyName) {
    if (!partyName) {
      return;
    }

    await this.shipToPartyDropdown.selectOption({ label: partyName });
  }

  async selectFirstShippingMethod() {
    await this.firstShippingMethod.check();
  }

  async selectCashOnDelivery() {
    await this.codRadio.check();
  }

  async continueToReview() {
    await Promise.all([
      this.page.waitForURL(/\/ecommerce\/control\/checkout$/, {
        waitUntil: "domcontentloaded",
      }),
      this.continueToReviewLink.click(),
    ]);
  }

  async verifyReviewPageLoaded() {
    await expect(this.page).toHaveURL(/\/ecommerce\/control\/checkout$/);
    await expect(this.shippingHeading).toBeVisible();
  }
}

export default QuickCheckoutPage;
