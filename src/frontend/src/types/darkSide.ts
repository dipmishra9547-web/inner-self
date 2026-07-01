import {
  Flame,
  Globe,
  type LucideIcon,
  Search,
  Shield,
  Snowflake,
  Target,
  Zap,
} from "lucide-react";

export enum DarkSideType {
  IntrovertedThinker = "IntrovertedThinker",
  ExtravertedThinker = "ExtravertedThinker",
  IntrovertedFeeler = "IntrovertedFeeler",
  ExtravertedFeeler = "ExtravertedFeeler",
  Manipulator = "Manipulator",
  Psychopath = "Psychopath",
  Sociopath = "Sociopath",
}

export interface DarkSideQuestion {
  id: number;
  text: string;
  options: DarkSideOption[];
}

export interface DarkSideOption {
  text: string;
  darkType: DarkSideType;
}

export interface DarkSideScore {
  darkType: DarkSideType;
  count: number;
  percentage: number;
}

export interface DarkSideResultSummary {
  topTypes: DarkSideScore[];
  takenAt: string;
}

export interface DarkSideProfile {
  emoji: string;
  name: string;
  archLabel: string;
  tagline: string;
  strengths: string[];
  weaknesses: string[];
  insight: string;
  color: string;
}

export const DARK_SIDE_PROFILES: Record<DarkSideType, DarkSideProfile> = {
  [DarkSideType.IntrovertedThinker]: {
    emoji: "🔍",
    name: "Introverted Thinker",
    archLabel: "The Lone Planner",
    tagline: "Quiet mind. Precise execution.",
    strengths: [
      "Exceptional analytical and problem-solving skills",
      "Highly self-reliant and capable of deep independent work",
      "Strategic patience: thinks before acting",
      "Strong focus and attention to detail in complex tasks",
    ],
    weaknesses: [
      "Can become overly secretive or isolating",
      "May struggle to collaborate or trust others",
      "Risk of over-intellectualizing emotional situations",
      "Prone to detachment from social feedback",
    ],
    insight:
      "Your solitary depth is your greatest asset: channel it into focused creation rather than withdrawal.",
    color: "#6366f1",
  },
  [DarkSideType.ExtravertedThinker]: {
    emoji: "🌐",
    name: "Extraverted Thinker",
    archLabel: "The Mastermind",
    tagline: "Strategy at scale. People as resources.",
    strengths: [
      "Natural leadership and organizational intelligence",
      "Ability to coordinate complex systems and people",
      "Confident decision-making under pressure",
      "High strategic vision and long-term thinking",
    ],
    weaknesses: [
      "Can overlook others' emotions in pursuit of goals",
      "Risk of overconfidence due to external validation seeking",
      "May use social dynamics manipulatively",
      "Tendency to measure worth by achievement and status",
    ],
    insight:
      "Your strategic brilliance shines when guided by empathy: the best leaders build people up, not just systems.",
    color: "#0ea5e9",
  },
  [DarkSideType.IntrovertedFeeler]: {
    emoji: "🛡️",
    name: "Introverted Feeler",
    archLabel: "The Quiet Idealist",
    tagline: "Deep values. Slow to act. Hard to forget.",
    strengths: [
      "Profound moral clarity and personal integrity",
      "High empathy and sensitivity to others' needs",
      "Loyal and deeply committed to meaningful relationships",
      "Creative depth fueled by inner emotional world",
    ],
    weaknesses: [
      "Emotions can build silently until an explosive release",
      "May internalize injustice to the point of resentment",
      "Can struggle to assert needs or set healthy boundaries",
      "Risk of ideological rigidity when values feel threatened",
    ],
    insight:
      "Your inner world is extraordinarily rich: learning to express it safely prevents the quiet storm from becoming a sudden one.",
    color: "#8b5cf6",
  },
  [DarkSideType.ExtravertedFeeler]: {
    emoji: "🔥",
    name: "Extraverted Feeler",
    archLabel: "The Social Flame",
    tagline: "Hearts connected. Emotions amplified.",
    strengths: [
      "Magnetic social presence and emotional intelligence",
      "Ability to inspire and motivate groups with genuine warmth",
      "Strong intuition about group dynamics and moods",
      "Natural peacemaker and relationship-builder",
    ],
    weaknesses: [
      "Highly susceptible to peer pressure and social norms",
      "Decisions can be swayed by emotional group momentum",
      "May prioritize belonging over personal values",
      "Reactive under emotional stress in social settings",
    ],
    insight:
      "Your emotional attunement is a gift: use it to lead with intention, not just to follow the energy of the room.",
    color: "#f59e0b",
  },
  [DarkSideType.Manipulator]: {
    emoji: "♟️",
    name: "Manipulator",
    archLabel: "The Calculated Strategist",
    tagline: "Every move is deliberate.",
    strengths: [
      "Exceptional long-term strategic planning",
      "Skilled at reading social dynamics and building alliances",
      "Disciplined, patient, and goal-oriented",
      "Highly effective in negotiation and persuasion",
    ],
    weaknesses: [
      "Risk of viewing relationships as purely transactional",
      "May struggle to form genuine emotional bonds",
      "Over-reliance on strategy can erode spontaneous trust",
      "Tendency toward cynicism about others' motives",
    ],
    insight:
      "Your strategic mind is a remarkable tool: true influence is built through genuine trust, not clever calculation alone.",
    color: "#10b981",
  },
  [DarkSideType.Psychopath]: {
    emoji: "🧊",
    name: "Psychopath",
    archLabel: "The Born Predator",
    tagline: "Calm in chaos. Unmoved by pressure.",
    strengths: [
      "Exceptional composure and calm under high-pressure situations",
      "Ability to make rational, unbiased decisions without emotional interference",
      "Resilient in crisis: not paralyzed by fear or guilt",
      "Bold, clear-minded, and highly decisive",
    ],
    weaknesses: [
      "Emotional shallowness limits deep relationship formation",
      "Risk of treating people as means rather than ends",
      "May struggle to understand or care about others' pain",
      "Impulse control can waver despite surface calm",
    ],
    insight:
      "Your emotional detachment gives you rare clarity under fire: grounding it in ethical commitment transforms it from a liability into a leadership edge.",
    color: "#64748b",
  },
  [DarkSideType.Sociopath]: {
    emoji: "⚡",
    name: "Sociopath",
    archLabel: "The Reactive Offender",
    tagline: "Passion unfiltered. Loyalty fierce. Edges sharp.",
    strengths: [
      "Intense passion and drive that can fuel remarkable energy",
      "Capable of forming deep, loyal bonds with chosen individuals",
      "Highly authentic and unfiltered in self-expression",
      "Quick to act and rarely paralyzed by over-analysis",
    ],
    weaknesses: [
      "Volatile emotional reactions in high-stress situations",
      "Disorganized and impulsive decision-making",
      "Unstable relationship patterns due to intensity",
      "Difficulty managing long-term consequences of actions",
    ],
    insight:
      "Your raw intensity is a force of nature: when channeled through self-awareness, it becomes powerful creative and emotional leadership.",
    color: "#ef4444",
  },
};

export const DARK_SIDE_ICONS: Record<DarkSideType, LucideIcon> = {
  [DarkSideType.IntrovertedThinker]: Search,
  [DarkSideType.ExtravertedThinker]: Globe,
  [DarkSideType.IntrovertedFeeler]: Shield,
  [DarkSideType.ExtravertedFeeler]: Flame,
  [DarkSideType.Manipulator]: Target,
  [DarkSideType.Psychopath]: Snowflake,
  [DarkSideType.Sociopath]: Zap,
};

// Slice colors for the pie chart: matches profile colors
export const DARK_SIDE_CHART_COLORS: Record<DarkSideType, string> = {
  [DarkSideType.IntrovertedThinker]: "#6366f1",
  [DarkSideType.ExtravertedThinker]: "#0ea5e9",
  [DarkSideType.IntrovertedFeeler]: "#8b5cf6",
  [DarkSideType.ExtravertedFeeler]: "#f59e0b",
  [DarkSideType.Manipulator]: "#10b981",
  [DarkSideType.Psychopath]: "#64748b",
  [DarkSideType.Sociopath]: "#ef4444",
};
