import { createClient } from './client'

export async function getSiteSetting(key: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) {
    console.error(`Error fetching site setting "${key}":`, error)
    return null
  }

  return data?.value || null
}

export async function getHeroImageUrl(): Promise<string> {
  const url = await getSiteSetting('hero_image_url')
  return url || '/IMG_1953.jpeg' // Fallback to default
}

// Get avatar URL
export async function getAvatarUrl(): Promise<string | null> {
  const url = await getSiteSetting('avatar_url')
  return url || null
}
