import React, { useEffect } from "react";
import { TOAST_DURATION } from "../utils/constants";

const Toast = ({
  message,
  type = "info",
  onClose,
  duration = TOAST_DURATION,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const styles = {
    success: "bg-[var(--t2-success)] text-[var(--t2-on-primary)]",
    error: "bg-[var(--t2-error)] text-white",
    warning: "bg-[var(--t2-warning)] text-[var(--t2-on-primary)]",
    info: "bg-[var(--t2-surface)] text-[var(--t2-text-primary)] border-2 border-[var(--t2-border)]",
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down max-w-[calc(100%-2rem)]">
      <div
        className={`${styles[type]} px-6 py-4 rounded-[var(--t2-radius-md)] shadow-lg flex items-center gap-3 min-w-[280px]`}
      >
        <span className="text-xl font-bold">{icons[type]}</span>
        <p className="font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-xl opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
