import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components (e.g. the admin panel's
 * interactive forms in Phase 5).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
