import * as React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: "none" | "sm" | "md" | "lg";
  background?: "default" | "muted" | "white";
  as?: React.ElementType;
}

const paddingStyles: Record<string, string> = {
  none: "",
  sm: "py-4",
  md: "py-8",
  lg: "py-12",
};

const backgroundStyles: Record<string, string> = {
  default: "bg-white",
  muted: "bg-gray-50",
  white: "bg-white",
};

export function Section({
  padding = "md",
  background = "default",
  as = "section",
  className = "",
  children,
  ...props
}: SectionProps) {
  const Tag = as as React.ElementType;

  return (
    <Tag
      className={[
        backgroundStyles[background],
        paddingStyles[padding],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}
