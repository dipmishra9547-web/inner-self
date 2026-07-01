import {
  Angry,
  Annoyed,
  Flame,
  Frown,
  Ghost,
  Heart,
  HeartCrack,
  type LucideIcon,
  Smile,
  Sparkles,
  Wind,
} from "lucide-react";

export enum EmotionType {
  Fear = "Fear",
  Anger = "Anger",
  Happiness = "Happiness",
  Sadness = "Sadness",
  Love = "Love",
  Anxiety = "Anxiety",
  Desire = "Desire",
  Guilt = "Guilt",
  Awe = "Awe",
  Peace = "Peace",
}

export interface EmotionQuestion {
  id: number;
  text: string;
  options: EmotionOption[];
}

export interface EmotionOption {
  text: string;
  emotions: EmotionType[];
}

export interface EmotionQuizState {
  currentQuestion: number;
  answers: EmotionType[][];
  isComplete: boolean;
}

export interface EmotionResult {
  topEmotions: EmotionScore[];
  takenAt: Date;
}

export interface EmotionScore {
  emotion: EmotionType;
  count: number;
  percentage: number;
}

export interface PhilosophyQuote {
  emotion: EmotionType;
  emoji: string;
  philosopher: string;
  source: string;
  quote: string;
  insight: string;
}

export const EMOTION_PHILOSOPHY: Record<EmotionType, PhilosophyQuote> = {
  [EmotionType.Fear]: {
    emotion: EmotionType.Fear,
    emoji: "😨",
    philosopher: "Epictetus",
    source: "Enchiridion",
    quote:
      "Men are disturbed not by things, but by the views they take of them.",
    insight: "Fear is often your interpretation, not reality.",
  },
  [EmotionType.Anger]: {
    emotion: EmotionType.Anger,
    emoji: "😠",
    philosopher: "Seneca",
    source: "On Anger",
    quote: "Anger is a brief madness.",
    insight: "You lose control before you realize it.",
  },
  [EmotionType.Happiness]: {
    emotion: EmotionType.Happiness,
    emoji: "😊",
    philosopher: "Aristotle",
    source: "Nicomachean Ethics",
    quote: "Happiness depends upon ourselves.",
    insight: "It's built internally, not externally.",
  },
  [EmotionType.Sadness]: {
    emotion: EmotionType.Sadness,
    emoji: "😢",
    philosopher: "Arthur Schopenhauer",
    source: "The World as Will and Representation",
    quote: "Life swings between pain and boredom.",
    insight: "Sadness is part of the human condition.",
  },
  [EmotionType.Love]: {
    emotion: EmotionType.Love,
    emoji: "😍",
    philosopher: "Plato",
    source: "Symposium",
    quote: "At the touch of love, everyone becomes a poet.",
    insight: "Love transforms perception and meaning.",
  },
  [EmotionType.Anxiety]: {
    emotion: EmotionType.Anxiety,
    emoji: "😟",
    philosopher: "Søren Kierkegaard",
    source: "The Concept of Anxiety",
    quote: "Anxiety is the dizziness of freedom.",
    insight: "Anxiety comes from too many possibilities.",
  },
  [EmotionType.Desire]: {
    emotion: EmotionType.Desire,
    emoji: "😤",
    philosopher: "Thomas Hobbes",
    source: "Leviathan",
    quote: "The desire of power ceaseth only in death.",
    insight: "Desire is endless: control it or it controls you.",
  },
  [EmotionType.Guilt]: {
    emotion: EmotionType.Guilt,
    emoji: "😔",
    philosopher: "Jean-Paul Sartre",
    source: "Being and Nothingness",
    quote: "Man is condemned to be free… responsible for his actions.",
    insight: "Guilt reflects responsibility.",
  },
  [EmotionType.Awe]: {
    emotion: EmotionType.Awe,
    emoji: "😮",
    philosopher: "Immanuel Kant",
    source: "Critique of Practical Reason",
    quote: "The starry heavens above me and the moral law within me.",
    insight: "Awe connects you to something bigger than yourself.",
  },
  [EmotionType.Peace]: {
    emotion: EmotionType.Peace,
    emoji: "🧘",
    philosopher: "Marcus Aurelius",
    source: "Meditations",
    quote: "You have power over your mind, not outside events.",
    insight: "Control your mind = control your life.",
  },
};

