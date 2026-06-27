"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";
import { PageContainer } from "./page-container";

export function AdminLayout({
  children,
  breadcrumbItems = [],
}: {
  children: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const isSidebarCollapsed = false;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <TopNavbar
        isSidebarCollapsed={isSidebarCollapsed}
        onMenuClick={() => setIsMobileSidebarOpen(true)}
      />

      <PageContainer isSidebarCollapsed={isSidebarCollapsed}>
        <Breadcrumb items={breadcrumbItems} />
        {children}
      </PageContainer>
    </div>
  );
}