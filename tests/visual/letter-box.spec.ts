import { test, expect, type Page, type Locator } from '@playwright/test';

async function dragTo(
  page: Page,
  tile: Locator,
  touch: boolean,
  dx: number,
  dy: number,
  cancel = false,
) {
  const bounds = (await tile.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  if (touch) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y }],
    });
    for (let step = 1; step <= 8; step++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + (dx * step) / 8, y: y + (dy * step) / 8 }],
      });
      await page.waitForTimeout(16);
    }
    await cdp.send('Input.dispatchTouchEvent', {
      type: cancel ? 'touchCancel' : 'touchEnd',
      touchPoints: [],
    });
    await cdp.detach();
  } else {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + dx, y + dy, { steps: 8 });
    if (cancel) await tile.dispatchEvent('pointercancel', { pointerId: 1 });
    await page.mouse.up();
  }
}

test('Letter box opens, tiles move and flip independently, and reset packs everything away', async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const stage = page.getByRole('group', { name: 'Letter box playground' });
  await stage.scrollIntoViewIfNeeded();
  const lid = page.locator('.projects-playground__lid');
  await expect(stage.getByRole('button')).toHaveCount(1);
  await dragTo(page, lid, isMobile, -60, 0);
  await expect(lid).toHaveAttribute('aria-expanded', 'true');
  await expect(stage.getByRole('button')).toHaveCount(9);
  const tile = page.locator('[data-tile="0"]');
  const original = (await tile.boundingBox())!;
  await dragTo(page, tile, isMobile, -55, -30);
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  await expect(tile).not.toHaveAttribute('data-dragging');
  await expect
    .poll(async () => (await tile.boundingBox())!.x)
    .toBeLessThan(original.x - 25);
  expect((await tile.boundingBox())!.x).toBeGreaterThanOrEqual(
    (await stage.boundingBox())!.x,
  );
  await tile.press('Enter');
  await expect(tile).toHaveText('P');
  await expect(tile).toHaveAccessibleName('P tile');
  await expect(tile).toHaveAttribute('aria-pressed', 'true');
  const before = (await tile.boundingBox())!;
  await tile.press('ArrowRight');
  await expect(stage).toHaveAttribute('data-animated', 'false');
  expect((await tile.boundingBox())!.x).toBeCloseTo(before.x + 20, 0);
  if (isMobile) await tile.tap();
  else await tile.click();
  await expect(tile).toHaveText('M');
  await expect(tile).toHaveAccessibleName('M tile');
  await page.getByRole('button', { name: 'Close the letter box' }).click();
  await expect(stage).toHaveAttribute('data-open', 'false');
  await expect(stage.getByRole('button')).toHaveCount(1);
  await page
    .getByRole('button', { name: 'Open the letter box' })
    .press('Enter');
  await expect(stage).toHaveAttribute('data-animated', 'false');
  await expect(tile).toHaveAttribute('style', '');
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByRole('button', { name: 'Open the letter box' }).click();
  expect(
    await lid.evaluate((element) =>
      parseFloat(getComputedStyle(element).transitionDuration),
    ),
  ).toBeLessThanOrEqual(0.00001);
});

test('Letter box cancels drags, allows scrolling, and fits phone and tablet sizes', async ({
  page,
  isMobile,
}) => {
  await page.goto('/projects');
  const stage = page.getByRole('group', { name: 'Letter box playground' });
  await stage.scrollIntoViewIfNeeded();
  const lid = page.locator('.projects-playground__lid');
  if (isMobile) {
    const before = await page.evaluate(() => scrollY);
    await dragTo(page, lid, true, 0, -100);
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(before + 20);
    await expect(stage).toHaveAttribute('data-open', 'false');
    await stage.scrollIntoViewIfNeeded();
  }
  await lid.click();
  const tile = page.locator('[data-tile="0"]');
  const initial = (await tile.boundingBox())!;
  await dragTo(page, tile, isMobile, -45, -30, true);
  await expect(tile).toHaveAttribute('aria-pressed', 'false');
  await expect(tile).not.toHaveAttribute('data-dragging');
  await expect
    .poll(async () => (await tile.boundingBox())!.x)
    .toBeCloseTo(initial.x, 0);
  for (const width of [320, 390, 640, 641, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await stage.scrollIntoViewIfNeeded();
    const board = (await stage.boundingBox())!;
    const cover = (await lid.boundingBox())!;
    const target = (await tile.boundingBox())!;
    expect(cover.x).toBeGreaterThanOrEqual(board.x);
    expect(cover.y).toBeGreaterThanOrEqual(board.y);
    expect(cover.x + cover.width).toBeLessThanOrEqual(board.x + board.width);
    expect(cover.y + cover.height).toBeLessThanOrEqual(board.y + board.height);
    expect(target.width).toBeGreaterThanOrEqual(44);
    expect(target.height).toBeGreaterThanOrEqual(44);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
