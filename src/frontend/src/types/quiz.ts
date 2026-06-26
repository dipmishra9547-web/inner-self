import type { AnimalType } from "./animals";

export interface QuizAnswer {
  questionId: number;
  selectedOption: number;
  animalWeight: Record<AnimalType, number>;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  result: AnimalType | null;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    weights: Partial<Record<AnimalType, number>>;
  }[];
}
