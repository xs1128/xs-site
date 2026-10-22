import { test, expect } from '@playwright/test';

function snapshot(checkedAt = new Date().toISOString()) {
  return {
    checkedAt,
    services: [
      {
        name: 'Photos',
        url: 'https://photos.example.com/',
        logo: 'https://homelab.xsooi.com/logos/immich.svg',
        icon: 'PH',
        category: 'Media',
        description: 'A home for my photos.',
        access: 'Tailscale',
        status: 'Responding',
        httpStatus: 200,
      },
      {
        name: 'Documents',
        url: 'https://documents.example.com/',
        logo: 'https://homelab.xsooi.com/logos/paperless-ngx.svg',
        icon: 'DO',
        category: 'Documents & tools',
        description: 'Find paperwork in seconds.',
        access: 'Tailscale',
        status: 'Sign-in required',
        httpStatus: 401,
      },
      {
        name: 'Tools',
        url: 'https://tools.example.com/',
        logo: 'https://homelab.xsooi.com/logos/it-tools.svg',
        icon: 'TO',
        category: 'Development & automation',
        description: 'Useful everyday tools.',
        access: 'Public domain',
        status: 'Responding',
        httpStatus: 200,
      },
      {
        name: 'Monitor',
        url: 'https://monitor.example.com/',
        logo: 'https://homelab.xsooi.com/logos/grafana.svg',
        icon: 'MO',
        category: 'Monitoring',
        description: 'Checks on the little computer.',
        access: 'Tailscale',
        status: 'URL unavailable',
        httpStatus: null,
      },
    ],
  };
}

