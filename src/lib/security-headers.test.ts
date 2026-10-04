import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://project.supabase.co');
  vi.stubEnv('NEXT_PUBLIC_GOATCOUNTER_CODE', 'example');
});

afterEach(() => vi.unstubAllEnvs());

async function readPolicy() {
  const { default: config } = await import('../../next.config');
  const rules = await config.headers!();
  const headers = rules.find((rule) => rule.source === '/:path*')!.headers;
  const csp = headers.find(
    (header) => header.key === 'Content-Security-Policy',
  )!.value;
  const directives = new Map(
    csp.split('; ').map((directive) => {
      const [name, ...sources] = directive.split(' ');
      return [name, sources];
    }),
  );
  return { rules, headers, directives };
}

describe('security headers', () => {
  it('blocks framing, objects, inline handlers, and eval in production', async () => {
    const { headers, directives, rules } = await readPolicy();

    expect(directives.get('frame-ancestors')).toEqual(["'none'"]);
    expect(directives.get('object-src')).toEqual(["'none'"]);
    expect(directives.get('script-src-attr')).toEqual(["'none'"]);
    expect(directives.get('script-src')).not.toContain("'unsafe-eval'");
    expect(directives.get('script-src')).not.toContain('https:');
    expect(headers).toContainEqual({ key: 'X-Frame-Options', value: 'DENY' });
    expect(headers).toContainEqual({
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    });
    expect(
      rules.find((rule) => rule.source === '/.well-known/discord')!.headers,
    ).toContainEqual({
      key: 'Content-Type',
      value: 'text/plain; charset=utf-8',
    });
  });

  it('permits the configured content backend and analytics without a connection wildcard', async () => {
    const { directives } = await readPolicy();
    expect(directives.get('connect-src')).toEqual(
      expect.arrayContaining([
        'https://project.supabase.co',
        'wss://project.supabase.co',
        'https://example.goatcounter.com',
      ]),
    );
    expect(directives.get('connect-src')).not.toContain('*');
    expect(directives.get('connect-src')).not.toContain('https:');
  });

  it('allows development tooling without upgrading local HTTP', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { directives } = await readPolicy();
    expect(directives.get('script-src')).toContain("'unsafe-eval'");
    expect(directives.get('connect-src')).toContain('ws:');
    expect(directives.has('upgrade-insecure-requests')).toBe(false);
  });
});
