import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { DayLog, Habit } from "@/lib/types";

export const SCHEMA_MESSAGE =
  "ยังไม่ได้สร้างตาราง — รัน supabase/schema.sql ใน SQL Editor แล้วรีเฟรช";

export function isMissingTable(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /habits|day_logs|schema cache/i.test(error.message ?? "")
  );
}

function mapHabit(row: {
  id: string;
  user_id: string;
  name: string;
  target: string | null;
  sort_order: number;
  created_at: string;
}): Habit {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    target: row.target?.trim() ? row.target.trim() : null,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

function mapLog(row: {
  id: string;
  user_id: string;
  habit_id: string;
  occurred_on: string;
  done: boolean;
  created_at: string;
}): DayLog {
  return {
    id: row.id,
    user_id: row.user_id,
    habit_id: row.habit_id,
    occurred_on: row.occurred_on,
    done: row.done === true,
    created_at: row.created_at,
  };
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("getCurrentUser", error);
    return null;
  }
  return user;
}

export async function getHabits(): Promise<{ habits: Habit[]; ready: boolean }> {
  if (!isSupabaseConfigured()) return { habits: [], ready: false };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .order("sort_order")
    .order("created_at");

  if (error) {
    if (isMissingTable(error)) return { habits: [], ready: false };
    console.error("getHabits", error);
    throw new Error("โหลดนิสัยไม่สำเร็จ");
  }

  return { ready: true, habits: (data ?? []).map(mapHabit) };
}

export async function getHabit(id: string): Promise<{ habit: Habit | null; ready: boolean }> {
  if (!isSupabaseConfigured()) return { habit: null, ready: false };
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { habit: null, ready: true };

  const supabase = await createClient();
  const { data, error } = await supabase.from("habits").select("*").eq("id", id).maybeSingle();

  if (error) {
    if (isMissingTable(error)) return { habit: null, ready: false };
    console.error("getHabit", error);
    throw new Error("โหลดรายการไม่สำเร็จ");
  }

  return { ready: true, habit: data ? mapHabit(data) : null };
}

export async function getLogs(
  filter: { from: string; to: string; habitId?: string } | { date: string },
): Promise<{ logs: DayLog[]; ready: boolean }> {
  if (!isSupabaseConfigured()) return { logs: [], ready: false };
  const supabase = await createClient();
  const base = supabase.from("day_logs").select("*");
  const ranged =
    "date" in filter
      ? base.eq("occurred_on", filter.date)
      : base.gte("occurred_on", filter.from).lt("occurred_on", filter.to);
  const scoped = "habitId" in filter && filter.habitId ? ranged.eq("habit_id", filter.habitId) : ranged;
  const { data, error } = await scoped.order("occurred_on", { ascending: true });

  if (error) {
    if (isMissingTable(error)) return { logs: [], ready: false };
    console.error("getLogs", error);
    throw new Error("โหลดวันที่บันทึกไม่สำเร็จ");
  }

  return { ready: true, logs: (data ?? []).map(mapLog) };
}
