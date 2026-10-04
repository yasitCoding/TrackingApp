import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseEnv } from "@/lib/config";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = requireSupabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          console.warn("supabase cookie set skipped in this context", error);
        }
      },
    },
  });
}
