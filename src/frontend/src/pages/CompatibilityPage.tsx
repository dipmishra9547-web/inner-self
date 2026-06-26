import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Compass } from "lucide-react";
import { motion } from "motion/react";
import { ARCHETYPES } from "../data/archetypes";
import { COMPATIBILITY_MAP } from "../data/compatibility";
import { useMyProfile } from "../hooks/useProfile";
import { ALL_ANIMAL_TYPES } from "../types/animals";
import type { AnimalType } from "../types/animals";

// ── Compatibility indicator ──────────────────────────────────────────────────

function compatEmoji(score: number): string {
  if (score >= 4) return "✅";
  if (score >= 3) return "🤝";
  return "⚠️";
}

function compatLabel(score: number): string {
  if (score >= 5) return "Highly Compatible";
  if (score >= 4) return "Strong Bond";
  if (score >= 3) return "Balanced";
  if (score >= 2) return "Potential Conflict";
  return "High Risk";
}

function levelBg(score: number): string {
  if (score >= 5) return "border-primary/40 bg-primary/10";
  if (score >= 4) return "border-primary/25 bg-primary/5";
  if (score >= 3) return "border-accent/30 bg-accent/5";
  if (score >= 2) return "border-border bg-muted/30";
  return "border-destructive/30 bg-destructive/8";
}

function levelTextClass(score: number): string {
  if (score >= 5) return "text-foreground";
  if (score >= 4) return "text-primary";
  if (score >= 3) return "text-accent";
  if (score >= 2) return "text-muted-foreground";
  return "text-destructive";
}

// ── Self-pairing entry (own type) ────────────────────────────────────────────

const SELF_ENTRY = {
  connectionType: "Mirror",
  level: "Self-Knowing | Core",
  levelScore: 4,
  description:
    "Understanding your own type is the foundation of every healthy relationship you build.",
  groupDynamics: {
    large:
      "You lead or follow based on your type's natural tendency in crowds.",
    small: "Your default patterns emerge most clearly in intimate settings.",
    micro:
      "One-on-one is where your core nature is most visible and vulnerable.",
    isolation: "Your relationship with solitude reveals your deepest needs.",
  },
};

const GROUP_CTX_LABELS: {
  key: "large" | "small" | "micro" | "isolation";
  emoji: string;
  label: string;
}[] = [
  { key: "large", emoji: "🌍", label: "Large Group" },
  { key: "small", emoji: "👥", label: "Small Group" },
  { key: "micro", emoji: "🫂", label: "Micro Group" },
  { key: "isolation", emoji: "🧘", label: "Isolation" },
];

// ── CompatibilityCard ────────────────────────────────────────────────────────

interface CompatibilityCardProps {
  myType: AnimalType;
  otherType: AnimalType;
  isSelf: boolean;
  index: number;
}

