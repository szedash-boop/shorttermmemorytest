// All test items are FIXED and identical for every participant.

// --- Shape types for SVG pattern tests ---

export type GridCells = number[]; // 9 values (0 or 1) for 3x3 grid
export type ArrowDir = "up" | "right" | "down" | "left";
export interface TriangleShape { invert: boolean; leftFilled: boolean; rightFilled: boolean; }
export interface CrosshairShape { vOffset: number; hOffset: number; }
export interface PetalShape { count: number; isTopMinus: boolean; }
export interface MultiArrowItem { size: "lg" | "sm"; dir: ArrowDir; }

export type ShapeItem = GridCells | ArrowDir | TriangleShape | CrosshairShape | PetalShape | MultiArrowItem[] | null;

export interface PatternItem {
  id: string;
  layout: "grid3x3" | "sequence" | "grid2x2";
  pattern: ShapeItem[];
  options: ShapeItem[];
  optionLabels: string[];
  correct: number; // 0-based index into options
}

export interface TestData {
  patterns: PatternItem[];
  digits: string[];
  words: string[];
}

// PRE-BREAK test data
export const PRE_DATA: TestData = {
  patterns: [
    // Test 1: 3x3 Grid patterns (3x3 grid of items, last is "?")
    {
      id: "test-1-grid",
      layout: "grid3x3",
      pattern: [
        [1,0,0, 0,0,0, 0,0,0], // q1
        [0,1,1, 0,0,0, 0,0,0], // q2
        [0,0,1, 0,1,0, 0,0,0], // q3
        [0,0,0, 1,0,0, 1,0,0], // q4
        [0,0,0, 0,1,0, 0,0,1], // q5
        [0,1,0, 0,0,1, 0,0,0], // q6
        [0,0,0, 1,0,0, 1,0,0], // q7
        [0,0,0, 0,0,1, 0,1,0], // q8
        null,
      ],
      options: [
        [0,0,0, 0,0,1, 1,0,0], // A
        [0,0,0, 1,0,0, 0,0,1], // B
        [0,0,0, 0,0,0, 0,1,0], // C
        [0,0,0, 0,0,0, 0,1,1], // D
        [0,0,0, 0,0,0, 1,1,1], // E
        [0,0,0, 0,0,0, 1,0,1], // F
      ],
      optionLabels: ["A", "B", "C", "D", "E", "F"],
      correct: 1, // B
    },
    // Test 2: Directional arrows sequence
    {
      id: "test-2-arrows",
      layout: "sequence",
      pattern: ["down", "left", "up", "right", "down", null],
      options: ["right", "up", "down", "left", "left"],
      optionLabels: ["A", "B", "C", "D", "E"],
      correct: 0, // A
    },
    // Test 5: Split triangles sequence
    {
      id: "test-5-triangles",
      layout: "sequence",
      pattern: [
        { invert: false, leftFilled: true, rightFilled: false },
        { invert: true, leftFilled: true, rightFilled: false },
        { invert: false, leftFilled: true, rightFilled: false },
        { invert: true, leftFilled: true, rightFilled: false },
        null,
      ],
      options: [
        { invert: false, leftFilled: true, rightFilled: true },
        { invert: false, leftFilled: true, rightFilled: false },
        { invert: false, leftFilled: false, rightFilled: true },
        { invert: false, leftFilled: false, rightFilled: false },
      ],
      optionLabels: ["A", "B", "C", "D"],
      correct: 1, // B
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
    // Test 3: Crosshairs sequence
    {
      id: "test-3-crosshairs",
      layout: "sequence",
      pattern: [
        { vOffset: -10, hOffset: 0 },
        { vOffset: -5, hOffset: 0 },
        { vOffset: 0, hOffset: 0 },
        { vOffset: 5, hOffset: 0 },
        null,
      ],
      options: [
        { vOffset: 10, hOffset: 0 },
        { vOffset: 0, hOffset: 5 },
        { vOffset: 0, hOffset: 10 },
        { vOffset: 0, hOffset: -10 },
      ],
      optionLabels: ["A", "B", "C", "D"],
      correct: 0, // A
    },
    // Test 4: Petals sequence
    {
      id: "test-4-petals",
      layout: "sequence",
      pattern: [
        { count: 1, isTopMinus: true },
        { count: 2, isTopMinus: false },
        { count: 3, isTopMinus: true },
        { count: 4, isTopMinus: false },
        null,
      ],
      options: [
        { count: 5, isTopMinus: false },
        { count: 5, isTopMinus: true },
        { count: 4, isTopMinus: true },
        { count: 3, isTopMinus: false },
      ],
      optionLabels: ["A", "B", "C", "D"],
      correct: 1, // B
    },
    // Test 6: Multi-arrow grid (2x2 layout)
    {
      id: "test-6-arrow-grids",
      layout: "grid2x2",
      pattern: [
        [{ size: "lg", dir: "up" }],
        [{ size: "lg", dir: "up" }, { size: "sm", dir: "up" }],
        [{ size: "lg", dir: "up" }, { size: "lg", dir: "up" }],
        null,
      ],
      options: [
        [{ size: "lg", dir: "right" }],
        [{ size: "lg", dir: "up" }, { size: "lg", dir: "up" }, { size: "sm", dir: "up" }, { size: "sm", dir: "up" }],
        [{ size: "lg", dir: "up" }, { size: "lg", dir: "right" }],
        [{ size: "lg", dir: "up" }, { size: "lg", dir: "up" }, { size: "sm", dir: "up" }],
      ],
      optionLabels: ["A", "B", "C", "D"],
      correct: 3, // D
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
