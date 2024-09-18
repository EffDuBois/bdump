import type { Metadata } from "next";
import "./globals.css";
import { maintextFont, titleFont } from "@/ui/fonts";
import SideBar from "@/ui/Sidebar";
import { Suspense } from "react";
import Spinner from "@/ui/loaders/Spinner";

export const metadata: Metadata = {
  title: "AI notes webapp",
  description: "Webapp for you to store your notes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${maintextFont.className} h-screen`}>
        <h1 className={`${titleFont.className} my-2 text-4xl text-center`}>
          NotesApp
        </h1>
        <div className="flex h-full" style={{ height: "100%" }}>
          <SideBar />

          <main className="flex-auto flex flex-col justify-between items-center pt-12 pb-20 px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
