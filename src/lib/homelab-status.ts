export interface HomelabService {
  name: string;
  category: string;
  description: string;
  access: string;
  status: string;
  httpStatus: number | null;
  url: string;
  logo?: string;
  icon: string;
}

export interface HomelabSnapshot {
  checkedAt: string;
  services: HomelabService[];
}

export function parseHomelabSnapshot(value: unknown): HomelabSnapshot {
  if (!value || typeof value !== 'object') throw new Error('Invalid snapshot');
  const snapshot = value as Record<string, unknown>;
  if (
    typeof snapshot.checkedAt !== 'string' ||
    !Number.isFinite(Date.parse(snapshot.checkedAt)) ||
    !Array.isArray(snapshot.services) ||
    snapshot.services.length === 0
  ) {
    throw new Error('Invalid snapshot');
  }
  const services = snapshot.services.map((entry: unknown) => {
    if (!entry || typeof entry !== 'object') throw new Error('Invalid service');
    const service = entry as Record<string, unknown>;
    for (const key of [
      'name',
      'category',
      'description',
      'access',
      'status',
      'url',
    ]) {
      if (typeof service[key] !== 'string') throw new Error('Invalid service');
    }
    const url = new URL(service.url as string);
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      url.username ||
      url.password
    ) {
      throw new Error('Invalid service URL');
    }
    const logo = typeof service.logo === 'string' ? service.logo : undefined;
    if (logo && !isDashboardLogo(logo)) throw new Error('Invalid service logo');
    if (
      service.httpStatus !== null &&
      (!Number.isInteger(service.httpStatus) ||
        (service.httpStatus as number) < 100 ||
        (service.httpStatus as number) > 599)
    ) {
      throw new Error('Invalid HTTP status');
    }
    return {
      name: service.name as string,
      category: service.category as string,
      description: service.description as string,
      access: service.access as string,
      status: service.status as string,
      httpStatus: service.httpStatus as number | null,
      url: url.href,
      logo,
      icon:
        typeof service.icon === 'string'
          ? service.icon
          : (service.name as string).slice(0, 2).toUpperCase(),
    };
  });
  return { checkedAt: snapshot.checkedAt, services };
}

function isDashboardLogo(value: string) {
  const url = new URL(value, 'https://homelab.xsooi.com');
  return (
    url.origin === 'https://homelab.xsooi.com' &&
    url.pathname.startsWith('/logos/')
  );
}

// Logo paths live in the dashboard markup, while its JSON feed supplies statuses.
export function dashboardLogos(html: string): Map<string, string> {
  const logos = new Map<string, string>();
  for (const article of html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)) {
    const address = article[0].match(/\bdata-url="([^"]+)"/)?.[1];
    const image = article[0].match(/<img\b[^>]*\bsrc="([^"]+)"/)?.[1];
    if (!address || !image) continue;
    try {
      const logo = new URL(image, 'https://homelab.xsooi.com');
      if (isDashboardLogo(logo.href))
        logos.set(new URL(address).href, logo.href);
    } catch {
      // A missing logo must not hide a service's status.
    }
  }
  return logos;
}

export function isResponding(service: HomelabService) {
  const code = service.httpStatus;
  return (
    code !== null &&
    ((code >= 200 && code < 400) || code === 401 || code === 403)
  );
}
