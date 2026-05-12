type FlashcardProps = {
  domain: string;
  category: string;
  difficulty: string;
  question: string;
  answer: string;
  showAnswer: boolean;
  onReveal: () => void;
  onKnown: () => void;
  onReview: () => void;
};

export default function Flashcard({
  domain,
  category,
  difficulty,
  question,
  answer,
  showAnswer,
  onReveal,
  onKnown,
  onReview,
}: FlashcardProps) {
  return (
    <section className="rounded-2xl bg-slate-900 p-8 shadow-xl border border-slate-800">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-blue-300">
            {domain} / {category}
          </p>
        </div>

        <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
          {difficulty}
        </span>
      </div>

      <div className="rounded-2xl bg-slate-950 p-8 border border-slate-800 min-h-[260px]">
        <p className="mb-3 text-sm uppercase tracking-wide text-slate-500">
          Question
        </p>

        <h2 className="text-2xl font-semibold leading-relaxed text-white">
          {question}
        </h2>

        {showAnswer && (
          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="mb-3 text-sm uppercase tracking-wide text-slate-500">
              Answer
            </p>

            <p className="text-lg leading-relaxed text-slate-200">
              {answer}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {!showAnswer ? (
          <button
            onClick={onReveal}
            className="flex-1 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-500"
          >
            Reveal Answer
          </button>
        ) : (
          <>
            <button
              onClick={onKnown}
              className="flex-1 rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white hover:bg-emerald-500"
            >
              Know It
            </button>

            <button
              onClick={onReview}
              className="flex-1 rounded-xl bg-amber-500 px-6 py-4 font-semibold text-slate-950 hover:bg-amber-400"
            >
              Review Again
            </button>
          </>
        )}
      </div>
    </section>
  );
}
