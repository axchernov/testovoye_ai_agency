import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Automation — боты и AI-агенты для бизнеса",
  description: "Telegram-боты, AI-агенты и автоматизации, которые убирают ручную рутину.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
