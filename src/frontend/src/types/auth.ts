import { EmotionType } from "./emotion";
export { EmotionType };

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  age: bigint;
  gender: string;
  createdAt: bigint;
  lastLogin: bigint;
  animalArchetype?: string;
  emotionResult?: EmotionResultSummary;
  darkSideResult?: DarkSideResultSummary;
}

export interface UserAccountAdmin extends UserAccount {
  passwordHash: string;
}

export interface SessionToken {
  token: string;
  expiresAt: bigint;
  email: string;
}

export interface EmotionScore {
  emotion: EmotionType;
  count: bigint;
  percentage: number;
}

export interface EmotionResultSummary {
  takenAt: bigint;
  topEmotions: EmotionScore[];
}

export interface DarkSideScore {
  darkType: string;
  count: bigint;
  percentage: number;
}

export interface DarkSideResultSummary {
  topTypes: DarkSideScore[];
  takenAt: bigint;
}

export interface FeedbackEntry {
  id: string;
  userEmail: string;
  feedback: string;
  timestamp: bigint;
}

export interface AdminConfig {
  adminPrincipal: string;
  isDraftMode: boolean;
}

export interface AppAnalytics {
  totalUsers: bigint;
  totalAnimalResults: bigint;
  totalEmotionResults: bigint;
  totalFeedback: bigint;
  animalResultsCount: bigint;
  emotionResultsCount: bigint;
  darkSideResultsCount: bigint;
}

export interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  email: string | null;
  name: string | null;
  token: string | null;
  account: UserAccount | null;
}

// ─── Result Entry Types (matching backend Candid types) ──────────────────────

export interface AnimalResultEntry {
  id: bigint;
  userId: unknown; // Principal
  animalType: string;
  score: bigint;
  createdAt: bigint;
}

export interface EmotionResultEntry {
  id: bigint;
  userId: unknown; // Principal
  emotionType: string;
  score: number;
  createdAt: bigint;
}

export interface DarkSideResultEntry {
  id: bigint;
  userId: unknown; // Principal
  personalityType: string;
  dominantPercentage: number;
  fullResultJson: string;
  createdAt: bigint;
}

export interface UserResultsAdmin {
  animal: AnimalResultEntry[];
  emotion: EmotionResultEntry[];
  darkSide: DarkSideResultEntry[];
}

export interface ResultCounts {
  totalUsers: bigint;
  animalResults: bigint;
  emotionResults: bigint;
  darkSideResults: bigint;
}
export interface SevenSinsResultEntry {
  id: bigint;
  userId: string;
  name: string;
  pride: number;
  greed: number;
  wrath: number;
  envy: number;
  gluttony: number;
  lust: number;
  sloth: number;
  dominantSin: string;
  createdAt: bigint;
}
