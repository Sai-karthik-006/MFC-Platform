import * as React from "react";

interface PageWrapperProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageWrapper({
  title,
  description,
  breadcrumb,
  actions,
  className = "",
  children,
  ...props
}: PageWrapperProps) {
  return (
    <div className={["min-h-screen", className].join(" ")} {...props}>
      {(breadcrumb || title || description || actions) && (
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            {breadcrumb && <nav className="mb-2 text-sm text-gray-500">{breadcrumb}</nav>}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
                {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          </div>
        </div>
      )}
      <main>{children}</main>
    </div>
  );
}
