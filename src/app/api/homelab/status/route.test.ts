import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const snapshot = {
  checkedAt: '2026-10-11T06:33:32Z',
  services: [
    {
      name: 'Photos',
      category: 'Media',
      description: 'My photo library.',
      access: 'Tailscale',
      status: 'Sign-in required',
      httpStatus: 401,
      url: 'https://private.example.com/',
      checkMethod: 'Private forwarding path',
    },
  ],
};

beforeEach(() => vi.stubGlobal('fetch', vi.fn()));

describe('Homelab status feed', () => {
  it('returns service links and logos from the dashboard with the real snapshot', async () => {
    vi.mocked(fetch).mockImplementation(async (input) =>
      String(input).endsWith('/services.json')
        ? Response.json(snapshot)
        : new Response(
            '<article data-url="https://private.example.com/"><img src="/logos/immich.svg"></article>',
          ),
    );
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(body.checkedAt).toBe(snapshot.checkedAt);
    expect(body.services[0].httpStatus).toBe(401);
    expect(body.services[0].url).toBe('https://private.example.com/');
    expect(body.services[0].logo).toBe(
      'https://homelab.xsooi.com/logos/immich.svg',
    );
    expect(body.services[0]).not.toHaveProperty('checkMethod');
    expect(fetch).toHaveBeenCalledWith(
      'https://homelab.xsooi.com/services.json',
      expect.objectContaining({
        cache: 'no-store',
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it.each([
    { checkedAt: 'not a date', services: snapshot.services },
    { ...snapshot, services: [{ ...snapshot.services[0], httpStatus: '200' }] },
    { ...snapshot, services: [{ ...snapshot.services[0], name: null }] },
    {
      ...snapshot,
      services: [{ ...snapshot.services[0], url: 'javascript:alert(1)' }],
    },
  ])(
    'rejects malformed snapshots rather than inventing a healthy status',
    async (value) => {
      vi.mocked(fetch).mockResolvedValue(Response.json(value));
      expect((await GET()).status).toBe(502);
    },
  );

  it('reports an unavailable feed without exposing upstream errors', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('private diagnostic'));
    const response = await GET();
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: 'The homelab status could not be refreshed.',
    });
  });

  it('keeps service links and statuses when the logo directory is unavailable', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      if (String(input).endsWith('/services.json'))
        return Response.json(snapshot);
      throw new Error('Logo directory unavailable');
    });
    const response = await GET();
    expect(response.status).toBe(200);
    expect((await response.json()).services[0]).toMatchObject({
      url: 'https://private.example.com/',
      icon: 'PH',
    });
  });
});
