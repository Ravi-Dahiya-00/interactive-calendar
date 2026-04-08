import { test, expect } from '@playwright/test';

test('calendar smoke flow: open, add, filter, clear', async ({ page }) => {
  await page.addInitScript(() => {
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    localStorage.setItem('calendar-last-summary', todayKey);
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Interactive Calendar' })).toBeVisible();

  const input = page.locator('textarea[id$="-note-input"]:visible').first();
  await expect(input).toBeVisible();
  await input.fill('Playwright smoke event');
  await page.locator('button[id$="-add-note-btn"]:visible').first().click();

  await expect(page.getByText('Playwright smoke event')).toBeVisible();

  await page.getByPlaceholder('Search events... (e.g. meeting)').fill('Playwright smoke event');
  await expect(page.getByText('Playwright smoke event')).toBeVisible();

  await page.getByPlaceholder('Search events... (e.g. meeting)').fill('not-existing-search-term');
  await expect(page.getByText('No matching events found')).toBeVisible();
});
