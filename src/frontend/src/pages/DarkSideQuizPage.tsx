import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { createActor } from "../backend";
import {
  DARK_SIDE_QUESTIONS,
  computeDarkSideScores,
} from "../data/darkSideQuestions";
import { useAuth } from "../hooks/useAuth";
import type { DarkSideType } from "../types/darkSide";

const OPTION_STYLES = [
  "hover:border-primary focus-visible:ring-primary/40",
  "hover:border-accent focus-visible:ring-accent/40",
  "hover:border-secondary focus-visible:ring-secondary/40",
  "hover:border-muted-foreground focus-visible:ring-muted-foreground/40",
];

export function DarkSideQuizPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { actor } = useActor(createActor);
  const [currentQ, setCurrentQ] = useState(0);
  const [allAnswers, setAllAnswers] = useState<DarkSideType[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const question = DARK_SIDE_QUESTIONS[currentQ];
  const totalQ = DARK_SIDE_QUESTIONS.length;
  const progress = ((currentQ + (selected !== null ? 0.5 : 0)) / totalQ) * 100;
  const isLast = currentQ === totalQ - 1;

  const handleSelect = useCallback((idx: number) => setSelected(idx), []);

  const handleNext = useCallback(async () => {
    if (selected === null) return;
    const chosenType = question.options[selected].darkType;
    const newAnswers = [...allAnswers, chosenType];

    if (isLast) {
      const scores = computeDarkSideScores(newAnswers);
      const dominantScore = scores[0];

      if (!token) {
        console.log("Saving dark side result for user: no token");
        setSaveError("Please log in to save your results");
      } else if (actor) {
        setIsSaving(true);
        console.log("Saving dark side result for user: logged in");
        try {
          // Save to darkside_results collection (new detailed entry)
          await actor.saveDarkSideResultEntry(
            token,
            dominantScore.darkType,
            dominantScore.percentage,
            JSON.stringify(scores),
          );
          console.log("Dark side result saved to collection");

          // Also save full summary to profile (for the old summary field)
          const actorAny = actor as unknown as Record<
            string,
            (...args: unknown[]) => Promise<unknown>
          >;
          if (typeof actorAny.saveDarkSideResult === "function") {
            await actorAny.saveDarkSideResult(
              token,
              scores.map((s) => ({
                darkType: { [s.darkType]: null },
                count: BigInt(s.count),
                percentage: s.percentage,
              })),
            );
          }
        } catch (err) {
          console.error("Failed to save dark side result:", err);
          // Non-blocking: result still shown
        } finally {
          setIsSaving(false);
        }
      }

      sessionStorage.setItem(
        "darkSideResult",
        JSON.stringify({
          topTypes: scores,
          takenAt: new Date().toISOString(),
        }),
      );
      router.navigate({ to: "/dark-side-result" });
    } else {
      setDirection(1);
      setAllAnswers(newAnswers);
      setCurrentQ((q) => q + 1);
      setSelected(null);
    }
  }, [selected, question, allAnswers, isLast, token, actor, router]);

  const handleBack = useCallback(() => {
    if (currentQ === 0) return;
    setDirection(-1);
    setAllAnswers((prev) => prev.slice(0, -1));
    setCurrentQ((q) => q - 1);
    setSelected(null);
  }, [currentQ]);

  return (
    <div
      className="flex-1 flex flex-col items-center px-4 py-10 bg-background"
      data-ocid="dark_side_quiz.page"
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
            Self-Awareness Discovery
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Know Your Dark Side
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Honest answers reveal patterns, for self-awareness, not judgment
          </p>
        </motion.div>

        {/* Save error */}
        {saveError && (
          <div
            className="mb-4 px-4 py-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm font-body"
            data-ocid="dark_side_quiz.save_error_state"
          >
            {saveError}
          </div>
        )}

        {/* Progress */}
        <div className="mb-6" data-ocid="dark_side_quiz.progress">
          <div className="flex justify-between text-xs text-muted-foreground font-body mb-1.5">
            <span>
              Question {currentQ + 1} of {totalQ}
            </span>
            <span className="font-semibold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
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
            data-ocid="dark_side_quiz.question_card"
          >
            <div className="h-1 bg-primary" />
            <div className="p-6 sm:p-8">
              <p className="font-display text-xl font-semibold text-foreground mb-6 leading-relaxed">
                {question.text}
              </p>

              <div
                className="space-y-3"
                data-ocid="dark_side_quiz.options_list"
              >
                {question.options.map((opt, idx) => {
                  const isChosen = selected === idx;
                  return (
                    <motion.button
                      type="button"
                      key={opt.text}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleSelect(idx)}
                      className={[
                        "w-full text-left px-4 py-3.5 rounded-xl border-2 transition-smooth font-body text-sm leading-relaxed",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                        isChosen
                          ? "border-primary bg-primary/12 text-foreground shadow-sm"
                          : `border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40 ${OPTION_STYLES[idx]}`,
                      ].join(" ")}
                      data-ocid={`dark_side_quiz.option.${idx + 1}`}
                      aria-pressed={isChosen}
                    >
                      <span className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-smooth",
                            isChosen
                              ? "border-primary bg-primary"
                              : "border-muted-foreground",
                          ].join(" ")}
                        >
                          {isChosen && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                          )}
                        </span>
                        <span>
                          <span className="text-primary font-semibold mr-1">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          {opt.text}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentQ === 0}
                  className="gap-1.5 font-body transition-smooth"
                  data-ocid="dark_side_quiz.back_button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={selected === null || isSaving}
                  className="gap-2 font-body min-w-[130px] bg-primary text-primary-foreground font-semibold transition-smooth"
                  data-ocid="dark_side_quiz.next_button"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      Saving…
                    </>
                  ) : isLast ? (
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
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground font-body mt-2">
          All responses are for educational self-reflection, there are no right
          or wrong answers.
        </p>
      </div>
    </div>
  );
}
