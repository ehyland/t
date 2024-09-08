import { expect, test } from '@playwright/test';

test('basic e2e test', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('umami.disabled', 'true');
  });

  await page.goto('/');

  async function playPosition(x: number, y: number, marker: 'x' | 'o') {
    await checkStatus(`Next turn ${marker}`);
    await page.getByTestId(positionKey(x, y)).getByRole('button').click();
    await expect(page.getByTestId(positionKey(x, y))).toContainText(marker);
  }

  async function checkStatus(expected: string) {
    await expect(page.getByTestId('game-status')).toContainText(expected);
  }

  await playPosition(0, 0, 'x');
  await playPosition(1, 1, 'o');
  await playPosition(0, 1, 'x');
  await playPosition(2, 1, 'o');
  await playPosition(0, 2, 'x');

  await checkStatus('x wins!');
});

function positionKey(x: number, y: number) {
  return `x=${x},y=${y}`;
}
