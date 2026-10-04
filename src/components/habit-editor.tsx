"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteHabit, updateHabit } from "@/lib/actions";
import { TextInput } from "@/components/ui";
import type { Habit } from "@/lib/types";

export function HabitEditor({ habit }: { habit: Habit }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [name, setName] = useState(habit.name);
  const [message, setMessage] = useState<string | null>(null);

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    const result = await updateHabit(habit.id, formData);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setEditing(false);
    setMessage(null);
    router.refresh();
  }

  async function onDelete() {
    const result = await deleteHabit(habit.id);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <section className="mt-12 border-t pt-6">
      {editing ? (
        <form onSubmit={onSave} className="space-y-3">
          <TextInput value={name} onChange={(event) => setName(event.target.value)} maxLength={40} />
          <div className="flex gap-4 text-[14px]">
            <button type="submit" className="cursor-pointer rounded-lg px-2 py-1 text-accent transition duration-200 hover:bg-accent-soft hover:text-white">
              บันทึก
            </button>
            <button type="button" onClick={() => setEditing(false)} className="cursor-pointer rounded-lg px-2 py-1 text-mute transition duration-200 hover:bg-white/8 hover:text-white">
              ยกเลิก
            </button>
          </div>
        </form>
      ) : confirm ? (
        <div className="flex flex-wrap items-center gap-4 text-[14px]">
          <p className="text-mute">ลบรายการนี้และวันที่เคยนับด้วย</p>
          <button type="button" onClick={() => setConfirm(false)} className="cursor-pointer rounded-lg px-2 py-1 text-mute transition duration-200 hover:bg-white/8 hover:text-white">
            ยกเลิก
          </button>
          <button type="button" onClick={onDelete} className="cursor-pointer rounded-lg px-2 py-1 text-alert transition duration-200 hover:bg-alert/15 hover:text-white">
            ลบเลย
          </button>
        </div>
      ) : (
        <div className="flex gap-4 text-[14px]">
          <button type="button" onClick={() => setEditing(true)} className="cursor-pointer rounded-lg px-2 py-1 text-ink transition duration-200 hover:bg-white/8 hover:text-white">
            แก้ชื่อ
          </button>
          <button type="button" onClick={() => setConfirm(true)} className="cursor-pointer rounded-lg px-2 py-1 text-alert transition duration-200 hover:bg-alert/15 hover:text-white">
            ลบรายการ
          </button>
        </div>
      )}
      {message ? <p className="mt-2 text-[13px] text-alert">{message}</p> : null}
    </section>
  );
}
