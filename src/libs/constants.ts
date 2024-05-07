/// Solana RPC Endpoint
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC as string;

/// Huddle Project Id
export const HUDDLE_PROJECT_ID = process.env
  .NEXT_PUBLIC_HUDDLE_PROJECT_ID as string;

/// Local Storage Token
export const LOCAL_STORAGE = "mediastreamtoken";

/// API Config
export const API_CONFIG = process.env.NEXT_PUBLIC_API_CONFIG as string;

/// Protected Routes
export const PROTECTED_ROUTES = ["/api/auth/verify-user"];

/// Admin Wallets
export const ADMIN_WALLETS = [
  "Hn1VkWoSciuCY1cU5B9cmXGeVerpWVNhX2mY37XtQeSW",
  "Hk2pA4QMP2N2zBe1MGCYu1DkwAUnbmRTvDrQTxJmu9i5",
  "BHpRVje4KuQxqaZvXvSyFXi6YKGh71EqSaekYBRfUV4Z",
];
