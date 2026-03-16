import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getPostBySlug, getRelatedPosts } from '@/lib/supabase/queries'
import { extractHeadings, calculateReadTime } from '@/lib/utils/post'
import type { Metadata } from 'next'
import PostDetailClient from './post-detail-client'
import type { Heading } from '@/types/post'
import type { Post, SeriesDetail } from '@/types/post'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function PostDataFetcher({ slug }: { slug: string }) {
  const supabase = await createClient()

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

  return (
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
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .single()

  return {
    title: post?.title || 'Post',
    description: post?.excerpt || '',
  }
}
