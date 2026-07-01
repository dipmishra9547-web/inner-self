import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useParams, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Brain,
  ChevronDown,
  ChevronUp,
  PawPrint,
  Shield,
  Skull,
  User,
} from "lucide-react";
import { useState } from "react";
import { ARCHETYPES } from "../data/archetypes";
import { useAdminUserResults } from "../hooks/useAuth";
import { useAuth } from "../hooks/useAuth";
import type { AnimalType } from "../types/animals";
import type {
  AnimalResultEntry,
  DarkSideResultEntry,
  EmotionResultEntry,
} from "../types/auth";
import { EMOTION_ICONS, type EmotionType } from "../types/emotion";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Access gates ─────────────────────────────────────────────────────────────

function Forbidden() {
  const router = useRouter();
  return (
    <div
      className="flex-1 flex items-center justify-center px-4 py-24"
      data-ocid="admin_user_detail.forbidden"
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
          <Shield className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Admin Access Required
        </h1>
        <p className="text-muted-foreground font-body text-sm mb-6 leading-relaxed">
          You must be signed in as the platform admin to view user details.
        </p>
        <Button
          variant="outline"
          onClick={() => router.navigate({ to: "/admin" })}
          className="font-body gap-1.5"
          data-ocid="admin_user_detail.go_admin_button"
        >
          <Shield className="w-4 h-4" />
          Go to Admin Dashboard
        </Button>
      </div>
    </div>
  );
}

// ─── Animal Results ───────────────────────────────────────────────────────────

function AnimalTable({ results }: { results: AnimalResultEntry[] }) {
  if (results.length === 0) {
    return (
      <p
        className="text-sm text-muted-foreground font-body py-4 text-center"
        data-ocid="admin_user_detail.animal_empty_state"
      >
        No animal quiz attempts yet.
      </p>
    );
  }
  return (
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
        {results.map((r, idx) => (
          <tr
            key={r.id.toString()}
            className="border-b border-border/30 hover:bg-muted/20 transition-colors"
            data-ocid={`admin_user_detail.animal_item.${idx + 1}`}
          >
            <td className="py-3 px-3 text-foreground font-medium">
              {ARCHETYPES[r.animalType as AnimalType]?.emoji ?? "🐾"}{" "}
              {r.animalType}
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
  );
}

// ─── Emotion Results ──────────────────────────────────────────────────────────

function EmotionTable({ results }: { results: EmotionResultEntry[] }) {
  if (results.length === 0) {
    return (
      <p
        className="text-sm text-muted-foreground font-body py-4 text-center"
        data-ocid="admin_user_detail.emotion_empty_state"
      >
        No emotion quiz attempts yet.
      </p>
    );
  }
  return (
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
        {results.map((r, idx) => (
          <tr
            key={r.id.toString()}
            className="border-b border-border/30 hover:bg-muted/20 transition-colors"
            data-ocid={`admin_user_detail.emotion_item.${idx + 1}`}
          >
            <td className="py-3 px-3 text-foreground font-medium flex items-center gap-2">
              {(() => {
                const Icon = EMOTION_ICONS[r.emotionType as EmotionType];
                return Icon ? <Icon className="w-4 h-4" /> : null;
              })()}
              {r.emotionType}
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
  );
}

// ─── Dark Side Results ────────────────────────────────────────────────────────

function DarkSideRow({ r, idx }: { r: DarkSideResultEntry; idx: number }) {
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
        data-ocid={`admin_user_detail.darkside_item.${idx + 1}`}
      >
        <td className="py-3 px-3 text-foreground font-medium flex items-center gap-2">
          <Skull className="w-4 h-4 text-muted-foreground" />
          {r.personalityType}
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
            data-ocid={`admin_user_detail.darkside_expand.${idx + 1}`}
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

function DarkSideTable({ results }: { results: DarkSideResultEntry[] }) {
  if (results.length === 0) {
    return (
      <p
        className="text-sm text-muted-foreground font-body py-4 text-center"
        data-ocid="admin_user_detail.darkside_empty_state"
      >
        No dark side quiz attempts yet.
      </p>
    );
  }
  return (
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
            Breakdown
          </th>
        </tr>
      </thead>
      <tbody>
        {results.map((r, idx) => (
          <DarkSideRow key={r.id.toString()} r={r} idx={idx} />
        ))}
      </tbody>
    </table>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  badge,
  children,
  ocid,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  ocid: string;
}) {
  return (
    <div
      className="bg-card border border-border rounded-2xl p-6 shadow-card"
      data-ocid={ocid}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="text-primary">{icon}</div>
        <h3 className="font-display text-base font-semibold text-foreground">
          {title}
        </h3>
        {badge && (
          <Badge variant="secondary" className="font-body text-xs ml-auto">
            {badge}
          </Badge>
        )}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

// ─── Admin User Detail Page ───────────────────────────────────────────────────

export function AdminUserDetailPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { loginStatus } = useInternetIdentity();
  const params = useParams({ strict: false }) as { email?: string };
  const email = params.email ? decodeURIComponent(params.email) : null;

  const isIdentityConnected = loginStatus === "success";

  const { data: userResults, isLoading } = useAdminUserResults(
    isAdmin && email ? email : null,
  );

  // Access gate: must be admin via Internet Identity
  if (!isIdentityConnected || !isAdmin) {
    return <Forbidden />;
  }

  const animalResults = [...(userResults?.animal ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );
  const emotionResults = [...(userResults?.emotion ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );
  const darkSideResults = [...(userResults?.darkSide ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div
      className="flex-1 px-4 py-10 max-w-4xl mx-auto w-full"
      data-ocid="admin_user_detail.page"
    >
      {/* Back nav */}
      <button
        type="button"
        onClick={() => router.navigate({ to: "/admin" })}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-smooth font-body"
        data-ocid="admin_user_detail.back_link"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin Dashboard
      </button>

      {/* Page header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            User Detail
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-0.5">
            {email ?? "Unknown user"}
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="font-body text-xs gap-1">
              <PawPrint className="w-3 h-3" />
              {animalResults.length} animal
            </Badge>
            <Badge variant="secondary" className="font-body text-xs gap-1">
              <Brain className="w-3 h-3" />
              {emotionResults.length} emotion
            </Badge>
            <Badge variant="secondary" className="font-body text-xs gap-1">
              <Skull className="w-3 h-3" />
              {darkSideResults.length} dark side
            </Badge>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Animal Results */}
          <SectionCard
            title="Animal Quiz Attempts"
            icon={<PawPrint className="w-4 h-4" />}
            badge={`${animalResults.length} attempt${animalResults.length !== 1 ? "s" : ""}`}
            ocid="admin_user_detail.animal_section"
          >
            <AnimalTable results={animalResults} />
          </SectionCard>

          {/* Emotion Results */}
          <SectionCard
            title="Emotion Quiz Attempts"
            icon={<Brain className="w-4 h-4" />}
            badge={`${emotionResults.length} attempt${emotionResults.length !== 1 ? "s" : ""}`}
            ocid="admin_user_detail.emotion_section"
          >
            <EmotionTable results={emotionResults} />
          </SectionCard>

          {/* Dark Side Results */}
          <SectionCard
            title="Dark Side Quiz Attempts"
            icon={<Skull className="w-4 h-4" />}
            badge={`${darkSideResults.length} attempt${darkSideResults.length !== 1 ? "s" : ""}`}
            ocid="admin_user_detail.darkside_section"
          >
            <DarkSideTable results={darkSideResults} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
