// Weekly Leaderboard with Rewards
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { getLeaderboard, getUserRewards } from "../services/mockApi";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { TOP_10_REWARDS } from "../utils/constants";
import LeaderboardRow from "../components/LeaderboardRow";
import RewardBadge from "../components/RewardBadge";
import Button from "../components/ui/Button";

const WeeklyLeaderboardRewards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [leaderboard, setLeaderboard] = useState([]);
  const [userRewards, setUserRewards] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leaderboardRes, rewardsRes] = await Promise.all([
        getLeaderboard("week"),
        getUserRewards(user.id),
      ]);
      setLeaderboard(leaderboardRes.leaderboard.slice(0, 10));
      setUserRewards(rewardsRes);
    } catch (error) {
      console.error("Failed to fetch rewards data:", error);
      showToast(error.message || "Failed to load rewards", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = () => {
    if (!userRewards?.eligible) {
      showToast("You must be in the top 10 to claim rewards", "warning");
      return;
    }
    navigate("/rewards/claim");
  };

  return (
    <div className="mobile-container min-h-screen pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--t2-bg)] border-b border-[var(--t2-border)] px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--t2-surface)] rounded-lg transition-colors"
          >
            <FiChevronLeft className="text-2xl text-[var(--t2-text-primary)]" />
          </button>
          <h1 className="text-xl font-bold text-[var(--t2-text-primary)]">
            Weekly Leaderboard
          </h1>
        </div>
      </div>

      {/* Rewards Banner */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-r from-[var(--t2-primary)]/20 to-[var(--t2-accent)]/20 border-2 border-[var(--t2-primary)] rounded-[var(--t2-radius-md)] p-4 text-center">
          <p className="text-lg font-bold text-[var(--t2-text-primary)] mb-1">
            🏆 Top 10 earn rewards this week
          </p>
          <p className="text-sm text-[var(--t2-text-secondary)]">
            Finish in the top 10 to unlock cash, airtime, or data prizes
          </p>
        </div>
      </div>

      {/* Leaderboard with Rewards */}
      <div className="px-6 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[var(--t2-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--t2-text-secondary)]">
              Loading rewards...
            </p>
          </div>
        ) : (
          leaderboard.map((entry) => {
            const reward = TOP_10_REWARDS.find((r) => r.rank === entry.rank);
            const isCurrentUser = entry.userId === user.id;

            return (
              <div
                key={entry.userId}
                className={`p-4 rounded-[var(--t2-radius-md)] ${
                  isCurrentUser
                    ? "bg-[var(--t2-primary)]/10 border-2 border-[var(--t2-primary)]"
                    : "bg-[var(--t2-surface)] border border-[var(--t2-border)]"
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* Rank */}
                  <div className="w-8 text-center">
                    <span className="font-bold text-lg text-[var(--t2-text-primary)]">
                      {entry.rank}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--t2-border)] shrink-0">
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt={entry.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        👤
                      </div>
                    )}
                  </div>

                  {/* Username & Points */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--t2-text-primary)] truncate">
                      {entry.username}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-[var(--t2-primary)]">
                          (You)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-[var(--t2-text-secondary)]">
                      {entry.points} points
                    </p>
                  </div>
                </div>

                {/* Reward Badge */}
                {reward && (
                  <div className="flex items-center justify-between pl-12">
                    <RewardBadge
                      type={reward.type}
                      display={reward.display}
                      size="md"
                    />
                    {isCurrentUser && (
                      <Button
                        onClick={handleClaimReward}
                        variant="primary"
                        size="sm"
                      >
                        Claim
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Not Eligible Message */}
      {!loading && userRewards && !userRewards.eligible && (
        <div className="px-6 py-6">
          <div className="bg-[var(--t2-surface)] border border-[var(--t2-border)] rounded-[var(--t2-radius-md)] p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-lg font-bold text-[var(--t2-text-primary)] mb-2">
              You are not in the Top 10 this week.
            </p>
            <p className="text-sm text-[var(--t2-text-secondary)] mb-1">
              Current Rank: #{userRewards.rank}
            </p>
            <p className="text-sm text-[var(--t2-text-secondary)]">
              Keep playing to climb the leaderboard!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyLeaderboardRewards;
