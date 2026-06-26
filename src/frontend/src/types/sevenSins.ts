export type SinType =
  | "pride"
  | "greed"
  | "wrath"
  | "envy"
  | "gluttony"
  | "lust"
  | "sloth";

export interface SevenSinsScore {
  sin: SinType;
  percentage: number;
}

export interface SevenSinsResult {
  scores: SevenSinsScore[];
  dominantSin: SinType;
  userName: string;
  takenAt: string;
}
