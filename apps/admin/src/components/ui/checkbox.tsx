import * as React from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function Checkbox({ label, className = "", id, ...props }: CheckboxProps) {
  const checkboxId = id || props.name;
  return (
    <label
      htmlFor={checkboxId}
      className="inline-flex items-center gap-2 cursor-pointer select-none"
    >
      <input
        type="checkbox"
        id={checkboxId}
        className={[
          "h-4 w-4 rounded border-gray-300",
          "text-blue-600 focus:ring-blue-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        ].join(" ")}
        {...props}
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}
