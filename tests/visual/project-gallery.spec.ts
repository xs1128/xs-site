import { createHash } from 'node:crypto';
import { test, expect, type Page } from '@playwright/test';

async function sculptureImage(page: Page) {
  const pixels = await page.locator('canvas').screenshot();
  return createHash('sha256').update(pixels).digest('hex');
}

async function sculptureWeight(page: Page, index: number) {
  return page.locator('canvas').evaluate((canvas: HTMLCanvasElement, index) => {
    const gl = canvas.getContext('webgl')!;
    const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
    return gl.getUniform(program, gl.getUniformLocation(program, 'weights')!)[
      index
    ];
  }, index);
}

test('Gallery expands labelled works in place and preserves the Homelab story', async ({
  page,
}) => {
  let statusRequests = 0;
  page.on('request', (request) => {
    if (request.url().includes('/api/homelab/status')) statusRequests++;
  });
  await page.goto('/projects');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Projects.' }),
  ).toBeVisible();
  const github = page.getByRole('link', {
    name: 'GitHub profile (opens in a new tab)',
  });
  await expect(github).toHaveAttribute('href', 'https://github.com/xs1128');
  await expect(github.locator('svg')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Open navigation menu' }),
  ).toBeVisible();
  await expect(page.locator('canvas')).toHaveAttribute('data-ready', 'true');
  expect(statusRequests).toBe(0);
  await page.screenshot({
    path: `/tmp/projects-gallery-${page.viewportSize()!.width}.png`,
  });
  const project = page.getByRole('button', {
    name: 'Explore Homelab',
    exact: true,
  });
  await project.scrollIntoViewIfNeeded();
  await expect(project.locator('img')).toHaveJSProperty('complete', true);
  await page.screenshot({
    path: `/tmp/projects-gallery-cover-${page.viewportSize()!.width}.png`,
  });
  await project.click();
  await expect(page).toHaveURL('/projects');
  await expect(project).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('section[data-kind="access"]')).toBeVisible();
  await expect(page.locator('#homelab-status')).toHaveCount(1);
  await page.getByRole('button', { name: 'Close Homelab' }).click();
  await expect(page.locator('section[data-kind="access"]')).toHaveCount(0);
  await expect(project).toBeFocused();
  for (const title of ['NTHU Confession', 'Portfolio & Blog']) {
    const trigger = page.getByRole('button', {
      name: `Explore ${title}`,
      exact: true,
    });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const details = page.getByRole('region', {
      name: `${title} details`,
      exact: true,
    });
    await expect(
      details.getByText('What I built', { exact: true }),
    ).toBeVisible();
    await expect(details.locator('.projects-work__label')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  }
  await expect(page).toHaveURL('/projects');
});

test('Hero controls fit on laptop screens', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 1365, height: 819 },
    { width: 1920, height: 600 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/projects');
    const controls = await page
      .locator('.projects-sculpture__controls')
      .boundingBox();
    expect(controls!.y + controls!.height).toBeLessThanOrEqual(viewport.height);
    const title = await page.getByRole('heading', { level: 1 }).boundingBox();
    const copy = await page.locator('.projects-hero__copy').boundingBox();
    expect(title!.y + title!.height).toBeLessThan(copy!.y);
  }
});

test('Explore scrolls smoothly to the gallery and respects reduced motion', async ({
  page,
  isMobile,
}) => {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/projects');
    const target = await page
      .locator('#selected-work')
      .evaluate((element) =>
        Math.round(
          element.getBoundingClientRect().top +
            scrollY -
            parseFloat(getComputedStyle(element).scrollMarginTop),
        ),
      );
    const samples = page.evaluate(
      () =>
        new Promise<number[]>((resolve) => {
          const positions: number[] = [];
          const started = performance.now();
          const sample = () => {
            positions.push(scrollY);
            if (performance.now() - started < 1000)
              requestAnimationFrame(sample);
            else resolve(positions);
          };
          requestAnimationFrame(sample);
        }),
    );
    const explore = page.getByRole('link', { name: 'Explore the work' });
    if (isMobile) await explore.tap();
    else await explore.click();
    const positions = await samples;
    const intermediate = positions.filter(
      (value) => value > 1 && value < target - 1,
    );
    expect(new Set(intermediate).size).toBeGreaterThanOrEqual(
      reducedMotion === 'reduce' ? 0 : 8,
    );
    if (reducedMotion === 'reduce') expect(intermediate).toHaveLength(0);
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeCloseTo(target, 0);
  }
});