function CompatibilityCard({
  myType,
  otherType,
  isSelf,
  index,
}: CompatibilityCardProps) {
  const myArchetype = ARCHETYPES[myType];
  const otherArchetype = ARCHETYPES[otherType];

  const entries = COMPATIBILITY_MAP[myType] ?? [];
  const entry = isSelf ? null : entries.find((e) => e.type === otherType);

  const score = isSelf ? SELF_ENTRY.levelScore : (entry?.levelScore ?? 3);
  const connectionType = isSelf
    ? SELF_ENTRY.connectionType
    : (entry?.connectionType ?? "—");
  const description = isSelf
    ? SELF_ENTRY.description
    : (entry?.description ?? "");
  const dynamics = isSelf ? SELF_ENTRY.groupDynamics : null;
  const levelStr = isSelf ? SELF_ENTRY.level : (entry?.level ?? "");

  // For non-self, get the other archetype's groupDynamics to pair with
  const otherDynamics = !isSelf ? otherArchetype.groupDynamics : null;
  const myDynamics = !isSelf ? myArchetype.groupDynamics : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      data-ocid={`compatibility.card.${index + 1}`}
    >
      <Card
        className={`border overflow-hidden transition-smooth ${levelBg(score)}`}
      >
        {/* Card header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Emoji pair + names */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-2xl">{myArchetype.emoji}</span>
                <span className="text-xs text-muted-foreground font-body">
                  +
                </span>
                <span className="text-2xl">{otherArchetype.emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold font-body text-foreground truncate">
                  {isSelf ? (
                    <span>
                      {myArchetype.name}{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (You)
                      </span>
                    </span>
                  ) : (
                    otherArchetype.name
                  )}
                </p>
                <p className="text-xs text-muted-foreground font-body truncate">
                  {connectionType}
                </p>
              </div>
            </div>

            {/* Indicator badge */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-xl" aria-label={compatLabel(score)}>
                {compatEmoji(score)}
              </span>
              <Badge
                variant="outline"
                className={`text-xs font-body border-0 px-0 ${levelTextClass(score)}`}
              >
                {compatLabel(score)}
              </Badge>
            </div>
          </div>

          {/* Level string */}
          <div className="mt-2">
            <span
              className={`text-xs font-mono font-semibold ${levelTextClass(score)}`}
            >
              {levelStr}
            </span>
          </div>

          {/* One-line description */}
          <p className="text-xs text-muted-foreground font-body mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        <Separator className="mx-4 opacity-50" />

        {/* Group context rows */}
        <div className="p-4 pt-3 space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-2">
            Pairing Context
          </p>
          {GROUP_CTX_LABELS.map(({ key, emoji, label }) => {
            const text = isSelf
              ? dynamics![key]
              : `${myDynamics![key].split(".")[0]}. ${otherDynamics![key].split(".")[0]}.`;
            return (
              <div
                key={key}
                className="flex items-start gap-2"
                data-ocid={`compatibility.card.${index + 1}.${key}`}
              >
                <span className="text-sm shrink-0 mt-0.5">{emoji}</span>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold font-body text-foreground">
                    {label}:{" "}
                  </span>
                  <span className="text-xs text-muted-foreground font-body leading-relaxed">
                    {text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

// ── CompatibilityPage ────────────────────────────────────────────────────────

export function CompatibilityPage() {
  const navigate = useNavigate();
  const { data: savedType, isLoading } = useMyProfile();

  // URL param takes precedence (direct link from ResultPage)
  const search = useSearch({ from: "/compatibility" }) as { type?: AnimalType };
  const urlType = search?.type && ARCHETYPES[search.type] ? search.type : null;

  const myType: AnimalType | null = urlType ?? savedType?.archetype ?? null;
  const archetype = myType ? ARCHETYPES[myType] : null;

  // Build ordered list: own type first, then all others
  const orderedTypes: AnimalType[] = myType
    ? [myType, ...ALL_ANIMAL_TYPES.filter((t) => t !== myType)]
    : ALL_ANIMAL_TYPES;

  return (
    <div className="flex-1 bg-background" data-ocid="compatibility.page">
      {/* Page header band */}
      <div className="bg-card border-b border-border py-5 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                myType
                  ? navigate({ to: "/result", search: { type: myType } })
                  : navigate({ to: "/" })
              }
              className="gap-1.5 font-body text-muted-foreground hover:text-foreground -ml-2"
              data-ocid="compatibility.back_button"
            >
              <ArrowLeft className="w-4 h-4" />
              {myType ? "Back to My Result" : "Back"}
            </Button>
          </div>

          {archetype ? (
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="text-5xl shrink-0"
                data-ocid="compatibility.my_archetype_emoji"
              >
                {archetype.emoji}
              </motion.div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                  Your Archetype
                </p>
                <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
                  {archetype.name}
                </h1>
                <p className="text-xs text-muted-foreground font-body mt-1 line-clamp-1">
                  {archetype.tagline}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Compass className="w-8 h-8 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                  Compatibility Reference
                </p>
                <h1 className="font-display text-xl font-bold text-foreground">
                  Animal Mind Dynamics
                </h1>
              </div>
            </div>
          )}

          {/* Indicator legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-body shrink-0">
              Legend:
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { emoji: "✅", label: "Highly Compatible / Strong Bond" },
                { emoji: "🤝", label: "Balanced" },
                { emoji: "⚠️", label: "Potential Conflict / High Risk" },
              ].map(({ emoji, label }) => (
                <span
                  key={emoji}
                  className="flex items-center gap-1 text-xs text-muted-foreground font-body"
                >
                  {emoji} {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* No archetype state */}
          {!myType && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              data-ocid="compatibility.empty_state"
            >
              <Card className="bg-card border-border p-8 text-center mb-8">
                <div className="text-5xl mb-4">🔮</div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Discover Your Archetype First
                </h2>
                <p className="text-sm text-muted-foreground font-body mb-6 max-w-xs mx-auto leading-relaxed">
                  Take the quiz to reveal your animal type — then come back here
                  to see your personal compatibility map.
                </p>
                <Button
                  size="lg"
                  className="font-body gradient-warm-accent text-foreground border-0"
                  onClick={() => navigate({ to: "/" })}
                  data-ocid="compatibility.take_quiz_button"
                >
                  Take the Quiz
                </Button>
              </Card>

              {/* Still show the full reference below */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-1">
                  Full Reference
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  Browsing all 7 archetypes without a personal profile.
                </p>
              </div>
            </motion.div>
          )}

          {/* Section label */}
          {myType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-5"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                All 7 Pairings — {archetype?.name} Edition
              </p>
            </motion.div>
          )}

          {/* Compatibility cards */}
          <div className="space-y-4" data-ocid="compatibility.grid">
            {orderedTypes.map((type, idx) => (
              <CompatibilityCard
                key={type}
                myType={myType ?? "Lion"}
                otherType={type}
                isSelf={myType ? type === myType : false}
                index={idx}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 justify-center">
            {myType && (
              <Button
                size="lg"
                className="font-body gradient-warm-accent text-foreground border-0 transition-smooth"
                onClick={() =>
                  navigate({ to: "/result", search: { type: myType } })
                }
                data-ocid="compatibility.back_to_result_button"
              >
                Back to My Result
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="font-body"
              onClick={() => navigate({ to: "/" })}
              data-ocid="compatibility.retake_quiz_button"
            >
              {myType ? "Retake the Quiz" : "Take the Quiz"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
