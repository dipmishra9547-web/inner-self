import { useActor } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { createActor } from "../backend";
import type {
  AnimalResultEntry,
  DarkSideResultEntry,
  EmotionResultEntry,
  ResultCounts,
  SevenSinsResultEntry,
  UserAccount,
  UserResultsAdmin,
} from "../types/auth";

// ─── Auth Context ───────────────────────────────────────────────────────────

export interface AuthContextValue {
  isLoggedIn: boolean;
  isAdmin: boolean;
  email: string | null;
  name: string | null;
  token: string | null;
  account: UserAccount | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    age: number,
    gender: string,
  ) => Promise<void>;
  refresh: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  isAdmin: false,
  email: null,
  name: null,
  token: null,
  account: null,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  refresh: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Admin principal check ──────────────────────────────────────────────────

export function useIsAdmin(): boolean {
  const { identity, loginStatus } = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);
  const { data } = useQuery<string>({
    queryKey: ["appConfig"],
    queryFn: async () => {
      if (!actor) return "";
      const config = await actor.getAppConfig();
      return config.adminPrincipal;
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });

  if (loginStatus !== "success" || !identity) return false;
  const principal = identity.getPrincipal().toText();
  return !!data && data !== "" && data === principal;
}

// ─── Session persistence helpers ────────────────────────────────────────────

const SESSION_KEY = "innerself_session";

export interface StoredSession {
  token: string;
  email: string;
  name: string;
  expiresAt: number;
}

export function getStoredSession(): StoredSession | null {
  try {
    // Support both old and new key for migration
    const raw =
      localStorage.getItem(SESSION_KEY) ??
      localStorage.getItem("animalmind_session");
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredSession;
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("animalmind_session");
      return null;
    }
    // Migrate old key to new key silently
    if (!localStorage.getItem(SESSION_KEY)) {
      localStorage.setItem(SESSION_KEY, raw);
      localStorage.removeItem("animalmind_session");
    }
    return session;
  } catch {
    return null;
  }
}

export function storeSession(session: StoredSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.removeItem("animalmind_session");
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("animalmind_session");
}

// ─── useAuthActions hook (used inside AuthProvider) ──────────────────────────

export function useAuthActions() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }) => {
      if (!actor) throw new Error("Not connected to backend");
      const result = await actor.login(email, password);
      if (result.__kind__ === "err") throw new Error(result.err);
      const session = result as {
        __kind__: "ok";
        ok: { token: string; expiresAt: bigint; email: string };
      };
      return session.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async (token: string) => {
      if (!actor) return;
      await actor.logout(token);
    },
    onSuccess: () => {
      clearSession();
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      name,
      age,
      gender,
      securityQuestion = "",
      securityAnswer = "",
    }: {
      email: string;
      password: string;
      name: string;
      age: number;
      gender: string;
      securityQuestion?: string;
      securityAnswer?: string;
    }) => {
      if (!actor) throw new Error("Not connected to backend");
      const result = await actor.createAccount(
        email,
        password,
        name,
        BigInt(age),
        gender,
        securityQuestion,
        securityAnswer,
        "",
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
  });

  return { loginMutation, logoutMutation, signupMutation };
}

// ─── useAuthActionsWithSecurityQuestion: security question recovery ─────────

export function useAuthActionsWithSecurityQuestion() {
  const { actor } = useActor(createActor);

  const signup = async (
    email: string,
    password: string,
    name: string,
    age: number,
    gender: string,
    securityQuestion: string,
    securityAnswer: string,
    securityHint = "",
  ): Promise<void> => {
    if (!actor) throw new Error("Not connected to backend");
    const result = await actor.createAccount(
      email,
      password,
      name,
      BigInt(age),
      gender,
      securityQuestion,
      securityAnswer,
      securityHint,
    );
    if (result.__kind__ === "err") throw new Error(result.err);
  };

  const getSecurityQuestion = async (email: string): Promise<string | null> => {
    if (!actor) throw new Error("Not connected to backend");
    const result = await actor.getSecurityQuestion(email);
    // Motoko optional ?Text comes back as [] or [value]
    if (Array.isArray(result)) {
      return result.length > 0 ? result[0] : null;
    }
    return result ?? null;
  };

  const getSecurityHint = async (email: string): Promise<string | null> => {
    if (!actor) throw new Error("Not connected to backend");
    const result = await actor.getSecurityHint(email);
    // Motoko optional ?Text comes back as [] or [value]
    if (Array.isArray(result)) {
      return result.length > 0 ? (result[0] ?? null) : null;
    }
    return result ?? null;
  };

  const verifySecurityQuestion = async (
    email: string,
    answer: string,
  ): Promise<boolean> => {
    if (!actor) throw new Error("Not connected to backend");
    return actor.verifySecurityQuestion(email, answer);
  };

  const resetPasswordWithSecurityQuestion = async (
    email: string,
    question: string,
    answer: string,
    newPassword: string,
  ): Promise<void> => {
    if (!actor) throw new Error("Not connected to backend");
    const result = await actor.resetPasswordWithSecurityQuestion(
      email,
      question,
      answer,
      newPassword,
    );
    if (result.__kind__ === "err") throw new Error(result.err);
  };

  const updateSecurityQuestion = async (
    token: string,
    newQuestion: string,
    newAnswer: string,
    newHint: string,
  ): Promise<{ ok: null } | { err: string }> => {
    if (!actor) throw new Error("Not connected to backend");
    const result = await actor.updateSecurityQuestion(
      token,
      newQuestion,
      newAnswer,
      newHint,
    );
    if (result.__kind__ === "err") return { err: result.err };
    return { ok: null };
  };

  /** Returns the current hint for the session user (token-based). */
  const getSecurityHintByToken = async (
    token: string,
  ): Promise<string | null> => {
    if (!actor) throw new Error("Not connected to backend");
    // getSecurityHint returns string | null directly (not a Result type)
    const result = await actor.getSecurityHint(token);
    return result ?? null;
  };

  /** Returns the timestamp (nanoseconds) when the security question was last updated, or null if never. */
  const getSecurityQuestionUpdatedAt = async (
    token: string,
  ): Promise<bigint | null> => {
    if (!actor) throw new Error("Not connected to backend");
    const result = await actor.getSecurityQuestionUpdatedAt(token);
    if (result.__kind__ === "err") return null;
    const ok = result as { __kind__: "ok"; ok: bigint | null };
    return ok.ok ?? null;
  };

  return {
    signup,
    getSecurityQuestion,
    getSecurityHint,
    getSecurityHintByToken,
    getSecurityQuestionUpdatedAt,
    verifySecurityQuestion,
    resetPasswordWithSecurityQuestion,
    updateSecurityQuestion,
  };
}

