import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { SetupScreen } from "@/components/setup-screen";
import { isSupabaseConfigured } from "@/lib/config";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
};

export default function LoginPage() {
  if (!isSupabaseConfigured()) {
    return <SetupScreen />;
  }

  return <LoginForm />;
}
