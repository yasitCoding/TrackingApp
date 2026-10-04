import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ติดตาม",
    template: "%s · ติดตาม",
  },
  description: "นับวันที่ทำได้ในแต่ละปี",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
