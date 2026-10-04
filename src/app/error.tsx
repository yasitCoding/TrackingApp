"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
      <h1 className="text-[34px] font-semibold tracking-tight">มีอะไรผิดพลาด</h1>
      <p className="mt-3 text-[17px] leading-relaxed text-mute">
        {error.message || "ลองโหลดหน้าใหม่"}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 text-left text-[15px] text-accent underline-offset-2 hover:underline"
      >
        ลองอีกครั้ง
      </button>
    </div>
  );
}
