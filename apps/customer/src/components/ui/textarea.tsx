import * as React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || React.useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={[
          "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm",
          "placeholder:text-gray-400",
          "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
          "disabled:bg-gray-50 disabled:text-gray-500",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          "min-h-[80px]",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
