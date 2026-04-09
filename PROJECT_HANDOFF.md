# OFBiz Playwright Project Handoff

## 1. What This Project Is

This repository is a Playwright end-to-end automation project for the OFBiz ecommerce application hosted at:

`https://ofbizdemotesting.hotwaxsystems.com`

The purpose of the project so far is to:

- set up a reusable Playwright test framework
- support authenticated test execution without logging in inside every test
- confirm that the environment is reachable and stable with an initial smoke test
- create a clean starting point for adding more business flow scripts later

In simple terms, we have created the foundation of the automation suite, not a large test library yet.

## 2. What Has Been Done So Far

At the moment, the project includes:

- Playwright project setup with Node.js
- environment variable support using `dotenv`
- a Playwright config with project separation
- an authentication setup test that logs in and stores session state
- one smoke test that verifies the `newcustomer` page opens successfully
- npm scripts for normal, headed, UI, and debug execution
- ignore rules for secrets, reports, and Playwright-generated artifacts

This means the base automation structure is ready, and future scripts can be added on top of it without re-solving login every time.

Decision for future work:

- new test scripts should be written in JavaScript

## 3. Current Project Structure

```text
.
|-- .env.example
|-- .gitignore
|-- package.json
|-- playwright.config.js
`-- tests
    |-- auth
    |   `-- login.setup.js
    `-- smoke.spec.js
```

Note:

- the current repository is JavaScript-based
- future scripts should continue in JavaScript for consistency

### File-by-file explanation

#### `package.json`

This file defines the project metadata and the main commands used to run Playwright.

Available scripts:

- `npm test` runs the full Playwright suite
- `npm run test:headed` runs tests with the browser visible
- `npm run test:ui` opens Playwright UI mode
- `npm run test:debug` starts Playwright in debug mode
- `npm run report` opens the HTML report

The main development dependencies currently are:

- `@playwright/test`
- `dotenv`
- `@types/node`

#### `playwright.config.js`

This is the central configuration file for the test framework.

What it currently does:

- loads `.env` automatically using `dotenv/config`
- sets the test directory to `./tests`
- configures retries for CI only
- enables HTML reporting
- keeps screenshots, traces, and videos for failure/debug support
- defines a fixed base URL
- creates two Playwright projects:
  - `setup`
  - `chromium`

Important values:

- Base URL: `https://ofbizdemotesting.hotwaxsystems.com/ecommerce/control/newcustomer`
- Saved session file: `playwright/.auth/user.json`

Why the two-project setup matters:

- the `setup` project runs the login flow first
- the `chromium` project depends on `setup`
- once login is complete, the browser storage state is reused by later tests

This is the key design decision in the project so far because it avoids repeating login in every test.

#### `tests/auth/login.setup.js`

This is the authentication bootstrap test.

Its responsibility is to:

- read `USERNAME` and `PASSWORD` from environment variables
- open the login page
- submit credentials
- verify that login succeeded
- save the authenticated browser state to `playwright/.auth/user.json`

This saved state acts like a reusable logged-in session.

Why this is useful:

- reduces duplication across tests
- speeds up execution
- keeps business-flow tests cleaner
- centralizes authentication logic in one place

#### `tests/smoke.spec.js`

This is the first actual browser test.

Right now it only verifies one essential thing:

- the configured OFBiz `newcustomer` page opens successfully

This is a classic smoke test. Its value is small but important:

- it proves the framework is running correctly
- it proves base URL navigation works
- it proves the authenticated project wiring is not blocking normal execution

#### `.env.example`

This is the template for required local credentials.

The expected values are:

```env
USERNAME=your-username
PASSWORD=your-password
```

Developers should create a real `.env` file locally based on this example.

#### `.gitignore`

This file prevents sensitive or generated files from being committed.

It ignores:

- `node_modules`
- `.env` and local env variants
- Playwright reports and result folders
- saved auth session files
- OS-specific junk files like `.DS_Store`

This is important because credentials and saved sessions should never be committed.

## 4. How the Test Flow Works

The execution flow today is:

1. Playwright starts the `setup` project.
2. `tests/auth/login.setup.js` logs into OFBiz.
3. The browser storage state is saved to `playwright/.auth/user.json`.
4. Playwright starts the `chromium` project.
5. The `chromium` project reuses the saved session.
6. `tests/smoke.spec.js` opens the target page and validates that it loads.

This means future tests do not need to repeat:

- visiting the login page
- typing username/password
- performing login for every test

As long as the saved storage state is valid, the test suite can focus on business actions.

## 5. How to Run the Project

### First-time setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example`

