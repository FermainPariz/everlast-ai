import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client using the service role key.
 * ONLY use this in API route handlers (src/app/api/).
 * The service role bypasses Row Level Security — never expose to client.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
