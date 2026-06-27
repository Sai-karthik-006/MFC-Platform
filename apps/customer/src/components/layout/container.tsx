import * as React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  as?: React.ElementType;
}

const sizeStyles: Record<string, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-screen-2xl",
  full: "max-w-full",
};

export function Container({
  size = "lg",
  as = "div",
  className = "",
  children,
  ...props
}: ContainerProps) {
  const Tag = as as React.ElementType;

  return (
    <Tag
      className={[
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeStyles[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}
