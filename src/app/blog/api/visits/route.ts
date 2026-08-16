import { NextResponse } from 'next/server';

const goatCounterCode = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

// Content blockers filter goatcounter.com as a third party, so the browser asks us instead.
export async function GET() {
  if (!goatCounterCode) {
    return NextResponse.json({ count: null }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://${goatCounterCode}.goatcounter.com/counter/TOTAL.json`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) {
      console.error(`GoatCounter counter returned ${res.status}`);
      return NextResponse.json({ count: null }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ count: data.count });
  } catch (error) {
    console.error('GoatCounter counter fetch failed', error);
    return NextResponse.json({ count: null }, { status: 502 });
  }
}
