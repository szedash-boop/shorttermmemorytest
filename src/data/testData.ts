// All test items are FIXED and identical for every participant.

export interface PatternItem {
  image: string; // import path for the pattern image
  optionCount: number; // number of options (4, 5, or 6)
  optionLabels: string[]; // e.g. ["A","B","C","D"]
  correct: number; // 0-based index into optionLabels
}

export interface TestData {
  patterns: PatternItem[];
  digits: string[];
  words: string[];
}

// PRE-BREAK test data
export const PRE_DATA: TestData = {
  patterns: [
    {
      image: "pattern1",
      optionCount: 6,
      optionLabels: ["A", "B", "C", "D", "E", "F"],
      correct: 1, // B
    },
    {
      image: "pattern2",
      optionCount: 4,
      optionLabels: ["A", "B", "C", "D"],
      correct: 0, // A
    },
    {
      image: "pattern3",
      optionCount: 4,
      optionLabels: ["A", "B", "C", "D"],
      correct: 3, // D
    },
  ],
  digits: ["482", "9173", "52084", "391627", "8402935", "17395826", "402851739", "5820491736"],
  words: [
    "OAK", "BOTTLE", "CLOUD", "HAMMER",
    "RIVER", "CHAIR", "GLASS", "WATCH",
    "BREAD", "JACKET", "PILLOW", "PHONE",
    "GARDEN", "SCHOOL", "WINDOW", "TIGER",
  ],
};

// POST-BREAK test data (completely different items)
export const POST_DATA: TestData = {
  patterns: [
    {
      image: "pattern4",
      optionCount: 4,
      optionLabels: ["A", "B", "C", "D"],
      correct: 0, // A
    },
    {
      image: "pattern5",
      optionCount: 5,
      optionLabels: ["A", "B", "C", "D", "E"],
      correct: 2, // C
    },
    {
      image: "pattern6",
      optionCount: 4,
      optionLabels: ["a", "b", "c", "d"],
      correct: 3, // d
    },
  ],
  digits: ["371", "8264", "19305", "748291", "2058374", "91620483", "573918264", "8204719365"],
  words: [
    "MAPLE", "CUP", "STORM", "WRENCH",
    "OCEAN", "DESK", "PLATE", "CLOCK",
    "FRUIT", "SHIRT", "BLANKET", "RADIO",
    "FOREST", "COLLEGE", "DOOR", "LION",
  ],
};

export const MOD_CODE = "PSYCH2026";
