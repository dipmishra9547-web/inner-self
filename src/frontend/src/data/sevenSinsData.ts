import type { SevenSinsScore, SinType } from "../types/sevenSins";

// ── Sin profiles ───────────────────────────────────────────────────────────────
export interface SinProfile {
  name: string;
  emoji: string;
  color: string;
  description: string;
  insight: string;
}

// ── Core principles per sin ────────────────────────────────────────────────────
export interface SinPrinciples {
  subtitle: string;
  description: string;
  innerPower: string;
  antidote: string;
}

export const SIN_PRINCIPLES: Record<SinType, SinPrinciples> = {
  pride: {
    subtitle: "The Power of Self-Assertion",
    description:
      "Considered the queen of all sins and the root of others. It is an excessive love of one's own excellence, arrogance, or self-importance.",
    innerPower:
      "Self-awareness and Identity. When imbalanced, this becomes pride.",
    antidote: "Humility",
  },
  envy: {
    subtitle: "The Power of Social Comparison",
    description:
      "Resentment or sadness at another's success, possessions, or status. It is not just wanting what someone else has, but wishing they did not have it.",
    innerPower:
      "Social Drive and Aspirations. When imbalanced, this becomes envy.",
    antidote: "Kindness/Admiration",
  },
  wrath: {
    subtitle: "The Power of Self-Defense",
    description:
      "Uncontrolled anger, hatred, or the desire for vengeance. It is malicious or spiteful anger that seeks to damage others.",
    innerPower:
      "Passion and Assertion. When imbalanced, it becomes destructive anger.",
    antidote: "Patience/Forgiveness",
  },
  sloth: {
    subtitle: "The Power of Rest",
    description:
      "Laziness, apathy, or failure to act and utilize one's talents. It is not just physical laziness, but a spiritual laziness, boredom, or negligence toward spiritual growth.",
    innerPower:
      "Conservation of Energy. When imbalanced, it becomes apathy and spiritual apathy.",
    antidote: "Diligence",
  },
  greed: {
    subtitle: "The Power of Provision",
    description:
      "An obsessive desire for material wealth, possessions, or power.",
    innerPower:
      "Security and Provision. When imbalanced, it becomes a desperate craving for more.",
    antidote: "Charity/Generosity",
  },
  gluttony: {
    subtitle: "The Power of Consumption",
    description:
      "The excessive, overindulgent, or wasteful consumption of food, drink, or resources.",
    innerPower:
      "Nourishment and Enjoyment. When imbalanced, it becomes gluttony.",
    antidote: "Temperance",
  },
  lust: {
    subtitle: "The Power of Passion",
    description:
      "An uncontrollable, excessive, or disorderly craving for sexual pleasure.",
    innerPower: "Desire and Creation. When imbalanced, it becomes lust.",
    antidote: "Chastity",
  },
};

export const SIN_PROFILES: Record<SinType, SinProfile> = {
  pride: {
    name: "Pride",
    emoji: "👑",
    color: "#f59e0b",
    description:
      "An inflated sense of self-worth, superiority, and the need to be admired above others.",
    insight:
      "Confidence becomes pride when it needs an audience. True strength doesn't require validation.",
  },
  greed: {
    name: "Greed",
    emoji: "💰",
    color: "#10b981",
    description:
      "An insatiable desire for wealth, possessions, or power — always wanting more than enough.",
    insight:
      "Enough is a mindset, not a number. The more you cling, the less you truly possess.",
  },
  wrath: {
    name: "Wrath",
    emoji: "🔥",
    color: "#ef4444",
    description:
      "Uncontrolled rage, a hunger for revenge, and a hair-trigger response to perceived injustice.",
    insight:
      "Anger is information. But acted upon blindly, it burns the one who carries it most.",
  },
  envy: {
    name: "Envy",
    emoji: "💚",
    color: "#22c55e",
    description:
      "A bitter resentment of others' success, beauty, or fortune — wanting what they have.",
    insight:
      "Envy is a compass pointing to your own unfulfilled desires. Use it as a map, not a weapon.",
  },
  gluttony: {
    name: "Gluttony",
    emoji: "🍷",
    color: "#a855f7",
    description:
      "Overindulgence in food, pleasure, or experiences — consuming far beyond genuine need.",
    insight:
      "Pleasure is healthiest in measure. Excess dulls the very senses it seeks to satisfy.",
  },
  lust: {
    name: "Lust",
    emoji: "❤️‍🔥",
    color: "#ec4899",
    description:
      "An intense craving for physical pleasure, desire, and attraction — often overriding reason.",
    insight:
      "Desire is natural; obsession is the trap. Real intimacy grows where craving gives way to care.",
  },
  sloth: {
    name: "Sloth",
    emoji: "😴",
    color: "#6366f1",
    description:
      "A deep avoidance of effort, responsibility, and growth — choosing inaction over discomfort.",
    insight:
      "Rest restores; avoidance corrodes. The hardest step is often the only one that matters.",
  },
};

