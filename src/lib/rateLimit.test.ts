import { describe, it, expect, beforeEach } from 'vitest';
import { isRateLimited, resetRateLimits } from './rateLimit';

describe('isRateLimited', () => {
  beforeEach(resetRateLimits);

  it('allows up to the limit, then blocks', () => {
    const results = Array.from({ length: 4 }, () => isRateLimited('a', 3, 1000));
    expect(results).toEqual([false, false, false, true]);
  });

  it('tracks keys independently', () => {
    isRateLimited('a', 1, 1000);
    expect(isRateLimited('a', 1, 1000)).toBe(true);
    expect(isRateLimited('b', 1, 1000)).toBe(false);
  });

  it('frees the quota once the window passes', async () => {
    expect(isRateLimited('a', 1, 10)).toBe(false);
    expect(isRateLimited('a', 1, 10)).toBe(true);
    await new Promise((r) => setTimeout(r, 20));
    expect(isRateLimited('a', 1, 10)).toBe(false);
  });
});
