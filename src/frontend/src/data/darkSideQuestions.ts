import { DarkSideType } from "../types/darkSide";
import type { DarkSideQuestion, DarkSideScore } from "../types/darkSide";

export const DARK_SIDE_QUESTIONS: DarkSideQuestion[] = [
  {
    id: 1,
    text: "When working on a complex problem, you prefer to…",
    options: [
      {
        text: "Work through it alone with complete focus and no distractions",
        darkType: DarkSideType.IntrovertedThinker,
      },
      {
        text: "Rally a team and delegate smartly to move faster",
        darkType: DarkSideType.ExtravertedThinker,
      },
      {
        text: "Reflect on what feels ethically right before acting",
        darkType: DarkSideType.IntrovertedFeeler,
      },
      {
        text: "Talk it through with people to pick up on the group's energy",
        darkType: DarkSideType.ExtravertedFeeler,
      },
    ],
  },
  {
    id: 2,
    text: "In a disagreement at work or with friends, you typically…",
    options: [
      {
        text: "Stay quiet, gather information, and plan your counter-move carefully",
        darkType: DarkSideType.IntrovertedThinker,
      },
      {
        text: "Take control and steer the outcome toward your goal",
        darkType: DarkSideType.ExtravertedThinker,
      },
      {
        text: "Speak your truth calmly — your values come first",
        darkType: DarkSideType.IntrovertedFeeler,
      },
      {
        text: "Get emotionally charged and need to vent before calming down",
        darkType: DarkSideType.Sociopath,
      },
    ],
  },
  {
    id: 3,
    text: "When you want something that others control, you…",
    options: [
      {
        text: "Map out who holds the key and build a careful approach to get there",
        darkType: DarkSideType.Manipulator,
      },
      {
        text: "Research every angle until you find the most efficient path",
        darkType: DarkSideType.IntrovertedThinker,
      },
      {
        text: "Win people over with charm and build trust strategically",
        darkType: DarkSideType.ExtravertedThinker,
      },
      {
        text: "Ask directly and appeal to shared feelings or values",
        darkType: DarkSideType.ExtravertedFeeler,
      },
    ],
  },
  {
    id: 4,
    text: "When something goes badly wrong, your first instinct is to…",
    options: [
      {
        text: "Stay completely calm and think through the steps to fix it",
        darkType: DarkSideType.Psychopath,
      },
      {
        text: "Feel a surge of anger or frustration that's hard to contain",
        darkType: DarkSideType.Sociopath,
      },
      {
        text: "Pull back and process it alone before doing anything",
        darkType: DarkSideType.IntrovertedFeeler,
      },
      {
        text: "Scan the room to see how others are reacting and match the energy",
        darkType: DarkSideType.ExtravertedFeeler,
      },
    ],
  },
  {
    id: 5,
    text: "Your closest friends would say that you…",
    options: [
      {
        text: "Are intensely loyal — but explosive if you feel betrayed",
        darkType: DarkSideType.Sociopath,
      },
      {
        text: "Are hard to read and keep most of your thoughts to yourself",
        darkType: DarkSideType.IntrovertedThinker,
      },
      {
        text: "Always seem to know how to work a room or situation",
        darkType: DarkSideType.Manipulator,
      },
      {
        text: "Are deeply empathetic but get very quiet when something is wrong",
        darkType: DarkSideType.IntrovertedFeeler,
      },
    ],
  },
  {
    id: 6,
    text: "When you feel pressure from the group to do something you're not sure about, you…",
    options: [
      {
        text: "Go along — keeping group harmony matters more than your hesitation",
        darkType: DarkSideType.ExtravertedFeeler,
      },
      {
        text: "Step back and analyze whether it serves your own interests",
        darkType: DarkSideType.Psychopath,
      },
      {
        text: "Redirect the group toward a better option — you've already thought it through",
        darkType: DarkSideType.ExtravertedThinker,
      },
      {
        text: "Refuse quietly — your principles don't bend to social pressure",
        darkType: DarkSideType.IntrovertedFeeler,
      },
    ],
  },
  {
    id: 7,
    text: "How do you usually handle people who get in the way of your goals?",
    options: [
      {
        text: "Find a way around them — no need to make it personal",
        darkType: DarkSideType.IntrovertedThinker,
      },
      {
        text: "Reframe the situation so they work with you instead of against you",
        darkType: DarkSideType.Manipulator,
      },
      {
        text: "Confront them directly — tension doesn't bother you",
        darkType: DarkSideType.Psychopath,
      },
      {
        text: "Let frustration build until you finally say what you've been holding back",
        darkType: DarkSideType.Sociopath,
      },
    ],
  },
  {
    id: 8,
    text: "When making a big life decision, you mostly rely on…",
    options: [
      {
        text: "Cold logic and evidence — emotions are noise in the data",
        darkType: DarkSideType.Psychopath,
      },
      {
        text: "A deep sense of what aligns with your personal values",
        darkType: DarkSideType.IntrovertedFeeler,
      },
      {
        text: "Calculating which option gives you the best long-term advantage",
        darkType: DarkSideType.Manipulator,
      },
      {
        text: "How the decision will affect the people you care about",
        darkType: DarkSideType.ExtravertedFeeler,
      },
    ],
  },
  {
    id: 9,
    text: "In social settings, people would describe you as…",
    options: [
      {
        text: "A natural connector who makes everyone feel seen",
        darkType: DarkSideType.ExtravertedFeeler,
      },
      {
        text: "A confident leader who drives the energy and agenda",
        darkType: DarkSideType.ExtravertedThinker,
      },
      {
        text: "Reserved and hard to read, but thoughtful when you speak",
        darkType: DarkSideType.IntrovertedThinker,
      },
      {
        text: "Charming in a way that's hard to pin down — you seem to know what people want to hear",
        darkType: DarkSideType.Manipulator,
      },
    ],
  },
  {
    id: 10,
    text: "When something deeply unfair happens to you, you…",
    options: [
      {
        text: "Quietly file it away and wait for the right moment to address it",
        darkType: DarkSideType.IntrovertedThinker,
      },
      {
        text: "Feel a deep moral wound that takes a long time to heal",
        darkType: DarkSideType.IntrovertedFeeler,
      },
      {
        text: "React immediately — the emotion is too strong to hold in",
        darkType: DarkSideType.Sociopath,
      },
      {
        text: "Detach emotionally and focus on what you can extract from the situation",
        darkType: DarkSideType.Psychopath,
      },
    ],
  },
  {
    id: 11,
    text: "When organizing a group project, you naturally…",
    options: [
      {
        text: "Structure it precisely — assign roles, set timelines, own outcomes",
        darkType: DarkSideType.ExtravertedThinker,
      },
      {
        text: "Handle your part alone and check in only when needed",
        darkType: DarkSideType.IntrovertedThinker,
      },
      {
        text: "Ensure everyone feels heard and that the team stays emotionally connected",
        darkType: DarkSideType.ExtravertedFeeler,
      },
      {
        text: "Position yourself where you have the most influence over the final result",
        darkType: DarkSideType.Manipulator,
      },
    ],
  },
  {
    id: 12,
    text: "Which statement feels most true about how you experience emotions?",
    options: [
      {
        text: "I feel them deeply but tend to keep them private and under control",
        darkType: DarkSideType.IntrovertedFeeler,
      },
      {
        text: "My feelings can be intense and sometimes come out unexpectedly",
        darkType: DarkSideType.Sociopath,
      },
      {
        text: "I notice emotions logically — they're useful data, not things I dwell on",
        darkType: DarkSideType.Psychopath,
      },
      {
        text: "I'm highly tuned to others' emotions and often absorb them",
        darkType: DarkSideType.ExtravertedFeeler,
      },
    ],
  },
  {
    id: 13,
    text: "If you could have one superpower for getting what you want, you'd choose…",
    options: [
      {
        text: "The ability to see every possible outcome before making a move",
        darkType: DarkSideType.IntrovertedThinker,
      },
      {
        text: "The power to instantly understand what motivates any person",
        darkType: DarkSideType.Manipulator,
      },
      {
        text: "Total emotional control — never rattled, always composed",
        darkType: DarkSideType.Psychopath,
      },
      {
        text: "The ability to inspire anyone to follow your vision",
        darkType: DarkSideType.ExtravertedThinker,
      },
    ],
  },
  {
    id: 14,
    text: "How do you respond when someone tries to dominate a conversation or situation?",
    options: [
      {
        text: "Observe quietly and identify the most efficient way to neutralize their influence",
        darkType: DarkSideType.IntrovertedThinker,
      },
      {
        text: "Match or exceed their energy and reclaim control",
        darkType: DarkSideType.ExtravertedThinker,
      },
      {
        text: "Feel internally unsettled but lean on group dynamics to restore balance",
        darkType: DarkSideType.ExtravertedFeeler,
      },
      {
        text: "Subtly reframe the narrative so others naturally side with you",
        darkType: DarkSideType.Manipulator,
      },
    ],
  },
  {
    id: 15,
    text: "Reflecting honestly on your motivations, most of your actions are driven by…",
    options: [
      {
        text: "A clear internal code — right and wrong guide every choice",
        darkType: DarkSideType.IntrovertedFeeler,
      },
      {
        text: "The desire to win, lead, and stay ahead of others",
        darkType: DarkSideType.ExtravertedThinker,
      },
      {
        text: "Deep-seated emotional needs — belonging, love, or being understood",
        darkType: DarkSideType.Sociopath,
      },
      {
        text: "Outcome-focused thinking — you want the most effective result, nothing more",
        darkType: DarkSideType.Psychopath,
      },
    ],
  },
];

export function computeDarkSideScores(
  answers: DarkSideType[],
): DarkSideScore[] {
  const counts: Partial<Record<DarkSideType, number>> = {};
  const total = answers.length;

  for (const type of answers) {
    counts[type] = (counts[type] ?? 0) + 1;
  }

  // Ensure all 7 types appear (even with 0 count)
  const allTypes = Object.values(DarkSideType);
  return allTypes
    .map((darkType) => {
      const count = counts[darkType] ?? 0;
      return {
        darkType,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.count - a.count);
}