// ── Questions ─────────────────────────────────────────────────────────────────
export interface SinOption {
  text: string;
  sin: SinType;
  score: number; // 1 (virtue) to 5 (high sin)
}

export interface SinQuestion {
  id: number;
  question: string;
  sin: SinType; // primary sin this question measures
  options: SinOption[];
}

// 15 questions — distribution: Pride×2, Greed×2, Wrath×2, Envy×2, Gluttony×2, Lust×2, Sloth×3
export const SEVEN_SINS_QUESTIONS: SinQuestion[] = [
  // ── Pride (Q1, Q2) ──────────────────────────────────────────────────────────
  {
    id: 1,
    sin: "pride",
    question: "You just completed a big project. What's your first instinct?",
    options: [
      {
        text: "Tell everyone how much effort you put in — they should know",
        sin: "pride",
        score: 5,
      },
      {
        text: "Check if yours was better than your colleagues'",
        sin: "envy",
        score: 3,
      },
      { text: "Ask for feedback so you can improve", sin: "pride", score: 1 },
      {
        text: "Move on quietly — you'll do even better next time",
        sin: "sloth",
        score: 1,
      },
    ],
  },
  {
    id: 2,
    sin: "pride",
    question:
      "Someone publicly corrects you when you're wrong. How do you react?",
    options: [
      {
        text: "Get defensive — you don't like being challenged in front of others",
        sin: "pride",
        score: 5,
      },
      { text: "Go quiet and seethe internally", sin: "wrath", score: 3 },
      { text: "Accept it gracefully", sin: "pride", score: 1 },
      {
        text: "Wonder why they pointed it out and not someone else",
        sin: "envy",
        score: 2,
      },
    ],
  },
  // ── Greed (Q3, Q4) ──────────────────────────────────────────────────────────
  {
    id: 3,
    sin: "greed",
    question:
      "You find out a friend earns significantly more than you for the same job. What do you feel?",
    options: [
      {
        text: "Driven to demand a raise immediately — you deserve more",
        sin: "greed",
        score: 5,
      },
      { text: "Jealous — it's not fair", sin: "envy", score: 4 },
      {
        text: "Curious about what they did differently",
        sin: "greed",
        score: 1,
      },
      { text: "Resentful and unable to let it go", sin: "wrath", score: 3 },
    ],
  },
  {
    id: 4,
    sin: "greed",
    question:
      "You're offered a bonus — but only if you take credit for a teammate's idea. Do you?",
    options: [
      {
        text: "Yes, without hesitation — you need that money",
        sin: "greed",
        score: 5,
      },
      { text: "Yes, but feel guilty later", sin: "greed", score: 3 },
      { text: "No, it's not right", sin: "greed", score: 1 },
      { text: "Ask to split the credit", sin: "greed", score: 2 },
    ],
  },
  // ── Wrath (Q5, Q6) ──────────────────────────────────────────────────────────
  {
    id: 5,
    sin: "wrath",
    question: "Someone cuts in front of you in a long queue. What do you do?",
    options: [
      {
        text: "Confront them loudly — you won't be disrespected",
        sin: "wrath",
        score: 5,
      },
      {
        text: "Mutter under your breath and stew about it",
        sin: "wrath",
        score: 3,
      },
      { text: "Let it go — it's not worth the drama", sin: "wrath", score: 1 },
      {
        text: "Passive-aggressively comment to the person next to you",
        sin: "wrath",
        score: 2,
      },
    ],
  },
  {
    id: 6,
    sin: "wrath",
    question:
      "A close friend cancels plans on you last minute — again. How do you respond?",
    options: [
      { text: "Blow up at them — you've had enough", sin: "wrath", score: 5 },
      {
        text: "Give them the silent treatment for days",
        sin: "wrath",
        score: 3,
      },
      {
        text: "Tell them calmly how it makes you feel",
        sin: "wrath",
        score: 1,
      },
      {
        text: "Say nothing but secretly start pulling away",
        sin: "sloth",
        score: 2,
      },
    ],
  },
  // ── Envy (Q7, Q8) ───────────────────────────────────────────────────────────
  {
    id: 7,
    sin: "envy",
    question:
      "Your best friend lands your dream job. What goes through your mind first?",
    options: [
      {
        text: "Why them and not me? I work just as hard",
        sin: "envy",
        score: 5,
      },
      {
        text: "I'm happy for them but can't shake the jealousy",
        sin: "envy",
        score: 3,
      },
      { text: "Congratulations — I'm genuinely happy", sin: "envy", score: 1 },
      {
        text: "I need to find something even better to compete",
        sin: "pride",
        score: 3,
      },
    ],
  },
  {
    id: 8,
    sin: "envy",
    question:
      "You scroll through social media and see someone living your ideal life. You:",
    options: [
      {
        text: "Feel a pang of bitterness and close the app",
        sin: "envy",
        score: 5,
      },
      { text: "Like it, but wish it were you", sin: "envy", score: 3 },
      { text: "Feel inspired to work harder", sin: "envy", score: 1 },
      {
        text: "Unfollow — you don't need that negativity",
        sin: "envy",
        score: 2,
      },
    ],
  },
  // ── Gluttony (Q9, Q10) ──────────────────────────────────────────────────────
  {
    id: 9,
    sin: "gluttony",
    question: "At an all-you-can-eat buffet, you:",
    options: [
      {
        text: "Go back 3+ times — you want your money's worth and then some",
        sin: "gluttony",
        score: 5,
      },
      {
        text: "Overeat and feel stuffed, then feel guilty",
        sin: "gluttony",
        score: 3,
      },
      {
        text: "Eat a normal amount and stop when you're full",
        sin: "gluttony",
        score: 1,
      },
      {
        text: "Sample everything but don't go overboard",
        sin: "gluttony",
        score: 2,
      },
    ],
  },
  {
    id: 10,
    sin: "gluttony",
    question: "When you're stressed, you tend to:",
    options: [
      { text: "Binge eat — food is comfort", sin: "gluttony", score: 5 },
      {
        text: "Overconsume TV, social media, or games for hours",
        sin: "gluttony",
        score: 3,
      },
      { text: "Exercise or go for a walk", sin: "gluttony", score: 1 },
      { text: "Talk to someone about it", sin: "gluttony", score: 1 },
    ],
  },
  // ── Lust (Q11, Q12) ─────────────────────────────────────────────────────────
  {
    id: 11,
    sin: "lust",
    question:
      "You're in a relationship but feel a strong attraction to someone else. You:",
    options: [
      {
        text: "Act on it — you can't help how you feel",
        sin: "lust",
        score: 5,
      },
      {
        text: "Fantasize about it constantly without acting",
        sin: "lust",
        score: 4,
      },
      {
        text: "Acknowledge the feeling and refocus on your relationship",
        sin: "lust",
        score: 1,
      },
      {
        text: "Distance yourself from the person to avoid temptation",
        sin: "lust",
        score: 2,
      },
    ],
  },
  {
    id: 12,
    sin: "lust",
    question: "How often do your desires and impulses drive your decisions?",
    options: [
      {
        text: "Almost always — I act on what I want in the moment",
        sin: "lust",
        score: 5,
      },
      {
        text: "Often — I know I should think more but my urges win",
        sin: "lust",
        score: 3,
      },
      {
        text: "Sometimes — I try to balance logic and desire",
        sin: "lust",
        score: 2,
      },
      { text: "Rarely — I always think things through", sin: "lust", score: 1 },
    ],
  },
  // ── Sloth (Q13, Q14, Q15) ───────────────────────────────────────────────────
  {
    id: 13,
    sin: "sloth",
    question: "You have a full day off with no obligations. You:",
    options: [
      {
        text: "Stay in bed scrolling your phone until noon",
        sin: "sloth",
        score: 5,
      },
      {
        text: "Intend to be productive but end up doing nothing",
        sin: "sloth",
        score: 3,
      },
      {
        text: "Catch up on things you've been putting off",
        sin: "sloth",
        score: 2,
      },
      { text: "Plan something active or creative", sin: "sloth", score: 1 },
    ],
  },
  {
    id: 14,
    sin: "sloth",
    question:
      "A task you've been avoiding for weeks is still undone. What's your approach?",
    options: [
      { text: "Keep avoiding it — it can wait", sin: "sloth", score: 5 },
      { text: "Think about doing it but never start", sin: "sloth", score: 3 },
      {
        text: "Break it into small steps and do the first one today",
        sin: "sloth",
        score: 1,
      },
      { text: "Ask someone else to handle it", sin: "sloth", score: 2 },
    ],
  },
  {
    id: 15,
    sin: "sloth",
    question: "When it comes to self-improvement — gym, learning, goals — you:",
    options: [
      {
        text: "Know you should but rarely follow through",
        sin: "sloth",
        score: 5,
      },
      { text: "Start strong then quietly give up", sin: "sloth", score: 3 },
      {
        text: "Have a few things you're actively working on",
        sin: "sloth",
        score: 1,
      },
      { text: "Constantly push yourself to grow", sin: "sloth", score: 1 },
    ],
  },
];

