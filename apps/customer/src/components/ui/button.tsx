import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
  outline:
    "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const sizeStyles: Record<string, string> = {
  sm: "h-8 px-3 text-sm rounded-md",
  md: "h-10 px-4 text-sm rounded-md",
  lg: "h-12 px-6 text-base rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 font-medium",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {!isLoading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
}
