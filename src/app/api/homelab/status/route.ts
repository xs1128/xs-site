import { dashboardLogos, parseHomelabSnapshot } from '@/lib/homelab-status';

export async function GET() {
  try {
    const options = {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    } as const;
    const [response, html] = await Promise.all([
      fetch('https://homelab.xsooi.com/services.json', options),
      fetch('https://homelab.xsooi.com/', options)
        .then((response) => (response.ok ? response.text() : ''))
        .catch(() => ''),
    ]);
    if (!response.ok) throw new Error('Status feed unavailable');
    const snapshot = parseHomelabSnapshot(await response.json());
    const logos = dashboardLogos(html);
    snapshot.services = snapshot.services.map((service) => ({
      ...service,
      logo: logos.get(service.url) ?? service.logo,
    }));
    return Response.json(snapshot, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json(
      { error: 'The homelab status could not be refreshed.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
