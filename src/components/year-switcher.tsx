import Link from "next/link";
import { currentYear } from "@/lib/dates";
import { IconChevron } from "@/components/icons";

export function YearSwitcher({
  year,
  hrefFor,
}: {
  year: number;
  hrefFor: (year: number) => string;
}) {
  const canPrev = year > 2000;
  const canNext = year < currentYear();

  return (
    <div className="flex items-center justify-between">
      {canPrev ? (
        <Link
          href={hrefFor(year - 1)}
          className="flex size-9 items-center justify-center rounded-full bg-fill text-mute transition duration-200 hover:scale-105 hover:bg-accent hover:text-white"
          aria-label="ปีก่อน"
        >
          <IconChevron className="size-4 rotate-180" />
        </Link>
      ) : (
        <span className="size-9" />
      )}
      <p className="text-[21px] font-semibold tracking-tight">ปี {year}</p>
      {canNext ? (
        <Link
          href={hrefFor(year + 1)}
          className="flex size-9 items-center justify-center rounded-full bg-fill text-mute transition duration-200 hover:scale-105 hover:bg-accent hover:text-white"
          aria-label="ปีถัดไป"
        >
          <IconChevron className="size-4" />
        </Link>
      ) : (
        <span className="size-9" />
      )}
    </div>
  );
}
