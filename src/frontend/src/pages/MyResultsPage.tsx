import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Share2,
} from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";
import { useState } from "react";
import { SIN_PROFILES } from "../data/sevenSinsData";
import { useAuth } from "../hooks/useAuth";
import {
  useMyAnimalResults,
  useMyDarkSideResults,
  useMyEmotionResults,
} from "../hooks/useAuth";
import { useMySevenSinsResults } from "../hooks/useProfile";
import type {
  AnimalResultEntry,
  DarkSideResultEntry,
  EmotionResultEntry,
  SevenSinsResultEntry,
} from "../types/auth";
import type { SinType } from "../types/sevenSins";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ResultSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function ResultSection({
  title,
  icon,
  count,
  children,
  emptyMessage,
  isEmpty,
  isLoading,
  ocid,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
  emptyMessage: string;
  isEmpty: boolean;
  isLoading: boolean;
  ocid: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-card"
      data-ocid={ocid}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="text-primary">{icon}</div>
        <h2 className="font-display text-base font-semibold text-foreground">
          {title}
        </h2>
        {!isLoading && (
          <Badge variant="secondary" className="font-body text-xs ml-auto">
            {count} result{count !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>
      {isLoading ? (
        <ResultSkeleton />
      ) : isEmpty ? (
        <div className="py-8 text-center" data-ocid={`${ocid}_empty_state`}>
          <p className="text-sm text-muted-foreground font-body">
            {emptyMessage}
          </p>
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}

// ─── Animal Results Table ─────────────────────────────────────────────────────

const ANIMAL_EMOJIS: Record<string, string> = {
  Lion: "🦁",
  Otter: "🦦",
  GoldenRetriever: "🐕",
  Beaver: "🦫",
  Wolf: "🐺",
  Sheep: "🐑",
  Shepherd: "🧑‍🌾",
};

function AnimalResultsTable({ results }: { results: AnimalResultEntry[] }) {
  const sorted = [...results].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Animal Type
            </th>
            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Score
            </th>
            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, idx) => (
            <tr
              key={r.id.toString()}
              className="border-b border-border/30 hover:bg-muted/20 transition-colors"
              data-ocid={`my_results.animal_item.${idx + 1}`}
            >
              <td className="py-3 px-3">
                <span className="flex items-center gap-2 text-foreground font-medium">
                  <span>{ANIMAL_EMOJIS[r.animalType] ?? "🐾"}</span>
                  {r.animalType}
                </span>
              </td>
              <td className="py-3 px-3 text-right text-muted-foreground font-mono">
                {r.score.toString()}
              </td>
              <td className="py-3 px-3 text-right text-muted-foreground text-xs">
                {formatDate(r.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Emotion Results Table ────────────────────────────────────────────────────

const EMOTION_EMOJIS: Record<string, string> = {
  Fear: "😨",
  Anger: "😠",
  Happiness: "😊",
  Sadness: "😢",
  Love: "😍",
  Anxiety: "😟",
  Desire: "😤",
  Guilt: "😔",
  Awe: "😮",
  Peace: "🧘",
};

function EmotionResultsTable({ results }: { results: EmotionResultEntry[] }) {
  const sorted = [...results].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Emotion Type
            </th>
            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Score %
            </th>
            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, idx) => (
            <tr
              key={r.id.toString()}
              className="border-b border-border/30 hover:bg-muted/20 transition-colors"
              data-ocid={`my_results.emotion_item.${idx + 1}`}
            >
              <td className="py-3 px-3">
                <span className="flex items-center gap-2 text-foreground font-medium">
                  <span>{EMOTION_EMOJIS[r.emotionType] ?? "🧠"}</span>
                  {r.emotionType}
                </span>
              </td>
              <td className="py-3 px-3 text-right text-muted-foreground font-mono">
                {Math.round(r.score)}%
              </td>
              <td className="py-3 px-3 text-right text-muted-foreground text-xs">
                {formatDate(r.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Dark Side Results Table ──────────────────────────────────────────────────

function DarkSideResultRow({
  r,
  idx,
}: { r: DarkSideResultEntry; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  let breakdown: Array<{ darkType: string; percentage: number }> = [];
  try {
    breakdown = JSON.parse(r.fullResultJson) as typeof breakdown;
  } catch {
    // ignore
  }

  return (
    <>
      <tr
        className="border-b border-border/30 hover:bg-muted/20 transition-colors"
        data-ocid={`my_results.darkside_item.${idx + 1}`}
      >
        <td className="py-3 px-3">
          <span className="text-foreground font-medium">
            💀 {r.personalityType}
          </span>
        </td>
        <td className="py-3 px-3 text-right text-muted-foreground font-mono">
          {Math.round(r.dominantPercentage)}%
        </td>
        <td className="py-3 px-3 text-right text-muted-foreground text-xs">
          {formatDate(r.createdAt)}
        </td>
        <td className="py-3 px-3 text-right">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-body ml-auto"
            data-ocid={`my_results.darkside_expand_button.${idx + 1}`}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Expand
              </>
            )}
          </button>
        </td>
      </tr>
      {expanded && breakdown.length > 0 && (
        <tr className="border-b border-border/30 bg-muted/10">
          <td colSpan={4} className="px-3 py-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {breakdown.map((item) => (
                <div
                  key={item.darkType}
                  className="bg-card border border-border/50 rounded-lg px-3 py-2"
                >
                  <p className="text-xs text-muted-foreground font-body">
                    {item.darkType}
                  </p>
                  <p className="font-display text-sm font-bold text-foreground">
                    {Math.round(item.percentage)}%
                  </p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DarkSideResultsTable({ results }: { results: DarkSideResultEntry[] }) {
  const sorted = [...results].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Personality Type
            </th>
            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Dominant %
            </th>
            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Date
            </th>
            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, idx) => (
            <DarkSideResultRow key={r.id.toString()} r={r} idx={idx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Seven Sins Results Table ─────────────────────────────────────────────────

const ALL_SINS = [
  "pride",
  "greed",
  "wrath",
  "envy",
  "gluttony",
  "lust",
  "sloth",
] as const;
type SinKey = (typeof ALL_SINS)[number];

function SevenSinsResultsTable({
  results,
}: { results: SevenSinsResultEntry[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<bigint>>(new Set());
  const sorted = [...results].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  const toggleExpand = (id: bigint) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Dominant Sin
            </th>
            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Name
            </th>
            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Date
            </th>
            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, idx) => {
            const isExpanded = expandedIds.has(r.id);
            return (
              <React.Fragment key={r.id.toString()}>
                <tr
                  className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                  data-ocid={`my_results.seven_sins_item.${idx + 1}`}
                >
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-2 text-foreground font-medium">
                      <span>
                        {SIN_PROFILES[r.dominantSin.toLowerCase() as SinType]
                          ?.emoji ?? "😈"}
                      </span>
                      {r.dominantSin}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{r.name}</td>
                  <td className="py-3 px-3 text-right text-muted-foreground text-xs">
                    {formatDate(r.createdAt)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleExpand(r.id)}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-body ml-auto"
                      data-ocid={`my_results.seven_sins_expand_button.${idx + 1}`}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          Hide
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          Expand
                        </>
                      )}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr
                    key={`${r.id.toString()}-exp`}
                    className="border-b border-border/30 bg-muted/10"
                  >
                    <td colSpan={4} className="px-3 py-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {ALL_SINS.map((sin: SinKey) => (
                          <div
                            key={sin}
                            className="bg-card border border-border/50 rounded-lg px-3 py-2"
                          >
                            <p className="text-xs text-muted-foreground font-body capitalize">
                              {SIN_PROFILES[sin as SinType]?.emoji ?? "😈"}{" "}
                              {sin}
                            </p>
                            <p className="font-display text-sm font-bold text-foreground">
                              {Math.round(r[sin])}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Full Profile Card ──────────────────────────────────────────────────────

const DARKSIDE_EMOJIS: Record<string, string> = {
  "Lone Planner": "🕵️",
  Mastermind: "🧠",
  "Quiet Idealist": "🌿",
  "Social Flame": "🔆",
  Manipulator: "🎭",
  Psychopath: "🥶",
  Sociopath: "🌀",
};

function FullProfileCard({
  animalResults,
  emotionResults,
  darkSideResults,
  sevenSinsResults,
  isLoading,
  onNavigate,
}: {
  animalResults: AnimalResultEntry[];
  emotionResults: EmotionResultEntry[];
  darkSideResults: DarkSideResultEntry[];
  sevenSinsResults: SevenSinsResultEntry[];
  isLoading: boolean;
  onNavigate: (to: string) => void;
}) {
  const latestAnimal = [...animalResults].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  )[0];
  const latestEmotion = [...emotionResults].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  )[0];
  const latestDark = [...darkSideResults].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  )[0];
  const latestSin = [...sevenSinsResults].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  )[0];

  const animalLabel = latestAnimal
    ? `${ANIMAL_EMOJIS[latestAnimal.animalType] ?? "🐾"} ${latestAnimal.animalType}`
    : null;
  const emotionLabel = latestEmotion
    ? `${EMOTION_EMOJIS[latestEmotion.emotionType] ?? "🧠"} ${latestEmotion.emotionType}`
    : null;
  const darkLabel = latestDark
    ? `${DARKSIDE_EMOJIS[latestDark.personalityType] ?? "💀"} ${latestDark.personalityType}`
    : null;
  const sinKey = latestSin
    ? (latestSin.dominantSin.toLowerCase() as keyof typeof SIN_PROFILES)
    : null;
  const sinLabel =
    sinKey && SIN_PROFILES[sinKey]
      ? `${SIN_PROFILES[sinKey].emoji} ${SIN_PROFILES[sinKey].name}`
      : null;

  function handleShare() {
    const parts: string[] = [];
    if (animalLabel) parts.push(`Animal ${animalLabel}`);
    if (emotionLabel) parts.push(`Emotion ${emotionLabel}`);
    if (darkLabel) parts.push(`Dark Side ${darkLabel}`);
    if (sinLabel) parts.push(`Dominant Sin ${sinLabel}`);
    const profileText = parts.join(" | ");
    const appUrl = window.location.origin;
    const message = parts.length
      ? `My Inner-Self profile: ${profileText}. Discover your own: ${appUrl}`
      : `Discover your Inner-Self profile: ${appUrl}`;
    if (navigator.share) {
      navigator
        .share({ title: "My Inner-Self Profile", text: message, url: appUrl })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(message)
        .then(() => alert("Profile link copied!"))
        .catch(() => {});
    }
  }

  const quizItems = [
    {
      label: "Animal Archetype",
      emoji: "🐾",
      result: animalLabel,
      route: "/",
      ocid: "my_results.full_profile_animal",
    },
    {
      label: "Top Emotion",
      emoji: "🧠",
      result: emotionLabel,
      route: "/emotion-quiz",
      ocid: "my_results.full_profile_emotion",
    },
    {
      label: "Dark Side",
      emoji: "💀",
      result: darkLabel,
      route: "/dark-side-quiz",
      ocid: "my_results.full_profile_darkside",
    },
    {
      label: "Dominant Sin",
      emoji: "😈",
      result: sinLabel,
      route: "/seven-sins-quiz",
      ocid: "my_results.full_profile_sin",
    },
  ];

  const hasAnyResult = quizItems.some((q) => q.result !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-primary/30 shadow-lg mb-8"
      style={{
        background:
          "linear-gradient(135deg, oklch(var(--card) / 1) 0%, oklch(var(--primary) / 0.12) 50%, oklch(var(--card) / 1) 100%)",
      }}
      data-ocid="my_results.full_profile_card"
    >
      {/* decorative orb */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(var(--primary))" }}
      />
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              ✨ Your Full Profile
            </h2>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Your latest result from every quiz — at a glance
            </p>
          </div>
          {hasAnyResult && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              className="font-body text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
              data-ocid="my_results.full_profile_share_button"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Profile
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quizItems.map((item) => (
              <div
                key={item.label}
                className="bg-card/70 backdrop-blur-sm border border-border/50 rounded-xl p-3 flex flex-col gap-1.5"
                data-ocid={item.ocid}
              >
                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider font-semibold">
                  {item.emoji} {item.label}
                </p>
                {item.result ? (
                  <p className="font-display text-sm font-bold text-foreground leading-tight">
                    {item.result}
                  </p>
                ) : (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground font-body italic">
                      Not taken yet
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.route)}
                      className="text-[10px] text-primary hover:text-primary/80 font-body font-semibold underline underline-offset-2 text-left transition-colors"
                      data-ocid={`${item.ocid}_take_quiz_link`}
                    >
                      Take Quiz →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Seven Sins Timeline ──────────────────────────────────────────────────────

function SevenSinsTimeline({ results }: { results: SevenSinsResultEntry[] }) {
  if (results.length === 0) return null;

  const sorted = [...results].sort(
    (a, b) => Number(a.createdAt) - Number(b.createdAt),
  );

  if (sorted.length === 1) {
    return (
      <div className="mt-6 pt-5 border-t border-border/40">
        <h3 className="font-display text-sm font-semibold text-foreground mb-2">
          📈 Dominant Sin Timeline
        </h3>
        <p className="text-xs text-muted-foreground font-body italic">
          Take the quiz again to see how your dominant sin changes over time.
        </p>
      </div>
    );
  }

  const ALL_SIN_KEYS: (keyof typeof SIN_PROFILES)[] = [
    "pride",
    "greed",
    "wrath",
    "envy",
    "gluttony",
    "lust",
    "sloth",
  ];

  const sinIndex = (sin: string): number => {
    const k = sin.toLowerCase() as keyof typeof SIN_PROFILES;
    const i = ALL_SIN_KEYS.indexOf(k);
    return i === -1 ? 0 : i;
  };

  const ROWS = ALL_SIN_KEYS.length; // 7
  const COLS = sorted.length;
  const ROW_H = 36;
  const COL_W = Math.max(72, Math.floor(640 / COLS));
  const LABEL_W = 82;
  const PAD_TOP = 8;
  const PAD_BOT = 28;
  const svgW = LABEL_W + COL_W * COLS;
  const svgH = PAD_TOP + ROW_H * ROWS + PAD_BOT;

  // Build polyline points connecting dominant-sin dots
  const dotCx = (col: number) => LABEL_W + col * COL_W + COL_W / 2;
  const dotCy = (row: number) => PAD_TOP + row * ROW_H + ROW_H / 2;

  const points = sorted
    .map((r, col) => {
      const row = sinIndex(r.dominantSin);
      return `${dotCx(col)},${dotCy(row)}`;
    })
    .join(" ");

  return (
    <div
      className="mt-6 pt-5 border-t border-border/40"
      data-ocid="my_results.seven_sins_timeline"
    >
      <h3 className="font-display text-sm font-semibold text-foreground mb-4">
        📈 Dominant Sin Timeline
      </h3>
      <div className="overflow-x-auto">
        <svg
          width={svgW}
          height={svgH}
          role="img"
          aria-labelledby="sins-timeline-title"
          className="font-body"
        >
          <title id="sins-timeline-title">
            Seven Deadly Sins dominant sin timeline
          </title>
          {/* Row backgrounds */}
          {ALL_SIN_KEYS.map((sin, row) => (
            <rect
              key={sin}
              x={0}
              y={PAD_TOP + row * ROW_H}
              width={svgW}
              height={ROW_H}
              fill={row % 2 === 0 ? "oklch(var(--muted)/0.18)" : "transparent"}
              rx={0}
            />
          ))}

          {/* Sin labels */}
          {ALL_SIN_KEYS.map((sin, row) => (
            <text
              key={sin}
              x={LABEL_W - 8}
              y={dotCy(row) + 4}
              textAnchor="end"
              fontSize={11}
              fill="oklch(var(--muted-foreground))"
              className="font-body"
            >
              {SIN_PROFILES[sin].emoji} {SIN_PROFILES[sin].name}
            </text>
          ))}

          {/* Connector line */}
          {sorted.length > 1 && (
            <polyline
              points={points}
              fill="none"
              stroke="oklch(var(--primary)/0.5)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          )}

          {/* Attempt dots + date labels */}
          {sorted.map((r, col) => {
            const row = sinIndex(r.dominantSin);
            const cx = dotCx(col);
            const cy = dotCy(row);
            const profile =
              SIN_PROFILES[
                r.dominantSin.toLowerCase() as keyof typeof SIN_PROFILES
              ] ?? SIN_PROFILES.pride;
            const dateStr = new Date(
              Number(r.createdAt) / 1_000_000,
            ).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            return (
              <g key={r.id.toString()}>
                {/* glow circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={13}
                  fill={profile.color}
                  opacity={0.15}
                />
                {/* main dot */}
                <circle cx={cx} cy={cy} r={7} fill={profile.color} />
                {/* emoji */}
                <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize={9}>
                  {profile.emoji}
                </text>
                {/* date label */}
                <text
                  x={cx}
                  y={svgH - 6}
                  textAnchor="middle"
                  fontSize={9}
                  fill="oklch(var(--muted-foreground))"
                >
                  {dateStr}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── My Results Page ──────────────────────────────────────────────────────────

export function MyResultsPage() {
  const { token, isLoggedIn } = useAuth();
  const router = useRouter();

  const { data: animalResults = [], isLoading: loadingAnimal } =
    useMyAnimalResults(token);
  const { data: emotionResults = [], isLoading: loadingEmotion } =
    useMyEmotionResults(token);
  const { data: darkSideResults = [], isLoading: loadingDark } =
    useMyDarkSideResults(token);
  const { data: sevenSinsResults = [], isLoading: loadingSevenSins } =
    useMySevenSinsResults(token);

  if (!isLoggedIn) {
    router.navigate({ to: "/login" });
    return null;
  }

  const allLoading =
    loadingAnimal || loadingEmotion || loadingDark || loadingSevenSins;

  return (
    <div
      className="flex-1 px-4 py-10 max-w-3xl mx-auto w-full"
      data-ocid="my_results.page"
    >
      {/* Back nav */}
      <button
        type="button"
        onClick={() => router.navigate({ to: "/profile" })}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-smooth font-body"
        data-ocid="my_results.back_link"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to profile
      </button>

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Results
          </h1>
        </div>
        <p className="text-muted-foreground font-body text-sm">
          Your complete quiz history — all attempts, newest first.
        </p>
      </div>

      {/* Full Profile Summary Card */}
      <FullProfileCard
        animalResults={animalResults}
        emotionResults={emotionResults}
        darkSideResults={darkSideResults}
        sevenSinsResults={sevenSinsResults}
        isLoading={allLoading}
        onNavigate={(to) => router.navigate({ to: to as "/" })}
      />

      <div className="space-y-6">
        {/* Animal Results */}
        <ResultSection
          title="Animal Archetype Results"
          icon={<span className="text-lg">🐾</span>}
          count={animalResults.length}
          isEmpty={animalResults.length === 0}
          isLoading={loadingAnimal}
          emptyMessage="No animal quiz results yet — take the Animal Quiz to discover your archetype!"
          ocid="my_results.animal_section"
        >
          <AnimalResultsTable results={animalResults} />
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.navigate({ to: "/" })}
              className="font-body text-xs gap-1.5"
              data-ocid="my_results.take_animal_quiz_button"
            >
              🦁 Retake Animal Quiz
            </Button>
          </div>
        </ResultSection>

        {/* Emotion Results */}
        <ResultSection
          title="Emotion Quiz Results"
          icon={<span className="text-lg">🧠</span>}
          count={emotionResults.length}
          isEmpty={emotionResults.length === 0}
          isLoading={loadingEmotion}
          emptyMessage="No emotion quiz results yet — take the Emotion Quiz to discover your inner world!"
          ocid="my_results.emotion_section"
        >
          <EmotionResultsTable results={emotionResults} />
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.navigate({ to: "/emotion-quiz" })}
              className="font-body text-xs gap-1.5"
              data-ocid="my_results.take_emotion_quiz_button"
            >
              🧠 Retake Emotion Quiz
            </Button>
          </div>
        </ResultSection>

        {/* Seven Deadly Sins Results */}
        <ResultSection
          title="Seven Deadly Sins Results"
          icon={<span className="text-lg">😈</span>}
          count={sevenSinsResults.length}
          isEmpty={sevenSinsResults.length === 0}
          isLoading={loadingSevenSins}
          emptyMessage="No Seven Deadly Sins results yet — take the quiz to uncover your dominant sin!"
          ocid="my_results.seven_sins_section"
        >
          <SevenSinsResultsTable results={sevenSinsResults} />
          <SevenSinsTimeline results={sevenSinsResults} />
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.navigate({ to: "/seven-sins-quiz" })}
              className="font-body text-xs gap-1.5"
              data-ocid="my_results.take_seven_sins_quiz_button"
            >
              😈 Take Seven Deadly Sins Quiz
            </Button>
          </div>
        </ResultSection>

        {/* Dark Side Results */}
        <ResultSection
          title="Dark Side Results"
          icon={<span className="text-lg">💀</span>}
          count={darkSideResults.length}
          isEmpty={darkSideResults.length === 0}
          isLoading={loadingDark}
          emptyMessage="No dark side results yet — take the Dark Side Quiz to understand your hidden patterns!"
          ocid="my_results.darkside_section"
        >
          <DarkSideResultsTable results={darkSideResults} />
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.navigate({ to: "/dark-side-quiz" })}
              className="font-body text-xs gap-1.5"
              data-ocid="my_results.take_darkside_quiz_button"
            >
              💀 Retake Dark Side Quiz
            </Button>
          </div>
        </ResultSection>
      </div>
    </div>
  );
}
