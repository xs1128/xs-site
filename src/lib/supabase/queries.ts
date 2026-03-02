import { createClient } from './server'

export async function getRecentPosts(limit = 5) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data
}

export async function getFeaturedSeries(limit = 3) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('series')
    .select('*, posts(*)')
    .limit(limit)

  if (error) {
    console.error('Error fetching series:', error)
    return []
  }

  return data
}

export async function getPictures() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pictures')
    .select('*')
    .order('order_column', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching pictures:', error)
    return []
  }

  return data
}
