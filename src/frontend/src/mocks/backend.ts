import type { backendInterface, AnimalType, EmotionScore } from "../backend";

export const mockBackend: backendInterface = {
  claimAdmin: async () => ({ __kind__: "err", err: "mock" }),

  createAccount: async () => ({ __kind__: "ok", ok: null }),

  deleteFeedbackEntry: async () => ({ __kind__: "ok", ok: null }),

  deleteUser: async () => ({ __kind__: "ok", ok: null }),

  getAnalytics: async () => ({
    totalEmotionResults: 0n,
    totalFeedback: 0n,
    totalUsers: 2n,
    totalAnimalResults: 1n,
    animalResultsCount: 1n,
    emotionResultsCount: 0n,
    darkSideResultsCount: 0n,
  }),

  getAppConfig: async () => ({
    adminPrincipal: "",
    isDraftMode: false,
  }),

  getMyAccount: async (_token: string) => ({
    __kind__: "ok",
    ok: {
      id: "mock-user-1",
      name: "Demo User",
      email: "demo@example.com",
      age: 28n,
      gender: "prefer not to say",
      createdAt: BigInt(Date.now()),
      lastLogin: BigInt(Date.now()),
      animalArchetype: undefined,
      emotionResult: undefined,
      darkSideResult: undefined,
    },
  }),

  getMyProfile: async () => null,

  getMyAnimalResults: async (_token: string) => ({
    __kind__: "ok",
    ok: [],
  }),

  getMyEmotionResults: async (_token: string) => ({
    __kind__: "ok",
    ok: [],
  }),

  getMyDarkSideResults: async (_token: string) => ({
    __kind__: "ok",
    ok: [],
  }),

  adminGetUserResults: async (_email: string) => ({
    __kind__: "ok",
    ok: {
      animal: [],
      emotion: [],
      darkSide: [],
    },
  }),

  adminGetAllResultCounts: async () => ({
    __kind__: "ok",
    ok: {
      totalUsers: 2n,
      animalResults: 1n,
      emotionResults: 0n,
      darkSideResults: 0n,
    },
  }),

  listAllUsers: async () => [
    {
      id: "mock-user-1",
      name: "Demo User",
      email: "demo@example.com",
      age: 28n,
      gender: "prefer not to say",
      createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 7),
      lastLogin: BigInt(Date.now()),
      passwordHash: "***",
      animalArchetype: undefined,
      emotionResult: undefined,
      darkSideResult: undefined,
    },
    {
      id: "mock-user-2",
      name: "Alex Rivera",
      email: "alex@example.com",
      age: 34n,
      gender: "male",
      createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 3),
      lastLogin: BigInt(Date.now() - 1000 * 60 * 60 * 2),
      passwordHash: "***",
      animalArchetype: undefined,
      emotionResult: undefined,
      darkSideResult: undefined,
    },
  ],

  listFeedback: async () => [
    {
      id: "feedback-1",
      userEmail: "demo@example.com",
      feedback: "This app is incredibly insightful! The animal archetypes really resonated with me.",
      timestamp: BigInt(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
      id: "feedback-2",
      userEmail: "alex@example.com",
      feedback: "I love the emotion quiz. The philosophical connections are a great touch.",
      timestamp: BigInt(Date.now() - 1000 * 60 * 60 * 24),
    },
  ],

  login: async (_email: string, _password: string) => ({
    __kind__: "ok",
    ok: {
      token: "mock-token-" + Date.now(),
      expiresAt: BigInt(Date.now() + 1000 * 60 * 60 * 24),
      email: _email,
    },
  }),

  logout: async () => undefined,

  saveAnimalResult: async (_token: string, _animalType: AnimalType, _score: bigint) => ({
    __kind__: "ok",
    ok: "mock-result-id",
  }),

  saveEmotionResult: async (_token: string, _scores: Array<EmotionScore>) => ({
    __kind__: "ok",
    ok: null,
  }),

  saveEmotionResultEntry: async (_token: string, _emotionType: string, _score: number) => ({
    __kind__: "ok",
    ok: "mock-emotion-id",
  }),

  saveDarkSideResultEntry: async (_token: string, _personalityType: string, _dominantPercentage: number, _fullResultJson: string) => ({
    __kind__: "ok",
    ok: "mock-dark-side-id",
  }),

  saveMyProfile: async (_archetype: AnimalType) => undefined,

  setDraftMode: async (_isDraft: boolean) => ({ __kind__: "ok", ok: null }),

  getDarkSideResult: async (_token: string) => ({
    __kind__: "ok" as const,
    ok: null,
  }),

  saveDarkSideResult: async (_token: string, _scores: Array<import("../backend").DarkSideScore>) => ({
    __kind__: "ok" as const,
    ok: null,
  }),

  submitFeedback: async (_feedback: string, _userEmail: string) => ({
    __kind__: "ok",
    ok: null,
  }),

  getSecurityQuestion: async (_email: string) => "What was the name of your first pet?",

  resetPasswordWithSecurityQuestion: async (
    _email: string,
    _question: string,
    _answer: string,
    _newPassword: string,
  ) => ({ __kind__: "ok" as const, ok: null }),

  verifySecurityQuestion: async (_email: string, _answer: string) => true,

  getSecurityHint: async (_email: string) => null,

  getSecurityQuestionUpdatedAt: async (_token: string) => ({
    __kind__: "ok" as const,
    ok: null as bigint | null,
  }),

  updateSecurityQuestion: async (
    _token: string,
    _newQuestion: string,
    _newAnswer: string,
    _newHint: string,
  ) => ({ __kind__: "ok" as const, ok: null }),

  adminGetAllAnimalResults: async () => ({
    __kind__: "ok" as const,
    ok: [],
  }),

  adminGetAllEmotionResults: async () => ({
    __kind__: "ok" as const,
    ok: [],
  }),

  adminGetAllSevenSinsResults: async () => ({
    __kind__: "ok" as const,
    ok: [],
  }),

  getMySevenSinsResults: async (_token: string) => ({
    __kind__: "ok" as const,
    ok: [],
  }),

  saveSevenSinsResult: async (
    _token: string,
    _name: string,
    _pride: number,
    _greed: number,
    _wrath: number,
    _envy: number,
    _gluttony: number,
    _lust: number,
    _sloth: number,
    _dominantSin: string,
  ) => ({ __kind__: "ok" as const, ok: "mock-seven-sins-id" }),
};
