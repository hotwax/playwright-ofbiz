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
    this.cookiesModal = page.locator("#bs-gdpr-cookies-modal");
    this.acceptCookiesButton = this.cookiesModal.getByRole("button", { name: "Accept" });
  }

  async acceptCookiesIfVisible() {
    // Only attempt to click if the modal is actually visible to avoid unnecessary timeouts.
    if (await this.cookiesModal.isVisible()) {
      await this.acceptCookiesButton.click({ timeout: 2000 }).catch(() => {});
      await expect(this.cookiesModal).toBeHidden({ timeout: 2000 }).catch(() => {});
    }
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/\/ecommerce\/control\/quickcheckout/);
    await this.acceptCookiesIfVisible();
    await expect(this.shippingHeading).toBeVisible();
    await expect(this.shipToPartyDropdown).toBeVisible();
  }

  async selectShipToParty(partyName) {
    if (!partyName) {
      return;
    }

    // Check the dropdown first so invalid test data fails quickly and clearly.
    const options = await this.shipToPartyDropdown.locator("option").allTextContents();
    const hasParty = options.map((option) => option.trim()).includes(partyName);

    if (!hasParty) {
      throw new Error(`Ship to party "${partyName}" was not found.`);
    }

    await this.shipToPartyDropdown.selectOption({ label: partyName });
  }

  async selectFirstShippingMethod() {
    await this.acceptCookiesIfVisible();
    await this.firstShippingMethod.check();
  }

  async selectCashOnDelivery() {
    await this.acceptCookiesIfVisible();
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

  async clickContinueToReview() {
    // Click the review link without expecting navigation.
    // This is used for validation tests where the page should stay here.
    await this.acceptCookiesIfVisible();
    await expect(this.continueToReviewLink).toBeVisible();
    await this.continueToReviewLink.click();
  }

  async verifyReviewPageLoaded() {
    await expect(this.page).toHaveURL(/\/ecommerce\/control\/checkout$/);
    await expect(this.shippingHeading).toBeVisible();
  }

}

export default QuickCheckoutPage;
