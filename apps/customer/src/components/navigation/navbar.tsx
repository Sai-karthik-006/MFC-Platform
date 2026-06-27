import * as React from "react";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  requiresAuth?: boolean;
}

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brandName?: string;
  logo?: React.ReactNode;
  links?: NavLink[];
  rightSlot?: React.ReactNode;
}

export function Navbar({
  brandName = "MFC",
  logo,
  links = [],
  rightSlot,
  className = "",
  ...props
}: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <header
      className={[
        "sticky top-0 z-40 transition-all duration-300",
        "bg-white/80 backdrop-blur-md border-b border-gray-200/80",
        className,
      ].join(" ")}
      {...props}
    >
      <Container size="xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2">
              {logo ? (
                <span className="flex items-center">{logo}</span>
              ) : (
                <span className="text-xl font-bold text-blue-600 tracking-tight">
                  {brandName}
                </span>
              )}
            </a>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={[
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                    "transition-all duration-200",
                    link.isActive
                      ? "text-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50",
                  ].join(" ")}
                  aria-current={link.isActive ? "page" : undefined}
                >
                  {link.icon && (
                    <span className="flex items-center">{link.icon}</span>
                  )}
                  <span>{link.label}</span>
                  {link.requiresAuth && (
                    <Badge variant="info" className="ml-1">
                      Soon
                    </Badge>
                  )}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-md p-0"
                aria-label="Search"
                leftIcon={<SearchIcon />}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-md p-0"
                aria-label="Location"
                leftIcon={<LocationIcon />}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-md p-0"
                aria-label="Cart"
                leftIcon={<CartIcon />}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 rounded-md p-0"
                aria-label="Profile"
                leftIcon={<ProfileIcon />}
              />
              {rightSlot}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-expanded={isMobileOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileOpen ? "Close" : "Menu"}
            </Button>
          </div>
        </div>
      </Container>

      {isMobileOpen && (
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm md:hidden">
          <Container size="sm" className="py-4">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={[
                    "inline-flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium",
                    "transition-all duration-200",
                    link.isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                  ].join(" ")}
                  aria-current={link.isActive ? "page" : undefined}
                >
                  {link.icon && (
                    <span className="flex items-center">{link.icon}</span>
                  )}
                  <span>{link.label}</span>
                  {link.requiresAuth && (
                    <Badge variant="info" className="ml-1">
                      Soon
                    </Badge>
                  )}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    leftIcon={<SearchIcon />}
                  >
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    leftIcon={<LocationIcon />}
                  >
                    Location
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    leftIcon={<CartIcon />}
                  >
                    Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    leftIcon={<ProfileIcon />}
                  >
                    Profile
                  </Button>
                </div>
                {rightSlot}
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
