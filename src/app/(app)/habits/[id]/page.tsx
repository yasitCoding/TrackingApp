import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HabitEditor } from "@/components/habit-editor";
import { MissingSchema } from "@/components/missing-schema";
import { YearGrid } from "@/components/year-grid";
import { YearSwitcher } from "@/components/year-switcher";
import { readYear, yearRange } from "@/lib/dates";
import { getHabit, getLogs } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { habit } = await getHabit(id);
  return { title: habit?.name ?? "รายการ" };
}

export default async function HabitYearPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const year = readYear(query.year);
  const { habit, ready } = await getHabit(id);
  if (!ready) return <MissingSchema />;
  if (!habit) notFound();

  const { logs, ready: logsReady } = await getLogs({ ...yearRange(year), habitId: habit.id });
  if (!logsReady) return <MissingSchema />;

  const doneDates = logs.filter((log) => log.done).map((log) => log.occurred_on);

  return (
    <div>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-[12px] bg-accent px-4 text-[15px] font-medium text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#ff9340] hover:shadow-[0_10px_28px_rgba(255,122,24,0.38)] active:translate-y-0"
      >
        ย้อนกลับ
      </Link>
      <h1 className="mt-3 text-[34px] leading-none font-semibold tracking-tight">{habit.name}</h1>
      <div className="mt-8">
        <YearSwitcher year={year} hrefFor={(next) => `/habits/${habit.id}?year=${next}`} />
      </div>
      <div className="mt-8">
        <YearGrid key={`${habit.id}-${year}`} habitId={habit.id} year={year} doneDates={doneDates} />
      </div>
      <HabitEditor habit={habit} />
    </div>
  );
}
