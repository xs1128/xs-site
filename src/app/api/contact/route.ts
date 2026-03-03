import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.' },
        { status: 503 }
      );
    }

    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'hi@xsooi.com',
      subject: `Contact from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `.trim(),
      replyTo: email,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
