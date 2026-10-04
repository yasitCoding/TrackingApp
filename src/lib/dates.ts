import { addMonths, format, parse } from "date-fns";
import { th } from "date-fns/locale";

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function currentYear() {
  return new Date().getFullYear();
}

export function currentMonthKey() {
  return format(new Date(), "yyyy-MM");
}

export function parseISODate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function parseMonthKey(monthKey: string) {
  return parse(`${monthKey}-01`, "yyyy-MM-dd", new Date());
}

export function readYear(value: string | undefined) {
  const year = Number(value);
  const now = currentYear();
  if (!Number.isInteger(year) || year < 2000 || year > now) return now;
  return year;
}

export function readMonthKey(value: string | undefined) {
  if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return currentMonthKey();
  if (value > currentMonthKey()) return currentMonthKey();
  return value;
}

export function readISODate(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return todayISO();
  const date = parseISODate(value);
  if (Number.isNaN(date.getTime())) return todayISO();
  if (format(date, "yyyy-MM-dd") !== value) return todayISO();
  if (value > todayISO()) return todayISO();
  return value;
}

export function monthRange(monthKey: string) {
  const start = parseMonthKey(monthKey);
  const end = addMonths(start, 1);
  return {
    from: format(start, "yyyy-MM-dd"),
    to: format(end, "yyyy-MM-dd"),
  };
}

export function yearRange(year: number) {
  return { from: `${year}-01-01`, to: `${year + 1}-01-01` };
}

export function shiftMonth(monthKey: string, delta: number) {
  return format(addMonths(parseMonthKey(monthKey), delta), "yyyy-MM");
}

export function formatThaiDate(iso: string) {
  return format(parseISODate(iso), "EEEE d MMM", { locale: th });
}

export function formatThaiMonth(monthKey: string) {
  return format(parseMonthKey(monthKey), "MMMM yyyy", { locale: th });
}

export function daysInMonth(monthKey: string) {
  const start = parseMonthKey(monthKey);
  const next = addMonths(start, 1);
  return Math.round((next.getTime() - start.getTime()) / 86_400_000);
}

export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInYear(year: number) {
  return isLeapYear(year) ? 366 : 365;
}

export function elapsedDaysInYear(year: number) {
  const now = currentYear();
  if (year > now) return 0;
  if (year < now) return daysInYear(year);
  const start = new Date(year, 0, 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - start.getTime()) / 86_400_000) + 1;
}

export function monthCells(monthKey: string) {
  const start = parseMonthKey(monthKey);
  const count = daysInMonth(monthKey);
  const lead = (start.getDay() + 6) % 7;
  const cells: ({ iso: string; day: number } | null)[] = Array.from({ length: lead }, () => null);

  for (let day = 1; day <= count; day += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), day);
    cells.push({ iso: format(date, "yyyy-MM-dd"), day });
  }

  return cells;
}

export function nextDay(iso: string) {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + 1);
  return format(date, "yyyy-MM-dd");
}

export function yearWeeks(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const lead = (start.getDay() + 6) % 7;
  const cursor = new Date(start);
  cursor.setDate(start.getDate() - lead);

  const weeks: ({ iso: string } | null)[][] = [];
  while (cursor <= end) {
    const week: ({ iso: string } | null)[] = [];
    for (let index = 0; index < 7; index += 1) {
      week.push(cursor.getFullYear() === year ? { iso: format(cursor, "yyyy-MM-dd") } : null);
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}