3. Add valid OFBiz credentials:

```env
USERNAME=actual-username
PASSWORD=actual-password
```

4. If Playwright browsers are not installed yet:

```bash
npx playwright install
```

### Run commands

Run all tests:

```bash
npm test
```

Run with visible browser:

```bash
npm run test:headed
```

Run in interactive UI mode:

```bash
npm run test:ui
```

Run in debug mode:

```bash
npm run test:debug
```

Open the last HTML report:

```bash
npm run report
```

## 6. What the Team Has Achieved Technically

Even though the suite is still small, the important framework decisions are already in place:

- credential handling is externalized through environment variables
- login is centralized in one reusable setup test
- browser session reuse is implemented through `storageState`
- the suite already has a separation between setup logic and actual test logic
- reporting and failure artifacts are configured
- the repository is ready for scaling into more scripts

This is the hard part of starting an automation framework. Adding more tests is now much easier than creating the foundation from scratch.

## 7. How Future Scripts Should Be Added

The next person working on this repository should treat it as a growing Playwright test suite.

### Recommended approach

For each new business flow:

1. create a new spec file under `tests/`
2. keep the test focused on one business behavior
3. reuse the existing authenticated state whenever login is required
4. use clear test names that describe the user action or expected result
5. add assertions after each important action

### Suggested naming examples

- `tests/customer-registration.spec.js`
- `tests/order-creation.spec.js`
- `tests/cart-flow.spec.js`
- `tests/profile-update.spec.js`

### Suggested structure for a future test

```js
import { expect, test } from "@playwright/test";

test("customer can open the order history page", async ({ page }) => {
  await page.goto("/ecommerce/control/orderhistory");
  await expect(page).toHaveURL(/orderhistory/);
});
```

Because the `chromium` project already uses `storageState`, tests like this can directly begin from an authenticated state if the session is valid.

## 8. Good Practices for Continuing This Project

### 1. Keep auth logic in one place

Do not duplicate login steps in every spec file unless a test explicitly needs to verify the login flow itself.

### 2. Prefer JavaScript for new tests

The team has decided to continue future automation work in JavaScript. New scripts should therefore use `.js` so contributors follow one consistent direction.

### 3. Use stable selectors

When possible, prefer selectors such as:

- `getByRole`
- `getByLabel`
- `getByPlaceholder`
- `getByText` only when it is stable

Avoid fragile selectors that depend too much on layout or CSS structure.

### 4. Add meaningful assertions

Do not only click through the page. Verify outcomes such as:

- correct URL
- success messages
- visible headings
- expected table rows
- changed field values

### 5. Keep tests independent

Each test should be able to run on its own as much as possible. Avoid making one business test depend on another business test.

### 6. Organize by feature as the suite grows

If more scripts are added, the `tests/` folder can be grouped by functional areas, for example:

```text
tests/
|-- auth/
|-- customer/
|-- orders/
|-- catalog/
`-- smoke/
```

### 7. Consider test data strategy early

As the suite expands, the team should decide:

- whether tests create their own data
- whether they depend on pre-existing accounts/orders
- how cleanup should work

This becomes important once flows become more complex than page-open checks.

## 9. Current Limitations

The project is a solid starting point, but there are still a few gaps:

- only one real browser test exists today
- there is no shared helper library yet
- there are no page objects or reusable utility functions yet
- there is no CI pipeline configuration in this repository yet
- there is no documented test data strategy yet
- there is no distinction yet between smoke, regression, and full-flow suites

These are normal gaps for an early-stage automation project.

## 10. Recommended Next Steps

The next logical improvements would be:

1. Add 3 to 5 more smoke or business-flow tests.
2. Introduce reusable helpers if repeated actions start appearing.
3. Group tests by feature area once the suite grows.
4. Add CI execution for automatic test runs.
5. Document valid test accounts and test data assumptions.

## 11. Quick Summary for a New Contributor

If someone new joins this project, the simplest explanation is:

- this is a Playwright automation framework for OFBiz ecommerce
- login is handled once in `tests/auth/login.setup.js`
- the saved authenticated session is reused by real tests
- `tests/smoke.spec.js` is the first example of a working test
- new scripts should be added as new `.spec.js` files under `tests/`
- credentials belong in `.env`, never in source code

## 12. Important Files to Read First

If a new contributor wants to understand the suite quickly, they should read files in this order:

1. `package.json`
2. `playwright.config.js`
3. `tests/auth/login.setup.js`
4. `tests/smoke.spec.js`
5. `.env.example`

That order explains the project from execution entry point to actual test behavior.
