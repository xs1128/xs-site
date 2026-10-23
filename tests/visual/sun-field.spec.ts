import { test, expect, type Locator } from '@playwright/test';

const beamAngle = (beam: Locator) =>
  beam.evaluate((el) =>
    Number((el as HTMLElement).style.transform.match(/rotate\(([\d.-]+)/)![1]),
  );

test('The beam follows the pointer around the fixed sun', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Needs a hovering pointer');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const frame = page.locator('.projects-sun__frame');
  await frame.scrollIntoViewIfNeeded();
  const beam = frame.locator('[data-beam]');
  // At rest it points straight up at the first note.
  expect(await beamAngle(beam)).toBe(-90);
  const box = (await frame.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.95, box.y + box.height / 2, {
    steps: 4,
  });
  await expect.poll(() => beamAngle(beam)).toBeGreaterThan(-2);
  expect(await beamAngle(beam)).toBeLessThan(2);

  // Reduced motion: the beam jumps instead of sweeping.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.97);
  await expect.poll(() => beamAngle(beam)).toBeCloseTo(90, 0);
});
