"use client";

import { signOut } from "@/lib/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="cursor-pointer text-[13px] text-ink underline-offset-2 transition duration-200 hover:text-accent hover:underline">
        ออกจากระบบ
      </button>
    </form>
  );
}
