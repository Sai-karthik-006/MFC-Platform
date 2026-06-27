import * as React from "react";
import { createPortal } from "react-dom";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  className = "",
  children,
  ...props
}: ModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
          className={[
            "relative w-full rounded-lg bg-white shadow-xl",
            sizeStyles[size],
            "max-h-[90vh] overflow-y-auto",
            className,
          ].join(" ")}
          {...props}
        >
          {(title || description) && (
            <div className="border-b border-gray-200 px-6 py-4">
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>
          )}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
