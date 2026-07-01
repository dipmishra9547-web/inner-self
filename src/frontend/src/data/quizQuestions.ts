import type { QuizQuestion } from "../types/quiz";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "A conflict erupts in your friend group. What's your instinct?",
    options: [
      {
        text: "Step in and take charge: someone needs to resolve this.",
        weights: { Lion: 3, Shepherd: 2, Bear: 1 },
      },
      {
        text: "Lighten the mood with humor and redirect energy.",
        weights: { Otter: 3, Dolphin: 2 },
      },
      {
        text: "Listen to everyone and help find common ground.",
        weights: { GoldenRetriever: 3, Elephant: 2 },
      },
      {
        text: "Observe quietly and analyze who is right and why.",
        weights: { Beaver: 3, Wolf: 1, Owl: 2, Fox: 1 },
      },
    ],
  },
  {
    id: 2,
    text: "You're planning a Saturday. Which option excites you most?",
    options: [
      {
        text: "Hosting a gathering and being the center of attention.",
        weights: { Lion: 2, Otter: 3, Dolphin: 2 },
      },
      {
        text: "Deep one-on-one conversation with a close friend.",
        weights: { GoldenRetriever: 2, Beaver: 2, Elephant: 2 },
      },
      {
        text: "A solo project that requires focus and precision.",
        weights: { Beaver: 3, Owl: 3 },
      },
      {
        text: "Following the group's plan: you don't want to impose.",
        weights: { Sheep: 3 },
      },
    ],
  },
  {
    id: 3,
    text: "Someone asks for your honest opinion on their work. It needs improvement. You:",
    options: [
      {
        text: "Tell them clearly: they need the truth.",
        weights: { Lion: 2, Beaver: 2, Owl: 1 },
      },
      {
        text: "Soften it into a gentle, encouraging critique.",
        weights: { GoldenRetriever: 3, Dolphin: 2, Elephant: 1 },
      },
      {
        text: "Give a detailed analysis with specific improvements.",
        weights: { Beaver: 3, Owl: 3 },
      },
      {
        text: "Say what they want to hear to avoid tension.",
        weights: { Sheep: 3 },
      },
    ],
  },
  {
    id: 4,
    text: "You walk into a room full of strangers at a social event. What happens?",
    options: [
      {
        text: "You naturally gravitate to the most interesting cluster and take over.",
        weights: { Lion: 3 },
      },
      {
        text: "You immediately start introducing yourself to everyone.",
        weights: { Otter: 3, Dolphin: 3 },
      },
      {
        text: "You find one kind face and build a real connection.",
        weights: { GoldenRetriever: 3, Bear: 1 },
      },
      {
        text: "You assess the power dynamics before making any moves.",
        weights: { Wolf: 3, Shepherd: 1, Fox: 3, Owl: 1 },
      },
    ],
  },
  {
    id: 5,
    text: "A close friend lets you down in a significant way. What do you do?",
    options: [
      {
        text: "Confront them directly: you expect the same honesty back.",
        weights: { Lion: 3, Shepherd: 1 },
      },
      {
        text: "Give it a day, then talk it out warmly.",
        weights: { Otter: 2, GoldenRetriever: 2, Dolphin: 2 },
      },
      {
        text: "Forgive them internally but quietly rebuild trust.",
        weights: { GoldenRetriever: 3, Bear: 2, Elephant: 2 },
      },
      {
        text: "File it away. You'll use that information later.",
        weights: { Wolf: 3, Fox: 2 },
      },
    ],
  },
  {
    id: 6,
    text: "What drives you most in life?",
    options: [
      {
        text: "Achievement and being recognized for excellence.",
        weights: { Lion: 3 },
      },
      {
        text: "Joy, connection, and creating memories.",
        weights: { Otter: 3, Dolphin: 3 },
      },
      {
        text: "Mastery, precision, and building something that lasts.",
        weights: { Beaver: 3, Owl: 2 },
      },
      {
        text: "Belonging and feeling accepted by your community.",
        weights: { Sheep: 3, Elephant: 2 },
      },
    ],
  },
  {
    id: 7,
    text: "How do you feel about being alone for an extended period?",
    options: [
      {
        text: "Restless: you need people to feel alive.",
        weights: { Lion: 2, Otter: 2, Dolphin: 3 },
      },
      {
        text: "Honestly, you love it. Solitude is restorative.",
        weights: { Beaver: 3, Owl: 3 },
      },
      {
        text: "Anxious: you need someone around.",
        weights: { Sheep: 3 },
      },
      {
        text: "You prefer distance to observe rather than be observed.",
        weights: { Shepherd: 2, Wolf: 1, Fox: 2, Bear: 2 },
      },
    ],
  },
  {
    id: 8,
    text: "Someone in your circle is being mistreated. What do you do?",
    options: [
      {
        text: "Intervene immediately, loudly, and decisively.",
        weights: { Lion: 3, Bear: 3 },
      },
      {
        text: "Privately support the person being hurt.",
        weights: { GoldenRetriever: 3, Elephant: 2 },
      },
      {
        text: "Stay quiet to avoid becoming a target yourself.",
        weights: { Sheep: 3 },
      },
      {
        text: "Document the pattern and plan a systematic response.",
        weights: { Beaver: 2, Shepherd: 2, Owl: 2, Fox: 1 },
      },
    ],
  },
  {
    id: 9,
    text: "Which phrase resonates most with how you see yourself?",
    options: [
      { text: '"I lead, others follow."', weights: { Lion: 3 } },
      {
        text: '"Life is better when we\'re all laughing together."',
        weights: { Otter: 3, Dolphin: 2 },
      },
      {
        text: '"I\'d do anything for the people I love."',
        weights: { GoldenRetriever: 3, Elephant: 3, Bear: 2 },
      },
      {
        text: '"I guard what matters. Everything else can wait."',
        weights: { Shepherd: 3, Bear: 2 },
      },
    ],
  },
  {
    id: 10,
    text: "You've just met someone new. What's your first instinct?",
    options: [
      {
        text: "Size them up: are they a rival or an ally?",
        weights: { Lion: 2, Wolf: 2, Fox: 2 },
      },
      {
        text: "Find the funniest or most interesting thing about them.",
        weights: { Otter: 3, Dolphin: 2 },
      },
      {
        text: "Try to make them feel genuinely comfortable.",
        weights: { GoldenRetriever: 3, Elephant: 1 },
      },
      {
        text: "Determine if they are a threat or someone to protect.",
        weights: { Shepherd: 3, Bear: 2, Owl: 1 },
      },
    ],
  },
  {
    id: 11,
    text: "Your team is losing morale on a difficult project. What's your move?",
    options: [
      {
        text: "Rally the team with a bold speech and renewed vision.",
        weights: { Lion: 3, Shepherd: 1 },
      },
      {
        text: "Inject energy and humor to lighten the atmosphere.",
        weights: { Otter: 3, Dolphin: 2 },
      },
      {
        text: "Check in one-on-one with each person to understand their struggle.",
        weights: { GoldenRetriever: 3, Elephant: 2 },
      },
      {
        text: "Break the problem into smaller, solvable parts methodically.",
        weights: { Beaver: 3, Owl: 2, Fox: 1 },
      },
    ],
  },
  {
    id: 12,
    text: "When you sense someone is not being genuine with you, you:",
    options: [
      {
        text: "Call it out directly: you don't tolerate games.",
        weights: { Lion: 3, Bear: 1 },
      },
      {
        text: "Play along for now and gather more information.",
        weights: { Wolf: 3, Beaver: 1, Fox: 3 },
      },
      {
        text: "Give them the benefit of the doubt: maybe you misread.",
        weights: { GoldenRetriever: 3, Sheep: 1, Elephant: 1 },
      },
      {
        text: "Distance yourself quietly without confrontation.",
        weights: { Shepherd: 2, Beaver: 2, Owl: 2, Bear: 1 },
      },
    ],
  },
  {
    id: 13,
    text: "What does loyalty mean to you?",
    options: [
      {
        text: "Standing by someone's side no matter what: unconditionally.",
        weights: { GoldenRetriever: 3, Elephant: 3, Bear: 2 },
      },
      {
        text: "Earning it through consistent action and shared values.",
        weights: { Shepherd: 3, Beaver: 1, Owl: 1 },
      },
      {
        text: "A mutual exchange: you give when they give.",
        weights: { Wolf: 2, Lion: 2, Fox: 2 },
      },
      {
        text: "Staying in the group because it's safer together.",
        weights: { Sheep: 3 },
      },
    ],
  },
  {
    id: 14,
    text: "You're given unstructured free time with no obligations. You feel:",
    options: [
      {
        text: "Energized: finally room for spontaneous adventure.",
        weights: { Otter: 3, Fox: 2 },
      },
      {
        text: "Productive: time to work on that passion project.",
        weights: { Beaver: 3, Lion: 1, Owl: 2 },
      },
      {
        text: "Reflective: you use it to think deeply about your path.",
        weights: { Wolf: 2, Shepherd: 2, Owl: 2, Bear: 1 },
      },
      {
        text: "Restless: without purpose or people, it feels uncomfortable.",
        weights: { Sheep: 2, GoldenRetriever: 2, Dolphin: 2, Elephant: 1 },
      },
    ],
  },
  {
    id: 15,
    text: "At the end of a long day, what feels most restorative?",
    options: [
      {
        text: "Reflecting on what you accomplished and planning tomorrow.",
        weights: { Lion: 2, Beaver: 2, Owl: 2 },
      },
      {
        text: "Being around people who make you laugh and feel light.",
        weights: { Otter: 3, Dolphin: 3 },
      },
      {
        text: "A quiet evening with someone you deeply trust.",
        weights: { GoldenRetriever: 3, Elephant: 2, Bear: 2 },
      },
      {
        text: "Complete silence: just you and your thoughts.",
        weights: { Wolf: 2, Shepherd: 2, Fox: 1, Owl: 2 },
      },
    ],
  },
];
