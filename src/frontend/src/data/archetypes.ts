import type { AnimalType, ArchetypeProfile } from "../types/animals";

export const ARCHETYPES: Record<AnimalType, ArchetypeProfile> = {
  Lion: {
    type: "Lion",
    name: "The Lionheart",
    displayName: "THE LIONHEART",
    emoji: "🦁",
    tagline: "Confident | Natural Leader | Protecting | Generous | Spirited",
    description:
      "Your strength comes from a deep inner courage. You inspire others through bold actions and warmth. Others look to you for direction without you needing to ask for it.",
    strengths: [
      "Natural leadership presence",
      "Decisive under pressure",
      "Protects those they care about",
      "Inspires confidence in others",
    ],
    challenges: [
      "Can dominate conversations unintentionally",
      "Struggles with emotional vulnerability",
      "Impatient with slower-paced individuals",
    ],
    groupDynamics: {
      large:
        "Thrives as a leader or alpha. Attracts followers and rivals. Friendships are strategic, based on utility or respect.",
      small:
        "Prefers being the central decision-maker. Tolerates small teams but may clash with other dominant types.",
      micro:
        "Comfortable only if they are the unquestioned leader. May struggle with deep emotional intimacy.",
      isolation:
        "Uncomfortable. Lions need an audience; isolation leads to restlessness or aggression.",
    },
    color: "oklch(0.72 0.17 50)",
  },
  Otter: {
    type: "Otter",
    name: "The Free Spirit",
    displayName: "THE FREE SPIRIT",
    emoji: "🦦",
    tagline: "Enthusiastic | Social | Playful | Creative | Spontaneous",
    description:
      "Your energy lights up every room you enter. You connect people effortlessly and bring joy to the mundane. Life is an adventure best shared with as many souls as possible.",
    strengths: [
      "Infectious enthusiasm",
      "Builds wide social networks",
      "Creative problem-solving",
      "Keeps morale high",
    ],
    challenges: [
      "Struggles with deep commitment",
      "May avoid difficult emotions",
      "Can be scattered or unreliable",
    ],
    groupDynamics: {
      large:
        "The life of the party. Makes many friends easily. Networks widely and thrives on collective energy.",
      small:
        "Energizes the group. Keeps morale high. Friendships are warm but may lack depth.",
      micro:
        "Needs constant interaction. May feel bored or anxious in quiet one-on-one settings.",
      isolation:
        "Very difficult. Otters seek external stimulation; isolation can lead to depression or reckless behavior.",
    },
    color: "oklch(0.72 0.17 200)",
  },
  GoldenRetriever: {
    type: "GoldenRetriever",
    name: "The Devoted",
    displayName: "THE DEVOTED",
    emoji: "🦮",
    tagline: "Loyal | Warm | Supportive | Empathetic | Steady",
    description:
      "You are the heart of every bond you form. Your loyalty runs bone-deep and your presence creates safety for those around you. You are the glue that holds communities together.",
    strengths: [
      "Deep emotional loyalty",
      "Creates psychological safety",
      "Excellent listener and supporter",
      "Builds lasting friendships",
    ],
    challenges: [
      "People-pleasing tendencies",
      "Difficulty setting boundaries",
      "Neglects own needs for others",
    ],
    groupDynamics: {
      large:
        "Comfortable but not a leader. Follows quietly, helps maintain harmony within the group.",
      small:
        "Ideal environment. Forms deep, loyal friendships. Often the 'glue' that holds the group together.",
      micro:
        "Extremely fulfilling. Prioritizes trust, support, and routine in close relationships.",
      isolation:
        "Tolerable short-term, but long-term isolation causes anxiety. Needs at least one close bond.",
    },
    color: "oklch(0.72 0.17 85)",
  },
  Beaver: {
    type: "Beaver",
    name: "The Sage",
    displayName: "THE SAGE",
    emoji: "🦫",
    tagline: "Precise | Analytical | Introverted | Reliable | Deep",
    description:
      "Your mind is a finely tuned instrument. You build systems that last and relationships that are built on substance. Where others see chaos, you see patterns waiting to be solved.",
    strengths: [
      "Exceptional attention to detail",
      "Highly reliable and consistent",
      "Deep thinker and problem solver",
      "Builds structures that endure",
    ],
    challenges: [
      "Over-critical of imperfection",
      "Slow to trust others",
      "Can seem cold or distant",
    ],
    groupDynamics: {
      large:
        "Dislikes chaos and noise. May withdraw or become critical of inefficiency.",
      small:
        "Prefers task-oriented, structured groups. Friendships selective and based on shared interests.",
      micro:
        "Best for deep, intellectual one-on-one friendships. Values loyalty and predictability.",
      isolation:
        "Comfortable. Beavers often enjoy solitary work and hobbies. Isolation does not bother them much.",
    },
    color: "oklch(0.65 0.12 30)",
  },
  Wolf: {
    type: "Wolf",
    name: "The Catalyst",
    displayName: "THE CATALYST",
    emoji: "🐺",
    tagline: "Strategic | Independent | Intense | Perceptive | Complex",
    description:
      "You operate on a different frequency than most. Your perception cuts through social masks to see what others miss. You are a force of nature — unpredictable and fascinating.",
    strengths: [
      "Razor-sharp perception",
      "Strategic thinking",
      "Operates effectively alone",
      "Sees what others miss",
    ],
    challenges: [
      "Difficulty forming genuine trust",
      "Can be manipulative or exploitative",
      "Struggles with empathy",
    ],
    groupDynamics: {
      large:
        "Uses groups for personal gain. May lead a pack or operate as a lone predator within a crowd.",
      small:
        "Forms instrumental alliances, not true friendships. Betrayal is always possible.",
      micro:
        "Maintains control through manipulation. May keep one or two close 'lieutenants.'",
      isolation:
        "Prefers isolation when planning. Wolves are comfortable alone but also seek targets of influence.",
    },
    color: "oklch(0.55 0.10 270)",
  },
  Sheep: {
    type: "Sheep",
    name: "The Weaver",
    displayName: "THE WEAVER",
    emoji: "🐑",
    tagline: "Conformist | Gentle | Harmonious | Cautious | Communal",
    description:
      "You seek belonging and find beauty in community. Your gift is weaving social fabric and creating spaces where others feel welcome. You carry the wisdom of cooperation.",
    strengths: [
      "Natural harmonizer",
      "Follows social norms with grace",
      "Creates inclusive environments",
      "Dependable within groups",
    ],
    challenges: [
      "Fear of abandonment",
      "Over-reliance on external validation",
      "Difficulty asserting needs",
    ],
    groupDynamics: {
      large: "Seeks safety in numbers. Follows the crowd to avoid conflict.",
      small:
        "Relies on a few trusted protectors. Friendships are dependent and anxious.",
      micro:
        "Clings to one dominant friend or partner. Fear of abandonment is strong.",
      isolation:
        "Very stressful. Sheep need external validation and protection; isolation leads to panic.",
    },
    color: "oklch(0.72 0.12 150)",
  },
  Shepherd: {
    type: "Shepherd",
    name: "The Guardian",
    displayName: "THE GUARDIAN",
    emoji: "🐕",
    tagline: "Protective | Conscientious | Duty-Bound | Steadfast | Principled",
    description:
      "You live by a deep sense of duty and care. Your calling is to protect those who cannot protect themselves and to maintain the order that allows communities to thrive.",
    strengths: [
      "Unwavering sense of duty",
      "Protective instinct",
      "Strong moral compass",
      "Sees the big picture of community",
    ],
    challenges: [
      "Paternalistic tendencies",
      "Difficulty delegating control",
      "May sacrifice personal needs for duty",
    ],
    groupDynamics: {
      large:
        "Sees themselves as guardian of order. May lead or police large groups with authority.",
      small:
        "Takes charge of safety and rules. Friendships are paternalistic but sincere.",
      micro:
        "Close relationships are based on duty and protection, not emotional vulnerability.",
      isolation:
        "Can handle isolation but prefers to be watching over a flock from a distance.",
    },
    color: "oklch(0.60 0.14 40)",
  },
  Fox: {
    type: "Fox",
    name: "The Trickster",
    displayName: "THE TRICKSTER",
    emoji: "🦊",
    tagline: "Clever | Cunning | Adaptable | Resourceful | Witty",
    description:
      "You read every room before entering it. Where others see walls, you see doors. Your mind moves three steps ahead, and your charm disarms before anyone notices you've already won.",
    strengths: [
      "Strategic thinking and quick wit",
      "Adapts effortlessly to any situation",
      "Reads people and environments instantly",
      "Finds creative solutions under pressure",
    ],
    challenges: [
      "Can be perceived as untrustworthy or evasive",
      "Difficulty with long-term commitment",
      "May prioritize cleverness over genuine connection",
    ],
    groupDynamics: {
      large:
        "Navigates crowds with ease, working multiple angles at once. Rarely shows their full hand.",
      small:
        "Thrives in small dynamic groups where strategy and wit are valued. Avoids rigid hierarchies.",
      micro:
        "Selective and guarded in close relationships. Opens up slowly once trust is thoroughly earned.",
      isolation:
        "Manageable but dull — Foxes need puzzles and people to stay sharp. Too much solitude breeds restlessness.",
    },
    color: "oklch(0.70 0.18 38)",
  },
  Owl: {
    type: "Owl",
    name: "The Seer",
    displayName: "THE SEER",
    emoji: "🦉",
    tagline: "Wise | Analytical | Perceptive | Introspective | Patient",
    description:
      "You see what others overlook. Your mind is a library of patterns and your silence holds more insight than most people's loudest words. Wisdom is your currency and depth your native language.",
    strengths: [
      "Deep analysis and pattern recognition",
      "Wisdom under pressure",
      "Sees through surface-level noise",
      "Exceptional at long-term thinking",
    ],
    challenges: [
      "Over-analysis leads to decision paralysis",
      "Can seem emotionally detached or aloof",
      "Impatient with shallow or hurried thinking",
    ],
    groupDynamics: {
      large:
        "Observes from the periphery. Rarely seeks the spotlight but is often the wisest voice in the room.",
      small:
        "Works best in focused, intellectually stimulating teams. Quality matters far more than quantity.",
      micro:
        "Deeply fulfilling when the other person matches their depth. Values truth and authenticity above warmth.",
      isolation:
        "Comfortable and productive. Owls recharge in solitude and often do their best thinking alone.",
    },
    color: "oklch(0.58 0.11 260)",
  },
  Elephant: {
    type: "Elephant",
    name: "The Anchor",
    displayName: "THE ANCHOR",
    emoji: "🐘",
    tagline:
      "Loyal | Empathetic | Strong Memory | Community-Oriented | Steadfast",
    description:
      "You are the memory and the heart of your community. You carry the weight of shared history and use it to protect those you love. Your loyalty is legendary and your empathy runs fathoms deep.",
    strengths: [
      "Deep empathy and emotional intelligence",
      "Unwavering reliability and long-term loyalty",
      "Holds the history and wisdom of the group",
      "Strong sense of community and belonging",
    ],
    challenges: [
      "Slow to forgive those who betray trust",
      "Resistant to change and new approaches",
      "Can carry emotional burdens too long",
    ],
    groupDynamics: {
      large:
        "A pillar of stability in large communities. Others feel safer knowing the Elephant is present.",
      small:
        "Thrives in close-knit groups. Forms deep bonds built on shared memory and mutual care.",
      micro:
        "Incredibly devoted. Treats close relationships with lifelong commitment and fierce protectiveness.",
      isolation:
        "Difficult over time. Elephants need their herd — prolonged isolation dulls their spirit.",
    },
    color: "oklch(0.62 0.09 220)",
  },
  Dolphin: {
    type: "Dolphin",
    name: "The Connector",
    displayName: "THE CONNECTOR",
    emoji: "🐬",
    tagline: "Social | Playful | Intelligent | Emotionally Attuned | Creative",
    description:
      "You bring people together like gravity. Your emotional radar is finely tuned and you make everyone feel seen. Life to you is a song best played in harmony with others.",
    strengths: [
      "Exceptional communication and emotional attunement",
      "Energizes teams with creativity and warmth",
      "Builds bridges between very different people",
      "Highly empathetic and quick to uplift",
    ],
    challenges: [
      "Craves constant validation and connection",
      "Avoids conflict at the cost of honesty",
      "Can lose sense of self in relationships",
    ],
    groupDynamics: {
      large:
        "Energizes large groups naturally. The social glue that makes events feel alive and inclusive.",
      small:
        "Deeply fulfilling. Dolphins invest emotionally and bring out the best in every member.",
      micro:
        "Intensely connected but needs reciprocation. Emotional depth is their love language.",
      isolation:
        "Very challenging. Dolphins need emotional connection to feel whole — isolation is depleting.",
    },
    color: "oklch(0.68 0.15 205)",
  },
  Bear: {
    type: "Bear",
    name: "The Fortress",
    displayName: "THE FORTRESS",
    emoji: "🐻",
    tagline: "Protective | Independent | Resilient | Grounded | Calm",
    description:
      "You are the mountain that others shelter behind. Quiet strength is your signature — you don't need to announce your power for it to be felt. Those you protect know they are safe.",
    strengths: [
      "Immovable resilience under pressure",
      "Natural protector of those in their inner circle",
      "Self-sufficient and deeply grounded",
      "Calm and steady in times of crisis",
    ],
    challenges: [
      "Can be overprotective or controlling",
      "Slow to open up emotionally",
      "May isolate when overwhelmed instead of seeking support",
    ],
    groupDynamics: {
      large:
        "A stabilizing presence in large groups. Not the loudest voice, but the one others turn to in a storm.",
      small:
        "Prefers small, trusted circles where loyalty is mutual and depth is possible.",
      micro:
        "Fiercely devoted once bonded. Takes time to open fully but gives everything when they do.",
      isolation:
        "Handles solitude better than most. Bears recharge in nature and silence, but need their people.",
    },
    color: "oklch(0.55 0.10 45)",
  },
};
