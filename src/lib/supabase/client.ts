'use client';

import { createClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client using the anon key.
 * Safe to use in React components — anon key is read-only under RLS.
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(url, key);
}
