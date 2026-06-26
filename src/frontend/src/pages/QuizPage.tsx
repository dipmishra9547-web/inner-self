import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Copy,
  Facebook,
  Loader2,
  Share2,
  Sparkles,
  Twitter,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { createActor } from "../backend";
import type { AnimalType } from "../backend.d";
import { ProgressBar } from "../components/ProgressBar";
import { ARCHETYPES } from "../data/archetypes";
import { useAuth } from "../hooks/useAuth";
import { useSaveProfile } from "../hooks/useProfile";
import { useQuiz } from "../hooks/useQuiz";

const APP_URL = window.location.origin;
const SHARE_MESSAGE = `Discover your personality with Inner-Self! 🧠 Find your Animal Archetype, Emotion Profile, and Dark Side. Take the quiz now: ${APP_URL}`;

function ShareSection() {
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Inner-Self",
          text: SHARE_MESSAGE,
          url: APP_URL,
        });
        return;
      } catch {
        // fall through to social links
      }
    }
    // Fallback: open WhatsApp
    window.open(
      `https://wa.me/?text=${encodeURIComponent(SHARE_MESSAGE)}`,
      "_blank",
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="mt-8"
      data-ocid="quiz.share_section"
    >
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground font-body">
            Share Inner-Self
          </p>
        </div>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4">
          Know someone who'd love to discover their archetype? Share the app!
        </p>

        <div className="flex flex-wrap gap-2">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(SHARE_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: "#25D366", color: "#fff" }}
            data-ocid="quiz.share_whatsapp"
          >
            <SiWhatsapp className="w-3.5 h-3.5" />
            WhatsApp
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: "#1877F2", color: "#fff" }}
            data-ocid="quiz.share_facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
            Facebook
          </a>

          {/* Twitter/X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: "#0f1419", color: "#fff" }}
            data-ocid="quiz.share_twitter"
          >
            <Twitter className="w-3.5 h-3.5" />X
          </a>

          {/* Copy link */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy link"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95 border border-border bg-muted/50 text-foreground"
            data-ocid="quiz.share_copy_link"
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
        </div>

        {/* Mobile native share */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-body text-muted-foreground border border-border/50 hover:border-primary/40 hover:text-primary transition-smooth sm:hidden"
          data-ocid="quiz.share_native"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share via…
        </button>
      </div>
    </motion.div>
  );
}

