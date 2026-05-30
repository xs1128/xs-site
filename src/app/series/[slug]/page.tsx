import { notFound } from 'next/navigation'
import { getSeriesBySlug } from '@/lib/supabase/queries'
import SeriesDetailClient from './series-detail-client'
import type { Metadata } from 'next'
import { siteConfig, absoluteUrl } from '@/lib/seo'

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

  if (!seriesData) {
    return { title: 'Series not found' }
  }

  const url = absoluteUrl(`/series/${slug}`)
  const description = seriesData.description || siteConfig.description

  return {
    title: seriesData.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: seriesData.title,
      description,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: seriesData.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seriesData.title,
      description,
      images: [siteConfig.ogImage],
    },
  }
}
