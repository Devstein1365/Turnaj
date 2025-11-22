// Leagues Landing Page
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { getLeagues } from "../services/mockApi";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { LEAGUE_FILTERS, PLACEHOLDERS } from "../utils/constants";
import FilterChip from "../components/FilterChip";

const LeaguesLanding = () => {
  const navigate = useNavigate();
  const { setCurrentLeague, showToast } = useApp();
  const { logout } = useAuth();

  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchLeagues();
  }, [activeFilter, searchQuery]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const response = await getLeagues({
        league: activeFilter,
        search: searchQuery,
      });
      setLeagues(response.leagues);
    } catch (error) {
      console.error("Failed to fetch leagues:", error);
      showToast(error.message || "Failed to load leagues", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeague = (league) => {
    setCurrentLeague(league);
    navigate("/create-team");
  };

  const handleViewLeague = (league) => {
    setCurrentLeague(league);
    navigate("/create-team");
  };

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    navigate("/");
  };

  const menuItems = [
    {
      icon: "🏆",
      label: "Global Leaderboard",
      onClick: () => {
        setMenuOpen(false);
        navigate("/leaderboard");
      },
    },
    {
      icon: "📊",
      label: "Weekly Rewards",
      onClick: () => {
        setMenuOpen(false);
        navigate("/leaderboard/rewards");
      },
    },
    {
      icon: "🎁",
      label: "My Rewards",
      onClick: () => {
        setMenuOpen(false);
        navigate("/rewards/claim");
      },
    },
    {
      icon: "🚪",
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className="mobile-container min-h-screen pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--t2-bg)] border-b border-[var(--t2-border)] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <h1 className="text-xl font-bold text-[var(--t2-text-primary)]">
              Leagues
            </h1>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-[var(--t2-surface)] rounded-lg transition-colors"
            >
              {menuOpen ? (
                <FiX className="text-2xl text-[var(--t2-text-primary)]" />
              ) : (
                <FiMenu className="text-2xl text-[var(--t2-text-primary)]" />
              )}
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--t2-surface)] border border-[var(--t2-border)] rounded-[var(--t2-radius-md)] shadow-lg overflow-hidden z-20">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      item.danger
                        ? "text-[var(--t2-error)] hover:bg-[var(--t2-error)]/10"
                        : "text-[var(--t2-text-primary)] hover:bg-[var(--t2-border)]"
                    } ${
                      index !== menuItems.length - 1
                        ? "border-b border-[var(--t2-border)]"
                        : ""
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--t2-text-secondary)]" />
          <input
            type="search"
            placeholder={PLACEHOLDERS.SEARCH_LEAGUES}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--t2-surface)] border border-[var(--t2-border)] rounded-[var(--t2-radius-md)] text-[var(--t2-text-primary)] placeholder:text-[var(--t2-text-tertiary)] focus:outline-none focus:border-[var(--t2-primary)] transition-colors"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-6 py-4 overflow-x-auto">
        <div className="flex gap-2">
          {LEAGUE_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              label={filter.label}
              active={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            />
          ))}
        </div>
      </div>

      {/* Leagues List */}
      <div className="px-6 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[var(--t2-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--t2-text-secondary)]">
              Loading leagues...
            </p>
          </div>
        ) : leagues.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-[var(--t2-text-primary)] mb-2">
              No leagues found
            </h3>
            <p className="text-[var(--t2-text-secondary)]">
              Please check back later or try a different search.
            </p>
          </div>
        ) : (
          leagues.map((league) => (
            <LeagueCard
              key={league.id}
              league={league}
              onJoin={() => handleJoinLeague(league)}
              onView={() => handleViewLeague(league)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// League Card Component
const LeagueCard = ({ league, onJoin, onView }) => {
  const isAlmostFull = league.progress >= 80;
  const isFull = league.currentPlayers >= league.totalPlayers;

  return (
    <div className="bg-[var(--t2-surface)] rounded-[var(--t2-radius-md)] p-5 border border-[var(--t2-border)] hover:border-[var(--t2-primary)] transition-colors">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[var(--t2-border)] flex items-center justify-center text-2xl flex-shrink-0">
          {league.crest}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-[var(--t2-text-primary)] truncate">
            {league.name}
          </h3>
          <span className="inline-block px-2 py-0.5 bg-[var(--t2-primary)]/20 text-[var(--t2-primary)] text-xs font-semibold rounded-full mt-1">
            {league.leagueLabel}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--t2-text-secondary)]">
            {league.currentPlayers}/{league.totalPlayers} Players
          </span>
          <span
            className={
              isAlmostFull
                ? "text-[var(--t2-warning)]"
                : "text-[var(--t2-text-secondary)]"
            }
          >
            {league.slotsLeft} slots left
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--t2-border)] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isAlmostFull ? "bg-[var(--t2-warning)]" : "bg-[var(--t2-primary)]"
            }`}
            style={{ width: `${league.progress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {isFull ? (
          <button
            onClick={onView}
            className="flex-1 px-6 py-3 bg-[var(--t2-surface)] border-2 border-[var(--t2-border)] text-[var(--t2-text-primary)] font-semibold rounded-[var(--t2-radius-md)] hover:border-[var(--t2-primary)] transition-all"
          >
            View
          </button>
        ) : (
          <>
            <button
              onClick={onView}
              className="flex-1 px-6 py-3 bg-transparent border-2 border-[var(--t2-border)] text-[var(--t2-text-secondary)] font-semibold rounded-[var(--t2-radius-md)] hover:border-[var(--t2-primary)] hover:text-[var(--t2-primary)] transition-all"
            >
              View
            </button>
            <button
              onClick={onJoin}
              className="flex-1 px-6 py-3 bg-[var(--t2-primary)] text-[var(--t2-on-primary)] font-semibold rounded-[var(--t2-radius-md)] hover:bg-[var(--t2-primary-hover)] transition-all"
            >
              Join League
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaguesLanding;
