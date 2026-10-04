import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SetupScreen } from "@/components/setup-screen";
import { ensureDefaultHabits } from "@/lib/actions";
import { isSupabaseConfigured } from "@/lib/config";
import { getCurrentUser } from "@/lib/queries";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <SetupScreen />;
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  await ensureDefaultHabits();

  return <AppShell email={user.email ?? ""}>{children}</AppShell>;
}
