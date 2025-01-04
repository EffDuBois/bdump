import type { Metadata } from "next";
import "./globals.css";
import { interfaceFont } from "@/ui/fonts";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Braindump",
  description: "Webapp for you to store your notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body className={`${interfaceFont.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
