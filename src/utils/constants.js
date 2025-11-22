// Turnaj × T2 Constants

// API Configuration
export const API_BASE_URL = "/api"; // Update with actual API URL when available
export const API_TIMEOUT = 30000; // 30 seconds

// Auth Configuration
export const OTP_LENGTH = 6;
export const OTP_RESEND_COOLDOWN = 30; // seconds
export const MAX_OTP_ATTEMPTS = 3;
export const TOKEN_STORAGE_KEY = "turnaj_auth_token";
export const USER_STORAGE_KEY = "turnaj_user_data";

// Nigerian Phone Number Formats
export const NIGERIA_COUNTRY_CODE = "+234";
export const NIGERIA_DIAL_CODE = "234";

// Nigerian MSISDN Validation
// Accepts: 0XXXXXXXXXX (11 digits) or 234XXXXXXXXXX (12 digits) or +234XXXXXXXXXX (13 chars)
export const NIGERIA_PHONE_REGEX =
  /^(0[789]\d{9}|234[789]\d{9}|\+234[789]\d{9})$/;

// Valid Nigerian network prefixes (MTN, GLO, Airtel, 9mobile/T2)
export const VALID_PREFIXES = [
  "0803",
  "0806",
  "0703",
  "0706",
  "0813",
  "0816",
  "0810",
  "0814",
  "0903",
  "0906", // MTN
  "0805",
  "0807",
  "0705",
  "0815",
  "0811",
  "0905", // GLO
  "0802",
  "0808",
  "0708",
  "0812",
  "0901",
  "0902",
  "0904",
  "0907",
  "0912", // Airtel
  "0809",
  "0817",
  "0818",
  "0909",
  "0908", // 9mobile/T2
];

// Fantasy Team Configuration
export const TEAM_SIZE = 11;
export const TEAM_BUDGET = 100_000_000; // £100M in pence
export const MAX_PLAYERS_PER_CLUB = 3;

// Team Positions
export const POSITIONS = {
  GK: "GK",
  DEF: "DEF",
  MID: "MID",
  FWD: "FWD",
};

export const POSITION_LIMITS = {
  GK: { min: 1, max: 1 },
  DEF: { min: 3, max: 5 },
  MID: { min: 3, max: 5 },
  FWD: { min: 1, max: 3 },
};

// League Filter Options
export const LEAGUE_FILTERS = [
  { id: "all", label: "All", value: "all" },
  { id: "epl", label: "EPL", value: "premier-league" },
  { id: "laliga", label: "La Liga", value: "la-liga" },
  { id: "ucl", label: "UCL", value: "champions-league" },
  { id: "seriea", label: "Serie A", value: "serie-a" },
  { id: "bundesliga", label: "Bundesliga", value: "bundesliga" },
];

// Leaderboard Scopes
export const LEADERBOARD_SCOPES = {
  WEEK: "week",
  SEASON: "season",
};

// Reward Types
export const REWARD_TYPES = {
  CASH: "cash",
  AIRTIME: "airtime",
  DATA: "data",
  MIXED: "mixed",
};

// Top 10 Rewards Configuration
export const TOP_10_REWARDS = [
  { rank: 1, amount: 8000, type: REWARD_TYPES.CASH, display: "₦8000" },
  { rank: 2, amount: 500, type: REWARD_TYPES.DATA, display: "500MB Data" },
  { rank: 3, amount: 2500, type: REWARD_TYPES.MIXED, display: "₦2.5k + 2GB" },
  { rank: 4, amount: 8000, type: REWARD_TYPES.CASH, display: "₦8000" },
  { rank: 5, amount: 8000, type: REWARD_TYPES.CASH, display: "₦8000" },
  { rank: 6, amount: 1024, type: REWARD_TYPES.DATA, display: "1GB Data" },
  { rank: 7, amount: 1024, type: REWARD_TYPES.DATA, display: "1GB Data" },
  { rank: 8, amount: 500, type: REWARD_TYPES.DATA, display: "500MB" },
  { rank: 9, amount: 500, type: REWARD_TYPES.DATA, display: "500MB" },
  {
    rank: 10,
    amount: 500,
    type: REWARD_TYPES.AIRTIME,
    display: "₦500 Airtime",
  },
];

// Banks List (Nigerian Banks)
export const NIGERIAN_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "063", name: "Access Bank (Diamond)" },
  { code: "035A", name: "ALAT by WEMA" },
  { code: "401", name: "ASO Savings and Loans" },
  { code: "023", name: "Citibank Nigeria" },
  { code: "050", name: "Ecobank Nigeria" },
  { code: "562", name: "Ekondo Microfinance Bank" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "214", name: "First City Monument Bank" },
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "301", name: "Jaiz Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "526", name: "Parallex Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "101", name: "Providus Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "068", name: "Standard Chartered Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "100", name: "Suntrust Bank" },
  { code: "302", name: "TAJ Bank" },
  { code: "032", name: "Union Bank of Nigeria" },
  { code: "033", name: "United Bank For Africa" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
];

// Airtime/Data Bundle Options
export const BUNDLE_OPTIONS = [
  {
    id: "airtime-500",
    label: "₦500 Airtime",
    value: 500,
    type: REWARD_TYPES.AIRTIME,
  },
  {
    id: "airtime-1000",
    label: "₦1,000 Airtime",
    value: 1000,
    type: REWARD_TYPES.AIRTIME,
  },
  {
    id: "airtime-2000",
    label: "₦2,000 Airtime",
    value: 2000,
    type: REWARD_TYPES.AIRTIME,
  },
  {
    id: "data-500mb",
    label: "500MB Data",
    value: 500,
    type: REWARD_TYPES.DATA,
  },
  { id: "data-1gb", label: "1GB Data", value: 1024, type: REWARD_TYPES.DATA },
  { id: "data-2gb", label: "2GB Data", value: 2048, type: REWARD_TYPES.DATA },
  { id: "data-5gb", label: "5GB Data", value: 5120, type: REWARD_TYPES.DATA },
];

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_PHONE: "Enter a valid Nigerian mobile number.",
  INVALID_OTP: "Incorrect code. Please try again.",
  OTP_EXPIRED: "Code has expired. Request a new one.",
  MAX_ATTEMPTS: "We've sent a new code. Please check your SMS.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  RATE_LIMIT: "Too many attempts. Please try again later.",
  BUDGET_EXCEEDED: "You do not have enough funds to add this player.",
  TEAM_SIZE_ERROR: "Select 11 players to continue.",
  MAX_PER_CLUB_ERROR: "You can only have 3 players from the same club.",
  POSITION_LIMIT_ERROR: "Position limit exceeded.",
  NOT_ELIGIBLE: "Place in the top 10 to unlock rewards.",
  ALREADY_CLAIMED: "You have already claimed this reward.",
  SERVER_ERROR: "Something went wrong. Please try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  OTP_SENT: "Code sent successfully!",
  TEAM_SAVED: "Team saved successfully!",
  REWARD_CLAIMED: "Reward claimed successfully!",
  CASH_PROCESSING: "Cash will be processed within 24-72 hrs.",
  AIRTIME_PROCESSING: "Top-up will be delivered in minutes.",
};

// Form Placeholders
export const PLACEHOLDERS = {
  PHONE: "916 054 2481",
  OTP: "• • • • • •",
  ACCOUNT_NUMBER: "0123456789",
  SEARCH_LEAGUES: "Search for a team or league...",
  SEARCH_PLAYERS: "Search players...",
};

// Toast Duration
export const TOAST_DURATION = 3000; // 3 seconds

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};
