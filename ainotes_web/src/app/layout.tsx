import type { Metadata } from "next";
import "./globals.css";
import { interfaceFont } from "@/ui/fonts";
import Providers from "./providers";

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
      <body className={`${interfaceFont.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
