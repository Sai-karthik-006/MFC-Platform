import * as React from "react";

interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  src?: string;
  alt?: string;
  text?: string;
  icon?: React.ReactNode;
}

export function Logo({
  href = "#",
  src,
  alt = "Logo",
  text = "MFC",
  icon,
  className = "",
  ...props
}: LogoProps) {
  return (
    <a href={href} className={["flex items-center gap-2", className].join(" ")} {...props}>
      {src ? (
        <img src={src} alt={alt} className="h-8 w-auto" />
      ) : icon ? (
        <span className="flex items-center">{icon}</span>
      ) : (
        <span className="text-xl font-bold text-blue-600">{text}</span>
      )}
    </a>
  );
}
