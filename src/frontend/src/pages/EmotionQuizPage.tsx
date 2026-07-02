import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActor } from "@caffeineai/core-infrastructure";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { createActor } from "../backend";
import { ProgressBar } from "../components/ProgressBar";
import { useAuth } from "../hooks/useAuth";
import { EMOTION_QUESTIONS } from "../types/emotion";
import type { EmotionScore, EmotionType } from "../types/emotion";

function computeScores(answers: EmotionType[][]): EmotionScore[] {
  const counts: Partial<Record<EmotionType, number>> = {};
  let total = 0;
  for (const questionAnswers of answers) {
    for (const emotion of questionAnswers) {
      counts[emotion] = (counts[emotion] ?? 0) + 1;
      total++;
    }
  }
  return (Object.entries(counts) as [EmotionType, number][])
    .map(([emotion, count]) => ({
      emotion,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}


export function EmotionQuizPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { actor } = useActor(createActor);
  const [currentQ, setCurrentQ] = useState(0);
  const [allAnswers, setAllAnswers] = useState<EmotionType[][]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const question = EMOTION_QUESTIONS[currentQ];
  const totalQ = EMOTION_QUESTIONS.length;
  const isLast = currentQ === totalQ - 1;

  const handleAnswer = useCallback(
    async (idx: number) => {
      if (isSaving) return;
      const chosenEmotions = question.options[idx].emotions;
      const newAnswers = [...allAnswers, chosenEmotions];

      if (isLast) {
        setIsSaving(true);
        const scores = computeScores(newAnswers);
        const top3 = scores.slice(0, 3);
        const topEmotion = top3[0];

        if (!token) {
          console.log("Saving emotion quiz result for user: no token");
          setSaveError("Please log in to save your results");
        } else if (actor) {
          console.log("Saving emotion quiz result for user: logged in");
          try {
            await actor.saveEmotionResultEntry(
              token,
              topEmotion.emotion,
              topEmotion.percentage,
            );
            await actor.saveEmotionResult(
              token,
              top3.map((s) => ({
                emotion: s.emotion,
                count: BigInt(s.count),
                percentage: s.percentage,
              })),
            );
          } catch (err) {
            console.error("Failed to save emotion result:", err);
          }
        }

        sessionStorage.setItem(
          "emotion_result",
          JSON.stringify({
            topEmotions: scores,
            takenAt: new Date().toISOString(),
          }),
        );
        router.navigate({ to: "/emotion-result" });
      } else {
        setAllAnswers(newAnswers);
        setCurrentQ((q) => q + 1);
      }
    },
    [question, allAnswers, isLast, isSaving, token, actor, router],
  );

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative"
      data-ocid="emotion_quiz.page"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(var(--primary))" }}
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
            Emotion Discovery
          </p>
          <h1 className="font-display text-xl font-bold text-foreground">
            What Are You Feeling?
          </h1>
        </motion.div>

        {/* Save error */}
        {saveError && (
          <div
            className="mb-4 px-4 py-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm font-body text-center"
            data-ocid="emotion_quiz.save_error_state"
          >
            {saveError}
          </div>
        )}

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar
            current={currentQ}
            total={totalQ}
            data-ocid="emotion_quiz.progress_bar"
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
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
              data-ocid="emotion_quiz.question_card"
            >
              <div
                className="absolute top-0 inset-x-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(var(--primary) / 0.6), transparent)",
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

                  <p className="font-display text-lg font-semibold text-foreground mb-6 leading-relaxed text-center">
                    {question.text}
                  </p>

                  <div className="flex flex-col gap-2.5" data-ocid="emotion_quiz.options_list">
                    {question.options.map((opt, idx) => (
                      <motion.button
                        type="button"
                        key={`${opt.text}-${idx}`}
                        onClick={() => handleAnswer(idx)}
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
                        data-ocid={`emotion_quiz.option.${idx + 1}`}
                      >
                        {opt.text}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground font-body mt-2">
          There are no right or wrong answers, trust your instinct.
        </p>
      </div>
    </div>
  );
}
