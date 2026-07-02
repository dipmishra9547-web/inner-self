import { Card } from "@/components/ui/card";
import { ProgressBar } from "../components/ProgressBar";
import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useState } from "react";
import { createActor } from "../backend";
import {
  SEVEN_SINS_QUESTIONS,
  SIN_PROFILES,
  type SinAnswer,
  computeSevenSinsScores,
} from "../data/sevenSinsData";
import { useAuth } from "../hooks/useAuth";
import type { SevenSinsResult } from "../types/sevenSins";

export function SevenSinsQuizPage() {
  const router = useRouter();
  const { token, name } = useAuth();
  const { actor } = useActor(createActor);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<SinAnswer[]>([]);
  // Map from questionId → Set of selected option indices (position-based only)
  const [selectedMap, setSelectedMap] = useState<Map<number, Set<number>>>(
    new Map(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const question = SEVEN_SINS_QUESTIONS[currentQ];
  const totalQ = SEVEN_SINS_QUESTIONS.length;
  const currentSelections = selectedMap.get(question.id) ?? new Set<number>();
  const hasSelection = currentSelections.size > 0;
  const progress = ((currentQ + (hasSelection ? 0.5 : 0)) / totalQ) * 100;
  const isLast = currentQ === totalQ - 1;

  // Derive accent from first selected option's sin, or default
  const firstSelectedIdx =
    currentSelections.size > 0 ? [...currentSelections][0] : null;
  const accentSin =
    firstSelectedIdx !== null ? question.options[firstSelectedIdx]?.sin : null;
  const accentColor = accentSin
    ? SIN_PROFILES[accentSin].color
    : SIN_PROFILES[question.sin].color;

  const toggleOption = useCallback(
    (optionIdx: number) => {
      setSelectedMap((prev) => {
        const next = new Map(prev);
        const set = new Set(next.get(question.id) ?? []);
        if (set.has(optionIdx)) {
          set.delete(optionIdx);
        } else {
          set.add(optionIdx);
        }
        next.set(question.id, set);
        return next;
      });
    },
    [question.id],
  );

  const handleNext = useCallback(async () => {
    if (!hasSelection) return;
    const newAnswer: SinAnswer = {
      questionId: question.id,
      selectedOptionIndices: [...currentSelections],
    };
    const newAnswers = [...answers, newAnswer];

    if (isLast) {
      const scores = computeSevenSinsScores(newAnswers);
      const sorted = [...scores].sort((a, b) => b.percentage - a.percentage);
      const dominantSin = sorted[0].sin;
      const userName = name ?? "Anonymous";

      console.log("Seven Sins quiz completed. Scores:", scores);

      if (!token) {
        setSaveError("Please log in to save your results");
      } else if (actor) {
        setIsSaving(true);
        try {
          const prideScore =
            scores.find((s) => s.sin === "pride")?.percentage ?? 0;
          const greedScore =
            scores.find((s) => s.sin === "greed")?.percentage ?? 0;
          const wrathScore =
            scores.find((s) => s.sin === "wrath")?.percentage ?? 0;
          const envyScore =
            scores.find((s) => s.sin === "envy")?.percentage ?? 0;
          const gluttonyScore =
            scores.find((s) => s.sin === "gluttony")?.percentage ?? 0;
          const lustScore =
            scores.find((s) => s.sin === "lust")?.percentage ?? 0;
          const slothScore =
            scores.find((s) => s.sin === "sloth")?.percentage ?? 0;

          const result = await actor.saveSevenSinsResult(
            token,
            userName,
            prideScore,
            greedScore,
            wrathScore,
            envyScore,
            gluttonyScore,
            lustScore,
            slothScore,
            dominantSin,
          );
          console.log("Seven Sins result saved:", result);
        } catch (err) {
          console.error("Failed to save Seven Sins result:", err);
        } finally {
          setIsSaving(false);
        }
      }

      const payload: SevenSinsResult = {
        scores,
        dominantSin,
        userName,
        takenAt: new Date().toISOString(),
      };
      sessionStorage.setItem("sevenSinsResult", JSON.stringify(payload));
      router.navigate({ to: "/seven-sins-result" });
    } else {
      setDirection(1);
      setAnswers(newAnswers);
      setCurrentQ((q) => q + 1);
    }
  }, [
    hasSelection,
    currentSelections,
    answers,
    isLast,
    token,
    actor,
    name,
    router,
    question,
  ]);

  const handleBack = useCallback(() => {
    if (currentQ === 0) return;
    setDirection(-1);
    const prevIndex = currentQ - 1;
    setCurrentQ(prevIndex);
    // Remove the last committed answer so going forward re-commits it
    setAnswers((prev) => prev.slice(0, prevIndex));
    // selectedMap retains the previous question's selections automatically
  }, [currentQ]);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative"
      data-ocid="seven_sins_quiz.page"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-20"
          style={{ background: accentColor || "oklch(var(--primary))" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Back to Home Button */}
        <div className="mb-4 flex justify-start -ml-3">
          <Button
            variant="ghost"
            onClick={() => router.navigate({ to: "/" })}
            className="gap-2 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-body mb-1">
            Psychological Self-Discovery
          </p>
          <h1 className="font-display text-xl font-bold text-foreground">
            Seven Deadly Sins
          </h1>
        </motion.div>

        {/* Save error */}
        {saveError && (
          <div
            className="mb-4 px-4 py-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm font-body text-center"
            data-ocid="seven_sins_quiz.save_error_state"
          >
            {saveError}
          </div>
        )}

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar
            current={currentQ}
            total={totalQ}
            data-ocid="seven_sins_quiz.progress_bar"
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card
              className="bg-card border-border p-6 mb-3 relative overflow-hidden"
              style={{
                boxShadow:
                  "0 0 0 1px oklch(var(--border)), 0 8px 32px rgba(0,0,0,0.4)",
              }}
              data-ocid="seven_sins_quiz.question_card"
            >
              <div
                className="absolute top-0 inset-x-0 h-px transition-colors duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                }}
              />

              {isSaving ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-muted-foreground font-body text-sm animate-pulse">
                    Saving your results...
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-4 text-center">
                    Question {currentQ + 1} of {totalQ}
                  </p>

                  <p className="font-display text-lg font-semibold text-foreground mb-2 leading-relaxed text-center">
                    {question.question}
                  </p>
                  
                  {/* Multi-select hint */}
                  <p className="text-xs text-muted-foreground font-body mb-6 flex items-center justify-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded border-2 border-muted-foreground/50 flex-shrink-0" />
                    Select all that apply
                  </p>

                  <div className="flex flex-col gap-2.5" data-ocid="seven_sins_quiz.options_list">
                    {question.options.map((opt, idx) => {
                      const isChosen = currentSelections.has(idx);
                      const sinColor = SIN_PROFILES[opt.sin].color;
                      return (
                        <motion.button
                          type="button"
                          key={`${question.id}-${idx}`}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleOption(idx)}
                          className={[
                            "w-full text-left px-4 py-3.5 rounded-lg border font-body text-sm transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group relative overflow-hidden",
                            isChosen
                              ? "text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                          style={{
                            background: isChosen ? `${sinColor}18` : "oklch(var(--muted) / 0.5)",
                            borderColor: isChosen ? sinColor : "oklch(var(--border))",
                            boxShadow: isChosen ? `0 0 12px ${sinColor}20, inset 0 0 12px ${sinColor}10` : "none",
                          }}
                          data-ocid={`seven_sins_quiz.option.${idx + 1}`}
                          aria-pressed={isChosen}
                        >
                          <span className="flex items-start gap-3">
                            <span
                              className={[
                                "mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-smooth",
                                isChosen
                                  ? "text-white"
                                  : "border-muted-foreground/60 bg-transparent",
                              ].join(" ")}
                              style={
                                isChosen
                                  ? {
                                      backgroundColor: sinColor,
                                      borderColor: sinColor,
                                    }
                                  : undefined
                              }
                            >
                              {isChosen && (
                                <svg
                                  viewBox="0 0 10 8"
                                  fill="none"
                                  className="w-3 h-2.5"
                                  aria-label="Selected"
                                  role="img"
                                >
                                  <path
                                    d="M1 4l2.5 2.5L9 1"
                                    stroke="white"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </span>
                            <span className="flex-1">{opt.text}</span>
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentQ === 0}
                      className="gap-1.5 font-body transition-smooth bg-transparent hover:bg-white/5 border-border text-foreground"
                      data-ocid="seven_sins_quiz.back_button"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!hasSelection || isSaving}
                      className="gap-2 font-body min-w-[130px] text-white font-semibold transition-smooth border-none"
                      style={{ background: hasSelection ? accentColor : "oklch(var(--muted))", color: hasSelection ? "white" : "oklch(var(--muted-foreground))" }}
                      data-ocid="seven_sins_quiz.next_button"
                    >
                      {isLast ? (
                        <>
                          See Results
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground font-body mt-2">
          All responses are private and used only for your personal
          self-reflection.
        </p>
      </div>
    </div>
  );
}