// ── Score calculation ─────────────────────────────────────────────────────────
// Distribution: Pride×2, Greed×2, Wrath×2, Envy×2, Gluttony×2, Lust×2, Sloth×3
// maxScore per sin = questionCount × maxOptionsPerQuestion × 5
// With multi-select, users can pick multiple options per question.
// percentage = (totalScore / maxScore) * 100  (capped at 100)
//
// answers: array of { questionId, selectedOptionIndices[] } in completion order
export interface SinAnswer {
  questionId: number;
  selectedOptionIndices: number[];
}

export function computeSevenSinsScores(answers: SinAnswer[]): SevenSinsScore[] {
  // Map question id → question for fast lookup
  const questionMap = new Map(SEVEN_SINS_QUESTIONS.map((q) => [q.id, q]));

  // Accumulate raw scores per sin (summing all selected options' scores)
  const totals: Record<SinType, number> = {
    pride: 0,
    greed: 0,
    wrath: 0,
    envy: 0,
    gluttony: 0,
    lust: 0,
    sloth: 0,
  };

  for (const answer of answers) {
    const q = questionMap.get(answer.questionId);
    if (!q) continue;
    for (const idx of answer.selectedOptionIndices) {
      const option = q.options[idx];
      if (!option) continue;
      // Accumulate score toward the PRIMARY sin of the question
      totals[q.sin] = (totals[q.sin] ?? 0) + option.score;
    }
  }

  // maxScore = number of primary questions × options per question × max score (5)
  // With multi-select (up to 4 options × 5), maxScore scales with option count.
  const sinQuestionCount: Record<SinType, number> = {
    pride: 2,
    greed: 2,
    wrath: 2,
    envy: 2,
    gluttony: 2,
    lust: 2,
    sloth: 3,
  };
  const optionsPerQuestion = 4;
  const maxScores: Record<SinType, number> = {} as Record<SinType, number>;
  for (const sin of Object.keys(sinQuestionCount) as SinType[]) {
    maxScores[sin] = sinQuestionCount[sin] * optionsPerQuestion * 5;
  }

  const sins: SinType[] = [
    "pride",
    "greed",
    "wrath",
    "envy",
    "gluttony",
    "lust",
    "sloth",
  ];

  return sins.map((sin) => ({
    sin,
    percentage: Math.min(100, Math.round((totals[sin] / maxScores[sin]) * 100)),
  }));
}
