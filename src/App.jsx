import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";
import { useApp } from "./context/AppContext";

// Pages
import MsisdnEntry from "./pages/MsisdnEntry";
import OtpVerification from "./pages/OtpVerification";
import LeaguesLanding from "./pages/LeaguesLanding";
import CreateTeam from "./pages/CreateTeam";
import GlobalLeaderboard from "./pages/GlobalLeaderboard";
import WeeklyLeaderboardRewards from "./pages/WeeklyLeaderboardRewards";
import RewardsClaim from "./pages/RewardsClaim";

// Toast Manager Component
const ToastManager = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  return (
    <Toast message={toast.message} type={toast.type} onClose={hideToast} />
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <ToastManager />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MsisdnEntry />} />
            <Route path="/otp" element={<OtpVerification />} />

            {/* Protected Routes */}
            <Route
              path="/leagues"
              element={
                <ProtectedRoute>
                  <LeaguesLanding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-team"
              element={
                <ProtectedRoute>
                  <CreateTeam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <GlobalLeaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard/rewards"
              element={
                <ProtectedRoute>
                  <WeeklyLeaderboardRewards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards/claim"
              element={
                <ProtectedRoute>
                  <RewardsClaim />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
