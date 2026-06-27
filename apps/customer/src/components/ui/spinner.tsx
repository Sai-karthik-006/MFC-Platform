import * as React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeStyles: Record<string, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
};

export function Spinner({ size = "md", label, className = "", ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label || "Loading"}
      className={["inline-flex items-center justify-center", className].join(" ")}
      {...props}
    >
      <span
        className={[
          "inline-block animate-spin rounded-full border-current border-t-transparent",
          sizeStyles[size],
        ].join(" ")}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
