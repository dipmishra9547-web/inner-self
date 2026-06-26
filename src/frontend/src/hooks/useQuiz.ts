import { useCallback, useState } from "react";
import { QUIZ_QUESTIONS } from "../data/quizQuestions";
import type { AnimalType } from "../types/animals";
import { ALL_ANIMAL_TYPES } from "../types/animals";
import type { QuizAnswer, QuizState } from "../types/quiz";

const INITIAL_STATE: QuizState = {
  currentQuestionIndex: 0,
  answers: [],
  isComplete: false,
  result: null,
};

function computeResult(answers: QuizAnswer[]): AnimalType {
  const scores: Record<AnimalType, number> = {
    Lion: 0,
    Otter: 0,
    GoldenRetriever: 0,
    Beaver: 0,
    Wolf: 0,
    Sheep: 0,
    Shepherd: 0,
    Fox: 0,
    Owl: 0,
    Elephant: 0,
    Dolphin: 0,
    Bear: 0,
  };

  for (const answer of answers) {
    for (const [animal, weight] of Object.entries(answer.animalWeight)) {
      scores[animal as AnimalType] += weight;
    }
  }

  return ALL_ANIMAL_TYPES.reduce((best, type) =>
    scores[type] > scores[best] ? type : best,
  );
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>(INITIAL_STATE);

  const currentQuestion =
    state.currentQuestionIndex < QUIZ_QUESTIONS.length
      ? QUIZ_QUESTIONS[state.currentQuestionIndex]
      : null;

  const totalQuestions = QUIZ_QUESTIONS.length;
  const progress = Math.round((state.answers.length / totalQuestions) * 100);

  const answerQuestion = useCallback(
    (optionIndex: number) => {
      if (!currentQuestion) return;

      const option = currentQuestion.options[optionIndex];
      const answer: QuizAnswer = {
        questionId: currentQuestion.id,
        selectedOption: optionIndex,
        animalWeight: {
          Lion: option.weights.Lion ?? 0,
          Otter: option.weights.Otter ?? 0,
          GoldenRetriever: option.weights.GoldenRetriever ?? 0,
          Beaver: option.weights.Beaver ?? 0,
          Wolf: option.weights.Wolf ?? 0,
          Sheep: option.weights.Sheep ?? 0,
          Shepherd: option.weights.Shepherd ?? 0,
          Fox: option.weights.Fox ?? 0,
          Owl: option.weights.Owl ?? 0,
          Elephant: option.weights.Elephant ?? 0,
          Dolphin: option.weights.Dolphin ?? 0,
          Bear: option.weights.Bear ?? 0,
        },
      };

      setState((prev) => {
        const newAnswers = [...prev.answers, answer];
        const nextIndex = prev.currentQuestionIndex + 1;
        const isComplete = nextIndex >= totalQuestions;

        return {
          currentQuestionIndex: nextIndex,
          answers: newAnswers,
          isComplete,
          result: isComplete ? computeResult(newAnswers) : null,
        };
      });
    },
    [currentQuestion, totalQuestions],
  );

  const restart = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    currentQuestion,
    totalQuestions,
    progress,
    answerQuestion,
    restart,
  };
}