export const EMOTION_ICONS: Record<EmotionType, LucideIcon> = {
  [EmotionType.Fear]: Ghost,
  [EmotionType.Anger]: Angry,
  [EmotionType.Happiness]: Smile,
  [EmotionType.Sadness]: Frown,
  [EmotionType.Love]: Heart,
  [EmotionType.Anxiety]: Annoyed,
  [EmotionType.Desire]: Flame,
  [EmotionType.Guilt]: HeartCrack,
  [EmotionType.Awe]: Sparkles,
  [EmotionType.Peace]: Wind,
};

/** CSS custom-property name (without var()) holding this emotion's accent color, e.g. "--emotion-fear". */
export const EMOTION_COLOR_VARS: Record<EmotionType, string> = {
  [EmotionType.Fear]: "--emotion-fear",
  [EmotionType.Anger]: "--emotion-anger",
  [EmotionType.Happiness]: "--emotion-happiness",
  [EmotionType.Sadness]: "--emotion-sadness",
  [EmotionType.Love]: "--emotion-love",
  [EmotionType.Anxiety]: "--emotion-anxiety",
  [EmotionType.Desire]: "--emotion-desire",
  [EmotionType.Guilt]: "--emotion-guilt",
  [EmotionType.Awe]: "--emotion-awe",
  [EmotionType.Peace]: "--emotion-peace",
};

export function emotionColor(emotion: EmotionType, alpha?: number): string {
  const v = EMOTION_COLOR_VARS[emotion];
  return alpha != null ? `oklch(var(${v}) / ${alpha})` : `oklch(var(${v}))`;
}

