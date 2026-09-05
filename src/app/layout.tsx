import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Developer Agentic OS",
  description: "A local-first developer command centre for repo-aware agentic workflows.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}