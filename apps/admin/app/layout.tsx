import type { Metadata } from "next";
import { AdminProviders } from "@/components/AdminProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "MFC Admin",
  description: "MFC Platform Admin Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AdminProviders>
          {children}
        </AdminProviders>
      </body>
    </html>
  );
}