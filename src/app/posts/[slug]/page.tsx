import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getPostBySlug, getRelatedPosts, getAllPostSlugs } from '@/lib/supabase/queries'
import { extractHeadings, calculateReadTime } from '@/lib/utils/post'
import type { Metadata } from 'next'
import PostDetailClient from './post-detail-client'
import type { Heading } from '@/types/post'
import type { Post, SeriesDetail } from '@/types/post'
import { siteConfig, absoluteUrl } from '@/lib/seo'

// ISR: posts render statically and re-validate hourly.
export const revalidate = 3600

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Pre-render known posts at build; unknown slugs render on-demand then cache.
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return (slugs ?? []).map((p) => ({ slug: p.slug }))
}

async function PostDataFetcher({ slug }: { slug: string }) {
  // Fetch post with series data
  const postData = await getPostBySlug(slug)

  if (!postData) {
    notFound()
  }

  // Extract post data from the combined response
  const { series, ...post } = postData as any

  // Fetch related posts
  const relatedPosts = await getRelatedPosts(
    slug,
    post.tags || [],
    5
  )

  // Extract headings for TOC
  const headings: Heading[] = post.content ? extractHeadings(post.content) : []

  // Calculate read time if not set
  const readTime = post.read_time || calculateReadTime(post.content || '')

  // Prepare series data
  const seriesData: SeriesDetail[] = series?.map((s: any) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    description: s.description,
    posts: [],
  })) || []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || siteConfig.description,
    image: post.featured_image ? [absoluteUrl(post.featured_image)] : [absoluteUrl(siteConfig.ogImage)],
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: { '@type': 'Person', name: post.author_name || siteConfig.author },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    keywords: (post.tags || []).join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/posts/${slug}`) },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostDetailClient
        post={{
          ...post,
          read_time: readTime,
          date: post.published_at || post.created_at,
          summary: post.excerpt || '',
        }}
        seriesData={seriesData}
        headings={headings}
        relatedPosts={relatedPosts}
      />
    </>
  )
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params

  const emptyPost: Post = {
    id: 0,
    title: '',
    slug: '',
    content: '',
    author_name: '',
    tags: [],
    read_time: undefined,
    featured_image: undefined,
    summary: '',
    date: '',
  }

  return (
    <Suspense fallback={<PostDetailClient post={emptyPost} seriesData={[]} headings={[]} relatedPosts={[]} />}>
      <PostDataFetcher slug={slug} />
    </Suspense>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  // Reuses the cached query — no extra DB round-trip beyond the page render.
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: 'Post not found' }
  }

  const url = absoluteUrl(`/posts/${slug}`)
  const description = post.excerpt || siteConfig.description
  const ogImage = post.featured_image || siteConfig.ogImage

  return {
    title: post.title,
    description,
    keywords: post.tags ?? undefined,
    authors: post.author_name ? [{ name: post.author_name }] : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      siteName: siteConfig.name,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      authors: post.author_name ? [post.author_name] : undefined,
      tags: post.tags ?? undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
    },
  }
}
