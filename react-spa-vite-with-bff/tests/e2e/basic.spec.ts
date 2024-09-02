import { expect, test } from '@playwright/test';

test('basic e2e test', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('umami.disabled', 'true');
  });

  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'The Example App', level: 1 }),
  ).toBeVisible();
});
