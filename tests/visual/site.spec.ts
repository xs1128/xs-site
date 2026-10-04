import { test, expect, takeSnapshot } from '@chromatic-com/playwright';
import type { Page, TestInfo } from '@playwright/test';
import { mockBlogContent } from './blog-fixtures';

async function snapshot(page: Page, name: string, testInfo: TestInfo) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.effect?.getComputedTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
  await takeSnapshot(page, name, testInfo);
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-01-15T12:00:00Z'));
  await page.route('**/_vercel/**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: '' }),
  );
});

test('Portfolio pages and overlays', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('.name-3d-layer--front')).toHaveText('XinshengOoi');
  await snapshot(page, 'Landing', testInfo);

  await page.locator('.landing-button--about').click();
  await expect(page.locator('.about-content__cards')).toHaveClass(/--visible/);
  await expect(
    page.getByRole('button', { name: 'Open navigation menu' }),
  ).toBeVisible();
  await snapshot(page, 'About', testInfo);

  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const navigation = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(navigation).toBeVisible();
  await snapshot(page, 'Site navigation', testInfo);

  await navigation.getByRole('button', { name: /^CONTACT/ }).click();
  await expect(navigation).not.toBeVisible();
  await page.locator('.spinning-circular-text').click();
  await expect(
    page.getByRole('dialog', { name: 'Get in Touch' }),
  ).toBeVisible();
  await expect(page.locator('.contact-section__circle')).toHaveCSS(
    'pointer-events',
    'auto',
  );
  await page.getByLabel('Name', { exact: true }).fill('Visual test');
  await page
    .getByLabel('Email', { exact: true })
    .fill('visual@example.invalid');
  await page
    .getByLabel('Message', { exact: true })
    .fill('A fixed message for visual review.');
  await snapshot(page, 'Contact form', testInfo);
});

test.describe('Blog', () => {
  // The WebGL scene changes continuously. Its surrounding layout and controls
  // remain in the visual comparison; the canvas gets a separate smoke assertion.
  test.use({ ignoreSelectors: ['canvas'] });

  test('Expanded blog and navigation', async ({ page }, testInfo) => {
    await mockBlogContent(page);
    await page.goto('/blog?expanded=true');
    await expect(
      page.locator('a[href^="/blog/posts/visual-post-"]'),
    ).toHaveCount(4);
    await expect(page.locator('.series-row')).toHaveCount(3);
    await expect(page.locator('.scene-canvas-fade')).toHaveAttribute(
      'data-ready',
      'true',
    );
    await page.waitForFunction(() =>
      [...document.images]
        .filter((image) => image.getAttribute('src')?.includes('og-image'))
        .every((image) => image.complete && image.naturalWidth > 0),
    );
    const canvasWorks = await page
      .locator('canvas')
      .evaluate((canvas: HTMLCanvasElement) => {
        const context =
          canvas.getContext('webgl2') || canvas.getContext('webgl');
        return context !== null && !context.isContextLost() && canvas.width > 0;
      });
    expect(canvasWorks).toBe(true);
    await snapshot(page, 'Expanded blog', testInfo);

    await page
      .locator('button.btn-underline-reverse')
      .filter({ hasText: '☰' })
      .click();
    await expect(
      page.getByRole('dialog', { name: 'Blog navigation' }),
    ).toBeVisible();
    await snapshot(page, 'Blog navigation', testInfo);
  });
});
