import { expect, test } from '@playwright/test';

test('basic e2e test', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('umami.disabled', 'true');
  });

  await page.goto('/');

  async function clickPosition({
    x,
    y,
    marker,
  }: {
    x: number;
    y: number;
    marker: 'x' | 'o';
  }) {
    await checkStatus(`Next turn ${marker}`);
    await page.getByTestId(positionKey(x, y)).getByRole('button').click();
    await expect(page.getByTestId(positionKey(x, y))).toContainText(marker);
  }

  async function checkStatus(expected: string) {
    await expect(page.getByTestId('game-status')).toContainText(expected);
  }

  await clickPosition({ x: 0, y: 0, marker: 'x' });
  await clickPosition({ x: 1, y: 1, marker: 'o' });
  await clickPosition({ x: 0, y: 1, marker: 'x' });
  await clickPosition({ x: 2, y: 1, marker: 'o' });
  await clickPosition({ x: 0, y: 2, marker: 'x' });

  await checkStatus('x wins!');
});

function positionKey(x: number, y: number) {
  return `x=${x},y=${y}`;
}
