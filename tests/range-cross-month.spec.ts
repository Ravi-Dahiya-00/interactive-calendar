import { test, expect } from '@playwright/test';

test('can extend selected range to next month', async ({ page }) => {
  await page.addInitScript(() => {
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    localStorage.setItem('calendar-last-summary', todayKey);
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  // Jump to November 2026.
  await page.getByRole('button', { name: 'Select year' }).click();
  await page.getByRole('button', { name: '2026' }).click();
  await page.getByRole('button', { name: 'Select month' }).click();
  await page.getByRole('button', { name: 'Nov' }).click();

  await page.locator('div[tabindex="0"][aria-label="1"]').first().click();
  await page.locator('div[tabindex="0"][aria-label="30"]').first().click();
  await expect(page.getByText('1 Nov — 30 Nov, 2026')).toBeVisible();

  await page.getByRole('button', { name: 'Next month' }).click();
  await page.locator('div[tabindex="0"][aria-label="31"]').first().click();

  await expect(page.getByText('1 Nov — 31 Dec, 2026')).toBeVisible();
});

test('can select start then navigate and choose end in next month', async ({ page }) => {
  await page.addInitScript(() => {
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    localStorage.setItem('calendar-last-summary', todayKey);
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  await page.getByRole('button', { name: 'Select year' }).click();
  await page.getByRole('button', { name: '2026' }).click();
  await page.getByRole('button', { name: 'Select month' }).click();
  await page.getByRole('button', { name: 'Nov' }).click();

  await page.locator('div[tabindex="0"][aria-label="1"]').first().click();

  await page.getByRole('button', { name: 'Next month' }).click();
  await page.locator('div[tabindex="0"][aria-label="31"]').first().click();

  await expect(page.getByText('1 Nov — 31 Dec, 2026')).toBeVisible();
});
