
const { test, expect } = require("@playwright/test");

const BASE_URL = "https://d3pv22lioo8876.cloudfront.net/tiptop/";

test.describe("TipTop Form Validation Suite", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // Test Case 01 – Validate the disabled input field
  test("Test Case 01: Check if the input with name='my-disabled' is non-editable", async ({ page }) => {
    const nonEditableField = page.locator("//input[@name='my-disabled']");
    await expect(nonEditableField).toBeDisabled();

    // Additional boolean verification
    const disabledStatus = await nonEditableField.isDisabled();
    expect(disabledStatus).toBe(true);
  });

  // Test Case 02 – Ensure readonly text box works using two different locators
  test("Test Case 02: Validate 'Readonly input' field via two XPath approaches", async ({ page }) => {
    const readonly1 = page.locator("//input[@value='Readonly input']");
    await expect(readonly1).toHaveAttribute("readonly", "");

    const readonly2 = page.locator("//input[@readonly]");
    await expect(readonly2).toHaveAttribute("value", "Readonly input");

    // Confirm that typing doesn't modify the stored value
    const initial = await readonly1.inputValue();
    await readonly1.pressSequentially("Testing attempt...", { delay: 10 });
    const finalVal = await readonly1.inputValue();

    expect(finalVal).toBe(initial);
  });

  // Test Case 03 – Verify dropdown list contains exactly eight items
  test("Test Case 03: Confirm the color dropdown populates 8 choices", async ({ page }) => {
    const dropOptions1 = page.locator("//select[@name='my-select']//option");
    await expect(dropOptions1).toHaveCount(8);

    const dropOptions2 = page.locator("//select/option");
    await expect(dropOptions2).toHaveCount(8);
  });

  // Test Case 04 – Submit button should remain disabled when no Name is filled
  test("Test Case 04: Submission button stays inactive if Name field is blank", async ({ page }) => {
    const nameBox = page.locator("//input[@name='my-name']");
    const submitBtn = page.locator("//button[@type='submit']");

    await nameBox.clear();
    await expect(submitBtn).toBeDisabled();
  });

  // Test Case 05 – Submit button becomes active when both fields are filled
  test("Test Case 05: Submit button activates when Name & Password are provided", async ({ page }) => {
    const username = page.locator("//input[@name='my-name']");
    const userpass = page.locator("//input[@name='my-password']");
    const submitBtn = page.locator("//button[@type='submit']");

    await username.fill("SampleUser");
    await userpass.fill("SecretPwd123");

    await expect(submitBtn).toBeEnabled();
  });

  // Test Case 06 – Validate the confirmation message after a successful submission
  test("Test Case 06: Form submission displays the expected confirmation text", async ({ page }) => {
    const nameField = page.locator("//input[@name='my-name']");
    const passField = page.locator("//input[@name='my-password']");
    const submitTrigger = page.locator("//button[@type='submit']");

    await nameField.fill("UserX");
    await passField.fill("PwdX");
    await submitTrigger.click();

    const confirmation = page.locator("//p[contains(text(),'Received')]");
    await expect(confirmation).toBeVisible();
  });

  // Test Case 07 – Verify URL query parameters include name and password
  test("Test Case 07: Verify form input values appear in the redirected URL", async ({ page }) => {
    const nameField = page.locator("//input[@name='my-name']");
    const passField = page.locator("//input[@name='my-password']");
    const submitBtn = page.locator("//button[@type='submit']");

    const enteredName = "PlayUser";
    const enteredPass = "PlayPass";

    await nameField.fill(enteredName);
    await passField.fill(enteredPass);

    await Promise.all([
      page.waitForNavigation(),
      submitBtn.click(),
    ]);

    const current = page.url();
    expect(current).toContain(`name=${enteredName}`);
    expect(current).toContain(`password=${enteredPass}`);
  });
});
