"use client";

import { useEffect, useMemo, useState } from "react";
import flashcards from "../data/flashcards.json";
import Flashcard from "../components/Flashcard";
import { getRandomCards, type Flashcard as FlashcardType } from "../lib/randomizer";
import {
  loadScores,
  saveScore,
  type ScoreHistory,
} from "../lib/storage";

export default function Home() {
  const [sessionSize, setSessionSize] = useState(10);
  const [cards, setCards] = useState<FlashcardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [known, setKnown] = useState(0);
  const [review, setReview] = useState(0);
  const [started, setStarted] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [missedCards, setMissedCards] = useState<FlashcardType[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);

  const allCards = flashcards as FlashcardType[];

  const domains = [
    "All",
    ...Array.from(new Set(allCards.map((card) => card.domain))),
  ];

  const filteredCards =
    selectedDomain === "All"
      ? allCards
      : allCards.filter((card) => card.domain === selectedDomain);

  const currentCard = cards[currentIndex];

  useEffect(() => {
    setScoreHistory(loadScores());
  }, []);

  const progress = useMemo(() => {
    if (!cards.length) return 0;
    return Math.round(((currentIndex + 1) / cards.length) * 100);
  }, [currentIndex, cards.length]);

  function startSession() {
    const randomCards = getRandomCards(filteredCards, sessionSize);

    setCards(randomCards);
    setCurrentIndex(0);
    setShowAnswer(false);
    setKnown(0);
    setReview(0);
    setMissedCards([]);
    setReviewMode(false);
    setStarted(true);
  }

  function nextCard(result: "known" | "review") {
    if (result === "known") {
      setKnown((prev) => prev + 1);
    }

    if (result === "review") {
      setReview((prev) => prev + 1);
      setMissedCards((prev) => [...prev, currentCard]);
    }

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function startMissedReview() {
    setCards(missedCards);
    setCurrentIndex(0);
    setShowAnswer(false);
    setKnown(0);
    setReview(0);
    setReviewMode(true);
    setStarted(true);
  }

  function returnToMainMenu() {
  setStarted(false);
  setCards([]);
  setCurrentIndex(0);
  setShowAnswer(false);
  setKnown(0);
  setReview(0);
  setReviewMode(false);
  }

  function handleSaveScore() {
    if (!cards.length) return;

    const scorePercent = Math.round((known / cards.length) * 100);

    const newScore: ScoreHistory = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleString(),
      domain: reviewMode ? "Missed Card Review" : selectedDomain,
      totalCards: cards.length,
      known,
      review,
      scorePercent,
    };

    const updatedScores = saveScore(newScore);
    setScoreHistory(updatedScores);
  }

  const sessionComplete = started && currentIndex >= cards.length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            AzureMind AI
          </h1>
          <p className="mt-3 text-slate-300">
            AI-901 Flashcard Certification Trainer
          </p>
        </header>

        {!started && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h2 className="mb-4 text-2xl font-semibold">
              Start a New Study Session
            </h2>

            <p className="mb-6 text-slate-300">
              Choose a domain and the number of random flashcards you want to study.
            </p>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Filter by Domain
              </label>

              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              >
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
              {[10, 20, 25, 50].map((size) => (
                <button
                  key={size}
                  onClick={() => setSessionSize(size)}
                  className={`rounded-xl px-5 py-3 font-medium ${
                    sessionSize === size
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {size} Cards
                </button>
              ))}
            </div>

            <button
              onClick={startSession}
              className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold hover:bg-blue-500"
            >
              Start Session
            </button>
          </section>
        )}

        {started && !sessionComplete && currentCard && (
          <>
            <div className="mb-4">
              <p className="text-sm text-slate-400">
                Card {currentIndex + 1} of {cards.length}
              </p>

              <div className="mt-2 h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Flashcard
              domain={currentCard.domain}
              category={currentCard.category}
              difficulty={currentCard.difficulty}
              question={currentCard.question}
              answer={currentCard.answer}
              showAnswer={showAnswer}
              onReveal={() => setShowAnswer(true)}
              onKnown={() => nextCard("known")}
              onReview={() => nextCard("review")}
            />
          </>
        )}

        {sessionComplete && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
            <h2 className="mb-4 text-3xl font-bold">
              {reviewMode ? "Review Session Complete" : "Session Complete"}
            </h2>

            <p className="mb-8 text-slate-300">
              Here is your study session summary.
            </p>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Total Cards</p>
                <p className="text-3xl font-bold">{cards.length}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Known</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {known}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Review Again</p>
                <p className="text-3xl font-bold text-amber-400">
                  {review}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {!reviewMode && missedCards.length > 0 && (
                <button
                  onClick={startMissedReview}
                  className="rounded-xl bg-amber-500 px-8 py-4 font-semibold text-slate-950 hover:bg-amber-400"
                >
                  Review Missed Cards ({missedCards.length})
                </button>
              )}

              <button
                onClick={handleSaveScore}
                className="rounded-xl bg-indigo-600 px-8 py-4 font-semibold hover:bg-indigo-500"
              >
                Save Score Locally
              </button>

	      <button
		  onClick={returnToMainMenu}
		  className="rounded-xl bg-slate-700 px-8 py-4 font-semibold hover:bg-slate-600"
		>
		  Return to Main Menu
		</button>	

              <button
                onClick={startSession}
                className="rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-500"
              >
                Start New Random Session
              </button>
            </div>

            {scoreHistory.length > 0 && (
              <div className="mt-8 text-left">
                <h3 className="mb-4 text-xl font-semibold">
                  Recent Local Scores
                </h3>

                <div className="space-y-3">
                  {scoreHistory.map((score) => (
                    <div
                      key={score.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <p className="font-semibold">
                        {score.scorePercent}%
                      </p>
                      <p className="text-sm text-slate-400">
                        {score.date} · {score.domain} · {score.known}/
                        {score.totalCards} known
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}