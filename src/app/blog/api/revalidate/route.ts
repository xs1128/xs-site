import { createHash, timingSafeEqual } from 'crypto'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const digest = (value: string) => createHash('sha256').update(value).digest()

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  const provided = request.headers.get('x-revalidate-secret')

  if (!secret || !provided || !timingSafeEqual(digest(provided), digest(secret))) {
    return NextResponse.json({ revalidated: false }, { status: 401 })
  }

  revalidatePath('/blog', 'layout')
  revalidatePath('/blog/sitemap.xml')

  return NextResponse.json({ revalidated: true })
}
