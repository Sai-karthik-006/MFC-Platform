import * as React from "react";
import { Badge } from "../ui/badge";

interface NavLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "danger" | "info";
}

export function NavLink({
  href,
  isActive = false,
  icon,
  badge,
  badgeVariant = "default",
  className = "",
  children,
  ...props
}: NavLinkProps) {
  return (
    <a
      href={href}
      className={[
        "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
        "transition-colors duration-150",
        isActive
          ? "text-blue-600 bg-blue-50"
          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
        className,
      ].join(" ")}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
      {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
    </a>
  );
}
