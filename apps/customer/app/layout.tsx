import type { Metadata } from "next";
import { Providers } from "../src/providers/providers";
import { MainLayout } from "../src/layouts/main-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MFC Customer",
    template: "%s | MFC Customer",
  },
  description: "MFC Platform Customer Application",
  keywords: ["e-commerce", "shopping", "marketplace"],
  authors: [{ name: "MFC Platform" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "MFC Customer",
    title: "MFC Customer",
    description: "MFC Platform Customer Application",
  },
  twitter: {
    card: "summary_large_image",
    title: "MFC Customer",
    description: "MFC Platform Customer Application",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}