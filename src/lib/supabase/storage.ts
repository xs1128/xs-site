import { createClient } from './client'

export async function uploadImage(file: File) {
  const supabase = createClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = fileName

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file)

  if (error) {
    return { url: null, error }
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('blog-images').getPublicUrl(filePath)

  return { url: publicUrl, error: null }
}

export async function deleteImage(url: string) {
  const supabase = createClient()

  // Extract filename from URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/blog-images/filename.ext
  const match = url.match(/\/blog-images\/(.+)$/)
  if (!match) {
    return { error: new Error('Invalid URL format') }
  }

  const filePath = match[1]

  const { error } = await supabase.storage
    .from('blog-images')
    .remove([filePath])

  return { error }
}
