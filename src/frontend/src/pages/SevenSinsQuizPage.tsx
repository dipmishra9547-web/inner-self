import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useRouter } from "@tanstack/react-router";
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
      className="flex-1 flex flex-col items-center px-4 py-10 bg-background"
      data-ocid="seven_sins_quiz.page"
    >
      <div className="w-full max-w-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-6"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-1">
            Psychological Self-Discovery
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Seven Deadly Sins
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Choose the answers that feel most honest — even if they're
            uncomfortable
          </p>
        </motion.div>

        {/* Save error */}
        {saveError && (
          <div
            className="mb-4 px-4 py-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm font-body"
            data-ocid="seven_sins_quiz.save_error_state"
          >
            {saveError}
          </div>
        )}

        {/* Progress */}
        <div className="mb-6" data-ocid="seven_sins_quiz.progress">
          <div className="flex justify-between text-xs text-muted-foreground font-body mb-1.5">
            <span className="font-semibold text-foreground/70">
              Question {currentQ + 1} of {totalQ}
            </span>
            <span className="font-semibold" style={{ color: accentColor }}>
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: accentColor }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-card border border-border rounded-2xl shadow-card overflow-hidden mb-4"
            data-ocid="seven_sins_quiz.question_card"
          >
            {/* Accent bar */}
            <motion.div
              className="h-1.5"
              animate={{ backgroundColor: accentColor }}
              transition={{ duration: 0.3 }}
            />

            <div className="p-6 sm:p-8">
              {/* Scenario label */}
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3">
                🕯 Confessional Scenario
              </p>
              <p className="font-display text-xl font-semibold text-foreground mb-2 leading-relaxed">
                {question.question}
              </p>
              {/* Multi-select hint */}
              <p className="text-xs text-muted-foreground font-body mb-5 flex items-center gap-1.5">
                <span className="inline-block w-3.5 h-3.5 rounded border-2 border-muted-foreground/50 flex-shrink-0" />
                Select all that apply
              </p>

              <div
                className="space-y-3"
                data-ocid="seven_sins_quiz.options_list"
              >
                {question.options.map((opt, idx) => {
                  const isChosen = currentSelections.has(idx);
                  const sinColor = SIN_PROFILES[opt.sin].color;
                  return (
                    <motion.button
                      type="button"
                      key={`${question.id}-${idx}`}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => toggleOption(idx)}
                      className={[
                        "w-full text-left px-4 py-3.5 rounded-xl border-2 transition-smooth font-body text-sm leading-relaxed",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                        isChosen
                          ? "text-foreground shadow-sm"
                          : "border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40",
                      ].join(" ")}
                      style={
                        isChosen
                          ? ({
                              borderColor: sinColor,
                              backgroundColor: `${sinColor}18`,
                            } as React.CSSProperties)
                          : undefined
                      }
                      data-ocid={`seven_sins_quiz.option.${idx + 1}`}
                      aria-pressed={isChosen}
                    >
                      <span className="flex items-start gap-3">
                        {/* Checkbox indicator */}
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
                  className="font-body transition-smooth"
                  data-ocid="seven_sins_quiz.back_button"
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasSelection || isSaving}
                  className="gap-2 font-body min-w-[130px] bg-primary text-primary-foreground font-semibold transition-smooth"
                  data-ocid="seven_sins_quiz.next_button"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      Saving…
                    </>
                  ) : isLast ? (
                    "See Results →"
                  ) : (
                    "Next →"
                  )}
                </Button>
              </div>
            </div>
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
