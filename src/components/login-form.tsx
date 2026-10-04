"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, TextInput } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const result =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (result.error) {
        console.error("login", result.error);
        setMessage(
          mode === "signin"
            ? "เข้าสู่ระบบไม่สำเร็จ ตรวจอีเมลหรือรหัสผ่าน"
            : "สมัครไม่สำเร็จ ลองอีเมลอื่นหรือรหัสที่ยาวขึ้น",
        );
        return;
      }

      if (mode === "signup" && !result.data.session) {
        setMessage("สมัครแล้ว แต่ต้องยืนยันอีเมลก่อน หรือไปปิด Confirm email ใน Supabase");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("LoginForm", error);
      setMessage(error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-[420px] flex-col justify-center px-6">
      <p className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase">นับวันทั้งปี</p>
      <h1 className="mt-2 text-[40px] leading-none font-semibold tracking-tight">ติดตาม</h1>
      <p className="mt-3 text-[17px] text-mute">
        {mode === "signin" ? "เข้าสู่ระบบเพื่อเช็กวันนี้" : "สมัครครั้งแรก แล้วเริ่มนับ"}
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <Field label="อีเมล">
          <TextInput
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Field label="รหัสผ่าน">
          <TextInput
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {message ? <p className="text-[14px] text-alert">{message}</p> : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "กำลังทำงาน…" : mode === "signin" ? "เข้าสู่ระบบ" : "สมัคร"}
        </Button>
      </form>

      <button
        type="button"
        className="mt-6 cursor-pointer text-left text-[14px] text-ink underline-offset-2 transition duration-200 hover:text-accent hover:underline"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setMessage(null);
        }}
      >
        {mode === "signin" ? "ยังไม่มีบัญชี สมัครที่นี่" : "มีบัญชีแล้ว เข้าสู่ระบบ"}
      </button>
    </div>
  );
}
