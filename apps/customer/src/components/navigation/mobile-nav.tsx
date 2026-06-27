import * as React from "react";

interface MobileNavProps extends React.HTMLAttributes<HTMLElement> {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string; icon?: React.ReactNode; isActive?: boolean }[];
  rightSlot?: React.ReactNode;
}

export function MobileNav({ isOpen, onClose, links, rightSlot, className = "", ...props }: MobileNavProps) {
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
    <div className="fixed inset-0 z-50 md:hidden" {...props}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close menu"
          >
            Close
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile drawer">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={[
                "inline-flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                link.isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
              ].join(" ")}
              aria-current={link.isActive ? "page" : undefined}
            >
              {link.icon && <span className="flex items-center">{link.icon}</span>}
              {link.label}
            </a>
          ))}
          {rightSlot && <div className="mt-4 border-t border-gray-200 pt-4">{rightSlot}</div>}
        </nav>
      </div>
    </div>
  );
}
