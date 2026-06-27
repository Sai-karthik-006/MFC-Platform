import * as React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  ...props
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gray-200";

  const variantStyles: Record<string, string> = {
    text: "h-4 rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  const style = width || height ? { width, height } : {};

  return (
    <div
      className={[baseStyles, variantStyles[variant], className].join(" ")}
      style={style}
      {...props}
    />
  );
}