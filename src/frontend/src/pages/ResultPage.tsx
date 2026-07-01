import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Facebook,
  Heart,
  Moon,
  RefreshCw,
  Share2,
  Twitter,
  Users,
  UsersRound,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { BRAND_COLORS } from "../components/ShareSection";
import { ARCHETYPES } from "../data/archetypes";
import { COMPATIBILITY_MAP } from "../data/compatibility";
import { QUIZ_QUESTIONS } from "../data/quizQuestions";
import { useMyProfile, useSaveProfile } from "../hooks/useProfile";
import type { AnimalType } from "../types/animals";

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const GROUP_LABELS: Record<
  keyof NonNullable<(typeof ARCHETYPES)["Lion"]["groupDynamics"]>,
  { label: string; icon: typeof UsersRound }
> = {
  large: { label: "Large Group", icon: UsersRound },
  small: { label: "Small Group", icon: Users },
  micro: { label: "Close Bond", icon: Heart },
  isolation: { label: "Alone Time", icon: Moon },
};

// ── Share Result Component ────────────────────────────────────────────────────

interface ShareResultProps {
  animalType: AnimalType;
}

function ShareResult({ animalType }: ShareResultProps) {
  const [copied, setCopied] = useState(false);
  const archetype = ARCHETYPES[animalType];
  const appUrl = window.location.origin;
  const shareMessage = `I discovered my animal archetype is ${archetype.name} ${archetype.emoji} on Inner-Self! What's yours? Take the quiz: ${appUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Inner-Self Animal Archetype",
          text: shareMessage,
          url: appUrl,
        });
        return;
      } catch {
        // fall through
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank",
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <Card
      className="bg-card border-border shadow-card overflow-hidden mb-5"
      data-ocid="result.share_card"
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-primary" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
            Share Your Result
          </p>
        </div>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">
          You got{" "}
          <strong className="text-foreground">
            {archetype.name} {archetype.emoji}
          </strong>
          ! Share it with friends.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: BRAND_COLORS.whatsapp, color: "#fff" }}
            data-ocid="result.share_whatsapp"
          >
            <SiWhatsapp className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: BRAND_COLORS.facebook, color: "#fff" }}
            data-ocid="result.share_facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: BRAND_COLORS.twitter, color: "#fff" }}
            data-ocid="result.share_twitter"
          >
            <Twitter className="w-3.5 h-3.5" />X
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy link"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95 border border-border bg-muted/50 text-foreground"
            data-ocid="result.share_copy_link"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleNativeShare}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium border border-border/50 text-muted-foreground hover:text-primary transition-smooth"
            data-ocid="result.share_native"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share via…
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResultPage() {
  const navigate = useNavigate();
  const { identity, loginStatus } = useInternetIdentity();
  const saveProfile = useSaveProfile();
  const { data: savedProfile, isLoading: profileLoading } = useMyProfile();

  const search = useSearch({ from: "/result" }) as { type?: AnimalType };
  const searchType = search?.type;

  const savedArchetype = savedProfile?.archetype ?? null;
  const animalType: AnimalType | null = searchType ?? savedArchetype ?? null;

  const quizDate: Date | null = (() => {
    if (savedProfile?.takenAt != null) {
      return new Date(Number(savedProfile.takenAt / 1_000_000n));
    }
    if (searchType) return new Date();
    return null;
  })();

  useEffect(() => {
    if (!profileLoading && !animalType) {
      navigate({ to: "/" });
    }
  }, [animalType, profileLoading, navigate]);

  const { mutate: saveProfileMutate } = saveProfile;
  useEffect(() => {
    if (searchType && identity && loginStatus === "success") {
      saveProfileMutate(searchType);
    }
  }, [searchType, identity, loginStatus, saveProfileMutate]);

  if (profileLoading) {
    return (
      <div className="flex-1 bg-background py-10 px-4">
        <div
          className="max-w-lg mx-auto space-y-4"
          data-ocid="result.loading_state"
        >
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!animalType || !ARCHETYPES[animalType]) return null;

  const archetype = ARCHETYPES[animalType];
  const compatibilityEntries = COMPATIBILITY_MAP[animalType] ?? [];

  const levelColor = (score: number) => {
    if (score >= 5) return "bg-accent/20 text-accent border-accent/30";
    if (score >= 4) return "bg-primary/20 text-primary border-primary/30";
    if (score >= 3) return "bg-muted text-foreground border-border";
    return "bg-muted/50 text-muted-foreground border-border/50";
  };

  return (
    <div className="flex-1 bg-background py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* ── RESULT CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card
            className="bg-card border-border shadow-card overflow-hidden mb-5"
            data-ocid="result.card"
          >
            <div className="gradient-warm-accent h-1.5" />

            <CardContent className="p-6 pb-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                  Primal Archetype
                </p>
                {quizDate && (
                  <p
                    className="text-xs text-muted-foreground font-body"
                    data-ocid="result.last_saved"
                  >
                    Taken {formatDate(quizDate)}
                  </p>
                )}
              </div>

              <h2 className="font-display text-lg font-bold text-foreground text-center leading-tight mb-4">
                Your Soul Guardian is Revealed
              </h2>

              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground font-body">
                  Question {QUIZ_QUESTIONS.length} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs font-semibold text-primary font-body">
                  100%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-6">
                <div className="h-full w-full rounded-full gradient-warm-accent" />
              </div>

              <div className="text-center mb-5">
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.25,
                    type: "spring",
                    stiffness: 180,
                    damping: 14,
                  }}
                  className="text-7xl mb-4 select-none"
                  data-ocid="result.archetype_emoji"
                >
                  {archetype.emoji}
                </motion.div>

                <h3 className="font-display text-2xl font-bold text-primary tracking-widest mb-2">
                  {archetype.displayName}
                </h3>
                <p className="text-muted-foreground font-body text-xs tracking-wide leading-relaxed">
                  {archetype.tagline}
                </p>
              </div>

              <p className="text-foreground font-body text-sm leading-relaxed text-center">
                {archetype.description}
              </p>
            </CardContent>

            <Separator />

            {/* ── STRENGTHS & CHALLENGES ── */}
            <CardContent className="p-6 pb-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-4">
                Mystical Insights
              </p>

              <div
                className="grid grid-cols-1 gap-4"
                data-ocid="result.insights"
              >
                <div data-ocid="result.strengths">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-body">
                      Key Strengths
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {archetype.strengths.map((s, i) => (
                      <motion.li
                        key={s}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.35 }}
                        className="flex items-start gap-2 text-sm font-body text-muted-foreground"
                        data-ocid={`result.strength.${i + 1}`}
                      >
                        <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div data-ocid="result.challenges">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-body">
                      Growth Areas
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {archetype.challenges.map((c, i) => (
                      <motion.li
                        key={c}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + i * 0.08, duration: 0.35 }}
                        className="flex items-start gap-2 text-sm font-body text-muted-foreground"
                        data-ocid={`result.challenge.${i + 1}`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                        {c}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>

            <Separator />

            {/* ── GROUP DYNAMICS ── */}
            <CardContent className="p-6 pb-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                  Group Dynamics
                </p>
              </div>

              <div
                className="grid grid-cols-1 gap-3"
                data-ocid="result.group_dynamics"
              >
                {(
                  Object.entries(GROUP_LABELS) as [
                    keyof typeof GROUP_LABELS,
                    (typeof GROUP_LABELS)[keyof typeof GROUP_LABELS],
                  ][]
                ).map(([key, meta], i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="bg-muted/40 rounded-lg p-3 border border-border/50"
                    data-ocid={`result.group_dynamics.${key}`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <meta.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-body">
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-body leading-relaxed">
                      {archetype.groupDynamics[key]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── SAVE STATUS ── */}
        {saveProfile.isPending && (
          <div
            className="text-center text-xs text-muted-foreground font-body mb-4"
            data-ocid="result.save_loading_state"
          >
            Saving your archetype…
          </div>
        )}
        {saveProfile.isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-accent font-body mb-4 flex items-center justify-center gap-1.5"
            data-ocid="result.save_success_state"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Archetype saved to your profile
          </motion.div>
        )}

        {/* ── SHARE YOUR RESULT ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <ShareResult animalType={animalType} />
        </motion.div>

        {/* ── COMPATIBILITY PREVIEW ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <Card
            className="bg-card border-border shadow-card overflow-hidden mb-5"
            data-ocid="result.compatibility_preview"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                  Compatibility Reference
                </p>
              </div>

              <div className="space-y-1">
                {compatibilityEntries.slice(0, 5).map((entry, idx) => {
                  const partner = ARCHETYPES[entry.type];
                  return (
                    <div
                      key={entry.type}
                      className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0 gap-3"
                      data-ocid={`result.compatibility_item.${idx + 1}`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-base leading-none">
                          {archetype.emoji}
                        </span>
                        <span className="text-muted-foreground text-xs font-body">
                          &
                        </span>
                        <span className="text-base leading-none">
                          {partner.emoji}
                        </span>
                        <span className="text-xs font-body text-foreground truncate">
                          {partner.name.replace("The ", "")}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-body shrink-0 border ${levelColor(entry.levelScore)}`}
                      >
                        {entry.level.split("|")[0].trim()}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── ACTIONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.45 }}
          className="flex flex-col gap-3"
        >
          <Button
            size="lg"
            className="w-full font-body transition-smooth gradient-warm-accent text-foreground border-0 font-semibold"
            onClick={() =>
              navigate({ to: "/compatibility", search: { type: animalType } })
            }
            data-ocid="result.explore_button"
          >
            <Compass className="w-4 h-4 mr-2" />
            View Compatibility
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full font-body transition-smooth"
            onClick={() => navigate({ to: "/" })}
            data-ocid="result.retake_button"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Retake Quiz
          </Button>
        </motion.div>

        <div className="h-8" />
      </div>
    </div>
  );
}
