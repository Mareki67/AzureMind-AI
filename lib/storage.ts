export type ScoreHistory = {
  id: string;
  date: string;
  domain: string;
  totalCards: number;
  known: number;
  review: number;
  scorePercent: number;
};

const STORAGE_KEY = "azuremind_score_history";

export function loadScores(): ScoreHistory[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);

  return saved ? JSON.parse(saved) : [];
}

export function saveScore(score: ScoreHistory): ScoreHistory[] {
  if (typeof window === "undefined") return [];

  const existingScores = loadScores();

  const updatedScores = [score, ...existingScores].slice(0, 10);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedScores)
  );

  return updatedScores;
}

export function clearScores() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}