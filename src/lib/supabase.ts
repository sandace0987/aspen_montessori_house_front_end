import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/constants";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables. " +
    "Authentication will not work. Check your .env.local file."
  );
}

/**
 * Singleton Supabase client.
 * Auth state (session, tokens) is managed by the Supabase SDK and persisted
 * in localStorage automatically under the key `sb-*-auth-token`.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "aspen_supabase_session",
  },
});
