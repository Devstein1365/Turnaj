// Create Team Page with Random Select
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiX } from "react-icons/fi";
import { getPlayers, generateRandomTeam, saveTeam } from "../services/mockApi";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import {
  POSITIONS,
  TEAM_SIZE,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/constants";
import { formatPrice } from "../utils/validators";
import PlayerCard from "../components/PlayerCard";
import Button from "../components/ui/Button";
import BottomNav from "../components/BottomNav";

const CreateTeam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedPlayers,
    currentLeague,
    addPlayer,
    removePlayer,
    setTeam,
    clearTeam,
    isPlayerSelected,
    getTotalCost,
    getRemainingBudget,
    canAddPlayer,
    showToast,
  } = useApp();

  const [activePosition, setActivePosition] = useState("GK");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentLeague) {
      navigate("/leagues");
      return;
    }
    fetchPlayers(activePosition);
  }, [activePosition, currentLeague, navigate]);

  const fetchPlayers = async (position) => {
    try {
      setLoading(true);
      const response = await getPlayers({ position });
      setPlayers(response.players);
    } catch (error) {
      console.error("Failed to fetch players:", error);
      showToast(error.message || "Failed to load players", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = (player) => {
    const canAdd = canAddPlayer(player);

    if (!canAdd.valid) {
      showToast(canAdd.reason, "error");
      return;
    }

    addPlayer(player);
  };

  const handleRemovePlayer = (playerId) => {
    removePlayer(playerId);
  };

  const handleRandomSelect = async () => {
    try {
      setGenerating(true);
      const response = await generateRandomTeam();
      setTeam(response.team);
      showToast("Random team generated!", "success");
    } catch (error) {
      console.error("Failed to generate random team:", error);
      showToast(error.message || "Failed to generate team", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTeam = async () => {
    if (selectedPlayers.length !== TEAM_SIZE) {
      showToast(ERROR_MESSAGES.TEAM_SIZE_ERROR, "error");
      return;
    }

    try {
      setSaving(true);
      await saveTeam({
        userId: user.id,
        leagueId: currentLeague.id,
        players: selectedPlayers,
      });
      showToast(SUCCESS_MESSAGES.TEAM_SAVED, "success");
      setTimeout(() => navigate("/leagues"), 1500);
    } catch (error) {
      console.error("Failed to save team:", error);
      showToast(error.message || ERROR_MESSAGES.SERVER_ERROR, "error");
    } finally {
      setSaving(false);
    }
  };

  const positionTabs = Object.values(POSITIONS);
  const budgetRemaining = getRemainingBudget();
  const budgetPercentUsed = ((getTotalCost() / 100000000) * 100).toFixed(1);

  // Get club counts from selected players
  const getClubCount = (clubName) => {
    return selectedPlayers.filter((p) => p.club === clubName).length;
  };

  // Check if player's club has reached limit
  const isClubAtLimit = (player) => {
    const count = getClubCount(player.club);
    return count >= 3 && !isPlayerSelected(player.id);
  };

  return (
    <div className="mobile-container min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--t2-bg)] border-b border-[var(--t2-border)] px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/leagues")}
            className="p-2 hover:bg-[var(--t2-surface)] rounded-lg transition-colors"
          >
            <FiChevronLeft className="text-2xl text-[var(--t2-text-primary)]" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[var(--t2-text-primary)]">
              Create Team
            </h1>
            <p className="text-sm text-[var(--t2-text-secondary)]">
              {currentLeague?.name}
            </p>
          </div>
        </div>

        {/* Position Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {positionTabs.map((position) => (
            <button
              key={position}
              onClick={() => setActivePosition(position)}
              className={`px-4 py-2 font-semibold text-sm rounded-full whitespace-nowrap transition-all ${
                activePosition === position
                  ? "bg-[var(--t2-primary)] text-[var(--t2-on-primary)]"
                  : "bg-[var(--t2-surface)] text-[var(--t2-text-secondary)] hover:text-[var(--t2-primary)]"
              }`}
            >
              {position}
            </button>
          ))}
        </div>
      </div>

      {/* Club Limit Warning */}
      {selectedPlayers.length > 0 &&
        (() => {
          const clubsAtLimit = [
            ...new Set(selectedPlayers.map((p) => p.club)),
          ].filter((club) => getClubCount(club) >= 3);

          if (clubsAtLimit.length > 0) {
            return (
              <div className="px-6 pb-4">
                <div className="p-3 bg-[var(--t2-warning)]/10 border border-[var(--t2-warning)] rounded-[var(--t2-radius-md)] flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--t2-warning)] mb-1">
                      Club Limit Reached
                    </p>
                    <p className="text-xs text-[var(--t2-text-secondary)]">
                      You have 3 players from: {clubsAtLimit.join(", ")}. Cannot
                      add more from{" "}
                      {clubsAtLimit.length === 1 ? "this club" : "these clubs"}.
                    </p>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()}

      {/* Players List */}
      <div className="px-6 pb-6 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[var(--t2-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--t2-text-secondary)]">
              Loading players...
            </p>
          </div>
        ) : (
          players.map((player) => {
            const clubAtLimit = isClubAtLimit(player);
            return (
              <div key={player.id} className="relative">
                {clubAtLimit && (
                  <div className="absolute -top-1 -right-1 z-10 bg-[var(--t2-warning)] text-[var(--t2-on-primary)] text-xs font-bold px-2 py-0.5 rounded-full">
                    Club Limit
                  </div>
                )}
                <PlayerCard
                  player={player}
                  onAdd={() => handleAddPlayer(player)}
                  onRemove={() => handleRemovePlayer(player.id)}
                  isSelected={isPlayerSelected(player.id)}
                  disabled={
                    clubAtLimit ||
                    (budgetRemaining < player.price &&
                      !isPlayerSelected(player.id))
                  }
                />
              </div>
            );
          })
        )}
      </div>

      {/* Selected Players Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--t2-surface)] border-t-2 border-[var(--t2-border)] p-6 max-w-[390px] mx-auto">
        {/* Selected Players Pills */}
        {selectedPlayers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--t2-bg)] border border-[var(--t2-border)] rounded-full"
              >
                <span className="text-sm font-medium text-[var(--t2-text-primary)]">
                  {player.name.split(" ").pop()}
                </span>
                <button
                  onClick={() => handleRemovePlayer(player.id)}
                  className="text-[var(--t2-text-secondary)] hover:text-[var(--t2-error)] transition-colors"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-[var(--t2-text-secondary)]">
              {selectedPlayers.length}/{TEAM_SIZE} Players
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-[var(--t2-text-primary)]">
                Budget:
              </span>
              <span
                className={`text-lg font-bold ${
                  budgetRemaining < 0
                    ? "text-[var(--t2-error)]"
                    : "text-[var(--t2-primary)]"
                }`}
              >
                {formatPrice(budgetRemaining)} Left
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--t2-text-secondary)]">Used</p>
            <p className="text-2xl font-bold text-[var(--t2-text-primary)]">
              {budgetPercentUsed}%
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleRandomSelect}
            variant="secondary"
            size="md"
            fullWidth
            loading={generating}
            disabled={saving}
          >
            Random Select
          </Button>
          <Button
            onClick={handleSaveTeam}
            variant="primary"
            size="md"
            fullWidth
            loading={saving}
            disabled={selectedPlayers.length !== TEAM_SIZE || generating}
          >
            Save Team
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default CreateTeam;
