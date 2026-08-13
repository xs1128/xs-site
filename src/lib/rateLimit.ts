const hits = new Map<string, number[]>();

/**
 * Returns true when the caller has exhausted its quota.
 * In-process, so on serverless the limit applies per instance, not globally.
 * Swap the Map for a shared store if that ever matters.
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.set(key, recent);

  if (recent.length >= limit) return true;

  recent.push(now);
  return false;
}

export function resetRateLimits(): void {
  hits.clear();
}
