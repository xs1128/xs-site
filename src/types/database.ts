export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          featured_image: string | null
          tags: string[] | null
          read_time: number | null
          author_name: string | null
        }
        Insert: {
          id: number
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          featured_image: string | null
          tags: string[] | null
          read_time: number | null
          author_name: string | null
        }
        Update: {
          id: number
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          featured_image: string | null
          tags: string[] | null
          read_time: number | null
          author_name: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
