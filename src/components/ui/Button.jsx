import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  fullWidth = false,
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-[var(--t2-radius-md)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[var(--t2-primary)] text-[var(--t2-on-primary)] hover:bg-[var(--t2-primary-hover)] active:scale-95",
    secondary:
      "bg-transparent border-2 border-[var(--t2-primary)] text-[var(--t2-primary)] hover:bg-[var(--t2-primary)] hover:text-[var(--t2-on-primary)] active:scale-95",
    ghost:
      "bg-transparent text-[var(--t2-primary)] hover:bg-[var(--t2-surface)] active:scale-95",
    danger: "bg-[var(--t2-error)] text-white hover:opacity-90 active:scale-95",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-3 text-base min-h-[48px]",
    lg: "px-8 py-4 text-lg min-h-[56px]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
