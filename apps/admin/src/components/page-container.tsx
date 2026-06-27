"use client";

import * as React from "react";

export function PageContainer({
  children,
  className = "",
  isSidebarCollapsed = false,
}: {
  children: React.ReactNode;
  className?: string;
  isSidebarCollapsed?: boolean;
}) {
  return (
    <main
      className={[
        "min-h-screen bg-gray-50 pt-16 transition-all duration-300",
        isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64",
        "px-4 lg:px-6 py-6",
        className,
      ].join(" ")}
    >
      <div className="max-w-full">{children}</div>
    </main>
  );
}