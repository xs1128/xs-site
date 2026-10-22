import { test, expect, takeSnapshot } from '@chromatic-com/playwright';
import type { Locator } from '@playwright/test';

function partPose(part: Locator) {
  return part.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return {
      x: matrix.e,
      y: matrix.f,
      angle: (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI,
    };
  });
}

test('Projects panel', async ({ page }, testInfo) => {
  await page.goto('/projects/homelab');
  await expect(
    page.getByRole('heading', { name: /^Homelab\.?$/, level: 2 }),
  ).toBeVisible();
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
        .evaluate((image) =>
          image instanceof HTMLImageElement
            ? image.naturalWidth
            : image.getBoundingClientRect().width,
        ),
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
    page.getByRole('link', { name: 'All projects', exact: true }),
  ).toBeFocused();
});

test('Projects follows scroll position and responds to motion preferences', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects/homelab');
  const artwork = page.locator('figure > div').first();
  await expect(artwork).toBeVisible();
  await expect(artwork).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await page
    .locator('section[data-kind="access"]')
    .evaluate((element) =>
      window.scrollTo(0, element.getBoundingClientRect().top + scrollY + 150),
    );
  await expect
    .poll(() =>
      artwork.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe('matrix(1, 0, 0, 1, 0, 0)');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(artwork).toHaveCSS('transform', 'none');
  const scenes = page.locator('section[data-kind]:not([data-kind="status"])');
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
  await page.goto('/projects/homelab');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await expect(page.locator('section[data-kind="access"]')).toBeVisible();
  await expect(page.locator('section[data-kind="access"] > div')).toHaveCSS(
    'position',
    'sticky',
  );
  await page.evaluate(() => document.fonts.ready);
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
  await page.getByRole('link', { name: 'All projects', exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.getByRole('link', { name: 'Portfolio', exact: true }).click();
  await expect(page).toHaveURL('/');
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
});

test('Homelab tells its story in readable comic panels', async ({
  page,
}, testInfo) => {
  await page.goto('/projects/homelab');
  await expect(
    page.locator('section[data-kind="intro"], section[data-kind="apps"]'),
  ).toHaveCount(0);
  await expect(page.locator('section[data-kind="access"]')).toHaveCount(1);

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

test('The whole illustration frame enters and recedes without spinning the artwork', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects/homelab');
  const scene = page.locator('section[data-kind="access"]');
  await expect(scene).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const start = await scene.evaluate(
    (element) => element.getBoundingClientRect().top + scrollY,
  );
  const frame = scene.locator('figure');
  await page.evaluate((top) => window.scrollTo(0, top), start - 400);
  await expect(frame).not.toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await expect(frame).toHaveCSS('opacity', '1');
  await page.evaluate((top) => window.scrollTo(0, top), start + 700);
  await expect(frame).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  const artwork = await scene.locator('figure > div').evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return { b: matrix.b, c: matrix.c };
  });
  expect(artwork).toEqual({ b: 0, c: 0 });
  await page.evaluate((top) => window.scrollTo(0, top), start + 1300);
  await expect
    .poll(() =>
      scene
        .locator(':scope > div')
        .evaluate((element) => Number(getComputedStyle(element).opacity)),
    )
    .toBe(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(scene.locator(':scope > div')).toHaveCSS('opacity', '1');
  await expect(frame).toHaveCSS('transform', 'none');
});

test('The Mac mini opens into separate physical layers and reassembles with scroll', async ({
  page,
}) => {
  if (page.viewportSize()!.width > 640)
    await page.setViewportSize({ width: 1280, height: 720 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const path of ['/projects/homelab', '/projects']) {
    await page.goto(path);
    if (path === '/projects')
      await page
        .getByRole('button', { name: 'Explore Homelab', exact: true })
        .click();
    const scene = page.locator('section[data-kind="access"]');
    await expect(scene).toBeVisible();
    await expect(scene.locator(':scope > div')).toHaveCSS('position', 'sticky');
    await page.evaluate(() => document.fonts.ready);
    const geometry = await scene.evaluate((element) => ({
      start: element.getBoundingClientRect().top + scrollY,
      travel: element.clientHeight - element.firstElementChild!.clientHeight,
    }));
    const drawing = scene.locator('svg:visible');
    const lid = drawing.locator('[data-part="lid"]');
    const board = drawing.locator('[data-part="internals"]');
    const chassis = drawing.locator('[data-part="chassis"]');
    const cooling = drawing.locator('[data-part="cooling"]');
    const power = drawing.locator('[data-part="power"]');
    expect(geometry.travel).toBeGreaterThan(page.viewportSize()!.height * 2);
    await page.evaluate((top) => window.scrollTo(0, top), geometry.start);
    await expect(board).toHaveCSS('opacity', '1');
    await expect(board).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await page.evaluate(
      (top) => window.scrollTo(0, top),
      geometry.start + geometry.travel * 0.5,
    );
    await expect.poll(async () => (await partPose(lid)).y).toBeLessThan(-220);
    await expect(board).toHaveCSS('opacity', '1');
    await expect
      .poll(async () => (await partPose(chassis)).y)
      .toBeGreaterThan(40);
    await expect
      .poll(async () => (await partPose(cooling)).y)
      .toBeGreaterThan(10);
    await expect.poll(async () => (await partPose(power)).y).toBeLessThan(-140);
    for (const part of [lid, board, chassis, cooling, power]) {
      const angle = Math.abs((await partPose(part)).angle);
      expect(angle).toBeGreaterThan(1);
      expect(angle).toBeLessThanOrEqual(5);
    }
    const opened = await partPose(lid);
    await page.screenshot({
      path: `/tmp/mac-mini-open-${page.viewportSize()!.width}.png`,
    });
    await page.evaluate(
      (top) => window.scrollTo(0, top),
      geometry.start + geometry.travel * 0.225,
    );
    await expect
      .poll(async () => (await partPose(lid)).angle)
      .toBeCloseTo(opened.angle / 2, 1);
    const midway = await partPose(lid);
    expect(Math.abs(midway.x - opened.x / 2)).toBeGreaterThan(2);
    await page.evaluate(
      (top) => window.scrollTo(0, top),
      geometry.start + geometry.travel * 0.8,
    );
    await expect
      .poll(async () => (await partPose(lid)).x)
      .toBeCloseTo(midway.x, 0);
    await page.evaluate(
      (top) => window.scrollTo(0, top),
      geometry.start + geometry.travel,
    );
    await expect(board).toHaveCSS('opacity', '1');
    await expect(lid).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await expect(cooling).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await page.evaluate(
      (top) => window.scrollTo(0, top),
      geometry.start + geometry.travel * 0.5,
    );
    await expect(board).toHaveCSS('opacity', '1');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(lid).toHaveCSS('transform', 'none');
    await expect(board).toHaveCSS('opacity', '1');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
});

test('The machine finishes reassembling while visible on short screens', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const viewport of [
    { width: 844, height: 390 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    for (const path of ['/projects/homelab', '/projects']) {
      await page.goto(path);
      if (path === '/projects')
        await page
          .getByRole('button', { name: 'Explore Homelab', exact: true })
          .click();
      const scene = page.locator('section[data-kind="access"]');
      await expect(scene).toBeVisible();
      await expect(scene.locator(':scope > div')).toHaveCSS(
        'position',
        'relative',
      );
      await page.evaluate(() => document.fonts.ready);
      const image = scene.locator('figure > div');
      const geometry = await image.evaluate((element) => ({
        start: element.getBoundingClientRect().top + scrollY - innerHeight,
        travel: Math.max(innerHeight, element.clientHeight),
      }));
      const parts = scene.locator('svg:visible [data-part]');
      const lid = scene.locator('svg:visible [data-part="lid"]');
      for (const progress of [0.64, 0.98]) {
        await page.evaluate(
          (top) => window.scrollTo(0, top),
          geometry.start + geometry.travel * progress,
        );
        await expect
          .poll(() =>
            lid.evaluate(
              (element) =>
                new DOMMatrixReadOnly(getComputedStyle(element).transform).f,
            ),
          )
          .toBeCloseTo(
            progress === 0.64 ? -230 * Math.cos((4 * Math.PI) / 180) : 0,
            0,
          );
        for (const part of await parts.all()) {
          const bounds = await part.boundingBox();
          expect(bounds!.y).toBeGreaterThanOrEqual(0);
          expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(
            viewport.height,
          );
        }
      }
    }
  }
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
    await page.goto('/projects/homelab');
    await expect(page.locator('section[data-kind="access"]')).toBeVisible();
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
    if (viewport.height < 600) {
      await expect(page.locator('section[data-kind="access"] > div')).toHaveCSS(
        'position',
        'relative',
      );
    }
  }
});
