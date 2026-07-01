import type { AnimalType } from "../types/animals";

export interface CompatibilityEntry {
  type: AnimalType;
  connectionType: string;
  level: string;
  levelScore: number; // 1-5 for visual rendering
  description: string;
}

export const COMPATIBILITY_MAP: Record<AnimalType, CompatibilityEntry[]> = {
  Lion: [
    {
      type: "Otter",
      connectionType: "Free Spirit",
      level: "Dynamic Synergy | High",
      levelScore: 4,
      description:
        "Electric pairing that fuels ambition and adventure, as long as Lion doesn't steal Otter's spotlight.",
    },
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Supportive Bond | High",
      levelScore: 4,
      description:
        "Golden Retriever provides the emotional warmth Lion rarely shows. Deeply complementary.",
    },
    {
      type: "Beaver",
      connectionType: "Sage",
      level: "Intellectual Spark | Moderate",
      levelScore: 3,
      description:
        "Beaver's precision grounds Lion's boldness. Productive but occasional friction over pace.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "Strong Trust | High",
      levelScore: 4,
      description:
        "Two apex types who respect each other's power. Trust is earned, not given, and that makes it real.",
    },
    {
      type: "Sheep",
      connectionType: "Weaver",
      level: "Protective Bond | Moderate",
      levelScore: 3,
      description:
        "Lion's strength gives Sheep security. But Sheep must grow or Lion loses respect.",
    },
    {
      type: "Shepherd",
      connectionType: "Guardian",
      level: "Deep Harmony | Very High",
      levelScore: 5,
      description:
        "Two protectors who share values. Shepherd tempers Lion's aggression; Lion amplifies Shepherd's reach.",
    },
  ],
  Otter: [
    {
      type: "Lion",
      connectionType: "Lionheart",
      level: "Dynamic Synergy | High",
      levelScore: 4,
      description:
        "Otter's enthusiasm and Lion's direction create a powerful social force together.",
    },
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Deep Harmony | Very High",
      levelScore: 5,
      description:
        "The most naturally harmonious pairing. Warmth meets loyalty in a joyful, secure bond.",
    },
    {
      type: "Beaver",
      connectionType: "Sage",
      level: "Creative Tension | Moderate",
      levelScore: 3,
      description:
        "Beaver structures what Otter generates. Tension, but productive when both respect each other.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "Cautious Alliance | Low",
      levelScore: 2,
      description:
        "Otter's exuberance attracts Wolf's calculated charm. The pair can appear close, but Wolf shapes Otter's choices without Otter realising.",
    },
    {
      type: "Sheep",
      connectionType: "Weaver",
      level: "Warm Connection | High",
      levelScore: 4,
      description:
        "Otter gives Sheep the social belonging they crave. Sheep gives Otter unwavering loyalty.",
    },
    {
      type: "Shepherd",
      connectionType: "Guardian",
      level: "Supportive Bond | High",
      levelScore: 4,
      description:
        "Shepherd grounds Otter's chaos while respecting their freedom. Works when Shepherd doesn't control.",
    },
  ],
  GoldenRetriever: [
    {
      type: "Lion",
      connectionType: "Lionheart",
      level: "Supportive Bond | High",
      levelScore: 4,
      description:
        "Retriever provides emotional depth Lion lacks. Lion provides direction Retriever sometimes needs.",
    },
    {
      type: "Otter",
      connectionType: "Free Spirit",
      level: "Deep Harmony | Very High",
      levelScore: 5,
      description:
        "The warmest, most joyful pairing. Two caring souls who make any space feel like home.",
    },
    {
      type: "Beaver",
      connectionType: "Sage",
      level: "Stable Alliance | High",
      levelScore: 4,
      description:
        "Beaver's reliability gives Retriever security. Retriever's warmth softens Beaver's rigidity.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "High Risk | Very Low",
      levelScore: 1,
      description:
        "Retriever's warmth invites Wolf in; Wolf interprets that warmth as permission to take. The bond erodes Retriever's boundaries over time.",
    },
    {
      type: "Sheep",
      connectionType: "Weaver",
      level: "Supportive Bond | High",
      levelScore: 4,
      description:
        "Two gentle souls who deeply understand each other's need for connection and safety.",
    },
    {
      type: "Shepherd",
      connectionType: "Guardian",
      level: "Trusted Bond | High",
      levelScore: 4,
      description:
        "Shepherd protects what Retriever nurtures. A natural, reciprocal partnership.",
    },
  ],
  Beaver: [
    {
      type: "Lion",
      connectionType: "Lionheart",
      level: "Productive Alliance | Moderate",
      levelScore: 3,
      description:
        "Lion pushes Beaver into action; Beaver prevents Lion's costly mistakes. Effective partnership.",
    },
    {
      type: "Otter",
      connectionType: "Free Spirit",
      level: "Creative Tension | Moderate",
      levelScore: 3,
      description:
        "Otter's spontaneity fascinates Beaver, but chaos frustrates them. Requires compromise.",
    },
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Stable Alliance | High",
      levelScore: 4,
      description:
        "Retriever's patience meets Beaver's precision. One of the most stable micro-group pairings.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "Intellectual Match | Moderate",
      levelScore: 3,
      description:
        "Both analytical and strategic. Beaver can hold their own against Wolf but must stay vigilant.",
    },
    {
      type: "Sheep",
      connectionType: "Weaver",
      level: "Gentle Bond | Moderate",
      levelScore: 3,
      description:
        "Beaver can guide Sheep with structure. Sheep softens Beaver's edges. Works in small doses.",
    },
    {
      type: "Shepherd",
      connectionType: "Guardian",
      level: "Deep Alliance | Very High",
      levelScore: 5,
      description:
        "Both value order, precision, and duty. The most analytically compatible pairing.",
    },
  ],
  Wolf: [
    {
      type: "Lion",
      connectionType: "Lionheart",
      level: "Apex Alliance | High",
      levelScore: 4,
      description:
        "Two dominant types who respect capability. Watch for competition turning destructive.",
    },
    {
      type: "Otter",
      connectionType: "Free Spirit",
      level: "Cautious Alliance | Low",
      levelScore: 2,
      description:
        "Wolf is drawn to Otter's openness as an opportunity. Otter's trust and energy fuel the bond while Wolf quietly steers it.",
    },
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Toxic Risk | Very Low",
      levelScore: 1,
      description:
        "Golden Retriever gives unconditionally; Wolf receives without reciprocating. The more Retriever invests, the deeper Wolf's leverage grows.",
    },
    {
      type: "Beaver",
      connectionType: "Sage",
      level: "Strategic Match | Moderate",
      levelScore: 3,
      description:
        "Beaver is one of the few who can match Wolf's analysis. Mutual wariness keeps it balanced.",
    },
    {
      type: "Sheep",
      connectionType: "Weaver",
      level: "Predator-Prey | Very Low",
      levelScore: 1,
      description:
        "The most dangerous combination for Sheep. Wolf's calculated attention feels like protection; Sheep mistakes control for care.",
    },
    {
      type: "Shepherd",
      connectionType: "Guardian",
      level: "Natural Opposition | Low",
      levelScore: 2,
      description:
        "Shepherd exists to counter Wolf's influence. Direct adversaries when interests conflict.",
    },
  ],
  Sheep: [
    {
      type: "Lion",
      connectionType: "Lionheart",
      level: "Protective Bond | Moderate",
      levelScore: 3,
      description:
        "Lion gives Sheep direction and safety. But Sheep must develop independence or lose themselves.",
    },
    {
      type: "Otter",
      connectionType: "Free Spirit",
      level: "Warm Connection | High",
      levelScore: 4,
      description:
        "Otter's inclusive energy makes Sheep feel valued. Naturally uplifting pairing.",
    },
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Nurturing Bond | High",
      levelScore: 4,
      description:
        "Two gentle types who support each other. Risk of co-dependency without structure.",
    },
    {
      type: "Beaver",
      connectionType: "Sage",
      level: "Guided Bond | Moderate",
      levelScore: 3,
      description:
        "Beaver gives Sheep the structure they need without exploitation. Functional with clear roles.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "Predator-Prey | Very Low",
      levelScore: 1,
      description:
        "The most dangerous combination for Sheep. Wolf's calculated attention feels like protection; Sheep mistakes control for care.",
    },
    {
      type: "Shepherd",
      connectionType: "Guardian",
      level: "Protected Bond | High",
      levelScore: 4,
      description:
        "The healthiest protector for Sheep. Shepherd's duty is genuine, not exploitative.",
    },
  ],
  Shepherd: [
    {
      type: "Lion",
      connectionType: "Lionheart",
      level: "Deep Harmony | Very High",
      levelScore: 5,
      description:
        "Two types built to lead and protect. Together they form communities that last.",
    },
    {
      type: "Otter",
      connectionType: "Free Spirit",
      level: "Balanced Bond | High",
      levelScore: 4,
      description:
        "Shepherd provides Otter with structure; Otter reminds Shepherd that life includes joy.",
    },
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Trusted Bond | High",
      levelScore: 4,
      description:
        "Shepherd's duty aligns with Retriever's care. Natural partners in building safe spaces.",
    },
    {
      type: "Beaver",
      connectionType: "Sage",
      level: "Deep Alliance | Very High",
      levelScore: 5,
      description:
        "Both are principled, precise, and oriented toward building lasting systems.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "Natural Opposition | Low",
      levelScore: 2,
      description:
        "Shepherd's purpose is directly opposed to Wolf's. Adversarial by design.",
    },
    {
      type: "Sheep",
      connectionType: "Weaver",
      level: "Protected Bond | High",
      levelScore: 4,
      description:
        "Shepherd's natural calling is to protect Sheep. A foundational pairing in any community.",
    },
  ],
  Fox: [
    {
      type: "Lion",
      connectionType: "Lionheart",
      level: "Ambitious Alliance | High",
      levelScore: 4,
      description:
        "Fox's cunning amplifies Lion's power. Both enjoy winning, but Fox must never let Lion feel outmaneuvered.",
    },
    {
      type: "Owl",
      connectionType: "Seer",
      level: "Intellectual Match | Very High",
      levelScore: 5,
      description:
        "The sharpest minds in any room. Fox acts while Owl analyses: a potent, complementary pairing.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "Strategic Tension | Moderate",
      levelScore: 3,
      description:
        "Two strategic types circling each other with respect and wariness. Alliance is profitable; rivalry is costly.",
    },
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Trust Gap | Low",
      levelScore: 2,
      description:
        "Retriever's openness unsettles Fox's guarded nature. Fox must resist the urge to exploit Retriever's trust.",
    },
    {
      type: "Dolphin",
      connectionType: "Connector",
      level: "Social Spark | High",
      levelScore: 4,
      description:
        "Dolphin's emotional radar and Fox's social agility make them a magnetic, effective duo.",
    },
    {
      type: "Bear",
      connectionType: "Fortress",
      level: "Balanced Pair | Moderate",
      levelScore: 3,
      description:
        "Bear's steadiness grounds Fox's restless energy. Fox's adaptability opens doors Bear wouldn't find alone.",
    },
  ],
  Owl: [
    {
      type: "Fox",
      connectionType: "Trickster",
      level: "Intellectual Match | Very High",
      levelScore: 5,
      description:
        "Fox executes what Owl envisions. Depth meets agility in one of the most capable pairings.",
    },
    {
      type: "Beaver",
      connectionType: "Sage",
      level: "Deep Alliance | Very High",
      levelScore: 5,
      description:
        "Two analytical minds who value precision and depth. Shared respect for craft creates a powerful bond.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "Wary Alliance | Moderate",
      levelScore: 3,
      description:
        "Both perceptive and strategic, but Owl sees through Wolf's manipulation. Mutual respect with clear limits.",
    },
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Complementary Bond | High",
      levelScore: 4,
      description:
        "Retriever's warmth draws Owl out of their shell. Owl gives Retriever the depth they quietly crave.",
    },
    {
      type: "Elephant",
      connectionType: "Anchor",
      level: "Wise Partnership | High",
      levelScore: 4,
      description:
        "Two types who honor long-term thinking and memory. Owl provides insight; Elephant provides continuity.",
    },
    {
      type: "Otter",
      connectionType: "Free Spirit",
      level: "Contrast Dynamic | Low",
      levelScore: 2,
      description:
        "Otter's spontaneity clashes with Owl's need for depth. Works only when both give the other space.",
    },
  ],
  Elephant: [
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Heartfelt Bond | Very High",
      levelScore: 5,
      description:
        "Two deeply loyal souls who value connection above all. The most emotionally secure pairing.",
    },
    {
      type: "Owl",
      connectionType: "Seer",
      level: "Wise Partnership | High",
      levelScore: 4,
      description:
        "Elephant's memory and Owl's insight create a formidable team built on mutual respect.",
    },
    {
      type: "Bear",
      connectionType: "Fortress",
      level: "Protective Alliance | Very High",
      levelScore: 5,
      description:
        "Two protectors who share values of loyalty and safety. A deeply trusting, unshakeable bond.",
    },
    {
      type: "Dolphin",
      connectionType: "Connector",
      level: "Community Builders | High",
      levelScore: 4,
      description:
        "Elephant provides roots; Dolphin provides wings. Together they build communities that thrive.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "Deep Mistrust | Very Low",
      levelScore: 1,
      description:
        "Elephant's long memory makes them one of the few types who never forget a Wolf's betrayal. Natural adversaries.",
    },
    {
      type: "Lion",
      connectionType: "Lionheart",
      level: "Strong Alliance | High",
      levelScore: 4,
      description:
        "Lion's boldness and Elephant's endurance form a community that both leads and sustains.",
    },
  ],
  Dolphin: [
    {
      type: "Otter",
      connectionType: "Free Spirit",
      level: "Pure Joy | Very High",
      levelScore: 5,
      description:
        "Two social, playful, warm-hearted types who bring out the absolute best in each other.",
    },
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Deep Harmony | Very High",
      levelScore: 5,
      description:
        "Dolphin's energy and Retriever's loyalty create a bond of warmth, depth, and constant mutual support.",
    },
    {
      type: "Elephant",
      connectionType: "Anchor",
      level: "Community Builders | High",
      levelScore: 4,
      description:
        "Dolphin connects people effortlessly; Elephant holds the community together over time. Powerful partners.",
    },
    {
      type: "Fox",
      connectionType: "Trickster",
      level: "Social Spark | High",
      levelScore: 4,
      description:
        "Dolphin's emotional intelligence balances Fox's strategic detachment. Energizing and surprising pairing.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "Emotional Risk | Low",
      levelScore: 2,
      description:
        "Dolphin gives emotionally without reservation; Wolf exploits that generosity. Dolphin must stay alert.",
    },
    {
      type: "Bear",
      connectionType: "Fortress",
      level: "Safe Harbor | High",
      levelScore: 4,
      description:
        "Bear's calm steadiness gives Dolphin the security they crave. Dolphin brings warmth into Bear's guarded world.",
    },
  ],
  Bear: [
    {
      type: "Elephant",
      connectionType: "Anchor",
      level: "Protective Alliance | Very High",
      levelScore: 5,
      description:
        "Two loyal protectors who understand each other's depth without needing words. Rare, powerful bond.",
    },
    {
      type: "GoldenRetriever",
      connectionType: "Devoted",
      level: "Safe Warmth | High",
      levelScore: 4,
      description:
        "Retriever's warmth gently opens Bear's guarded heart. Bear gives Retriever the steady protection they need.",
    },
    {
      type: "Shepherd",
      connectionType: "Guardian",
      level: "Shared Duty | Very High",
      levelScore: 5,
      description:
        "Two natural protectors united by values. Different styles, same mission: a formidable alliance.",
    },
    {
      type: "Dolphin",
      connectionType: "Connector",
      level: "Safe Harbor | High",
      levelScore: 4,
      description:
        "Dolphin's social warmth thaws Bear's reserve. Bear gives Dolphin a secure emotional anchor.",
    },
    {
      type: "Fox",
      connectionType: "Trickster",
      level: "Grounded Pair | Moderate",
      levelScore: 3,
      description:
        "Bear's steadiness prevents Fox from overreaching. Fox helps Bear see angles they'd miss alone.",
    },
    {
      type: "Wolf",
      connectionType: "Catalyst",
      level: "Natural Standoff | Low",
      levelScore: 2,
      description:
        "Bear will protect their own fiercely against Wolf's manipulation. Uneasy coexistence at best.",
    },
  ],
};

export const LEVEL_COLORS: Record<number, string> = {
  1: "text-destructive",
  2: "text-muted-foreground",
  3: "text-accent",
  4: "text-primary",
  5: "text-foreground",
};
