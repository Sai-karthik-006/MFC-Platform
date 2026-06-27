"use client";

import { Badge } from "./ui/badge";

export function TopNavbar({
  isSidebarCollapsed = false,
  onMenuClick,
}: {
  isSidebarCollapsed?: boolean;
  onMenuClick?: () => void;
}) {
  return (
    <header
      className={[
        "fixed top-0 right-0 h-16 bg-white border-b border-gray-200",
        "flex items-center justify-between px-4 lg:px-6 transition-all duration-300",
        isSidebarCollapsed ? "lg:left-16" : "lg:left-64",
        "left-0 z-20",
      ].join(" ")}
    >
      <div className="flex items-center flex-1">
        <button
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden lg:block relative ml-4 w-64">
          <input
            type="search"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.2-5.2m2.8 5.2l5.2 5.2M3 10a7 7 0 1114 0 7 7 0 01-14 0z" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-transparent text-gray-600 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 17h5l-5 5v-5zM6 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 106 8c0 7-2 9-2 9h16S18 15 18 8" />
            </svg>
          </button>
          <Badge variant="destructive" className="absolute -top-1 -right-1 min-w-[1.25rem] h-5">
            3
          </Badge>
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@mfc.com</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}