// ─── useCurrentAccount ───────────────────────────────────────────────────────

export function useCurrentAccount(token: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<UserAccount | null>({
    queryKey: ["account", token],
    queryFn: async () => {
      if (!actor || !token) return null;
      const result = await actor.getMyAccount(token);
      if (result.__kind__ === "err") return null;
      const ok = result as { __kind__: "ok"; ok: UserAccount };
      return ok.ok;
    },
    enabled: !!actor && !isFetching && !!token,
    staleTime: 1000 * 60 * 2,
  });
}

// ─── Result history hooks ────────────────────────────────────────────────────

export function useMyAnimalResults(token: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<AnimalResultEntry[]>({
    queryKey: ["myAnimalResults", token],
    queryFn: async () => {
      if (!actor || !token) return [];
      const result = await actor.getMyAnimalResults(token);
      if (result.__kind__ === "err") return [];
      const ok = result as { __kind__: "ok"; ok: AnimalResultEntry[] };
      return ok.ok;
    },
    enabled: !!actor && !isFetching && !!token,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyEmotionResults(token: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<EmotionResultEntry[]>({
    queryKey: ["myEmotionResults", token],
    queryFn: async () => {
      if (!actor || !token) return [];
      const result = await actor.getMyEmotionResults(token);
      if (result.__kind__ === "err") return [];
      const ok = result as { __kind__: "ok"; ok: EmotionResultEntry[] };
      return ok.ok;
    },
    enabled: !!actor && !isFetching && !!token,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyDarkSideResults(token: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<DarkSideResultEntry[]>({
    queryKey: ["myDarkSideResults", token],
    queryFn: async () => {
      if (!actor || !token) return [];
      const result = await actor.getMyDarkSideResults(token);
      if (result.__kind__ === "err") return [];
      const ok = result as { __kind__: "ok"; ok: DarkSideResultEntry[] };
      return ok.ok;
    },
    enabled: !!actor && !isFetching && !!token,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminUserResults(email: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<UserResultsAdmin | null>({
    queryKey: ["adminUserResults", email],
    queryFn: async () => {
      if (!actor || !email) return null;
      const result = await actor.adminGetUserResults(email);
      if (result.__kind__ === "err") return null;
      const ok = result as { __kind__: "ok"; ok: UserResultsAdmin };
      return ok.ok;
    },
    enabled: !!actor && !isFetching && !!email,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminSevenSinsResults() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SevenSinsResultEntry[]>({
    queryKey: ["adminSevenSinsResults"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const actorRecord = actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >;
        const result = await actorRecord.adminGetAllSevenSinsResults?.();
        if (!result) return [];
        const r = result as {
          __kind__: string;
          ok?: SevenSinsResultEntry[];
          err?: string;
        };
        if (r.__kind__ === "err") return [];
        return (r.ok ?? []) as SevenSinsResultEntry[];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminAllAnimalResults() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<AnimalResultEntry[]>({
    queryKey: ["adminAllAnimalResults"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.adminGetAllAnimalResults();
        if (result.__kind__ === "err") return [];
        const ok = result as { __kind__: "ok"; ok: AnimalResultEntry[] };
        return ok.ok ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminAllEmotionResults() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<EmotionResultEntry[]>({
    queryKey: ["adminAllEmotionResults"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.adminGetAllEmotionResults();
        if (result.__kind__ === "err") return [];
        const ok = result as { __kind__: "ok"; ok: EmotionResultEntry[] };
        return ok.ok ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminResultCounts() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ResultCounts | null>({
    queryKey: ["adminResultCounts"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.adminGetAllResultCounts();
      if (result.__kind__ === "err") return null;
      const ok = result as { __kind__: "ok"; ok: ResultCounts };
      return ok.ok;
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}
