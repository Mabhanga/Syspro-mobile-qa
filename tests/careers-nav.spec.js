const { test, expect, devices } = require('@playwright/test');

/**
 * Bug: On mobile, Home > burger menu > About > Careers lands on a
 * "Pinpoint"-branded 404 ("The page you were looking for doesn't exist"),
 * instead of the live Syspro careers page. Reproduced on two physical
 * devices. The SAME device's footer "About > Careers" link works fine,
 * and desktop (burger menu AND footer) works fine too — so this is
 * scoped specifically to the mobile burger-menu nav item, which appears
 * to still point at an old/decommissioned careers URL (Pinpoint ATS)
 * instead of the current one.
 *
 * NOTE: this repo was authored without live access to syspro.com or a
 * downloadable Chromium build (sandboxed dev environment), so the exact
 * selectors below are written defensively (role/text based, not brittle
 * CSS classes) but have NOT been run against the live site yet. Run
 * locally with `npx playwright test --headed` and adjust selectors to
 * match the live DOM if any of them don't resolve — `npx playwright
 * codegen https://www.syspro.com` is the fastest way to correct them.
 */

const FOUR_OH_FOUR_TEXT = /page you were looking for doesn't exist/i;

test.describe('Mobile burger menu > About > Careers', () => {
  test.use({ ...devices['Pixel 7'] });

  test('BUG: burger menu Careers link leads to a 404', async ({ page }) => {
    await page.goto('/');

    // Open the mobile burger menu
    const burger = page.getByRole('button', { name: /menu/i });
    await burger.click();

    // Expand the "About" section of the mobile menu
    await page.getByRole('link', { name: /^about$/i }).click();

    // Tap "Careers"
    await page.getByRole('link', { name: /^careers$/i }).click();

    // Confirm we land on the broken Pinpoint 404 page, not the real careers page
    await expect(page.getByText(FOUR_OH_FOUR_TEXT)).toBeVisible();
    await expect(page).not.toHaveURL(/\/careers\/?$/);
  });

  test('CONTROL: footer About > Careers link works correctly', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer and use the working link as a contrast case
    const footerCareers = page.locator('footer').getByRole('link', { name: /^careers$/i });
    await footerCareers.scrollIntoViewIfNeeded();
    await footerCareers.click();

    // Should land on the real careers page, no 404
    await expect(page).toHaveURL(/\/careers\/?$/);
    await expect(page.getByText(FOUR_OH_FOUR_TEXT)).not.toBeVisible();
    await expect(page.getByRole('heading', { name: /true pros/i })).toBeVisible();
  });
});

test.describe('Desktop nav > About > Careers', () => {
  test.use({ ...devices['Desktop Chrome'] });

  test('CONTROL: desktop burger/top nav Careers link works correctly', async ({ page }) => {
    await page.goto('/');

    // Desktop nav: "Insights" mega-menu > Company column > Careers
    await page.getByRole('link', { name: /^insights$/i }).hover();
    await page.getByRole('link', { name: /^careers$/i }).first().click();

    await expect(page).toHaveURL(/\/careers\/?$/);
    await expect(page.getByText(FOUR_OH_FOUR_TEXT)).not.toBeVisible();
  });

  test('CONTROL: desktop footer Careers link works correctly', async ({ page }) => {
    await page.goto('/');

    const footerCareers = page.locator('footer').getByRole('link', { name: /^careers$/i });
    await footerCareers.scrollIntoViewIfNeeded();
    await footerCareers.click();

    await expect(page).toHaveURL(/\/careers\/?$/);
    await expect(page.getByText(FOUR_OH_FOUR_TEXT)).not.toBeVisible();
  });
});
