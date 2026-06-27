"use client";

interface SidebarNavItem {
  label: string;
  href: string;
}

const navItems: SidebarNavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Orders", href: "/orders" },
  { label: "Customers", href: "/customers" },
  { label: "Catering", href: "/catering" },
  { label: "Analytics", href: "/analytics" },
  { label: "Settings", href: "/settings" },
];

export function Sidebar({
  isCollapsed = false,
  isMobileOpen = false,
  onMobileClose,
}: {
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  return (
    <>
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 transition-all duration-300",
          "flex flex-col h-screen",
          isCollapsed ? "w-16" : "w-64",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center h-16 px-4 border-b border-gray-200",
            isCollapsed ? "justify-center" : "justify-between",
          ].join(" ")}
        >
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900">MFC Admin</span>
          )}
          {isCollapsed && (
            <span className="text-xl font-bold text-gray-900">MFC</span>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={[
                    "flex items-center px-4 py-2 text-gray-700 rounded-md mx-2",
                    "hover:bg-gray-100 transition-colors duration-150",
                    isCollapsed ? "justify-center px-2" : "",
                  ].join(" ")}
                  title={isCollapsed ? item.label : undefined}
                >
                  {isCollapsed ? (
                    <span className="font-medium">{item.label.charAt(0)}</span>
                  ) : (
                    <span className="font-medium">{item.label}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {isMobileOpen && onMobileClose && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onMobileClose}
        />
      )}
    </>
  );
}