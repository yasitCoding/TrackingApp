"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHabit } from "@/lib/actions";
import { Button, Field, TextInput } from "@/components/ui";

export function AddHabitForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("target", target);
      const result = await createHabit(formData);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setName("");
      setTarget("");
      router.refresh();
    } catch (error) {
      console.error("AddHabitForm", error);
      setMessage("เพิ่มรายการไม่สำเร็จ");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-10 rounded-[16px] border bg-card p-5">
      <h2 className="text-[17px] font-semibold">เพิ่มรายการ</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <Field label="ชื่อ">
          <TextInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="เช่น นอนตรงเวลา"
            maxLength={40}
            required
          />
        </Field>
        <Field label="เป้าหมาย ถ้ามี">
          <TextInput
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="เช่น 4,000 ml"
            maxLength={40}
          />
        </Field>
        {message ? <p className="text-[13px] text-alert">{message}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "กำลังเพิ่ม…" : "เพิ่ม"}
        </Button>
      </form>
    </section>
  );
}
