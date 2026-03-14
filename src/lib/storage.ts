export interface ParticipantResult {
  nickname: string;
  timestamp: string;
  completed: boolean;
  sections: {
    prePatterns: { answers: number[]; timeTaken: number };
    preDigits: { answers: string[]; timeTaken: number };
    preWords: { words: string[]; timeTaken: number };
    postPatterns: { answers: number[]; timeTaken: number };
    postDigits: { answers: string[]; timeTaken: number };
    postWords: { words: string[]; timeTaken: number };
  };
}

const STORAGE_KEY = "stml_lab_results";

export function getResults(): ParticipantResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveResult(result: ParticipantResult) {
  const results = getResults();
  // Update existing or add new
  const idx = results.findIndex(
    (r) => r.nickname.toLowerCase() === result.nickname.toLowerCase()
  );
  if (idx >= 0) {
    results[idx] = result;
  } else {
    results.push(result);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export function hasCompleted(nickname: string): boolean {
  const results = getResults();
  return results.some(
    (r) =>
      r.nickname.toLowerCase() === nickname.toLowerCase() && r.completed
  );
}
