import React from "react";
import { formatPrice } from "../utils/validators";

const PlayerCard = ({ player, onAdd, onRemove, isSelected, disabled }) => {
  const { name, club, price, form, formTrend, avatar, position } = player;

  const formIndicators = {
    up: { icon: "↑", color: "text-[var(--t2-form-up)]" },
    down: { icon: "↓", color: "text-[var(--t2-form-down)]" },
    neutral: { icon: "−", color: "text-[var(--t2-form-neutral)]" },
  };

  const indicator = formIndicators[formTrend] || formIndicators.neutral;

  return (
    <div className="flex items-center gap-4 p-4 bg-[var(--t2-surface)] rounded-[var(--t2-radius-md)] hover:bg-[var(--t2-surface-hover)] transition-colors">
      {/* Player Avatar */}
      <div className="w-12 h-12 rounded-full bg-[var(--t2-border)] flex items-center justify-center text-2xl flex-shrink-0">
        {avatar}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[var(--t2-text-primary)] truncate">
          {name}
        </h4>
        <div className="flex items-center gap-2 text-sm text-[var(--t2-text-secondary)]">
          <span>{club}</span>
          <span>•</span>
          <span className="font-semibold">{formatPrice(price)}</span>
        </div>
      </div>

      {/* Form Indicator */}
      <div className={`text-2xl ${indicator.color} flex-shrink-0`}>
        {indicator.icon}
      </div>

      {/* Action Button */}
      <button
        onClick={isSelected ? onRemove : onAdd}
        disabled={disabled && !isSelected}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          text-xl font-bold flex-shrink-0
          transition-all duration-300
          ${
            isSelected
              ? "bg-[var(--t2-primary)] text-[var(--t2-on-primary)] hover:bg-[var(--t2-primary-hover)]"
              : "bg-transparent border-2 border-[var(--t2-border)] text-[var(--t2-text-secondary)] hover:border-[var(--t2-primary)] hover:text-[var(--t2-primary)]"
          }
          disabled:opacity-30 disabled:cursor-not-allowed
        `}
      >
        {isSelected ? "−" : "+"}
      </button>
    </div>
  );
};

export default PlayerCard;
