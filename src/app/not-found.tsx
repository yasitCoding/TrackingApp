import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
      <h1 className="text-[32px] font-semibold tracking-tight">ไม่พบหน้านี้</h1>
      <p className="mt-2 text-[15px] text-mute">กลับไปภาพรวมแล้วเลือกจากเมนู</p>
      <Link href="/" className="mt-6 text-[16px] text-accent underline-offset-2 hover:underline">
        ไปภาพรวม
      </Link>
    </main>
  );
}
