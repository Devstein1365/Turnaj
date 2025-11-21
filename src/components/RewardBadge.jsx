import React from "react";
import { REWARD_TYPES } from "../utils/constants";

const RewardBadge = ({ type, display, size = "md" }) => {
  const icons = {
    [REWARD_TYPES.CASH]: "₦",
    [REWARD_TYPES.AIRTIME]: "📞",
    [REWARD_TYPES.DATA]: "📶",
    [REWARD_TYPES.MIXED]: "🎁",
  };

  const colors = {
    [REWARD_TYPES.CASH]:
      "bg-[var(--t2-success)]/20 text-[var(--t2-success)] border-[var(--t2-success)]",
    [REWARD_TYPES.AIRTIME]:
      "bg-[var(--t2-info)]/20 text-[var(--t2-info)] border-[var(--t2-info)]",
    [REWARD_TYPES.DATA]:
      "bg-[var(--t2-warning)]/20 text-[var(--t2-warning)] border-[var(--t2-warning)]",
    [REWARD_TYPES.MIXED]:
      "bg-[var(--t2-primary)]/20 text-[var(--t2-primary)] border-[var(--t2-primary)]",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold border-2
        ${colors[type] || colors[REWARD_TYPES.CASH]}
        ${sizes[size]}
      `}
    >
      <span>{icons[type]}</span>
      <span>{display}</span>
    </div>
  );
};

export default RewardBadge;
