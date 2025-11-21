// Mock API Service for Turnaj × T2
// Replace with actual API calls when backend is ready

import {
  OTP_RESEND_COOLDOWN,
  TEAM_SIZE,
  TEAM_BUDGET,
  TOP_10_REWARDS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../utils/constants";

// Simulate network delay
const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database
const mockUsers = new Map();

// Mock OTP storage
const mockOTPs = new Map();

// Mock teams storage
const mockTeams = new Map();

// Mock leaderboard data
let mockLeaderboardData = generateMockLeaderboard();

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export const sendOTP = async (msisdn) => {
  await delay(800);

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP with expiry (5 minutes)
  mockOTPs.set(msisdn, {
    code: otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  });

  // In real app, this would trigger SMS
  console.log(`📱 OTP for ${msisdn}: ${otp}`);

  return {
    success: true,
    ttlSeconds: OTP_RESEND_COOLDOWN,
    message: SUCCESS_MESSAGES.OTP_SENT,
  };
};

export const verifyOTP = async (msisdn, code) => {
  await delay(600);

  const otpData = mockOTPs.get(msisdn);

  if (!otpData) {
    throw new Error(ERROR_MESSAGES.INVALID_OTP);
  }

  if (Date.now() > otpData.expiresAt) {
    mockOTPs.delete(msisdn);
    throw new Error(ERROR_MESSAGES.OTP_EXPIRED);
  }

  otpData.attempts += 1;

  if (otpData.code !== code) {
    if (otpData.attempts >= 3) {
      mockOTPs.delete(msisdn);
      throw new Error(ERROR_MESSAGES.MAX_ATTEMPTS);
    }
    throw new Error(
      `${ERROR_MESSAGES.INVALID_OTP} (${3 - otpData.attempts} attempts left)`
    );
  }

  // Generate mock auth token
  const token = `mock_token_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Create/update user
  const user = {
    id: `user_${Date.now()}`,
    msisdn,
    username: `Player${Math.floor(Math.random() * 10000)}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${msisdn}`,
    createdAt: Date.now(),
  };

  mockUsers.set(msisdn, user);
  mockOTPs.delete(msisdn);

  return {
    success: true,
    token,
    user,
  };
};

// ============================================================================
// LEAGUES ENDPOINTS
// ============================================================================

export const getLeagues = async (filters = {}) => {
  await delay(600);

  const leagues = generateMockLeagues();

  // Apply filters
  let filtered = leagues;

  if (filters.league && filters.league !== "all") {
    filtered = filtered.filter((l) => l.league === filters.league);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.name.toLowerCase().includes(searchLower) ||
        l.leagueLabel.toLowerCase().includes(searchLower)
    );
  }

  return {
    success: true,
    leagues: filtered,
    total: filtered.length,
  };
};

export const getLeagueById = async (leagueId) => {
  await delay(400);

  const leagues = generateMockLeagues();
  const league = leagues.find((l) => l.id === leagueId);

  if (!league) {
    throw new Error("League not found");
  }

  return {
    success: true,
    league,
  };
};

// ============================================================================
// PLAYERS ENDPOINTS
// ============================================================================

export const getPlayers = async (filters = {}) => {
  await delay(700);

  const players = generateMockPlayers();

  let filtered = players;

  if (filters.position) {
    filtered = filtered.filter((p) => p.position === filters.position);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.club.toLowerCase().includes(searchLower)
    );
  }

  return {
    success: true,
    players: filtered,
  };
};

export const generateRandomTeam = async (budget = TEAM_BUDGET) => {
  await delay(1200);

  const allPlayers = generateMockPlayers();
  const team = [];

  // Pick 1 GK
  const goalkeepers = allPlayers.filter((p) => p.position === "GK");
  team.push(goalkeepers[Math.floor(Math.random() * goalkeepers.length)]);

  // Pick 4 DEF
  const defenders = allPlayers.filter((p) => p.position === "DEF");
  for (let i = 0; i < 4; i++) {
    team.push(defenders[Math.floor(Math.random() * defenders.length)]);
  }

  // Pick 4 MID
  const midfielders = allPlayers.filter((p) => p.position === "MID");
  for (let i = 0; i < 4; i++) {
    team.push(midfielders[Math.floor(Math.random() * midfielders.length)]);
  }

  // Pick 2 FWD
  const forwards = allPlayers.filter((p) => p.position === "FWD");
  for (let i = 0; i < 2; i++) {
    team.push(forwards[Math.floor(Math.random() * forwards.length)]);
  }

  const totalCost = team.reduce((sum, p) => sum + p.price, 0);

  return {
    success: true,
    team,
    totalCost,
    budgetRemaining: budget - totalCost,
  };
};

export const saveTeam = async (teamData) => {
  await delay(800);

  const { userId, leagueId, players } = teamData;

  if (players.length !== TEAM_SIZE) {
    throw new Error(ERROR_MESSAGES.TEAM_SIZE_ERROR);
  }

  const totalCost = players.reduce((sum, p) => sum + p.price, 0);

  if (totalCost > TEAM_BUDGET) {
    throw new Error(ERROR_MESSAGES.BUDGET_EXCEEDED);
  }

  const teamId = `team_${Date.now()}`;
  mockTeams.set(teamId, {
    id: teamId,
    userId,
    leagueId,
    players,
    totalCost,
    createdAt: Date.now(),
  });

  return {
    success: true,
    teamId,
    message: SUCCESS_MESSAGES.TEAM_SAVED,
  };
};

// ============================================================================
// LEADERBOARD ENDPOINTS
// ============================================================================

export const getLeaderboard = async (scope = "week") => {
  await delay(600);

  return {
    success: true,
    scope,
    leaderboard: mockLeaderboardData,
    updatedAt: Date.now(),
  };
};

export const getUserRank = async (userId) => {
  await delay(400);

  const userRank = mockLeaderboardData.find(
    (entry) => entry.userId === userId
  ) || {
    rank: 28,
    username: "You",
    points: 64,
    userId,
  };

  return {
    success: true,
    ...userRank,
  };
};

// ============================================================================
// REWARDS ENDPOINTS
// ============================================================================

export const getUserRewards = async (userId) => {
  await delay(500);

  // Check if user is in top 10
  const userEntry = mockLeaderboardData.find(
    (entry) => entry.userId === userId
  );
  const rank = userEntry ? userEntry.rank : 28;
  const isEligible = rank <= 10;

  const reward = isEligible
    ? TOP_10_REWARDS.find((r) => r.rank === rank)
    : null;

  return {
    success: true,
    eligible: isEligible,
    rank,
    reward: reward || null,
    claimed: false,
  };
};

export const claimReward = async (claimData) => {
  await delay(1500);

  const { userId, type, payload } = claimData;

  // Validate eligibility
  const rewardsData = await getUserRewards(userId);

  if (!rewardsData.eligible) {
    throw new Error(ERROR_MESSAGES.NOT_ELIGIBLE);
  }

  if (rewardsData.claimed) {
    throw new Error(ERROR_MESSAGES.ALREADY_CLAIMED);
  }

  // Generate reference number
  const reference = `TRN${Date.now()}${Math.floor(Math.random() * 1000)}`;

  return {
    success: true,
    reference,
    type,
    message:
      type === "cash"
        ? SUCCESS_MESSAGES.CASH_PROCESSING
        : SUCCESS_MESSAGES.AIRTIME_PROCESSING,
    processedAt: Date.now(),
  };
};

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

function generateMockLeagues() {
  return [
    {
      id: "league_1",
      name: "EPL Champions League",
      league: "premier-league",
      leagueLabel: "Premier League",
      badge: "EPL",
      crest: "⚽",
      totalPlayers: 20,
      currentPlayers: 15,
      slotsLeft: 5,
      progress: 75,
    },
    {
      id: "league_2",
      name: "La Liga Titans",
      league: "la-liga",
      leagueLabel: "La Liga",
      badge: "La Liga",
      crest: "🏆",
      totalPlayers: 10,
      currentPlayers: 8,
      slotsLeft: 2,
      progress: 80,
    },
    {
      id: "league_3",
      name: "Champions Challenge",
      league: "champions-league",
      leagueLabel: "UEFA Champions League",
      badge: "UCL",
      crest: "⭐",
      totalPlayers: 20,
      currentPlayers: 19,
      slotsLeft: 1,
      progress: 95,
    },
    {
      id: "league_4",
      name: "Serie A Masters",
      league: "serie-a",
      leagueLabel: "Serie A",
      badge: "Serie A",
      crest: "🇮🇹",
      totalPlayers: 15,
      currentPlayers: 10,
      slotsLeft: 5,
      progress: 67,
    },
    {
      id: "league_5",
      name: "Bundesliga Elite",
      league: "bundesliga",
      leagueLabel: "Bundesliga",
      badge: "Bundesliga",
      crest: "🇩🇪",
      totalPlayers: 12,
      currentPlayers: 7,
      slotsLeft: 5,
      progress: 58,
    },
  ];
}

function generateMockPlayers() {
  const players = [
    // Goalkeepers
    {
      id: "p1",
      name: "Alisson",
      club: "Liverpool",
      position: "GK",
      price: 5_500_000,
      form: 1,
      formTrend: "up",
      avatar: "🧤",
    },
    {
      id: "p2",
      name: "Ederson",
      club: "Man City",
      position: "GK",
      price: 5_000_000,
      form: 0,
      formTrend: "neutral",
      avatar: "🧤",
    },
    {
      id: "p3",
      name: "Pickford",
      club: "Everton",
      position: "GK",
      price: 4_500_000,
      form: -1,
      formTrend: "down",
      avatar: "🧤",
    },

    // Defenders
    {
      id: "p4",
      name: "Trent A-A",
      club: "Liverpool",
      position: "DEF",
      price: 8_000_000,
      form: 2,
      formTrend: "up",
      avatar: "🛡️",
    },
    {
      id: "p5",
      name: "Son",
      club: "Tottenham",
      position: "DEF",
      price: 7_500_000,
      form: 1,
      formTrend: "up",
      avatar: "🛡️",
    },
    {
      id: "p6",
      name: "Watkins",
      club: "Aston Villa",
      position: "DEF",
      price: 6_500_000,
      form: 0,
      formTrend: "neutral",
      avatar: "🛡️",
    },
    {
      id: "p7",
      name: "Van Dijk",
      club: "Liverpool",
      position: "DEF",
      price: 6_000_000,
      form: 1,
      formTrend: "up",
      avatar: "🛡️",
    },
    {
      id: "p8",
      name: "Saliba",
      club: "Arsenal",
      position: "DEF",
      price: 5_500_000,
      form: 1,
      formTrend: "up",
      avatar: "🛡️",
    },
    {
      id: "p9",
      name: "Gabriel",
      club: "Arsenal",
      position: "DEF",
      price: 5_000_000,
      form: 0,
      formTrend: "neutral",
      avatar: "🛡️",
    },

    // Midfielders
    {
      id: "p10",
      name: "Bukayo Saka",
      club: "Arsenal",
      position: "MID",
      price: 9_500_000,
      form: 2,
      formTrend: "up",
      avatar: "⚡",
    },
    {
      id: "p11",
      name: "Cole Palmer",
      club: "Chelsea",
      position: "MID",
      price: 8_000_000,
      form: 2,
      formTrend: "up",
      avatar: "⚡",
    },
    {
      id: "p12",
      name: "Kevin De Bruyne",
      club: "Man City",
      position: "MID",
      price: 11_500_000,
      form: -1,
      formTrend: "down",
      avatar: "⚡",
    },
    {
      id: "p13",
      name: "Bruno Fernandes",
      club: "Man Utd",
      position: "MID",
      price: 8_500_000,
      form: 0,
      formTrend: "neutral",
      avatar: "⚡",
    },
    {
      id: "p14",
      name: "Odegaard",
      club: "Arsenal",
      position: "MID",
      price: 8_000_000,
      form: 1,
      formTrend: "up",
      avatar: "⚡",
    },
    {
      id: "p15",
      name: "Rice",
      club: "Arsenal",
      position: "MID",
      price: 7_500_000,
      form: 1,
      formTrend: "up",
      avatar: "⚡",
    },

    // Forwards
    {
      id: "p16",
      name: "Erling Haaland",
      club: "Man City",
      position: "FWD",
      price: 14_000_000,
      form: 3,
      formTrend: "up",
      avatar: "⚽",
    },
    {
      id: "p17",
      name: "Mohamed Salah",
      club: "Liverpool",
      position: "FWD",
      price: 12_500_000,
      form: -1,
      formTrend: "down",
      avatar: "⚽",
    },
    {
      id: "p18",
      name: "Darwin Nunez",
      club: "Liverpool",
      position: "FWD",
      price: 9_000_000,
      form: 0,
      formTrend: "neutral",
      avatar: "⚽",
    },
    {
      id: "p19",
      name: "Isak",
      club: "Newcastle",
      position: "FWD",
      price: 8_500_000,
      form: 2,
      formTrend: "up",
      avatar: "⚽",
    },
    {
      id: "p20",
      name: "Watkins",
      club: "Aston Villa",
      position: "FWD",
      price: 8_000_000,
      form: 1,
      formTrend: "up",
      avatar: "⚽",
    },
  ];

  return players;
}

function generateMockLeaderboard() {
  const usernames = [
    "T2Champion",
    "FantasyFanatic",
    "GoalGetter",
    "TheSpecialOne",
    "PitchPerfect",
    "PlayerSix",
    "PlayerSeven",
    "PlayerEight",
    "PlayerNine",
    "PlayerTen",
    "PlayerEleven",
    "PlayerTwelve",
    "PlayerThirteen",
    "PlayerFourteen",
    "PlayerFifteen",
  ];

  return usernames.map((username, index) => ({
    rank: index + 1,
    userId: `user_${index + 1}`,
    username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    points: 128 - index * 3,
  }));
}

// Export all functions
export default {
  sendOTP,
  verifyOTP,
  getLeagues,
  getLeagueById,
  getPlayers,
  generateRandomTeam,
  saveTeam,
  getLeaderboard,
  getUserRank,
  getUserRewards,
  claimReward,
};
