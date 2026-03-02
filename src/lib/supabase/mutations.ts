import { createClient } from './client'

// Types
export interface PostInput {
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  published_at: string | null
}

export interface SeriesInput {
  slug: string
  title: string
  description: string | null
}

export interface PictureInput {
  url: string
  caption: string | null
  location: string | null
  date_taken: string | null
  order_column: number | null
}

// ==================== POSTS ====================

export async function createPost(postData: PostInput) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single()
  return { data, error }
}

export async function updatePost(id: number, postData: Partial<PostInput>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deletePost(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  return { error }
}

export async function getPostById(id: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function getAllPosts() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

// ==================== SERIES ====================

export async function createSeries(seriesData: SeriesInput) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('series')
    .insert(seriesData)
    .select()
    .single()
  return { data, error }
}

export async function updateSeries(id: number, seriesData: Partial<SeriesInput>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('series')
    .update(seriesData)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteSeries(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from('series').delete().eq('id', id)
  return { error }
}

export async function getSeriesById(id: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function getAllSeries() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

// ==================== SERIES_POSTS (Junction) ====================

export async function addPostToSeries(
  seriesId: number,
  postId: number,
  order: number
) {
  const supabase = createClient()
  const { error } = await supabase.from('series_posts').insert({
    series_id: seriesId,
    post_id: postId,
    order_column: order,
  })
  return { error }
}

export async function removePostFromSeries(seriesId: number, postId: number) {
  const supabase = createClient()
  const { error } = await supabase
    .from('series_posts')
    .delete()
    .eq('series_id', seriesId)
    .eq('post_id', postId)
  return { error }
}

export async function updateSeriesPostOrder(
  seriesId: number,
  posts: Array<{ post_id: number; order_column: number }>
) {
  const supabase = createClient()
  // Delete existing relationships for this series
  const { error: deleteError } = await supabase
    .from('series_posts')
    .delete()
    .eq('series_id', seriesId)

  if (deleteError) return { error: deleteError }

  // Insert new relationships
  const { error } = await supabase.from('series_posts').insert(
    posts.map(p => ({
      series_id: seriesId,
      post_id: p.post_id,
      order_column: p.order_column,
    }))
  )
  return { error }
}

export async function getSeriesForPost(postId: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('series_posts')
    .select('series_id')
    .eq('post_id', postId)
    .order('order_column', { ascending: true })
  return { data, error }
}

export async function savePostSeries(
  postId: number,
  seriesIds: number[]
) {
  const supabase = createClient()

  // First, get existing relationships to know what to add/remove
  const { data: existing, error: fetchError } = await supabase
    .from('series_posts')
    .select('series_id')
    .eq('post_id', postId)

  if (fetchError) return { error: fetchError }

  const existingSeriesIds = existing?.map(r => r.series_id) || []

  // Remove series that are no longer selected
  const toRemove = existingSeriesIds.filter(id => !seriesIds.includes(id))
  for (const seriesId of toRemove) {
    await supabase
      .from('series_posts')
      .delete()
      .eq('post_id', postId)
      .eq('series_id', seriesId)
  }

  // Add new series
  const toAdd = seriesIds.filter(id => !existingSeriesIds.includes(id))
  if (toAdd.length > 0) {
    const { error: insertError } = await supabase.from('series_posts').insert(
      toAdd.map((seriesId, index) => ({
        post_id: postId,
        series_id: seriesId,
        order_column: index,
      }))
    )
    if (insertError) return { error: insertError }
  }

  return { error: null }
}

// ==================== PICTURES ====================

export async function createPicture(pictureData: PictureInput) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pictures')
    .insert(pictureData)
    .select()
    .single()
  return { data, error }
}

export async function updatePicture(id: number, pictureData: Partial<PictureInput>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pictures')
    .update(pictureData)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deletePicture(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from('pictures').delete().eq('id', id)
  return { error }
}

export async function getPictureById(id: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pictures')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function getAllPictures() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pictures')
    .select('*')
    .order('order_column', { ascending: true, nullsFirst: false })
  return { data, error }
}
