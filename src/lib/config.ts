export function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

export function supabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  );
}

export function isSupabaseConfigured() {
  return supabaseUrl().startsWith("http") && supabaseKey().length > 20;
}

export function requireSupabaseEnv() {
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) {
    throw new Error("ยังไม่ได้ตั้ง NEXT_PUBLIC_SUPABASE_URL และกุญแจ Publishable");
  }
  return { url, key };
}
