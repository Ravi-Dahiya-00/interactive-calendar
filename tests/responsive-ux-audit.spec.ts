import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-320', width: 320, height: 740 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

test.describe('responsive qa audit', () => {
  for (const vp of viewports) {
    test(`layout and core interactions on ${vp.name}`, async ({ page }) => {
      await page.addInitScript(() => {
        const now = new Date();
        const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
        localStorage.setItem('calendar-last-summary', todayKey);
      });

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      await expect(page.getByRole('heading', { name: 'Interactive Calendar' })).toBeVisible();

      const hasHorizontalOverflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth > root.clientWidth + 1;
      });
      expect(hasHorizontalOverflow).toBeFalsy();

      const firstDay = page.locator('[aria-label^="1"]').first();
      await firstDay.click();

      if (vp.width < 1024) {
        await page.getByRole('button', { name: 'Open Events & Notes' }).click();
        await expect(page.getByRole('heading', { name: 'Events & Notes' })).toBeVisible();
      }

      const input = page.locator('textarea[id$="-note-input"]:visible').first();
      await expect(input).toBeVisible();
      await input.fill(`Long QA note @${vp.name} ` + 'x'.repeat(60));
      await page.locator('button[id$="-add-note-btn"]:visible').first().click();
      await expect(page.locator('.note-card p:visible', { hasText: `Long QA note @${vp.name}` }).first()).toBeVisible();

      const filterToggle = page.getByRole('button', { name: 'Toggle Advanced Filters' });
      await filterToggle.click();
      await expect(page.getByText('Advanced Filters')).toBeVisible();
      await expect(page.getByPlaceholder('DD/MM/YYYY').first()).toBeVisible();

      await page.screenshot({
        path: `test-results/audit-${vp.name}.png`,
        fullPage: true,
      });
    });
  }
});
