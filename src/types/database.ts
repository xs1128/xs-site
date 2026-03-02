// Database types for Supabase
// You can regenerate these types by running:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number
          slug: string
          title: string
          content: string | null
          excerpt: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          slug: string
          title: string
          content?: string | null
          excerpt?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          slug?: string
          title?: string
          content?: string | null
          excerpt?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      series: {
        Row: {
          id: number
          slug: string
          title: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          slug: string
          title: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          slug?: string
          title?: string
          description?: string | null
          created_at?: string
        }
      }
      pictures: {
        Row: {
          id: number
          url: string
          caption: string | null
          location: string | null
          date_taken: string | null
          order_column: number | null
          created_at: string
        }
        Insert: {
          id?: number
          url: string
          caption?: string | null
          location?: string | null
          date_taken?: string | null
          order_column?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          url?: string
          caption?: string | null
          location?: string | null
          date_taken?: string | null
          order_column?: number | null
          created_at?: string
        }
      }
      series_posts: {
        Row: {
          id: number
          series_id: number
          post_id: number
          order_column: number | null
        }
        Insert: {
          id?: number
          series_id: number
          post_id: number
          order_column?: number | null
        }
        Update: {
          id?: number
          series_id?: number
          post_id?: number
          order_column?: number | null
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