export const EMOTION_QUESTIONS: EmotionQuestion[] = [
  {
    id: 1,
    text: "When facing an important decision, you most often feel…",
    options: [
      {
        text: "A knot in my stomach: what if I choose wrong?",
        emotions: [EmotionType.Fear, EmotionType.Anxiety],
      },
      {
        text: "Excited by the possibilities ahead of me",
        emotions: [EmotionType.Desire, EmotionType.Happiness],
      },
      {
        text: "A calm sense that the right choice will emerge",
        emotions: [EmotionType.Peace],
      },
      {
        text: "Frustrated that the choice even exists",
        emotions: [EmotionType.Anger],
      },
    ],
  },
  {
    id: 2,
    text: "When someone close to you disappoints you, your first reaction is…",
    options: [
      {
        text: "Hurt and withdrawn: I replay it for days",
        emotions: [EmotionType.Sadness, EmotionType.Guilt],
      },
      {
        text: "Angry: I need to express it immediately",
        emotions: [EmotionType.Anger],
      },
      {
        text: "Worried the relationship is damaged",
        emotions: [EmotionType.Anxiety, EmotionType.Love],
      },
      {
        text: "I try to understand their perspective first",
        emotions: [EmotionType.Peace],
      },
    ],
  },
  {
    id: 3,
    text: "Standing at the edge of the ocean at sunset, you feel…",
    options: [
      {
        text: "Awe: I'm humbled by how vast everything is",
        emotions: [EmotionType.Awe],
      },
      {
        text: "Peaceful: worries seem far away here",
        emotions: [EmotionType.Peace],
      },
      {
        text: "A longing for someone to share this with",
        emotions: [EmotionType.Love, EmotionType.Sadness],
      },
      {
        text: "Restless: I want to keep exploring",
        emotions: [EmotionType.Desire],
      },
    ],
  },
  {
    id: 4,
    text: "When you think about your biggest unmet goal, you feel…",
    options: [
      { text: "Driven: I will find a way", emotions: [EmotionType.Desire] },
      {
        text: "Guilty: I should be further along by now",
        emotions: [EmotionType.Guilt],
      },
      {
        text: "Anxious: time is slipping away",
        emotions: [EmotionType.Anxiety, EmotionType.Fear],
      },
      {
        text: "Hopeful: it's still possible",
        emotions: [EmotionType.Happiness],
      },
    ],
  },
  {
    id: 5,
    text: "In a group setting where conflict arises, you…",
    options: [
      {
        text: "Step in and try to resolve it",
        emotions: [EmotionType.Desire, EmotionType.Peace],
      },
      {
        text: "Feel my heart race and want to escape",
        emotions: [EmotionType.Fear, EmotionType.Anxiety],
      },
      {
        text: "Feel frustrated and speak your mind",
        emotions: [EmotionType.Anger],
      },
      {
        text: "Quietly observe and feel sad for everyone",
        emotions: [EmotionType.Sadness],
      },
    ],
  },
  {
    id: 6,
    text: "When you accomplish something you've worked hard for, you…",
    options: [
      {
        text: "Feel pure joy: I celebrate!",
        emotions: [EmotionType.Happiness],
      },
      {
        text: "Already think about the next challenge",
        emotions: [EmotionType.Desire],
      },
      {
        text: "Feel relieved more than happy",
        emotions: [EmotionType.Anxiety, EmotionType.Peace],
      },
      { text: "Wonder if I truly deserved it", emotions: [EmotionType.Guilt] },
    ],
  },
  {
    id: 7,
    text: "When you listen to a piece of music that moves you deeply, you feel…",
    options: [
      {
        text: "Transported: it connects me to something beyond words",
        emotions: [EmotionType.Awe, EmotionType.Love],
      },
      {
        text: "A beautiful sadness: bittersweet memories",
        emotions: [EmotionType.Sadness],
      },
      {
        text: "Calm and centered, like returning home",
        emotions: [EmotionType.Peace],
      },
      {
        text: "Energized and ready to conquer anything",
        emotions: [EmotionType.Desire, EmotionType.Happiness],
      },
    ],
  },
  {
    id: 8,
    text: "When a relationship ends (romantic or otherwise), you…",
    options: [
      {
        text: "Grieve deeply and need time to heal",
        emotions: [EmotionType.Sadness, EmotionType.Love],
      },
      {
        text: "Feel anger: how did this happen?",
        emotions: [EmotionType.Anger],
      },
      {
        text: "Blame yourself and wonder what you did wrong",
        emotions: [EmotionType.Guilt],
      },
      {
        text: "Worry about being alone or starting over",
        emotions: [EmotionType.Fear, EmotionType.Anxiety],
      },
    ],
  },
  {
    id: 9,
    text: "Looking at a starry night sky, you feel…",
    options: [
      {
        text: "Awe: the universe is incomprehensibly vast",
        emotions: [EmotionType.Awe],
      },
      {
        text: "Peaceful: I am small but I belong here",
        emotions: [EmotionType.Peace],
      },
      {
        text: "Lonely: I feel the weight of existence",
        emotions: [EmotionType.Sadness],
      },
      {
        text: "Curious and hungry to understand it all",
        emotions: [EmotionType.Desire, EmotionType.Awe],
      },
    ],
  },
  {
    id: 10,
    text: "When someone criticizes you unfairly, you…",
    options: [
      {
        text: "Boil inside: I need to defend myself",
        emotions: [EmotionType.Anger],
      },
      {
        text: "Feel hurt and doubt yourself for days",
        emotions: [EmotionType.Sadness, EmotionType.Guilt],
      },
      {
        text: "Get anxious: maybe they're partly right?",
        emotions: [EmotionType.Anxiety, EmotionType.Fear],
      },
      {
        text: "Let it go: their opinion doesn't define me",
        emotions: [EmotionType.Peace],
      },
    ],
  },
  {
    id: 11,
    text: "If you had one week completely free, with no obligations, you'd feel…",
    options: [
      {
        text: "Free and at peace: pure bliss",
        emotions: [EmotionType.Peace, EmotionType.Happiness],
      },
      {
        text: "Restless: I need to be working toward something",
        emotions: [EmotionType.Desire],
      },
      {
        text: "Anxious: what if I waste this time?",
        emotions: [EmotionType.Anxiety],
      },
      {
        text: "Excited to do everything I've been putting off",
        emotions: [EmotionType.Happiness, EmotionType.Love],
      },
    ],
  },
  {
    id: 12,
    text: "When you witness an injustice (in news, life, or history), you feel…",
    options: [
      {
        text: "Deep anger: this must be changed",
        emotions: [EmotionType.Anger, EmotionType.Desire],
      },
      {
        text: "Profound sadness: how did we get here?",
        emotions: [EmotionType.Sadness, EmotionType.Awe],
      },
      {
        text: "Fearful: it could happen to anyone",
        emotions: [EmotionType.Fear],
      },
      {
        text: "Guilty: I wonder if I do enough",
        emotions: [EmotionType.Guilt],
      },
    ],
  },
];
