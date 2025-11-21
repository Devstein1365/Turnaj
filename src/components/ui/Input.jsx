import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      prefix,
      suffix,
      type = "text",
      placeholder,
      disabled = false,
      className = "",
      inputClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-[var(--t2-text-primary)]">
            {label}
          </label>
        )}

        <div className="relative">
          {prefix && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--t2-text-secondary)] pointer-events-none">
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`
            w-full px-4 py-3 
            bg-[var(--t2-surface)] 
            border-2 border-[var(--t2-border)] 
            rounded-[var(--t2-radius-md)]
            text-[var(--t2-text-primary)] 
            placeholder:text-[var(--t2-text-tertiary)]
            focus:outline-none 
            focus:border-[var(--t2-primary)]
            disabled:opacity-50 
            disabled:cursor-not-allowed
            transition-colors
            ${prefix ? "pl-12" : ""}
            ${suffix ? "pr-12" : ""}
            ${error ? "border-[var(--t2-error)]" : ""}
            ${inputClassName}
          `}
            {...props}
          />

          {suffix && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--t2-text-secondary)]">
              {suffix}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-[var(--t2-error)] flex items-center gap-1">
            <span>⚠️</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
