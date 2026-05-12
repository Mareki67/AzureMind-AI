export type Flashcard = {
  id: number;
  exam?: string;
  domain: string;
  category: string;
  difficulty: string;
  question: string;
  answer: string;
};

export function shuffleCards(cards: Flashcard[]): Flashcard[] {
  return [...cards].sort(() => Math.random() - 0.5);
}

export function getRandomCards(
  cards: Flashcard[],
  count: number
): Flashcard[] {
  return shuffleCards(cards).slice(0, count);
}

export function getCardsByDomain(
  cards: Flashcard[],
  domain: string
): Flashcard[] {
  return cards.filter((card) => card.domain === domain);
}

export function getCardsByDifficulty(
  cards: Flashcard[],
  difficulty: string
): Flashcard[] {
  return cards.filter((card) => card.difficulty === difficulty);
}
