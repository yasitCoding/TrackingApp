import Link from "next/link";
import { AddHabitForm } from "@/components/add-habit-form";
import { MissingSchema } from "@/components/missing-schema";
import { PageTitle } from "@/components/ui";
import { currentYear, yearRange } from "@/lib/dates";
import { getHabits, getLogs } from "@/lib/queries";

export default async function HomePage() {
  const year = currentYear();
  const { habits, ready } = await getHabits();
  if (!ready) return <MissingSchema />;

  const { logs, ready: logsReady } = await getLogs(yearRange(year));
  if (!logsReady) return <MissingSchema />;

  const counts = new Map<string, number>();
  for (const log of logs) {
    if (!log.done) continue;
    counts.set(log.habit_id, (counts.get(log.habit_id) ?? 0) + 1);
  }

  return (
    <div>
      <PageTitle eyebrow={`ปี ${year}`}>รายการ</PageTitle>
      {habits.length === 0 ? (
        <p className="text-[15px] text-mute">ยังไม่มีรายการ เพิ่มด้านล่าง แล้วกดเข้าไปติ๊กวันทั้งปี</p>
      ) : (
        <ul className="divide-y rounded-[16px] border bg-card">
          {habits.map((habit) => (
            <li key={habit.id}>
              <Link href={`/habits/${habit.id}?year=${year}`} className="flex items-center justify-between gap-4 px-4 py-4">
                <span>
                  <span className="block text-[17px] font-medium">{habit.name}</span>
                  {habit.target ? <span className="mt-0.5 block text-[13px] text-faint">{habit.target}</span> : null}
                </span>
                <span className="shrink-0 text-[15px] text-accent tabular-nums">{counts.get(habit.id) ?? 0} วัน</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <AddHabitForm />
    </div>
  );
}
