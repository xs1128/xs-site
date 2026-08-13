import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resetRateLimits } from '@/lib/rateLimit';

const send = vi.fn().mockResolvedValue({ id: 'sent' });
vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

process.env.RESEND_API_KEY = 'test-key';
const { POST } = await import('./route');

const post = (body: unknown, ip = '1.1.1.1') =>
  POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify(body),
    })
  );

const valid = { name: 'Ada', email: 'ada@example.com', message: 'hi' };

describe('POST /api/contact', () => {
  beforeEach(() => {
    resetRateLimits();
    send.mockClear();
  });

  it('accepts a valid submission', async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
  });

  it('rejects a missing field', async () => {
    expect((await post({ ...valid, message: '' })).status).toBe(400);
  });

  it('rejects a malformed email', async () => {
    expect((await post({ ...valid, email: 'nope' })).status).toBe(400);
  });

  it('rejects an oversized message', async () => {
    expect((await post({ ...valid, message: 'x'.repeat(5001) })).status).toBe(400);
  });

  it('strips CRLF so the subject cannot carry headers', async () => {
    await post({ ...valid, name: 'Ada\r\nBcc: evil@example.com' });
    expect(send.mock.calls[0][0].subject).not.toMatch(/[\r\n]/);
  });

  it('blocks the sixth request from one address', async () => {
    for (let i = 0; i < 5; i++) await post(valid, '2.2.2.2');
    expect((await post(valid, '2.2.2.2')).status).toBe(429);
  });

  it('never leaks provider errors', async () => {
    send.mockRejectedValueOnce(new Error('resend internal detail'));
    const res = await post(valid, '3.3.3.3');
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain('internal detail');
  });
});