test('Gallery keeps titles sharp, animates closing, and accepts interrupted transitions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  await page.evaluate(() => {
    Reflect.set(window, 'galleryTransitions', []);
    document
      .querySelector('.projects-details-reveal')!
      .addEventListener('transitionrun', (event) => {
        if ((event as TransitionEvent).propertyName === 'grid-template-rows')
          Reflect.get(window, 'galleryTransitions').push(performance.now());
      });
  });
  const cover = page.getByRole('button', {
    name: 'Explore Portfolio & Blog',
    exact: true,
  });
  await cover.scrollIntoViewIfNeeded();
  const title = cover.locator('.projects-cover__title');
  const width = await title.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  await cover.click();
  await expect
    .poll(() =>
      page.evaluate(() => Reflect.get(window, 'galleryTransitions').length),
    )
    .toBe(1);
  expect(
    await title.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeCloseTo(width, 0);
  const reveal = page.locator('.projects-details-reveal');
  await expect
    .poll(() => reveal.evaluate((element) => element.getAnimations().length))
    .toBe(0);
  await page
    .getByRole('button', { name: 'Close Portfolio & Blog', exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(() => Reflect.get(window, 'galleryTransitions').length),
    )
    .toBe(2);
  await expect(page.locator('#details-portfolio')).toHaveCount(0);
  await expect(cover).toHaveAttribute('aria-expanded', 'false');
  await expect(cover).toBeFocused();

  await cover.click();
  const other = page.getByRole('button', {
    name: 'Explore NTHU Confession',
    exact: true,
  });
  await other.click();
  await expect(other).toHaveAttribute('aria-expanded', 'true');
  await expect(cover).toHaveAttribute('aria-expanded', 'false');
  await expect(
    page.getByRole('region', { name: 'NTHU Confession details', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(other).toHaveAttribute('aria-expanded', 'false');
  await expect(other).toBeFocused();
});

test('Covers follow the cursor, settle at rest, and disable tilt for touch and reduced motion', async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const card = page.getByRole('button', {
    name: 'Explore NTHU Confession',
    exact: true,
  });
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAccessibleDescription(
    'Interface design & full-stack development',
  );
  for (const label of await page.locator('.projects-cover__topline').all()) {
    await expect(label).not.toContainText(/\d/);
  }
  const surface = card.locator('..');
  const bounds = (await surface.boundingBox())!;
  const corner = {
    x: bounds.x + bounds.width * 0.8,
    y: bounds.y + bounds.height * 0.3,
  };
  const transform = () => card.evaluate((element) => element.style.transform);
  await surface.dispatchEvent('pointermove', {
    clientX: corner.x,
    clientY: corner.y,
    pointerType: 'mouse',
  });
  if (isMobile) {
    expect(await transform()).toBe('');
    await card.tap();
    await expect(card).toHaveAttribute('aria-expanded', 'true');
    expect(await transform()).toBe('');
    return;
  }
  await expect.poll(transform).toContain('rotateX');
  await expect
    .poll(async () => {
      const before = await transform();
      await page.waitForTimeout(200);
      return before === (await transform());
    })
    .toBe(true);
  const first = await transform();
  const angles = Array.from(
    first.matchAll(/rotate[XY]\((-?[\d.]+)deg\)/g),
    (match) => Math.abs(Number(match[1])),
  );
  expect(angles[0]).toBeLessThanOrEqual(1.51);
  expect(angles[1]).toBeLessThanOrEqual(2.01);
  await page.mouse.move(
    bounds.x + bounds.width * 0.2,
    bounds.y + bounds.height * 0.7,
  );
  await expect.poll(transform).not.toBe(first);
  await page.mouse.move(0, 0);
  await expect.poll(transform).toBe('');
  await page.mouse.move(corner.x, corner.y);
  await expect.poll(transform).not.toBe('');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(transform).toBe('');
  await page.mouse.move(bounds.x + bounds.width * 0.3, corner.y);
  expect(await transform()).toBe('');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect
    .poll(async () => {
      await page.mouse.move(corner.x - 1, corner.y);
      await page.mouse.move(corner.x, corner.y);
      return transform();
    })
    .not.toBe('');
  await page.mouse.wheel(0, 40);
  await expect.poll(transform).toBe('');
  await page.mouse.move(corner.x - 10, corner.y);
  await expect.poll(transform).not.toBe('');
  await page.keyboard.press('Escape');
  expect(await transform()).toBe('');
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('aria-expanded', 'true');
  expect(await transform()).toBe('');
});

test('Individual project URLs share the gallery details and fit narrow screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  for (const [slug, title] of [
    ['homelab', 'Homelab'],
    ['nthu-confession', 'NTHU Confession'],
    ['portfolio', 'Portfolio & Blog'],
  ]) {
    await page.goto(`/projects/${slug}`);
    await expect(
      page.getByRole('heading', { level: 1, name: `${title}.` }),
    ).toBeVisible();
    const details = page.getByRole('region', {
      name: `${title} details`,
      exact: true,
    });
    await expect(
      details.getByText('What I built', { exact: true }),
    ).toBeVisible();
    await expect(details.locator('.projects-work__label')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test('Gallery shares the full-page menu, traps focus, and locks scrolling', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const trigger = page.getByRole('button', { name: 'Open navigation menu' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveClass(/fullscreen-nav/);
  await expect(
    dialog.getByRole('link', { name: 'ABOUT', exact: true }),
  ).toHaveAttribute('href', '/#about');
  await expect(
    dialog.getByRole('link', { name: 'CONTACT', exact: true }),
  ).toHaveAttribute('href', '/#contact');
  await expect(
    dialog.getByRole('link', { name: 'PROJECTS', exact: true }),
  ).toHaveAttribute('href', '/projects');
  await page.keyboard.press('Shift+Tab');
  await expect(
    dialog.getByRole('link', { name: 'BLOG', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    dialog.getByRole('button', { name: 'Close navigation' }),
  ).toBeFocused();
  const before = await page.evaluate(() => scrollY);
  await page.mouse.move(100, 100);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(before);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.locator('html')).not.toHaveClass(/lenis-stopped/);
  await page.mouse.wheel(0, 200);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(200);

  for (const section of ['ABOUT', 'CONTACT']) {
    await page.goto('/projects');
    await trigger.click();
    await dialog.getByRole('link', { name: section, exact: true }).click();
    await expect(page).toHaveURL(`/#${section.toLowerCase()}`);
    await expect(page.locator(`#${section.toLowerCase()}`)).toBeInViewport();
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  }
});

test('Gallery stays readable and within the viewport on phones and tablets', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 641, height: 720 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
    { width: 1920, height: 720 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/projects');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('canvas')).toHaveAttribute('data-ready', 'true');
    const resolution = await page
      .locator('canvas')
      .evaluate((canvas: HTMLCanvasElement) => ({
        actual: canvas.width,
        expected: Math.floor(
          canvas.getBoundingClientRect().width * devicePixelRatio,
        ),
      }));
    expect(resolution.actual).toBeGreaterThanOrEqual(resolution.expected);
    const panels = await page
      .locator('.projects-cover__link')
      .evaluateAll((elements) =>
        elements.map((element) => {
          const { width, height, top } = element.getBoundingClientRect();
          return { width, height, top };
        }),
      );
    expect(panels).toHaveLength(3);
    for (const panel of panels) {
      expect(panel.height).toBeGreaterThan(panel.width);
      expect(panel.top).toBe(panels[0].top);
    }
    for (const cover of await page.locator('.projects-cover__link').all()) {
      const bounds = await cover.boundingBox();
      const title = await cover.locator('.projects-cover__title').boundingBox();
      const label = await cover
        .locator('.projects-cover__topline')
        .boundingBox();
      expect(title!.y).toBeGreaterThan(label!.y + label!.height);
      expect(title!.y + title!.height).toBeLessThan(bounds!.y + bounds!.height);
      const plus = await cover.locator('.projects-cover__open').boundingBox();
      expect(plus!.x + plus!.width).toBeLessThan(bounds!.x + bounds!.width);
    }
    await expect(
      page.getByRole('button', { name: 'Pause sculpture animation' }),
    ).toBeHidden();
    if (viewport.width <= 640) {
      const stage = await page
        .locator('.projects-sculpture__stage')
        .boundingBox();
      const copy = await page.locator('.projects-hero__copy').boundingBox();
      expect(copy!.y).toBeGreaterThan(stage!.y + stage!.height);
    }
    await page.getByRole('link', { name: 'Explore the work' }).click();
    await expect(
      page.getByRole('heading', { name: 'Selected work', exact: true }),
    ).toBeInViewport();
  }
});

test('Tapping the sculpture randomly changes its shape without treating drags or swipes as taps', async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const sculpture = page.getByRole('button', {
    name: 'Change sculpture shape',
  });
  await expect(sculpture).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Pause sculpture animation' }).click();
  await page.evaluate(() => {
    Math.random = () => 0;
  });
  const bounds = (await sculpture.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  if (isMobile) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y }],
    });
    for (let step = 1; step <= 10; step++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x, y: y - step * 16 }],
      });
      await page.waitForTimeout(16);
    }
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(20);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  } else {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 40, y, { steps: 4 });
    await page.mouse.move(x, y, { steps: 4 });
    await page.mouse.up();
  }
  expect(await sculptureWeight(page, 0)).toBe(1);
  for (const shape of [1, 2, 0]) {
    if (isMobile) await sculpture.tap();
    else await sculpture.click();
    await expect
      .poll(() => sculptureWeight(page, shape), {
        timeout: 800,
        intervals: [16, 32, 50],
      })
      .toBe(1);
    await expect(
      page.getByRole('button', { name: 'Resume sculpture animation' }),
    ).toBeVisible();
  }
  await page.evaluate(() => {
    Math.random = () => 0.999;
  });
  if (isMobile) await sculpture.tap();
  else await sculpture.click();
  await expect.poll(() => sculptureWeight(page, 2)).toBeGreaterThan(0.99);

  await sculpture.focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => sculptureWeight(page, 1)).toBe(1);
  await page.keyboard.press('Space');
  await expect.poll(() => sculptureWeight(page, 0)).toBe(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  if (isMobile) await sculpture.tap();
  else await sculpture.click();
  await expect.poll(() => sculptureWeight(page, 2)).toBe(1);
});

