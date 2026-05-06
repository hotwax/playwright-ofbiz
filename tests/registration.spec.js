const { test, expect } = require('@playwright/test');
const { RegistrationPage } = require('./pages/registration');

// Ensure this test always runs in a clean browser state (no login session).
test.use({ storageState: { cookies: [], origins: [] } });

/*
 * Utility function to generate a random string of a specific length.
 */
function getRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/*
 * Utility function to generate a random number of a specific length.
 */
function getRandomNumber(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}
/*
 * Registration test for the OFBiz eCommerce application.
 * This test uses random input data for each run to ensure dynamic testing.
 */
test('User can register for a new account with dynamic data', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  // --- Dynamic Address Data Bank ---
  const addressBank = [
    { country: 'USA', state: 'NY', city: 'New York', zip: '10001', address: '123 Broadway St' },
    { country: 'IND', state: 'IN-MP', city: 'Indore', zip: '452010', address: 'Scheme No 114 PT 2' },
    { country: 'CAN', state: 'ON', city: 'Toronto', zip: 'M5H 2N2', address: '456 King St W' },
    { country: 'USA', state: 'CA', city: 'Los Angeles', zip: '90001', address: '789 Sunset Blvd' },
    { country: 'IND', state: 'IN-UP', city: 'Lucknow', zip: '226001', address: 'Hazratganj Area' }
  ];

  const selectedAddr = addressBank[Math.floor(Math.random() * addressBank.length)];

  // --- Dynamic Personal Data ---
  const firstName = `User${getRandomString(5)}`;
  const lastName = `Test${getRandomString(5)}`;
  const email = `${getRandomString(5)}${getRandomNumber(3)}@gmail.com`; // Format: abcde123@gmail.com
  const mobileContact = getRandomNumber(10);             // 10-digit mobile number
  const username = `u${getRandomString(4)}${getRandomNumber(2)}`;
  const password = `Test@${getRandomNumber(3)}`;         // Consistent password for both fields
  const passwordHint = 'TestHint';

  console.log('--- Registration Credentials ---');
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log('-------------------------------');

  // 1. Navigate to the registration page
  await registrationPage.goToRegistration();

  // 2. Fill in Personal Details
  await registrationPage.fillPersonalDetails('Mr.', firstName, lastName);

  // 3. Fill in Address Details
  await registrationPage.fillAddressDetails(
    selectedAddr.address,
    selectedAddr.city,
    selectedAddr.zip,
    selectedAddr.country,
    selectedAddr.state
  );

  // 4. Fill in Contact Details (Email)
  await registrationPage.fillContactDetails(email);

  // 5. Fill in Mobile Phone Details
  await registrationPage.fillMobileDetails('India', '91', mobileContact);

  // 6. Fill in Account Details & Submit (Username, Password, Confirm Password)
  // The POM method already uses the same password for both 'Password' and 'Confirm'
  await registrationPage.fillAccountDetails(username, password, passwordHint);

  // 7. Verify Outcome
  console.log('Waiting for redirection after registration...');

  // A. Verify URL redirection (Accept both 'main' and 'createcustomer' as valid success landing pages)
  // We use a longer timeout here to account for server processing and slowMo
  await expect(page).toHaveURL(/ecommerce\/control\/(main|createcustomer)/, { timeout: 30000 });

  console.log('Final URL after registration:', page.url());

  // B. Verify "Logout" link is visible (indicates successful login)
  const logoutLink = page.getByRole('link', { name: /Logout/i });
  await expect(logoutLink).toBeVisible();

  // C. Verify "Welcome" message exists in the header area
  // We search for the text "Welcome" which is visible in the screenshot
  await expect(page.getByText(/Welcome/i)).toBeVisible();

  const welcomeMessage = await page.getByText(/Welcome/i).innerText();
  console.log('Registration successful! Found:', welcomeMessage);
});
