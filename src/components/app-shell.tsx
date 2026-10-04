import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

export function AppShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-page/80 px-5 py-3 backdrop-blur-xl">
        <Link href="/" className="text-[17px] font-semibold tracking-tight">
          ติดตาม
        </Link>
        <div className="flex items-center gap-4">
          <p className="hidden max-w-56 truncate text-[12px] text-faint sm:block">{email}</p>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-[980px] px-5 pt-8 pb-16">{children}</main>
    </div>
  );
}
