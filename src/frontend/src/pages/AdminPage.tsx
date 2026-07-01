import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Brain,
  Download,
  ExternalLink,
  Flame,
  LogIn,
  MessageSquare,
  PawPrint,
  RefreshCw,
  Settings,
  Shield,
  Skull,
  Trash2,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type {
  AppAnalytics,
  FeedbackEntry,
  UserAccountAdmin,
} from "../backend.d";
import { ARCHETYPES } from "../data/archetypes";
import { SIN_ICONS } from "../data/sevenSinsData";
import {
  useAdminAllAnimalResults,
  useAdminAllEmotionResults,
  useAdminResultCounts,
  useAdminSevenSinsResults,
  useAuth,
} from "../hooks/useAuth";
import type { AnimalType } from "../types/animals";
import type { SevenSinsResultEntry } from "../types/auth";
import {
  DARK_SIDE_CHART_COLORS,
  DARK_SIDE_ICONS,
  DARK_SIDE_PROFILES,
  type DarkSideType,
} from "../types/darkSide";
import { EMOTION_ICONS, type EmotionType } from "../types/emotion";
import type { SinType } from "../types/sevenSins";

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminTab =
  | "overview"
  | "users"
  | "feedback"
  | "sevensins"
  | "emotion"
  | "animal"
  | "settings";

// ─── Pie Chart ────────────────────────────────────────────────────────────────

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

function InlinePieChart({
  slices,
  size = 140,
}: { slices: PieSlice[]; size?: number }) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-muted-foreground font-body">No data</span>
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  let cursor = -Math.PI / 2;

  const paths = slices.map((slice) => {
    const angle = (slice.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cursor);
    const y1 = cy + r * Math.sin(cursor);
    cursor += angle;
    const x2 = cx + r * Math.cos(cursor);
    const y2 = cy + r * Math.sin(cursor);
    const large = angle > Math.PI ? 1 : 0;
    return {
      label: slice.label,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`,
      color: slice.color,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Pie chart"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="oklch(var(--border))"
        strokeWidth={1}
      />
      {paths.map((p) => (
        <path key={p.label} d={p.path} fill={p.color} opacity={0.85} />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.45} fill="oklch(var(--background))" />
    </svg>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function PieLegend({ slices, total }: { slices: PieSlice[]; total: number }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      {slices.map((sl) => (
        <div key={sl.label} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: sl.color }}
          />
          <span className="text-xs font-body text-foreground truncate">
            {sl.label}
          </span>
          <span className="text-xs font-mono text-muted-foreground ml-auto">
            {total > 0 ? Math.round((sl.value / total) * 100) : 0}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-admin">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary">{icon}</div>
        <span className="text-sm text-muted-foreground font-body">{label}</span>
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

// ─── CSV export helpers ───────────────────────────────────────────────────────

function exportUsersCSV(users: UserAccountAdmin[]) {
  const header =
    "Name,Email,Age,Gender,Animal Type,Emotion Type,Dark Side,Joined,Last Login,PasswordHash";
  const rows = users.map((u) => {
    const topEmotion = u.emotionResult?.topEmotions?.[0]?.emotion ?? "";
    const darkSide = u.darkSideResult?.topTypes?.[0]?.darkType ?? "";
    const joined = new Date(
      Number(u.createdAt) / 1_000_000,
    ).toLocaleDateString();
    const lastLogin = new Date(
      Number(u.lastLogin) / 1_000_000,
    ).toLocaleDateString();
    return [
      u.name,
      u.email,
      u.age.toString(),
      u.gender,
      u.animalArchetype ?? "",
      topEmotion,
      darkSide,
      joined,
      lastLogin,
      u.passwordHash,
    ].join(",");
  });
  download("users.csv", [header, ...rows].join("\n"));
}

function exportFeedbackCSV(feedback: FeedbackEntry[]) {
  const header = "ID,UserEmail,Feedback,Timestamp";
  const rows = feedback.map((f) =>
    [
      `"${f.id}"`,
      f.userEmail,
      `"${f.feedback.replace(/"/g, '""')}"`,
      new Date(Number(f.timestamp) / 1_000_000).toISOString(),
    ].join(","),
  );
  download("feedback.csv", [header, ...rows].join("\n"));
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Access states ────────────────────────────────────────────────────────────

