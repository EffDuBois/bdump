import type { Metadata } from "next";
import "./globals.css";
import { maintextFont, titleFont } from "@/ui/fonts";

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
      <body className={maintextFont.className}>
        <main className="flex min-h-screen flex-col justify-between items-center pt-12 pb-20 px-8">
          <h1 className={`${titleFont.className} text-4xl`}>NotesApp</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
