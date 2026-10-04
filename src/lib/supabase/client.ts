import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "@/lib/config";

export function createClient() {
  const { url, key } = requireSupabaseEnv();
  return createBrowserClient(url, key);
}