function ConnectIdentity() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoading = loginStatus === "logging-in";
  return (
    <div
      className="flex-1 flex items-center justify-center px-4 py-24"
      data-ocid="admin.access_denied"
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Admin Access Only
        </h1>
        <p className="text-muted-foreground font-body text-sm mb-8 leading-relaxed">
          This dashboard is protected. Only the platform owner can access it
          using their Internet Identity.
        </p>
        <Button
          onClick={login}
          disabled={isLoading}
          className="gap-2 font-body"
          data-ocid="admin.ii_login_button"
        >
          <LogIn className="w-4 h-4" />
          {isLoading ? "Connecting…" : "Sign in with Internet Identity"}
        </Button>
      </div>
    </div>
  );
}

function Forbidden() {
  return (
    <div
      className="flex-1 flex items-center justify-center px-4 py-24"
      data-ocid="admin.forbidden"
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
          <Shield className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          403: Access Denied
        </h1>
        <p className="text-muted-foreground font-body text-sm leading-relaxed">
          Your Internet Identity is not the platform admin. Only the owner can
          access this dashboard.
        </p>
      </div>
    </div>
  );
}

// ─── Tab navigation ───────────────────────────────────────────────────────────

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
  {
    id: "feedback" as const,
    label: "Feedback",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    id: "sevensins" as const,
    label: "Seven Sins",
    icon: <Flame className="w-4 h-4" />,
  },
  {
    id: "emotion" as const,
    label: "Emotion Quiz",
    icon: <Brain className="w-4 h-4" />,
  },
  {
    id: "animal" as const,
    label: "Animal Quiz",
    icon: <PawPrint className="w-4 h-4" />,
  },
  {
    id: "settings" as const,
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

// ─── Overview Tab ─────────────────────────────────────────────────────────────

const ANIMAL_COLORS: Record<string, string> = {
  Lion: "oklch(0.72 0.17 60)",
  Otter: "oklch(0.65 0.18 155)",
  GoldenRetriever: "oklch(0.72 0.17 70)",
  Beaver: "oklch(0.58 0.14 25)",
  Wolf: "oklch(0.45 0.18 290)",
  Sheep: "oklch(0.62 0.12 200)",
  Shepherd: "oklch(0.55 0.18 30)",
  Fox: "oklch(0.65 0.19 40)",
  Owl: "oklch(0.52 0.14 50)",
  Elephant: "oklch(0.55 0.1 270)",
  Dolphin: "oklch(0.62 0.16 215)",
  Bear: "oklch(0.48 0.12 30)",
};

const SEVEN_SINS_COLORS: Record<string, string> = {
  Pride: "oklch(0.58 0.22 300)",
  Greed: "oklch(0.62 0.18 130)",
  Wrath: "oklch(0.52 0.22 22)",
  Envy: "oklch(0.55 0.2 145)",
  Gluttony: "oklch(0.65 0.18 65)",
  Lust: "oklch(0.58 0.22 10)",
  Sloth: "oklch(0.45 0.12 240)",
};

const EMOTION_COLORS: Record<string, string> = {
  Fear: "oklch(0.45 0.2 25)",
  Anger: "oklch(0.55 0.22 20)",
  Happiness: "oklch(0.72 0.17 70)",
  Sadness: "oklch(0.35 0.12 260)",
  Love: "oklch(0.58 0.18 10)",
  Anxiety: "oklch(0.52 0.16 290)",
  Desire: "oklch(0.62 0.18 65)",
  Guilt: "oklch(0.42 0.14 40)",
  Awe: "oklch(0.65 0.15 200)",
  Peace: "oklch(0.65 0.16 140)",
};

function OverviewTab({
  analytics,
  users,
  feedback,
  sevenSinsResults,
}: {
  analytics: AppAnalytics | undefined;
  users: UserAccountAdmin[];
  feedback: FeedbackEntry[];
  sevenSinsResults: SevenSinsResultEntry[];
}) {
  const { data: resultCounts } = useAdminResultCounts();

  // Build animal distribution from users list
  const animalCounts: Record<string, number> = {};
  for (const u of users) {
    if (u.animalArchetype) {
      animalCounts[u.animalArchetype] =
        (animalCounts[u.animalArchetype] ?? 0) + 1;
    }
  }
  const animalSlices: PieSlice[] = Object.entries(animalCounts).map(
    ([label, value]) => ({
      label,
      value,
      color: ANIMAL_COLORS[label] ?? "oklch(0.6 0.1 200)",
    }),
  );
  const animalTotal = animalSlices.reduce((s, sl) => s + sl.value, 0);

  // Build emotion distribution from users
  const emotionCounts: Record<string, number> = {};
  for (const u of users) {
    if (u.emotionResult?.topEmotions) {
      for (const es of u.emotionResult.topEmotions.slice(0, 3)) {
        emotionCounts[es.emotion] = (emotionCounts[es.emotion] ?? 0) + 1;
      }
    }
  }
  const emotionSlices: PieSlice[] = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({
      label,
      value,
      color: EMOTION_COLORS[label] ?? "oklch(0.6 0.1 200)",
    }));
  const emotionTotal = emotionSlices.reduce((s, sl) => s + sl.value, 0);

  // Build dark side distribution from users: use dominant (first) type per user
  const darkSideCounts: Record<string, number> = {};
  for (const u of users) {
    const dominant = u.darkSideResult?.topTypes?.[0]?.darkType;
    if (dominant) {
      darkSideCounts[dominant] = (darkSideCounts[dominant] ?? 0) + 1;
    }
  }
  const darkSideSlices: PieSlice[] = Object.entries(darkSideCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([typeKey, value]) => {
      const profile = DARK_SIDE_PROFILES[typeKey as DarkSideType];
      return {
        label: profile ? profile.archLabel : typeKey,
        value,
        color: DARK_SIDE_CHART_COLORS[typeKey as DarkSideType] ?? "#64748b",
      };
    });
  const darkSideTotal = darkSideSlices.reduce((s, sl) => s + sl.value, 0);

  // Build Seven Deadly Sins distribution from results
  const sevenSinsCounts: Record<string, number> = {};
  for (const r of sevenSinsResults) {
    if (r.dominantSin) {
      sevenSinsCounts[r.dominantSin] =
        (sevenSinsCounts[r.dominantSin] ?? 0) + 1;
    }
  }
  const sevenSinsSlices: PieSlice[] = Object.entries(sevenSinsCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({
      label,
      value,
      color: SEVEN_SINS_COLORS[label] ?? "oklch(0.6 0.1 200)",
    }));
  const sevenSinsTotal = sevenSinsSlices.reduce((s, sl) => s + sl.value, 0);

  // Prefer resultCounts for metrics; fall back to analytics
  const totalUsers = resultCounts?.totalUsers ?? analytics?.totalUsers;
  const animalResultsCount =
    resultCounts?.animalResults ?? analytics?.totalAnimalResults;
  const emotionResultsCount =
    resultCounts?.emotionResults ?? analytics?.totalEmotionResults;
  const darkSideResultsCount =
    resultCounts?.darkSideResults ?? analytics?.darkSideResultsCount;

  return (
    <div className="space-y-8" data-ocid="admin.overview_section">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<Users className="w-4 h-4" />}
          label="Total Users"
          value={totalUsers?.toString() ?? "-"}
        />
        <StatCard
          icon={<BarChart3 className="w-4 h-4" />}
          label="Animal Results"
          value={animalResultsCount?.toString() ?? "-"}
        />
        <StatCard
          icon={<BarChart3 className="w-4 h-4" />}
          label="Emotion Results"
          value={emotionResultsCount?.toString() ?? "-"}
        />
        <StatCard
          icon={<Skull className="w-4 h-4" />}
          label="Dark Side Results"
          value={darkSideResultsCount?.toString() ?? "-"}
        />
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          label="Seven Sins Results"
          value={sevenSinsResults.length.toString()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Animal archetype chart */}
        <div
          className="bg-card border border-border rounded-xl p-6 shadow-admin"
          data-ocid="admin.animal_chart"
        >
          <h3 className="font-display text-sm font-semibold text-foreground mb-5">
            Animal Archetype Distribution
          </h3>
          <div className="flex items-center gap-6">
            <InlinePieChart slices={animalSlices} size={130} />
            <PieLegend slices={animalSlices} total={animalTotal} />
          </div>
        </div>

        {/* Emotion chart */}
        <div
          className="bg-card border border-border rounded-xl p-6 shadow-admin"
          data-ocid="admin.emotion_chart"
        >
          <h3 className="font-display text-sm font-semibold text-foreground mb-5">
            Top Emotions Distribution
          </h3>
          <div className="flex items-center gap-6">
            <InlinePieChart slices={emotionSlices} size={130} />
            <PieLegend slices={emotionSlices} total={emotionTotal} />
          </div>
        </div>

        {/* Dark side distribution chart */}
        <div
          className="bg-card border border-border rounded-xl p-6 shadow-admin"
          data-ocid="admin.darkside_chart"
        >
          <h3 className="font-display text-sm font-semibold text-foreground mb-5">
            Dark Side Type Distribution
          </h3>
          {darkSideSlices.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-8 gap-2"
              data-ocid="admin.darkside_chart.empty_state"
            >
              <Skull className="w-8 h-8 text-muted-foreground opacity-30" />
              <p className="text-xs text-muted-foreground font-body text-center">
                No dark side data yet
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <InlinePieChart slices={darkSideSlices} size={130} />
              <PieLegend slices={darkSideSlices} total={darkSideTotal} />
            </div>
          )}
        </div>

        {/* Seven Deadly Sins distribution chart */}
        <div
          className="bg-card border border-border rounded-xl p-6 shadow-admin"
          data-ocid="admin.seven_sins_chart"
        >
          <h3 className="font-display text-sm font-semibold text-foreground mb-5">
            Seven Deadly Sins Distribution
          </h3>
          {sevenSinsSlices.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-8 gap-2"
              data-ocid="admin.seven_sins_chart.empty_state"
            >
              <Flame className="w-8 h-8 text-muted-foreground opacity-30" />
              <p className="text-xs text-muted-foreground font-body text-center">
                No seven sins data yet
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <InlinePieChart slices={sevenSinsSlices} size={130} />
              <PieLegend slices={sevenSinsSlices} total={sevenSinsTotal} />
            </div>
          )}
        </div>
      </div>

      {/* Recent feedback summary */}
      {feedback.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-admin">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">
            Recent Feedback
          </h3>
          <div className="space-y-3">
            {feedback.slice(0, 3).map((f, i) => (
              <div
                key={f.id}
                className="flex items-start gap-3"
                data-ocid={`admin.recent_feedback.${i + 1}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-body mb-0.5">
                    {f.userEmail}
                  </p>
                  <p className="text-sm font-body text-foreground line-clamp-2">
                    {f.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab({
  users,
  isLoading,
  onDelete,
}: {
  users: UserAccountAdmin[];
  isLoading: boolean;
  onDelete: (email: string) => void;
}) {
  return (
    <div data-ocid="admin.users_section">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-base font-semibold text-foreground">
          Registered Users{" "}
          <span className="text-muted-foreground font-body text-sm">
            ({users.length})
          </span>
        </h2>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 font-body text-xs"
          onClick={() => exportUsersCSV(users)}
          disabled={users.length === 0}
          data-ocid="admin.export_users_button"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div
          className="text-sm text-muted-foreground font-body py-12 text-center"
          data-ocid="admin.users_loading_state"
        >
          Loading users…
        </div>
      ) : users.length === 0 ? (
        <div
          className="bg-card border border-border rounded-xl py-12 text-center"
          data-ocid="admin.users_empty_state"
        >
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
          <p className="text-sm text-muted-foreground font-body">
            No users registered yet.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-admin">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Animal Type",
                    "Emotion Type",
                    "Dark Side",
                    "Joined",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => {
                  const topEmotion =
                    user.emotionResult?.topEmotions?.[0]?.emotion;
                  const topDarkSide =
                    user.darkSideResult?.topTypes?.[0]?.darkType;
                  const joined = new Date(
                    Number(user.createdAt) / 1_000_000,
                  ).toLocaleDateString();
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      data-ocid={`admin.user_row.${idx + 1}`}
                    >
                      <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">
                        <a
                          href={`/admin/user/${encodeURIComponent(user.email)}`}
                          className="hover:text-primary transition-colors flex items-center gap-1.5"
                          data-ocid={`admin.user_detail_link.${idx + 1}`}
                        >
                          {user.name}
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        {user.animalArchetype ? (
                          <Badge
                            variant="secondary"
                            className="text-xs whitespace-nowrap"
                          >
                            {user.animalArchetype}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {topEmotion ? (
                          <Badge
                            className="text-xs whitespace-nowrap"
                            style={{
                              background:
                                EMOTION_COLORS[topEmotion] ?? undefined,
                            }}
                          >
                            {topEmotion}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {topDarkSide ? (
                          <Badge
                            variant="outline"
                            className="text-xs whitespace-nowrap border-primary/40 text-primary gap-1"
                          >
                            {(() => {
                              const Icon =
                                DARK_SIDE_ICONS[topDarkSide as DarkSideType];
                              return Icon ? <Icon className="w-3 h-3" /> : null;
                            })()}
                            {topDarkSide}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {joined}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              window.open(
                                `/admin/user/${encodeURIComponent(user.email)}`,
                                "_self",
                              )
                            }
                            className="h-7 px-2 text-xs font-body text-muted-foreground hover:text-foreground"
                            data-ocid={`admin.view_user_button.${idx + 1}`}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`Delete user "${user.email}"?`))
                                onDelete(user.email);
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                            data-ocid={`admin.delete_user_button.${idx + 1}`}
                            aria-label={`Delete user ${user.email}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Feedback Tab ─────────────────────────────────────────────────────────────

function FeedbackTab({
  feedback,
  isLoading,
  onDelete,
}: {
  feedback: FeedbackEntry[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div data-ocid="admin.feedback_section">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-base font-semibold text-foreground">
          Feedback{" "}
          <span className="text-muted-foreground font-body text-sm">
            ({feedback.length})
          </span>
        </h2>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 font-body text-xs"
          onClick={() => exportFeedbackCSV(feedback)}
          disabled={feedback.length === 0}
          data-ocid="admin.export_feedback_button"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div
          className="text-sm text-muted-foreground font-body py-12 text-center"
          data-ocid="admin.feedback_loading_state"
        >
          Loading feedback…
        </div>
      ) : feedback.length === 0 ? (
        <div
          className="bg-card border border-border rounded-xl py-12 text-center"
          data-ocid="admin.feedback_empty_state"
        >
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
          <p className="text-sm text-muted-foreground font-body">
            No feedback submissions yet.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-admin">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    User Email
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-ocid={`admin.feedback_item.${idx + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(
                        Number(entry.timestamp) / 1_000_000,
                      ).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {entry.userEmail}
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-xs">
                      <p className="line-clamp-2 leading-relaxed">
                        {entry.feedback}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm("Delete this feedback entry?"))
                            onDelete(entry.id);
                        }}
                        className="text-destructive hover:bg-destructive/10 h-7 w-7 p-0 shrink-0"
                        data-ocid={`admin.delete_feedback_button.${idx + 1}`}
                        aria-label="Delete feedback"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Seven Sins Tab ────────────────────────────────────────────────────────────

const ADMIN_ALL_SINS = [
  "pride",
  "greed",
  "wrath",
  "envy",
  "gluttony",
  "lust",
  "sloth",
] as const;
type AdminSinKey = (typeof ADMIN_ALL_SINS)[number];

function SevenSinsTab({
  results,
  isLoading,
}: { results: SevenSinsResultEntry[]; isLoading: boolean }) {
  const sorted = [...results].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );
  const [expandedIds, setExpandedIds] = useState<Set<bigint>>(new Set());
  const toggleExpand = (id: bigint) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div data-ocid="admin.seven_sins_section">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-base font-semibold text-foreground">
          Seven Deadly Sins Results{" "}
          <span className="text-muted-foreground font-body text-sm">
            ({results.length})
          </span>
        </h2>
      </div>

      {isLoading ? (
        <div
          className="text-sm text-muted-foreground font-body py-12 text-center"
          data-ocid="admin.seven_sins_loading_state"
        >
          Loading results…
        </div>
      ) : results.length === 0 ? (
        <div
          className="bg-card border border-border rounded-xl py-12 text-center"
          data-ocid="admin.seven_sins_empty_state"
        >
          <Flame className="w-10 h-10 text-muted-foreground opacity-30 mx-auto" />
          <p className="text-sm text-muted-foreground font-body mt-3">
            No Seven Deadly Sins results yet.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-admin">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {["Name", "Dominant Sin", "Date", "Details"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, idx) => {
                  const isExpanded = expandedIds.has(r.id);
                  return (
                    <>
                      <tr
                        key={r.id.toString()}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        data-ocid={`admin.seven_sins_row.${idx + 1}`}
                      >
                        <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">
                          {r.name}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="text-xs border-primary/40 text-primary whitespace-nowrap"
                          >
                            {r.dominantSin}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(
                            Number(r.createdAt) / 1_000_000,
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => toggleExpand(r.id)}
                            className="text-xs text-primary hover:text-primary/80 transition-colors font-body"
                            data-ocid={`admin.seven_sins_expand_button.${idx + 1}`}
                          >
                            {isExpanded ? "Hide" : "Expand"}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr
                          key={`${r.id.toString()}-exp`}
                          className="border-b border-border/30 bg-muted/10"
                        >
                          <td colSpan={4} className="px-4 py-3">
                            <div className="grid grid-cols-4 gap-2">
                              {ADMIN_ALL_SINS.map((sin: AdminSinKey) => {
                                const Icon = SIN_ICONS[sin as SinType];
                                return (
                                  <div
                                    key={sin}
                                    className="bg-card border border-border/50 rounded-lg px-3 py-2"
                                  >
                                    <p className="text-xs text-muted-foreground font-body capitalize flex items-center gap-1.5">
                                      {Icon ? (
                                        <Icon className="w-3 h-3" />
                                      ) : null}
                                      {sin}
                                    </p>
                                    <p className="font-display text-sm font-bold text-foreground">
                                      {Math.round(r[sin])}%
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Animal Quiz Tab ────────────────────────────────────────────────────────

function AnimalResultsTab() {
  const { data: results = [], isLoading } = useAdminAllAnimalResults();
  const sorted = [...results].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  // Build distribution chart
  const animalCounts: Record<string, number> = {};
  for (const r of results) {
    const key = String(r.animalType);
    animalCounts[key] = (animalCounts[key] ?? 0) + 1;
  }
  const animalSlices: PieSlice[] = Object.entries(animalCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({
      label,
      value,
      color: ANIMAL_COLORS[label] ?? "oklch(0.6 0.1 200)",
    }));
  const animalTotal = animalSlices.reduce((s, sl) => s + sl.value, 0);

  return (
    <div data-ocid="admin.animal_section">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-base font-semibold text-foreground">
          Animal Quiz Results{" "}
          <span className="text-muted-foreground font-body text-sm">
            ({results.length})
          </span>
        </h2>
      </div>

      {/* Stat card */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-admin flex items-center gap-3 mb-6">
        <PawPrint className="w-6 h-6 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground font-body">
            Total Animal Results
          </p>
          <p className="font-display text-xl font-bold text-foreground">
            {results.length}
          </p>
        </div>
      </div>

      {/* Distribution chart */}
      {animalSlices.length > 0 && (
        <div
          className="bg-card border border-border rounded-xl p-6 shadow-admin mb-6"
          data-ocid="admin.animal_distribution_chart"
        >
          <h3 className="font-display text-sm font-semibold text-foreground mb-5">
            Animal Archetype Distribution
          </h3>
          <div className="flex items-center gap-6">
            <InlinePieChart slices={animalSlices} size={140} />
            <PieLegend slices={animalSlices} total={animalTotal} />
          </div>
        </div>
      )}

      {isLoading ? (
        <div
          className="text-sm text-muted-foreground font-body py-12 text-center"
          data-ocid="admin.animal_loading_state"
        >
          Loading results…
        </div>
      ) : results.length === 0 ? (
        <div
          className="bg-card border border-border rounded-xl py-12 text-center"
          data-ocid="admin.animal_empty_state"
        >
          <PawPrint className="w-10 h-10 text-muted-foreground opacity-30 mx-auto" />
          <p className="text-sm text-muted-foreground font-body mt-3">
            No Animal Quiz results yet.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-admin">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {["#", "Animal Type", "Date"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, idx) => (
                  <tr
                    key={r.id.toString()}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-ocid={`admin.animal_row.${idx + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs font-mono w-10">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/40 whitespace-nowrap"
                        style={{
                          borderColor:
                            ANIMAL_COLORS[String(r.animalType)] ?? undefined,
                          color:
                            ANIMAL_COLORS[String(r.animalType)] ?? undefined,
                        }}
                      >
                        {ARCHETYPES[r.animalType as AnimalType]?.emoji ?? ""}{" "}
                        {String(r.animalType)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(
                        Number(r.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Emotion Quiz Tab (dedicated results endpoint) ────────────────────────────

function EmotionResultsTab() {
  const { data: results = [], isLoading } = useAdminAllEmotionResults();
  const sorted = [...results].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  // Build distribution chart from all results
  const emotionCounts: Record<string, number> = {};
  for (const r of results) {
    const key = r.emotionType;
    emotionCounts[key] = (emotionCounts[key] ?? 0) + 1;
  }
  const emotionSlices: PieSlice[] = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({
      label,
      value,
      color: EMOTION_COLORS[label] ?? "oklch(0.6 0.1 200)",
    }));
  const emotionTotal = emotionSlices.reduce((s, sl) => s + sl.value, 0);

  return (
    <div data-ocid="admin.emotion_section">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-base font-semibold text-foreground">
          Emotion Quiz Results{" "}
          <span className="text-muted-foreground font-body text-sm">
            ({results.length})
          </span>
        </h2>
      </div>

      {/* Stat card */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-admin flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground font-body">
            Total Emotion Results
          </p>
          <p className="font-display text-xl font-bold text-foreground">
            {results.length}
          </p>
        </div>
      </div>

      {/* Distribution chart */}
      {emotionSlices.length > 0 && (
        <div
          className="bg-card border border-border rounded-xl p-6 shadow-admin mb-6"
          data-ocid="admin.emotion_distribution_chart"
        >
          <h3 className="font-display text-sm font-semibold text-foreground mb-5">
            Emotion Distribution
          </h3>
          <div className="flex items-center gap-6">
            <InlinePieChart slices={emotionSlices} size={140} />
            <PieLegend slices={emotionSlices} total={emotionTotal} />
          </div>
        </div>
      )}

      {isLoading ? (
        <div
          className="text-sm text-muted-foreground font-body py-12 text-center"
          data-ocid="admin.emotion_loading_state"
        >
          Loading results…
        </div>
      ) : results.length === 0 ? (
        <div
          className="bg-card border border-border rounded-xl py-12 text-center"
          data-ocid="admin.emotion_empty_state"
        >
          <Brain className="w-10 h-10 text-muted-foreground opacity-30 mx-auto" />
          <p className="text-sm text-muted-foreground font-body mt-3">
            No Emotion Quiz results yet.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-admin">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {["#", "Top Emotion", "Score %", "Date"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, idx) => (
                  <tr
                    key={r.id.toString()}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-ocid={`admin.emotion_row.${idx + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs font-mono w-10">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap gap-1"
                        style={{
                          borderColor:
                            EMOTION_COLORS[r.emotionType] ?? undefined,
                          color: EMOTION_COLORS[r.emotionType] ?? undefined,
                        }}
                      >
                        {(() => {
                          const Icon =
                            EMOTION_ICONS[r.emotionType as EmotionType];
                          return Icon ? <Icon className="w-3 h-3" /> : null;
                        })()}
                        {r.emotionType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground font-mono text-xs">
                      {Math.round(r.score)}%
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(
                        Number(r.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({
  config,
  onToggleDraft,
  isPending,
}: {
  config: { isDraftMode: boolean; adminPrincipal: string } | undefined;
  onToggleDraft: (val: boolean) => void;
  isPending: boolean;
}) {
  return (
    <div className="space-y-6" data-ocid="admin.settings_section">
      <div className="bg-card border border-border rounded-xl p-6 shadow-admin">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">
          App Mode
        </h3>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-body text-foreground font-medium">
              {config?.isDraftMode ? "Draft Mode" : "Live Mode"}
            </p>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              {config?.isDraftMode
                ? "Only accessible to admins. Users see a coming-soon banner."
                : "App is publicly accessible to all users."}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant={config?.isDraftMode ? "secondary" : "default"}
              className="font-body text-xs"
              data-ocid="admin.mode_badge"
            >
              {config?.isDraftMode ? "Draft" : "Live"}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleDraft(!config?.isDraftMode)}
              disabled={isPending}
              className="gap-1.5 font-body text-xs"
              data-ocid="admin.toggle_mode_button"
            >
              <RefreshCw
                className={`w-3 h-3 ${isPending ? "animate-spin" : ""}`}
              />
              {config?.isDraftMode ? "Go Live" : "Switch to Draft"}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-admin">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">
          Admin Configuration
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 text-sm font-body">
            <span className="text-muted-foreground shrink-0">
              Admin Principal
            </span>
            <code className="font-mono text-xs text-foreground bg-muted/30 px-2 py-1 rounded truncate max-w-[260px]">
              {config?.adminPrincipal || "Not configured"}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────

export function AdminPage() {
  const { isAdmin } = useAuth();
  const { loginStatus, identity } = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const isIdentityConnected = loginStatus === "success" && !!identity;
  const enabled = isAdmin && !!actor && !isFetching;

  // claimAdmin on first II login attempt
  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.claimAdmin();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appConfig"] }),
  });

  const claimAttempted = useRef(false);

  useEffect(() => {
    if (actor && isIdentityConnected && !claimAttempted.current) {
      claimAttempted.current = true;
      claimMutation.mutate();
    }
  }, [actor, isIdentityConnected, claimMutation]);

  const { data: analytics } = useQuery<AppAnalytics>({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      if (!actor) throw new Error();
      return actor.getAnalytics();
    },
    enabled,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<
    UserAccountAdmin[]
  >({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      if (!actor) throw new Error();
      return actor.listAllUsers();
    },
    enabled,
  });

  const { data: feedback = [], isLoading: feedbackLoading } = useQuery<
    FeedbackEntry[]
  >({
    queryKey: ["admin", "feedback"],
    queryFn: async () => {
      if (!actor) throw new Error();
      return actor.listFeedback();
    },
    enabled,
  });

  const { data: sevenSinsResults = [], isLoading: sevenSinsLoading } =
    useAdminSevenSinsResults();

  const { data: config } = useQuery({
    queryKey: ["admin", "config"],
    queryFn: async () => {
      if (!actor) throw new Error();
      return actor.getAppConfig();
    },
    enabled: !!actor && !isFetching,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error();
      const res = await actor.deleteUser(email);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error();
      const res = await actor.deleteFeedbackEntry(id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "feedback"] }),
  });

  const setDraftMutation = useMutation({
    mutationFn: async (isDraft: boolean) => {
      if (!actor) throw new Error();
      const res = await actor.setDraftMode(isDraft);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "config"] }),
  });

  if (!isIdentityConnected) return <ConnectIdentity />;
  if (!isAdmin) return <Forbidden />;

  return (
    <div className="flex-1 flex flex-col" data-ocid="admin.page">
      {/* Draft mode banner */}
      {config?.isDraftMode && (
        <div
          className="bg-warning/20 border-b border-warning/40 px-4 py-2 text-center flex items-center justify-center gap-1.5"
          data-ocid="admin.draft_banner"
        >
          <TriangleAlert className="w-3.5 h-3.5 text-warning-foreground" />
          <span className="text-xs font-semibold font-body text-warning-foreground tracking-widest uppercase">
            Draft Mode: App is not publicly visible
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 py-8 gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0" data-ocid="admin.sidebar">
          <div className="bg-card border border-border rounded-xl p-4 shadow-admin sticky top-8">
            <div className="flex items-center gap-2.5 mb-6 px-1">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-display text-sm font-bold text-foreground leading-tight">
                  Admin
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  Inner-Self
                </p>
              </div>
            </div>
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-body transition-smooth ${
                    activeTab === tab.id
                      ? "bg-primary/15 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                  data-ocid={`admin.tab.${tab.id}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {activeTab === "overview" && (
            <OverviewTab
              analytics={analytics}
              users={users}
              feedback={feedback}
              sevenSinsResults={sevenSinsResults}
            />
          )}
          {activeTab === "users" && (
            <UsersTab
              users={users}
              isLoading={usersLoading}
              onDelete={(email) => deleteUserMutation.mutate(email)}
            />
          )}
          {activeTab === "feedback" && (
            <FeedbackTab
              feedback={feedback}
              isLoading={feedbackLoading}
              onDelete={(id) => deleteFeedbackMutation.mutate(id)}
            />
          )}
          {activeTab === "sevensins" && (
            <SevenSinsTab
              results={sevenSinsResults}
              isLoading={sevenSinsLoading}
            />
          )}
          {activeTab === "emotion" && <EmotionResultsTab />}
          {activeTab === "animal" && <AnimalResultsTab />}
          {activeTab === "settings" && (
            <SettingsTab
              config={config}
              onToggleDraft={(val) => setDraftMutation.mutate(val)}
              isPending={setDraftMutation.isPending}
            />
          )}
        </main>
      </div>
    </div>
  );
}
