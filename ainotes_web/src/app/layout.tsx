import type { Metadata } from "next";
import "./globals.css";
import { maintextFont, titleFont } from "@/ui/fonts";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/constants";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "AI notes webapp",
  description: "Webapp for you to store your notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${maintextFont.className}`}>{children}</body>
    </html>
  );
}
