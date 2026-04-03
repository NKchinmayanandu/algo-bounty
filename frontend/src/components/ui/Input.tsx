import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {icon && (
          <div
            className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-text-muted pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <input
          id={id}
          className={[
            "w-full h-12 rounded-xl text-sm text-text-primary",
            "bg-surface-900 border border-border-subtle",
            "focus:outline-none focus:border-sakura-400/60 focus:ring-2 focus:ring-sakura-400/20",
            "transition-all duration-200 placeholder:text-text-muted",
            icon ? "pl-10 pr-4" : "px-4",
            error ? "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className = "",
  id,
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={[
          "w-full rounded-xl text-sm text-text-primary",
          "bg-surface-900 border border-border-subtle",
          "px-4 py-3 min-h-[120px] resize-y",
          "focus:outline-none focus:border-sakura-400/60 focus:ring-2 focus:ring-sakura-400/20",
          "transition-all duration-200 placeholder:text-text-muted",
          error ? "border-red-400/60" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-red-400">⚠ {error}</p>}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
