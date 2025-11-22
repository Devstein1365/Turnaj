// Pull-to-Refresh Indicator Component
import React from "react";

const PullToRefreshIndicator = ({
  pullDistance,
  isPulling,
  threshold = 80,
}) => {
  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const isReady = pullDistance >= threshold;

  if (pullDistance === 0) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200"
      style={{
        transform: `translateY(${Math.min(pullDistance, threshold + 20)}px)`,
        opacity: pullDistance > 0 ? 1 : 0,
      }}
    >
      <div className="bg-[var(--t2-surface)] border border-[var(--t2-border)] rounded-full p-3 shadow-lg">
        {isPulling ? (
          <div className="w-6 h-6 border-3 border-[var(--t2-primary)] border-t-transparent rounded-full animate-spin" />
        ) : (
          <div className="relative w-6 h-6">
            <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="var(--t2-border)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke={
                  isReady ? "var(--t2-primary)" : "var(--t2-text-secondary)"
                }
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${(progress / 100) * 62.83} 62.83`}
                className="transition-all duration-200"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-xs font-bold transition-colors ${
                  isReady
                    ? "text-[var(--t2-primary)]"
                    : "text-[var(--t2-text-secondary)]"
                }`}
              >
                ↓
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PullToRefreshIndicator;
