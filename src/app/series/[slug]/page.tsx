import { notFound } from 'next/navigation'
import { getSeriesBySlug } from '@/lib/supabase/queries'
import SeriesDetailClient from './series-detail-client'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params

  const seriesData = await getSeriesBySlug(slug)

  if (!seriesData) {
    notFound()
  }

  return <SeriesDetailClient series={seriesData} />
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const seriesData = await getSeriesBySlug(slug)

  return {
    title: seriesData?.title || 'Series',
    description: seriesData?.description || '',
  }
}
