// All test items are FIXED and identical for every participant.
// Pattern grids: each number 0-8 maps to a cell in a 3x3 grid (row-major).

export interface PatternItem {
  // 3x3 matrix of 3x3 grids. matrix[row][col] = array of filled cell indices (0-8)
  // The last position (matrix[2][2]) is the "?" to guess
  matrix: number[][][]; // 3 rows x 3 cols, each is number[] of filled indices
  options: number[][]; // 4 options (A-D), each is number[] of filled indices
  correct: number; // 0-3 index into options
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
      // Item 1: diagonal pattern moving right
      matrix: [
        [[1, 2, 4, 5], [1, 2, 4, 5, 8], [2, 5, 7, 8]],
        [[3, 4, 6], [1, 4, 6], [2, 5, 8]],
        [[0, 3, 7], [1, 4, 5, 8], [-1]], // -1 = question mark
      ],
      options: [
        [0, 3, 7, 6],  // A
        [1, 4, 3, 6],  // B
        [5, 7, 8],     // C - correct
        [2, 4, 6],     // D
      ],
      correct: 2,
    },
    {
      // Item 2
      matrix: [
        [[0, 1, 3, 6], [0, 1, 2, 3], [0, 1, 2, 5]],
        [[0, 3, 6, 7], [0, 3, 4, 6], [2, 5, 8, 7]],
        [[6, 7, 3, 0], [6, 7, 8, 3], [-1]],
      ],
      options: [
        [6, 7, 8, 5],  // A - correct
        [0, 1, 2, 5],  // B
        [3, 4, 5, 8],  // C
        [0, 4, 8, 2],  // D
      ],
      correct: 0,
    },
    {
      // Item 3
      matrix: [
        [[0, 1, 2], [3, 4, 5], [6, 7, 8]],
        [[0, 3, 6], [1, 4, 7], [2, 5, 8]],
        [[0, 4, 8], [2, 4, 6], [-1]],
      ],
      options: [
        [0, 1, 3, 4],  // A
        [1, 3, 5, 7],  // B
        [0, 2, 6, 8],  // C
        [3, 4, 5],     // D - correct (the cross/plus pattern)
      ],
      correct: 3,
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
      matrix: [
        [[1, 4, 7], [0, 4, 8], [2, 4, 6]],
        [[3, 4, 5], [0, 1, 2], [6, 7, 8]],
        [[0, 3, 6], [2, 5, 8], [-1]],
      ],
      options: [
        [0, 1, 2],     // A
        [1, 4, 7],     // B - correct
        [3, 5, 7],     // C
        [6, 7, 8],     // D
      ],
      correct: 1,
    },
    {
      matrix: [
        [[0, 1, 3, 4], [2, 5], [0, 2, 6, 8]],
        [[1, 3, 5, 7], [4], [0, 2, 4, 6, 8]],
        [[0, 2, 3, 5, 6, 8], [1, 3, 4, 5, 7], [-1]],
      ],
      options: [
        [0, 1, 2, 3, 5, 6, 7, 8], // A
        [1, 2, 3, 6, 7, 8],       // B
        [0, 2, 4, 6, 8],          // C
        [0, 1, 2, 6, 7, 8],       // D - correct
      ],
      correct: 3,
    },
    {
      matrix: [
        [[6, 7, 8], [3, 4, 5], [0, 1, 2]],
        [[8, 5, 2], [7, 4, 1], [6, 3, 0]],
        [[2, 1, 0], [5, 4, 3], [-1]],
      ],
      options: [
        [8, 7, 6],   // A - correct
        [6, 7, 8],   // B
        [0, 4, 8],   // C
        [2, 4, 6],   // D
      ],
      correct: 0,
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
