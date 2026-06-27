import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-lg border border-gray-200 bg-white shadow-sm",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: CardProps) {
  return (
    <div className={["p-4 pb-0", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children, ...props }: CardProps) {
  return (
    <div className={["p-4", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }: CardProps) {
  return (
    <div className={["p-4 pt-0", className].join(" ")} {...props}>
      {children}
    </div>
  );
}
