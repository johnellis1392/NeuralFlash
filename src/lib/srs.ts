/**
 * SuperMemo 2 (SM-2) algorithm for flashcards.
 * returns: { interval, easeFactor, reps, nextReview }
 */
export function calculateNextReview(
  quality: number, // 0-5
  currentInterval: number,
  currentEaseFactor: number,
  currentReps: number
) {
  let interval: number;
  let easeFactor: number;
  let reps: number;

  if (quality >= 3) {
    // Success
    if (currentReps === 0) {
      interval = 1;
    } else if (currentReps === 1) {
      interval = 6;
    } else {
      interval = Math.round(currentInterval * currentEaseFactor);
    }
    reps = currentReps + 1;
    // Ease Factor calculation
    easeFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    // Failure
    reps = 0;
    interval = 1;
    easeFactor = currentEaseFactor;
  }

  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    interval,
    easeFactor,
    reps,
    nextReview
  };
}

export const CATEGORIES = [
  "Foundations",
  "Classical ML",
  "Neural Networks: Core",
  "Optimization",
  "CNNs & Vision",
  "Transformers & Attention",
  "LLMs & Training",
  "RAG & Embeddings",
  "Evaluation & Systems",
  "Code/API Rapid Fire"
];
