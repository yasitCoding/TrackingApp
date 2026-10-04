"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { todayISO } from "@/lib/dates";
import { DEFAULT_HABITS } from "@/lib/defaults";
import { getHabits, isMissingTable, SCHEMA_MESSAGE } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

function revalidateTracker(habitId?: string) {
  revalidatePath("/");
  if (habitId) revalidatePath(`/habits/${habitId}`);
}

async function requireUser() {
  if (!isSupabaseConfigured()) {
    throw new Error("ยังไม่ได้เชื่อม Supabase");
  }
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("ยังไม่ได้เข้าสู่ระบบ");
  }
  return { supabase, user };
}

function cleanName(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
}

function cleanTarget(value: FormDataEntryValue | null) {
  const target = String(value ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
  return target.length > 0 ? target : null;
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("signOut", error);
    throw new Error("ออกจากระบบไม่สำเร็จ");
  }
  redirect("/login");
}

export async function ensureDefaultHabits() {
  const { habits, ready } = await getHabits();
  if (!ready || habits.length > 0) return;

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("habits").insert(
    DEFAULT_HABITS.map((habit) => ({
      ...habit,
      user_id: user.id,
    })),
  );

  if (error && error.code !== "23505") {
    console.error("ensureDefaultHabits", error);
  }
}

export async function setHabitDay(habitId: string, date: string, done: boolean) {
  const { supabase, user } = await requireUser();
  if (!/^[0-9a-f-]{36}$/i.test(habitId) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date > todayISO()) {
    return { ok: false as const, message: "บันทึกได้แค่วันนี้หรือวันที่ผ่านมา" };
  }

  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("id")
    .eq("id", habitId)
    .maybeSingle();

  if (habitError) {
    console.error("setHabitDay habit", habitError);
    if (isMissingTable(habitError)) return { ok: false as const, message: SCHEMA_MESSAGE };
    return { ok: false as const, message: "บันทึกวันนี้ไม่สำเร็จ" };
  }
  if (!habit) return { ok: false as const, message: "ไม่พบรายการนี้" };

  const write = done
    ? supabase.from("day_logs").upsert(
        { user_id: user.id, habit_id: habitId, occurred_on: date, done: true },
        { onConflict: "user_id,habit_id,occurred_on" },
      )
    : supabase.from("day_logs").delete().eq("habit_id", habitId).eq("occurred_on", date);

  const { error } = await write;
  if (error) {
    console.error("setHabitDay", error);
    if (isMissingTable(error)) return { ok: false as const, message: SCHEMA_MESSAGE };
    return { ok: false as const, message: "บันทึกวันนี้ไม่สำเร็จ" };
  }

  revalidateTracker(habitId);
  return { ok: true as const };
}

export async function createHabit(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = cleanName(formData.get("name"));
  const target = cleanTarget(formData.get("target"));
  if (!name) return { ok: false as const, message: "ใส่ชื่อรายการ" };

  const { habits, ready } = await getHabits();
  if (!ready) return { ok: false as const, message: SCHEMA_MESSAGE };
  const sortOrder = habits.reduce((max, habit) => Math.max(max, habit.sort_order), -1) + 1;

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name,
    target,
    sort_order: sortOrder,
  });

  if (error) {
    console.error("createHabit", error);
    if (error.code === "23505") return { ok: false as const, message: "มีชื่อนี้อยู่แล้ว" };
    if (isMissingTable(error)) return { ok: false as const, message: SCHEMA_MESSAGE };
    return { ok: false as const, message: "เพิ่มรายการไม่สำเร็จ" };
  }

  revalidateTracker();
  return { ok: true as const };
}

export async function updateHabit(id: string, formData: FormData) {
  const { supabase } = await requireUser();
  const name = cleanName(formData.get("name"));
  const target = cleanTarget(formData.get("target"));
  if (!name) return { ok: false as const, message: "ใส่ชื่อรายการ" };

  const { error } = await supabase.from("habits").update({ name, target }).eq("id", id);

  if (error) {
    console.error("updateHabit", error);
    if (error.code === "23505") return { ok: false as const, message: "มีชื่อนี้อยู่แล้ว" };
    return { ok: false as const, message: "แก้รายการไม่สำเร็จ" };
  }

  revalidateTracker(id);
  return { ok: true as const };
}

export async function deleteHabit(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) {
    console.error("deleteHabit", error);
    return { ok: false as const, message: "ลบรายการไม่สำเร็จ" };
  }

  revalidateTracker();
  return { ok: true as const };
}
