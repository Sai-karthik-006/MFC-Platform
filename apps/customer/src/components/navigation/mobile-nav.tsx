import * as React from "react";

interface MobileNavProps extends React.HTMLAttributes<HTMLElement> {
  isOpen: boolean;
  onClose: () => void;
  links: {
    href: string;
    label: string;
    icon?: React.ReactNode;
    isActive?: boolean;
  }[];
  rightSlot?: React.ReactNode;
}

export function MobileNav({
  isOpen,
  onClose,
  links,
  rightSlot,
  className = "",
  ...props
}: MobileNavProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-50 md:hidden animate-fade-in duration-300",
        className,
      ].join(" ")}
      {...props}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-y-0 right-0 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <span className="text-lg font-semibold text-gray-900 tracking-wide">
            Menu
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-gray-500 outline-none transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label="Close menu"
          >
            Close
          </button>
        </div>
        <nav
          className="flex flex-col gap-1 overflow-y-auto px-4 py-4"
          aria-label="Mobile drawer"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={[
                "inline-flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                link.isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
              ].join(" ")}
              aria-current={link.isActive ? "page" : undefined}
            >
              {link.icon && (
                <span className="flex items-center">{link.icon}</span>
              )}
              {link.label}
            </a>
          ))}
          {rightSlot && (
            <div className="mt-5 border-t border-gray-200 pt-5">{rightSlot}</div>
          )}
        </nav>
      </div>
    </div>
  );
}
