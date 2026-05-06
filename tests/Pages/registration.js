const { expect } = require('@playwright/test');

/**
 * Page Object Model for the Registration page in the OFBiz eCommerce application.
 * This class encapsulates all selectors and logical actions for the registration flow.
 */
class RegistrationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Locators ---
    // (Consolidated selectors for easier maintenance)
    
    // Page Elements
    this.acceptButton = page.getByRole('button', { name: 'Accept' });
    this.registerLink = page.getByRole('link', { name: 'Register' });

    // Personal Details
    this.userTitle = page.locator('select[name="USER_TITLE"]');
    this.firstNameInput = page.getByRole('textbox', { name: 'First name*' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name*' });

    // Address Details
    this.addressLine1Input = page.getByRole('textbox', { name: 'Address Line 1*' });
    this.cityInput = page.getByRole('textbox', { name: 'City*' });
    this.zipCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code*' });
    this.countrySelect = page.locator('#newuserform_countryGeoId');
    this.stateSelect = page.locator('#newuserform_stateProvinceGeoId');

    // Contact Details
    this.emailInput = page.getByRole('textbox', { name: 'E-Mail Address*' });
    this.addressSolicitation = page.getByLabel('Allow Address Solicitation');
    this.solicitation = page.getByLabel('Allow Solicitation');

    // Mobile Phone Details
    this.mobileCountryInput = page.locator('input[name="CUSTOMER_MOBILE_COUNTRY"]');
    this.mobileAreaInput = page.locator('input[name="CUSTOMER_MOBILE_AREA"]');
    this.mobileContactInput = page.locator('input[name="CUSTOMER_MOBILE_CONTACT"]');
    this.mobileSolicitationSelect = page.locator('select[name="CUSTOMER_MOBILE_ALLOW_SOL"]');

    // Account Details
    this.usernameInput = page.getByRole('textbox', { name: 'User Name*' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Repeat password to confirm*' });
    this.passwordHintInput = page.getByRole('textbox', { name: 'Password Hint' });
    this.saveButton = page.getByRole('link', { name: 'Save' });
  }

  // --- Actions ---

  /**
   * Navigates to the main eCommerce page and opens the registration form.
   */
  async goToRegistration() {
    await this.page.goto('/');
    
    // Handle the cookie acceptance/consent banner if it appears
    try {
      const cookieBannerText = this.page.getByText('This website uses cookies');
      // Wait a short time for the banner to appear, as 'isVisible' doesn't wait
      await cookieBannerText.waitFor({ state: 'visible', timeout: 3000 });
      
      // Usually platforms with that exact text have an 'Accept' or 'Got it!' button (could be a button or an anchor tag)
      const acceptCookiesButton = this.page.locator('button, a').filter({ hasText: /Accept|Got it|Allow/i }).first();
      await acceptCookiesButton.click();
    } catch (error) {
      // Cookie banner did not appear within 3 seconds, continue safely.
    }
    
    await this.registerLink.click();
  }

  /**
   * Fills in personal details including title, first name, and last name.
   */
  async fillPersonalDetails(title, firstName, lastName) {
    await this.userTitle.selectOption(title);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Fills in address details including line 1, city, zip, country, and state.
   */
  async fillAddressDetails(address, city, zip, country, state) {
    await this.addressLine1Input.fill(address);
    await this.cityInput.fill(city);
    await this.zipCodeInput.fill(zip);
    await this.countrySelect.selectOption(country);
    await this.stateSelect.selectOption(state);
  }

  /**
   * Fills in contact information and solicitation preferences.
   */
  async fillContactDetails(email) {
    await this.emailInput.fill(email);
    await this.addressSolicitation.selectOption('Y');
    await this.solicitation.selectOption('Y');
  }

  /**
   * Fills in mobile phone details.
   */
  async fillMobileDetails(country, area, contact) {
    await this.mobileCountryInput.fill(country);
    await this.mobileAreaInput.fill(area);
    await this.mobileContactInput.fill(contact);
    await this.mobileSolicitationSelect.selectOption('Y');
  }

  /**
   * Fills in account credentials and submits the form.
   */
  async fillAccountDetails(username, password, hint) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.passwordHintInput.fill(hint);
    await this.saveButton.first().click();
  }
}

module.exports = { RegistrationPage };
