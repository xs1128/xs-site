import { test, expect, takeSnapshot } from '@chromatic-com/playwright';

test('Projects panel', async ({ page }, testInfo) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { name: 'Homelab' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Homelab on GitHub/ }),
  ).toHaveAttribute('href', 'https://github.com/xs1128/xs-homelab');
  await expect(page.getByRole('img').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page
        .getByRole('img')
        .first()
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator('figure > div').first()).toHaveCSS(
    'transform',
    'none',
  );
  await takeSnapshot(page, 'Projects — Homelab', testInfo);

  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Home', exact: true }),
  ).toBeFocused();
});

test('Projects follows scroll position and responds to motion preferences', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const artwork = page.locator('figure > div').first();
  await expect(artwork).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await page.evaluate(() => window.scrollTo(0, 150));
  await expect
    .poll(() =>
      artwork.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe('matrix(1, 0, 0, 1, 0, 0)');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(artwork).toHaveCSS('transform', 'none');
  const scenes = page.locator('section[data-kind]');
  for (const scene of await scenes.all()) {
    expect(
      await scene.evaluate((element) => element.getBoundingClientRect().height),
    ).toBeLessThanOrEqual(
      await page.evaluate(() => Math.max(innerHeight, 740)),
    );
  }
  await expect(page.locator('html')).toHaveCSS('overscroll-behavior', 'none');
});

test('Wheel input moves continuously and smoothing cleans up on navigation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  const samples = page.evaluate(
    () =>
      new Promise<number[]>((resolve) => {
        const positions: number[] = [];
        const started = performance.now();
        const sample = () => {
          positions.push(window.scrollY);
          if (performance.now() - started < 900) {
            requestAnimationFrame(sample);
          } else {
            resolve(positions);
          }
        };
        requestAnimationFrame(sample);
      }),
  );
  await page.mouse.move(200, 250);
  await page.mouse.wheel(0, 400);
  const positions = await samples;
  const intermediate = positions.filter((value) => value > 0 && value < 399);
  expect(new Set(intermediate).size).toBeGreaterThan(8);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(400);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
});

test('Homelab tells its story in readable comic panels', async ({
  page,
}, testInfo) => {
  await page.goto('/projects');
  const apps = page.getByRole('region', {
    name: 'One little box. Lots of little helpers.',
  });
  await apps.scrollIntoViewIfNeeded();
  await expect(apps.getByText(/One keeps my photos/)).toBeVisible();
  await takeSnapshot(page, 'Projects — Everyday apps', testInfo);

  const access = page.getByRole('region', {
    name: 'At home. Even when I’m not.',
  });
  await access.scrollIntoViewIfNeeded();
  await expect(access.getByText(/like a special key/)).toBeVisible();
  await takeSnapshot(page, 'Projects — Private access', testInfo);
  await expect(
    page.getByRole('link', { name: 'Explore the homelab' }),
  ).toHaveAttribute('href', 'https://homelab.xsooi.com/');
});

test('Project captions remain inside their frames on tablets and short screens', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/projects');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const caption of await page.locator('figcaption').all()) {
      expect(
        await caption.evaluate((element) => {
          const copy = element.getBoundingClientRect();
          const frame = element.parentElement!.getBoundingClientRect();
          return (
            copy.left >= frame.left &&
            copy.right <= frame.right &&
            copy.bottom <= frame.bottom &&
            element.scrollWidth <= element.clientWidth + 1
          );
        }),
      ).toBe(true);
    }
    if (viewport.height < 740) {
      await expect(page.locator('section[data-kind="apps"] > div')).toHaveCSS(
        'position',
        'relative',
      );
    }
  }
});
