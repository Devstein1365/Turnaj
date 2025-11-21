import React from "react";

const FilterChip = ({ label, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap
        transition-all duration-300
        ${
          active
            ? "bg-[var(--t2-primary)] text-[var(--t2-on-primary)]"
            : "bg-[var(--t2-surface)] text-[var(--t2-text-secondary)] border border-[var(--t2-border)] hover:border-[var(--t2-primary)]"
        }
      `}
    >
      {label}
    </button>
  );
};

export default FilterChip;
