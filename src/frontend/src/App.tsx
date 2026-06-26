import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  Outlet,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import {
  AuthContext,
  clearSession,
  getStoredSession,
  storeSession,
  useAuthActions,
  useCurrentAccount,
  useIsAdmin,
} from "./hooks/useAuth";
import type { AuthContextValue } from "./hooks/useAuth";
import { CompatibilityPage } from "./pages/CompatibilityPage";
import { HomePage } from "./pages/HomePage";
import { QuizPage } from "./pages/QuizPage";
import { ResultPage } from "./pages/ResultPage";

const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const SignupPage = lazy(() =>
  import("./pages/SignupPage").then((m) => ({ default: m.SignupPage })),
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const EmotionQuizPage = lazy(() =>
  import("./pages/EmotionQuizPage").then((m) => ({
    default: m.EmotionQuizPage,
  })),
);
const EmotionResultPage = lazy(() =>
  import("./pages/EmotionResultPage").then((m) => ({
    default: m.EmotionResultPage,
  })),
);
const GuidePage = lazy(() =>
  import("./pages/GuidePage").then((m) => ({ default: m.GuidePage })),
);
const AdminPage = lazy(() =>
  import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })),
);
const DarkSideQuizPage = lazy(() =>
  import("./pages/DarkSideQuizPage").then((m) => ({
    default: m.DarkSideQuizPage,
  })),
);
const DarkSideResultPage = lazy(() =>
  import("./pages/DarkSideResultPage").then((m) => ({
    default: m.DarkSideResultPage,
  })),
);
const MyResultsPage = lazy(() =>
  import("./pages/MyResultsPage").then((m) => ({
    default: m.MyResultsPage,
  })),
);
const AdminUserDetailPage = lazy(() =>
  import("./pages/AdminUserDetailPage").then((m) => ({
    default: m.AdminUserDetailPage,
  })),
);
const ForgotPasswordPage = lazy(() =>
  import("./pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const SevenSinsQuizPage = lazy(() =>
  import("./pages/SevenSinsQuizPage").then((m) => ({
    default: m.SevenSinsQuizPage,
  })),
);
const SevenSinsResultPage = lazy(() =>
  import("./pages/SevenSinsResultPage").then((m) => ({
    default: m.SevenSinsResultPage,
  })),
);

// ─── Loading fallback ────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

// ─── Routes ─────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const session = getStoredSession();
    if (!session) throw redirect({ to: "/login" });
  },
  component: HomePage,
});

const animalQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/animal-quiz",
  beforeLoad: () => {
    const session = getStoredSession();
    if (!session) throw redirect({ to: "/login" });
  },
  component: QuizPage,
});

const resultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/result",
  component: ResultPage,
});

const compatibilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compatibility",
  component: CompatibilityPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  ),
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SignupPage />
    </Suspense>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  beforeLoad: () => {
    const session = getStoredSession();
    if (!session) throw redirect({ to: "/login" });
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProfilePage />
    </Suspense>
  ),
});

const myResultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-results",
  beforeLoad: () => {
    const session = getStoredSession();
    if (!session) throw redirect({ to: "/login" });
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <MyResultsPage />
    </Suspense>
  ),
});

const emotionQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/emotion-quiz",
  beforeLoad: () => {
    const session = getStoredSession();
    if (!session) throw redirect({ to: "/login" });
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <EmotionQuizPage />
    </Suspense>
  ),
});

const emotionResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/emotion-result",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <EmotionResultPage />
    </Suspense>
  ),
});

const guideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guide",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <GuidePage />
    </Suspense>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminPage />
    </Suspense>
  ),
});

const adminUserDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/user/$email",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminUserDetailPage />
    </Suspense>
  ),
});

const darkSideQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dark-side-quiz",
  beforeLoad: () => {
    const session = getStoredSession();
    if (!session) throw redirect({ to: "/login" });
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DarkSideQuizPage />
    </Suspense>
  ),
});

const darkSideResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dark-side-result",
  beforeLoad: () => {
    const session = getStoredSession();
    if (!session) throw redirect({ to: "/login" });
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DarkSideResultPage />
    </Suspense>
  ),
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ForgotPasswordPage />
    </Suspense>
  ),
});

const sevenSinsQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seven-sins-quiz",
  beforeLoad: () => {
    const session = getStoredSession();
    if (!session) throw redirect({ to: "/login" });
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SevenSinsQuizPage />
    </Suspense>
  ),
});

const sevenSinsResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seven-sins-result",
  beforeLoad: () => {
    const session = getStoredSession();
    if (!session) throw redirect({ to: "/login" });
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SevenSinsResultPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  quizRoute,
  animalQuizRoute,
  resultRoute,
  compatibilityRoute,
  loginRoute,
  signupRoute,
  profileRoute,
  myResultsRoute,
  emotionQuizRoute,
  emotionResultRoute,
  guideRoute,
  adminRoute,
  adminUserDetailRoute,
  darkSideQuizRoute,
  darkSideResultRoute,
  forgotPasswordRoute,
  sevenSinsQuizRoute,
  sevenSinsResultRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── Auth Provider ────────────────────────────────────────────────────────────

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => getStoredSession()?.token ?? null,
  );
  const [sessionEmail, setSessionEmail] = useState<string | null>(
    () => getStoredSession()?.email ?? null,
  );
  const [sessionName, setSessionName] = useState<string | null>(
    () => getStoredSession()?.name ?? null,
  );

  const isAdmin = useIsAdmin();
  const { loginMutation, logoutMutation, signupMutation } = useAuthActions();
  const { data: account } = useCurrentAccount(token);

  // Sync name from fetched account
  useEffect(() => {
    if (account?.name) setSessionName(account.name);
  }, [account]);

  const login = async (email: string, password: string) => {
    const sessionToken = await loginMutation.mutateAsync({ email, password });
    setToken(sessionToken.token);
    setSessionEmail(sessionToken.email);
    storeSession({
      token: sessionToken.token,
      email: sessionToken.email,
      name: email,
      expiresAt: Number(sessionToken.expiresAt),
    });
  };

  const logout = async () => {
    if (token) {
      await logoutMutation.mutateAsync(token);
    }
    clearSession();
    setToken(null);
    setSessionEmail(null);
    setSessionName(null);
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    age: number,
    gender: string,
  ) => {
    await signupMutation.mutateAsync({ email, password, name, age, gender });
  };

  const refresh = () => {
    const session = getStoredSession();
    setToken(session?.token ?? null);
    setSessionEmail(session?.email ?? null);
    setSessionName(session?.name ?? null);
  };

  const value: AuthContextValue = {
    isLoggedIn: !!token,
    isAdmin,
    email: account?.email ?? sessionEmail,
    name: account?.name ?? sessionName,
    token,
    account: account ?? null,
    login,
    logout,
    signup,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
