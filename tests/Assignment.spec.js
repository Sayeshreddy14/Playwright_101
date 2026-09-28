import { test, expect } from '@playwright/test';

test.describe('Test Scenarios 1, 2 & 3', () => {

  let context;
  let page;

 test.beforeEach(async ({ browser }) => {
    console.log('BEFORE EACH: Creating fresh context and page ');
    context = await browser.newContext();
    page    = await context.newPage();
    console.log('Setup complete.');
  });

  test.afterEach(async () => {
    console.log('AFTER EACH: Closing page and context ');
    await page.close();
    await context.close();
    console.log('Teardown complete.');
  });

  test('Test Scenario 1: Simple Form Demo', async () => {

    const scenario = 'scenario1';

    console.log('Navigating to Selenium Playground...');
    await page.goto('https://www.testmuai.com/selenium-playground/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `screenshots/${scenario}_01_homepage.png` });

    console.log('Clicking Simple Form Demo link...');
    await page.click('text="Simple Form Demo"');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/simple-form-demo/);
    await page.screenshot({ path: `screenshots/${scenario}_02_form_page.png` });

    console.log('Filling input field...');
    const messageText = 'Welcome to TestMu AI';
    await page.locator('input#user-message').fill(messageText);
    await page.screenshot({ path: `screenshots/${scenario}_03_after_fill.png` });

    console.log('Clicking Get Checked Value button...');
    await page.getByRole('button', { name: 'Get Checked Value', exact: true }).click();
    await page.screenshot({ path: `screenshots/${scenario}_04_after_click.png` });

    console.log('Asserting message text...');
    await expect(page.locator('#message')).toHaveText(messageText, { timeout: 10000 });
    await page.screenshot({ path: `screenshots/${scenario}_05_assertion_passed.png` });

    console.log('Test Scenario 1 Passed!');
  });
  
  test('Test Scenario 2: Drag & Drop Sliders', async () => {

  const scenario = 'scenario2';

    console.log('Navigating to Selenium Playground...');
    await page.goto('https://www.testmuai.com/selenium-playground/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `screenshots/${scenario}_01_homepage.png` });

    console.log('Clicking Drag & Drop Sliders link...');
    await page.click('text="Drag & Drop Sliders"');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `screenshots/${scenario}_02_sliders_page.png` });

    console.log('Setting slider value to 95...');
    await page.evaluate(() => {
      const slider = document.querySelector('#slider3 input[type="range"]');
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(slider, '95');
      slider.dispatchEvent(new Event('input',  { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `screenshots/${scenario}_03_after_drag.png` });

    console.log('Asserting slider output value is 95...');
    await expect(page.locator('#rangeSuccess')).toHaveText('95', { timeout: 10000 });
    await page.screenshot({ path: `screenshots/${scenario}_04_assertion_passed.png` });

    console.log('Test Scenario 2 Passed!');
  });

  test('Test Scenario 3: Input Form Submit', async () => {

    const scenario = 'scenario3';

    console.log('Navigating to Selenium Playground...');
    await page.goto('https://www.testmuai.com/selenium-playground/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `screenshots/${scenario}_01_homepage.png` });

    console.log('Clicking Input Form Submit link...');
    await page.click('text="Input Form Submit"');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `screenshots/${scenario}_02_form_page.png` });

    console.log('Clicking Submit without filling fields...');
    const submitButton = page.locator('button[type="submit"]:has-text("Submit")');
    await submitButton.click();
    await page.screenshot({ path: `screenshots/${scenario}_03_empty_submit.png` });

    console.log('Asserting validation message...');
    const nameInput = page.locator('input[name="name"]');
    const validationMessage = await nameInput.evaluate((el) => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
    await page.screenshot({ path: `screenshots/${scenario}_04_validation_error.png` });

    console.log('Filling in all form fields...');
    await nameInput.fill('John Doe');
    await page.fill('input[name="email"]',    'xyz@example.com');
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="company"]',  'Deloitte');
    await page.fill('input[name="website"]',  'https://example.com');
    await page.screenshot({ path: `screenshots/${scenario}_05_fields_filled.png` });

    console.log('Selecting country: United States...');
    await page.selectOption('select[name="country"]', { label: 'United States' });
    await page.screenshot({ path: `screenshots/${scenario}_06_country_selected.png` });

    console.log('Filling in address fields...');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="address_line1"]', '123 Main Street');
    await page.fill('input[name="address_line2"]', 'Test 400');
    await page.fill('#inputState', 'NY');
    await page.fill('input[name="zip"]', '123456');
    await page.screenshot({ path: `screenshots/${scenario}_07_address_filled.png` });

    console.log('Submitting the form...');
    await submitButton.click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `screenshots/${scenario}_08_after_submit.png` });

    console.log('Asserting success message...');
    const successMsg = page.locator('.success-msg');
    await expect(successMsg).toContainText(
      'Thanks for contacting us, we will get back to you shortly.',
      { timeout: 10000 }
    );
    await page.screenshot({ path: `screenshots/${scenario}_09_assertion_passed.png` });

    console.log('Test Scenario 3 Passed!');
  });


});
