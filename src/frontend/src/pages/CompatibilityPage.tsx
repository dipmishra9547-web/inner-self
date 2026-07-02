import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  CircleCheck,
  Compass,
  Handshake,
  Heart,
  Moon,
  Sparkles,
  TriangleAlert,
  Users,
  UsersRound,
} from "lucide-react";
import { motion } from "motion/react";
import { ARCHETYPES } from "../data/archetypes";
import { COMPATIBILITY_MAP } from "../data/compatibility";
import { useMyProfile } from "../hooks/useProfile";
import { ALL_ANIMAL_TYPES } from "../types/animals";
import type { AnimalType } from "../types/animals";

// ── Compatibility indicator ──────────────────────────────────────────────────

function CompatIcon({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const label = compatLabel(score);
  if (score >= 4)
    return <CircleCheck className={className} role="img" aria-label={label} />;
  if (score >= 3)
    return <Handshake className={className} role="img" aria-label={label} />;
  return <TriangleAlert className={className} role="img" aria-label={label} />;
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
  icon: typeof UsersRound;
  label: string;
}[] = [
  { key: "large", icon: UsersRound, label: "Large Group" },
  { key: "small", icon: Users, label: "Small Group" },
  { key: "micro", icon: Heart, label: "Micro Group" },
  { key: "isolation", icon: Moon, label: "Isolation" },
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
    : (entry?.connectionType ?? "-");
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
      className="h-full flex flex-col"
      data-ocid={`compatibility.card.${index + 1}`}
    >
      <Card
        className={`border overflow-hidden transition-smooth flex-1 flex flex-col ${levelBg(score)}`}
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
              <CompatIcon
                score={score}
                className={`w-5 h-5 ${levelTextClass(score)}`}
              />
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
        <div className="p-4 pt-3 space-y-2 flex-1 flex flex-col justify-end">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-2">
            Pairing Context
          </p>
          {GROUP_CTX_LABELS.map(({ key, icon: Icon, label }) => {
            const text = isSelf
              ? dynamics![key]
              : `${myDynamics![key].split(".")[0]}. ${otherDynamics![key].split(".")[0]}.`;
            return (
              <div
                key={key}
                className="flex items-start gap-2"
                data-ocid={`compatibility.card.${index + 1}.${key}`}
              >
                <Icon className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
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
    <div className="min-h-screen bg-background" data-ocid="compatibility.page">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Top controls & CTA */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
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
            {myType ? "Back to My Result" : "Back to Home"}
          </Button>

          {/* Moved CTA here to top right */}
          {!myType && !isLoading && (
            <Button
              size="sm"
              className="font-body gradient-warm-accent text-foreground border-0"
              onClick={() => navigate({ to: "/animal-quiz" })}
              data-ocid="compatibility.take_quiz_button_top"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Take the Quiz
            </Button>
          )}
        </div>

        {/* Page Title & Header */}
        <div className="mb-10 text-center">
          {archetype ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="text-5xl sm:text-6xl mb-2"
                data-ocid="compatibility.my_archetype_emoji"
              >
                {archetype.emoji}
              </motion.div>
              <Badge variant="secondary" className="text-[10px] uppercase tracking-widest font-body">
                Your Archetype
              </Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {archetype.name}
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                {archetype.tagline}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <Compass className="w-8 h-8 text-primary mb-2" />
              <Badge variant="secondary" className="text-[10px] uppercase tracking-widest font-body">
                Compatibility Reference
              </Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Animal Mind Dynamics
              </h1>
            </div>
          )}
        </div>

        {/* Indicator legend - centered and cleanly styled */}
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mb-10 pb-10 border-b border-white/[0.05]">
          {[
            { icon: CircleCheck, label: "Highly Compatible" },
            { icon: Handshake, label: "Balanced" },
            { icon: TriangleAlert, label: "Potential Conflict" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-xs text-muted-foreground font-body bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 rounded-full"
            >
              <Icon className="w-4 h-4 shrink-0 text-primary/70" />
              {label}
            </span>
          ))}
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto">
          {!myType && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-6 text-center"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-1">
                Full Reference
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Browsing all 7 archetypes without a personal profile.
              </p>
            </motion.div>
          )}

          {myType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-center"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                All 7 Pairings: {archetype?.name} Edition
              </p>
            </motion.div>
          )}

          {/* Compatibility cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-ocid="compatibility.grid">
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
          <div className="mt-12 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row gap-3 justify-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}
