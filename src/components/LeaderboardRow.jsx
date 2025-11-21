import React from "react";

const LeaderboardRow = ({
  rank,
  username,
  avatar,
  points,
  isCurrentUser = false,
}) => {
  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-[var(--t2-radius-md)]
        ${
          isCurrentUser
            ? "bg-[var(--t2-primary)]/10 border-2 border-[var(--t2-primary)]"
            : "bg-[var(--t2-surface)]"
        }
      `}
    >
      {/* Rank */}
      <div className="w-8 text-center">
        <span className="font-bold text-[var(--t2-text-primary)]">{rank}</span>
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--t2-border)] flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">
            👤
          </div>
        )}
      </div>

      {/* Username */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[var(--t2-text-primary)] truncate">
          {username}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-[var(--t2-primary)]">(You)</span>
          )}
        </p>
      </div>

      {/* Points */}
      <div className="text-right">
        <p className="font-bold text-[var(--t2-text-primary)]">{points}</p>
        <p className="text-xs text-[var(--t2-text-secondary)]">pts</p>
      </div>
    </div>
  );
};

export default LeaderboardRow;
