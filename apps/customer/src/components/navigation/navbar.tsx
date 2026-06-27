import * as React from "react";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

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
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-40 bg-white transition-shadow duration-200",
        isScrolled ? "shadow-sm" : "",
        className,
      ].join(" ")}
      {...props}
    >
      <Container size="xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2">
              {logo ? <span className="flex items-center">{logo}</span> : (
                <span className="text-xl font-bold text-blue-600">{brandName}</span>
              )}
            </a>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={[
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                    "transition-colors duration-150",
                    link.isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                  ].join(" ")}
                  aria-current={link.isActive ? "page" : undefined}
                >
                  {link.icon && <span className="flex items-center">{link.icon}</span>}
                  <span>{link.label}</span>
                  {link.requiresAuth && <Badge variant="info" className="ml-1">Soon</Badge>}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
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
        <div className="border-t border-gray-200 bg-white md:hidden">
          <Container size="sm" className="py-3">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={[
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                    link.isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                  ].join(" ")}
                  aria-current={link.isActive ? "page" : undefined}
                >
                  {link.icon && <span className="flex items-center">{link.icon}</span>}
                  <span>{link.label}</span>
                  {link.requiresAuth && <Badge variant="info" className="ml-1">Soon</Badge>}
                </a>
              ))}
              <div className="mt-3 border-t border-gray-200 pt-3">
                {rightSlot}
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
