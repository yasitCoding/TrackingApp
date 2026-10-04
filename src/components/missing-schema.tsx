export function MissingSchema() {
  return (
    <div className="mx-auto max-w-md py-10">
      <p className="text-[13px] font-medium text-accent">ฐานข้อมูล</p>
      <h1 className="mt-2 text-[34px] leading-none font-semibold tracking-tight">สร้างตารางก่อน</h1>
      <p className="mt-4 text-[16px] leading-relaxed text-mute">
        เปิด Supabase SQL Editor แล้วรัน{" "}
        <code className="rounded-md bg-fill px-1.5 py-0.5 text-[14px]">supabase/schema.sql</code> จากโฟลเดอร์
        tracking ของโปรเจกต์ TrackingApp
      </p>
    </div>
  );
}
