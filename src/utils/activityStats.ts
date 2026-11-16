import type { Card } from "../types";

export interface ReviewLog {
  id: number;
  card_id: string;
  correct: boolean;
  created_at: string;
}

export interface DayActivity {
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // Вс, Пн, ...
  count: number;
  isToday: boolean;
}

export interface ActivityStats {
  streak: number;
  last7Days: DayActivity[];
  boxCounts: Record<number, number>;
  totalReviewed: number;
  accuracyPercent: number;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function calculateActivityStats(
  cards: Card[],
  reviews: ReviewLog[],
  now = new Date(),
): ActivityStats {
  // 1. Коробки берем из карточек текущего словаря
  const boxCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  cards.forEach((c) => {
    const box = Math.min(Math.max(c.box || 1, 1), 5);
    boxCounts[box] = (boxCounts[box] || 0) + 1;
  });

  // 2. Генерируем 7 последних дней
  const days: DayActivity[] = [];
  const reviewsByDay: Record<string, number> = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = DAY_NAMES[d.getDay()];

    days.push({
      dateStr,
      dayLabel,
      count: 0,
      isToday: i === 0,
    });
    reviewsByDay[dateStr] = 0;
  }

  // 3. Считаем повторения по таблице reviews
  let correctCount = 0;
  reviews.forEach((r) => {
    if (r.correct) correctCount++;
    const dateStr = r.created_at.split("T")[0];
    if (reviewsByDay[dateStr] !== undefined) {
      reviewsByDay[dateStr] += 1;
    }
  });

  days.forEach((day) => {
    day.count = reviewsByDay[day.dateStr] || 0;
  });

  // 4. Считаем стрик по уникальным дням занятий
  const activeDates = new Set<string>(
    reviews.map((r) => r.created_at.split("T")[0]),
  );
  let streak = 0;
  const checkDate = new Date(now);
  const todayStr = checkDate.toISOString().split("T")[0];

  if (!activeDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dStr = checkDate.toISOString().split("T")[0];
    if (activeDates.has(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const totalReviewed = reviews.length;
  const accuracyPercent =
    totalReviewed > 0 ? Math.round((correctCount / totalReviewed) * 100) : 100;

  return {
    streak,
    last7Days: days,
    boxCounts,
    totalReviewed,
    accuracyPercent,
  };
}
