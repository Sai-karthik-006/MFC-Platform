import * as React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

function SkeletonBase({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "animate-pulse rounded bg-gray-200",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  lines,
  className = "",
  ...props
}: SkeletonProps) {
  if (variant === "text" && typeof lines === "number" && lines > 1) {
    return (
      <div className={["space-y-2", className].join(" ")} role="status" aria-label="Loading content" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBase
            key={i}
            className="h-4"
            style={{
              width: i === lines - 1 ? "75%" : "100%",
            }}
          />
        ))}
      </div>
    );
  }

  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  let variantClass = "";
  if (variant === "circular") {
    variantClass = "rounded-full";
  } else if (variant === "text") {
    variantClass = "h-4 w-full";
  } else {
    variantClass = "h-24 w-full";
  }

  return (
    <SkeletonBase className={variantClass} style={style} role="status" aria-label="Loading content" {...props} />
  );
}
