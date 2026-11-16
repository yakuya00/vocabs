export type ExerciseStage = "ru_to_en" | "en_to_ru" | "typing";

const BOX_INTERVALS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 16,
  5: 35,
};

export function getStagesForCard(box: number): ExerciseStage[] {
  if (box <= 1) return ["ru_to_en", "typing"];
  if (box <= 3) return ["en_to_ru", "typing"];
  return ["typing"];
}

export function calculateNextReview(
  currentBox: number,
  hasFailed: boolean,
  baseDate = new Date(),
) {
  const nextBox = hasFailed ? 1 : Math.min(currentBox + 1, 5);
  const days = BOX_INTERVALS[nextBox] || 1;

  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + days);

  return {
    nextBox,
    nextReviewAt: nextDate.toISOString(),
  };
}

export function insertWithSpacing<T>(queue: T[], item: T, spacing = 3): T[] {
  const copy = [...queue];
  const insertIdx = Math.min(spacing, copy.length);
  copy.splice(insertIdx, 0, item);
  return copy;
}
