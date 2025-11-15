import { test, expect } from '@playwright/test';

test('Verify that the Submit button is enabled when both Name and Password fields are entered', async ({ page }) => {

  // Step 1: Navigate to the site
  await page.goto('https://d3pv22lioo8876.cloudfront.net/tiptop/');

  // Step 2: Identify elements
  const nameField = page.locator('input[name="name"]');        // assuming field has name='name'
  const passwordField = page.locator('input[name="password"]'); // assuming field has name='password'
  const submitButton = page.locator('button[type="submit"]');

  // Step 3: Verify Submit button is disabled initially
  await expect(submitButton).toBeDisabled();

  // Step 4: Fill only the Name field → button should remain disabled
  await nameField.fill('John Doe');
  await expect(submitButton).toBeDisabled();

  // Step 5: Fill Password field → button should become enabled
  await passwordField.fill('Test@123');
  await expect(submitButton).toBeEnabled();

  // Step 6: (Optional) Clear one field → button should disable again
  await nameField.clear();
  await expect(submitButton).toBeDisabled();

});