// --- Shape types ---

export type GridCells = number[]; // 9 values (0 or 1)
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
  correct: number; 
}

export interface TestData {
  patterns: PatternItem[];
  digits: string[];
  words: string[];
}

// --- Data Definitions ---

export const PRE_DATA: TestData = {
  patterns: [
    {
      id: "test-1-grid",
      layout: "grid3x3",
      pattern: [
        [1,0,0,0,0,0,0,0,0], [0,1,1,0,0,0,0,0,0], [0,0,1,0,1,0,0,0,0],
        [0,0,0,1,0,0,1,0,0], [0,0,0,0,1,0,0,0,1], [0,1,0,0,0,1,0,0,0],
        [0,0,0,1,0,0,1,0,0], [0,0,0,0,0,1,0,1,0], null
      ],
      options: [
        [0,0,0,0,0,1,1,0,0], [0,0,0,1,0,0,0,0,1], [0,0,0,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,1,1], [0,0,0,0,0,0,1,1,1], [0,0,0,0,0,0,1,0,1]
      ],
      optionLabels: ["A", "B", "C", "D", "E", "F"],
      correct: 1,
    },
    {
      id: "test-2-arrows",
      layout: "sequence",
      pattern: ["down", "left", "up", "right", "down", null],
      options: ["right", "up", "down", "left", "left"],
      optionLabels: ["A", "B", "C", "D", "E"],
      correct: 0,
    },
    {
      id: "test-5-triangles",
      layout: "sequence",
      pattern: [
        { invert: false, leftFilled: true, rightFilled: false },
        { invert: true, leftFilled: true, rightFilled: false },
        { invert: false, leftFilled: true, rightFilled: false },
        { invert: true, leftFilled: true, rightFilled: false },
        null
      ],
      options: [
        { invert: false, leftFilled: true, rightFilled: true },
        { invert: false, leftFilled: true, rightFilled: false },
        { invert: false, leftFilled: false, rightFilled: true },
        { invert: false, leftFilled: false, rightFilled: false }
      ],
      optionLabels: ["A", "B", "C", "D"],
      correct: 1,
    },
  ],
  digits: ["482", "9173", "52084", "391627", "8402935", "17395826", "402851739", "5820491736"],
  words: ["OAK", "BOTTLE", "CLOUD", "HAMMER", "RIVER", "CHAIR", "GLASS", "WATCH", "BREAD", "JACKET", "PILLOW", "PHONE", "GARDEN", "SCHOOL", "WINDOW", "TIGER"],
};

export const POST_DATA: TestData = {
  patterns: [
    {
      id: "test-3-crosshairs",
      layout: "sequence",
      pattern: [
        { vOffset: -10, hOffset: 0 }, { vOffset: -5, hOffset: 0 },
        { vOffset: 0, hOffset: 0 }, { vOffset: 5, hOffset: 0 },
        null
      ],
      options: [
        { vOffset: 10, hOffset: 0 }, { vOffset: 0, hOffset: 5 },
        { vOffset: 0, hOffset: 10 }, { vOffset: 0, hOffset: -10 }
      ],
      optionLabels: ["A", "B", "C", "D"],
      correct: 0,
    },
    {
      id: "test-4-petals",
      layout: "sequence",
      pattern: [
        { count: 1, isTopMinus: true }, { count: 2, isTopMinus: false },
        { count: 3, isTopMinus: true }, { count: 4, isTopMinus: false },
        null
      ],
      options: [
        { count: 5, isTopMinus: false }, { count: 5, isTopMinus: true },
        { count: 4, isTopMinus: true }, { count: 3, isTopMinus: false }
      ],
      optionLabels: ["A", "B", "C", "D"],
      correct: 1,
    },
    {
      id: "test-6-arrow-grids",
      layout: "grid2x2",
      pattern: [
        [{ size: "lg", dir: "up" }],
        [{ size: "lg", dir: "up" }, { size: "sm", dir: "up" }],
        [{ size: "lg", dir: "up" }, { size: "lg", dir: "up" }],
        null
      ],
      options: [
        [{ size: "lg", dir: "right" }],
        [{ size: "lg", dir: "up" }, { size: "lg", dir: "up" }, { size: "sm", dir: "up" }, { size: "sm", dir: "up" }],
        [{ size: "lg", dir: "up" }, { size: "lg", dir: "right" }],
        [{ size: "lg", dir: "up" }, { size: "lg", dir: "up" }, { size: "sm", dir: "up" }]
      ],
      optionLabels: ["A", "B", "C", "D"],
      correct: 3,
    },
  ],
  digits: ["371", "8264", "19305", "748291", "2058374", "91620483", "573918264", "8204719365"],
  words: ["MAPLE", "CUP", "STORM", "WRENCH", "OCEAN", "DESK", "PLATE", "CLOCK", "FRUIT", "SHIRT", "BLANKET", "RADIO", "FOREST", "COLLEGE", "DOOR", "LION"],
};

export const MOD_CODE = "PSYCH2026";
