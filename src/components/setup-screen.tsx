export function SetupScreen() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center px-6">
      <p className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase">ตั้งค่าครั้งแรก</p>
      <h1 className="mt-2 text-[40px] leading-none font-semibold tracking-tight">เชื่อม Supabase</h1>
      <p className="mt-4 text-[17px] leading-relaxed text-mute">
        แอปพร้อมแล้ว แต่ยังไม่มีคีย์ฐานข้อมูล สร้างโปรเจกต์ TrackingApp ใน Supabase
        แล้วใส่ค่าในไฟล์
        <code className="mx-1 rounded-md bg-fill px-1.5 py-0.5 text-[14px]">.env.local</code>
      </p>
      <ol className="mt-8 space-y-4 text-[15px] leading-relaxed">
        <li>
          <span className="text-faint">1.</span> คัดลอก Project URL กับ anon key
        </li>
        <li>
          <span className="text-faint">2.</span> คัดลอก{" "}
          <code className="rounded-md bg-fill px-1.5 py-0.5 text-[14px]">.env.example</code> เป็น{" "}
          <code className="rounded-md bg-fill px-1.5 py-0.5 text-[14px]">.env.local</code>
        </li>
        <li>
          <span className="text-faint">3.</span> รัน{" "}
          <code className="rounded-md bg-fill px-1.5 py-0.5 text-[14px]">supabase/schema.sql</code> ใน
          SQL Editor
        </li>
        <li>
          <span className="text-faint">4.</span> ใน Authentication ปิด Confirm email แล้วรีสตาร์ท
          <code className="mx-1 rounded-md bg-fill px-1.5 py-0.5 text-[14px]">npm run dev</code>
        </li>
      </ol>
    </div>
  );
}