test('Live status is readable, responsive, and counts sign-in responses', async ({
  page,
}) => {
  await page.route('**/api/homelab/status', (route) =>
    route.fulfill({ json: snapshot() }),
  );
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 768, height: 1024 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/projects/homelab');
    await page.locator('#homelab-status').scrollIntoViewIfNeeded();
    await expect(
      page.getByRole('heading', { name: 'One little box. Very much alive.' }),
    ).toBeVisible();
    await expect(page.getByText('3 / 4')).toBeVisible();
    if (viewport.width <= 640) {
      await page.getByRole('button', { name: 'Show all 4 apps' }).click();
    }
    const service = page.getByRole('link', {
      name: 'Open Photos (requires Tailscale) (opens in a new tab)',
      exact: true,
    });
    await expect(service).toHaveAttribute(
      'href',
      'https://photos.example.com/',
    );
    await expect(service).toHaveAttribute('target', '_blank');
    await expect(
      service.getByRole('img', { name: 'Private service' }),
    ).toBeVisible();
    await expect(
      page
        .getByRole('link', {
          name: 'Open Tools (opens in a new tab)',
          exact: true,
        })
        .getByRole('img', { name: 'Private service' }),
    ).toHaveCount(0);
    await expect(service.locator('img')).toHaveAttribute(
      'src',
      'https://homelab.xsooi.com/logos/immich.svg',
    );
    await expect(page.locator('#homelab-status article a')).toHaveCount(4);
    await expect(page.getByText('Some services need a look.')).toBeVisible();
    await expect(
      page.getByText('Sign-in required', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('URL unavailable', { exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test('Old snapshots and failed refreshes stay clearly marked', async ({
  page,
}) => {
  let unavailable = false;
  await page.route('**/api/homelab/status', (route) =>
    route.fulfill(
      unavailable
        ? { status: 502, json: { error: 'Unavailable' } }
        : { json: snapshot('2000-01-01T00:00:00Z') },
    ),
  );
  await page.goto('/projects/homelab');
  await page.locator('#homelab-status').scrollIntoViewIfNeeded();
  await expect(page.getByText('Showing the last check.')).toBeVisible();
  await expect(
    page.getByText(
      'This check is over 10 minutes old. Current status is unknown.',
    ),
  ).toBeVisible();
  const appsToggle = page.getByRole('button', { name: 'Show all 4 apps' });
  if (await appsToggle.isVisible()) await appsToggle.click();
  await expect(
    page.getByText('Last: sign-in required', { exact: true }),
  ).toBeVisible();
  unavailable = true;
  await page.getByRole('button', { name: 'Refresh status' }).click();
  await expect(
    page.getByText('Couldn’t refresh. These are the last known results.'),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Documents', exact: true }),
  ).toBeVisible();
});

test('An unavailable feed offers a working retry', async ({ page }) => {
  let unavailable = true;
  await page.route('**/api/homelab/status', (route) =>
    route.fulfill(
      unavailable
        ? { status: 502, json: { error: 'Unavailable' } }
        : { json: snapshot() },
    ),
  );
  await page.goto('/projects/homelab');
  await page.locator('#homelab-status').scrollIntoViewIfNeeded();
  await expect(page.getByText('The status feed is unavailable.')).toBeVisible();
  unavailable = false;
  await page.getByRole('button', { name: 'Refresh status' }).click();
  await expect(page.getByText('3 / 4')).toBeVisible();
});

test('Mobile keeps twenty apps collapsed and offers a compact category filter', async ({
  page,
}) => {
  const feed = snapshot();
  feed.services = Array.from({ length: 20 }, (_, index) => ({
    ...feed.services[index % 4],
    name: `${feed.services[index % 4].name} ${index + 1}`,
  }));
  await page.route('**/api/homelab/status', (route) =>
    route.fulfill({ json: feed }),
  );
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/projects/homelab');
    const scene = page.locator('#homelab-status');
    await scene.scrollIntoViewIfNeeded();
    const toggle = scene.getByRole('button', { name: 'Show all 20 apps' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(scene.getByRole('link').first()).toHaveCount(0);
    const collapsedHeight = (await scene.boundingBox())!.height;
    expect(collapsedHeight).toBeLessThan(700);

    await toggle.click();
    const filter = scene.getByRole('combobox', { name: 'Filter homelab apps' });
    await expect(filter).toBeVisible();
    await expect(scene.getByRole('link')).toHaveCount(20);
    expect((await scene.boundingBox())!.height).toBeGreaterThan(
      collapsedHeight + 800,
    );
    await filter.selectOption('Media');
    await expect(scene.getByRole('link')).toHaveCount(5);
    await expect(
      scene.getByRole('heading', { name: 'Photos 1', exact: true }),
    ).toBeVisible();
    await expect(
      scene.getByRole('button', { name: 'Media', exact: true }),
    ).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    await scene.getByRole('button', { name: 'Hide apps' }).click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(scene.getByRole('link')).toHaveCount(0);
    await expect(toggle).toBeFocused();
    await toggle.click();
    await expect(filter).toHaveValue('All apps');
    await expect(scene.getByRole('link')).toHaveCount(20);
  }
});

test('The status panel pins with scrolling and keeps all twenty apps inside its frame', async ({
  page,
}) => {
  const feed = snapshot();
  feed.services = Array.from({ length: 20 }, (_, index) => ({
    ...feed.services[index % 4],
    name: `${feed.services[index % 4].name} ${index + 1}`,
  }));
  await page.route('**/api/homelab/status', (route) =>
    route.fulfill({ json: feed }),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects/homelab');
  const scene = page.locator('#homelab-status');
  await expect(scene.locator('article')).toHaveCount(20);
  await scene.evaluate((element) =>
    window.scrollTo(0, element.getBoundingClientRect().top + scrollY + 250),
  );
  await expect(scene.locator(':scope > div')).toHaveCSS('position', 'sticky');
  expect(
    await scene.evaluate((element) => {
      const frame = element.firstElementChild!
        .firstElementChild! as HTMLElement;
      return frame.scrollHeight <= frame.clientHeight + 1;
    }),
  ).toBe(true);
  await scene.getByRole('button', { name: 'Media', exact: true }).click();
  await expect(scene.locator('article')).toHaveCount(5);
  await scene.getByRole('button', { name: 'All apps', exact: true }).click();
  await expect(scene.locator('article')).toHaveCount(20);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(scene.locator(':scope > div')).toHaveCSS('position', 'relative');
});
