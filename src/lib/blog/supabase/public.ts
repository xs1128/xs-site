import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

/**
 * Cookieless Supabase client for public, read-only data.
 *
 * Unlike the cookie-based server client, this does NOT call `cookies()`, so
 * routes that use it stay statically renderable (SSG/ISR). All reads go through
 * the anon key and are gated by RLS, exactly what a public blog needs.
 *
 * Wrapped in React `cache()` so the client is created once per server request.
 */
export const getPublicClient = cache(() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.',
    );
  }

  return createSupabaseClient<import('@/types/database').Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
});
