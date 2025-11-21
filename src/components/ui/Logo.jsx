import React from "react";

const Logo = ({ size = "md", showText = true }) => {
  const sizes = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`font-bold ${sizes[size]} text-gradient`}>⚽</div>
      {showText && (
        <div>
          <h1
            className={`font-bold ${sizes[size]} text-[var(--t2-text-primary)]`}
          >
            Turnaj
          </h1>
          <p className="text-xs text-[var(--t2-primary)] font-medium">
            Powered by T2
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
