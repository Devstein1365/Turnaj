// Global Leaderboard Page
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiAward } from "react-icons/fi";
import { getLeaderboard, getUserRank } from "../services/mockApi";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { LEADERBOARD_SCOPES } from "../utils/constants";
import LeaderboardRow from "../components/LeaderboardRow";
import Button from "../components/ui/Button";
import BottomNav from "../components/BottomNav";

const GlobalLeaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [scope, setScope] = useState(LEADERBOARD_SCOPES.WEEK);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserRank();
  }, [scope]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await getLeaderboard(scope);
      setLeaderboard(response.leaderboard);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      showToast(error.message || "Failed to load leaderboard", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    try {
      const response = await getUserRank(user.id);
      setUserRank(response);
    } catch (error) {
      console.error("Failed to fetch user rank:", error);
    }
  };

  const isUserInTopList = leaderboard.some((entry) => entry.userId === user.id);

  return (
    <div className="mobile-container min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--t2-bg)] border-b border-[var(--t2-border)] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/leagues")}
              className="p-2 hover:bg-[var(--t2-surface)] rounded-lg transition-colors"
            >
              <FiChevronLeft className="text-2xl text-[var(--t2-text-primary)]" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[var(--t2-text-primary)]">
                Global Leaderboard
              </h1>
              <p className="text-sm text-[var(--t2-text-secondary)]">
                Compete to earn weekly rewards
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/leaderboard/rewards")}
            className="p-2 hover:bg-[var(--t2-surface)] rounded-lg transition-colors"
          >
            <FiAward className="text-2xl text-[var(--t2-primary)]" />
          </button>
        </div>

        {/* Scope Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setScope(LEADERBOARD_SCOPES.WEEK)}
            className={`flex-1 py-3 font-semibold rounded-[var(--t2-radius-md)] transition-all ${
              scope === LEADERBOARD_SCOPES.WEEK
                ? "bg-[var(--t2-primary)] text-[var(--t2-on-primary)]"
                : "bg-[var(--t2-surface)] text-[var(--t2-text-secondary)]"
            }`}
          >
            This Gameweek
          </button>
          <button
            onClick={() => setScope(LEADERBOARD_SCOPES.SEASON)}
            className={`flex-1 py-3 font-semibold rounded-[var(--t2-radius-md)] transition-all ${
              scope === LEADERBOARD_SCOPES.SEASON
                ? "bg-[var(--t2-primary)] text-[var(--t2-on-primary)]"
                : "bg-[var(--t2-surface)] text-[var(--t2-text-secondary)]"
            }`}
          >
            Season
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-6 py-4 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[var(--t2-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--t2-text-secondary)]">
              Loading leaderboard...
            </p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-bold text-[var(--t2-text-primary)] mb-2">
              The game hasn't started yet!
            </h3>
            <p className="text-[var(--t2-text-secondary)] mb-6">
              Rankings will appear here once the first gameweek is complete.
            </p>
            <Button
              onClick={() => navigate("/leagues")}
              variant="primary"
              size="md"
            >
              Check Fixtures
            </Button>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <LeaderboardRow
              key={entry.userId}
              rank={entry.rank}
              username={entry.username}
              avatar={entry.avatar}
              points={entry.points}
              isCurrentUser={entry.userId === user.id}
            />
          ))
        )}
      </div>

      {/* View Rewards Button */}
      {!loading && leaderboard.length > 0 && (
        <div className="px-6 py-4">
          <Button
            onClick={() => navigate("/leaderboard/rewards")}
            variant="secondary"
            size="lg"
            fullWidth
          >
            View Rewards
          </Button>
        </div>
      )}

      {/* Sticky User Rank Footer */}
      {!loading && userRank && !isUserInTopList && (
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--t2-surface)] border-t-2 border-[var(--t2-primary)] p-4 max-w-[390px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--t2-border)] flex items-center justify-center">
                👤
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--t2-primary)]">
                  You're #{userRank.rank}
                </p>
                <p className="text-xs text-[var(--t2-text-secondary)]">
                  {userRank.points} pts
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--t2-text-secondary)]">
              Keep playing to climb!
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default GlobalLeaderboard;
