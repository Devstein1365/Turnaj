// App Context for Turnaj × T2 (Team, League, and UI State)
import React, { createContext, useContext, useState } from "react";
import { TEAM_BUDGET } from "../utils/constants";

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Team state
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [currentLeague, setCurrentLeague] = useState(null);
  const [teamBudget, setTeamBudget] = useState(TEAM_BUDGET);

  // Toast state
  const [toast, setToast] = useState(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Team management functions
  const addPlayer = (player) => {
    setSelectedPlayers((prev) => [...prev, player]);
  };

  const removePlayer = (playerId) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.id !== playerId));
  };

  const clearTeam = () => {
    setSelectedPlayers([]);
  };

  const setTeam = (players) => {
    setSelectedPlayers(players);
  };

  const isPlayerSelected = (playerId) => {
    return selectedPlayers.some((p) => p.id === playerId);
  };

  const getTotalCost = () => {
    return selectedPlayers.reduce((sum, player) => sum + player.price, 0);
  };

  const getRemainingBudget = () => {
    return teamBudget - getTotalCost();
  };

  const getPlayersByPosition = (position) => {
    return selectedPlayers.filter((p) => p.position === position);
  };

  const canAddPlayer = (player) => {
    // Check if team is full
    if (selectedPlayers.length >= 11) {
      return { valid: false, reason: "Team is full (11/11 players)" };
    }

    // Check if player is already selected
    if (isPlayerSelected(player.id)) {
      return { valid: false, reason: "Player already selected" };
    }

    // Check budget
    if (getRemainingBudget() < player.price) {
      return { valid: false, reason: "Insufficient budget" };
    }

    // Check club limit (max 3 players from same club)
    const sameClubCount = selectedPlayers.filter(
      (p) => p.club === player.club
    ).length;
    if (sameClubCount >= 3) {
      return { valid: false, reason: `Maximum 3 players from ${player.club}` };
    }

    return { valid: true };
  };

  // Toast management
  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });
  };

  const hideToast = () => {
    setToast(null);
  };

  const value = {
    // Team state
    selectedPlayers,
    currentLeague,
    teamBudget,

    // Team functions
    addPlayer,
    removePlayer,
    clearTeam,
    setTeam,
    isPlayerSelected,
    getTotalCost,
    getRemainingBudget,
    getPlayersByPosition,
    canAddPlayer,
    setCurrentLeague,

    // Toast
    toast,
    showToast,
    hideToast,

    // Loading
    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
