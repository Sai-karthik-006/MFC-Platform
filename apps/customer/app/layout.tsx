import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MFC Customer",
  description: "MFC Platform Customer Application"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}