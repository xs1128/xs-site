export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// NOTE: Hand-maintained to match the public schema used by this read-only blog.
// For a guaranteed-accurate version, regenerate with:
//   npx supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts
export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number;
          title: string;
          slug: string;
          content: string | null;
          excerpt: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          featured_image: string | null;
          tags: string[] | null;
          read_time: number | null;
          author_name: string | null;
          view_count: number;
        };
        Insert: {
          id?: number;
          title: string;
          slug: string;
          content?: string | null;
          excerpt?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          featured_image?: string | null;
          tags?: string[] | null;
          read_time?: number | null;
          author_name?: string | null;
          view_count?: number;
        };
        Update: {
          id?: number;
          title?: string;
          slug?: string;
          content?: string | null;
          excerpt?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          featured_image?: string | null;
          tags?: string[] | null;
          read_time?: number | null;
          author_name?: string | null;
          view_count?: number;
        };
        Relationships: [];
      };
      series: {
        Row: {
          id: number;
          title: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      series_posts: {
        Row: {
          id: number;
          series_id: number;
          post_id: number;
          order_column: number;
        };
        Insert: {
          id?: number;
          series_id: number;
          post_id: number;
          order_column?: number;
        };
        Update: {
          id?: number;
          series_id?: number;
          post_id?: number;
          order_column?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'series_posts_series_id_fkey';
            columns: ['series_id'];
            isOneToOne: false;
            referencedRelation: 'series';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'series_posts_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };
      pictures: {
        Row: {
          id: number;
          url: string | null;
          caption: string | null;
          location: string | null;
          date_taken: string | null;
          order_column: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          url?: string | null;
          caption?: string | null;
          location?: string | null;
          date_taken?: string | null;
          order_column?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          url?: string | null;
          caption?: string | null;
          location?: string | null;
          date_taken?: string | null;
          order_column?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          key: string;
          value: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          key: string;
          value?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          key?: string;
          value?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_post_view: {
        Args: { p_slug: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
