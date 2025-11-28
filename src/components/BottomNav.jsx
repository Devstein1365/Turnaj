import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiAward, FiGift, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { FaTrophy } from "react-icons/fa";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { showToast } = useApp();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    navigate("/");
  };

  const navItems = [
    {
      icon: FiHome,
      label: "Leagues",
      path: "/leagues",
      onClick: () => navigate("/leagues"),
    },
    {
      icon: FaTrophy,
      label: "Leaderboard",
      path: "/leaderboard",
      onClick: () => navigate("/leaderboard"),
    },
    {
      icon: FiAward,
      label: "Rewards",
      path: "/leaderboard/rewards",
      onClick: () => navigate("/leaderboard/rewards"),
    },
    {
      icon: FiGift,
      label: "My Rewards",
      path: "/rewards/claim",
      onClick: () => navigate("/rewards/claim"),
    },
    {
      icon: FiLogOut,
      label: "Logout",
      onClick: handleLogout,
      isAction: true,
    },
  ];

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--t2-surface)] border-t border-[var(--t2-border)] max-w-[390px] mx-auto z-50">
      <div className="flex items-center justify-around px-2 py-0px">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={index}
              onClick={item.onClick}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                active
                  ? "text-[var(--t2-primary)]"
                  : item.isAction
                  ? "text-[var(--t2-error)]"
                  : "text-[var(--t2-text-secondary)] hover:text-[var(--t2-primary)]"
              }`}
            >
              <Icon
                className={`text-xl ${
                  active ? "scale-110" : ""
                } transition-transform`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
