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

// Update site setting (upsert)
export async function updateSiteSetting(
  key: string,
  value: string,
  description?: string
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('site_settings')
    .upsert(
      {
        key,
        value,
        description: description || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'key',
      }
    )
    .select()
    .single()

  if (error) {
    console.error(`Error updating site setting "${key}":`, error)
    return { data: null, error }
  }

  return { data, error: null }
}

// Update hero image URL
export async function updateHeroImageUrl(imageUrl: string) {
  return updateSiteSetting(
    'hero_image_url',
    imageUrl,
    'URL of the hero image displayed on the landing page'
  )
}

// Get avatar URL
export async function getAvatarUrl(): Promise<string> {
  const url = await getSiteSetting('avatar_url')
  return url || null
}

// Update avatar URL
export async function updateAvatarUrl(imageUrl: string) {
  return updateSiteSetting(
    'avatar_url',
    imageUrl,
    'URL of the avatar/profile picture displayed in the footer'
  )
}
