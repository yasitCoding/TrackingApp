"use client";

import { useRef, useState } from "react";
import { setHabitDay } from "@/lib/actions";
import { formatThaiDate, todayISO, yearWeeks } from "@/lib/dates";

const MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const WEEKDAYS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

function monthLabel(week: ({ iso: string } | null)[]) {
  const first = week.find((cell) => cell?.iso.endsWith("-01"));
  if (!first) return "";
  return MONTHS[Number(first.iso.slice(5, 7)) - 1] ?? "";
}

export function YearGrid({
  habitId,
  year,
  doneDates,
}: {
  habitId: string;
  year: number;
  doneDates: string[];
}) {
  const [done, setDone] = useState(() => new Set(doneDates));
  const doneRef = useRef(done);
  const [message, setMessage] = useState<string | null>(null);
  const today = todayISO();
  const weeks = yearWeeks(year);
  doneRef.current = done;

  async function toggle(iso: string) {
    if (iso > today) return;
    const wasDone = doneRef.current.has(iso);
    setDone((current) => {
      const next = new Set(current);
      if (wasDone) next.delete(iso);
      else next.add(iso);
      return next;
    });
    setMessage(null);

    try {
      const result = await setHabitDay(habitId, iso, !wasDone);
      if (!result.ok) {
        setDone((current) => {
          const next = new Set(current);
          if (wasDone) next.add(iso);
          else next.delete(iso);
          return next;
        });
        setMessage(result.message);
      }
    } catch (error) {
      console.error("YearGrid", error);
      setDone((current) => {
        const next = new Set(current);
        if (wasDone) next.add(iso);
        else next.delete(iso);
        return next;
      });
      setMessage("บันทึกวันนี้ไม่สำเร็จ");
    }
  }

  return (
    <div>
      <p className="text-[48px] leading-none font-semibold tracking-tight text-accent tabular-nums">{done.size}</p>
      <p className="mt-2 text-[13px] text-faint">วันในปี {year}</p>

      <div className="mt-8 overflow-x-auto pb-2">
        <div className="inline-flex min-w-full flex-col gap-1.5">
          <div className="flex">
            <div className="w-8 shrink-0" />
            <div className="flex gap-[3px]">
              {weeks.map((week, index) => (
                <div key={index} className="relative h-4 w-[14px]">
                  <span className="absolute top-0 left-0 text-[10px] whitespace-nowrap text-faint">
                    {monthLabel(week)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex">
            <div className="flex w-8 shrink-0 flex-col gap-[3px] pr-1 text-[10px] text-faint">
              {WEEKDAYS.map((day) => (
                <span key={day} className="flex h-[14px] items-center">
                  {day}
                </span>
              ))}
            </div>
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((cell, dayIndex) => {
                    if (!cell) return <span key={dayIndex} className="size-[14px]" />;
                    const isDone = done.has(cell.iso);
                    const future = cell.iso > today;
                    return (
                      <button
                        key={cell.iso}
                        type="button"
                        disabled={future}
                        aria-pressed={isDone}
                        aria-label={`${formatThaiDate(cell.iso)} ${isDone ? "ทำแล้ว" : "ยังไม่ได้ทำ"}`}
                        onClick={() => toggle(cell.iso)}
                        className={`size-[14px] rounded-[3px] ${
                          isDone
                            ? "bg-accent"
                            : future
                              ? "cursor-default bg-white/5"
                              : "cursor-pointer bg-white/10 hover:bg-white/20"
                        } ${cell.iso === today ? "outline outline-1 outline-offset-1 outline-accent" : ""}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-faint">ส้มคือทำแล้ว · ช่องจางคือยังไม่ได้ทำ · กดช่องเพื่อสลับ เลื่อนซ้ายขวาดูทั้งปี</p>
      {message ? <p className="mt-2 text-[14px] text-alert">{message}</p> : null}
    </div>
  );
}