export function QuizPage() {
  const navigate = useNavigate();
  const { state, currentQuestion, totalQuestions, answerQuestion, restart } =
    useQuiz();
  const { token } = useAuth();
  const { actor } = useActor(createActor);
  const {
    mutate: saveProfile,
    isPending: isSaving,
    isSuccess: isSaved,
  } = useSaveProfile();
  const hasSaved = useRef(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [entryIsSaving, setEntryIsSaving] = useState(false);

  const answered = state.answers.length;
  const displayStep = Math.min(answered + 1, totalQuestions);

  const tokenRef = useRef(token);
  const actorRef = useRef(actor);
  const saveProfileRef = useRef(saveProfile);
  const answersRef = useRef(state.answers);
  tokenRef.current = token;
  actorRef.current = actor;
  saveProfileRef.current = saveProfile;
  answersRef.current = state.answers;

  useEffect(() => {
    if (!state.isComplete || !state.result || hasSaved.current) return;
    hasSaved.current = true;

    const currentToken = tokenRef.current;
    const currentActor = actorRef.current;
    const currentSaveProfile = saveProfileRef.current;
    const currentAnswers = answersRef.current;

    if (!currentToken) {
      setSaveError("Please log in to save your results");
      return;
    }

    currentSaveProfile(state.result as AnimalType);

    const scoreTotals: Record<string, number> = {};
    for (const answer of currentAnswers) {
      for (const [animal, weight] of Object.entries(answer.animalWeight)) {
        scoreTotals[animal] = (scoreTotals[animal] ?? 0) + weight;
      }
    }
    const topScore = Object.values(scoreTotals).reduce(
      (max, v) => Math.max(max, v),
      0,
    );

    if (currentActor) {
      setEntryIsSaving(true);
      currentActor
        .saveAnimalResult(
          currentToken,
          state.result as AnimalType,
          BigInt(topScore),
        )
        .then((res) => {
          if (res.__kind__ === "err") {
            console.error("Failed to save animal result entry:", res.err);
          } else {
            console.log("Animal result saved to collection:", res.ok);
          }
        })
        .catch((err) => {
          console.error("Error saving animal result entry:", err);
        })
        .finally(() => setEntryIsSaving(false));
    }
  }, [state.isComplete, state.result]);

  // Complete screen
  if (state.isComplete && state.result) {
    const archetype = ARCHETYPES[state.result];

    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 30%, ${archetype.color}18 0%, transparent 70%)`,
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-sm w-full"
          data-ocid="quiz.complete_state"
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="text-7xl mb-5 drop-shadow-lg"
          >
            {archetype.emoji}
          </motion.div>

          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-body mb-2">
            Your Soul Guardian is Revealed
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground mb-1 leading-tight">
            {archetype.name}
          </h2>
          <p className="text-sm text-muted-foreground font-body mb-6 leading-relaxed px-4">
            {archetype.tagline}
          </p>

          {saveError && (
            <div
              className="mb-4 px-4 py-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm font-body"
              data-ocid="quiz.save_error_state"
            >
              {saveError}
            </div>
          )}

          {token && (
            <div className="mb-6 flex justify-center">
              {(isSaving || entryIsSaving) && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 text-xs font-body"
                  data-ocid="quiz.saving_state"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving your archetype…
                </Badge>
              )}
              {isSaved && !isSaving && !entryIsSaving && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 text-xs font-body text-accent"
                  data-ocid="quiz.saved_state"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Archetype saved to your profile
                </Badge>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full font-body transition-smooth gap-2"
              onClick={() =>
                navigate({ to: "/result", search: { type: state.result! } })
              }
              data-ocid="quiz.view_result_button"
            >
              <Sparkles className="w-4 h-4" />
              Reveal My Full Reading
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="font-body text-muted-foreground hover:text-foreground"
              onClick={() => {
                hasSaved.current = false;
                setSaveError(null);
                restart();
              }}
              data-ocid="quiz.restart_button"
            >
              Retake the Quiz
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(var(--primary))" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-body mb-1">
            Primal Archetype
          </p>
          <h1 className="font-display text-xl font-bold text-foreground">
            Discover Your Inner Self
          </h1>
        </motion.div>

        <div className="mb-6">
          <ProgressBar
            current={answered}
            total={totalQuestions}
            data-ocid="quiz.progress_bar"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card
              className="bg-card border-border p-6 mb-3 relative overflow-hidden"
              style={{
                boxShadow:
                  "0 0 0 1px oklch(var(--border)), 0 8px 32px rgba(0,0,0,0.4)",
              }}
              data-ocid="quiz.question_card"
            >
              <div
                className="absolute top-0 inset-x-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(var(--primary) / 0.6), transparent)",
                }}
              />

              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-4 text-center">
                Question {displayStep} of {totalQuestions}
              </p>

              <p className="font-display text-lg font-semibold text-foreground mb-6 leading-relaxed text-center">
                {currentQuestion.text}
              </p>

              <div
                className="flex flex-col gap-2.5"
                data-ocid="quiz.options_list"
              >
                {currentQuestion.options.map((option, idx) => (
                  <motion.button
                    type="button"
                    key={`${currentQuestion.id}-${idx}`}
                    onClick={() => answerQuestion(idx)}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="w-full text-left px-4 py-3.5 rounded-lg border font-body text-sm transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group relative overflow-hidden"
                    style={{
                      background: "oklch(var(--muted) / 0.5)",
                      borderColor: "oklch(var(--border))",
                      color: "oklch(var(--foreground))",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.background = "oklch(var(--muted))";
                      el.style.borderColor = "oklch(var(--primary) / 0.5)";
                      el.style.boxShadow =
                        "0 0 12px oklch(var(--primary) / 0.12), inset 0 0 12px oklch(var(--primary) / 0.06)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.background = "oklch(var(--muted) / 0.5)";
                      el.style.borderColor = "oklch(var(--border))";
                      el.style.boxShadow = "none";
                    }}
                    data-ocid={`quiz.option.${idx + 1}`}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className="shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold font-body transition-smooth"
                        style={{
                          borderColor: "oklch(var(--primary) / 0.4)",
                          color: "oklch(var(--primary))",
                          background: "oklch(var(--primary) / 0.08)",
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{option.text}</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {answered === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-muted-foreground font-body mt-1"
          >
            Choose the answer that resonates most deeply
          </motion.p>
        )}

        {/* Share section below quiz */}
        <ShareSection />
      </div>
    </div>
  );
}
