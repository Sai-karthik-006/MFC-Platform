import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || React.useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm",
            "placeholder:text-gray-400",
            "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
            "disabled:bg-gray-50 disabled:text-gray-500",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className,
          ].join(" ")}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
