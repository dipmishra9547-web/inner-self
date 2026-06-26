export type AnimalType =
  | "Lion"
  | "Otter"
  | "GoldenRetriever"
  | "Beaver"
  | "Wolf"
  | "Sheep"
  | "Shepherd"
  | "Fox"
  | "Owl"
  | "Elephant"
  | "Dolphin"
  | "Bear";

export interface ArchetypeProfile {
  type: AnimalType;
  name: string;
  displayName: string;
  emoji: string;
  tagline: string;
  description: string;
  strengths: string[];
  challenges: string[];
  groupDynamics: {
    large: string;
    small: string;
    micro: string;
    isolation: string;
  };
  color: string;
}

export const ALL_ANIMAL_TYPES: AnimalType[] = [
  "Lion",
  "Otter",
  "GoldenRetriever",
  "Beaver",
  "Wolf",
  "Sheep",
  "Shepherd",
  "Fox",
  "Owl",
  "Elephant",
  "Dolphin",
  "Bear",
];
