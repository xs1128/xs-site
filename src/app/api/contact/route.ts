import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isRateLimited } from '@/lib/rateLimit';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const LIMITS = { name: 100, email: 200, message: 5000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const asField = (value: unknown): string =>
  typeof value === 'string' ? value.replace(/[\r\n]+/g, ' ').trim() : '';

export async function POST(request: Request) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service unavailable' },
        { status: 503 },
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (isRateLimited(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }

    const name = asField(body.name);
    const email = asField(body.email);
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (
      name.length > LIMITS.name ||
      email.length > LIMITS.email ||
      message.length > LIMITS.message
    ) {
      return NextResponse.json(
        { error: 'Field exceeds maximum length' },
        { status: 400 },
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      );
    }

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'hi@xsooi.com',
      subject: `Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[contact] send failed:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 },
    );
  }
}
