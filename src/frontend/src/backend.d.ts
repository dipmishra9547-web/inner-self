import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DarkSideResultSummary {
    topTypes: Array<DarkSideScore>;
    takenAt: bigint;
}
export interface UserAccountAdmin {
    id: string;
    age: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    darkSideResult?: DarkSideResultSummary;
    gender: string;
    passwordHash: string;
    lastLogin: bigint;
    animalArchetype?: AnimalType;
    emotionResult?: EmotionResultSummary;
}
export type Timestamp = bigint;
export interface AppAnalytics {
    animalResultsCount: bigint;
    totalEmotionResults: bigint;
    darkSideResultsCount: bigint;
    totalFeedback: bigint;
    totalUsers: bigint;
    emotionResultsCount: bigint;
    totalAnimalResults: bigint;
}
export type UserId__1 = Principal;
export interface EmotionResultSummary {
    takenAt: bigint;
    topEmotions: Array<EmotionScore>;
}
export interface UserAccount {
    id: string;
    age: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    darkSideResult?: DarkSideResultSummary;
    gender: string;
    lastLogin: bigint;
    animalArchetype?: AnimalType;
    securityQuestionUpdatedAt?: bigint;
    emotionResult?: EmotionResultSummary;
}
export interface SevenSinsResultEntry {
    id: bigint;
    userId: UserId;
    envy: number;
    dominantSin: string;
    lust: number;
    name: string;
    createdAt: bigint;
    gluttony: number;
    sloth: number;
    greed: number;
    pride: number;
    wrath: number;
}
export interface ResultCounts {
    darkSideResults: bigint;
    emotionResults: bigint;
    animalResults: bigint;
    totalUsers: bigint;
}
export interface FeedbackEntry {
    id: string;
    userEmail: string;
    feedback: string;
    timestamp: bigint;
}
export interface DarkSideScore {
    count: bigint;
    darkType: DarkSideType;
    percentage: number;
}
export type UserId = string;
export interface EmotionResultEntry {
    id: bigint;
    emotionType: string;
    userId: UserId;
    createdAt: bigint;
    score: number;
}
export interface UserResultsAdmin {
    emotion: Array<EmotionResultEntry>;
    animal: Array<AnimalResultEntry>;
    darkSide: Array<DarkSideResultEntry>;
}
export interface SessionToken {
    token: string;
    expiresAt: bigint;
    email: string;
}
export interface DarkSideResultEntry {
    id: bigint;
    fullResultJson: string;
    userId: UserId;
    createdAt: bigint;
    personalityType: string;
    dominantPercentage: number;
}
export interface EmotionScore {
    emotion: EmotionType;
    count: bigint;
    percentage: number;
}
export interface AdminConfig {
    adminPrincipal: string;
    isDraftMode: boolean;
}
export interface UserProfile {
    userId: UserId__1;
    takenAt: Timestamp;
    archetype: AnimalType;
}
export interface AnimalResultEntry {
    id: bigint;
    userId: UserId;
    createdAt: bigint;
    score: bigint;
    animalType: AnimalType;
}
export enum AnimalType {
    Fox = "Fox",
    Owl = "Owl",
    Sheep = "Sheep",
    Elephant = "Elephant",
    Bear = "Bear",
    Lion = "Lion",
    Wolf = "Wolf",
    Shepherd = "Shepherd",
    GoldenRetriever = "GoldenRetriever",
    Otter = "Otter",
    Beaver = "Beaver",
    Dolphin = "Dolphin"
}
export enum DarkSideType {
    Manipulator = "Manipulator",
    Sociopath = "Sociopath",
    IntrovertedThinker = "IntrovertedThinker",
    Psychopath = "Psychopath",
    ExtravertedThinker = "ExtravertedThinker",
    ExtravertedFeeler = "ExtravertedFeeler",
    IntrovertedFeeler = "IntrovertedFeeler"
}
export enum EmotionType {
    Awe = "Awe",
    Sadness = "Sadness",
    Fear = "Fear",
    Guilt = "Guilt",
    Love = "Love",
    Peace = "Peace",
    Desire = "Desire",
    Anger = "Anger",
    Happiness = "Happiness",
    Anxiety = "Anxiety"
}
export interface backendInterface {
    adminGetAllAnimalResults(): Promise<{
        __kind__: "ok";
        ok: Array<AnimalResultEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllEmotionResults(): Promise<{
        __kind__: "ok";
        ok: Array<EmotionResultEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllResultCounts(): Promise<{
        __kind__: "ok";
        ok: ResultCounts;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllSevenSinsResults(): Promise<{
        __kind__: "ok";
        ok: Array<SevenSinsResultEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetUserResults(userEmail: string): Promise<{
        __kind__: "ok";
        ok: UserResultsAdmin;
    } | {
        __kind__: "err";
        err: string;
    }>;
    claimAdmin(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createAccount(email: string, password: string, name: string, age: bigint, gender: string, securityQuestion: string, securityAnswer: string, securityHint: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteFeedbackEntry(id: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteUser(email: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAnalytics(): Promise<AppAnalytics>;
    getAppConfig(): Promise<AdminConfig>;
    getDarkSideResult(token: string): Promise<{
        __kind__: "ok";
        ok: DarkSideResultSummary | null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyAccount(token: string): Promise<{
        __kind__: "ok";
        ok: UserAccount;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyAnimalResults(token: string): Promise<{
        __kind__: "ok";
        ok: Array<AnimalResultEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyDarkSideResults(token: string): Promise<{
        __kind__: "ok";
        ok: Array<DarkSideResultEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyEmotionResults(token: string): Promise<{
        __kind__: "ok";
        ok: Array<EmotionResultEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyProfile(): Promise<UserProfile | null>;
    getMySevenSinsResults(token: string): Promise<{
        __kind__: "ok";
        ok: Array<SevenSinsResultEntry>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getSecurityHint(email: string): Promise<string | null>;
    getSecurityQuestion(email: string): Promise<string | null>;
    getSecurityQuestionUpdatedAt(token: string): Promise<{
        __kind__: "ok";
        ok: bigint | null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listAllUsers(): Promise<Array<UserAccountAdmin>>;
    listFeedback(): Promise<Array<FeedbackEntry>>;
    login(email: string, password: string): Promise<{
        __kind__: "ok";
        ok: SessionToken;
    } | {
        __kind__: "err";
        err: string;
    }>;
    logout(token: string): Promise<void>;
    resetPasswordWithSecurityQuestion(email: string, question: string, answer: string, newPassword: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveAnimalResult(token: string, animalType: AnimalType, score: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveDarkSideResult(token: string, scores: Array<DarkSideScore>): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveDarkSideResultEntry(token: string, personalityType: string, dominantPercentage: number, fullResultJson: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveEmotionResult(token: string, scores: Array<EmotionScore>): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveEmotionResultEntry(token: string, emotionType: string, score: number): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveMyProfile(archetype: AnimalType): Promise<void>;
    saveSevenSinsResult(token: string, name: string, pride: number, greed: number, wrath: number, envy: number, gluttony: number, lust: number, sloth: number, dominantSin: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setDraftMode(isDraft: boolean): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitFeedback(feedback: string, userEmail: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateSecurityQuestion(token: string, newQuestion: string, newAnswer: string, newHint: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    verifySecurityQuestion(email: string, answer: string): Promise<boolean>;
}
