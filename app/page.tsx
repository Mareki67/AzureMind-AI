"use client";

import { useMemo, useState } from "react";
import flashcards from "../data/flashcards.json";
import Flashcard from "../components/Flashcard";
import { getRandomCards, type Flashcard as FlashcardType } from "../lib/randomizer";


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

  const allCards = flashcards as FlashcardType[];

  const domains = ["All", ...Array.from(new Set(allCards.map((card) => card.domain)))];

  const filteredCards =
  selectedDomain === "All"
    ? allCards
    : allCards.filter((card) => card.domain === selectedDomain);

  const currentCard = cards[currentIndex];

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
    setStarted(true);
    setMissedCards([]);
    setReviewMode(false);
  }

  function nextCard(result: "known" | "review") {
    if (result === "known") setKnown((prev) => prev + 1);
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


  const sessionComplete = started && currentIndex >= cards.length;

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
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
          <section className="rounded-2xl bg-slate-900 p-8 shadow-xl border border-slate-800">
            <h2 className="text-2xl font-semibold mb-4">
              Start a New Study Session
            </h2>

            <p className="text-slate-300 mb-6">
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



            <div className="flex flex-wrap gap-3 mb-8">
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
      )}

        {sessionComplete && (
          <section className="rounded-2xl bg-slate-900 p-8 shadow-xl border border-slate-800 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {reviewMode ? "Review Session Complete" : "Session Complete"}
            </h2>

            <p className="text-slate-300 mb-8">
              Here is your study session summary.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              <div className="rounded-xl bg-slate-950 p-5 border border-slate-800">
                <p className="text-sm text-slate-400">Total Cards</p>
                <p className="text-3xl font-bold">{cards.length}</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-5 border border-slate-800">
                <p className="text-sm text-slate-400">Known</p>
                <p className="text-3xl font-bold text-emerald-400">{known}</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-5 border border-slate-800">
                <p className="text-sm text-slate-400">Review Again</p>
                <p className="text-3xl font-bold text-amber-400">{review}</p>
              </div>
            </div>

	{!reviewMode && missedCards.length > 0 && (
	  <button
	    onClick={startMissedReview}
	    className="mb-4 rounded-xl bg-amber-500 px-8 py-4 font-semibold text-slate-950 hover:bg-amber-400"
	  >
	    Review Missed Cards ({missedCards.length})
	  </button>
	)}	

            <button
              onClick={startSession}
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-500"
            >
              Start New Random Session
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