test('A tap morph finishes smoothly even when frames arrive slowly', async ({
  page,
}) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const sculpture = page.getByRole('button', {
    name: 'Change sculpture shape',
  });
  await expect(sculpture).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Pause sculpture animation' }).click();
  await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000);
  await page.evaluate(() => {
    Math.random = () => 0;
  });
  await sculpture.click({ force: true });
  await page.clock.fastForward(100);
  const midway = await sculptureWeight(page, 1);
  expect(midway).toBeGreaterThan(0);
  expect(midway).toBeLessThan(1);
  for (let frame = 0; frame < 5; frame++) await page.clock.fastForward(100);
  expect(await sculptureWeight(page, 1)).toBe(1);
});

test('Sculpture cycles automatically and its two controls support a keyboard and reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  await expect(page.locator('canvas')).toHaveAttribute('data-ready', 'true');
  const controls = page.getByRole('group', {
    name: 'Sculpture controls',
    exact: true,
  });
  await expect(controls.getByRole('button')).toHaveCount(2);
  await expect
    .poll(() => sculptureWeight(page, 1), { timeout: 20000 })
    .toBeGreaterThan(0.2);
  await page.getByRole('button', { name: 'Pause sculpture animation' }).focus();
  await page.keyboard.press('Enter');
  await expect
    .poll(async () => {
      const before = await sculptureImage(page);
      await page.waitForTimeout(150);
      return before === (await sculptureImage(page));
    })
    .toBe(true);

  const restart = page.getByRole('button', {
    name: 'Restart sculpture animation',
  });
  await restart.focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => sculptureWeight(page, 0)).toBeGreaterThan(0.99);
  await expect(
    page.getByRole('button', { name: 'Pause sculpture animation' }),
  ).toBeVisible();
  const moving = await sculptureImage(page);
  await expect.poll(() => sculptureImage(page)).not.toBe(moving);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(
    page.getByRole('button', { name: 'Pause sculpture animation' }),
  ).toBeHidden();
  await expect
    .poll(async () => {
      const before = await sculptureImage(page);
      await page.waitForTimeout(150);
      return before === (await sculptureImage(page));
    })
    .toBe(true);
  const still = await sculptureImage(page);
  await restart.focus();
  await page.keyboard.press('Enter');
  expect(await sculptureImage(page)).toBe(still);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const resumed = await sculptureImage(page);
  await expect.poll(() => sculptureImage(page)).not.toBe(resumed);

  await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
    const extension = canvas
      .getContext('webgl')
      ?.getExtension('WEBGL_lose_context');
    if (!extension) throw new Error('Context loss extension unavailable');
    Reflect.set(window, 'restoreSculptureContext', () =>
      extension.restoreContext(),
    );
    extension.loseContext();
  });
  await expect(page.locator('canvas')).not.toHaveAttribute(
    'data-ready',
    'true',
  );
  await expect(page.locator('.projects-sculpture__fallback')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.projects-sculpture__playback')).toBeHidden();
  await page.evaluate(() => Reflect.get(window, 'restoreSculptureContext')());
  await expect(page.locator('canvas')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('.projects-sculpture__fallback')).toBeHidden();
  const restored = await sculptureImage(page);
  await page.waitForTimeout(150);
  expect(await sculptureImage(page)).toBe(restored);
});

test('Very narrow screens never scroll sideways', async ({ page }) => {
  for (const width of [150, 229]) {
    await page.setViewportSize({ width, height: 700 });
    await page.goto('/projects');
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      )
      .toBe(0);
  }
});
