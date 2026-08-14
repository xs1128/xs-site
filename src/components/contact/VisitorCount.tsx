'use client';

import { useEffect, useState } from 'react';

// Pageviews on xsooi.com hosts before GoatCounter, per Cloudflare Web Analytics 20 May to 28 Jun 2026.
const HISTORICAL_OFFSET = 570;

/**
 * All-time visit count, GoatCounter's total plus the pre-GoatCounter offset.
 * Reads /api/visits rather than goatcounter.com, which content blockers filter.
 * Renders nothing until the fetch lands, so a counter outage never leaves a gap.
 */
export function VisitorCount() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/visits', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        // count comes back formatted, e.g. "1 088 394" or "441,799"
        if (!data || typeof data.count !== 'string') return;
        const parsed = Number(data.count.replace(/\D/g, ''));
        if (Number.isFinite(parsed)) setTotal(parsed + HISTORICAL_OFFSET);
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  if (total === null) return null;

  return (
    <p className="contact-section__visits">
      {total.toLocaleString('en-US')} visits and counting
    </p>
  );
}
